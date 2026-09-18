import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  getLastThreadMessage,
  isThreadUnreadFor,
  type SupportMessage,
  type SupportThread,
} from "../../data/support.schema";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";

type SupportInboxListProps = {
  threads: SupportThread[];
  messages: SupportMessage[];
  selectedId: string | null;
  onSelect: (threadId: string) => void;
};

export const SupportInboxList = ({
  threads,
  messages,
  selectedId,
  onSelect,
}: SupportInboxListProps) => {
  const sorted = useMemo(
    () => [...threads].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [threads],
  );

  return (
    <Box
      sx={{
        minHeight: 420,
        height: { md: "calc(100vh - 260px)" },
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${COLORS.border.light}` }}>
        <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>Inbox</Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          {sorted.length} conversation{sorted.length === 1 ? "" : "s"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {sorted.length === 0 ? (
          <Typography variant="body2" sx={{ color: COLORS.text.muted, p: 3 }}>
            No client conversations yet
          </Typography>
        ) : (
          sorted.map((thread) => {
            const last = getLastThreadMessage(messages, thread.id);
            const unread = isThreadUnreadFor(thread, messages, "support");
            const selected = thread.id === selectedId;

            return (
              <Box
                key={thread.id}
                onClick={() => onSelect(thread.id)}
                sx={{
                  px: 2.5,
                  py: 1.75,
                  cursor: "pointer",
                  borderBottom: `1px solid ${COLORS.border.light}`,
                  backgroundColor: selected
                    ? COLORS.primary[50]
                    : unread
                      ? COLORS.background.subtle
                      : "transparent",
                  "&:hover": { backgroundColor: COLORS.background.muted },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ fontWeight: unread ? 800 : 700, color: COLORS.text.primary }}>
                    {thread.requesterName}
                  </Typography>
                  {unread ? (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        mt: 0.75,
                        borderRadius: "50%",
                        backgroundColor: COLORS.primary[600],
                        flexShrink: 0,
                      }}
                    />
                  ) : null}
                </Box>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  {thread.companyName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.text.tertiary,
                    mt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {last?.body ?? "No messages yet"}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
                  {formatDateTime(thread.updatedAt)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
