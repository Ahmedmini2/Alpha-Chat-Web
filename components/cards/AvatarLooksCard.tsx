"use client";

import { Sparkles, MousePointerClick } from "lucide-react";
import type { AvatarLooksCard as AvatarLooksCardData } from "@/lib/types";
import { CardFrame, Thumb } from "./kit";
import { useChatActions } from "@/components/chat/chat-actions";
import { cn } from "@/lib/cn";

export function AvatarLooksCard({ card }: { card: AvatarLooksCardData }) {
  const { send, busy } = useChatActions();
  const looks = (card.looks ?? []).filter((lk) => lk && lk.name);
  const eyebrow = card.agent_name?.trim() || undefined;
  const total = card.total_available;

  return (
    <CardFrame
      icon={<Sparkles className="h-4 w-4" />}
      eyebrow={eyebrow}
      title="Choose a look"
      accent
    >
      {looks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-6 text-center text-[13px] text-fg-subtle">
          No avatar looks are available yet.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {looks.map((look, i) => (
              <li key={`${look.name}-${i}`}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => !busy && send(look.name)}
                  title={`Use the “${look.name}” look`}
                  className={cn(
                    "group flex w-full flex-col rounded-lg outline-none transition",
                    "focus-visible:ring-2 focus-visible:ring-accent/40",
                    busy ? "opacity-60" : "cursor-pointer active:scale-[0.98]",
                  )}
                >
                  <Thumb
                    src={look.preview_url}
                    alt={look.name}
                    className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border transition group-hover:border-accent"
                  />
                  <span className="mt-1.5 line-clamp-2 text-center font-display text-[13px] font-semibold leading-snug text-fg transition group-hover:text-accent">
                    {look.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3.5 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-[12.5px] text-fg-muted">
            <MousePointerClick className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>
              Tap a look to generate the video.
              {card.truncated && total != null && (
                <span className="mt-0.5 block text-[11.5px] text-fg-subtle">
                  Showing {looks.length} of {total}.
                </span>
              )}
            </span>
          </div>
        </>
      )}
    </CardFrame>
  );
}
