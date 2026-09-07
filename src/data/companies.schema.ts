import { z } from "zod";

export const COMPANY_TYPES = ["platform", "client"] as const;

export const companyTypeSchema = z.enum(COMPANY_TYPES);

export const companySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: companyTypeSchema,
});

export const companiesSchema = z
  .array(companySchema)
  .min(1)
  .refine(
    (companies) => new Set(companies.map((company) => company.id)).size === companies.length,
    { message: "Company ids must be unique" },
  )
  .refine(
    (companies) => new Set(companies.map((company) => company.name)).size === companies.length,
    { message: "Company names must be unique" },
  )
  .refine(
    (companies) => companies.filter((company) => company.type === "platform").length === 1,
    { message: "There must be exactly one platform company" },
  );

export type CompanyType = z.infer<typeof companyTypeSchema>;
export type Company = z.infer<typeof companySchema>;
