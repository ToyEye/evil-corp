import Chip from "@mui/material/Chip";

import { FULFILLMENT_STATUS_LABELS, type FulfillmentStatus } from "../../data/orders.schema";
import { COLORS } from "../../theme/COLORS";

const STATUS_TONES: Record<FulfillmentStatus, { backgroundColor: string; color: string }> = {
  Waiting: {
    backgroundColor: COLORS.warning[50],
    color: COLORS.warning[700],
  },
  Reserved: {
    backgroundColor: COLORS.info[50],
    color: COLORS.info[700],
  },
  Picking: {
    backgroundColor: COLORS.primary[50],
    color: COLORS.primary[700],
  },
  Ready: {
    backgroundColor: COLORS.success[50],
    color: COLORS.success[700],
  },
};

type FulfillmentStatusChipProps = {
  status: FulfillmentStatus;
};

export const FulfillmentStatusChip = ({ status }: FulfillmentStatusChipProps) => {
  const tone = STATUS_TONES[status];

  return (
    <Chip
      label={FULFILLMENT_STATUS_LABELS[status]}
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
