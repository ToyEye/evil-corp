import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { User, UserRole } from "../data/users.schema";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
};

type UpdateUserRoleInput = {
  id: string;
  role: UserRole;
};

export const useUsersQuery = () =>
  useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { data } = await http.get<User[]>("/users");
      return data;
    },
  });

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserInput) => {
      const { data } = await http.post<User>("/users", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: UpdateUserRoleInput) => {
      const { data } = await http.patch<User>(`/users/${id}`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
