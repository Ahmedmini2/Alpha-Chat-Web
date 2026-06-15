"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, AlertTriangle } from "lucide-react";
import type { Conversation, ChatMessage, Card } from "@/lib/types";
import { fetchConversations, fetchMessages, postChat } from "@/lib/api";
import { Sidebar } from "./Sidebar";
import { MessageThread } from "./MessageThread";
import { Composer } from "./Composer";
import { EmptyState } from "./EmptyState";
import { ChatActionsProvider } from "./chat-actions";
import { Monogram } from "@/components/ui/Wordmark";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

const LAST_CONV_KEY = "alpha:lastConversation";
let tempId = -1; // client-only optimistic message ids (negative)

export function ChatApp({
  initialConversations,
  backendDown: initialBackendDown,
  user,
}: {
  initialConversations: Conversation[];
  backendDown: boolean;
  user: UserInfo;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [animateId, setAnimateId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendDown, setBackendDown] = useState(initialBackendDown);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const persistActive = useCallback((id: string | null) => {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set("c", id);
      localStorage.setItem(LAST_CONV_KEY, id);
    } else {
      url.searchParams.delete("c");
      localStorage.removeItem(LAST_CONV_KEY);
    }
    window.history.replaceState(null, "", url.toString());
  }, []);

  const openConversation = useCallback(
    async (id: string) => {
      setActiveId(id);
      persistActive(id);
      setSidebarOpen(false);
      setError(null);
      setLoadingThread(true);
      try {
        const msgs = await fetchMessages(id);
        setMessages(msgs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't load that conversation.");
        setMessages([]);
      } finally {
        setLoadingThread(false);
      }
    },
    [persistActive],
  );

  const newChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setError(null);
    persistActive(null);
    setSidebarOpen(false);
  }, [persistActive]);

  // Restore the last conversation from URL (?c=) or localStorage on first load.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const fromUrl = new URLSearchParams(window.location.search).get("c");
    const restore = fromUrl || localStorage.getItem(LAST_CONV_KEY);
    if (restore) void openConversation(restore);
  }, [openConversation]);

  async function refreshConversations() {
    try {
      const list = await fetchConversations();
      setConversations(list);
      setBackendDown(false);
    } catch {
      /* keep existing list */
    }
  }

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setError(null);

    const optimistic: ChatMessage = {
      id: tempId--,
      conversation_id: activeId ?? "",
      role: "user",
      content: trimmed,
      cards: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setPending(true);

    try {
      const res = await postChat({ message: trimmed, conversation_id: activeId });
      if (!activeId) {
        setActiveId(res.conversation_id);
        persistActive(res.conversation_id);
      }
      const assistant: ChatMessage = {
        id: res.message_id,
        conversation_id: res.conversation_id,
        role: "assistant",
        content: res.reply,
        cards: (res.cards as Card[]) ?? null,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistant]);
      setAnimateId(res.message_id);
      void refreshConversations();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Message failed. Please try again.");
      setBackendDown((d) => d); // unchanged; error shown inline
    } finally {
      setPending(false);
    }
  }

  const activeTitle = conversations.find((c) => c.id === activeId)?.title;

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={openConversation}
        onNewChat={newChat}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-fg-muted transition hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <Monogram size={24} />
          </div>
          <h1 className="truncate font-display text-[15px] font-medium text-fg">
            {activeTitle || "New conversation"}
          </h1>
        </header>

        {backendDown && (
          <div className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-5 py-2 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Can&apos;t reach the Ask Alpha backend. Check that it&apos;s running and that
            <code className="rounded bg-warning/15 px-1">ASK_ALPHA_API_URL</code> is set.
          </div>
        )}

        {/* Thread / empty state. The provider lets cards send follow-up messages
            (e.g. clicking a project card to select it). */}
        <ChatActionsProvider value={{ send: handleSend, busy: pending }}>
          <div className="relative flex-1 overflow-hidden">
            {messages.length === 0 && !loadingThread ? (
              <EmptyState userName={user.name} onPrompt={handleSend} />
            ) : (
              <MessageThread
                messages={messages}
                pending={pending}
                loading={loadingThread}
                animateId={animateId}
                onAnimateComplete={() => setAnimateId(null)}
              />
            )}
          </div>
        </ChatActionsProvider>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-4">
          {error && (
            <div className="mx-auto mb-2 max-w-3xl rounded-lg border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
              {error}
            </div>
          )}
          <Composer onSend={handleSend} disabled={pending} />
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-fg-subtle">
            Alpha can make mistakes. Verify important figures. Data is limited to the Allegiance database.
          </p>
        </div>
      </main>
    </div>
  );
}
