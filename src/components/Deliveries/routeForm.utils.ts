import type { DispatchRoute } from "../../data/routes.schema";

export const nextRouteNumber = (routes: DispatchRoute[], companyId: string) => {
  const maxNumber = routes
    .filter((item) => item.companyId === companyId)
    .reduce((max, item) => {
      const match = item.number.match(/(\d+)$/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 1000);

  return `RT-${maxNumber + 1}`;
};
