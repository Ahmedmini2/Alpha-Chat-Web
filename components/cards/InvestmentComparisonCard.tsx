"use client";

import { Scale } from "lucide-react";
import type { InvestmentComparisonCard as InvestmentComparisonCardData } from "@/lib/types";
import {
  formatPrice,
  formatPctSigned,
  formatPct,
  formatInt,
  titleCase,
} from "@/lib/format";
import { CardFrame } from "./kit";
import { cn } from "@/lib/cn";

type Item = InvestmentComparisonCardData["items"][number];

/** A metric row: how to read a value, render it, and (optionally) which cell wins. */
type Row = {
  label: string;
  value: (it: Item) => string;
  /** Numeric used to decide the best cell; null => not eligible. */
  metric?: (it: Item) => number | null;
  /** "low" = lowest wins, "high" = highest wins. */
  best?: "low" | "high";
};

function num(n: number | null | undefined): number | null {
  return n != null && !Number.isNaN(n) ? n : null;
}

export function InvestmentComparisonCard({
  card,
}: {
  card: InvestmentComparisonCardData;
}) {
  const items = (card?.items ?? []).filter(Boolean);
  if (items.length === 0) return null;

  const rows: Row[] = [
    {
      label: "Asking rate / sqft",
      value: (it) =>
        num(it.asking_rate_aed_sqft) != null
          ? formatPrice(it.asking_rate_aed_sqft, "AED")
          : "—",
      metric: (it) => num(it.asking_rate_aed_sqft),
      best: "low",
    },
    {
      label: "Median price",
      value: (it) =>
        num(it.median_unit_price_aed) != null
          ? formatPrice(it.median_unit_price_aed, "AED")
          : "—",
      metric: (it) => num(it.median_unit_price_aed),
      best: "low",
    },
    {
      label: "Premium to market",
      value: (it) => formatPctSigned(it.premium_to_market_pct),
      metric: (it) => num(it.premium_to_market_pct),
      best: "low",
    },
    {
      label: "Momentum (12m)",
      value: (it) => formatPctSigned(it.market?.rate_momentum_pct ?? null),
      metric: (it) => num(it.market?.rate_momentum_pct ?? null),
      best: "high",
    },
    {
      label: "Supply",
      value: (it) =>
        num(it.units_count) != null ? `${formatInt(it.units_count)} units` : "—",
    },
    {
      label: "Type",
      value: (it) => (it.dominant_unit_type ? titleCase(it.dominant_unit_type) : "—"),
    },
    {
      label: "Valuation",
      value: (it) =>
        it.valuation_vs_market && it.valuation_vs_market !== "unknown"
          ? titleCase(it.valuation_vs_market)
          : "—",
    },
  ];

  // Precompute the winning column index per row where it's meaningful (>1 item
  // with a usable value and a tie-break). Guarded: ties yield no highlight.
  const bestIdx: (number | null)[] = rows.map((row) => {
    if (!row.best || !row.metric) return null;
    const vals = items.map((it) => row.metric!(it));
    const present = vals.filter((v): v is number => v != null);
    if (present.length < 2) return null;
    const target = row.best === "low" ? Math.min(...present) : Math.max(...present);
    // Only highlight if the winner is strictly unique.
    if (present.filter((v) => v === target).length !== 1) return null;
    return vals.findIndex((v) => v === target);
  });

  return (
    <CardFrame
      icon={<Scale className="h-4 w-4" />}
      eyebrow="Investment"
      title="Side-by-side comparison"
      accent
    >
      <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin]">
        <table className="w-full min-w-[440px] border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-surface pb-2 pr-3 text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-subtle">
                Metric
              </th>
              {items.map((it, i) => (
                <th
                  key={it.project_id ?? i}
                  className="max-w-[140px] pb-2 pl-3 align-bottom"
                >
                  <span className="block truncate font-display text-[13px] font-semibold leading-tight text-green-800">
                    {it.name || `Project ${i + 1}`}
                  </span>
                  {it.district && (
                    <span className="block truncate text-[11px] font-normal text-fg-subtle">
                      {it.district}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.label} className="border-t border-border">
                <th className="sticky left-0 z-10 bg-surface py-2.5 pr-3 text-[12px] font-medium text-fg-subtle">
                  {row.label}
                </th>
                {items.map((it, i) => {
                  const isBest = bestIdx[r] === i;
                  return (
                    <td
                      key={it.project_id ?? i}
                      className={cn(
                        "py-2.5 pl-3 text-[13px] tabular-nums",
                        isBest
                          ? "font-semibold text-accent-press"
                          : "font-medium text-fg",
                      )}
                    >
                      {row.value(it)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-fg-subtle">
        Gold cells flag the strongest value per metric.
      </p>
    </CardFrame>
  );
}
