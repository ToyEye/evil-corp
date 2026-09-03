import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "./formStyles";
import { PasswordField } from "./PasswordField";

type LoginInputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = (data) => console.log(data);

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
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Sign in to continue to Evil Corp
        </Typography>
      </Box>

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

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={submitButtonSx}
      >
        Sign in
      </Button>
    </Box>
  );
};
