import { companiesSchema, type Company } from "./companies.schema";

const dummyCompaniesData: Company[] = [
  { id: "company-1", name: "Vertex Capital", type: "platform" },
  {
    id: "company-2",
    name: "RapidRoute Logistics",
    type: "client",
    depotLat: 47.4812,
    depotLng: 19.1303,
  },
  {
    id: "company-3",
    name: "Peak Storage",
    type: "client",
    depotLat: 44.4949,
    depotLng: 11.3426,
  },
];

/** Seed / reference data only — live app helpers live in `utils/companyAccess`. */
export const dummyCompanies = companiesSchema.parse(dummyCompaniesData);
