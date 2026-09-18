import { useQuery } from "@tanstack/react-query";

import { http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { ActivityEvent } from "../data/activity.schema";

export const useActivityQuery = () =>
  useQuery({
    queryKey: queryKeys.activity.all,
    queryFn: async () => {
      const { data } = await http.get<ActivityEvent[]>("/activity");
      return data;
    },
  });
