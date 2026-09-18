import { z } from "zod";

export const VEHICLE_TYPES = ["Van", "Truck", "Reefer"] as const;

export const vehicleTypeSchema = z.enum(VEHICLE_TYPES);

export const vehicleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  plate: z.string().min(1),
  type: vehicleTypeSchema,
  maxUnits: z.number().int().positive(),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
});

export const vehiclesSchema = z.array(vehicleSchema);

export type VehicleType = z.infer<typeof vehicleTypeSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
