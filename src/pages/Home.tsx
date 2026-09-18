import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

import { PublicLayout } from "../components/PublicLayout/PublicLayout";
import {
  PUBLIC_PAGE_MAX_WIDTH,
  publicCardSx,
  publicPrimaryButtonSx,
  publicSecondaryButtonSx,
} from "../components/PublicLayout/public.styles";
import { usePublicAuth } from "../components/PublicLayout/publicAuth";
import { COLORS } from "../theme/COLORS";

const FEATURES: {
  title: string;
  description: string;
  icon: SvgIconComponent;
}[] = [
  {
    title: "Warehouse",
    description: "Stock, bins, pick lists, and warehouse receipts in one place.",
    icon: Inventory2OutlinedIcon,
  },
  {
    title: "Suppliers",
    description:
      "Supplier directory plus restock requests for the supply department.",
    icon: LocalShippingOutlinedIcon,
  },
  {
    title: "Orders & invoices",
    description:
      "Client orders, payment, warehouse reservation, and invoices from paid orders.",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    title: "Deliveries & fleet",
    description: "Dispatch board, fleet, map, and assigned trips for drivers.",
    icon: RouteOutlinedIcon,
  },
  {
    title: "Team & access",
    description: "Users, roles, and page-level permissions for each company.",
    icon: PeopleOutlinedIcon,
  },
  {
    title: "Support",
    description: "Chat between client companies and platform Support.",
    icon: SupportAgentOutlinedIcon,
  },
];

const STEPS = [
  {
    title: "Request access",
    description:
      "Send your contact details, company name, and why you need a workspace.",
  },
  {
    title: "Admin review",
    description:
      "A platform admin approves the request, creates the client company, and sets up the first SEO account.",
  },
  {
    title: "Run operations",
    description:
      "Sign in to your company cabinet for warehouse, orders, invoices, deliveries, and support.",
  },
];

const PLATFORM_ROLES = [
  {
    title: "Admin",
    description: "Reviews join requests and manages who uses the platform.",
  },
  {
    title: "Support",
    description: "Talks with client companies in the support inbox.",
  },
];

const CLIENT_ROLES = [
  {
    title: "SEO",
    description: "Company overview, operational exceptions, and settings.",
  },
  {
    title: "Storekeeper",
    description: "Stock, bins, pick lists, and warehouse receipts.",
  },
  {
    title: "Supply",
    description: "Supplier directory and restock requests.",
  },
  {
    title: "Staff",
    description: "Clients, orders, and dispatch.",
  },
  {
    title: "Driver",
    description: "Assigned trips that are still in progress.",
  },
  {
    title: "Accountant",
    description: "Invoices issued from paid client orders.",
  },
];

const PREVIEW_TILES = [
  { label: "Warehouse", detail: "Stock and pick lists" },
  { label: "Dispatch", detail: "Board, fleet, and map" },
  { label: "Orders", detail: "Payment and reservation" },
  { label: "Invoices", detail: "Issued from paid orders" },
];

const pagePadSx = {
  maxWidth: PUBLIC_PAGE_MAX_WIDTH,
  mx: "auto",
  px: { xs: 2, md: 4 },
};

const HomeContent = () => {
  const { openAuth } = usePublicAuth();

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          ...pagePadSx,
          pt: { xs: 3, md: 6 },
          pb: { xs: 5, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.15fr) minmax(0, 0.85fr)" },
          gap: { xs: 3, md: 5 },
          alignItems: "center",
        }}
      >
        <Box>
          <Chip
            label="By request only"
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
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.15,
              color: COLORS.text.primary,
              letterSpacing: "-0.03em",
            }}
          >
            Warehouse, orders, and deliveries in one workspace
          </Typography>
          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              color: COLORS.text.secondary,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Evil Corp gives each client company its own cabinet for stock,
            suppliers, orders, invoices, and fleet. Access is not open signup
            — request access and a platform admin reviews it before a company
            account is created.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<LoginOutlinedIcon />}
              onClick={() => openAuth("signin")}
              sx={publicPrimaryButtonSx}
            >
              Sign in
            </Button>
            <Button
              variant="outlined"
              startIcon={<HowToRegOutlinedIcon />}
              onClick={() => openAuth("request")}
              sx={publicSecondaryButtonSx}
            >
              Request access
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            ...publicCardSx,
            p: 2.5,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          {PREVIEW_TILES.map((tile) => (
            <Box
              key={tile.label}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: COLORS.background.subtle,
                border: `1px solid ${COLORS.border.light}`,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                {tile.label}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {tile.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...pagePadSx, pb: { xs: 5, md: 8 } }}>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "1.75rem" }, mb: 1 }}
        >
          What you can run
        </Typography>
        <Typography sx={{ color: COLORS.text.secondary, mb: 3, maxWidth: 640 }}>
          These are the modules already in the product — not a wishlist.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Box key={feature.title} sx={{ ...publicCardSx, p: 2.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    backgroundColor: COLORS.primary[50],
                    color: COLORS.primary[700],
                    mb: 1.5,
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 700, mb: 0.75 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  {feature.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ ...pagePadSx, pb: { xs: 5, md: 8 } }}>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "1.75rem" }, mb: 1 }}
        >
          How you get in
        </Typography>
        <Typography sx={{ color: COLORS.text.secondary, mb: 3, maxWidth: 640 }}>
          A company workspace is created only after a platform admin approves
          the request.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {STEPS.map((step, index) => (
            <Box key={step.title} sx={{ ...publicCardSx, p: 2.5 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: COLORS.primary[700],
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Step {index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 700, mb: 0.75 }}>{step.title}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...pagePadSx, pb: { xs: 5, md: 8 } }}>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "1.75rem" }, mb: 1 }}
        >
          Roles in the cabinet
        </Typography>
        <Typography sx={{ color: COLORS.text.secondary, mb: 3, maxWidth: 640 }}>
          Platform staff run the network. Each client company has its own
          operational roles.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.8fr) minmax(0, 1.2fr)" },
            gap: 2,
          }}
        >
          <Box sx={{ ...publicCardSx, p: 2.5 }}>
            <Chip
              label="Platform"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: COLORS.primary[50],
                color: COLORS.primary[700],
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {PLATFORM_ROLES.map((role) => (
                <Box key={role.title}>
                  <Typography sx={{ fontWeight: 700 }}>{role.title}</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {role.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ ...publicCardSx, p: 2.5 }}>
            <Chip
              label="Client company"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: COLORS.background.muted,
                color: COLORS.text.secondary,
              }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {CLIENT_ROLES.map((role) => (
                <Box key={role.title}>
                  <Typography sx={{ fontWeight: 700 }}>{role.title}</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {role.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ ...pagePadSx }}>
        <Box
          sx={{
            ...publicCardSx,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            gap: 2.5,
            background: `linear-gradient(180deg, ${COLORS.primary[50]} 0%, ${COLORS.background.surface} 100%)`,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.35rem", mb: 0.5 }}>
              Ready to get a company workspace?
            </Typography>
            <Typography sx={{ color: COLORS.text.secondary }}>
              Request access if you are new, or sign in if your company is
              already on the platform.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={() => openAuth("request")}
              sx={publicPrimaryButtonSx}
            >
              Request access
            </Button>
            <Button
              variant="outlined"
              onClick={() => openAuth("signin")}
              sx={publicSecondaryButtonSx}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Home = () => {
  return (
    <PublicLayout>
      <HomeContent />
    </PublicLayout>
  );
};

export default Home;
