import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Supplier } from "../data/suppliers.schema";

type CreateSupplierInput = {
  name: string;
  type: Supplier["type"];
  description: string;
  doesNotSupply: string;
  notes?: string;
};

type UpdateSupplierInput = {
  id: string;
  name?: string;
  type?: Supplier["type"];
  addedAt?: string;
  description?: string;
  doesNotSupply?: string;
  notes?: string;
};

export const useSuppliersQuery = () =>
  useQuery({
    queryKey: queryKeys.suppliers.all,
    queryFn: async () => {
      const { data } = await http.get<Supplier[]>("/suppliers");
      return data;
    },
  });

export const useCreateSupplierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSupplierInput) => {
      const { data } = await http.post<Supplier>("/suppliers", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
};

export const useUpdateSupplierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateSupplierInput) => {
      const { data } = await http.patch<Supplier>(`/suppliers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
};
