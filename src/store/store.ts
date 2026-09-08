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
import { inventorySlice } from "./inventory/inventory.slice";
import { permissionsSlice } from "./permissions/permissions.slice";
import { restockSlice } from "./restock/restock.slice";
import { suppliersSlice } from "./suppliers/suppliers.slice";
import { companiesSlice } from "./companies/companies.slice";
import { usersSlice } from "./users/users.slice";
import { clientsSlice } from "./clients/clients.slice";
import { deliveriesSlice } from "./deliveries/deliveries.slice";

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
  2: (state: PersistedState) => {
    if (!state || typeof state !== "object") {
      return state;
    }

    const persisted = state as PersistedState & Partial<AuthState>;

    return {
      ...persisted,
      profiles: persisted.profiles ?? {},
    };
  },
};

const persistConfig = {
  key: "auth",
  storage,
  version: 2,
  whitelist: ["user", "isAuthenticated", "profiles"],
  migrate: createMigrate(persistMigrations, { debug: false }),
};

const companiesPersistConfig = {
  key: "companies",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);
const persistedCompaniesReducer = persistReducer(
  companiesPersistConfig,
  companiesSlice.reducer,
);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    permissions: permissionsSlice.reducer,
    inventory: inventorySlice.reducer,
    restock: restockSlice.reducer,
    suppliers: suppliersSlice.reducer,
    companies: persistedCompaniesReducer,
    users: usersSlice.reducer,
    clients: clientsSlice.reducer,
    deliveries: deliveriesSlice.reducer,
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
