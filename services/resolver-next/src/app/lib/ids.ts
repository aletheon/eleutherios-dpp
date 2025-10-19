// app/lib/ids.ts
export const toProductDocId = (gtin: string, serial: string) =>
  `${gtin}_${serial}`;

export const fromProductId = (productId: string) => {
  const [gtin, serial] = productId.split("_");
  return { gtin, serial, productDocId: toProductDocId(gtin, serial) };
};
