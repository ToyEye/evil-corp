import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getAssignableMemberRoles } from "../../data/companies.dummy";
import { dummyUsers } from "../../data/users.dummy";
import type { User, UserRole } from "../../data/users.schema";

type UsersState = {
  items: User[];
};

type UpdateUserRolePayload = {
  id: string;
  role: UserRole;
};

const initialState: UsersState = {
  items: dummyUsers,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const email = action.payload.email.trim().toLowerCase();

      if (state.items.some((item) => item.email.toLowerCase() === email)) {
        return;
      }

      if (!getAssignableMemberRoles(action.payload.companyId).includes(action.payload.role)) {
        return;
      }

      state.items.unshift({
        ...action.payload,
        email: action.payload.email.trim(),
        name: action.payload.name.trim(),
      });
    },
    updateUserRole: (state, action: PayloadAction<UpdateUserRolePayload>) => {
      const user = state.items.find((item) => item.id === action.payload.id);

      if (!user || user.role === "Admin") {
        return;
      }

      if (!getAssignableMemberRoles(user.companyId).includes(action.payload.role)) {
        return;
      }

      user.role = action.payload.role;
    },
  },
  selectors: {
    selectUsers: (state) => state.items,
  },
});

export const { addUser, updateUserRole } = usersSlice.actions;

export const { selectUsers } = usersSlice.selectors;

export default usersSlice.reducer;
