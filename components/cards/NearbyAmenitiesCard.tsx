"use client";

import {
  MapPin,
  GraduationCap,
  Stethoscope,
  Cross,
  Plus,
  ShoppingBag,
  ShoppingCart,
  TrainFront,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { NearbyAmenitiesCard as NearbyAmenitiesCardData } from "@/lib/types";
import { formatDistance, titleCase } from "@/lib/format";
import { CardFrame } from "./kit";
import { cn } from "@/lib/cn";

/** Maps a backend POI category key to a fitting lucide icon. */
function categoryIcon(key: string): LucideIcon {
  const k = key.toLowerCase();
  if (/school|kindergarten|college|university|education/.test(k)) return GraduationCap;
  if (/hospital/.test(k)) return Cross;
  if (/clinic|doctor|medical|health/.test(k)) return Stethoscope;
  if (/pharmacy|chemist/.test(k)) return Plus;
  if (/mall|department/.test(k)) return ShoppingBag;
  if (/supermarket|grocery|store/.test(k)) return ShoppingCart;
  if (/metro|station|train|rail|transit/.test(k)) return TrainFront;
  if (/park|garden|leisure/.test(k)) return Trees;
  if (/beach|shore|coast/.test(k)) return Waves;
  return MapPin;
}

export function NearbyAmenitiesCard({ card }: { card: NearbyAmenitiesCardData }) {
  const a = card?.amenities;

  const entries = Object.entries(a?.categories ?? {}).filter(
    ([, items]) => Array.isArray(items) && items.length > 0,
  );
  const total =
    a?.total ?? entries.reduce((sum, [, items]) => sum + (items?.length ?? 0), 0);

  const eyebrow = a?.project_name ? a.project_name : undefined;

  // Nothing to show — gentle note only.
  if (a?.found === false || total <= 0 || entries.length === 0) {
    return (
      <CardFrame icon={<MapPin className="h-4 w-4" />} title="What's nearby" eyebrow={eyebrow}>
        <p className="text-[13px] leading-relaxed text-fg-subtle">
          No nearby amenities on record for this location yet.
        </p>
      </CardFrame>
    );
  }

  const radiusKm =
    a?.radius_m != null && a.radius_m > 0
      ? Number((a.radius_m / 1000).toFixed(a.radius_m % 1000 === 0 ? 0 : 1))
      : null;
  const source = a?.source?.trim() || null;

  return (
    <CardFrame
      icon={<MapPin className="h-4 w-4" />}
      title="What's nearby"
      eyebrow={eyebrow}
      accent
    >
      <div className="space-y-4">
        {entries.map(([key, rawItems]) => {
          const items = (rawItems ?? []).filter((it) => it && (it.name || it.distance_m != null));
          if (items.length === 0) return null;
          const Icon = categoryIcon(key);
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                  {titleCase(key.replace(/_/g, " "))}
                </h4>
              </div>
              <ul className="divide-y divide-border/70 rounded-lg border border-border bg-muted/30">
                {items.map((it, i) => (
                  <li
                    key={`${key}-${i}`}
                    className="flex items-baseline justify-between gap-3 px-3 py-2"
                  >
                    <span className="min-w-0 truncate text-[13px] font-medium text-fg">
                      {it?.name?.trim() || "Unnamed place"}
                    </span>
                    {it?.distance_m != null && (
                      <span className="shrink-0 font-display text-[13px] font-semibold text-green-800">
                        {formatDistance(it.distance_m)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {(radiusKm != null || source) && (
        <p className={cn("mt-3.5 text-[11px] text-fg-subtle")}>
          {radiusKm != null && <>Within {radiusKm} km</>}
          {radiusKm != null && source && <> · </>}
          {source && <>source {source}</>}
        </p>
      )}
    </CardFrame>
  );
}
