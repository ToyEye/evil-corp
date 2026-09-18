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

import { VEHICLE_TYPES, type VehicleType } from "../../data/vehicles.schema";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

export type VehicleFormValues = {
  name: string;
  plate: string;
  type: VehicleType;
  maxUnits: number;
};

type VehicleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<VehicleFormValues>;
};

const emptyValues: VehicleFormValues = {
  name: "",
  plate: "",
  type: "Van",
  maxUnits: 20,
};

export const VehicleFormModal = ({ isOpen, onClose, onSubmit }: VehicleFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(emptyValues);
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
                Add vehicle
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Capacity is counted in product units on open trips
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
              label="Name"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              sx={formFieldSx}
            />
            <TextField
              {...register("plate", { required: "Plate is required" })}
              label="Plate"
              fullWidth
              error={Boolean(errors.plate)}
              helperText={errors.plate?.message}
              sx={formFieldSx}
            />
            <TextField
              {...register("type", { required: "Type is required" })}
              label="Type"
              select
              fullWidth
              sx={formFieldSx}
            >
              {VEHICLE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register("maxUnits", {
                required: "Capacity is required",
                valueAsNumber: true,
                min: { value: 1, message: "Capacity must be at least 1" },
              })}
              label="Max units"
              type="number"
              fullWidth
              error={Boolean(errors.maxUnits)}
              helperText={errors.maxUnits?.message}
              sx={formFieldSx}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              Add vehicle
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
