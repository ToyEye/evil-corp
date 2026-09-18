import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {
  getDeliveryLoad,
  isDeliveryTerminal,
} from "../../data/deliveries.schema";
import {
  useCompaniesQuery,
  useDeliveriesQuery,
  useRoutesQuery,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS, LIGHT_COLORS } from "../../theme/COLORS";
import { DeliveryStatusChip } from "./DeliveryStatusChip";
import { BuildRouteModal } from "./BuildRouteModal";
import { LogisticsMap, type MapStop } from "./LogisticsMap";

const ROUTE_COLORS = [
  LIGHT_COLORS.primary[500],
  LIGHT_COLORS.status.inTransit,
  LIGHT_COLORS.success[500],
  LIGHT_COLORS.warning[500],
  LIGHT_COLORS.info[500],
];

export const DispatchBoard = () => {
  const user = useSelector(selectUser);
  const { data: companiesData } = useCompaniesQuery();
  const companies = companiesData ?? [];
  const { data: deliveriesData } = useDeliveriesQuery();
  const deliveries = deliveriesData ?? [];
  const { data: routesData } = useRoutesQuery();
  const routes = routesData ?? [];
  const [isBuildOpen, setIsBuildOpen] = useState(false);
  const canBuild = user?.role === "Staff";
  const company = companies.find((item) => item.id === user?.companyId);
  const seededCompany = companies.find((item) => item.id === user?.companyId);
  const depotLat = company?.depotLat ?? seededCompany?.depotLat;
  const depotLng = company?.depotLng ?? seededCompany?.depotLng;
  const depot =
    depotLat != null && depotLng != null
      ? { lat: depotLat, lng: depotLng, label: `${company?.name ?? seededCompany?.name} depot` }
      : undefined;

  const companyDeliveries = useMemo(
    () => deliveries.filter((item) => item.companyId === user?.companyId),
    [deliveries, user?.companyId],
  );
  const companyRoutes = useMemo(
    () => routes.filter((item) => item.companyId === user?.companyId),
    [routes, user?.companyId],
  );

  const stops: MapStop[] = companyDeliveries.flatMap((item) => {
    if (item.lat == null || item.lng == null || isDeliveryTerminal(item.status)) {
      return [];
    }

    const routeIndex = companyRoutes.findIndex((route) => route.id === item.routeId);

    return [
      {
        id: item.id,
        label: `${item.number} · ${item.clientName}`,
        lat: item.lat,
        lng: item.lng,
        color: routeIndex >= 0 ? ROUTE_COLORS[routeIndex % ROUTE_COLORS.length] : LIGHT_COLORS.text.muted,
      },
    ];
  });

  const paths = companyRoutes.map((route, index) => {
    const routeStops = companyDeliveries
      .filter(
        (item) =>
          item.routeId === route.id &&
          item.lat != null &&
          item.lng != null &&
          !isDeliveryTerminal(item.status),
      )
      .sort((left, right) => (left.stopIndex ?? 0) - (right.stopIndex ?? 0));
    const points: Array<[number, number]> = [
      ...(depot ? ([[depot.lat, depot.lng]] as Array<[number, number]>) : []),
      ...routeStops.map((item) => [item.lat, item.lng] as [number, number]),
    ];

    return {
      id: route.id,
      points,
      color: ROUTE_COLORS[index % ROUTE_COLORS.length],
    };
  });

  const unrouted = companyDeliveries.filter(
    (item) => !item.routeId && !isDeliveryTerminal(item.status),
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
            Dispatch board
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Sequence stops, watch capacity, and keep drivers on a mapped route
          </Typography>
        </Box>
        {canBuild ? (
          <Button
            variant="contained"
            onClick={() => setIsBuildOpen(true)}
            sx={{
              px: 2.5,
              py: 1.1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: COLORS.primary[600],
              boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
              "&:hover": { backgroundColor: COLORS.primary[700] },
            }}
          >
            Build route
          </Button>
        ) : null}
      </Box>

      <LogisticsMap depot={depot} stops={stops} paths={paths} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {companyRoutes.map((route, index) => {
          const routeStops = companyDeliveries
            .filter((item) => item.routeId === route.id && !isDeliveryTerminal(item.status))
            .sort((left, right) => (left.stopIndex ?? 0) - (right.stopIndex ?? 0));
          const load = routeStops.reduce((total, item) => total + getDeliveryLoad(item), 0);

          return (
            <Box
              key={route.id}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${COLORS.border.default}`,
                backgroundColor: COLORS.background.surface,
                boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                    {route.number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {route.driverName} · {route.vehicleName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    mt: 0.75,
                    backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length],
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                {load} units · {routeStops.length} stop{routeStops.length === 1 ? "" : "s"}
              </Typography>
              {routeStops.map((stop) => (
                <Box
                  key={stop.id}
                  sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}
                >
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {(stop.stopIndex ?? 0) + 1}. {stop.number} · {stop.clientName}
                  </Typography>
                  <DeliveryStatusChip status={stop.status} />
                </Box>
              ))}
            </Box>
          );
        })}

        <Box
          sx={{
            borderRadius: "16px",
            border: `1px solid ${COLORS.border.default}`,
            backgroundColor: COLORS.background.surface,
            boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>Unrouted</Typography>
          {unrouted.length === 0 ? (
            <Typography variant="body2" sx={{ color: COLORS.text.muted }}>
              Every open delivery is on a route
            </Typography>
          ) : (
            unrouted.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}
              >
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  {item.number} · {item.clientName}
                  {item.vehicleName ? ` · ${item.vehicleName}` : ""}
                </Typography>
                <DeliveryStatusChip status={item.status} />
              </Box>
            ))
          )}
        </Box>
      </Box>

      <BuildRouteModal isOpen={isBuildOpen} onClose={() => setIsBuildOpen(false)} />
    </Box>
  );
};
