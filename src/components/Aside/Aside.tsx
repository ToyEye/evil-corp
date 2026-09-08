import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Tooltip from "@mui/material/Tooltip";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { isPlatformUser } from "../../data/companies.dummy";
import { selectUser } from "../../store/auth/auth.slice";
import { selectCompanies } from "../../store/companies/companies.slice";
import { selectPageAccess } from "../../store/permissions/permissions.slice";
import { PREVIEW_BAR_HEIGHT } from "../PreviewSwitcher/previewSwitcher.styles";
import { COLORS } from "../../theme/COLORS";
import { FitText } from "../common/FitText";
import { AsideNavItem } from "./AsideNavItem";
import { getAsideLinks } from "./aside.links";
import {
  ASIDE_COLLAPSED_WIDTH,
  ASIDE_EXPANDED_WIDTH,
  ASIDE_TRANSITION,
} from "./aside.styles";
import { filterLinksByAccess } from "./aside.utils";

const CompanyMark = ({ iconUrl, size }: { iconUrl?: string; size: number }) => {
  if (iconUrl) {
    return (
      <Box
        component="img"
        src={iconUrl}
        alt=""
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: "6px",
          objectFit: "contain",
          backgroundColor: COLORS.background.subtle,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
        boxShadow: `0 0 0 4px ${COLORS.primary[100]}`,
      }}
    />
  );
};

export const Aside = () => {
  const user = useSelector(selectUser);
  const pageAccess = useSelector(selectPageAccess);
  const companies = useSelector(selectCompanies);
  const [isOpen, setIsOpen] = useState(true);
  const company = companies.find((item) => item.id === user?.companyId);
  const companyName = company?.name ?? user?.companyName ?? "";

  const links = useMemo(() => {
    if (!user) {
      return [];
    }

    const accessible = filterLinksByAccess(getAsideLinks(companyName, pageAccess), user.role);

    if (!isPlatformUser(user)) {
      return accessible;
    }

    return accessible.filter((link) => link.id !== "clients" && link.id !== "deliveries");
  }, [companyName, pageAccess, user]);

  return (
    <Box
      component="aside"
      sx={{
        width: isOpen ? ASIDE_EXPANDED_WIDTH : ASIDE_COLLAPSED_WIDTH,
        m: 2,
        mr: 0,
        height: `calc(100vh - ${PREVIEW_BAR_HEIGHT}px - 32px)`,
        position: "sticky",
        top: `${PREVIEW_BAR_HEIGHT + 16}px`,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        transition: ASIDE_TRANSITION,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          gap: 1,
          minHeight: 72,
          px: isOpen ? 1.5 : 1,
          borderBottom: `1px solid ${COLORS.border.light}`,
          transition: "padding 0.28s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            overflow: "hidden",
            minWidth: 0,
            flex: isOpen ? 1 : 0,
            width: isOpen ? "auto" : company?.iconUrl ? 22 : 0,
            opacity: isOpen || company?.iconUrl ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.2s ease, width 0.28s ease, flex 0.28s ease",
          }}
        >
          <CompanyMark iconUrl={company?.iconUrl} size={company?.iconUrl ? 22 : 10} />
          {isOpen && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <FitText text={companyName} maxFontSize={16} sx={{ color: COLORS.text.primary }} />
            </Box>
          )}
        </Box>

        <Tooltip title={isOpen ? "Collapse menu" : "Expand menu"} placement="right">
          <IconButton
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Collapse menu" : "Expand menu"}
            aria-expanded={isOpen}
            sx={{
              color: COLORS.text.secondary,
              backgroundColor: COLORS.background.subtle,
              borderRadius: "10px",
              flexShrink: 0,
              transition: "background-color 0.2s ease, color 0.2s ease",
              "&:hover": {
                backgroundColor: COLORS.primary[50],
                color: COLORS.primary[700],
              },
            }}
          >
            {isOpen ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <List
        component="nav"
        aria-label="Main navigation"
        disablePadding
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.25,
        }}
      >
        {links.map((item) => (
          <AsideNavItem key={item.id} item={item} collapsed={!isOpen} />
        ))}
      </List>
    </Box>
  );
};
