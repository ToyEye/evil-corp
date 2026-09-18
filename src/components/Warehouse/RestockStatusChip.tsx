import Chip from "@mui/material/Chip";

import { RESTOCK_STATUS_LABELS, type RestockStatus } from "../../data/restock.schema";
import { COLORS } from "../../theme/COLORS";

const STATUS_TONES: Record<RestockStatus, { backgroundColor: string; color: string }> = {
  New: {
    backgroundColor: COLORS.info[50],
    color: COLORS.info[700],
  },
  Confirmed: {
    backgroundColor: COLORS.primary[50],
    color: COLORS.primary[700],
  },
  Delivered: {
    backgroundColor: COLORS.warning[50],
    color: COLORS.warning[700],
  },
  Received: {
    backgroundColor: COLORS.success[50],
    color: COLORS.success[700],
  },
};

type RestockStatusChipProps = {
  status: RestockStatus;
};

export const RestockStatusChip = ({ status }: RestockStatusChipProps) => {
  const tone = STATUS_TONES[status];

  return (
    <Chip
      label={RESTOCK_STATUS_LABELS[status]}
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
