import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { COLORS } from "../../theme/COLORS";
import {
  PUBLIC_PAGE_MAX_WIDTH,
  publicNavButtonSx,
} from "./public.styles";
import { usePublicAuth } from "./publicAuth";
import { publicNavPages } from "./publicNav";

export const PublicFooter = () => {
  const { openAuth } = usePublicAuth();

  return (
    <Box
      component="footer"
      sx={{
        px: { xs: 2, md: 4 },
        pt: 1,
        pb: 3,
      }}
    >
      <Box
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
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "flex-start" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: 360 }}>
              <Typography
                component={NavLink}
                to="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  color: COLORS.text.primary,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  textDecoration: "none",
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
              <Typography
                variant="body2"
                sx={{ color: COLORS.text.secondary, mt: 1.25 }}
              >
                Operations platform for warehouse, orders, invoices, and
                deliveries. Access is granted after a platform admin reviews
                your request.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {publicNavPages.map((page) => (
                <Button
                  key={page.label}
                  component={NavLink}
                  to={page.to}
                  end={page.end}
                  sx={publicNavButtonSx}
                >
                  {page.label}
                </Button>
              ))}
              <Button
                onClick={() => openAuth("signin")}
                sx={publicNavButtonSx}
              >
                Sign in
              </Button>
              <Button
                onClick={() => openAuth("request")}
                sx={publicNavButtonSx}
              >
                Request access
              </Button>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: COLORS.text.muted, mt: 3 }}
          >
            © {new Date().getFullYear()} Evil Corp
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
