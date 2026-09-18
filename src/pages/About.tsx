import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import { PublicLayout } from "../components/PublicLayout/PublicLayout";
import {
  PUBLIC_PAGE_MAX_WIDTH,
  publicCardSx,
  publicPrimaryButtonSx,
  publicSecondaryButtonSx,
} from "../components/PublicLayout/public.styles";
import { usePublicAuth } from "../components/PublicLayout/publicAuth";
import { COLORS } from "../theme/COLORS";

const POINTS = [
  {
    title: "Two kinds of companies",
    description:
      "The platform company reviews access and supports tenants. Each client company gets its own cabinet for warehouse, suppliers, clients, orders, invoices, and deliveries.",
  },
  {
    title: "Access is reviewed",
    description:
      "There is no open signup. You submit a request with your contact details. A platform admin approves it, creates the client company, and sets up the first SEO account.",
  },
  {
    title: "Roles stay scoped",
    description:
      "SEO, Storekeeper, Supply, Staff, Driver, and Accountant see the pages they need. Platform Admin and Support stay on the network side.",
  },
];

const AboutContent = () => {
  const { openAuth } = usePublicAuth();

  return (
    <Box
      sx={{
        maxWidth: PUBLIC_PAGE_MAX_WIDTH,
        mx: "auto",
        px: { xs: 2, md: 4 },
        pt: { xs: 3, md: 6 },
        pb: { xs: 5, md: 8 },
      }}
    >
      <Chip
        label="About"
        size="small"
        sx={{
          mb: 2,
          fontWeight: 600,
          borderRadius: "8px",
          backgroundColor: COLORS.primary[50],
          color: COLORS.primary[700],
        }}
      />
      <Typography
        component="h1"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "2rem", md: "2.75rem" },
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: 720,
        }}
      >
        Evil Corp is the operations layer for client companies
      </Typography>
      <Typography
        sx={{
          mt: 2,
          maxWidth: 680,
          color: COLORS.text.secondary,
          fontSize: { xs: "1rem", md: "1.1rem" },
          lineHeight: 1.6,
        }}
      >
        It is a multi-company workspace: platform staff run access and support,
        while each client company runs its own stock, orders, invoices, and
        fleet from a private cabinet.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
          mt: 4,
        }}
      >
        {POINTS.map((point) => (
          <Box key={point.title} sx={{ ...publicCardSx, p: 2.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.75 }}>{point.title}</Typography>
            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
              {point.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          ...publicCardSx,
          mt: 4,
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 0.5 }}>
            Need a company account?
          </Typography>
          <Typography sx={{ color: COLORS.text.secondary }}>
            Request access, or sign in if you already have a workspace.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="contained"
            startIcon={<HowToRegOutlinedIcon />}
            onClick={() => openAuth("request")}
            sx={publicPrimaryButtonSx}
          >
            Request access
          </Button>
          <Button
            variant="outlined"
            startIcon={<LoginOutlinedIcon />}
            onClick={() => openAuth("signin")}
            sx={publicSecondaryButtonSx}
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const About = () => {
  return (
    <PublicLayout>
      <AboutContent />
    </PublicLayout>
  );
};

export default About;
