import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import type { InventoryItem } from "../../data/inventory.schema";
import { RESTOCK_PURPOSE_LABELS, type RestockPurpose } from "../../data/restock.schema";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";

export type SupplyRequestFormValues = {
  productId: string;
  quantity: number;
  purposes: RestockPurpose[];
  note: string;
};

type SupplyRequestFormModalProps = {
  open: boolean;
  products: InventoryItem[];
  onClose: () => void;
  onSubmit: SubmitHandler<SupplyRequestFormValues>;
};

const emptyValues: SupplyRequestFormValues = {
  productId: "",
  quantity: 1,
  purposes: [],
  note: "",
};

export const SupplyRequestFormModal = ({
  open,
  products,
  onClose,
  onSubmit,
}: SupplyRequestFormModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SupplyRequestFormValues>({
    defaultValues: emptyValues,
  });

  const purposes = watch("purposes");
  const noteRequired = purposes.includes("order");

  useEffect(() => {
    if (open) {
      reset(emptyValues);
    }
  }, [open, reset]);

  return (
    <Modal
      open={open}
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
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 32px)", sm: 480 },
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
                Create supply request
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Choose the purpose of this inbound shipment
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

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
          >
            <Controller
              name="productId"
              control={control}
              rules={{ required: "Product is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Product"
                  select
                  fullWidth
                  error={Boolean(errors.productId)}
                  helperText={errors.productId?.message}
                  sx={formFieldSx}
                >
                  <MenuItem value="">Select a product</MenuItem>
                  {products.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} · {item.sku}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: { value: 1, message: "Order at least 1 unit" },
              })}
              label="Quantity"
              type="number"
              fullWidth
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              sx={formFieldSx}
            />
            <Controller
              name="purposes"
              control={control}
              rules={{
                validate: (value) =>
                  value.length > 0 || "Select at least one purpose",
              }}
              render={({ field }) => (
                <FormControl error={Boolean(errors.purposes)}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: COLORS.text.tertiary,
                      mb: 0.5,
                    }}
                  >
                    Purpose
                  </Typography>
                  <FormGroup>
                    {(["order", "warehouse"] as const).map((purpose) => (
                      <FormControlLabel
                        key={purpose}
                        control={
                          <Checkbox
                            checked={field.value.includes(purpose)}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...field.value, purpose]
                                : field.value.filter((item) => item !== purpose);
                              field.onChange(next);
                            }}
                          />
                        }
                        label={RESTOCK_PURPOSE_LABELS[purpose]}
                      />
                    ))}
                  </FormGroup>
                  {errors.purposes?.message ? (
                    <FormHelperText>{errors.purposes.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <TextField
              {...register("note", {
                validate: (value) =>
                  !noteRequired ||
                  value.trim().length > 0 ||
                  "Write the order number in notes",
              })}
              label="Notes"
              fullWidth
              multiline
              minRows={3}
              error={Boolean(errors.note)}
              helperText={
                errors.note?.message ??
                (noteRequired
                  ? "Required. Write the order number, for example ORD-1001."
                  : "Optional")
              }
              sx={formFieldSx}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              Create request
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
