import markets from "./markets/index.mjs";
import countTraits from "./utils/countTraits.mjs";
import calculateRarity from "./utils/calculateRarity.mjs";
import exportResults from "./utils/exportResults.mjs";

const marketName = process.argv[2];
const collectionName = process.argv[3];

if (!Object.keys(markets).includes(marketName)) {
  throw new Error("Marketplace not supported!");
}

if (!collectionName) {
  throw new Error("Enter collection name");
}

async function extractMarketRarity() {
  const marketQuery = markets[marketName];
  const { total, listings } = await marketQuery(collectionName);

  const traits = countTraits(listings);

  // WARNING: these rarities are relative to the items available in the marketplace
  const rarities = listings
    .map((listingItem) => ({
      ...listingItem,
      rarity: calculateRarity(listingItem, traits, total),
    }))
    .sort((a, b) => b.rarity.rarityScore - a.rarity.rarityScore)
    .map(({ tokenId, name, price, rarity }) => ({
      tokenId,
      name,
      price,
      rarityScore: Number.parseFloat((rarity.rarityScore * 100).toFixed(1)),
    }));

  exportResults(collectionName, marketName, rarities);
}

extractMarketRarity();
