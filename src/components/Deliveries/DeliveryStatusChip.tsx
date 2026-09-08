import Chip from "@mui/material/Chip";

import type { DeliveryStatus } from "../../data/deliveries.schema";
import { COLORS } from "../../theme/COLORS";

const STATUS_TONES: Record<DeliveryStatus, { backgroundColor: string; color: string }> = {
  New: {
    backgroundColor: COLORS.info[50],
    color: COLORS.info[700],
  },
  Planned: {
    backgroundColor: COLORS.primary[50],
    color: COLORS.primary[700],
  },
  "In transit": {
    backgroundColor: "#EEF2FF",
    color: COLORS.status.inTransit,
  },
  Canceled: {
    backgroundColor: COLORS.error[50],
    color: COLORS.error[700],
  },
  Done: {
    backgroundColor: COLORS.success[50],
    color: COLORS.success[700],
  },
};

type DeliveryStatusChipProps = {
  status: DeliveryStatus;
};

export const DeliveryStatusChip = ({ status }: DeliveryStatusChipProps) => {
  const tone = STATUS_TONES[status];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: "8px",
        backgroundColor: tone.backgroundColor,
        color: tone.color,
      }}
    />
  );
};
