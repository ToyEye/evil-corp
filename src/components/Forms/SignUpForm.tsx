import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { getApiErrorMessage } from "../../api/http";
import { useCreateJoinRequestMutation } from "../../hooks";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "./formStyles";
import { PasswordField } from "./PasswordField";

type JoinRequestInputs = {
  contactName: string;
  email: string;
  message: string;
  companyName?: string;
  password?: string;
};

export const SignUpForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const createJoinRequest = useCreateJoinRequestMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinRequestInputs>();

  const onSubmit: SubmitHandler<JoinRequestInputs> = async (data) => {
    setApiError(null);
    try {
      await createJoinRequest.mutateAsync({
        contactName: data.contactName.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        companyName: data.companyName?.trim() || undefined,
        password: data.password || undefined,
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Failed to submit request"));
    }
  };

  if (submitted) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: COLORS.text.primary, fontWeight: 700 }}
        >
          Request submitted
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          We received your access request. You will hear back by email once it
          is reviewed.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setSubmitted(false)}
          sx={{ alignSelf: "flex-start" }}
        >
          Submit another request
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ color: COLORS.text.primary, fontWeight: 700, mb: 0.5 }}
        >
          Request access
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Tell us how to reach you and why you need access
        </Typography>
      </Box>

      {apiError && <Alert severity="error">{apiError}</Alert>}

      <TextField
        {...register("contactName", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
        fullWidth
        label="Contact name"
        autoComplete="name"
        error={Boolean(errors.contactName)}
        helperText={errors.contactName?.message}
        sx={formFieldSx}
      />

      <TextField
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        sx={formFieldSx}
      />

      <TextField
        {...register("companyName")}
        fullWidth
        label="Company name (optional)"
        autoComplete="organization"
        sx={formFieldSx}
      />

      <TextField
        {...register("message", {
          required: "Message is required",
          minLength: {
            value: 10,
            message: "Please provide a bit more detail",
          },
        })}
        fullWidth
        label="Message"
        multiline
        minRows={3}
        error={Boolean(errors.message)}
        helperText={errors.message?.message}
        sx={formFieldSx}
      />

      <PasswordField
        label="Password (optional)"
        registration={register("password", {
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        error={errors.password}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || createJoinRequest.isPending}
        fullWidth
        sx={submitButtonSx}
      >
        Request access
      </Button>
    </Box>
  );
};
