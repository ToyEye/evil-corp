import { useEffect, useState, type MouseEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { COLORS } from "../../theme/COLORS";
import { getNavItemSx } from "./aside.styles";
import type { AsideLink } from "./aside.types";
import { isGroupLink, isItemActive } from "./aside.utils";

type AsideNavItemProps = {
  item: AsideLink;
  collapsed: boolean;
  depth?: number;
  onNavigate?: () => void;
};

export const AsideNavItem = ({
  item,
  collapsed,
  depth = 0,
  onNavigate,
}: AsideNavItemProps) => {
  const location = useLocation();
  const hasChildren = isGroupLink(item);
  const isActive = isItemActive(item, location.pathname);

  const [nestedOpen, setNestedOpen] = useState(hasChildren && isActive);
  const [flyoutAnchor, setFlyoutAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (hasChildren && isActive) {
      setNestedOpen(true);
    }
  }, [hasChildren, isActive]);

  useEffect(() => {
    if (!collapsed) {
      setFlyoutAnchor(null);
    }
  }, [collapsed]);

  const handleGroupClick = (event: MouseEvent<HTMLElement>) => {
    if (collapsed) {
      const target = event.currentTarget;
      setFlyoutAnchor((current) => (current ? null : target));
      return;
    }

    setNestedOpen((open) => !open);
  };

  const Icon = item.icon;

  const button = (
    <ListItemButton
      {...(hasChildren
        ? {
            onClick: handleGroupClick,
            "aria-expanded": collapsed ? Boolean(flyoutAnchor) : nestedOpen,
            "aria-haspopup": collapsed ? ("true" as const) : undefined,
          }
        : {
            component: NavLink,
            to: item.href,
            end: true,
            onClick: onNavigate,
          })}
      sx={getNavItemSx(collapsed, depth, isActive)}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 40,
          color: "inherit",
          justifyContent: "center",
        }}
      >
        {Icon ? (
          <Icon sx={{ fontSize: 22 }} />
        ) : (
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: isActive ? COLORS.primary[500] : COLORS.border.strong,
            }}
          />
        )}
      </ListItemIcon>

      <ListItemText
        primary={item.label}
        sx={{
          m: 0,
          opacity: collapsed ? 0 : 1,
          flex: collapsed ? "0 0 0px" : "1 1 auto",
          overflow: "hidden",
          whiteSpace: "nowrap",
          transition: "opacity 0.18s ease",
          "& .MuiListItemText-primary": {
            fontWeight: 600,
            fontSize: "0.9rem",
          },
        }}
      />

      {!collapsed && hasChildren && (
        <ExpandMoreRoundedIcon
          sx={{
            fontSize: 20,
            ml: 0.5,
            flexShrink: 0,
            transform: nestedOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      )}
    </ListItemButton>
  );

  return (
    <>
      <Tooltip
        title={item.label}
        placement="right"
        disableHoverListener={!collapsed || Boolean(flyoutAnchor)}
      >
        {button}
      </Tooltip>

      {hasChildren && (
        <Collapse in={!collapsed && nestedOpen} timeout={220} unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => (
              <AsideNavItem
                key={child.id}
                item={child}
                collapsed={collapsed}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </List>
        </Collapse>
      )}

      {hasChildren && (
        <Popper
          open={Boolean(flyoutAnchor)}
          anchorEl={flyoutAnchor}
          placement="right-start"
          sx={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={() => setFlyoutAnchor(null)}>
            <Paper
              sx={{
                ml: 1.25,
                minWidth: 220,
                py: 1,
                borderRadius: "12px",
                border: `1px solid ${COLORS.border.default}`,
                backgroundColor: COLORS.background.surface,
                boxShadow: `0 8px 24px ${COLORS.ui.shadowStrong}`,
              }}
            >
              <Typography
                sx={{
                  px: 2,
                  pt: 0.5,
                  pb: 1,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: COLORS.text.muted,
                }}
              >
                {item.label}
              </Typography>
              <List disablePadding>
                {item.children.map((child) => (
                  <AsideNavItem
                    key={child.id}
                    item={child}
                    collapsed={false}
                    depth={0}
                    onNavigate={() => {
                      setFlyoutAnchor(null);
                      onNavigate?.();
                    }}
                  />
                ))}
              </List>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
};
