import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { SupportMessage, SupportThread } from "../../data/support.schema";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";
import { formFieldSx } from "../Forms/formStyles";

type SupportThreadViewProps = {
  thread: SupportThread | null;
  messages: SupportMessage[];
  currentUserId: string;
  emptyTitle: string;
  emptyBody: string;
  composerPlaceholder: string;
  canCompose?: boolean;
  onSend: (body: string) => void;
};

export const SupportThreadView = ({
  thread,
  messages,
  currentUserId,
  emptyTitle,
  emptyBody,
  composerPlaceholder,
  canCompose = true,
  onSend,
}: SupportThreadViewProps) => {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, thread?.id]);

  const handleSend = () => {
    const body = draft.trim();

    if (!body) {
      return;
    }

    onSend(body);
    setDraft("");
  };

  return (
    <Box
      sx={{
        minHeight: 420,
        height: { md: "calc(100vh - 260px)" },
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${COLORS.border.light}`,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
          {thread ? `${thread.requesterName} · ${thread.companyName}` : emptyTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.25 }}>
          {thread ? `${thread.requesterRole} · ${thread.companyName}` : emptyBody}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" sx={{ color: COLORS.text.muted, m: "auto" }}>
            {emptyBody}
          </Typography>
        ) : (
          messages.map((message) => {
            const mine = message.authorId === currentUserId;

            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: mine ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  px: 1.75,
                  py: 1.25,
                  borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  backgroundColor: mine ? COLORS.primary[50] : COLORS.background.subtle,
                  border: `1px solid ${mine ? COLORS.primary[100] : COLORS.border.light}`,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text.tertiary }}>
                  {message.authorName} · {formatDateTime(message.createdAt)}
                </Typography>
                <Typography sx={{ color: COLORS.text.primary, whiteSpace: "pre-wrap", mt: 0.5 }}>
                  {message.body}
                </Typography>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-end",
          p: 2,
          borderTop: `1px solid ${COLORS.border.light}`,
        }}
      >
        <TextField
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder={composerPlaceholder}
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          disabled={!canCompose}
          sx={formFieldSx}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!canCompose || !draft.trim()}
          sx={{
            height: 56,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            backgroundColor: COLORS.primary[600],
            "&:hover": { backgroundColor: COLORS.primary[700] },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
