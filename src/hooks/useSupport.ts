import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { SupportMessage, SupportThread } from "../data/support.schema";

type SendMessageInput = {
  threadId: string;
  body: string;
};

type MarkReadInput = {
  threadId: string;
  as: "support" | "requester";
};

export const useSupportThreadsQuery = () =>
  useQuery({
    queryKey: queryKeys.support.threads,
    queryFn: async () => {
      const { data } = await http.get<SupportThread[]>("/support/threads");
      return data;
    },
  });

export const useSupportMessagesQuery = (threadId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.support.messages(threadId ?? ""),
    queryFn: async () => {
      const { data } = await http.get<SupportMessage[]>(
        `/support/threads/${threadId}/messages`,
      );
      return data;
    },
    enabled: Boolean(threadId),
  });

export const useEnsureSupportThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await http.post<SupportThread>("/support/threads/ensure");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.threads });
    },
  });
};

export const useSendSupportMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, body }: SendMessageInput) => {
      const { data } = await http.post<SupportMessage>(
        `/support/threads/${threadId}/messages`,
        { body },
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.messages(variables.threadId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.support.threads });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useMarkSupportThreadReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, as }: MarkReadInput) => {
      const { data } = await http.post<SupportThread>(
        `/support/threads/${threadId}/read`,
        { as },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.threads });
    },
  });
};
