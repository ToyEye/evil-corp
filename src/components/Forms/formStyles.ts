import { COLORS } from "../../theme/COLORS";

export const formFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: COLORS.background.subtle,
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": {
      borderColor: COLORS.border.default,
    },
    "&:hover fieldset": {
      borderColor: COLORS.border.strong,
    },
    "&.Mui-focused": {
      backgroundColor: COLORS.background.surface,
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
      "& fieldset": {
        borderColor: COLORS.border.focus,
        borderWidth: "1px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: COLORS.text.secondary,
    "&.Mui-focused": {
      color: COLORS.primary[600],
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
};

export const submitButtonSx = {
  mt: 2,
  py: 1.25,
  borderRadius: "10px",
  textTransform: "none" as const,
  fontWeight: 600,
  fontSize: "1rem",
  backgroundColor: COLORS.primary[600],
  boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
  "&:hover": {
    backgroundColor: COLORS.primary[700],
    boxShadow: `0 6px 20px ${COLORS.ui.shadowStrong}`,
  },
};
