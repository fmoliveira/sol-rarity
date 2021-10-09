import fs from "fs";
import fetch from "node-fetch";

const collection = process.argv[2];

async function extractMarketRarity() {
  const marketData = await fetch(
    `https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${collection}`
  ).then((res) => res.json());

  const listings = marketData.map((bae) => ({
    tokenId: bae.name.match(/\d+/)?.[0],
    price: bae.price,
    attributes: bae.attributes.split(",").reduce((list, item, index) => {
      const [key, value] = item.split(":");
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

      const rarity = supply / marketData.length;
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
    // .filter((i) => i.price <= 2)
    .map(({ tokenId, price, rarity, attributes }) => ({
      tokenId,
      price,
      rarityScore: Number.parseFloat((rarity.rarityScore * 100).toFixed(1)),
      // attributes: Object.values(attributes),
    }));

  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }

  fs.writeFileSync(`./output/${collection}.json`, JSON.stringify(rarities));
}

extractMarketRarity();
