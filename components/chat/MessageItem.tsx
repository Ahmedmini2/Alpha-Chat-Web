"use client";

import { useEffect, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { Markdown } from "./Markdown";
import { CardRenderer } from "@/components/cards/CardRenderer";
import { Monogram } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";

export function MessageItem({
  message,
  animate,
  onAnimateComplete,
}: {
  message: ChatMessage;
  animate: boolean;
  onAnimateComplete: () => void;
}) {
  const isUser = message.role === "user";
  const full = message.content || "";
  const [revealed, setRevealed] = useState(animate ? 0 : full.length);
  const done = revealed >= full.length;

  useEffect(() => {
    if (!animate) {
      setRevealed(full.length);
      return;
    }
    setRevealed(0);
    const step = Math.max(1, Math.ceil(full.length / 90)); // finish in ~1s
    let i = 0;
    const timer = setInterval(() => {
      i += step;
      if (i >= full.length) {
        setRevealed(full.length);
        clearInterval(timer);
        onAnimateComplete();
      } else {
        setRevealed(i);
      }
    }, 16);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, full]);

  if (isUser) {
    return (
      <div className="flex justify-end animate-[rise_0.3s_var(--ease-out)_both]">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-border bg-elevated px-4 py-2.5 text-[15px] leading-relaxed text-fg shadow-soft">
          <p className="whitespace-pre-wrap break-words">{full}</p>
        </div>
      </div>
    );
  }

  const cards = message.cards ?? [];
  const visibleText = animate && !done ? full.slice(0, revealed) : full;

  return (
    <div className="flex gap-3.5 animate-[rise_0.3s_var(--ease-out)_both]">
      <span className="mt-0.5 shrink-0">
        <Monogram size={30} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[13px] font-semibold tracking-tight text-fg">
          Alpha
          <span className="ml-2 align-middle text-[10px] font-normal uppercase tracking-[0.16em] text-fg-subtle">
            Allegiance
          </span>
        </p>

        {visibleText ? (
          <div className="relative">
            <Markdown content={visibleText} />
            {animate && !done && (
              <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[1px] bg-accent align-middle animate-[blink_1s_steps(1)_infinite]" />
            )}
          </div>
        ) : !done ? null : (
          <p className="text-fg-subtle italic">No reply.</p>
        )}

        {/* Cards reveal once the text finishes typing */}
        {cards.length > 0 && done && (
          <div className={cn("mt-4 flex flex-col gap-4", "animate-[fade-in_0.4s_var(--ease-out)_both]")}>
            {cards.map((card, i) => (
              <CardRenderer key={i} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
