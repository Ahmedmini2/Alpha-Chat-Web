"use client";

import { MapPin, Layers, ChevronRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/types";
import { formatPrice, formatPriceRange, formatBeds, locationLine, titleCase } from "@/lib/format";
import { Pill, statusTone } from "./kit";
import { VerdictBadge } from "./verdict";
import { useChatActions } from "@/components/chat/chat-actions";
import { cn } from "@/lib/cn";

function bedsRange(min: number | null, max: number | null): string {
  if (min == null && max == null) return "";
  if (min != null && max != null && min !== max) return `${formatBeds(min)}–${formatBeds(max)}`;
  return formatBeds(min ?? max);
}

/**
 * Compact property tile for ProjectSummary items (project_list, suggestions).
 * Clickable: selecting it sends the project name back into the chat, so the user
 * can pick "this one" for the next action (details, a video, etc.).
 */
export function ProjectCard({
  project,
  className,
}: {
  project: ProjectSummary;
  className?: string;
}) {
  const { send, busy } = useChatActions();
  const loc = locationLine(project.district, project.city || project.region, project.country);
  const initial = (project.name || "A").trim().charAt(0).toUpperCase();

  const choose = () => {
    if (busy || !project.name) return;
    send(project.name);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Select ${project.name}`}
      title={`Select ${project.name}`}
      onClick={choose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          choose();
        }
      }}
      className={cn(
        "group flex w-60 shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft outline-none transition",
        "hover:border-border-gold hover:shadow-card focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 active:scale-[0.99]",
        busy && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Silk banner (no photo in summary payload) */}
      <div className="silk relative flex h-20 items-center justify-center">
        <span className="font-display text-3xl text-gold-400/50">{initial}</span>
        {project.sale_status && (
          <span className="absolute left-2.5 top-2.5">
            <Pill tone={statusTone(project.sale_status)}>{titleCase(project.sale_status)}</Pill>
          </span>
        )}
        {(project.verdict || project.conviction != null) && (
          <span className="absolute right-2.5 top-2.5">
            <VerdictBadge verdict={project.verdict} conviction={project.conviction} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h4 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-fg transition group-hover:text-accent">
          {project.name}
        </h4>
        {project.developer && (
          <p className="mt-0.5 text-[12px] text-fg-subtle">{project.developer}</p>
        )}

        {loc && (
          <p className="mt-2 flex items-center gap-1 text-[12px] text-fg-muted">
            <MapPin className="h-3 w-3 shrink-0 text-accent" />
            <span className="truncate">{loc}</span>
          </p>
        )}

        <div className="mt-auto pt-3">
          <p className="font-display text-[15px] font-semibold text-green-800">
            {formatPriceRange(project.min_price, project.max_price, project.currency)}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-fg-subtle">
            {project.completion_quarter && (
              <span className="rounded bg-muted px-1.5 py-0.5">{project.completion_quarter}</span>
            )}
            {project.units_count != null && project.units_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {project.units_count} units
              </span>
            )}
          </div>

          {project.matched_units && project.matched_units.count > 0 && (
            <div className="mt-2 rounded-lg border border-border-gold bg-gold-50 px-2.5 py-1.5">
              <p className="text-[11px] font-semibold text-gold-900">
                {project.matched_units.count} matching{" "}
                {project.matched_units.count === 1 ? "unit" : "units"}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-fg-muted">
                {[
                  bedsRange(project.matched_units.bedrooms_min, project.matched_units.bedrooms_max),
                  project.matched_units.min_price
                    ? `from ${formatPrice(project.matched_units.min_price, project.matched_units.currency)}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}

          {/* Click affordance */}
          <p className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-accent opacity-0 transition group-hover:opacity-100">
            Select <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    </article>
  );
}
