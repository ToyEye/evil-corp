import type { User as SchemaUser } from "../../data/users.schema";

export type User = SchemaUser;

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profiles: Record<string, Pick<User, "name" | "email" | "avatarUrl">>;
}
