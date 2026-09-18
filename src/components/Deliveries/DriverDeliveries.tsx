import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { isDeliveryTerminal, type Delivery } from "../../data/deliveries.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { useDeliveriesQuery } from "../../hooks";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";
import { DeliveryDetailModal } from "./DeliveryDetailModal";
import { DeliveryStatusChip } from "./DeliveryStatusChip";

const rankTrip = (item: Delivery) => {
  if (item.status === "In transit" || item.status === "Arrived") {
    return 0;
  }

  if (item.status === "Planned" || item.status === "New") {
    return 1;
  }

  return 2;
};

export const DriverDeliveries = () => {
  const user = useSelector(selectUser);
  const { data: itemsData } = useDeliveriesQuery();
  const items = itemsData ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const trips = useMemo(() => {
    const assigned = items.filter(
      (item) => item.companyId === user?.companyId && item.driverId === user?.id,
    );

    return [...assigned].sort((left, right) => {
      const routeCompare = (left.routeNumber ?? "zzz").localeCompare(right.routeNumber ?? "zzz");

      if (routeCompare !== 0) {
        return routeCompare;
      }

      const stopCompare = (left.stopIndex ?? 99) - (right.stopIndex ?? 99);

      if (stopCompare !== 0) {
        return stopCompare;
      }

      return rankTrip(left) - rankTrip(right);
    });
  }, [items, user?.companyId, user?.id]);

  const groups = useMemo(() => {
    const map = new Map<string, { title: string; trips: Delivery[] }>();

    for (const trip of trips) {
      const key = trip.routeId ?? `single-${trip.id}`;
      const existing = map.get(key);

      if (existing) {
        existing.trips.push(trip);
        continue;
      }

      map.set(key, {
        title: trip.routeNumber ?? trip.number,
        trips: [trip],
      });
    }

    return [...map.values()].map((group) => ({
      ...group,
      subtitle: group.trips[0]?.routeNumber
        ? `${group.trips[0].vehicleName ?? "No vehicle"} · ${group.trips.length} stop${
            group.trips.length === 1 ? "" : "s"
          }`
        : group.trips[0]?.vehicleName,
    }));
  }, [trips]);

  const selected = trips.find((item) => item.id === selectedId) ?? null;
  const openTrips = trips.filter((item) => !isDeliveryTerminal(item.status)).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
        {openTrips} open trip{openTrips === 1 ? "" : "s"} assigned to you
      </Typography>

      {groups.length === 0 ? (
        <Box
          sx={{
            borderRadius: "16px",
            border: `1px solid ${COLORS.border.default}`,
            backgroundColor: COLORS.background.surface,
            p: 4,
            textAlign: "center",
            color: COLORS.text.muted,
          }}
        >
          No trips assigned yet
        </Box>
      ) : (
        groups.map((group) => (
          <Box key={group.title + group.trips[0].id} sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {group.trips[0].routeNumber ? (
              <Box>
                <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                  {group.title}
                </Typography>
                {group.subtitle ? (
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {group.subtitle}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            {group.trips.map((trip) => (
              <Box
                key={trip.id}
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
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                      {trip.routeNumber
                        ? `Stop ${(trip.stopIndex ?? 0) + 1} · ${trip.number}`
                        : trip.number}
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                      {trip.clientName}
                    </Typography>
                  </Box>
                  <DeliveryStatusChip status={trip.status} />
                </Box>
                <Typography sx={{ color: COLORS.text.secondary }}>{trip.destination || "No address"}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                  ETA {formatDateTime(trip.deliverBy)}
                  {trip.vehicleName && !trip.routeNumber ? ` · ${trip.vehicleName}` : ""}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setSelectedId(trip.id)}
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    backgroundColor: COLORS.primary[600],
                    "&:hover": { backgroundColor: COLORS.primary[700] },
                  }}
                >
                  Open trip
                </Button>
              </Box>
            ))}
          </Box>
        ))
      )}

      <DeliveryDetailModal delivery={selected} onClose={() => setSelectedId(null)} />
    </Box>
  );
};
