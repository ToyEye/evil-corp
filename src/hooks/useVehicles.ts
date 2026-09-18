import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Vehicle } from "../data/vehicles.schema";

type CreateVehicleInput = {
  name: string;
  plate: string;
  type: Vehicle["type"];
  maxUnits: number;
};

export const useVehiclesQuery = () =>
  useQuery({
    queryKey: queryKeys.vehicles.all,
    queryFn: async () => {
      const { data } = await http.get<Vehicle[]>("/vehicles");
      return data;
    },
  });

export const useCreateVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVehicleInput) => {
      const { data } = await http.post<Vehicle>("/vehicles", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};
