"use client";

import { Sparkles, MessageSquareReply } from "lucide-react";
import type { AvatarLooksCard as AvatarLooksCardData } from "@/lib/types";
import { CardFrame, Thumb } from "./kit";

export function AvatarLooksCard({ card }: { card: AvatarLooksCardData }) {
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
              <li key={`${look.name}-${i}`} className="group flex flex-col">
                <Thumb
                  src={look.preview_url}
                  alt={look.name}
                  className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border transition group-hover:border-border-gold"
                />
                <p className="mt-1.5 line-clamp-2 text-center font-display text-[13px] font-semibold leading-snug text-fg">
                  {look.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-3.5 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-[12.5px] text-fg-muted">
            <MessageSquareReply className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>
              Reply with a look name to generate the video.
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
