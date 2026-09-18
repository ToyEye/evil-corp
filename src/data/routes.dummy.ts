import { dummyCompanies } from "./companies.dummy";
import { dummyUsers } from "./users.dummy";
import { dummyVehicles } from "./vehicles.dummy";
import { routesSchema, type DispatchRoute } from "./routes.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;
const liam = dummyUsers.find((user) => user.id === "5");
const yuki = dummyUsers.find((user) => user.id === "10");
const van = dummyVehicles.find((item) => item.id === "vehicle-rr-1");
const reefer = dummyVehicles.find((item) => item.id === "vehicle-ps-1");

if (!liam || !yuki || !van || !reefer) {
  throw new Error("Route seed records are missing");
}

const dummyRoutesData: DispatchRoute[] = [
  {
    id: "route-rr-1",
    number: "RT-1001",
    driverId: liam.id,
    driverName: liam.name,
    vehicleId: van.id,
    vehicleName: `${van.plate} · ${van.name}`,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    createdAt: "2026-09-07T16:00:00.000Z",
  },
  {
    id: "route-ps-1",
    number: "RT-2001",
    driverId: yuki.id,
    driverName: yuki.name,
    vehicleId: reefer.id,
    vehicleName: `${reefer.plate} · ${reefer.name}`,
    companyId: peakStorage.id,
    companyName: peakStorage.name,
    createdAt: "2026-09-08T09:20:00.000Z",
  },
];

export const dummyDispatchRoutes = routesSchema.parse(dummyRoutesData);
