import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";

export type JoinRequestStatus = "pending" | "approved" | "rejected";

export type JoinRequest = {
  id: string;
  contactName: string;
  email: string;
  message: string;
  companyName?: string | null;
  depotLat?: number | null;
  depotLng?: number | null;
  status: JoinRequestStatus;
  createdAt: string;
};

type CreateJoinRequestInput = {
  contactName: string;
  email: string;
  message: string;
  companyName?: string;
  depotLat?: number;
  depotLng?: number;
  password?: string;
};

type ApproveJoinRequestInput = {
  id: string;
  password?: string;
};

export const useJoinRequestsQuery = () =>
  useQuery({
    queryKey: queryKeys.joinRequests.all,
    queryFn: async () => {
      const { data } = await http.get<JoinRequest[]>("/join-requests");
      return data;
    },
  });

export const useCreateJoinRequestMutation = () =>
  useMutation({
    mutationFn: async (payload: CreateJoinRequestInput) => {
      const { data } = await http.post<JoinRequest>("/join-requests", payload);
      return data;
    },
  });

export const useApproveJoinRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, password }: ApproveJoinRequestInput) => {
      const { data } = await http.post<JoinRequest>(
        `/join-requests/${id}/approve`,
        password ? { password } : {},
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.joinRequests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useRejectJoinRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.post<JoinRequest>(
        `/join-requests/${id}/reject`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.joinRequests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
