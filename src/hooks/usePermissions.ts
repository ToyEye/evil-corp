import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { AppPage, AppPageId, PageAccess } from "../data/permissions.schema";
import type { UserRole } from "../data/users.schema";

export type PermissionsResponse = {
  pageAccess: PageAccess;
  pages: AppPage[];
};

type UpdatePageAccessInput = {
  pageId: AppPageId;
  roles: UserRole[];
};

export const usePermissionsQuery = () =>
  useQuery({
    queryKey: queryKeys.permissions.all,
    queryFn: async () => {
      const { data } = await http.get<PermissionsResponse>("/permissions");
      return data;
    },
  });

export const useUpdatePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePageAccessInput) => {
      const { data } = await http.patch<PageAccess>("/permissions", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all });
    },
  });
};
