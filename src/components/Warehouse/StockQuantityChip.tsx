import Chip from "@mui/material/Chip";

import { getStockLevelColors } from "../../theme/stockLevel";

type StockQuantityChipProps = {
  quantity: number;
};

export const StockQuantityChip = ({ quantity }: StockQuantityChipProps) => {
  const colors = getStockLevelColors(quantity);

  return (
    <Chip
      label={quantity}
      size="small"
      sx={{
        fontWeight: 700,
        minWidth: 48,
        borderRadius: "8px",
        backgroundColor: colors.backgroundColor,
        color: colors.color,
      }}
    />
  );
};
