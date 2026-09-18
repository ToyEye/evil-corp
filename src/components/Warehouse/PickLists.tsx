import { useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { isOrderFullyPicked, type Order } from "../../data/orders.schema";
import {
  useCompletePickingMutation,
  useInventoryQuery,
  useOrdersQuery,
  useSetPickedQuantityMutation,
  useStartPickingMutation,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx } from "../Forms/formStyles";
import { FulfillmentStatusChip } from "../Orders/FulfillmentStatusChip";

export const PickLists = () => {
  const user = useSelector(selectUser);
  const { data: ordersData } = useOrdersQuery();
  const { data: inventoryData } = useInventoryQuery();
  const startPicking = useStartPickingMutation();
  const setPickedQuantity = useSetPickedQuantityMutation();
  const completePicking = useCompletePickingMutation();
  const orders = ordersData ?? [];
  const inventory = inventoryData ?? [];
  const canPick = user?.role === "Storekeeper";

  const pickOrders = useMemo(() => {
    const rank = (order: Order) => {
      if (order.fulfillmentStatus === "Picking") {
        return 0;
      }

      if (order.fulfillmentStatus === "Reserved") {
        return 1;
      }

      if (order.fulfillmentStatus === "Waiting") {
        return 2;
      }

      return 3;
    };

    return orders
      .filter((order) => order.companyId === user?.companyId)
      .sort((left, right) => rank(left) - rank(right));
  }, [orders, user?.companyId]);

  const locationFor = (productId: string) => {
    const product = inventory.find((item) => item.id === productId);
    return product ? `${product.zone} · ${product.bin}` : "—";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: COLORS.text.primary }}
        >
          Pick lists
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Walk bins, mark picked units, then release orders to dispatch
        </Typography>
      </Box>

      {pickOrders.length === 0 ? (
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
          No orders to pick
        </Box>
      ) : (
        pickOrders.map((order) => (
          <Box
            key={order.id}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 700, color: COLORS.text.primary }}
                >
                  {order.number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.text.secondary }}
                >
                  {order.clientName}
                </Typography>
              </Box>
              <FulfillmentStatusChip status={order.fulfillmentStatus} />
            </Box>

            {order.items.map((item) => (
              <Box
                key={`${item.productId}-${item.sku}`}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.text.primary }}
                  >
                    {item.quantity} × {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.text.tertiary }}
                  >
                    {item.sku} · {locationFor(item.productId)} · reserved{" "}
                    {item.reservedQuantity}/{item.quantity}
                  </Typography>
                </Box>
                {canPick && order.fulfillmentStatus === "Picking" ? (
                  <TextField
                    label="Picked"
                    type="number"
                    value={item.pickedQuantity}
                    onChange={(event) =>
                      setPickedQuantity.mutate({
                        id: order.id,
                        productId: item.productId,
                        quantity: Number(event.target.value),
                      })
                    }
                    sx={{ ...formFieldSx, width: 112 }}
                    slotProps={{ htmlInput: { min: 0, max: item.quantity } }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.text.secondary }}
                  >
                    Picked {item.pickedQuantity}/{item.quantity}
                  </Typography>
                )}
              </Box>
            ))}

            {canPick && order.fulfillmentStatus === "Reserved" ? (
              <Button
                variant="contained"
                onClick={() => startPicking.mutate(order.id)}
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  backgroundColor: COLORS.primary[600],
                  "&:hover": { backgroundColor: COLORS.primary[700] },
                }}
              >
                Start picking
              </Button>
            ) : null}

            {canPick && order.fulfillmentStatus === "Picking" ? (
              <Button
                variant="contained"
                disabled={!isOrderFullyPicked(order)}
                onClick={() => completePicking.mutate(order.id)}
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  backgroundColor: COLORS.success[600],
                  "&:hover": { backgroundColor: COLORS.success[700] },
                }}
              >
                Mark ready to ship
              </Button>
            ) : null}
          </Box>
        ))
      )}
    </Box>
  );
};
