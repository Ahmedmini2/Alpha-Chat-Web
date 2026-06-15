"use client";

import { Film } from "lucide-react";
import type { VideoStatusCard as VideoStatusCardData } from "@/lib/types";
import { CardFrame } from "./kit";
import { useVideoStatus, VideoResult } from "./video-shared";

/**
 * Result of "is my video ready?" — also self-updates if it's still rendering, so
 * the user never has to ask twice.
 */
export function VideoStatusCard({ card }: { card: VideoStatusCardData }) {
  const eyebrow = card.project_name?.trim() || undefined;
  const state = useVideoStatus(card.video_id, {
    status: card.status,
    videoUrl: card.video_url,
    thumbnailUrl: card.thumbnail_url,
    error: card.error_detail,
  });

  return (
    <CardFrame icon={<Film className="h-4 w-4" />} title="Promo video" eyebrow={eyebrow} accent>
      <VideoResult {...state} />
    </CardFrame>
  );
}
