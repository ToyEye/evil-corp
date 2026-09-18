import Chip from "@mui/material/Chip";

import { ORDER_STATUS_LABELS, type OrderStatus } from "../../data/orders.schema";
import { COLORS } from "../../theme/COLORS";

const STATUS_TONES: Record<OrderStatus, { backgroundColor: string; color: string }> = {
  New: {
    backgroundColor: COLORS.info[50],
    color: COLORS.info[700],
  },
  Paid: {
    backgroundColor: COLORS.success[50],
    color: COLORS.success[700],
  },
};

type OrderStatusChipProps = {
  status: OrderStatus;
};

export const OrderStatusChip = ({ status }: OrderStatusChipProps) => {
  const tone = STATUS_TONES[status];

  return (
    <Chip
      label={ORDER_STATUS_LABELS[status]}
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
