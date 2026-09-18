import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { NavLink } from "react-router-dom";

import { COLORS } from "../../theme/COLORS";
import {
  PUBLIC_PAGE_MAX_WIDTH,
  publicNavButtonSx,
  publicPrimaryButtonSx,
} from "../PublicLayout/public.styles";
import { usePublicAuth } from "../PublicLayout/publicAuth";
import { publicNavPages } from "../PublicLayout/publicNav";

const NavButtons = () =>
  publicNavPages.map((page) => (
    <Button
      key={page.label}
      component={NavLink}
      to={page.to}
      end={page.end}
      sx={publicNavButtonSx}
    >
      {page.label}
    </Button>
  ));

export const PublicHeader = () => {
  const { openAuth } = usePublicAuth();

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2, md: 4 },
        pt: 2,
        pb: 1,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          maxWidth: PUBLIC_PAGE_MAX_WIDTH,
          mx: "auto",
          borderRadius: "16px",
          border: `1px solid ${COLORS.border.default}`,
          backgroundColor: COLORS.background.surface,
          boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
          overflow: "hidden",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 }, gap: 2 }}>
            <Typography
              component={NavLink}
              to="/"
              variant="h6"
              noWrap
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                color: COLORS.text.primary,
                fontWeight: 700,
                textDecoration: "none",
                mr: { xs: "auto", md: 4 },
                transition: "color 0.2s ease",
                "&:hover": {
                  color: COLORS.primary[700],
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
                  boxShadow: `0 0 0 4px ${COLORS.primary[100]}`,
                }}
              />
              Evil Corp
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
                flexGrow: 1,
              }}
            >
              <NavButtons />
            </Box>

            <Button
              variant="contained"
              startIcon={<LoginOutlinedIcon />}
              onClick={() => openAuth("signin")}
              sx={publicPrimaryButtonSx}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Sign in / Sign up
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                Sign in
              </Box>
            </Button>
          </Toolbar>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 0.5,
              pb: 1.5,
            }}
          >
            <NavButtons />
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};
