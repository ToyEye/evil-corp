import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { getDeliveryStatusFromSchedule, type Delivery } from "../../data/deliveries.schema";
import { getCompanyNameForUser } from "../../data/users.dummy";
import { paths } from "../../routing/routes";
import { selectUser } from "../../store/auth/auth.slice";
import { addClientAddress, selectClients } from "../../store/clients/clients.slice";
import { addDelivery, selectDeliveries } from "../../store/deliveries/deliveries.slice";
import {
  adjustInventoryQuantity,
  selectInventoryItems,
} from "../../store/inventory/inventory.slice";
import { selectUsers } from "../../store/users/users.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

type DeliveryFormValues = {
  clientId: string;
  driverId: string;
  addressId: string;
  dispatchAt: string;
  deliverBy: string;
  notes: string;
  items: { productId: string; quantity: number }[];
};

const emptyValues: DeliveryFormValues = {
  clientId: "",
  driverId: "",
  addressId: "",
  dispatchAt: "",
  deliverBy: "",
  notes: "",
  items: [{ productId: "", quantity: 1 }],
};

const toIso = (value: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const nextDeliveryNumber = (deliveries: Delivery[], companyId: string) => {
  const maxNumber = deliveries
    .filter((item) => item.companyId === companyId)
    .reduce((max, item) => {
      const match = item.number.match(/(\d+)$/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 0);

  return `DLV-${String(maxNumber + 1).padStart(4, "0")}`;
};

export const CreateDeliveryForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const clients = useSelector(selectClients);
  const users = useSelector(selectUsers);
  const inventory = useSelector(selectInventoryItems);
  const deliveries = useSelector(selectDeliveries);
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState<string>();

  const companyClients = useMemo(
    () => clients.filter((item) => item.companyId === user?.companyId),
    [clients, user?.companyId],
  );
  const drivers = useMemo(
    () =>
      users.filter(
        (item) => item.companyId === user?.companyId && item.role === "driver",
      ),
    [user?.companyId, users],
  );
  const stock = useMemo(
    () => inventory.filter((item) => item.companyId === user?.companyId && item.quantity > 0),
    [inventory, user?.companyId],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormValues>({
    defaultValues: emptyValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const clientId = watch("clientId");
  const selectedItems = watch("items");
  const selectedClient = companyClients.find((item) => item.id === clientId);

  useEffect(() => {
    const client = companyClients.find((item) => item.id === clientId);
    setValue("addressId", client?.addresses[0]?.id ?? "");
    setNewAddress("");
    setAddressError(undefined);
    // Reset the address only when the selected client changes, not when a new
    // address is appended to the same client.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- companyClients is read for the current clientId snapshot
  }, [clientId, setValue]);

  const remainingStock = (productId: string, index: number) => {
    const product = stock.find((item) => item.id === productId);

    if (!product) {
      return 0;
    }

    const usedElsewhere = selectedItems.reduce((total, line, lineIndex) => {
      if (lineIndex === index || line.productId !== productId) {
        return total;
      }

      return total + Number(line.quantity || 0);
    }, 0);

    return Math.max(0, product.quantity - usedElsewhere);
  };

  const quantityError = (productId: string, quantity: number, index: number) => {
    if (!productId) {
      return true;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return "Quantity must be at least 1";
    }

    const available = remainingStock(productId, index);

    if (quantity > available) {
      return `Only ${available} available in stock`;
    }

    return true;
  };

  const hasClient = Boolean(clientId);
  const selectedProductLines = selectedItems.filter((line) => line.productId);
  const hasProduct = selectedProductLines.length > 0;
  const quantitiesValid = selectedItems.every((line, index) =>
    quantityError(line.productId, Number(line.quantity), index) === true,
  );
  const canSubmit = hasClient && hasProduct && quantitiesValid && !isSubmitting;

  useEffect(() => {
    selectedItems.forEach((line, index) => {
      if (line.productId) {
        void trigger(`items.${index}.quantity`);
      }
    });
  }, [selectedItems, trigger]);

  const handleAddAddress = () => {
    const line = newAddress.trim();

    if (!selectedClient) {
      setAddressError("Select a client first");
      return;
    }

    if (!line) {
      setAddressError("Address is required");
      return;
    }

    const address = { id: crypto.randomUUID(), line };
    dispatch(addClientAddress({ clientId: selectedClient.id, address }));
    setValue("addressId", address.id);
    setNewAddress("");
    setAddressError(undefined);
  };

  const onSubmit: SubmitHandler<DeliveryFormValues> = (values) => {
    if (!user) {
      return;
    }

    const client = companyClients.find((item) => item.id === values.clientId);
    const driver = drivers.find((item) => item.id === values.driverId);
    const address = client?.addresses.find((item) => item.id === values.addressId);

    if (!client) {
      return;
    }

    const lines = values.items
      .map((line) => {
        const product = stock.find((item) => item.id === line.productId);
        return product
          ? {
              productId: product.id,
              sku: product.sku,
              name: product.name,
              quantity: Number(line.quantity),
            }
          : null;
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line));

    if (lines.length === 0) {
      return;
    }

    const dispatchAt = toIso(values.dispatchAt);
    const deliverBy = toIso(values.deliverBy);

    dispatch(
      addDelivery({
        id: crypto.randomUUID(),
        number: nextDeliveryNumber(deliveries, user.companyId),
        clientId: client.id,
        clientName: client.name,
        driverId: driver?.id,
        driverName: driver?.name,
        addressId: address?.id,
        destination: address?.line,
        dispatchAt,
        deliverBy,
        notes: values.notes.trim(),
        status: getDeliveryStatusFromSchedule(dispatchAt, deliverBy),
        items: lines,
        reservesStock: true,
        companyId: user.companyId,
        companyName: user.companyName,
        createdAt: new Date().toISOString(),
      }),
    );

    for (const line of lines) {
      dispatch(adjustInventoryQuantity({ id: line.productId, delta: -line.quantity }));
    }

    navigate(paths.deliveries(getCompanyNameForUser(user)));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        {...register("clientId")}
        label="Client"
        select
        fullWidth
        sx={formFieldSx}
      >
        {companyClients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...register("addressId")}
        label="Delivery address"
        select
        fullWidth
        disabled={!selectedClient}
        sx={formFieldSx}
      >
        {(selectedClient?.addresses ?? []).map((address) => (
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
          disabled={!selectedClient}
          sx={formFieldSx}
        />
        <Button
          type="button"
          variant="outlined"
          onClick={handleAddAddress}
          disabled={!selectedClient}
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

      <TextField
        {...register("driverId")}
        label="Driver"
        select
        fullWidth
        sx={formFieldSx}
      >
        {drivers.map((driver) => (
          <MenuItem key={driver.id} value={driver.id}>
            {driver.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...register("dispatchAt")}
        label="Planned dispatch"
        type="datetime-local"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        sx={formFieldSx}
      />
      <TextField
        {...register("deliverBy")}
        label="Planned delivery"
        type="datetime-local"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        sx={formFieldSx}
      />
      <TextField
        {...register("notes")}
        label="Notes"
        fullWidth
        multiline
        minRows={2}
        sx={formFieldSx}
      />

      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: COLORS.text.tertiary,
            mb: 1.25,
          }}
        >
          Warehouse goods
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {fields.map((field, index) => {
            const productId = selectedItems[index]?.productId;
            const maxQuantity = remainingStock(productId, index);

            return (
              <Box
                key={field.id}
                sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap" }}
              >
                <TextField
                  {...register(`items.${index}.productId`, {
                    onChange: () => {
                      void trigger(`items.${index}.quantity`);
                    },
                  })}
                  label="Product"
                  select
                  sx={{ ...formFieldSx, flex: 1, minWidth: 220 }}
                >
                  {stock.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} · {item.quantity} in stock
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                    validate: (value) =>
                      quantityError(
                        getValues(`items.${index}.productId`),
                        Number(value),
                        index,
                      ),
                    onChange: () => {
                      void trigger(`items.${index}.quantity`);
                    },
                  })}
                  label="Qty"
                  type="number"
                  sx={{ ...formFieldSx, width: 120 }}
                  error={Boolean(errors.items?.[index]?.quantity)}
                  helperText={errors.items?.[index]?.quantity?.message}
                  slotProps={{ htmlInput: { min: 1, max: maxQuantity || undefined } }}
                />
                <IconButton
                  aria-label="Remove product"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  sx={{ mt: 0.5, color: COLORS.text.tertiary }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
        <Button
          type="button"
          onClick={() => append({ productId: "", quantity: 1 })}
          startIcon={<AddIcon />}
          sx={{
            mt: 1.5,
            textTransform: "none",
            fontWeight: 600,
            color: COLORS.primary[700],
          }}
        >
          Add product
        </Button>
      </Box>

      <Button type="submit" variant="contained" disabled={!canSubmit} sx={submitButtonSx}>
        Create delivery
      </Button>
    </Box>
  );
};
