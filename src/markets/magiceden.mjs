import fetch from "node-fetch";

export default async function (collection) {
  const query = encodeURIComponent(
    JSON.stringify({
      $match: { collectionSymbol: collection },
      $sort: { takerAmount: 1, createdAt: -1 },
      $skip: 0,
      $limit: 2000,
    })
  );
  const marketData = await fetch(
    `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=${query}`
  ).then((res) => res.json());

  const total = marketData.results.length;

  const listings = marketData.results.map((listingItem) => ({
    tokenId: listingItem.title.match(/\d+/)?.[0],
    name: listingItem.title,
    price: listingItem.price,
    attributes: listingItem.attributes.reduce((list, item, index) => {
      const { trait_type: key, value } = item;
      return {
        ...list,
        [key ?? index]: value ? value.trim() : item,
      };
    }, {}),
  }));

  return { total, listings };
}
