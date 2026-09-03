import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import { COLORS } from "../../theme/COLORS";
import { AuthModal } from "../Modals/AuthModal";

const pages = [
  { link: "/", name: "Home", end: true },
  { link: "/about", name: "About" },
];

export const PublicHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            maxWidth: 1200,
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
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    component={NavLink}
                    to={page.link}
                    end={page.end}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: COLORS.text.secondary,
                      borderRadius: "10px",
                      px: 2,
                      py: 1,
                      transition: "background-color 0.2s ease, color 0.2s ease",
                      "&:hover": {
                        backgroundColor: COLORS.background.subtle,
                        color: COLORS.text.primary,
                      },
                      "&.active": {
                        backgroundColor: COLORS.primary[50],
                        color: COLORS.primary[700],
                      },
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>

              <Button
                variant="contained"
                startIcon={<LoginOutlinedIcon />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1,
                  backgroundColor: COLORS.primary[600],
                  boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
                  "&:hover": {
                    backgroundColor: COLORS.primary[700],
                    boxShadow: `0 6px 20px ${COLORS.ui.shadowStrong}`,
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Sign in / Sign up
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Sign in
                </Box>
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
