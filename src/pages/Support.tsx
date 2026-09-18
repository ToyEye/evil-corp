import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  getThreadMessages,
  isThreadUnreadFor,
} from "../data/support.schema";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { SupportInboxList } from "../components/Support/SupportInboxList";
import { SupportThreadView } from "../components/Support/SupportThreadView";
import {
  useEnsureSupportThreadMutation,
  useMarkSupportThreadReadMutation,
  useSendSupportMessageMutation,
  useSupportMessagesQuery,
  useSupportThreadsQuery,
} from "../hooks";
import { selectUser } from "../store/auth/auth.slice";
import { isPlatformUser } from "../utils/companyAccess";
import { COLORS } from "../theme/COLORS";

const Support = () => {
  const user = useSelector(selectUser);
  const { data: threadsData } = useSupportThreadsQuery();
  const threads = threadsData ?? [];
  const [searchParams, setSearchParams] = useSearchParams();
  const isAgent = Boolean(user && isPlatformUser(user));
  const ensureThread = useEnsureSupportThreadMutation();
  const sendMessage = useSendSupportMessageMutation();
  const markRead = useMarkSupportThreadReadMutation();

  const myThread = useMemo(
    () => threads.find((item) => item.requesterId === user?.id) ?? null,
    [threads, user?.id],
  );

  const selectedId = isAgent
    ? searchParams.get("thread")
    : (myThread?.id ?? null);
  const selectedThread =
    threads.find((item) => item.id === selectedId) ??
    (!isAgent ? myThread : null);

  const { data: messagesData } = useSupportMessagesQuery(selectedThread?.id);
  const threadMessages = messagesData ?? [];

  // For inbox unread badges, we only have selected thread messages loaded.
  // Pass empty for agent inbox unread until per-thread fetch; list still works.
  const inboxMessages = selectedThread
    ? getThreadMessages(threadMessages, selectedThread.id)
    : [];

  useEffect(() => {
    if (!selectedThread || !user) {
      return;
    }

    const viewer = isAgent ? "support" : "requester";

    if (!isThreadUnreadFor(selectedThread, threadMessages, viewer)) {
      return;
    }

    markRead.mutate({
      threadId: selectedThread.id,
      as: viewer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only remount when thread/user changes
  }, [isAgent, selectedThread?.id, user?.id, threadMessages.length]);

  const handleSend = async (body: string) => {
    if (!user) {
      return;
    }

    let threadId = selectedThread?.id;

    if (!threadId && !isAgent) {
      const thread = await ensureThread.mutateAsync();
      threadId = thread.id;
    }

    if (!threadId) {
      return;
    }

    await sendMessage.mutateAsync({ threadId, body });
    await markRead.mutateAsync({
      threadId,
      as: isAgent ? "support" : "requester",
    });

    if (isAgent) {
      setSearchParams({ thread: threadId });
    }
  };

  return (
    <PrivateLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
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
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(260px, 320px) 1fr",
              },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <SupportInboxList
              threads={threads}
              messages={inboxMessages}
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
