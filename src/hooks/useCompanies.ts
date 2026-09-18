import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { Company } from "../data/companies.schema";

type UpdateCompanyInput = {
  id: string;
  name?: string;
  iconUrl?: string | null;
};

export const useCompaniesQuery = () =>
  useQuery({
    queryKey: queryKeys.companies.all,
    queryFn: async () => {
      const { data } = await http.get<Company[]>("/companies");
      return data;
    },
  });

export const useCompanyQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.companies.detail(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<Company>(`/companies/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

export const useUpdateCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateCompanyInput) => {
      const { data } = await http.patch<Company>(`/companies/${id}`, payload);
      return data;
    },
    onSuccess: (company) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.setQueryData(queryKeys.companies.detail(company.id), company);
    },
  });
};
