import { dummyCompanies } from "./companies.dummy";
import { dummyClients } from "./clients.dummy";
import { dummyInventoryItems } from "./inventory.dummy";
import { dummyUsers } from "./users.dummy";
import { deliveriesSchema, type Delivery } from "./deliveries.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;

const byId = <T extends { id: string }>(items: T[], id: string) => {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Missing record ${id}`);
  }

  return item;
};

const liam = byId(dummyUsers, "5");
const yuki = byId(dummyUsers, "10");
const marta = byId(dummyClients, "client-rr-1");
const james = byId(dummyClients, "client-rr-2");
const sofia = byId(dummyClients, "client-rr-3");
const elena = byId(dummyClients, "client-ps-1");
const tom = byId(dummyClients, "client-ps-2");
const pallet = byId(dummyInventoryItems, `${rapidRoute.id}-item-1`);
const tape = byId(dummyInventoryItems, `${rapidRoute.id}-item-3`);
const scanner = byId(dummyInventoryItems, `${rapidRoute.id}-item-8`);
const bin = byId(dummyInventoryItems, `${peakStorage.id}-item-2`);
const gloves = byId(dummyInventoryItems, `${peakStorage.id}-item-4`);
const carton = byId(dummyInventoryItems, `${peakStorage.id}-item-8`);

const dummyDeliveriesData: Delivery[] = [
  {
    id: "delivery-rr-1",
    number: "DLV-1001",
    clientId: marta.id,
    clientName: marta.name,
    driverId: liam.id,
    driverName: liam.name,
    addressId: marta.addresses[0].id,
    destination: marta.addresses[0].line,
    dispatchAt: "2026-09-08T07:30:00.000Z",
    deliverBy: "2026-09-08T11:00:00.000Z",
    notes: "Use dock 4. Ask for Marta if the gate is closed.",
    status: "Planned",
    items: [
      { productId: pallet.id, sku: pallet.sku, name: pallet.name, quantity: 12 },
      { productId: tape.id, sku: tape.sku, name: tape.name, quantity: 8 },
    ],
    reservesStock: false,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-07T15:10:00.000Z",
  },
  {
    id: "delivery-rr-2",
    number: "DLV-1002",
    clientId: james.id,
    clientName: james.name,
    driverId: liam.id,
    driverName: liam.name,
    addressId: james.addresses[0].id,
    destination: james.addresses[0].line,
    notes: "",
    status: "New",
    items: [{ productId: scanner.id, sku: scanner.sku, name: scanner.name, quantity: 2 }],
    reservesStock: false,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-08T08:40:00.000Z",
  },
  {
    id: "delivery-rr-3",
    number: "DLV-1003",
    clientId: sofia.id,
    clientName: sofia.name,
    driverId: liam.id,
    driverName: liam.name,
    addressId: sofia.addresses[1].id,
    destination: sofia.addresses[1].line,
    dispatchAt: "2026-09-08T06:00:00.000Z",
    deliverBy: "2026-09-08T09:30:00.000Z",
    notes: "Cold store B. Keep film on the pallets.",
    status: "In transit",
    items: [{ productId: pallet.id, sku: pallet.sku, name: pallet.name, quantity: 20 }],
    reservesStock: false,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-07T18:20:00.000Z",
  },
  {
    id: "delivery-ps-1",
    number: "DLV-2001",
    clientId: elena.id,
    clientName: elena.name,
    driverId: yuki.id,
    driverName: yuki.name,
    addressId: elena.addresses[0].id,
    destination: elena.addresses[0].line,
    dispatchAt: "2026-09-09T08:00:00.000Z",
    deliverBy: "2026-09-09T13:00:00.000Z",
    notes: "Peak escort required for the chilled hall.",
    status: "Planned",
    items: [{ productId: gloves.id, sku: gloves.sku, name: gloves.name, quantity: 6 }],
    reservesStock: false,
    companyId: peakStorage.id,
    companyName: peakStorage.name,
    createdAt: "2026-09-08T09:05:00.000Z",
  },
  {
    id: "delivery-ps-2",
    number: "DLV-2002",
    clientId: tom.id,
    clientName: tom.name,
    driverId: yuki.id,
    driverName: yuki.name,
    addressId: tom.addresses[0].id,
    destination: tom.addresses[0].line,
    notes: "North wall drop if nobody is at the dock.",
    status: "New",
    items: [
      { productId: bin.id, sku: bin.sku, name: bin.name, quantity: 10 },
      { productId: carton.id, sku: carton.sku, name: carton.name, quantity: 15 },
    ],
    reservesStock: false,
    companyId: peakStorage.id,
    companyName: peakStorage.name,
    createdAt: "2026-09-08T10:15:00.000Z",
  },
];

export const dummyDeliveries = deliveriesSchema.parse(dummyDeliveriesData);
