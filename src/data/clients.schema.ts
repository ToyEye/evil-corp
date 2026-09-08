import { z } from "zod";

export const clientAddressSchema = z.object({
  id: z.string().min(1),
  line: z.string().min(1),
});

export const clientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  addedAt: z.string().min(1),
  note: z.string(),
  addresses: z.array(clientAddressSchema),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
});

export const clientsSchema = z.array(clientSchema);

export type ClientAddress = z.infer<typeof clientAddressSchema>;
export type Client = z.infer<typeof clientSchema>;
