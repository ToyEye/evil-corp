import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import type { InventoryItem } from "../../data/inventory.schema";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";
import { StockQuantityChip } from "./StockQuantityChip";

export type RestockRequestFormValues = {
  quantity: number;
  note: string;
};

type RestockRequestModalProps = {
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: SubmitHandler<RestockRequestFormValues>;
};

const emptyValues: RestockRequestFormValues = {
  quantity: 1,
  note: "",
};

export const RestockRequestModal = ({ item, onClose, onSubmit }: RestockRequestModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RestockRequestFormValues>({
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (item) {
      reset(emptyValues);
    }
  }, [item, reset]);

  const isOpen = Boolean(item);

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
                Request restock
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Send a restock request to the supply department
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
            <Box>
              <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                {item?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: 0.5 }}>
                {item?.sku}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.25 }}>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  Current stock
                </Typography>
                <StockQuantityChip quantity={item?.quantity ?? 0} />
              </Box>
            </Box>

            <TextField
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: { value: 1, message: "Order at least 1 unit" },
              })}
              label="Quantity to order"
              type="number"
              fullWidth
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message ?? "You can request a restock at any current stock level"}
              sx={formFieldSx}
            />
            <TextField
              {...register("note")}
              label="Note for supply"
              fullWidth
              multiline
              minRows={3}
              sx={formFieldSx}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              Send request
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
