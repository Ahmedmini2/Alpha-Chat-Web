"use client";

import { Radar, BadgeCheck } from "lucide-react";
import type { LiveMarketCard as LiveMarketCardData, Valuation } from "@/lib/types";
import { CardFrame, Stat, StatGrid, Pill } from "./kit";
import { formatPrice, formatPct, formatInt, timeAgo } from "@/lib/format";

/** Valuation as a single AED number or a low/mid/high range. */
function valuationText(v: Valuation): string | null {
  if (v == null) return null;
  if (typeof v === "number") return v > 0 ? formatPrice(v) : null;
  const { low, mid, high } = v;
  if (mid != null) return formatPrice(mid);
  if (low != null && high != null) return `${formatPrice(low)} – ${formatPrice(high)}`;
  return formatPrice(low ?? high ?? null);
}

/** `sold` may be a count, a price, or a boolean. */
function soldText(sold: number | boolean | string | null | undefined): string | null {
  if (sold == null) return null;
  if (typeof sold === "boolean") return sold ? "Yes" : "No";
  if (typeof sold === "number") {
    if (!Number.isFinite(sold)) return null;
    return sold > 100_000 ? formatPrice(sold) : formatInt(sold);
  }
  return String(sold).trim() || null;
}

export function LiveMarketCard({ card }: { card: LiveMarketCardData }) {
  const val = valuationText(card.valuation);
  const eyebrow = card.project_name?.trim() || card.community?.trim() || undefined;
  const fetched = card.fetched_at ? timeAgo(card.fetched_at) : null;
  const sold = soldText(card.sold);

  return (
    <CardFrame
      icon={<Radar className="h-4 w-4" />}
      eyebrow={eyebrow}
      title="Live market"
      accent
      actions={
        <Pill tone="green" className="shrink-0">
          <BadgeCheck className="h-3 w-3" />
          Property Monitor · live
        </Pill>
      }
    >
      <StatGrid cols={2}>
        {val && <Stat label="Valuation (AVM)" value={val} tone="accent" />}
        {card.ppsf_aed != null && <Stat label="Price / sqft" value={formatPrice(card.ppsf_aed)} />}
        {card.observed_yield_pct != null && (
          <Stat label="Observed yield" value={formatPct(card.observed_yield_pct)} tone="good" />
        )}
        {sold && <Stat label="Sold" value={sold} />}
      </StatGrid>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-fg-subtle">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
        Live data from Property Monitor{fetched ? ` · fetched ${fetched}` : ""}.
      </p>
    </CardFrame>
  );
}
