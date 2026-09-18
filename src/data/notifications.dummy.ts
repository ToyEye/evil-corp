import { dummyCompanies } from "./companies.dummy";
import { dummyDeliveries } from "./deliveries.dummy";
import { dummyUsers } from "./users.dummy";
import { notificationsSchema, type AppNotification } from "./notifications.schema";
import { paths } from "../routing/routes";

const [vertexCapital, rapidRoute] = dummyCompanies;
const liam = dummyUsers.find((user) => user.id === "5");
const deliveryRr1 = dummyDeliveries.find((item) => item.number === "DLV-1001");
const deliveryRr3 = dummyDeliveries.find((item) => item.number === "DLV-1003");

if (!liam || !deliveryRr1 || !deliveryRr3) {
  throw new Error("Notification seed records are missing");
}

const dummyNotificationsData: AppNotification[] = [
  {
    id: "notice-1",
    companyId: rapidRoute.id,
    recipientUserId: liam.id,
    title: "New trip assigned",
    body: `${deliveryRr1.number} to ${deliveryRr1.clientName}`,
    href: paths.deliveries(rapidRoute.name),
    read: false,
    createdAt: deliveryRr1.createdAt,
  },
  {
    id: "notice-2",
    companyId: rapidRoute.id,
    recipientRole: "SEO",
    title: "Delivery is overdue",
    body: `${deliveryRr3.number} is still in transit past its ETA`,
    href: paths.deliveries(rapidRoute.name),
    read: false,
    createdAt: "2026-09-08T12:00:00.000Z",
  },
  {
    id: "notice-3",
    companyId: rapidRoute.id,
    recipientRole: "Storekeeper",
    title: "Goods waiting at the dock",
    body: "Pallet jack restock is ready to receive into the warehouse",
    href: paths.warehouse(rapidRoute.name),
    read: false,
    createdAt: "2026-09-09T09:05:00.000Z",
  },
  {
    id: "notice-4",
    companyId: vertexCapital.id,
    recipientRole: "Support",
    title: "Support: Peak Storage",
    body: "Priya Nair: Peak Storage paid the last invoice, but warehouse still shows the order waiting for stock.",
    href: `${paths.support(vertexCapital.name)}?thread=support-thread-2`,
    read: false,
    createdAt: "2026-09-17T08:40:00.000Z",
  },
];

export const dummyNotifications = notificationsSchema.parse(dummyNotificationsData);
