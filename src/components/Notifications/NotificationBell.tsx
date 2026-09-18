import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";

export const NotificationBell = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { data: itemsData } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const items = itemsData ?? [];
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const mine = useMemo(() => {
    if (!user) {
      return [];
    }

    return items.filter(
      (item) =>
        item.companyId === user.companyId &&
        (item.recipientUserId === user.id || item.recipientRole === user.role),
    );
  }, [items, user]);

  const unread = mine.filter((item) => !item.read).length;

  if (!user) {
    return null;
  }

  return (
    <>
      <IconButton
        aria-label="Notifications"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{
          color: COLORS.text.secondary,
          backgroundColor: COLORS.background.subtle,
          "&:hover": {
            backgroundColor: COLORS.primary[50],
            color: COLORS.primary[700],
          },
        }}
      >
        <Badge badgeContent={unread} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 360,
              maxWidth: "calc(100vw - 24px)",
              borderRadius: "12px",
              border: `1px solid ${COLORS.border.default}`,
              boxShadow: `0 8px 24px ${COLORS.ui.shadowStrong}`,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
            Notifications
          </Typography>
          {unread > 0 ? (
            <Button
              onClick={() => markAllRead.mutate()}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Mark all read
            </Button>
          ) : null}
        </Box>
        {mine.length === 0 ? (
          <MenuItem disabled sx={{ py: 2 }}>
            Nothing new
          </MenuItem>
        ) : (
          mine.slice(0, 8).map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => {
                markRead.mutate(item.id);
                setAnchor(null);

                if (item.href) {
                  navigate(item.href);
                }
              }}
              sx={{
                alignItems: "flex-start",
                whiteSpace: "normal",
                py: 1.25,
                backgroundColor: item.read
                  ? "transparent"
                  : COLORS.primary[50],
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 700, color: COLORS.text.primary }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.text.secondary }}
                >
                  {item.body}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.text.tertiary }}
                >
                  {formatDateTime(item.createdAt)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};
