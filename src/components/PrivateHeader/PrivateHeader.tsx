import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";

import { selectUser, logout } from "../../store/auth/auth.slice";
import { selectCompanies } from "../../store/companies/companies.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { FitText } from "../common/FitText";
import { paths, routes } from "../../routing/routes";
import { getInitials } from "../../utils/getInitials";

export const PrivateHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const companies = useSelector(selectCompanies);
  const company = companies.find((item) => item.id === user?.companyId);
  const companyName = company?.name ?? user?.companyName ?? "";
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleLogout = () => {
    setMenuAnchor(null);
    dispatch(logout());
    navigate(routes.Home, { replace: true });
  };

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
          <Box sx={{ mr: "auto", minWidth: 0, flex: 1, maxWidth: { xs: 160, sm: 280, md: 360 } }}>
            <FitText
              text={companyName}
              maxFontSize={16}
              sx={{ color: COLORS.text.primary }}
            />
          </Box>

          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 0,
                flexShrink: 0,
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

              <IconButton
                onClick={(event) => setMenuAnchor(event.currentTarget)}
                aria-label="Account menu"
                aria-haspopup="true"
                aria-expanded={Boolean(menuAnchor)}
                sx={{ p: 0 }}
              >
                <Avatar
                  src={user.avatarUrl}
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
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: "12px",
                      border: `1px solid ${COLORS.border.default}`,
                      boxShadow: `0 8px 24px ${COLORS.ui.shadowStrong}`,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    navigate(paths.account(companyName));
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  <ListItemIcon>
                    <ManageAccountsRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  Account settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, color: COLORS.error[700] }}>
                  <ListItemIcon>
                    <LogoutRoundedIcon fontSize="small" sx={{ color: COLORS.error[700] }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
