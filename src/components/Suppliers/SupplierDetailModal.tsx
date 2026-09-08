import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { SUPPLIER_TYPES, type Supplier } from "../../data/suppliers.schema";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";
import type { SupplierFormValues } from "./SupplierFormModal";

type SupplierDetailModalProps = {
  supplier: Supplier | null;
  canEdit: boolean;
  nameError?: string;
  onClose: () => void;
  onSave: (values: SupplierFormValues) => boolean;
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const toFormValues = (supplier: Supplier): SupplierFormValues => ({
  name: supplier.name,
  type: supplier.type,
  addedAt: supplier.addedAt,
  description: supplier.description,
  doesNotSupply: supplier.doesNotSupply,
  notes: supplier.notes,
});

export const SupplierDetailModal = ({
  supplier,
  canEdit,
  nameError,
  onClose,
  onSave,
}: SupplierDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>();

  useEffect(() => {
    setIsEditing(false);

    if (supplier) {
      reset(toFormValues(supplier));
    }
  }, [reset, supplier]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleSave: SubmitHandler<SupplierFormValues> = (values) => {
    if (onSave(values)) {
      setIsEditing(false);
    }
  };

  return (
    <Modal
      open={Boolean(supplier)}
      onClose={handleClose}
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
      <Fade in={Boolean(supplier)}>
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
                {isEditing ? "Edit supplier" : supplier?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {isEditing
                  ? "Update supplier details and cooperation date"
                  : `Cooperating since ${supplier ? formatDate(supplier.addedAt) : ""}`}
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              onClick={handleClose}
              sx={{
                color: COLORS.text.tertiary,
                backgroundColor: COLORS.background.subtle,
                "&:hover": { backgroundColor: COLORS.background.muted },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {isEditing ? (
            <Box
              component="form"
              onSubmit={handleSubmit(handleSave)}
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              <TextField
                {...register("name", { required: "Name is required" })}
                label="Supplier name"
                fullWidth
                error={Boolean(errors.name) || Boolean(nameError)}
                helperText={errors.name?.message ?? nameError}
                sx={formFieldSx}
              />
              <TextField
                {...register("addedAt", { required: "Cooperation date is required" })}
                label="Cooperating since"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(errors.addedAt)}
                helperText={errors.addedAt?.message}
                sx={formFieldSx}
              />
              <TextField
                {...register("type", { required: "Type is required" })}
                label="Type"
                select
                fullWidth
                error={Boolean(errors.type)}
                helperText={errors.type?.message}
                sx={formFieldSx}
              >
                {SUPPLIER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
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
                {...register("doesNotSupply", { required: "This field is required" })}
                label="Does not supply"
                fullWidth
                multiline
                minRows={2}
                error={Boolean(errors.doesNotSupply)}
                helperText={errors.doesNotSupply?.message}
                sx={formFieldSx}
              />
              <TextField
                {...register("notes")}
                label="Additional notes"
                fullWidth
                multiline
                minRows={2}
                sx={formFieldSx}
              />
              <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    if (supplier) {
                      reset(toFormValues(supplier));
                    }
                    setIsEditing(false);
                  }}
                  sx={{
                    flex: 1,
                    py: 1.1,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    borderColor: COLORS.border.default,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ ...submitButtonSx, mt: 0, flex: 1 }}
                >
                  Save changes
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={supplier?.type}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "8px",
                    backgroundColor: COLORS.primary[50],
                    color: COLORS.primary[700],
                  }}
                />
                <Chip
                  label={`Since ${supplier ? formatDate(supplier.addedAt) : ""}`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "8px",
                    backgroundColor: COLORS.background.muted,
                    color: COLORS.text.secondary,
                  }}
                />
              </Box>

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
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}>
                  {supplier?.description}
                </Typography>
              </Box>

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
                  Does not supply
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}>
                  {supplier?.doesNotSupply}
                </Typography>
              </Box>

              {supplier?.notes ? (
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
                    Additional notes
                  </Typography>
                  <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}>
                    {supplier.notes}
                  </Typography>
                </Box>
              ) : null}

              {canEdit && supplier && (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    mt: 1,
                    py: 1.1,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor: COLORS.primary[600],
                    "&:hover": { backgroundColor: COLORS.primary[700] },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};
