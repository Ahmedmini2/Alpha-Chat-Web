"use client";

import { BarChart3 } from "lucide-react";
import type { InvestmentMetricsCard as InvestmentMetricsCardData } from "@/lib/types";
import {
  formatPrice,
  formatPct,
  formatPctSigned,
  formatDays,
  formatBeds,
  formatSize,
} from "@/lib/format";
import { CardFrame, Stat, StatGrid, Pill } from "./kit";

export function InvestmentMetricsCard({ card }: { card: InvestmentMetricsCardData }) {
  const eyebrow = (card.project_name || card.community || "").trim() || undefined;
  const m = card.metrics;
  const inputs = card.inputs;

  // Build the inputs caption (price · beds · size), guarding each part.
  const inputParts: string[] = [];
  if (inputs) {
    if (inputs.price_aed != null && inputs.price_aed > 0) {
      inputParts.push(formatPrice(inputs.price_aed));
    }
    if (inputs.beds != null) inputParts.push(formatBeds(inputs.beds));
    if (inputs.size_sqft != null && inputs.size_sqft > 0) {
      inputParts.push(formatSize(inputs.size_sqft));
    }
  }

  return (
    <CardFrame
      icon={<BarChart3 className="h-4 w-4" />}
      title="Investment summary"
      eyebrow={eyebrow}
      accent
      actions={
        card.used_area_fallback ? <Pill tone="warn">Area model</Pill> : undefined
      }
    >
      {m == null ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-3 text-[13px] text-fg-subtle">
          We couldn&apos;t model the numbers for these inputs yet — try a price, beds,
          size and community to get an area-based estimate.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <StatGrid cols={4}>
            {m.net_yield_pct != null && (
              <Stat label="Net yield" value={formatPct(m.net_yield_pct)} tone="accent" />
            )}
            {m.area_avg_rent_return_pct != null && (
              <Stat
                label="Area rent return"
                value={formatPct(m.area_avg_rent_return_pct)}
              />
            )}
            {m.annual_appreciation_pct != null && (
              <Stat
                label="Annual appreciation"
                value={formatPct(m.annual_appreciation_pct)}
                tone="good"
              />
            )}
            {m.y5_projected_value_aed != null && m.y5_projected_value_aed > 0 && (
              <Stat
                label="5-yr value"
                value={formatPrice(m.y5_projected_value_aed)}
              />
            )}
            {m.five_year_gain_pct != null && (
              <Stat
                label="5-yr gain"
                value={formatPct(m.five_year_gain_pct)}
                tone="good"
              />
            )}
            {m.time_to_sell_days != null && (
              <Stat label="Time to sell" value={formatDays(m.time_to_sell_days)} />
            )}
            {m.price_per_sqft_aed != null && m.price_per_sqft_aed > 0 && (
              <Stat
                label="Price / sqft"
                value={formatPrice(m.price_per_sqft_aed)}
              />
            )}
            {m.vs_area_price_pct != null && (
              <Stat
                label="vs area price"
                value={formatPctSigned(m.vs_area_price_pct)}
                hint={m.vs_area_price_pct < 0 ? "cheaper than area" : "premium to area"}
                tone={m.vs_area_price_pct < 0 ? "good" : "bad"}
              />
            )}
          </StatGrid>

          {inputParts.length > 0 && (
            <p className="text-[11.5px] text-fg-subtle">
              Modeled on{" "}
              <span className="font-medium text-fg">{inputParts.join(" · ")}</span>
            </p>
          )}

          {card.basis && (
            <p className="text-[10.5px] leading-relaxed text-fg-subtle/80">
              {card.basis}
            </p>
          )}
        </div>
      )}
    </CardFrame>
  );
}
