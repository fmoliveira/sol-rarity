import markets from "./markets/index.mjs";
import getMoonRank from "./rarity/getMoonRank.mjs";
import countTraits from "./utils/countTraits.mjs";
import calculateRarity from "./utils/calculateRarity.mjs";
import exportResults from "./utils/exportResults.mjs";

const marketName = process.argv[2];
const collectionName = process.argv[3];
const moonRankName = process.argv[4];
const floorPrice = process.argv[5];

if (!Object.keys(markets).includes(marketName)) {
  throw new Error("Marketplace not supported!");
}

if (!collectionName) {
  throw new Error("Enter collection name");
}

async function extractMarketRarity() {
  const marketQuery = markets[marketName];
  const { total, listings } = await marketQuery(collectionName);
  const moonRanks = await getMoonRank(moonRankName);

  const traits = countTraits(listings);

  // WARNING: these rarities are relative to the items available in the marketplace
  const rarities = listings
    .map((listingItem) => ({
      ...listingItem,
      rarity: calculateRarity(listingItem, traits, total),
    }))
    .filter((i) => !floorPrice || i.price < parseFloat(floorPrice, 10))
    .sort((a, b) => b.rarity.rarityScore - a.rarity.rarityScore)
    .map(({ tokenId, name, price, rarity }) => ({
      tokenId,
      name,
      price,
      rarityScore: Number.parseFloat((rarity.rarityScore * 100).toFixed(1)),
      moonRank: moonRanks?.[tokenId],
    }))
    .sort((a, b) => (moonRanks ? a.moonRank - b.moonRank : 1));

  exportResults(collectionName, marketName, rarities);
}

extractMarketRarity();
