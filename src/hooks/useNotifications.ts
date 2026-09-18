import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { AppNotification } from "../data/notifications.schema";

export const useNotificationsQuery = () =>
  useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      const { data } = await http.get<AppNotification[]>("/notifications");
      return data;
    },
  });

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<AppNotification>(
        `/notifications/${id}/read`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await http.post<AppNotification[]>(
        "/notifications/read-all",
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
