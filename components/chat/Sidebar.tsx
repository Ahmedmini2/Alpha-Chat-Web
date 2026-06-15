"use client";

import { Plus, X, MessageSquare } from "lucide-react";
import type { Conversation } from "@/lib/types";
import { dateBucket, BUCKET_ORDER, type DateBucket } from "@/lib/format";
import { Wordmark } from "@/components/ui/Wordmark";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/cn";
import type { UserInfo } from "./ChatApp";

export function Sidebar({
  conversations,
  activeId,
  user,
  open,
  onClose,
  onSelect,
  onNewChat,
}: {
  conversations: Conversation[];
  activeId: string | null;
  user: UserInfo;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const groups = groupByDate(conversations);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-green-950/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "silk fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col text-cream transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <Wordmark variant="light" />
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-green-200 transition hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New chat */}
        <div className="px-3 pb-2">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2.5 rounded-lg border border-gold-500/30 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-cream transition hover:border-gold-500/60 hover:bg-white/10"
          >
            <Plus className="h-4 w-4 text-gold-400" />
            New chat
          </button>
        </div>

        {/* History */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-green-200/60">
              No conversations yet. Start by asking Alpha anything about Dubai property.
            </p>
          ) : (
            BUCKET_ORDER.filter((b) => groups[b]?.length).map((bucket) => (
              <div key={bucket} className="mb-3">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400/70">
                  {bucket}
                </p>
                <ul className="space-y-0.5">
                  {groups[bucket].map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => onSelect(c.id)}
                        className={cn(
                          "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] transition",
                          c.id === activeId
                            ? "bg-white/12 text-cream"
                            : "text-green-100/80 hover:bg-white/8 hover:text-cream",
                        )}
                      >
                        <MessageSquare
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            c.id === activeId ? "text-gold-400" : "text-green-300/60",
                          )}
                        />
                        <span className="truncate">{c.title || "Untitled"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </nav>

        {/* User */}
        <UserMenu user={user} />
      </aside>
    </>
  );
}

function groupByDate(conversations: Conversation[]): Record<DateBucket, Conversation[]> {
  const out = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
    Older: [],
  } as Record<DateBucket, Conversation[]>;
  for (const c of conversations) {
    out[dateBucket(c.updated_at)].push(c);
  }
  return out;
}
