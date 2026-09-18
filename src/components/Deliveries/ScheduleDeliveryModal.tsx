import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
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

import { getDeliveryStatusFromSchedule, getDeliveryLoad, type DeliveryItem } from "../../data/deliveries.schema";
import { getVehicleRemainingUnits } from "../../data/fleet.utils";
import { getOrderTotal, type Order } from "../../data/orders.schema";
import { addClientAddress, selectClients } from "../../store/clients/clients.slice";
import { addDelivery, selectDeliveries } from "../../store/deliveries/deliveries.slice";
import { selectUser } from "../../store/auth/auth.slice";
import { logOpsEvent } from "../../store/ops/logOpsEvent";
import { selectUsers } from "../../store/users/users.slice";
import { selectVehicles } from "../../store/vehicles/vehicles.slice";
import { useAppDispatch } from "../../store/types";
import { paths } from "../../routing/routes";
import { COLORS } from "../../theme/COLORS";
import { formatMoney } from "../../utils/formatMoney";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { nextDeliveryNumber } from "./deliveryForm.utils";

type ScheduleDeliveryFormValues = {
  addressId: string;
  driverId: string;
  vehicleId: string;
  deliverBy: string;
};

type ScheduleDeliveryModalProps = {
  order: Order | null;
  onClose: () => void;
};

const toIso = (value: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const ScheduleDeliveryModal = ({ order, onClose }: ScheduleDeliveryModalProps) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const clients = useSelector(selectClients);
  const users = useSelector(selectUsers);
  const deliveries = useSelector(selectDeliveries);
  const vehicles = useSelector(selectVehicles);
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState<string>();
  const isOpen = Boolean(order);
  const client = clients.find((item) => item.id === order?.clientId);
  const drivers = useMemo(
    () =>
      users.filter(
        (item) => item.companyId === order?.companyId && item.role === "Driver",
      ),
    [order?.companyId, users],
  );
  const companyVehicles = useMemo(
    () => vehicles.filter((item) => item.companyId === order?.companyId),
    [order?.companyId, vehicles],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<ScheduleDeliveryFormValues>({
    defaultValues: {
      addressId: "",
      driverId: "",
      vehicleId: "",
      deliverBy: "",
    },
  });
  const selectedVehicleId = useWatch({ control, name: "vehicleId" });
  const load = order ? getDeliveryLoad({ items: order.items }) : 0;
  const selectedVehicle = companyVehicles.find((item) => item.id === selectedVehicleId);
  const remaining = selectedVehicle
    ? getVehicleRemainingUnits(selectedVehicle, deliveries)
    : 0;
  const overCapacity = Boolean(selectedVehicle && load > remaining);

  useEffect(() => {
    if (!order) {
      return;
    }

    reset({
      addressId: order.addressId ?? client?.addresses[0]?.id ?? "",
      driverId: "",
      vehicleId: "",
      deliverBy: "",
    });
    setNewAddress("");
    setAddressError(undefined);
  }, [client?.addresses, order, reset]);

  const handleAddAddress = () => {
    const line = newAddress.trim();

    if (!client) {
      setAddressError("Client is missing");
      return;
    }

    if (!line) {
      setAddressError("Address is required");
      return;
    }

    const address = { id: crypto.randomUUID(), line };
    dispatch(addClientAddress({ clientId: client.id, address }));
    setValue("addressId", address.id);
    setNewAddress("");
    setAddressError(undefined);
  };

  const onSubmit: SubmitHandler<ScheduleDeliveryFormValues> = (values) => {
    if (!user || !order || !client) {
      return;
    }

    const address = client.addresses.find((item) => item.id === values.addressId);
    const driver = drivers.find((item) => item.id === values.driverId);
    const vehicle = companyVehicles.find((item) => item.id === values.vehicleId);
    const deliverBy = toIso(values.deliverBy);
    const items: DeliveryItem[] = order.items.map((item) => ({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
    }));

    if (vehicle && getDeliveryLoad({ items }) > getVehicleRemainingUnits(vehicle, deliveries)) {
      return;
    }

    const number = nextDeliveryNumber(deliveries, user.companyId);
    const deliveryId = crypto.randomUUID();

    dispatch(
      addDelivery({
        id: deliveryId,
        number,
        clientId: client.id,
        clientName: client.name,
        driverId: driver?.id,
        driverName: driver?.name,
        vehicleId: vehicle?.id,
        vehicleName: vehicle ? `${vehicle.plate} · ${vehicle.name}` : undefined,
        addressId: address?.id,
        destination: address?.line,
        lat: address?.lat,
        lng: address?.lng,
        deliverBy,
        notes: order.notes,
        status: getDeliveryStatusFromSchedule(undefined, deliverBy),
        items,
        reservesStock: false,
        stockWrittenOff: false,
        orderId: order.id,
        orderNumber: order.number,
        companyId: user.companyId,
        companyName: user.companyName,
        createdAt: new Date().toISOString(),
      }),
    );
    dispatch(
      logOpsEvent({
        companyId: user.companyId,
        entityType: "delivery",
        entityId: deliveryId,
        entityNumber: number,
        message: driver ? `Scheduled for ${driver.name}` : "Delivery scheduled",
        actorId: user.id,
        actorName: user.name,
        notify: driver
          ? [
              {
                userId: driver.id,
                title: "New trip assigned",
                body: `${number} to ${client.name}`,
                href: paths.deliveries(user.companyName),
              },
            ]
          : [
              {
                role: "SEO",
                title: "Delivery has no driver",
                body: `${number} is scheduled without a driver`,
                href: paths.deliveries(user.companyName),
              },
            ],
      }),
    );
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
                Schedule delivery
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {order?.number} · {order?.clientName}
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
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              <TextField
                label="Client"
                value={order.clientName}
                fullWidth
                disabled
                sx={formFieldSx}
              />

              <Controller
                name="addressId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label="Delivery address"
                    select
                    fullWidth
                    sx={formFieldSx}
                  >
                    <MenuItem value="">Select an address</MenuItem>
                    {(client?.addresses ?? []).map((address) => (
                      <MenuItem key={address.id} value={address.id}>
                        {address.line}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

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
                  Products
                </Typography>
                {order.items.map((item) => (
                  <Typography
                    key={`${item.productId}-${item.sku}`}
                    variant="body2"
                    sx={{ color: COLORS.text.secondary, lineHeight: 1.7 }}
                  >
                    {item.quantity} × {item.name} ({item.sku}) · {formatMoney(item.unitPrice)}
                  </Typography>
                ))}
                <Typography sx={{ fontWeight: 700, color: COLORS.text.primary, mt: 1 }}>
                  Total {formatMoney(getOrderTotal(order.items))}
                </Typography>
              </Box>

              <Controller
                name="vehicleId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label="Vehicle"
                    select
                    fullWidth
                    error={overCapacity}
                    helperText={
                      selectedVehicle
                        ? overCapacity
                          ? `Needs ${load} units, ${remaining} remaining on ${selectedVehicle.plate}`
                          : `${load} units · ${remaining} remaining on ${selectedVehicle.plate}`
                        : "Optional. Capacity is counted on open trips."
                    }
                    sx={formFieldSx}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {companyVehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate} · {vehicle.name} ({vehicle.type}, {vehicle.maxUnits} units)
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="driverId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label="Driver"
                    select
                    fullWidth
                    sx={formFieldSx}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                {...register("deliverBy")}
                label="Delivery date"
                type="datetime-local"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                sx={formFieldSx}
              />

              <Button type="submit" variant="contained" disabled={isSubmitting || overCapacity} sx={submitButtonSx}>
                Schedule delivery
              </Button>
            </Box>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
};
