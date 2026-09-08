import { dummyInventoryItems } from "./inventory.dummy";
import { restockRequestsSchema, type RestockRequest } from "./restock.schema";
import { dummyUsers } from "./users.dummy";

const sofia = dummyUsers.find((user) => user.id === "6");
const nina = dummyUsers.find((user) => user.id === "11");

if (!sofia || !nina) {
  throw new Error("Storekeeper users are missing");
}

const bySku = (sku: string) => {
  const item = dummyInventoryItems.find((product) => product.sku === sku);

  if (!item) {
    throw new Error(`Inventory item ${sku} is missing`);
  }

  return item;
};

const scanner = bySku("RR-SCN-001");
const palletJack = bySku("RR-JCK-006");
const euroPallet = bySku("RR-PAL-001");
const wearableScanner = bySku("PS-SCN-003");
const rackBeam = bySku("PS-RCK-001");

const dummyRestockData: RestockRequest[] = [
  {
    id: "restock-1",
    productId: scanner.id,
    sku: scanner.sku,
    productName: scanner.name,
    quantity: 20,
    note: "Two docks are down to spare units only.",
    requestedById: sofia.id,
    requestedByName: sofia.name,
    companyId: sofia.companyId,
    companyName: sofia.companyName,
    createdAt: "2026-09-06T08:15:00.000Z",
  },
  {
    id: "restock-2",
    productId: palletJack.id,
    sku: palletJack.sku,
    productName: palletJack.name,
    quantity: 4,
    note: "Need extras before the weekend inbound wave.",
    requestedById: sofia.id,
    requestedByName: sofia.name,
    companyId: sofia.companyId,
    companyName: sofia.companyName,
    createdAt: "2026-09-07T11:40:00.000Z",
  },
  {
    id: "restock-3",
    productId: euroPallet.id,
    sku: euroPallet.sku,
    productName: euroPallet.name,
    quantity: 80,
    note: "Stock is still healthy; topping up for a large outbound contract.",
    requestedById: sofia.id,
    requestedByName: sofia.name,
    companyId: sofia.companyId,
    companyName: sofia.companyName,
    createdAt: "2026-09-08T07:05:00.000Z",
  },
  {
    id: "restock-4",
    productId: wearableScanner.id,
    sku: wearableScanner.sku,
    productName: wearableScanner.name,
    quantity: 12,
    note: "Pick team is sharing units on the night shift.",
    requestedById: nina.id,
    requestedByName: nina.name,
    companyId: nina.companyId,
    companyName: nina.companyName,
    createdAt: "2026-09-05T14:20:00.000Z",
  },
  {
    id: "restock-5",
    productId: rackBeam.id,
    sku: rackBeam.sku,
    productName: rackBeam.name,
    quantity: 10,
    note: "",
    requestedById: nina.id,
    requestedByName: nina.name,
    companyId: nina.companyId,
    companyName: nina.companyName,
    createdAt: "2026-09-08T06:50:00.000Z",
  },
];

export const dummyRestockRequests = restockRequestsSchema.parse(dummyRestockData);
