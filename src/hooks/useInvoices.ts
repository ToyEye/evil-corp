import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Invoice } from "../data/invoices.schema";

export const useInvoicesQuery = () =>
  useQuery({
    queryKey: queryKeys.invoices.all,
    queryFn: async () => {
      const { data } = await http.get<Invoice[]>("/invoices");
      return data;
    },
  });

export const useIssueInvoiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await http.post<Invoice>(
        `/invoices/from-order/${orderId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
