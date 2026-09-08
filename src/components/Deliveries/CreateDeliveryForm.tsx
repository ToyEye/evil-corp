import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";

import {
  getDeliveryStatusFromSchedule,
  type DeliveryItem,
} from "../../data/deliveries.schema";
import { getCompanyNameForUser } from "../../data/users.dummy";
import { paths } from "../../routing/routes";
import { selectUser } from "../../store/auth/auth.slice";
import { addClientAddress, selectClients } from "../../store/clients/clients.slice";
import { addDelivery, selectDeliveries } from "../../store/deliveries/deliveries.slice";
import {
  adjustInventoryQuantity,
  selectInventoryItems,
} from "../../store/inventory/inventory.slice";
import { addRestockRequest } from "../../store/restock/restock.slice";
import { selectUsers } from "../../store/users/users.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { DeliveryRestockPanel } from "./DeliveryRestockPanel";
import {
  getShortageSignature,
  nextDeliveryNumber,
  splitDeliveryLines,
  type SplitDeliveryLine,
} from "./deliveryForm.utils";

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
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockNote, setRestockNote] = useState("");
  const [restockDraft, setRestockDraft] = useState<SplitDeliveryLine[]>([]);
  const [sentShortageSignature, setSentShortageSignature] = useState("");

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
  const companyInventory = useMemo(
    () => inventory.filter((item) => item.companyId === user?.companyId),
    [inventory, user?.companyId],
  );
  const stock = useMemo(
    () => companyInventory.filter((item) => item.quantity > 0),
    [companyInventory],
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
  const { inStock, backorder } = useMemo(
    () => splitDeliveryLines(selectedItems, companyInventory),
    [companyInventory, selectedItems],
  );
  const shortageSignature = getShortageSignature(backorder);
  const draftSignature = getShortageSignature(restockDraft);
  const restockCovered =
    backorder.length === 0 || sentShortageSignature === shortageSignature;
  const restockAlreadySent =
    Boolean(sentShortageSignature) &&
    (sentShortageSignature === shortageSignature || sentShortageSignature === draftSignature);
  const restockCanSend =
    restockDraft.length > 0 &&
    !restockAlreadySent &&
    (backorder.length === 0 ||
      backorder.every((item) =>
        restockDraft.some(
          (draft) =>
            draft.productId === item.productId &&
            Number(draft.quantity) === Number(item.quantity),
        ),
      ));

  useEffect(() => {
    const client = companyClients.find((item) => item.id === clientId);
    setValue("addressId", client?.addresses[0]?.id ?? "");
    setNewAddress("");
    setAddressError(undefined);
    // Reset the address only when the selected client changes, not when a new
    // address is appended to the same client.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- companyClients is read for the current clientId snapshot
  }, [clientId, setValue]);

  useEffect(() => {
    setRestockDraft((prev) => {
      if (prev.length === 0 || backorder.length === 0) {
        return prev;
      }

      const byId = new Map(backorder.map((item) => [item.productId, item]));
      const next = prev
        .map((item) => byId.get(item.productId) ?? null)
        .filter((item): item is SplitDeliveryLine => Boolean(item));
      const unchanged =
        next.length === prev.length &&
        next.every(
          (item, index) =>
            item.productId === prev[index].productId && item.quantity === prev[index].quantity,
        );

      return unchanged ? prev : next;
    });
  }, [shortageSignature, backorder]);

  const remainingStock = (productId: string, index: number) => {
    const product = companyInventory.find((item) => item.id === productId);

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

  const quantityError = (productId: string, quantity: number) => {
    if (!productId) {
      return true;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return "Quantity must be at least 1";
    }

    return true;
  };

  const hasClient = Boolean(clientId);
  const selectedProductLines = selectedItems.filter((line) => line.productId);
  const hasProduct = selectedProductLines.length > 0;
  const quantitiesValid = selectedItems.every(
    (line) => quantityError(line.productId, Number(line.quantity)) === true,
  );
  const canSubmit =
    hasClient &&
    hasProduct &&
    quantitiesValid &&
    restockCovered &&
    (inStock.length > 0 || backorder.length > 0) &&
    !isSubmitting;

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

  const handleAddShortage = (index: number) => {
    setRestockOpen(true);

    const productId = getValues(`items.${index}.productId`) ?? "";
    const product = companyInventory.find((item) => item.id === productId);
    const shortageQty = Math.max(
      0,
      Number(getValues(`items.${index}.quantity`)) - remainingStock(productId, index),
    );
    const shortage =
      backorder.find((item) => item.productId === productId) ??
      (product && shortageQty > 0
        ? {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            quantity: shortageQty,
          }
        : null);

    if (!shortage) {
      return;
    }

    setRestockDraft((prev) => {
      const exists = prev.some((item) => item.productId === shortage.productId);
      return exists
        ? prev.map((item) => (item.productId === shortage.productId ? shortage : item))
        : [...prev, shortage];
    });
  };

  const handleSendRestock = () => {
    if (!user || !restockCanSend) {
      return;
    }

    const note =
      restockNote.trim() ||
      (selectedClient ? `Shortage for delivery to ${selectedClient.name}` : "");

    const previousKeys = new Set(sentShortageSignature.split("|").filter(Boolean));

    for (const item of restockDraft) {
      const key = `${item.productId}:${item.quantity}`;

      if (previousKeys.has(key)) {
        continue;
      }

      dispatch(
        addRestockRequest({
          id: crypto.randomUUID(),
          productId: item.productId,
          sku: item.sku,
          productName: item.name,
          quantity: item.quantity,
          note,
          requestedById: user.id,
          requestedByName: user.name,
          companyId: user.companyId,
          companyName: user.companyName,
          createdAt: new Date().toISOString(),
        }),
      );
    }

    setSentShortageSignature(getShortageSignature(restockDraft));
  };

  const onSubmit: SubmitHandler<DeliveryFormValues> = (values) => {
    if (!user || !restockCovered) {
      return;
    }

    const client = companyClients.find((item) => item.id === values.clientId);
    const driver = drivers.find((item) => item.id === values.driverId);
    const address = client?.addresses.find((item) => item.id === values.addressId);
    const split = splitDeliveryLines(values.items, companyInventory);

    if (!client || (split.inStock.length === 0 && split.backorder.length === 0)) {
      return;
    }

    const dispatchAt = toIso(values.dispatchAt);
    const deliverBy = toIso(values.deliverBy);
    const notes = values.notes.trim();
    const createdAt = new Date().toISOString();
    let numberOffset = 0;

    const createDelivery = (
      items: DeliveryItem[],
      options: {
        includeSchedule: boolean;
        reservesStock: boolean;
        extraNotes?: string;
      },
    ) => {
      const number = nextDeliveryNumber(deliveries, user.companyId, numberOffset);
      numberOffset += 1;

      dispatch(
        addDelivery({
          id: crypto.randomUUID(),
          number,
          clientId: client.id,
          clientName: client.name,
          driverId: options.includeSchedule ? driver?.id : undefined,
          driverName: options.includeSchedule ? driver?.name : undefined,
          addressId: address?.id,
          destination: address?.line,
          dispatchAt: options.includeSchedule ? dispatchAt : undefined,
          deliverBy: options.includeSchedule ? deliverBy : undefined,
          notes: options.extraNotes ?? notes,
          status: getDeliveryStatusFromSchedule(
            options.includeSchedule ? dispatchAt : undefined,
            options.includeSchedule ? deliverBy : undefined,
          ),
          items,
          reservesStock: options.reservesStock,
          companyId: user.companyId,
          companyName: user.companyName,
          createdAt,
        }),
      );
    };

    if (split.inStock.length > 0) {
      createDelivery(split.inStock, { includeSchedule: true, reservesStock: true });

      for (const line of split.inStock) {
        dispatch(adjustInventoryQuantity({ id: line.productId, delta: -line.quantity }));
      }
    }

    if (split.backorder.length > 0) {
      createDelivery(split.backorder, {
        includeSchedule: false,
        reservesStock: false,
        extraNotes: [notes, "Awaiting restock"].filter(Boolean).join("\n"),
      });
    }

    navigate(paths.deliveries(getCompanyNameForUser(user)));
  };

  return (
    <Box sx={{ maxWidth: 760 }}>
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
        <Controller
          name="clientId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label="Client"
              select
              fullWidth
              sx={formFieldSx}
            >
              <MenuItem value="">Select a client</MenuItem>
              {companyClients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
          )}
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
              disabled={!selectedClient}
              sx={formFieldSx}
            >
              <MenuItem value="">Select an address</MenuItem>
              {(selectedClient?.addresses ?? []).map((address) => (
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
              const productId = selectedItems[index]?.productId ?? "";
              const quantity = Number(selectedItems[index]?.quantity);
              const available = remainingStock(productId, index);
              const lineShortage = productId ? Math.max(0, quantity - available) : 0;
              const inDraft = restockDraft.some((item) => item.productId === productId);

              return (
                <Box
                  key={field.id}
                  sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap" }}
                >
                  <Controller
                    name={`items.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => {
                          field.onChange(event);
                          void trigger(`items.${index}.quantity`);
                        }}
                        label="Product"
                        select
                        sx={{ ...formFieldSx, flex: 1, minWidth: 220 }}
                      >
                        <MenuItem value="">Select a product</MenuItem>
                        {stock.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name} · {item.quantity} in stock
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <TextField
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                      validate: (value) =>
                        quantityError(getValues(`items.${index}.productId`), Number(value)),
                      onChange: () => {
                        void trigger(`items.${index}.quantity`);
                      },
                    })}
                    label="Qty"
                    type="number"
                    sx={{ ...formFieldSx, width: 120 }}
                    error={Boolean(errors.items?.[index]?.quantity) || lineShortage > 0}
                    helperText={
                      errors.items?.[index]?.quantity?.message ??
                      (lineShortage > 0
                        ? `Only ${available} in stock · ${lineShortage} to restock`
                        : undefined)
                    }
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                  {lineShortage > 0 ? (
                    <Tooltip title="Add missing quantity to supply request">
                      <IconButton
                        type="button"
                        aria-label="Add missing quantity to supply request"
                        onClick={() => handleAddShortage(index)}
                        sx={{
                          mt: 0.5,
                          color: inDraft ? COLORS.primary[700] : COLORS.text.tertiary,
                          backgroundColor: inDraft ? COLORS.primary[50] : "transparent",
                        }}
                      >
                        <PlaylistAddOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
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
        {backorder.length > 0 && !restockCovered ? (
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: -1 }}>
            Send the supply request to enable Create delivery
          </Typography>
        ) : null}
      </Box>

      <DeliveryRestockPanel
        open={restockOpen}
        items={restockDraft}
        note={restockNote}
        sent={restockAlreadySent}
        canSend={restockCanSend}
        onNoteChange={setRestockNote}
        onRemove={(productId) =>
          setRestockDraft((prev) => prev.filter((item) => item.productId !== productId))
        }
        onSend={handleSendRestock}
        onClose={() => setRestockOpen(false)}
      />
    </Box>
  );
};
