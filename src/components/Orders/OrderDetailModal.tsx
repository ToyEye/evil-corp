import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import {
  getOrderLineTotal,
  getOrderTotal,
  isOrderFullyReserved,
  type Order,
} from "../../data/orders.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { selectClients } from "../../store/clients/clients.slice";
import { issueInvoiceForOrder } from "../../store/invoices/issueInvoice";
import { updateOrderStatus } from "../../store/orders/orders.slice";
import { logOpsEvent } from "../../store/ops/logOpsEvent";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { formatMoney } from "../../utils/formatMoney";
import { ActivityTimeline } from "../Activity/ActivityTimeline";
import { FulfillmentStatusChip } from "./FulfillmentStatusChip";
import { OrderStatusChip } from "./OrderStatusChip";

type OrderDetailModalProps = {
  order: Order | null;
  onClose: () => void;
};

const DetailBlock = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: COLORS.text.tertiary,
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

export const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const clients = useSelector(selectClients);
  const client = clients.find((item) => item.id === order?.clientId);
  const canMarkPaid = user?.role === "Accountant" && order?.status === "New";
  const isOpen = Boolean(order);

  const handleMarkPaid = () => {
    if (!order || !user) {
      return;
    }

    dispatch(updateOrderStatus({ id: order.id, status: "Paid" }));
    dispatch(issueInvoiceForOrder(order, user));
    dispatch(
      logOpsEvent({
        companyId: order.companyId,
        entityType: "order",
        entityId: order.id,
        entityNumber: order.number,
        message: "Marked as paid",
        actorId: user.id,
        actorName: user.name,
      }),
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 400,
          sx: {
            backgroundColor: COLORS.ui.overlay,
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 32px)", sm: 560 },
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: COLORS.background.surface,
            borderRadius: "16px",
            border: `1px solid ${COLORS.border.default}`,
            boxShadow: `0 24px 48px ${COLORS.ui.shadowStrong}`,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: `1px solid ${COLORS.border.light}`,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                {order?.number}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {order?.clientName}
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              onClick={onClose}
              sx={{
                color: COLORS.text.tertiary,
                backgroundColor: COLORS.background.subtle,
                "&:hover": { backgroundColor: COLORS.background.muted },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {order ? (
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <OrderStatusChip status={order.status} />
                <FulfillmentStatusChip status={order.fulfillmentStatus} />
              </Box>
              <DetailBlock label="Client" value={order.clientName} />
              <DetailBlock label="Destination" value={order.destination || "—"} />
              <DetailBlock label="Phone" value={client?.phone ?? "—"} />
              <DetailBlock label="Email" value={client?.email ?? "—"} />
              <DetailBlock
                label="Reservation"
                value={isOrderFullyReserved(order) ? "Fully reserved" : "Waiting for stock"}
              />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: COLORS.text.tertiary,
                  }}
                >
                  Goods
                </Typography>
                {order.items.map((item) => (
                  <Box key={`${item.productId}-${item.sku}`} sx={{ mt: 1 }}>
                    <Typography variant="body1" sx={{ color: COLORS.text.secondary }}>
                      {item.quantity} × {item.name} ({item.sku})
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                      {formatMoney(item.unitPrice)} / unit · {formatMoney(getOrderLineTotal(item))} ·
                      reserved {item.reservedQuantity}/{item.quantity} · picked {item.pickedQuantity}/
                      {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <DetailBlock label="Total" value={formatMoney(getOrderTotal(order.items))} />
              {order.notes ? <DetailBlock label="Notes" value={order.notes} /> : null}

              {canMarkPaid ? (
                <Button
                  variant="contained"
                  onClick={handleMarkPaid}
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    backgroundColor: COLORS.success[600],
                    "&:hover": { backgroundColor: COLORS.success[700] },
                  }}
                >
                  Mark as Paid
                </Button>
              ) : null}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: COLORS.text.tertiary,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Activity
                </Typography>
                <ActivityTimeline entityType="order" entityId={order.id} />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
};
