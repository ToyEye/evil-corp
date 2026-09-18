import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
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

import { getOrderTotal } from "../../data/orders.schema";
import { getCompanyNameForUser } from "../../data/users.dummy";
import { paths } from "../../routing/routes";
import { selectUser } from "../../store/auth/auth.slice";
import { addClientAddress, selectClients } from "../../store/clients/clients.slice";
import {
  adjustInventoryQuantity,
  selectInventoryItems,
} from "../../store/inventory/inventory.slice";
import { addOrder, selectOrders } from "../../store/orders/orders.slice";
import { logOpsEvent } from "../../store/ops/logOpsEvent";
import { addRestockRequest } from "../../store/restock/restock.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { formatMoney } from "../../utils/formatMoney";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { OrderRestockPanel } from "./OrderRestockPanel";
import {
  getShortageSignature,
  nextOrderNumber,
  splitOrderLines,
  type SplitOrderLine,
} from "./orderForm.utils";

type OrderFormValues = {
  clientId: string;
  addressId: string;
  notes: string;
  items: { productId: string; quantity: number }[];
};

const emptyValues: OrderFormValues = {
  clientId: "",
  addressId: "",
  notes: "",
  items: [{ productId: "", quantity: 1 }],
};

export const CreateOrderForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const clients = useSelector(selectClients);
  const inventory = useSelector(selectInventoryItems);
  const orders = useSelector(selectOrders);
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState<string>();
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockNote, setRestockNote] = useState("");
  const [restockDraft, setRestockDraft] = useState<SplitOrderLine[]>([]);
  const [sentShortageSignature, setSentShortageSignature] = useState("");

  const companyClients = useMemo(
    () => clients.filter((item) => item.companyId === user?.companyId),
    [clients, user?.companyId],
  );
  const companyInventory = useMemo(
    () => inventory.filter((item) => item.companyId === user?.companyId),
    [inventory, user?.companyId],
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    defaultValues: emptyValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const formValues = useWatch({ control, defaultValue: emptyValues });
  const clientId = formValues.clientId ?? "";
  const selectedItems = (formValues.items ?? emptyValues.items).map((line) => ({
    productId: line.productId ?? "",
    quantity: Number(line.quantity) || 0,
  }));
  const selectedClient = companyClients.find((item) => item.id === clientId);
  const { items: splitItems, backorder } = useMemo(
    () => splitOrderLines(selectedItems, companyInventory),
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
  const orderTotal = getOrderTotal(splitItems);

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
        .filter((item): item is SplitOrderLine => Boolean(item));
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
    splitItems.length > 0 &&
    !isSubmitting;

  useEffect(() => {
    selectedItems.forEach((line, index) => {
      if (line.productId) {
        void trigger(`items.${index}.quantity`);
      }
    });
  }, [selectedItems, trigger]);

  const updateItemLine = (
    index: number,
    patch: Partial<{ productId: string; quantity: number }>,
  ) => {
    const items = getValues("items").map((line, lineIndex) =>
      lineIndex === index ? { ...line, ...patch } : { ...line },
    );
    setValue("items", items, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

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
            unitPrice: product.price,
            reservedQuantity: 0,
            pickedQuantity: 0,
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

  const handleConfirmShortage = () => {
    if (!restockCanSend) {
      return;
    }

    setSentShortageSignature(getShortageSignature(restockDraft));
  };

  const onSubmit: SubmitHandler<OrderFormValues> = (values) => {
    if (!user || !restockCovered) {
      return;
    }

    const client = companyClients.find((item) => item.id === values.clientId);
    const address = client?.addresses.find((item) => item.id === values.addressId);
    const split = splitOrderLines(values.items, companyInventory);

    if (!client || split.items.length === 0) {
      return;
    }

    const orderId = crypto.randomUUID();
    const number = nextOrderNumber(orders, user.companyId);
    const notes = values.notes.trim();
    const createdAt = new Date().toISOString();

    dispatch(
      addOrder({
        id: orderId,
        number,
        clientId: client.id,
        clientName: client.name,
        addressId: address?.id,
        destination: address?.line,
        notes,
        status: "New",
        fulfillmentStatus: "Waiting",
        items: split.items,
        companyId: user.companyId,
        companyName: user.companyName,
        createdAt,
      }),
    );

    for (const line of split.items) {
      if (line.reservedQuantity > 0) {
        dispatch(adjustInventoryQuantity({ id: line.productId, delta: -line.reservedQuantity }));
      }
    }

    for (const item of split.backorder) {
      dispatch(
        addRestockRequest({
          id: crypto.randomUUID(),
          productId: item.productId,
          sku: item.sku,
          productName: item.name,
          quantity: item.quantity,
          note:
            restockNote.trim() ||
            (selectedClient ? `Shortage for order ${number} to ${selectedClient.name}` : number),
          status: "New",
          purposes: ["order"],
          orderId,
          orderNumber: number,
          requestedById: user.id,
          requestedByName: user.name,
          companyId: user.companyId,
          companyName: user.companyName,
          createdAt,
        }),
      );
    }

    dispatch(
      logOpsEvent({
        companyId: user.companyId,
        entityType: "order",
        entityId: orderId,
        entityNumber: number,
        message:
          split.backorder.length > 0
            ? "Order created with a stock shortage"
            : "Order created",
        actorId: user.id,
        actorName: user.name,
        notify:
          split.backorder.length > 0
            ? [
                {
                  role: "Supply",
                  title: "Shortage on a new order",
                  body: `${number} needs restock before it can ship`,
                  href: paths.suppliersRequests(user.companyName),
                },
                {
                  role: "Storekeeper",
                  title: "Order waiting for stock",
                  body: `${number} is not fully reserved`,
                  href: paths.warehouse(user.companyName),
                },
              ]
            : undefined,
      }),
    );

    navigate(paths.orders(getCompanyNameForUser(user)));
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
              const product = companyInventory.find((item) => item.id === productId);
              const unitPrice = product?.price ?? 0;
              const lineTotal = Number.isFinite(quantity) ? quantity * unitPrice : 0;
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
                          updateItemLine(index, { productId: event.target.value });
                        }}
                        label="Product"
                        select
                        sx={{ ...formFieldSx, flex: 1, minWidth: 220 }}
                      >
                        <MenuItem value="">Select a product</MenuItem>
                        {companyInventory.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name} · {item.quantity} in stock · {formatMoney(item.price)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{
                      validate: (value) =>
                        quantityError(
                          getValues(`items.${index}.productId`),
                          Number(value),
                        ),
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? 1}
                        onChange={(event) => {
                          updateItemLine(index, { quantity: Number(event.target.value) });
                        }}
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
                    )}
                  />
                  {productId ? (
                    <Box sx={{ minWidth: 150, pt: 1 }}>
                      <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                        {formatMoney(unitPrice)} / unit
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                        {formatMoney(lineTotal)}
                      </Typography>
                    </Box>
                  ) : null}
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 0.5,
          }}
        >
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
            Total
          </Typography>
          <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
            {formatMoney(orderTotal)}
          </Typography>
        </Box>

        <Button type="submit" variant="contained" disabled={!canSubmit} sx={submitButtonSx}>
          Create order
        </Button>
        {backorder.length > 0 && !restockCovered ? (
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: -1 }}>
            Confirm the supply request to enable Create order
          </Typography>
        ) : null}
      </Box>

      <OrderRestockPanel
        open={restockOpen}
        items={restockDraft}
        note={restockNote}
        sent={restockAlreadySent}
        canSend={restockCanSend}
        onNoteChange={setRestockNote}
        onRemove={(productId) =>
          setRestockDraft((prev) => prev.filter((item) => item.productId !== productId))
        }
        onSend={handleConfirmShortage}
        onClose={() => setRestockOpen(false)}
      />
    </Box>
  );
};
