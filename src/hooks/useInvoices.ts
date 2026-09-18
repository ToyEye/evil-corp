import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Invoice } from "../data/invoices.schema";
import {
  filenameFromContentDisposition,
  triggerBlobDownload,
} from "../utils/downloadBlob";

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

export const useDownloadInvoicePdfMutation = () =>
  useMutation({
    mutationFn: async (invoice: Pick<Invoice, "id" | "number">) => {
      const response = await http.get<Blob>(`/invoices/${invoice.id}/pdf`, {
        responseType: "blob",
      });
      const filename = filenameFromContentDisposition(
        response.headers["content-disposition"],
        `${invoice.number}.pdf`,
      );
      triggerBlobDownload(response.data, filename);
    },
  });
