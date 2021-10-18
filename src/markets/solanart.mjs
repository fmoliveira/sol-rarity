import fetch from "node-fetch";

export default async function (collection) {
  const marketData = await fetch(
    `https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${collection}`
  ).then((res) => res.json());

  const total = marketData.length;

  const listings = marketData.map((listingItem) => ({
    tokenId: listingItem.name.match(/\d+/)?.[0],
    name: listingItem.name,
    price: listingItem.price,
    attributes: listingItem.attributes
      .split(",")
      .reduce((list, item, index) => {
        const [key, value] = item.split(":");
        return {
          ...list,
          [key ?? index]: value ? value.trim() : item,
        };
      }, {}),
  }));

  return { total, listings };
}
