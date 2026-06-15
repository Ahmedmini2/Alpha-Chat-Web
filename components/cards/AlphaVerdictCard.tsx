"use client";

import { Gauge, Coins, Scale, Target, ShieldAlert } from "lucide-react";
import type { AlphaVerdictCard as AlphaVerdictCardData, PillarValue } from "@/lib/types";
import { CardFrame, Stat, StatGrid, Pill } from "./kit";
import { ConvictionMeter, verdictTone } from "./verdict";
import { formatPct, formatPctSigned, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Tolerate a pillar as a string, number, or { label, note, score } object. */
function pillarText(v: PillarValue | undefined): { label: string; note?: string } | null {
  if (v == null) return null;
  if (typeof v === "string") return v.trim() ? { label: v.trim() } : null;
  if (typeof v === "number") return Number.isFinite(v) ? { label: String(v) } : null;
  const label = v.label?.trim() || (v.score != null ? String(v.score) : "");
  const note = v.note?.trim() || undefined;
  if (!label && !note) return null;
  return { label: label || "—", note };
}

const PILLARS = [
  { key: "yield", title: "Yield", icon: Coins },
  { key: "comp", title: "Comparables", icon: Scale },
  { key: "thesis", title: "Thesis", icon: Target },
  { key: "risk", title: "Risk", icon: ShieldAlert },
] as const;

const HEAD_TONE = {
  good: "text-success",
  neutral: "text-fg",
  warn: "text-warning",
  bad: "text-danger",
} as const;

export function AlphaVerdictCard({ card }: { card: AlphaVerdictCardData }) {
  const tone = verdictTone(card.verdict);
  const eyebrow = card.project_name?.trim() || card.community?.trim() || "Verdict";
  const n = card.numbers ?? {};
  const pillars = card.pillars ?? {};
  const hasNumbers = Object.values(n).some((v) => v != null);
  const hasPillars = PILLARS.some((p) => pillarText(pillars[p.key]));

  return (
    <CardFrame
      icon={<Gauge className="h-4 w-4" />}
      eyebrow={eyebrow}
      title="Alpha verdict"
      accent
      actions={card.used_fallback ? <Pill tone="warn">Area model</Pill> : undefined}
    >
      {/* Verdict headline + conviction meter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("font-display text-xl font-semibold leading-tight", HEAD_TONE[tone])}>
          {card.verdict || "No clear call"}
        </p>
        <div className="sm:w-44">
          <ConvictionMeter conviction={card.conviction} tone={tone} />
        </div>
      </div>

      {/* Four pillars */}
      {hasPillars && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PILLARS.map(({ key, title, icon: Icon }) => {
            const pt = pillarText(pillars[key]);
            if (!pt) return null;
            return (
              <div key={key} className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-subtle">
                  <Icon className="h-3 w-3 text-accent" />
                  {title}
                </p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-fg">{pt.label}</p>
                {pt.note && (
                  <p className="mt-0.5 text-[11.5px] leading-snug text-fg-subtle">{pt.note}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Numbers */}
      {hasNumbers && (
        <div className="mt-4">
          <StatGrid cols={3}>
            {n.net_yield_pct != null && (
              <Stat label="Net yield" value={formatPct(n.net_yield_pct)} tone="accent" />
            )}
            {n.area_rent_return_pct != null && (
              <Stat label="Area rent return" value={formatPct(n.area_rent_return_pct)} />
            )}
            {n.annual_appreciation_pct != null && (
              <Stat label="Annual appreciation" value={formatPct(n.annual_appreciation_pct)} tone="good" />
            )}
            {n.y5_value_aed != null && (
              <Stat label="5-yr value" value={formatPrice(n.y5_value_aed)} />
            )}
            {n.ppsf_aed != null && <Stat label="Price / sqft" value={formatPrice(n.ppsf_aed)} />}
            {n.vs_area_price_pct != null && (
              <Stat
                label="vs area price"
                value={formatPctSigned(n.vs_area_price_pct)}
                tone={n.vs_area_price_pct <= 0 ? "good" : "warn"}
              />
            )}
          </StatGrid>
        </div>
      )}

      {card.basis && (
        <p className="mt-3 text-[11px] leading-relaxed text-fg-subtle">{card.basis}</p>
      )}
    </CardFrame>
  );
}
