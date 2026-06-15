"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

export function MessageThread({
  messages,
  pending,
  loading,
  animateId,
  onAnimateComplete,
}: {
  messages: ChatMessage[];
  pending: boolean;
  loading: boolean;
  animateId: number | null;
  onAnimateComplete: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="shimmer h-4 w-1/3 rounded" />
              <div className="shimmer h-4 w-3/4 rounded" />
              <div className="shimmer h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scroll-smooth px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-7">
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            message={m}
            animate={m.id === animateId}
            onAnimateComplete={onAnimateComplete}
          />
        ))}
        {pending && <TypingIndicator />}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}
