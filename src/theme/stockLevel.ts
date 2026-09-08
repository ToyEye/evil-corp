import { COLORS } from "./COLORS";

export const STOCK_CRITICAL_QTY = 20;
export const STOCK_LOW_QTY = 50;

export type StockLevel = "critical" | "low" | "ok";

export const getStockLevel = (quantity: number): StockLevel => {
  if (quantity < STOCK_CRITICAL_QTY) {
    return "critical";
  }

  if (quantity < STOCK_LOW_QTY) {
    return "low";
  }

  return "ok";
};

export const getStockLevelColors = (quantity: number) => {
  const level = getStockLevel(quantity);

  if (level === "critical") {
    return {
      backgroundColor: COLORS.error[50],
      color: COLORS.error[700],
    };
  }

  if (level === "low") {
    return {
      backgroundColor: COLORS.warning[50],
      color: COLORS.warning[700],
    };
  }

  return {
    backgroundColor: COLORS.background.muted,
    color: COLORS.text.secondary,
  };
};
