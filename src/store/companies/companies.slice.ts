import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyCompanies } from "../../data/companies.dummy";
import type { Company } from "../../data/companies.schema";

type CompaniesState = {
  items: Company[];
};

type UpdateCompanyPayload = {
  id: string;
  name?: string;
  iconUrl?: string;
};

const initialState: CompaniesState = {
  items: dummyCompanies,
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    updateCompany: (state, action: PayloadAction<UpdateCompanyPayload>) => {
      const company = state.items.find((item) => item.id === action.payload.id);

      if (!company) {
        return;
      }

      if (action.payload.name) {
        company.name = action.payload.name;
      }

      if (action.payload.iconUrl !== undefined) {
        company.iconUrl = action.payload.iconUrl;
      }
    },
  },
  selectors: {
    selectCompanies: (state) => state.items,
  },
});

export const { updateCompany } = companiesSlice.actions;

export const { selectCompanies } = companiesSlice.selectors;

export const selectCompanyById = (companyId: string | undefined) => (state: { companies: CompaniesState }) =>
  state.companies.items.find((company) => company.id === companyId);

export default companiesSlice.reducer;
