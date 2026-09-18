import type { CompanyType } from "../../data/companies.schema";
import type { User as SchemaUser } from "../../data/users.schema";

export type User = SchemaUser & {
  companyType?: CompanyType;
};

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type LoginResponse = {
  user: SchemaUser;
  token: string;
};
