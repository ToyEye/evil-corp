import { dummyCompanies } from "./companies.dummy";
import { vehiclesSchema, type Vehicle } from "./vehicles.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;

const dummyVehiclesData: Vehicle[] = [
  {
    id: "vehicle-rr-1",
    name: "City van 01",
    plate: "RR-VAN-01",
    type: "Van",
    maxUnits: 25,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
  },
  {
    id: "vehicle-rr-2",
    name: "Box truck 04",
    plate: "RR-TRK-04",
    type: "Truck",
    maxUnits: 80,
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
  },
  {
    id: "vehicle-ps-1",
    name: "Reefer 02",
    plate: "PS-REF-02",
    type: "Reefer",
    maxUnits: 40,
    companyId: peakStorage.id,
    companyName: peakStorage.name,
  },
  {
    id: "vehicle-ps-2",
    name: "Dock van 01",
    plate: "PS-VAN-01",
    type: "Van",
    maxUnits: 20,
    companyId: peakStorage.id,
    companyName: peakStorage.name,
  },
];

export const dummyVehicles = vehiclesSchema.parse(dummyVehiclesData);
