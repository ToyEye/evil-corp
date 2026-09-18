import { dummyCompanies } from "./companies.dummy";
import { dummyClients } from "./clients.dummy";
import { dummyInventoryItems } from "./inventory.dummy";
import { ordersSchema, type Order } from "./orders.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;

const byId = <T extends { id: string }>(items: T[], id: string) => {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Missing record ${id}`);
  }

  return item;
};

const marta = byId(dummyClients, "client-rr-1");
const james = byId(dummyClients, "client-rr-2");
const elena = byId(dummyClients, "client-ps-1");
const pallet = byId(dummyInventoryItems, `${rapidRoute.id}-item-1`);
const tape = byId(dummyInventoryItems, `${rapidRoute.id}-item-3`);
const scanner = byId(dummyInventoryItems, `${rapidRoute.id}-item-8`);
const gloves = byId(dummyInventoryItems, `${peakStorage.id}-item-4`);

const dummyOrdersData: Order[] = [
  {
    id: "order-rr-1",
    number: "ORD-1001",
    clientId: marta.id,
    clientName: marta.name,
    addressId: marta.addresses[0].id,
    destination: marta.addresses[0].line,
    notes: "Use dock 4. Ask for Marta if the gate is closed.",
    status: "New",
    fulfillmentStatus: "Ready",
    items: [
      {
        productId: pallet.id,
        sku: pallet.sku,
        name: pallet.name,
        quantity: 12,
        unitPrice: pallet.price,
        reservedQuantity: 12,
        pickedQuantity: 12,
      },
      {
        productId: tape.id,
        sku: tape.sku,
        name: tape.name,
        quantity: 8,
        unitPrice: tape.price,
        reservedQuantity: 8,
        pickedQuantity: 8,
      },
    ],
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-07T15:10:00.000Z",
  },
  {
    id: "order-rr-2",
    number: "ORD-1002",
    clientId: james.id,
    clientName: james.name,
    addressId: james.addresses[0].id,
    destination: james.addresses[0].line,
    notes: "Waiting for remaining scanners from supply.",
    status: "Paid",
    fulfillmentStatus: "Waiting",
    items: [
      {
        productId: scanner.id,
        sku: scanner.sku,
        name: scanner.name,
        quantity: 20,
        unitPrice: scanner.price,
        reservedQuantity: 11,
        pickedQuantity: 0,
      },
    ],
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-08T08:40:00.000Z",
  },
  {
    id: "order-ps-1",
    number: "ORD-2001",
    clientId: elena.id,
    clientName: elena.name,
    addressId: elena.addresses[0].id,
    destination: elena.addresses[0].line,
    notes: "Peak escort required for the chilled hall.",
    status: "Paid",
    fulfillmentStatus: "Reserved",
    items: [
      {
        productId: gloves.id,
        sku: gloves.sku,
        name: gloves.name,
        quantity: 6,
        unitPrice: gloves.price,
        reservedQuantity: 6,
        pickedQuantity: 0,
      },
    ],
    companyId: peakStorage.id,
    companyName: peakStorage.name,
    createdAt: "2026-09-08T09:05:00.000Z",
  },
];

export const dummyOrders = ordersSchema.parse(dummyOrdersData);
