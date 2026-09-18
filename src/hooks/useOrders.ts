import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Order } from "../data/orders.schema";

type CreateOrderInput = {
  clientId: string;
  addressId?: string;
  destination?: string;
  notes?: string;
  items: Array<{ productId: string; quantity: number }>;
};

type ReserveOrderItemsInput = {
  id: string;
  productId: string;
  quantity: number;
};

type SetPickedQuantityInput = {
  id: string;
  productId: string;
  quantity: number;
};

const invalidateOrderRelated = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.restock.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
};

export const useOrdersQuery = () =>
  useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const { data } = await http.get<Order[]>("/orders");
      return data;
    },
  });

export const useOrderQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.orders.detail(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<Order>(`/orders/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderInput) => {
      const { data } = await http.post<Order>("/orders", payload);
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};

export const usePayOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<Order>(`/orders/${id}/pay`);
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};

export const useReserveOrderItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: ReserveOrderItemsInput) => {
      const { data } = await http.post<Order>(
        `/orders/${id}/reserve`,
        payload,
      );
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};

export const useStartPickingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<Order>(`/orders/${id}/start-picking`);
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};

export const useSetPickedQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: SetPickedQuantityInput) => {
      const { data } = await http.post<Order>(`/orders/${id}/pick`, payload);
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};

export const useCompletePickingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<Order>(
        `/orders/${id}/complete-picking`,
      );
      return data;
    },
    onSuccess: () => invalidateOrderRelated(queryClient),
  });
};
