"use client";

import { LineChart, AlertTriangle, TrendingUp } from "lucide-react";
import type { InvestmentAnalysisCard as InvestmentAnalysisCardData } from "@/lib/types";
import { formatPrice, formatPctSigned, formatInt, titleCase } from "@/lib/format";
import { CardFrame, Stat, StatGrid, Pill } from "./kit";
import type { PillTone } from "./kit";
import { cn } from "@/lib/cn";

export function InvestmentAnalysisCard({ card }: { card: InvestmentAnalysisCardData }) {
  const a = card.analysis;
  if (!a) return null;

  const market = a.market ?? null;

  // Verdict: tone good if "below" market, warn if "above", neutral otherwise.
  const verdictRaw = (a.valuation_vs_market || "").toLowerCase();
  const verdictTone: PillTone = verdictRaw.includes("below")
    ? "good"
    : verdictRaw.includes("above")
      ? "warn"
      : "neutral";
  const hasVerdict = !!a.valuation_vs_market && verdictRaw !== "unknown";

  // Momentum tone.
  const momentum = market?.rate_momentum_pct;
  const momentumTone =
    momentum == null
      ? "default"
      : momentum > 0
        ? "good"
        : momentum < 0
          ? "bad"
          : "default";

  // Rate fields.
  const askingRate = a.asking_rate_aed_sqft;
  const areaRate = market?.median_rate_aed_sqft_12m;
  const medianPrice = a.median_unit_price_aed;
  const units = a.units_count;
  const unitType = a.dominant_unit_type;

  // Rental yield estimate.
  const ry = a.rental_yield_estimate ?? null;
  const yLow = ry?.gross_yield_low_pct;
  const yHigh = ry?.gross_yield_high_pct;
  const hasYield = ry && (yLow != null || yHigh != null);
  const yieldRange =
    yLow != null && yHigh != null
      ? `${yLow}–${yHigh}%`
      : yLow != null
        ? `${yLow}%`
        : yHigh != null
          ? `${yHigh}%`
          : null;

  const gaps = (a.data_gaps ?? []).filter((g) => g && g.trim());

  return (
    <CardFrame
      icon={<LineChart className="h-4 w-4" />}
      title="Investment analysis"
      eyebrow={a.name || undefined}
      accent
    >
      {/* Verdict line */}
      {(hasVerdict || a.premium_to_market_pct != null) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {hasVerdict && (
            <Pill tone={verdictTone}>
              <TrendingUp className="h-3 w-3" />
              {titleCase(a.valuation_vs_market)}
            </Pill>
          )}
          {a.premium_to_market_pct != null && (
            <span
              className={cn(
                "font-display text-[13px] font-semibold",
                verdictTone === "good"
                  ? "text-success"
                  : verdictTone === "warn"
                    ? "text-warning"
                    : "text-fg-subtle",
              )}
            >
              {formatPctSigned(a.premium_to_market_pct)} vs area
            </span>
          )}
        </div>
      )}

      <StatGrid cols={3}>
        {askingRate != null && (
          <Stat label="Asking rate" value={`${formatPrice(askingRate)}/sqft`} tone="accent" />
        )}
        {areaRate != null && (
          <Stat label="Area rate" value={`${formatPrice(areaRate)}/sqft`} />
        )}
        {momentum != null && (
          <Stat label="Momentum" value={formatPctSigned(momentum)} tone={momentumTone} />
        )}
        {units != null && units > 0 && (
          <Stat label="Supply" value={`${formatInt(units)} units`} />
        )}
        {unitType && (
          <Stat label="Type" value={titleCase(unitType)} />
        )}
        {medianPrice != null && (
          <Stat label="Median price" value={formatPrice(medianPrice)} />
        )}
      </StatGrid>

      {/* Rental yield estimate */}
      {hasYield && yieldRange && (
        <div className="mt-3 rounded-lg border border-gold-200 bg-gold-50/60 px-3.5 py-3">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-accent-press">
            Est. rental yield
          </p>
          <p className="mt-0.5 font-display text-xl font-semibold leading-tight text-green-800">
            {yieldRange}
          </p>
          {ry?.basis && (
            <p className="mt-1 text-[11px] leading-snug text-fg-subtle">{ry.basis}</p>
          )}
        </div>
      )}

      {/* Data gaps */}
      {gaps.length > 0 && (
        <ul className="mt-3 space-y-1">
          {gaps.map((g, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11.5px] leading-snug text-warning"
            >
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{titleCase(g.charAt(0)) + g.slice(1)}</span>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}
