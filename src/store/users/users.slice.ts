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
    updateUserRole: (state, action: PayloadAction<UpdateUserRolePayload>) => {
      const user = state.items.find((item) => item.id === action.payload.id);

      if (!user || user.role === "admin") {
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

export const { updateUserRole } = usersSlice.actions;

export const { selectUsers } = usersSlice.selectors;

export default usersSlice.reducer;
