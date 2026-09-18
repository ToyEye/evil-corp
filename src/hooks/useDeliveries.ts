import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Delivery, DeliveryStatus } from "../data/deliveries.schema";

type CreateDeliveryInput = {
  clientId: string;
  orderId?: string;
  items?: Array<{ productId: string; quantity: number }>;
  driverId?: string;
  vehicleId?: string;
  addressId?: string;
  destination?: string;
  dispatchAt?: string;
  deliverBy?: string;
  notes?: string;
  lat?: number;
  lng?: number;
};

type AssignDeliveryInput = {
  id: string;
  driverId?: string | null;
  vehicleId?: string | null;
  addressId?: string | null;
  destination?: string | null;
  dispatchAt?: string | null;
  deliverBy?: string | null;
  notes?: string;
};

type ProgressDeliveryInput = {
  id: string;
  status: DeliveryStatus;
  proof?: {
    photoUrl?: string;
    signatureUrl?: string;
    lat?: number;
    lng?: number;
    capturedAt?: string;
  };
  failureReason?: string;
};

const invalidateDeliveryRelated = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.routes.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
};

export const useDeliveriesQuery = () =>
  useQuery({
    queryKey: queryKeys.deliveries.all,
    queryFn: async () => {
      const { data } = await http.get<Delivery[]>("/deliveries");
      return data;
    },
  });

export const useDeliveryQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.deliveries.detail(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<Delivery>(`/deliveries/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

export const useCreateDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDeliveryInput) => {
      const { data } = await http.post<Delivery>("/deliveries", payload);
      return data;
    },
    onSuccess: () => invalidateDeliveryRelated(queryClient),
  });
};

export const useAssignDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: AssignDeliveryInput) => {
      const { data } = await http.patch<Delivery>(
        `/deliveries/${id}/assign`,
        payload,
      );
      return data;
    },
    onSuccess: () => invalidateDeliveryRelated(queryClient),
  });
};

export const useProgressDeliveryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: ProgressDeliveryInput) => {
      const { data } = await http.post<Delivery>(
        `/deliveries/${id}/progress`,
        payload,
      );
      return data;
    },
    onSuccess: () => invalidateDeliveryRelated(queryClient),
  });
};
