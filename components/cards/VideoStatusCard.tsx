"use client";

import { Film, Download, Loader2, AlertTriangle } from "lucide-react";
import type { VideoStatusCard as VideoStatusCardData } from "@/lib/types";
import { titleCase } from "@/lib/format";
import { CardFrame, Pill, LinkButton } from "./kit";

export function VideoStatusCard({ card }: { card: VideoStatusCardData }) {
  const status = (card.status || "").toLowerCase().trim();
  const videoUrl = card.video_url || null;
  const isCompleted = status === "completed" && !!videoUrl;
  const isFailed = status === "failed" || status === "error";

  const eyebrow = card.project_name ? card.project_name : undefined;

  return (
    <CardFrame icon={<Film className="h-4 w-4" />} title="Promo video" eyebrow={eyebrow} accent>
      {isCompleted ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-[260px] overflow-hidden rounded-xl border border-border bg-black shadow-card">
            <video
              controls
              playsInline
              poster={card.thumbnail_url || undefined}
              src={videoUrl!}
              className="aspect-[9/16] w-full bg-black object-contain"
            />
          </div>
          <LinkButton href={videoUrl!} download>
            <Download className="h-4 w-4" />
            Download
          </LinkButton>
        </div>
      ) : isFailed ? (
        <div className="flex flex-col items-start gap-2">
          <Pill tone="bad">
            <AlertTriangle className="h-3 w-3" />
            {titleCase(status) || "Failed"}
          </Pill>
          {card.error_detail && (
            <p className="text-[12px] leading-relaxed text-danger">{card.error_detail}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3.5 py-3">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent" />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-fg">Still rendering…</p>
            <p className="text-[12px] text-fg-subtle">Check back in a minute.</p>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
