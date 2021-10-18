import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";

const collection = process.argv[2];

async function extractMarketRarity() {
  const query = encodeURIComponent(
    JSON.stringify({
      $match: { collectionSymbol: collection },
      $sort: { takerAmount: 1, createdAt: -1 },
      $skip: 0,
      $limit: 20,
    })
  );
  const marketData = await fetch(
    `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=${query}`
  ).then((res) => res.json());

  const listings = marketData.results.map((bae) => ({
    tokenId: bae.title.match(/\d+/)?.[0],
    name: bae.title,
    price: bae.price,
    attributes: bae.attributes.reduce((list, item, index) => {
      const { trait_type: key, value } = item;
      return {
        ...list,
        [key ?? index]: value ? value.trim() : item,
      };
    }, {}),
  }));

  const traits = {};
  listings.forEach((bae) => {
    Object.keys(bae.attributes).forEach((key) => {
      if (!traits[key]) {
        traits[key] = {};
      }

      const value = bae.attributes[key];
      if (!traits[key][value]) {
        traits[key][value] = 0;
      }

      traits[key][value]++;
    });
  });

  function calculateRarity(bae) {
    const traitRarities = {};
    const traitSupplies = {};
    let totalRarity = 0;
    Object.keys(bae.attributes).map((key) => {
      const value = bae.attributes[key];
      const supply = traits[key][value];

      const rarity = supply / marketData.results.length;
      traitSupplies[key] = supply;
      traitRarities[key] = rarity;
      totalRarity += rarity;
    });
    const rarityScore = 1 / totalRarity;
    const averageSupply =
      Object.values(traitSupplies).reduce((acc, n) => acc + n, 0) /
      Object.keys(traitSupplies).length;

    return {
      rarityScore,
      totalRarity,
      traitRarities,
      traitSupplies,
      averageSupply,
    };
  }

  const rarities = listings
    .map((bae) => ({
      ...bae,
      rarity: calculateRarity(bae),
    }))
    .sort((a, b) => b.rarity.rarityScore - a.rarity.rarityScore)
    // .sort((a, b) => a.price - b.price)
    // .filter((i) => i.price <= 2)
    .map(({ tokenId, name, price, rarity, attributes }) => ({
      tokenId,
      name,
      price,
      rarityScore: Number.parseFloat((rarity.rarityScore * 100).toFixed(1)),
      // attributes: Object.values(attributes),
    }));

  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }

  const filename = `./output/${collection}-magiceden.json`;
  fs.writeFileSync(filename, JSON.stringify(rarities));
  exec(`npx prettier -w ${filename}`);
}

extractMarketRarity();
