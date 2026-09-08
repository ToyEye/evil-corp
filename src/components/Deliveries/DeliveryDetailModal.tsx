import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import {
  canEditDeliveryAssignment,
  hasDeliverySchedule,
  type Delivery,
} from "../../data/deliveries.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { selectClients } from "../../store/clients/clients.slice";
import {
  updateDeliveryDriver,
  updateDeliverySchedule,
  updateDeliveryStatus,
} from "../../store/deliveries/deliveries.slice";
import {
  adjustInventoryQuantity,
} from "../../store/inventory/inventory.slice";
import { selectUsers } from "../../store/users/users.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx } from "../Forms/formStyles";
import { DeliveryStatusChip } from "./DeliveryStatusChip";

type DeliveryDetailModalProps = {
  delivery: Delivery | null;
  onClose: () => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

const formatDateTime = (value?: string) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const toDatetimeLocal = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toIso = (value: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
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

export const DeliveryDetailModal = ({ delivery, onClose }: DeliveryDetailModalProps) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const clients = useSelector(selectClients);
  const users = useSelector(selectUsers);
  const client = clients.find((item) => item.id === delivery?.clientId);
  const canManage = user?.role === "Staff";
  const isOpen = Boolean(delivery);
  const canUpdate =
    canManage &&
    delivery &&
    delivery.status !== "Canceled" &&
    delivery.status !== "Done";
  const canEditAssignment =
    canManage && Boolean(delivery && canEditDeliveryAssignment(delivery.status));
  const drivers = useMemo(
    () =>
      users.filter(
        (item) => item.companyId === delivery?.companyId && item.role === "driver",
      ),
    [delivery?.companyId, users],
  );
  const [dispatchAt, setDispatchAt] = useState("");
  const [deliverBy, setDeliverBy] = useState("");
  const [scheduleError, setScheduleError] = useState<string>();
  const hasDraftSchedule = hasDeliverySchedule(toIso(dispatchAt), toIso(deliverBy));

  useEffect(() => {
    setDispatchAt(toDatetimeLocal(delivery?.dispatchAt));
    setDeliverBy(toDatetimeLocal(delivery?.deliverBy));
    setScheduleError(undefined);
  }, [delivery?.id, delivery?.dispatchAt, delivery?.deliverBy]);

  const restoreStock = (item: Delivery) => {
    if (!item.reservesStock) {
      return;
    }

    for (const line of item.items) {
      dispatch(adjustInventoryQuantity({ id: line.productId, delta: line.quantity }));
    }
  };

  const saveSchedule = () => {
    if (!delivery) {
      return false;
    }

    const nextDispatchAt = toIso(dispatchAt);
    const nextDeliverBy = toIso(deliverBy);

    if (!hasDeliverySchedule(nextDispatchAt, nextDeliverBy)) {
      setScheduleError("Set a planned dispatch or delivery date");
      return false;
    }

    dispatch(
      updateDeliverySchedule({
        id: delivery.id,
        dispatchAt: nextDispatchAt,
        deliverBy: nextDeliverBy,
      }),
    );
    setScheduleError(undefined);
    return true;
  };

  const handleStatus = (status: Delivery["status"]) => {
    if (!delivery) {
      return;
    }

    if (status === "Canceled") {
      restoreStock(delivery);
    }

    if (status === "In transit" && !saveSchedule()) {
      return;
    }

    dispatch(updateDeliveryStatus({ id: delivery.id, status }));
  };

  const handleDriverChange = (driverId: string) => {
    if (!delivery) {
      return;
    }

    const driver = drivers.find((item) => item.id === driverId);

    dispatch(
      updateDeliveryDriver({
        id: delivery.id,
        driverId: driver?.id,
        driverName: driver?.name,
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
                {delivery?.number}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {delivery?.clientName}
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

          {delivery ? (
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <DeliveryStatusChip status={delivery.status} />

              {canEditAssignment ? (
                <TextField
                  label="Driver"
                  select
                  fullWidth
                  value={delivery.driverId ?? ""}
                  onChange={(event) => handleDriverChange(event.target.value)}
                  sx={formFieldSx}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <DetailBlock label="Driver" value={delivery.driverName || "—"} />
              )}
              <DetailBlock label="Destination" value={delivery.destination || "—"} />
              {canEditAssignment ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Planned dispatch"
                    type="datetime-local"
                    value={dispatchAt}
                    onChange={(event) => {
                      setDispatchAt(event.target.value);
                      setScheduleError(undefined);
                    }}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={formFieldSx}
                  />
                  <TextField
                    label="Planned delivery"
                    type="datetime-local"
                    value={deliverBy}
                    onChange={(event) => {
                      setDeliverBy(event.target.value);
                      setScheduleError(undefined);
                    }}
                    fullWidth
                    error={Boolean(scheduleError)}
                    helperText={scheduleError}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={formFieldSx}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      saveSchedule();
                    }}
                    sx={{
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "10px",
                      color: COLORS.text.secondary,
                      borderColor: COLORS.border.default,
                    }}
                  >
                    Save planned dates
                  </Button>
                </Box>
              ) : (
                <>
                  <DetailBlock label="Dispatch" value={formatDateTime(delivery.dispatchAt)} />
                  <DetailBlock label="Estimated delivery" value={formatDateTime(delivery.deliverBy)} />
                </>
              )}
              <DetailBlock label="Client" value={delivery.clientName} />
              <DetailBlock label="Phone" value={client?.phone ?? "—"} />
              <DetailBlock label="Email" value={client?.email ?? "—"} />

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
                {delivery.items.map((item) => (
                  <Typography
                    key={`${item.productId}-${item.sku}`}
                    variant="body1"
                    sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}
                  >
                    {item.quantity} × {item.name} ({item.sku})
                  </Typography>
                ))}
              </Box>

              {delivery.notes ? <DetailBlock label="Notes" value={delivery.notes} /> : null}

              {canUpdate ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {delivery.status !== "In transit" ? (
                      <Button
                        variant="contained"
                        disabled={!hasDraftSchedule}
                        onClick={() => handleStatus("In transit")}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "10px",
                          backgroundColor: COLORS.status.inTransit,
                          "&:hover": { backgroundColor: COLORS.primary[800] },
                          "&.Mui-disabled": {
                            backgroundColor: COLORS.background.muted,
                            color: COLORS.text.muted,
                          },
                        }}
                      >
                        Mark in transit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleStatus("Done")}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "10px",
                          backgroundColor: COLORS.success[600],
                          "&:hover": { backgroundColor: COLORS.success[700] },
                        }}
                      >
                        Mark done
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => handleStatus("Canceled")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        color: COLORS.error[700],
                        borderColor: COLORS.error[200],
                      }}
                    >
                      Cancel delivery
                    </Button>
                  </Box>
                  {delivery.status !== "In transit" && !hasDraftSchedule ? (
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary }}>
                      Set a planned date before marking this delivery in transit
                    </Typography>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
};
