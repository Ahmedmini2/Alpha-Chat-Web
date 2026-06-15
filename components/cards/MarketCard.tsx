"use client";

import { TrendingUp, Building2, Search } from "lucide-react";
import type { MarketCard as MarketCardData } from "@/lib/types";
import {
  formatPrice,
  formatPct,
  formatPctSigned,
  compactNumber,
  formatDate,
  titleCase,
  locationLine,
} from "@/lib/format";
import { CardFrame, Stat, StatGrid, Pill, statusTone } from "./kit";

export function MarketCard({ card }: { card: MarketCardData }) {
  const m = card?.market;
  if (!m) return null;

  const area = locationLine(m.community, m.district, m.city);

  // No data: a gentle note only.
  if (m.found === false) {
    const what = (m.query || "").trim() || area || "that area";
    return (
      <CardFrame
        icon={<Search className="h-4 w-4" />}
        title="Market intelligence"
        eyebrow={m.matched_name || undefined}
      >
        <p className="text-[13px] leading-relaxed text-fg-muted">
          We don&apos;t have transaction data for{" "}
          <span className="font-medium text-fg">{what}</span> yet.
        </p>
      </CardFrame>
    );
  }

  const momentum = m.rate_momentum_pct;
  const momentumTone =
    momentum == null ? "default" : momentum > 0 ? "good" : momentum < 0 ? "bad" : "default";

  const stats: Array<{ label: string; value: string; tone?: "default" | "good" | "bad" | "warn" | "accent" }> = [];
  if (m.median_rate_aed_sqft_12m != null && m.median_rate_aed_sqft_12m > 0)
    stats.push({ label: "Median rate", value: `${formatPrice(m.median_rate_aed_sqft_12m)}/sqft` });
  if (momentum != null)
    stats.push({ label: "90d momentum", value: formatPctSigned(momentum), tone: momentumTone });
  if (m.median_price_aed_12m != null && m.median_price_aed_12m > 0)
    stats.push({ label: "Median price", value: formatPrice(m.median_price_aed_12m) });
  if (m.txn_12m != null && m.txn_12m > 0)
    stats.push({ label: "Txns (12m)", value: compactNumber(m.txn_12m) });
  if (m.pct_offplan_12m != null)
    stats.push({ label: "Off-plan", value: formatPct(m.pct_offplan_12m), tone: "accent" });
  const lastDeal = formatDate(m.last_txn_date);
  if (lastDeal) stats.push({ label: "Last deal", value: lastDeal });

  const comps = (m.recent_comparables ?? []).filter(
    (c) => c && (c.price_aed != null || c.rate_aed_sqft != null),
  );

  return (
    <CardFrame
      icon={<TrendingUp className="h-4 w-4" />}
      title="Market intelligence"
      eyebrow={m.matched_name || undefined}
      accent
      actions={
        m.activity_label ? (
          <Pill tone={statusTone(m.activity_label)}>{titleCase(m.activity_label)}</Pill>
        ) : undefined
      }
    >
      {area && <p className="mb-3 text-[12px] text-fg-subtle">{area}</p>}

      {stats.length > 0 && (
        <StatGrid cols={3}>
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} tone={s.tone} />
          ))}
        </StatGrid>
      )}

      {m.summary && (
        <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{m.summary}</p>
      )}

      {comps.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-subtle">
            Recent comparables
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border bg-muted/30">
            {comps.slice(0, 5).map((c, i) => {
              const title =
                c.project || c.building || titleCase(c.property_type) || "Recent deal";
              const sub = locationLine(c.layout, c.sale_type);
              return (
                <li
                  key={`${title}-${i}`}
                  className="flex items-baseline justify-between gap-3 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-[12.5px] font-medium text-fg">
                      <Building2 className="h-3 w-3 shrink-0 text-accent" />
                      <span className="truncate">{title}</span>
                    </p>
                    {sub && <p className="mt-0.5 truncate text-[11px] text-fg-subtle">{sub}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    {c.price_aed != null && c.price_aed > 0 && (
                      <p className="font-display text-[13px] font-semibold text-green-800">
                        {formatPrice(c.price_aed)}
                      </p>
                    )}
                    {c.rate_aed_sqft != null && c.rate_aed_sqft > 0 && (
                      <p className="text-[11px] text-fg-subtle">
                        {formatPrice(c.rate_aed_sqft)}/sqft
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </CardFrame>
  );
}
