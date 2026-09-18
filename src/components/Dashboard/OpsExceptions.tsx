import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { isDeliveryTerminal } from "../../data/deliveries.schema";
import { isOrderFullyReserved } from "../../data/orders.schema";
import {
  useDeliveriesQuery,
  useInventoryQuery,
  useOrdersQuery,
} from "../../hooks";
import { paths } from "../../routing/routes";
import { selectUser } from "../../store/auth/auth.slice";
import { getCompanyNameForUser } from "../../utils/companyAccess";
import { COLORS } from "../../theme/COLORS";
import { getStockLevel } from "../../theme/stockLevel";

const UNRESERVED_MS = 4 * 60 * 60 * 1000;
const SLA_SOON_MS = 4 * 60 * 60 * 1000;

type ExceptionItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
};

type OpsExceptionsProps = {
  companyId: string;
};

export const OpsExceptions = ({ companyId }: OpsExceptionsProps) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { data: inventoryData } = useInventoryQuery();
  const { data: ordersData } = useOrdersQuery();
  const { data: deliveriesData } = useDeliveriesQuery();
  const inventory = inventoryData ?? [];
  const orders = ordersData ?? [];
  const deliveries = deliveriesData ?? [];
  const companyName = user ? getCompanyNameForUser(user) : "";
  const now = Date.now();

  const exceptions = useMemo(() => {
    const items: ExceptionItem[] = [];

    for (const product of inventory.filter((item) => item.companyId === companyId)) {
      if (getStockLevel(product.quantity) !== "critical") {
        continue;
      }

      items.push({
        id: `stock-${product.id}`,
        title: `${product.name} is critical`,
        detail: `${product.quantity} left in the warehouse`,
        href: paths.warehouse(companyName),
      });
    }

    for (const order of orders.filter((item) => item.companyId === companyId)) {
      if (isOrderFullyReserved(order)) {
        continue;
      }

      if (now - new Date(order.createdAt).getTime() < UNRESERVED_MS) {
        continue;
      }

      items.push({
        id: `order-${order.id}`,
        title: `${order.number} is waiting for stock`,
        detail: "Not fully reserved yet",
        href: paths.orders(companyName),
      });
    }

    for (const delivery of deliveries.filter((item) => item.companyId === companyId)) {
      if (isDeliveryTerminal(delivery.status)) {
        continue;
      }

      if (!delivery.driverId) {
        items.push({
          id: `driver-${delivery.id}`,
          title: `${delivery.number} has no driver`,
          detail: delivery.clientName,
          href: paths.deliveries(companyName),
        });
      }

      if (!delivery.deliverBy) {
        continue;
      }

      const eta = new Date(delivery.deliverBy).getTime();

      if (eta < now) {
        items.push({
          id: `late-${delivery.id}`,
          title: `${delivery.number} is past ETA`,
          detail: delivery.status,
          href: paths.deliveries(companyName),
        });
      } else if (eta - now < SLA_SOON_MS) {
        items.push({
          id: `soon-${delivery.id}`,
          title: `${delivery.number} is due soon`,
          detail: delivery.status,
          href: paths.deliveries(companyName),
        });
      }
    }

    for (const delivery of deliveries.filter(
      (item) => item.companyId === companyId && item.status === "Failed",
    )) {
      items.push({
        id: `failed-${delivery.id}`,
        title: `${delivery.number} failed`,
        detail: delivery.failureReason ?? "Could not deliver",
        href: paths.deliveries(companyName),
      });
    }

    return items;
  }, [companyId, companyName, deliveries, inventory, now, orders]);

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${COLORS.border.light}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberRoundedIcon sx={{ color: COLORS.warning[600], fontSize: 22 }} />
          <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
            Needs attention
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
          Exceptions across stock, orders, and deliveries
        </Typography>
      </Box>

      {exceptions.length === 0 ? (
        <Box sx={{ px: 2.5, py: 3, color: COLORS.text.muted }}>All clear for now</Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {exceptions.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                px: 2.5,
                py: 1.5,
                borderBottom: `1px solid ${COLORS.border.light}`,
                "&:last-of-type": { borderBottom: 0 },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                  {item.detail}
                </Typography>
              </Box>
              <Button
                onClick={() => navigate(item.href)}
                sx={{
                  flexShrink: 0,
                  textTransform: "none",
                  fontWeight: 600,
                  color: COLORS.primary[700],
                }}
              >
                Open
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
