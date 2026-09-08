import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  defaultPageAccess,
  isPageAccessLocked,
} from "../../data/permissions.dummy";
import type { AppPageId, PageAccess } from "../../data/permissions.schema";
import { USER_ROLES, type UserRole } from "../../data/users.schema";

type PermissionsState = {
  pageAccess: PageAccess;
};

type SetRolePageAccessPayload = {
  pageId: AppPageId;
  role: UserRole;
  allowed: boolean;
};

const clonePageAccess = (access: PageAccess): PageAccess => ({
  dashboard: [...access.dashboard],
  users: [...access.users],
  settings: [...access.settings],
  warehouse: [...access.warehouse],
  suppliers: [...access.suppliers],
  clients: [...access.clients],
  deliveries: [...access.deliveries],
});

const initialState: PermissionsState = {
  pageAccess: clonePageAccess(defaultPageAccess),
};

const orderedRoles = (roles: Iterable<UserRole>) => {
  const selected = new Set(roles);
  return USER_ROLES.filter((role) => selected.has(role));
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setRolePageAccess: (state, action: PayloadAction<SetRolePageAccessPayload>) => {
      const { pageId, role, allowed } = action.payload;

      if (isPageAccessLocked(pageId, role) && !allowed) {
        return;
      }

      const nextRoles = new Set(state.pageAccess[pageId]);

      if (allowed) {
        nextRoles.add(role);
      } else {
        nextRoles.delete(role);
      }

      state.pageAccess[pageId] = orderedRoles(nextRoles);
    },
    resetPageAccess: (state) => {
      state.pageAccess = clonePageAccess(defaultPageAccess);
    },
  },
  selectors: {
    selectPageAccess: (state) => state.pageAccess,
  },
});

export const { setRolePageAccess, resetPageAccess } = permissionsSlice.actions;

export const { selectPageAccess } = permissionsSlice.selectors;

export default permissionsSlice.reducer;
