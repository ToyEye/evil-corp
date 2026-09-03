import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "./formStyles";
import { PasswordField } from "./PasswordField";

type SignUpInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInputs>();

  const password = watch("password");

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => console.log(data);

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
          Create an account
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Join Evil Corp in a few steps
        </Typography>
      </Box>

      <TextField
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
        fullWidth
        label="Name"
        autoComplete="name"
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
        })}
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        sx={formFieldSx}
      />

      <PasswordField
        label="Password"
        registration={register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={errors.password}
      />

      <PasswordField
        label="Confirm password"
        registration={register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={submitButtonSx}
      >
        Create account
      </Button>
    </Box>
  );
};
