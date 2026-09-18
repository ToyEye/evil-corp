import { useEffect } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
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

import { getAssignableMemberRoles } from "../../data/companies.dummy";
import type { Company } from "../../data/companies.schema";
import type { UserRole } from "../../data/users.schema";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

export type UserFormValues = {
  name: string;
  email: string;
  companyId: string;
  role: UserRole;
};

type UserFormModalProps = {
  isOpen: boolean;
  companies: Company[];
  showCompanyField: boolean;
  defaultCompanyId: string;
  emailError?: string;
  onClose: () => void;
  onSubmit: SubmitHandler<UserFormValues>;
};

const defaultRoleFor = (companyId: string): UserRole => {
  const roles = getAssignableMemberRoles(companyId);
  return roles.includes("Staff") ? "Staff" : roles[0];
};

export const UserFormModal = ({
  isOpen,
  companies,
  showCompanyField,
  defaultCompanyId,
  emailError,
  onClose,
  onSubmit,
}: UserFormModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      companyId: defaultCompanyId,
      role: defaultRoleFor(defaultCompanyId),
    },
  });
  const companyId = useWatch({ control, name: "companyId" }) || defaultCompanyId;
  const roles = getAssignableMemberRoles(companyId);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      name: "",
      email: "",
      companyId: defaultCompanyId,
      role: defaultRoleFor(defaultCompanyId),
    });
  }, [defaultCompanyId, isOpen, reset]);

  useEffect(() => {
    const nextRoles = getAssignableMemberRoles(companyId);

    if (nextRoles.length === 0) {
      return;
    }

    setValue("role", nextRoles.includes("Staff") ? "Staff" : nextRoles[0]);
  }, [companyId, setValue]);

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
                Add personnel
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Create a login for someone in the company
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              label="Email"
              type="email"
              fullWidth
              error={Boolean(errors.email) || Boolean(emailError)}
              helperText={errors.email?.message ?? emailError}
              sx={formFieldSx}
            />
            {showCompanyField ? (
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company"
                    select
                    fullWidth
                    sx={formFieldSx}
                  >
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            ) : null}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Role" select fullWidth sx={formFieldSx}>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
              Add person
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
