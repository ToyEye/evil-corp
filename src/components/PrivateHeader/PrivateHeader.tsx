import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const PrivateHeader = () => {
  const user = useSelector(selectUser);

  return (
    <Box
      component="header"
      sx={{
        px: 2,
        pt: 2,
        pb: 0,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${COLORS.border.default}`,
          backgroundColor: COLORS.background.surface,
          boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 72 },
            px: { xs: 1.5, sm: 2.5 },
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              mr: "auto",
              fontWeight: 700,
              color: COLORS.text.primary,
            }}
          >
            {user ? `Welcome, ${user.name.split(" ")[0]}` : "Welcome"}
          </Typography>

          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Chip
                label={user.role}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: COLORS.primary[50],
                  color: COLORS.primary[700],
                }}
              />

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexDirection: "column",
                  alignItems: "flex-end",
                  minWidth: 0,
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    lineHeight: 1.3,
                    color: COLORS.text.primary,
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: "0.75rem",
                    lineHeight: 1.3,
                    color: COLORS.text.tertiary,
                  }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Avatar
                alt={user.name}
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
                  color: COLORS.text.inverse,
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
