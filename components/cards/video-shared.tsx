"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, AlertTriangle } from "lucide-react";
import { fetchVideoStatus } from "@/lib/api";
import { titleCase } from "@/lib/format";
import { LinkButton, Pill } from "./kit";

const POLL_MS = 6000;
const MAX_TRIES = 80; // ~8 minutes of polling, then give up quietly

export interface VideoState {
  status: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  error: string | null;
}

function isTerminal(s: VideoState): boolean {
  const st = s.status;
  if (st === "completed") return !!s.videoUrl; // wait for the URL even if status flips first
  return st === "failed" || st === "error";
}

/**
 * Polls GET /api/videos/{id} until the promo video is ready (or fails), so the
 * card auto-updates to the finished player — no "is it ready?" needed. Also runs
 * on reload of an old conversation whose stored card is still "processing".
 */
export function useVideoStatus(
  videoId: string | null | undefined,
  initial: {
    status?: string | null;
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
    error?: string | null;
  },
): VideoState {
  const [state, setState] = useState<VideoState>({
    status: (initial.status || "processing").toLowerCase().trim(),
    videoUrl: initial.videoUrl ?? null,
    thumbnailUrl: initial.thumbnailUrl ?? null,
    error: initial.error ?? null,
  });
  const tries = useRef(0);

  useEffect(() => {
    if (!videoId) return;
    // Already done at mount? Don't poll.
    if (
      isTerminal({
        status: (initial.status || "").toLowerCase().trim(),
        videoUrl: initial.videoUrl ?? null,
        thumbnailUrl: initial.thumbnailUrl ?? null,
        error: initial.error ?? null,
      })
    ) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      tries.current += 1;
      try {
        const v = await fetchVideoStatus(videoId);
        if (cancelled) return;
        const next: VideoState = {
          status: (v.status || "").toLowerCase().trim(),
          videoUrl: v.video_url,
          thumbnailUrl: v.thumbnail_url,
          error: v.error,
        };
        setState(next);
        if (isTerminal(next)) return; // stop polling
      } catch {
        // transient error — keep trying
      }
      if (!cancelled && tries.current < MAX_TRIES) {
        timer = setTimeout(tick, POLL_MS);
      }
    };

    timer = setTimeout(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Only re-run if the video changes; polling continues via the timeout chain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return state;
}

/** Renders the right UI for a video's state: player, error, or a live spinner. */
export function VideoResult({ status, videoUrl, thumbnailUrl, error }: VideoState) {
  const completed = status === "completed" && !!videoUrl;
  const failed = status === "failed" || status === "error";

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-3 animate-[fade-in_0.4s_var(--ease-out)_both]">
        <div className="w-full max-w-[260px] overflow-hidden rounded-xl border border-border bg-black shadow-card">
          <video
            controls
            autoPlay
            muted
            playsInline
            poster={thumbnailUrl || undefined}
            src={videoUrl!}
            className="aspect-[9/16] w-full bg-black object-contain"
          />
        </div>
        <LinkButton href={videoUrl!} download>
          <Download className="h-4 w-4" />
          Download
        </LinkButton>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex flex-col items-start gap-2">
        <Pill tone="bad">
          <AlertTriangle className="h-3 w-3" />
          {titleCase(status) || "Failed"}
        </Pill>
        {error && <p className="text-[12px] leading-relaxed text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-stretch gap-3.5">
      <div className="silk relative grid aspect-[9/16] w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-border-gold/40">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
        <span className="absolute bottom-1.5 rounded bg-green-900/70 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-cream">
          9:16
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="font-display text-[15px] font-semibold leading-tight text-green-800">
          Rendering your promo…
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-muted">
          Usually ready in 1–2 minutes. This updates automatically — no need to ask.
        </p>
      </div>
    </div>
  );
}
