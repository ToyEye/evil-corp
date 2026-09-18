import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";

import {
  canEditDeliveryAssignment,
  getDeliveryLoad,
  type Delivery,
} from "../../data/deliveries.schema";
import { getVehicleRemainingUnits } from "../../data/fleet.utils";
import { selectUser } from "../../store/auth/auth.slice";
import {
  useAssignRouteStopsMutation,
  useCreateRouteMutation,
  useDeliveriesQuery,
  useUsersQuery,
  useVehiclesQuery,
} from "../../hooks";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

type BuildRouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const moveItem = (ids: string[], index: number, direction: -1 | 1) => {
  const next = index + direction;

  if (next < 0 || next >= ids.length) {
    return ids;
  }

  const copy = [...ids];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
};

export const BuildRouteModal = ({ isOpen, onClose }: BuildRouteModalProps) => {
  const user = useSelector(selectUser);
  const { data: usersData } = useUsersQuery();
  const { data: vehiclesData } = useVehiclesQuery();
  const { data: deliveriesData } = useDeliveriesQuery();
  const createRoute = useCreateRouteMutation();
  const assignStops = useAssignRouteStopsMutation();
  const users = usersData ?? [];
  const vehicles = vehiclesData ?? [];
  const deliveries = deliveriesData ?? [];
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  const companyDeliveries = useMemo(
    () =>
      deliveries.filter(
        (item) =>
          item.companyId === user?.companyId && canEditDeliveryAssignment(item.status),
      ),
    [deliveries, user?.companyId],
  );
  const drivers = useMemo(
    () => users.filter((item) => item.companyId === user?.companyId && item.role === "Driver"),
    [users, user?.companyId],
  );
  const companyVehicles = useMemo(
    () => vehicles.filter((item) => item.companyId === user?.companyId),
    [user?.companyId, vehicles],
  );
  const selectedDeliveries = selectedIds
    .map((id) => companyDeliveries.find((item) => item.id === id))
    .filter((item): item is Delivery => Boolean(item));
  const vehicle = companyVehicles.find((item) => item.id === vehicleId);
  const load = selectedDeliveries.reduce((total, item) => total + getDeliveryLoad(item), 0);
  const remaining = vehicle
    ? getVehicleRemainingUnits(vehicle, deliveries, selectedIds)
    : 0;
  const overCapacity = Boolean(vehicle && load > remaining);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDriverId("");
    setVehicleId("");
    setSelectedIds([]);
    setError(undefined);
  }, [isOpen]);

  const toggleDelivery = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setError(undefined);
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const driver = drivers.find((item) => item.id === driverId);

    if (!driver) {
      setError("Select a driver");
      return;
    }

    if (!vehicle) {
      setError("Select a vehicle");
      return;
    }

    if (selectedDeliveries.length === 0) {
      setError("Select at least one stop");
      return;
    }

    if (overCapacity) {
      setError(`This route needs ${load} units, ${vehicle.plate} has ${remaining} left`);
      return;
    }

    const route = await createRoute.mutateAsync({
      driverId: driver.id,
      vehicleId: vehicle.id,
    });
    await assignStops.mutateAsync({
      id: route.id,
      deliveryIds: selectedDeliveries.map((item) => item.id),
    });
    onClose();
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
                Build route
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Group open deliveries onto one driver and vehicle
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}>
            <TextField
              label="Driver"
              select
              fullWidth
              value={driverId}
              onChange={(event) => {
                setDriverId(event.target.value);
                setError(undefined);
              }}
              sx={formFieldSx}
            >
              <MenuItem value="">Select a driver</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Vehicle"
              select
              fullWidth
              value={vehicleId}
              onChange={(event) => {
                setVehicleId(event.target.value);
                setError(undefined);
              }}
              helperText={
                vehicle
                  ? overCapacity
                    ? `Needs ${load} units, ${remaining} remaining`
                    : `${load} / ${remaining} remaining units`
                  : " "
              }
              error={overCapacity}
              sx={formFieldSx}
            >
              <MenuItem value="">Select a vehicle</MenuItem>
              {companyVehicles.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.plate} · {item.name} ({item.type}, {item.maxUnits} units)
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: COLORS.text.tertiary,
                  mb: 1,
                }}
              >
                Stops
              </Typography>
              {companyDeliveries.length === 0 ? (
                <Typography variant="body2" sx={{ color: COLORS.text.muted }}>
                  No open deliveries to sequence
                </Typography>
              ) : (
                companyDeliveries.map((delivery) => (
                  <FormControlLabel
                    key={delivery.id}
                    control={
                      <Checkbox
                        checked={selectedIds.includes(delivery.id)}
                        onChange={() => toggleDelivery(delivery.id)}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                        {delivery.number} · {delivery.clientName} · {getDeliveryLoad(delivery)} units
                      </Typography>
                    }
                    sx={{ display: "flex", ml: 0 }}
                  />
                ))
              )}
            </Box>

            {selectedDeliveries.length > 1 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedDeliveries.map((delivery, index) => (
                  <Box
                    key={delivery.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      px: 1.5,
                      py: 1,
                      borderRadius: "10px",
                      backgroundColor: COLORS.background.subtle,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: COLORS.text.primary }}>
                      {index + 1}. {delivery.number} · {delivery.destination || delivery.clientName}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="Move stop up"
                        disabled={index === 0}
                        onClick={() => setSelectedIds((ids) => moveItem(ids, index, -1))}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Move stop down"
                        disabled={index === selectedDeliveries.length - 1}
                        onClick={() => setSelectedIds((ids) => moveItem(ids, index, 1))}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : null}

            {error ? (
              <Typography variant="body2" sx={{ color: COLORS.error[700] }}>
                {error}
              </Typography>
            ) : null}

            <Button
              type="button"
              variant="contained"
              onClick={handleSubmit}
              disabled={overCapacity}
              sx={submitButtonSx}
            >
              Create route
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
