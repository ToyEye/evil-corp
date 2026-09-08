import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dummyUsers } from "../../data/users.dummy";
import { login } from "./auth.operations";
import type { AuthState, User } from "./auth.interface";

const toSavedProfile = (user: User) => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
});

const initialState: AuthState = {
  user: dummyUsers[4],
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: true,
  profiles: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPreviewUser: (state, action: PayloadAction<User>) => {
      const saved = state.profiles[action.payload.id];
      state.user = saved ? { ...action.payload, ...saved } : action.payload;
      state.isAuthenticated = true;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) {
        return;
      }

      state.user = { ...state.user, ...action.payload };
      state.profiles[state.user.id] = toSavedProfile(state.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    }),

  selectors: {
    selectUser: (state) => state.user,
    selectUserRole: (state) => state.user?.role ?? null,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated,
  },
});

export default authSlice.reducer;

export const { setPreviewUser, updateCurrentUser, logout } = authSlice.actions;

export const {
  selectUser,
  selectUserRole,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} = authSlice.selectors;
