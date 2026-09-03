import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx } from "./formStyles";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  helperText?: string;
};

export const PasswordField = ({
  label,
  registration,
  error,
  helperText,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...registration}
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      error={Boolean(error)}
      helperText={error?.message ?? helperText}
      sx={formFieldSx}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                sx={{
                  color: COLORS.text.muted,
                  "&:hover": {
                    color: COLORS.primary[600],
                    backgroundColor: COLORS.primary[50],
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
