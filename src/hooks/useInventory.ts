import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { InventoryItem } from "../data/inventory.schema";

type CreateInventoryInput = {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: InventoryItem["category"];
  bin: string;
};

type UpdateInventoryInput = {
  id: string;
  sku?: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: InventoryItem["category"];
  bin?: string;
};

type AdjustInventoryInput = {
  id: string;
  delta: number;
};

export const useInventoryQuery = () =>
  useQuery({
    queryKey: queryKeys.inventory.all,
    queryFn: async () => {
      const { data } = await http.get<InventoryItem[]>("/inventory");
      return data;
    },
  });

export const useCreateInventoryItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInventoryInput) => {
      const { data } = await http.post<InventoryItem>("/inventory", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};

export const useUpdateInventoryItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateInventoryInput) => {
      const { data } = await http.patch<InventoryItem>(
        `/inventory/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};

export const useAdjustInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, delta }: AdjustInventoryInput) => {
      const { data } = await http.post<InventoryItem>(
        `/inventory/${id}/adjust`,
        { delta },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};
