import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Client, ClientAddress } from "../data/clients.schema";

type CreateClientInput = {
  name: string;
  phone: string;
  email: string;
  note?: string;
  addresses?: Array<{ line: string; lat?: number; lng?: number }>;
};

type UpdateClientInput = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
};

type AddClientAddressInput = {
  clientId: string;
  line: string;
  lat?: number;
  lng?: number;
};

export const useClientsQuery = () =>
  useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: async () => {
      const { data } = await http.get<Client[]>("/clients");
      return data;
    },
  });

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateClientInput) => {
      const { data } = await http.post<Client>("/clients", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateClientInput) => {
      const { data } = await http.patch<Client>(`/clients/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all });
    },
  });
};

export const useAddClientAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, ...payload }: AddClientAddressInput) => {
      const { data } = await http.post<ClientAddress>(
        `/clients/${clientId}/addresses`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
};
