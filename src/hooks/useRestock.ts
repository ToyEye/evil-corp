import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { RestockRequest } from "../data/restock.schema";

type CreateRestockInput = {
  productId: string;
  quantity: number;
  note?: string;
  purposes: Array<"order" | "warehouse">;
  orderId?: string;
};

export const useRestockQuery = () =>
  useQuery({
    queryKey: queryKeys.restock.all,
    queryFn: async () => {
      const { data } = await http.get<RestockRequest[]>("/restock");
      return data;
    },
  });

export const useCreateRestockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRestockInput) => {
      const { data } = await http.post<RestockRequest>("/restock", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restock.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useAdvanceRestockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<RestockRequest>(`/restock/${id}/advance`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restock.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
