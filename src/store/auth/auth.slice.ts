import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CompanyType } from "../../data/companies.schema";
import { decodeAccessToken } from "../../utils/jwt";
import type { AuthState, LoginResponse, User } from "./auth.interface";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const withCompanyType = (user: User, token: string | null): User => {
  if (user.companyType || !token) {
    return user;
  }

  const payload = decodeAccessToken(token);
  if (!payload?.companyType) {
    return user;
  }

  return {
    ...user,
    companyType: payload.companyType as CompanyType,
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user, token } = action.payload;
      state.user = withCompanyType(user, token);
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = withCompanyType(action.payload, state.token);
      state.isAuthenticated = true;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) {
        return;
      }

      state.user = withCompanyType(
        { ...state.user, ...action.payload },
        state.token,
      );
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectToken: (state) => state.token,
    selectUserRole: (state) => state.user?.role ?? null,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated,
  },
});

export default authSlice.reducer;

export const {
  setCredentials,
  setUser,
  updateCurrentUser,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

export const {
  selectUser,
  selectToken,
  selectUserRole,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} = authSlice.selectors;
