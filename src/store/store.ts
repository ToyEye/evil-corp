import { configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type PersistedState,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import { dummyUsers } from "../data/users.dummy";
import { authSlice } from "./auth/auth.slice";
import type { AuthState } from "./auth/auth.interface";
import { permissionsSlice } from "./permissions/permissions.slice";

const persistMigrations = {
  1: (state: PersistedState) => {
    if (!state || typeof state !== "object" || !("user" in state)) {
      return state;
    }

    const persisted = state as PersistedState & Partial<AuthState>;
    const user = persisted.user;

    if (!user || (user.companyName && user.companyId)) {
      return persisted;
    }

    const matched =
      dummyUsers.find((dummy) => dummy.id === user.id || dummy.email === user.email) ??
      dummyUsers[0];

    return {
      ...persisted,
      user: {
        ...matched,
        ...user,
        companyName: user.companyName ?? matched.companyName,
        companyId: user.companyId ?? matched.companyId,
      },
    };
  },
};

const persistConfig = {
  key: "auth",
  storage,
  version: 1,
  whitelist: ["user", "isAuthenticated"],
  migrate: createMigrate(persistMigrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    permissions: permissionsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

export const persistor = persistStore(store);
