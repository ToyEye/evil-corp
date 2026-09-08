import { useEffect } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { formFieldSx, submitButtonSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";
import type { Client } from "../../data/clients.schema";

export type ClientFormValues = {
  name: string;
  phone: string;
  email: string;
  addedAt: string;
  note: string;
  addresses: { id?: string; line: string }[];
};

type ClientFormModalProps = {
  isOpen: boolean;
  client?: Client | null;
  onClose: () => void;
  onSubmit: SubmitHandler<ClientFormValues>;
};

const today = () => new Date().toISOString().slice(0, 10);

const emptyValues: ClientFormValues = {
  name: "",
  phone: "",
  email: "",
  addedAt: today(),
  note: "",
  addresses: [{ line: "" }],
};

const toFormValues = (client?: Client | null): ClientFormValues => {
  if (!client) {
    return { ...emptyValues, addedAt: today(), addresses: [{ line: "" }] };
  }

  return {
    name: client.name,
    phone: client.phone,
    email: client.email,
    addedAt: client.addedAt,
    note: client.note,
    addresses: client.addresses.length
      ? client.addresses.map((address) => ({ id: address.id, line: address.line }))
      : [{ line: "" }],
  };
};

export const ClientFormModal = ({
  isOpen,
  client,
  onClose,
  onSubmit,
}: ClientFormModalProps) => {
  const isEdit = Boolean(client);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    defaultValues: emptyValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "addresses" });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(client));
    }
  }, [client, isOpen, reset]);

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
            width: { xs: "calc(100% - 32px)", sm: 520 },
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
                {isEdit ? "Edit client" : "Add client"}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {isEdit
                  ? "Update contact details, notes, and delivery addresses"
                  : "Save contact details, notes, and delivery addresses"}
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
              {...register("phone", { required: "Phone is required" })}
              label="Phone"
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              sx={formFieldSx}
            />
            <TextField
              {...register("email", { required: "Email is required" })}
              label="Email"
              type="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
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
              {...register("note")}
              label="Note"
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
                Addresses
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <TextField
                      {...register(`addresses.${index}.line`)}
                      label={`Address ${index + 1}`}
                      fullWidth
                      sx={formFieldSx}
                    />
                    <IconButton
                      aria-label="Remove address"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      sx={{ mt: 0.5, color: COLORS.text.tertiary }}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Button
                type="button"
                onClick={() => append({ line: "" })}
                startIcon={<AddIcon />}
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  color: COLORS.primary[700],
                }}
              >
                Add address
              </Button>
            </Box>

            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              {isEdit ? "Save changes" : "Add client"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
