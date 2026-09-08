import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { dummyCompanies } from "../../data/companies.dummy";
import {
  findDummyUser,
  getDummyRolesForCompany,
} from "../../data/users.dummy";
import type { UserRole } from "../../data/users.schema";
import { toCompanySlug } from "../../routing/routes";
import { selectUser, setPreviewUser } from "../../store/auth/auth.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { PREVIEW_BAR_HEIGHT } from "./previewSwitcher.styles";

const selectSx = {
  minWidth: { xs: 160, sm: 220 },
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    color: COLORS.text.inverse,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.16)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.32)",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary[400],
    },
  },
  "& .MuiInputLabel-root": {
    color: COLORS.text.muted,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORS.primary[300],
  },
  "& .MuiSelect-icon": {
    color: COLORS.text.muted,
  },
};

const getPathSuffix = (pathname: string, companyName: string) => {
  const prefix = `/${toCompanySlug(companyName)}`;

  if (!pathname.startsWith(prefix)) {
    return "/dashboard";
  }

  return pathname.slice(prefix.length) || "/dashboard";
};

export const PreviewSwitcher = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  if (!user) {
    return null;
  }

  const roles = getDummyRolesForCompany(user.companyId);

  const applyUser = (companyId: string, role: UserRole) => {
    const nextUser = findDummyUser(companyId, role);

    if (!nextUser) {
      return;
    }

    const suffix = getPathSuffix(location.pathname, user.companyName);
    dispatch(setPreviewUser(nextUser));
    navigate(`/${toCompanySlug(nextUser.companyName)}${suffix}`, { replace: true });
  };

  return (
    <Box
      component="div"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: PREVIEW_BAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: { xs: 1.5, sm: 2.5 },
        backgroundColor: COLORS.background.dark,
        borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: COLORS.primary[300],
          mr: 1,
          flexShrink: 0,
        }}
      >
        Preview
      </Typography>

      <TextField
        select
        size="small"
        label="Company"
        value={user.companyId}
        onChange={(event) => {
          const companyId = event.target.value;
          const companyRoles = getDummyRolesForCompany(companyId);
          const nextRole = companyRoles.includes(user.role) ? user.role : companyRoles[0];

          if (nextRole) {
            applyUser(companyId, nextRole);
          }
        }}
        slotProps={{
          select: {
            MenuProps: {
              sx: { zIndex: 1400 },
            },
          },
        }}
        sx={selectSx}
      >
        {dummyCompanies.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            {company.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Role"
        value={user.role}
        onChange={(event) => applyUser(user.companyId, event.target.value as UserRole)}
        slotProps={{
          select: {
            MenuProps: {
              sx: { zIndex: 1400 },
            },
          },
        }}
        sx={selectSx}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>

      <Typography
        noWrap
        sx={{
          ml: "auto",
          fontSize: "0.8rem",
          color: COLORS.text.muted,
          display: { xs: "none", md: "block" },
        }}
      >
        {user.name}
      </Typography>
    </Box>
  );
};
