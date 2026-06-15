"use client";

import { cn } from "@/lib/cn";

export type VerdictTone = "good" | "neutral" | "warn" | "bad";

/** Map a free-text verdict to a tone for coloring badges/meters. */
export function verdictTone(v?: string | null): VerdictTone {
  const s = (v || "").toLowerCase();
  if (!s) return "neutral";
  if (/(strong buy|strong|accumulate|undervalue|below market|opportunit|bargain|cheap)/.test(s)) return "good";
  if (/\bbuy\b/.test(s)) return "good";
  if (/(pass|avoid|overpric|above market|stretched|expensive|sell|caution|risk)/.test(s)) return "bad";
  if (/(hold|neutral|fair|in line|watch|monitor|mixed)/.test(s)) return "neutral";
  return "neutral";
}

/** Normalize conviction (0–100 number, 0–1 number, or a label) to a 0–100 percent. */
export function convictionPct(c?: number | string | null): number | null {
  if (c == null) return null;
  if (typeof c === "number") {
    if (!Number.isFinite(c)) return null;
    if (c <= 1) return Math.round(c * 100);
    return Math.round(Math.min(c, 100));
  }
  const s = c.toLowerCase().trim();
  if (/high|strong/.test(s)) return 85;
  if (/med|moderate/.test(s)) return 60;
  if (/low|weak/.test(s)) return 30;
  const n = parseFloat(s);
  if (Number.isFinite(n)) return n <= 1 ? Math.round(n * 100) : Math.round(Math.min(n, 100));
  return null;
}

const TONE_PILL: Record<VerdictTone, string> = {
  good: "bg-success/15 text-success",
  neutral: "bg-white/8 text-fg-muted",
  warn: "bg-warning/15 text-warning",
  bad: "bg-danger/15 text-danger",
};

const TONE_BAR: Record<VerdictTone, string> = {
  good: "bg-success",
  neutral: "bg-accent",
  warn: "bg-warning",
  bad: "bg-danger",
};

/** Compact verdict + conviction badge (for project tiles). */
export function VerdictBadge({
  verdict,
  conviction,
  className,
}: {
  verdict?: string | null;
  conviction?: number | string | null;
  className?: string;
}) {
  const pct = convictionPct(conviction);
  if (!verdict && pct == null) return null;
  const tone = verdictTone(verdict);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
        TONE_PILL[tone],
        className,
      )}
      title={
        (verdict || "Verdict") + (pct != null ? ` · ${pct}/100 conviction` : "")
      }
    >
      {verdict || "Verdict"}
      {pct != null && <span className="opacity-70">· {pct}</span>}
    </span>
  );
}

/** A labelled conviction meter (for the verdict card). */
export function ConvictionMeter({
  conviction,
  tone = "neutral",
}: {
  conviction?: number | string | null;
  tone?: VerdictTone;
}) {
  const pct = convictionPct(conviction);
  if (pct == null) return null;
  return (
    <div className="w-full">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
          Conviction
        </span>
        <span className="font-display text-sm font-semibold text-fg">{pct}/100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full transition-all", TONE_BAR[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
