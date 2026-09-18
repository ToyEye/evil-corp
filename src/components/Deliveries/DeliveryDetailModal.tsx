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
  getDeliveryLoad,
  isDeliveryTerminal,
  type Delivery,
  type DeliveryProof,
  type FailureReason,
} from "../../data/deliveries.schema";
import { getVehicleRemainingUnits } from "../../data/fleet.utils";
import {
  useAddClientAddressMutation,
  useAssignDeliveryMutation,
  useClientsQuery,
  useDeliveriesQuery,
  useProgressDeliveryMutation,
  useUsersQuery,
  useVehiclesQuery,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";
import { formFieldSx } from "../Forms/formStyles";
import { ActivityTimeline } from "../Activity/ActivityTimeline";
import { DeliveryStatusChip } from "./DeliveryStatusChip";
import { ProofOfDeliveryForm } from "./ProofOfDeliveryForm";

type DeliveryDetailModalProps = {
  delivery: Delivery | null;
  onClose: () => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

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
  const user = useSelector(selectUser);
  const { data: clientsData } = useClientsQuery();
  const { data: usersData } = useUsersQuery();
  const { data: vehiclesData } = useVehiclesQuery();
  const { data: deliveriesData } = useDeliveriesQuery();
  const assignDelivery = useAssignDeliveryMutation();
  const progressDeliveryMutation = useProgressDeliveryMutation();
  const addClientAddress = useAddClientAddressMutation();
  const clients = clientsData ?? [];
  const users = usersData ?? [];
  const vehicles = vehiclesData ?? [];
  const deliveries = deliveriesData ?? [];
  const client = clients.find((item) => item.id === delivery?.clientId);
  const canManage = user?.role === "Staff";
  const isDriver = user?.role === "Driver" && user.id === delivery?.driverId;
  const isOpen = Boolean(delivery);
  const canUpdate = Boolean(delivery && !isDeliveryTerminal(delivery.status) && (canManage || isDriver));
  const canEditAssignment =
    canManage && Boolean(delivery && canEditDeliveryAssignment(delivery.status));
  const drivers = useMemo(
    () =>
      users.filter(
        (item) => item.companyId === delivery?.companyId && item.role === "Driver",
      ),
    [delivery?.companyId, users],
  );
  const companyVehicles = useMemo(
    () => vehicles.filter((item) => item.companyId === delivery?.companyId),
    [delivery?.companyId, vehicles],
  );
  const [deliverBy, setDeliverBy] = useState("");
  const [scheduleError, setScheduleError] = useState<string>();
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState<string>();
  const [proofMode, setProofMode] = useState<"done" | "failed" | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const hasDraftSchedule = Boolean(toIso(deliverBy));
  const isScheduleDirty =
    Boolean(delivery) && deliverBy !== toDatetimeLocal(delivery?.deliverBy);

  useEffect(() => {
    setDeliverBy(toDatetimeLocal(delivery?.deliverBy));
    setScheduleError(undefined);
    setNewAddress("");
    setAddressError(undefined);
    setProofMode(null);
    setConfirmCancel(false);
  }, [delivery?.id, delivery?.deliverBy]);

  const saveSchedule = () => {
    if (!delivery) {
      return false;
    }

    const nextDeliverBy = toIso(deliverBy);

    if (!nextDeliverBy) {
      setScheduleError("Set a planned delivery date");
      return false;
    }

    assignDelivery.mutate({
      id: delivery.id,
      deliverBy: nextDeliverBy,
    });
    setScheduleError(undefined);
    return true;
  };

  const handleAddressChange = (addressId: string) => {
    if (!delivery || !user || !client) {
      return;
    }

    const address = client.addresses.find((item) => item.id === addressId);

    if (!address) {
      return;
    }

    assignDelivery.mutate({
      id: delivery.id,
      addressId: address.id,
      destination: address.line,
    });
  };

  const handleAddAddress = () => {
    const line = newAddress.trim();

    if (!delivery || !client) {
      setAddressError("Client is missing");
      return;
    }

    if (!line) {
      setAddressError("Address is required");
      return;
    }

    addClientAddress.mutate(
      { clientId: client.id, line },
      {
        onSuccess: (created) => {
          assignDelivery.mutate({
            id: delivery.id,
            addressId: created.id,
            destination: created.line,
          });
        },
      },
    );
    setNewAddress("");
    setAddressError(undefined);
  };

  const handleStatus = (
    status: Delivery["status"],
    extras?: { proof?: DeliveryProof; failureReason?: FailureReason },
  ) => {
    if (!delivery) {
      return;
    }

    if (canManage && status === "In transit" && !saveSchedule()) {
      return;
    }

    progressDeliveryMutation.mutate({
      id: delivery.id,
      status,
      proof: extras?.proof,
      failureReason: extras?.failureReason,
    });
    setProofMode(null);
  };

  const handleDriverChange = (driverId: string) => {
    if (!delivery || !user) {
      return;
    }

    const driver = drivers.find((item) => item.id === driverId);

    assignDelivery.mutate({
      id: delivery.id,
      driverId: driver?.id ?? null,
    });
  };

  const handleVehicleChange = (vehicleId: string) => {
    if (!delivery || !user) {
      return;
    }

    const vehicle = companyVehicles.find((item) => item.id === vehicleId);
    const remaining = vehicle
      ? getVehicleRemainingUnits(vehicle, deliveries, [delivery.id])
      : 0;
    const load = getDeliveryLoad(delivery);

    if (vehicle && load > remaining) {
      return;
    }

    assignDelivery.mutate({
      id: delivery.id,
      vehicleId: vehicle?.id ?? null,
    });
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
              {delivery.orderNumber ? (
                <DetailBlock label="Order" value={delivery.orderNumber} />
              ) : null}

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
              {delivery.routeNumber ? (
                <DetailBlock
                  label="Route"
                  value={`${delivery.routeNumber} · stop ${(delivery.stopIndex ?? 0) + 1}`}
                />
              ) : null}
              {canEditAssignment ? (
                <TextField
                  label="Vehicle"
                  select
                  fullWidth
                  value={delivery.vehicleId ?? ""}
                  onChange={(event) => handleVehicleChange(event.target.value)}
                  helperText={
                    delivery.vehicleId
                      ? `${getDeliveryLoad(delivery)} units on this stop`
                      : "Optional"
                  }
                  sx={formFieldSx}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {companyVehicles.map((vehicle) => {
                    const remaining = getVehicleRemainingUnits(vehicle, deliveries, [delivery.id]);
                    const load = getDeliveryLoad(delivery);
                    const tooHeavy = load > remaining;

                    return (
                      <MenuItem key={vehicle.id} value={vehicle.id} disabled={tooHeavy}>
                        {vehicle.plate} · {vehicle.name} ({remaining} left
                        {tooHeavy ? ", over capacity" : ""})
                      </MenuItem>
                    );
                  })}
                </TextField>
              ) : (
                <DetailBlock label="Vehicle" value={delivery.vehicleName || "—"} />
              )}
              {canEditAssignment ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Delivery address"
                    select
                    fullWidth
                    value={delivery.addressId ?? ""}
                    onChange={(event) => handleAddressChange(event.target.value)}
                    sx={formFieldSx}
                  >
                    <MenuItem value="">Select an address</MenuItem>
                    {(client?.addresses ?? []).map((address) => (
                      <MenuItem key={address.id} value={address.id}>
                        {address.line}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <TextField
                      label="New address"
                      value={newAddress}
                      onChange={(event) => {
                        setNewAddress(event.target.value);
                        setAddressError(undefined);
                      }}
                      fullWidth
                      error={Boolean(addressError)}
                      helperText={addressError}
                      sx={formFieldSx}
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleAddAddress}
                      sx={{
                        height: 56,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.default,
                      }}
                    >
                      Add address
                    </Button>
                  </Box>
                </Box>
              ) : (
                <DetailBlock label="Destination" value={delivery.destination || "—"} />
              )}
              {canEditAssignment ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Delivery date"
                    type="datetime-local"
                    value={deliverBy}
                    onChange={(event) => {
                      setDeliverBy(event.target.value);
                      setScheduleError(undefined);
                    }}
                    onBlur={() => {
                      if (isScheduleDirty) {
                        saveSchedule();
                      }
                    }}
                    fullWidth
                    error={Boolean(scheduleError)}
                    helperText={scheduleError}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={formFieldSx}
                  />
                  {isScheduleDirty ? (
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
                      Save delivery date
                    </Button>
                  ) : null}
                </Box>
              ) : (
                <DetailBlock label="Estimated delivery" value={formatDateTime(delivery.deliverBy)} />
              )}
              <DetailBlock label="Client" value={delivery.clientName} />
              <DetailBlock label="Phone" value={client?.phone ?? "—"} />
              <DetailBlock label="Email" value={client?.email ?? "—"} />
              {delivery.stockWrittenOff ? (
                <DetailBlock label="Stock" value="Written off on dispatch" />
              ) : null}

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

              {delivery.failureReason ? (
                <DetailBlock label="Failure reason" value={delivery.failureReason} />
              ) : null}

              {delivery.proof?.signatureUrl || delivery.proof?.photoUrl || delivery.proof?.lat ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: COLORS.text.tertiary,
                    }}
                  >
                    Proof of delivery
                  </Typography>
                  {delivery.proof.signatureUrl ? (
                    <Box
                      component="img"
                      src={delivery.proof.signatureUrl}
                      alt="Signature"
                      sx={{ width: "100%", borderRadius: "10px", border: `1px solid ${COLORS.border.default}` }}
                    />
                  ) : null}
                  {delivery.proof.photoUrl ? (
                    <Box
                      component="img"
                      src={delivery.proof.photoUrl}
                      alt="Delivery photo"
                      sx={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "10px" }}
                    />
                  ) : null}
                  {delivery.proof.lat != null && delivery.proof.lng != null ? (
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                      {delivery.proof.lat.toFixed(5)}, {delivery.proof.lng.toFixed(5)}
                    </Typography>
                  ) : null}
                </Box>
              ) : null}

              {canUpdate && !proofMode ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {isDriver && (delivery.status === "New" || delivery.status === "Planned") ? (
                      <Button
                        variant="contained"
                        onClick={() => handleStatus("In transit")}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "10px",
                          backgroundColor: COLORS.status.inTransit,
                        }}
                      >
                        Start route
                      </Button>
                    ) : null}
                    {isDriver && delivery.status === "In transit" ? (
                      <Button
                        variant="contained"
                        onClick={() => handleStatus("Arrived")}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "10px",
                          backgroundColor: COLORS.warning[600],
                          "&:hover": { backgroundColor: COLORS.warning[700] },
                        }}
                      >
                        Arrived on site
                      </Button>
                    ) : null}
                    {isDriver && (delivery.status === "Arrived" || delivery.status === "In transit") ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => setProofMode("done")}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            backgroundColor: COLORS.success[600],
                            "&:hover": { backgroundColor: COLORS.success[700] },
                          }}
                        >
                          Complete delivery
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setProofMode("failed")}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: COLORS.error[700],
                            borderColor: COLORS.error[200],
                          }}
                        >
                          Could not deliver
                        </Button>
                      </>
                    ) : null}
                    {canManage && delivery.status !== "In transit" && delivery.status !== "Arrived" ? (
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
                    ) : null}
                    {canManage && (delivery.status === "In transit" || delivery.status === "Arrived") ? (
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
                    ) : null}
                    {canManage && !confirmCancel ? (
                      <Button
                        variant="outlined"
                        onClick={() => setConfirmCancel(true)}
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
                    ) : null}
                  </Box>
                  {confirmCancel ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 1.5,
                        borderRadius: "12px",
                        border: `1px solid ${COLORS.error[200]}`,
                        backgroundColor: COLORS.error[50],
                      }}
                    >
                      <Typography variant="body2" sx={{ color: COLORS.error.text }}>
                        Cancel this delivery? Packed goods return to warehouse stock
                        {delivery.orderNumber ? ` and ${delivery.orderNumber} goes back to waiting.` : "."}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleStatus("Canceled")}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            backgroundColor: COLORS.error[600],
                            "&:hover": { backgroundColor: COLORS.error[700] },
                          }}
                        >
                          Confirm cancel
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setConfirmCancel(false)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: COLORS.text.secondary,
                            borderColor: COLORS.border.default,
                          }}
                        >
                          Keep delivery
                        </Button>
                      </Box>
                    </Box>
                  ) : null}
                  {canManage &&
                  delivery.status !== "In transit" &&
                  delivery.status !== "Arrived" &&
                  !hasDraftSchedule ? (
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary }}>
                      Set a planned date before marking this delivery in transit
                    </Typography>
                  ) : null}
                </Box>
              ) : null}

              {proofMode ? (
                <ProofOfDeliveryForm
                  mode={proofMode}
                  onCancel={() => setProofMode(null)}
                  onSubmit={({ proof, failureReason }) =>
                    handleStatus(proofMode === "done" ? "Done" : "Failed", { proof, failureReason })
                  }
                />
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
                <ActivityTimeline entityType="delivery" entityId={delivery.id} />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
};
