import { dummyCompanies } from "./companies.dummy";
import { dummyDeliveries } from "./deliveries.dummy";
import { dummyOrders } from "./orders.dummy";
import { dummyRestockRequests } from "./restock.dummy";
import { dummyUsers } from "./users.dummy";
import { activityEventsSchema, type ActivityEvent } from "./activity.schema";

const [, rapidRoute] = dummyCompanies;
const owen = dummyUsers.find((user) => user.id === "9");
const maya = dummyUsers.find((user) => user.id === "8");
const liam = dummyUsers.find((user) => user.id === "5");
const harper = dummyUsers.find((user) => user.id === "15");

if (!owen || !maya || !liam || !harper) {
  throw new Error("Activity actors are missing");
}

const orderRr1 = dummyOrders.find((order) => order.number === "ORD-1001");
const orderRr2 = dummyOrders.find((order) => order.number === "ORD-1002");
const deliveryRr1 = dummyDeliveries.find((item) => item.number === "DLV-1001");
const deliveryRr3 = dummyDeliveries.find((item) => item.number === "DLV-1003");
const restock2 = dummyRestockRequests.find((item) => item.id === "restock-2");

if (!orderRr1 || !orderRr2 || !deliveryRr1 || !deliveryRr3 || !restock2) {
  throw new Error("Activity seed records are missing");
}

const dummyActivityData: ActivityEvent[] = [
  {
    id: "activity-1",
    companyId: rapidRoute.id,
    entityType: "order",
    entityId: orderRr1.id,
    entityNumber: orderRr1.number,
    message: "Order created",
    actorId: owen.id,
    actorName: owen.name,
    createdAt: orderRr1.createdAt,
  },
  {
    id: "activity-2",
    companyId: rapidRoute.id,
    entityType: "order",
    entityId: orderRr2.id,
    entityNumber: orderRr2.number,
    message: "Order created with a stock shortage",
    actorId: owen.id,
    actorName: owen.name,
    createdAt: orderRr2.createdAt,
  },
  {
    id: "activity-3",
    companyId: rapidRoute.id,
    entityType: "order",
    entityId: orderRr2.id,
    entityNumber: orderRr2.number,
    message: "Marked as paid",
    actorId: maya.id,
    actorName: maya.name,
    createdAt: "2026-09-08T10:15:00.000Z",
  },
  {
    id: "activity-4",
    companyId: rapidRoute.id,
    entityType: "delivery",
    entityId: deliveryRr1.id,
    entityNumber: deliveryRr1.number,
    message: `Scheduled for ${liam.name}`,
    actorId: owen.id,
    actorName: owen.name,
    createdAt: deliveryRr1.createdAt,
  },
  {
    id: "activity-5",
    companyId: rapidRoute.id,
    entityType: "delivery",
    entityId: deliveryRr3.id,
    entityNumber: deliveryRr3.number,
    message: "Marked in transit, stock written off",
    actorId: liam.id,
    actorName: liam.name,
    createdAt: deliveryRr3.shippedAt ?? deliveryRr3.createdAt,
  },
  {
    id: "activity-6",
    companyId: rapidRoute.id,
    entityType: "restock",
    entityId: restock2.id,
    entityNumber: restock2.sku,
    message: "Supplier delivery arrived at the dock",
    actorId: harper.id,
    actorName: harper.name,
    createdAt: "2026-09-09T09:00:00.000Z",
  },
];

export const dummyActivityEvents = activityEventsSchema.parse(dummyActivityData);
