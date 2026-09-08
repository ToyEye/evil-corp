import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { dummyUsers } from "../../data/users.dummy";
import { selectUser, updateCurrentUser } from "../../store/auth/auth.slice";
import {
  selectCompanies,
  updateCompany,
} from "../../store/companies/companies.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { paths } from "../../routing/routes";
import {
  COMPANY_ICON_MAX_BYTES,
  COMPANY_ICON_MAX_PX,
  validateAvatarImage,
  validatePngIcon,
} from "../../utils/imageValidation";
import { getInitials } from "../../utils/getInitials";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

type AccountFormValues = {
  name: string;
  email: string;
  companyName: string;
};

const canEditCompany = (role: string | undefined) => role === "SEO" || role === "admin";

export const AccountSettingsForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const companies = useSelector(selectCompanies);
  const company = companies.find((item) => item.id === user?.companyId);
  const showCompanyFields = canEditCompany(user?.role);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
  const [iconUrl, setIconUrl] = useState(company?.iconUrl);
  const [avatarError, setAvatarError] = useState<string>();
  const [iconError, setIconError] = useState<string>();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      companyName: company?.name ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      companyName: company?.name ?? "",
    });
    setAvatarUrl(user?.avatarUrl);
    setIconUrl(company?.iconUrl);
  }, [company?.iconUrl, company?.name, reset, user?.avatarUrl, user?.email, user?.name]);

  if (!user) {
    return null;
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const nextUrl = await validateAvatarImage(file);
      setAvatarUrl(nextUrl);
      setAvatarError(undefined);
      setSaved(false);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "Could not upload avatar");
    }
  };

  const handleIconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const nextUrl = await validatePngIcon(file);
      setIconUrl(nextUrl);
      setIconError(undefined);
      setSaved(false);
    } catch (error) {
      setIconError(error instanceof Error ? error.message : "Could not upload company icon");
    }
  };

  const onSubmit: SubmitHandler<AccountFormValues> = (values) => {
    const nextName = values.name.trim();
    const nextEmail = values.email.trim().toLowerCase();
    let nextCompanyName = company?.name ?? user.companyName;

    if (showCompanyFields) {
      nextCompanyName = values.companyName.trim();
      dispatch(
        updateCompany({
          id: user.companyId,
          name: nextCompanyName,
          iconUrl,
        }),
      );
    }

    dispatch(
      updateCurrentUser({
        name: nextName,
        email: nextEmail,
        avatarUrl,
        companyName: nextCompanyName,
      }),
    );
    setSaved(true);
    navigate(paths.account(nextCompanyName), { replace: true });
  };

  return (
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
        gap: 2.5,
        maxWidth: 560,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={avatarUrl}
          alt={user.name}
          sx={{
            width: 72,
            height: 72,
            fontSize: "1.25rem",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
            color: COLORS.text.inverse,
          }}
        >
          {getInitials(user.name)}
        </Avatar>
        <Box>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleAvatarChange}
          />
          <Button
            variant="outlined"
            onClick={() => avatarInputRef.current?.click()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              color: COLORS.text.secondary,
              borderColor: COLORS.border.default,
            }}
          >
            Change avatar
          </Button>
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: 0.75 }}>
            PNG, JPG, or WebP. Max 2 MB and 1024×1024px.
          </Typography>
          {avatarError && (
            <Typography variant="body2" sx={{ color: COLORS.error[600], mt: 0.5 }}>
              {avatarError}
            </Typography>
          )}
        </Box>
      </Box>

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
            message: "Enter a valid email address",
          },
          validate: (value) => {
            const taken = dummyUsers.some(
              (item) => item.id !== user.id && item.email.toLowerCase() === value.trim().toLowerCase(),
            );
            return taken ? "This email is already in use" : true;
          },
        })}
        label="Email"
        type="email"
        fullWidth
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        sx={formFieldSx}
      />

      {showCompanyFields && (
        <>
          <TextField
            {...register("companyName", {
              required: "Company name is required",
              validate: (value) => {
                const taken = companies.some(
                  (item) =>
                    item.id !== user.companyId &&
                    item.name.toLowerCase() === value.trim().toLowerCase(),
                );
                return taken ? "A company with this name already exists" : true;
              },
            })}
            label="Company name"
            fullWidth
            error={Boolean(errors.companyName)}
            helperText={errors.companyName?.message}
            sx={formFieldSx}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                border: `1px solid ${COLORS.border.default}`,
                backgroundColor: COLORS.background.subtle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {iconUrl ? (
                <Box
                  component="img"
                  src={iconUrl}
                  alt="Company icon"
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
                  }}
                />
              )}
            </Box>
            <Box>
              <input
                ref={iconInputRef}
                type="file"
                accept="image/png"
                hidden
                onChange={handleIconChange}
              />
              <Button
                variant="outlined"
                onClick={() => iconInputRef.current?.click()}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  color: COLORS.text.secondary,
                  borderColor: COLORS.border.default,
                }}
              >
                Upload PNG icon
              </Button>
              <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: 0.75 }}>
                PNG only. Max {Math.round(COMPANY_ICON_MAX_BYTES / 1024)} KB and{" "}
                {COMPANY_ICON_MAX_PX}×{COMPANY_ICON_MAX_PX}px.
              </Typography>
              {iconError && (
                <Typography variant="body2" sx={{ color: COLORS.error[600], mt: 0.5 }}>
                  {iconError}
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}

      {saved && (
        <Typography variant="body2" sx={{ color: COLORS.success.text }}>
          Account settings saved
        </Typography>
      )}

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonSx}>
        Save changes
      </Button>
    </Box>
  );
};
