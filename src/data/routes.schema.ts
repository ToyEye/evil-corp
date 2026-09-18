import { z } from "zod";

export const routeSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1),
  driverId: z.string().min(1),
  driverName: z.string().min(1),
  vehicleId: z.string().min(1),
  vehicleName: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const routesSchema = z.array(routeSchema);

export type DispatchRoute = z.infer<typeof routeSchema>;
