"use client";

import { Clapperboard } from "lucide-react";
import type { VideoJobCard as VideoJobCardData } from "@/lib/types";
import { CardFrame } from "./kit";
import { useVideoStatus, VideoResult } from "./video-shared";

/**
 * Promo-video card shown the moment generation starts. It polls the backend and
 * swaps itself to the finished player automatically once HeyGen is done.
 */
export function VideoJobCard({ card }: { card: VideoJobCardData }) {
  const eyebrow = card.project_name?.trim() || "Ask Alpha Studio";
  const state = useVideoStatus(card.video_id, { status: card.status });

  return (
    <CardFrame
      icon={<Clapperboard className="h-4 w-4" />}
      eyebrow={eyebrow}
      title="Promo video"
      accent
    >
      <VideoResult {...state} />
    </CardFrame>
  );
}
