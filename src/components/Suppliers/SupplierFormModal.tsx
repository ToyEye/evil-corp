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

import { SUPPLIER_TYPES, type SupplierType } from "../../data/suppliers.schema";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";

export type SupplierFormValues = {
  name: string;
  type: SupplierType;
  addedAt: string;
  description: string;
  doesNotSupply: string;
  notes: string;
};

type SupplierFormModalProps = {
  isOpen: boolean;
  nameError?: string;
  onClose: () => void;
  onSubmit: SubmitHandler<SupplierFormValues>;
};

const today = () => new Date().toISOString().slice(0, 10);

const emptyValues: SupplierFormValues = {
  name: "",
  type: "Distributor",
  addedAt: today(),
  description: "",
  doesNotSupply: "",
  notes: "",
};

export const SupplierFormModal = ({
  isOpen,
  nameError,
  onClose,
  onSubmit,
}: SupplierFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset({ ...emptyValues, addedAt: today() });
    }
  }, [isOpen, reset]);

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
                Add supplier
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Register a new supplier for your company
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
              {...register("name", { required: "Name is required" })}
              label="Supplier name"
              fullWidth
              error={Boolean(errors.name) || Boolean(nameError)}
              helperText={errors.name?.message ?? nameError}
              sx={formFieldSx}
            />
            <TextField
              {...register("addedAt", { required: "Date added is required" })}
              label="Date added"
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
              helperText={errors.doesNotSupply?.message ?? "Goods or services this supplier does not provide"}
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
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              Add supplier
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
