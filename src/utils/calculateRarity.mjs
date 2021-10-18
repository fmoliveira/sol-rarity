export default function (listingItem, traits, totalSupply) {
  const traitRarities = {};
  const traitSupplies = {};
  let totalRarity = 0;
  Object.keys(listingItem.attributes).map((key) => {
    const value = listingItem.attributes[key];
    const supply = traits[key][value];

    const rarity = supply / totalSupply;
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
