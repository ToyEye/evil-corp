import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { ActivityEntityType } from "../../data/activity.schema";
import { useActivityQuery } from "../../hooks";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";

type ActivityTimelineProps = {
  entityType: ActivityEntityType;
  entityId: string;
};

export const ActivityTimeline = ({
  entityType,
  entityId,
}: ActivityTimelineProps) => {
  const { data } = useActivityQuery();
  const events = (data ?? []).filter(
    (item) => item.entityType === entityType && item.entityId === entityId,
  );

  if (events.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: COLORS.text.muted }}>
        No activity yet
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {events.map((event) => (
        <Box key={event.id} sx={{ display: "flex", gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              mt: 0.7,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: COLORS.primary[500],
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: COLORS.text.primary,
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {event.message}
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
              {event.actorName} · {formatDateTime(event.createdAt)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
