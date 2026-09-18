import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { DispatchRoute } from "../data/routes.schema";

type CreateRouteInput = {
  driverId: string;
  vehicleId: string;
};

type AssignRouteStopsInput = {
  id: string;
  deliveryIds: string[];
};

export const useRoutesQuery = () =>
  useQuery({
    queryKey: queryKeys.routes.all,
    queryFn: async () => {
      const { data } = await http.get<DispatchRoute[]>("/routes");
      return data;
    },
  });

export const useCreateRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRouteInput) => {
      const { data } = await http.post<DispatchRoute>("/routes", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    },
  });
};

export const useAssignRouteStopsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, deliveryIds }: AssignRouteStopsInput) => {
      const { data } = await http.post<DispatchRoute>(
        `/routes/${id}/assign-stops`,
        { deliveryIds },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    },
  });
};
