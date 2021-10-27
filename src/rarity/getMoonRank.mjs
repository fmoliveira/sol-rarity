// https://moonrank.app/mints/goape?after=0&seen=800&complete=true
import fetch from "node-fetch";

export default async function (collection) {
  if (!collection) {
    return null;
  }

  const rarityData = await fetch(
    `https://moonrank.app/mints/${collection}`
  ).then((res) => res.json());

  const listings = rarityData.mints
    .map((listingItem) => ({
      tokenId: listingItem.name.match(/\d+/)?.[0],
      name: listingItem.name,
      rank: listingItem.rank,
    }))
    .reduce(
      (ranks, listingItem) => ({
        ...ranks,
        [listingItem.tokenId]: listingItem.rank,
      }),
      {}
    );

  return listings;
}
