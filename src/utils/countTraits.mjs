export default function (listings) {
  const traits = {};

  listings.forEach((listingItem) => {
    Object.keys(listingItem.attributes).forEach((key) => {
      if (!traits[key]) {
        traits[key] = {};
      }

      const value = listingItem.attributes[key];
      if (!traits[key][value]) {
        traits[key][value] = 0;
      }

      traits[key][value]++;
    });
  });

  return traits;
}
