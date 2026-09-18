import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { getPlatformCompany, isPlatformUser } from "../data/companies.dummy";
import {
  getThreadMessages,
  isThreadUnreadFor,
} from "../data/support.schema";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { SupportInboxList } from "../components/Support/SupportInboxList";
import { SupportThreadView } from "../components/Support/SupportThreadView";
import { selectUser } from "../store/auth/auth.slice";
import { addNotification } from "../store/notifications/notifications.slice";
import {
  addSupportMessage,
  ensureSupportThread,
  markSupportThreadRead,
  selectSupportMessages,
  selectSupportThreads,
} from "../store/support/support.slice";
import { useAppDispatch } from "../store/types";
import { paths } from "../routing/routes";
import { COLORS } from "../theme/COLORS";

const preview = (body: string) => (body.length > 90 ? `${body.slice(0, 87)}...` : body);

const Support = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const threads = useSelector(selectSupportThreads);
  const messages = useSelector(selectSupportMessages);
  const [searchParams, setSearchParams] = useSearchParams();
  const isAgent = Boolean(user && isPlatformUser(user));
  const platform = getPlatformCompany();

  const myThread = useMemo(
    () => threads.find((item) => item.requesterId === user?.id) ?? null,
    [threads, user?.id],
  );

  const selectedId = isAgent ? searchParams.get("thread") : myThread?.id ?? null;
  const selectedThread = threads.find((item) => item.id === selectedId) ?? (!isAgent ? myThread : null);
  const threadMessages = selectedThread ? getThreadMessages(messages, selectedThread.id) : [];

  useEffect(() => {
    if (!selectedThread || !user) {
      return;
    }

    const viewer = isAgent ? "support" : "requester";

    if (!isThreadUnreadFor(selectedThread, messages, viewer)) {
      return;
    }

    dispatch(
      markSupportThreadRead({
        threadId: selectedThread.id,
        as: viewer,
        readAt: new Date().toISOString(),
      }),
    );
  }, [dispatch, isAgent, messages, selectedThread, user]);

  const handleSend = (body: string) => {
    if (!user) {
      return;
    }

    const createdAt = new Date().toISOString();
    let thread =
      selectedThread ??
      threads.find((item) => item.requesterId === user.id) ??
      null;

    if (!thread && !isAgent) {
      thread = {
        id: `support-${user.id}`,
        companyId: user.companyId,
        companyName: user.companyName,
        requesterId: user.id,
        requesterName: user.name,
        requesterRole: user.role,
        requesterLastReadAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      };
      dispatch(ensureSupportThread(thread));
    }

    if (!thread) {
      return;
    }

    dispatch(
      addSupportMessage({
        id: crypto.randomUUID(),
        threadId: thread.id,
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        body,
        createdAt,
      }),
    );
    dispatch(
      markSupportThreadRead({
        threadId: thread.id,
        as: isAgent ? "support" : "requester",
        readAt: createdAt,
      }),
    );

    if (isAgent) {
      dispatch(
        addNotification({
          id: crypto.randomUUID(),
          companyId: thread.companyId,
          recipientUserId: thread.requesterId,
          title: "Support replied",
          body: preview(body),
          href: paths.support(thread.companyName),
          read: false,
          createdAt,
        }),
      );
    } else {
      dispatch(
        addNotification({
          id: crypto.randomUUID(),
          companyId: platform.id,
          recipientRole: "Support",
          title: `Support: ${user.companyName}`,
          body: `${user.name}: ${preview(body)}`,
          href: `${paths.support(platform.name)}?thread=${thread.id}`,
          read: false,
          createdAt,
        }),
      );
    }

    if (isAgent) {
      setSearchParams({ thread: thread.id });
    }
  };

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
            Support
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {isAgent
              ? "Reply to client company staff when something is blocked"
              : "Message platform Support if something is blocked in your company"}
          </Typography>
        </Box>

        {isAgent ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(260px, 320px) 1fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <SupportInboxList
              threads={threads}
              messages={messages}
              selectedId={selectedThread?.id ?? null}
              onSelect={(threadId) => setSearchParams({ thread: threadId })}
            />
            <SupportThreadView
              thread={selectedThread}
              messages={threadMessages}
              currentUserId={user?.id ?? ""}
              emptyTitle="Select a conversation"
              emptyBody="Pick a client thread from the inbox, then reply."
              composerPlaceholder="Reply to this company..."
              canCompose={Boolean(selectedThread)}
              onSend={handleSend}
            />
          </Box>
        ) : (
          <SupportThreadView
            thread={selectedThread}
            messages={threadMessages}
            currentUserId={user?.id ?? ""}
            emptyTitle="Platform Support"
            emptyBody="Describe the problem. Support will reply in this chat."
            composerPlaceholder="Describe the problem..."
            onSend={handleSend}
          />
        )}
      </Box>
    </PrivateLayout>
  );
};

export default Support;
