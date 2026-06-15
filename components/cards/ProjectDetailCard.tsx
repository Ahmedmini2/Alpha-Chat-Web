"use client";

import { Building2, FileText } from "lucide-react";
import type { ProjectDetailCard as ProjectDetailCardData } from "@/lib/types";
import {
  formatBeds,
  formatDate,
  formatPrice,
  formatPriceRange,
  formatSize,
  locationLine,
  titleCase,
} from "@/lib/format";
import {
  CardFrame,
  KeyValue,
  LinkButton,
  Pill,
  Thumb,
  statusTone,
} from "./kit";

/** Coerce the unknown `amenities` JSON into a clean list of string names. */
function amenityNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const v = item.trim();
      if (v) out.push(v);
    } else if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const name = o.name ?? o.title;
      if (typeof name === "string" && name.trim()) out.push(name.trim());
    }
  }
  return out;
}

export function ProjectDetailCard({ card }: { card: ProjectDetailCardData }) {
  const p = card?.project;
  if (!p) return null;

  const loc = locationLine(p.district, p.city || p.region, p.country);
  const completion = p.completion_quarter || formatDate(p.completion_date);
  const amenities = amenityNames(p.amenities).slice(0, 12);
  const units = (p.units_summary ?? []).slice(0, 6);

  return (
    <CardFrame
      icon={<Building2 className="h-4 w-4" />}
      eyebrow={p.developer || undefined}
      title={p.name || "Project"}
      accent
    >
      {/* Cover banner with overlaid sale status */}
      <div className="relative -mx-0 mb-3 overflow-hidden rounded-lg">
        <Thumb src={p.cover_image_url} alt={p.name || "Project"} className="h-44 w-full" />
        {p.sale_status && (
          <span className="absolute left-2.5 top-2.5">
            <Pill tone={statusTone(p.sale_status)}>{titleCase(p.sale_status)}</Pill>
          </span>
        )}
      </div>

      {loc && <p className="text-[12.5px] text-fg-subtle">{loc}</p>}

      {/* Lead price */}
      <p className="mt-1.5 font-display text-xl font-semibold text-green-800">
        {formatPriceRange(p.min_price, p.max_price, p.currency)}
      </p>

      {/* Detail facts */}
      <dl className="mt-3 divide-y divide-border/60">
        <KeyValue k="Completion" v={completion || undefined} />
        <KeyValue k="Furnishing" v={p.furnishing ? titleCase(p.furnishing) : undefined} />
        <KeyValue k="Service charge" v={p.service_charge || undefined} />
        <KeyValue k="Escrow" v={p.has_escrow == null ? undefined : p.has_escrow ? "Yes" : "No"} />
        <KeyValue k="Post-handover plan" v={p.post_handover ? "Yes" : undefined} />
        <KeyValue k="Managing company" v={p.managing_company || undefined} />
        <KeyValue k="Brand" v={p.brand || undefined} />
        <KeyValue
          k="Units"
          v={p.units_count != null && p.units_count > 0 ? p.units_count.toLocaleString("en-US") : undefined}
        />
      </dl>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="mt-3.5">
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Amenities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {amenities.map((a, i) => (
              <Pill key={`${a}-${i}`} tone="gold">
                {titleCase(a)}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {/* Unit mix */}
      {units.length > 0 && (
        <div className="mt-3.5">
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Available units
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-muted/50 text-[10.5px] uppercase tracking-[0.08em] text-fg-subtle">
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Beds</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="px-3 py-2 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {units.map((u, i) => (
                  <tr key={i} className="align-top">
                    <td className="px-3 py-2 text-fg">
                      {u.unit_type ? titleCase(u.unit_type) : u.layout_name || "—"}
                    </td>
                    <td className="px-3 py-2 text-fg-muted">{formatBeds(u.bedrooms)}</td>
                    <td className="px-3 py-2 text-fg-muted">{formatSize(u.size, u.area_unit)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-green-800">
                      {formatPrice(u.price, u.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brochure */}
      {p.marketing_brochure_url && (
        <div className="mt-4">
          <LinkButton href={p.marketing_brochure_url}>
            <FileText className="h-4 w-4" />
            View brochure
          </LinkButton>
        </div>
      )}
    </CardFrame>
  );
}
