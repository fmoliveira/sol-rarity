import fetch from "node-fetch";

export default async function (collection) {
  const marketData = await fetchMarketData(collection);

  const total = marketData.length;

  const listings = marketData.map((listingItem) => ({
    tokenId: listingItem.title.match(/\d+/)?.[0],
    name: listingItem.title,
    price: parseFloat(listingItem.price, 10) / 1000000000,
    attributes: {},
  }));

  return { total, listings };
}

function fetchMarketData(collectionName) {
  return new Promise(async (resolve) => {
    const marketData = [];
    let payload = {
      collectionId: collectionName,
      orderBy: "PRICE_LOW_TO_HIGH",
      status: ["BUY_NOW"],
      traits: [],
    };

    while (payload.collectionId || payload.token) {
      const response = await fetch("https://apis.alpha.art/api/v1/collection", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.json());

      marketData.push(...response.tokens);
      payload = { token: response.nextPage };
    }

    resolve(marketData);
  });
}
