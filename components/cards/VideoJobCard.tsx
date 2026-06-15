"use client";

import { Clapperboard, Loader2, Sparkles } from "lucide-react";
import type { VideoJobCard as VideoJobCardData } from "@/lib/types";
import { titleCase } from "@/lib/format";
import { CardFrame, Pill } from "./kit";

/**
 * "Generation started" confirmation for a HeyGen 9:16 promo video.
 * The job runs async on the backend — this card just reassures the user that
 * rendering is underway and tells them how to check back.
 */
export function VideoJobCard({ card }: { card: VideoJobCardData }) {
  const statusLabel = titleCase(card.status?.trim() || "Processing");
  const eyebrow = card.project_name?.trim() || "Ask Alpha Studio";

  return (
    <CardFrame
      icon={<Clapperboard className="h-4 w-4" />}
      eyebrow={eyebrow}
      title="Promo video"
      accent
      actions={
        <Pill tone="gold" className="shrink-0">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          {statusLabel}
        </Pill>
      }
    >
      {/* Cinematic 9:16 placeholder frame while the render is in flight */}
      <div className="flex items-stretch gap-3.5">
        <div className="silk relative grid aspect-[9/16] w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-border-gold/40">
          <Loader2 className="h-6 w-6 animate-spin text-gold-400/70" aria-hidden />
          <span className="absolute bottom-1.5 rounded bg-green-900/70 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-cream">
            9:16
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="flex items-center gap-1.5 font-display text-[15px] font-semibold leading-tight text-green-800">
            <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            Rendering your promo
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-muted">
            Rendering your 9:16 promo — usually ready in 1–2 minutes. Ask{" "}
            <span className="font-medium text-fg">&ldquo;is my video ready?&rdquo;</span> to check.
          </p>
          {card.video_id && (
            <p className="mt-2 truncate font-mono text-[10.5px] text-fg-subtle">
              ID {card.video_id}
            </p>
          )}
        </div>
      </div>
    </CardFrame>
  );
}
