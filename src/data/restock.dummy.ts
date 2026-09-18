import { dummyInventoryItems } from "./inventory.dummy";
import { dummyOrders } from "./orders.dummy";
import { restockRequestsSchema, type RestockRequest } from "./restock.schema";
import { dummyUsers } from "./users.dummy";

const sofia = dummyUsers.find((user) => user.id === "6");
const nina = dummyUsers.find((user) => user.id === "11");
const owen = dummyUsers.find((user) => user.id === "9");

if (!sofia || !nina || !owen) {
  throw new Error("Storekeeper or staff users are missing");
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
const scannerOrder = dummyOrders.find((order) => order.number === "ORD-1002");

if (!scannerOrder) {
  throw new Error("Order ORD-1002 is missing");
}

const dummyRestockData: RestockRequest[] = [
  {
    id: "restock-1",
    productId: scanner.id,
    sku: scanner.sku,
    productName: scanner.name,
    quantity: 20,
    note: "Two docks are down to spare units only.",
    status: "New",
    purposes: ["warehouse"],
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
    status: "Delivered",
    purposes: ["warehouse"],
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
    status: "New",
    purposes: ["warehouse"],
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
    status: "New",
    purposes: ["warehouse"],
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
    status: "New",
    purposes: ["warehouse"],
    requestedById: nina.id,
    requestedByName: nina.name,
    companyId: nina.companyId,
    companyName: nina.companyName,
    createdAt: "2026-09-08T06:50:00.000Z",
  },
  {
    id: "restock-6",
    productId: scanner.id,
    sku: scanner.sku,
    productName: scanner.name,
    quantity: 9,
    note: `Shortage for ${scannerOrder.number}`,
    status: "New",
    purposes: ["order"],
    orderId: scannerOrder.id,
    orderNumber: scannerOrder.number,
    requestedById: owen.id,
    requestedByName: owen.name,
    companyId: owen.companyId,
    companyName: owen.companyName,
    createdAt: "2026-09-08T08:42:00.000Z",
  },
];

export const dummyRestockRequests = restockRequestsSchema.parse(dummyRestockData);
