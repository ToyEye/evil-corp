import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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

import { INVENTORY_CATEGORIES, type InventoryItem } from "../../data/inventory.schema";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";

export type ProductFormValues = {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  category: InventoryItem["category"];
};

type ProductFormModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  initialValues?: ProductFormValues;
  skuError?: string;
  onClose: () => void;
  onSubmit: SubmitHandler<ProductFormValues>;
};

const emptyValues: ProductFormValues = {
  sku: "",
  name: "",
  description: "",
  quantity: 0,
  category: "Packaging",
};

export const ProductFormModal = ({
  isOpen,
  mode,
  initialValues,
  skuError,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialValues ?? emptyValues);
    }
  }, [initialValues, isOpen, reset]);

  const isEdit = mode === "edit";

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
                {isEdit ? "Edit product" : "Add product"}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {isEdit
                  ? "Update stock quantity, category, and details"
                  : "Create a new warehouse item"}
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
            <TextField
              {...register("sku", { required: "SKU is required" })}
              label="SKU"
              fullWidth
              disabled={isEdit}
              error={Boolean(errors.sku) || Boolean(skuError)}
              helperText={errors.sku?.message ?? skuError}
              sx={formFieldSx}
            />
            <TextField
              {...register("name", { required: "Name is required" })}
              label="Product name"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              sx={formFieldSx}
            />
            <TextField
              {...register("description", { required: "Description is required" })}
              label="Description"
              fullWidth
              multiline
              minRows={3}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              sx={formFieldSx}
            />
            <TextField
              {...register("category", { required: "Category is required" })}
              label="Category"
              select
              fullWidth
              error={Boolean(errors.category)}
              helperText={errors.category?.message}
              sx={formFieldSx}
            >
              {INVENTORY_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: { value: 0, message: "Quantity cannot be negative" },
              })}
              label={isEdit ? "Quantity" : "Initial quantity"}
              type="number"
              fullWidth
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              sx={formFieldSx}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              {isEdit ? "Save changes" : "Add product"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
