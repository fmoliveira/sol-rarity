# Sol Rarity

> Disclaimer: Work in progress, very early stage.

Find NFTs in Solana market listings and sort them by market-relative rarity.

The market-relative rarity means that the rarity scores are only relative to the items currently on the market for sale. This means that this score is dynamic and will change based on what items are listed for sale.

This script basically helps you find the rarest listings currently on the market, which are not necessarily the rarest items in that given collection.

The rarity formula is based off the original [Rarity Tools](https://rarity.tools/) formula published on the article [Ranking Rarity: Understanding Rarity Calculation Methods](https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c).

## Requirements

- Node.js 14+

## Getting started

Install dependencies with `yarn` or `npm install` and you'll be ready to go.

## Usage

```
node src/index.mjs <marketName> <collectionName>
```

Examples:

- Get listings from Solanart: `node src/index.mjs solanart gloompunk`
- Get listings from Magic Eden: `node src/index.mjs magiceden gloom_punk_club`

Please note that the collection name is not guaranteed to be the same across different marketplaces.

To figure that out, go to the collection on the desired marketplace and look for the collection name in the URL.

- On Solanart, the URL looks like https://solanart.io/collections/gloompunk and the collection name is the last part of the URL after `collections/`
- On Magic Eden, the URL looks like https://magiceden.io/marketplace/gloom_punk_club and the collection name is the last part of the URL after `marketplace/`
