import { getDeliveryLoad, isDeliveryTerminal, type Delivery } from "./deliveries.schema";
import type { Vehicle } from "./vehicles.schema";

export const getVehicleUsedUnits = (vehicleId: string, deliveries: Delivery[]) =>
  deliveries
    .filter((item) => item.vehicleId === vehicleId && !isDeliveryTerminal(item.status))
    .reduce((total, item) => total + getDeliveryLoad(item), 0);

export const getVehicleRemainingUnits = (
  vehicle: Vehicle,
  deliveries: Delivery[],
  ignoreDeliveryIds: string[] = [],
) => {
  const ignored = new Set(ignoreDeliveryIds);
  const used = deliveries
    .filter(
      (item) =>
        item.vehicleId === vehicle.id &&
        !isDeliveryTerminal(item.status) &&
        !ignored.has(item.id),
    )
    .reduce((total, item) => total + getDeliveryLoad(item), 0);

  return vehicle.maxUnits - used;
};
