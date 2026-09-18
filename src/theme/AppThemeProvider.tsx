import { useEffect, useMemo, type ReactNode } from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { selectThemeMode } from "../store/theme/theme.slice";
import { applyThemeMode, writeStoredThemeMode } from "./applyTheme";
import { getPalette } from "./palettes";

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const mode = useSelector(selectThemeMode);
  const palette = getPalette(mode);

  useEffect(() => {
    applyThemeMode(mode);
    writeStoredThemeMode(mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: palette.primary[600],
            light: palette.primary[400],
            dark: palette.primary[700],
            contrastText: palette.text.inverse,
          },
          error: {
            main: palette.error[600],
          },
          warning: {
            main: palette.warning[500],
          },
          success: {
            main: palette.success[500],
          },
          info: {
            main: palette.info[500],
          },
          background: {
            default: palette.background.page,
            paper: palette.background.surface,
          },
          text: {
            primary: palette.text.primary,
            secondary: palette.text.secondary,
            disabled: palette.ui.disabledText,
          },
          divider: palette.border.default,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: palette.background.page,
                color: palette.text.primary,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: palette.background.surface,
                color: palette.text.primary,
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: palette.text.primary,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: palette.background.dark,
                color: palette.text.inverse,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: palette.border.light,
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: palette.border.light,
              },
            },
          },
        },
      }),
    [mode, palette],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
