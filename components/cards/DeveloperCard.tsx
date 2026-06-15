"use client";

import { Building2, Globe, MapPin } from "lucide-react";
import type { DeveloperCard as DeveloperCardData } from "@/lib/types";
import { formatPrice, formatPct, locationLine, titleCase } from "@/lib/format";
import { CardFrame, Stat, StatGrid, Pill, Thumb, LinkButton, statusTone } from "./kit";

export function DeveloperCard({ card }: { card: DeveloperCardData }) {
  const d = card?.developer;
  if (!d) return null;

  const projects = d.notable_projects ?? [];
  const coverage = locationLine(
    d.districts_active > 0 ? `${d.districts_active} district${d.districts_active === 1 ? "" : "s"}` : null,
    d.cities_active > 0 ? `${d.cities_active} cit${d.cities_active === 1 ? "y" : "ies"}` : null,
  );

  const website = d.website?.trim() || null;
  const websiteLabel = website
    ? website.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "")
    : null;

  // On-time tone: strong record -> good, weak -> warn.
  const onTimeTone =
    d.on_time_delivery_pct == null
      ? "default"
      : d.on_time_delivery_pct >= 80
        ? "good"
        : d.on_time_delivery_pct >= 50
          ? "warn"
          : "bad";

  return (
    <CardFrame
      icon={<Building2 className="h-4 w-4" />}
      eyebrow="Developer"
      title="Track Record"
      accent
      actions={
        website ? (
          <LinkButton href={website} variant="ghost">
            <Globe className="h-3.5 w-3.5" />
            Website
          </LinkButton>
        ) : undefined
      }
    >
      {/* Identity */}
      <div className="flex items-center gap-3">
        <Thumb
          src={d.logo_s3_url}
          alt={d.name || "Developer"}
          className="h-12 w-12 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-display text-[17px] font-semibold leading-tight text-fg">
            {d.name || "Developer"}
          </h4>
          {websiteLabel && (
            <p className="truncate text-[12px] text-fg-subtle">{websiteLabel}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3">
        <StatGrid cols={3}>
          {d.total_projects > 0 && <Stat label="Projects" value={d.total_projects} />}
          {d.on_sale > 0 && <Stat label="On sale" value={d.on_sale} tone="good" />}
          {d.delivered > 0 && <Stat label="Delivered" value={d.delivered} tone="accent" />}
          {d.upcoming > 0 && <Stat label="Upcoming" value={d.upcoming} />}
          {d.on_time_delivery_pct != null && (
            <Stat
              label="On-time"
              value={formatPct(d.on_time_delivery_pct, 0)}
              hint={d.on_time_basis || undefined}
              tone={onTimeTone}
            />
          )}
          {coverage && <Stat label="Coverage" value={coverage} />}
        </StatGrid>
      </div>

      {/* Description */}
      {d.description?.trim() && (
        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-fg-muted">
          {d.description.trim()}
        </p>
      )}

      {/* Notable projects */}
      {projects.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            Notable Projects
          </p>
          <ul className="divide-y divide-border">
            {projects.slice(0, 5).map((p, i) => (
              <li
                key={p?.id ?? i}
                className="flex items-center gap-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-fg">
                    {p?.name || "—"}
                  </p>
                  {p?.district && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-fg-subtle">
                      <MapPin className="h-3 w-3 shrink-0 text-accent" />
                      <span className="truncate">{p.district}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-display text-[13px] font-semibold text-green-800">
                    {formatPrice(p?.min_price)}
                  </span>
                  {p?.sale_status && (
                    <Pill tone={statusTone(p.sale_status)}>{titleCase(p.sale_status)}</Pill>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardFrame>
  );
}
