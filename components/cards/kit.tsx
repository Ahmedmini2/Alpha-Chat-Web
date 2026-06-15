"use client";

/* ============================================================================
   Shared card UI kit — the building blocks every Ask Alpha card composes from,
   so the whole card system looks like one premium Allegiance product.
   Brand: green #06342C · gold #C1A777 · ivory paper. Keep cards composing THESE
   primitives rather than re-styling from scratch.
   ============================================================================ */

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Outer frame for a card. Optional header with icon + title + eyebrow + actions. */
export function CardFrame({
  children,
  className,
  icon,
  title,
  eyebrow,
  actions,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  eyebrow?: string;
  actions?: ReactNode;
  /** When true, a thin gold rule sits under the header. */
  accent?: boolean;
}) {
  const hasHeader = icon || title || eyebrow || actions;
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-card",
        className,
      )}
    >
      {hasHeader && (
        <header
          className={cn(
            "flex items-center gap-2.5 px-4 pt-3.5",
            accent ? "pb-3" : "pb-2",
          )}
        >
          {icon && (
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-accent">
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="truncate font-display text-[15px] font-semibold leading-tight text-fg">
                {title}
              </h3>
            )}
          </div>
          {actions}
        </header>
      )}
      {accent && hasHeader && <div className="rule-gold mx-4 mb-1" />}
      <div className={cn(hasHeader ? "px-4 pb-4" : "p-4")}>{children}</div>
    </section>
  );
}

/** A labelled metric tile. `tone` colors the value for momentum/verdict context. */
export function Stat({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "bad" | "warn" | "accent";
  className?: string;
}) {
  const toneClass = {
    default: "text-fg",
    good: "text-success",
    bad: "text-danger",
    warn: "text-warning",
    accent: "text-accent-press",
  }[tone];
  return (
    <div className={cn("rounded-lg border border-border bg-muted/40 px-3 py-2.5", className)}>
      <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-subtle">{label}</p>
      <p className={cn("mt-0.5 font-display text-lg font-semibold leading-tight", toneClass)}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-fg-subtle">{hint}</p>}
    </div>
  );
}

/** Responsive grid for Stat tiles. */
export function StatGrid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  const c = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[cols];
  return <div className={cn("grid gap-2", c)}>{children}</div>;
}

export type PillTone = "neutral" | "green" | "gold" | "good" | "bad" | "warn";

/** A small status pill. */
export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  const tones: Record<PillTone, string> = {
    neutral: "bg-white/6 text-fg-muted",
    green: "bg-[rgba(196,245,66,0.12)] text-accent",
    gold: "bg-[rgba(196,245,66,0.12)] text-accent",
    good: "bg-success/12 text-success",
    bad: "bg-danger/12 text-danger",
    warn: "bg-warning/12 text-warning",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Key/value row used in detail lists. */
export function KeyValue({ k, v }: { k: string; v: ReactNode }) {
  if (v == null || v === "" || v === "—") return null;
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-[12.5px] text-fg-subtle">{k}</dt>
      <dd className="text-right text-[13px] font-medium text-fg">{v}</dd>
    </div>
  );
}

/** Image with graceful gradient fallback when src is missing or fails. */
export function Thumb({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900",
          className,
        )}
      >
        <span className="font-display text-2xl text-gold-400/60">A</span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 320px"
        className="object-cover"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

/** A button-styled external link (downloads, websites, videos). */
export function LinkButton({
  href,
  children,
  variant = "primary",
  download,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition",
        variant === "primary"
          ? "bg-primary text-ink hover:bg-primary-hover"
          : "border border-border-strong text-fg hover:bg-muted",
      )}
    >
      {children}
    </a>
  );
}

/** Maps a sale-status / activity string to a sensible pill tone. */
export function statusTone(s: string | null | undefined): PillTone {
  const v = (s || "").toLowerCase();
  if (/(on sale|available|selling|for sale)/.test(v)) return "good";
  if (/(sold out|out of stock|unavailable)/.test(v)) return "bad";
  if (/(off plan|presale|pre-sale|coming|announced)/.test(v)) return "gold";
  if (/(completed|ready|delivered|handover)/.test(v)) return "green";
  if (/(hot|rising|strong)/.test(v)) return "good";
  if (/(cooling|quiet|slow|soft)/.test(v)) return "warn";
  if (/(healthy|active|balanced)/.test(v)) return "green";
  return "neutral";
}

/** A horizontal scroller for card carousels (project lists). */
export function Carousel({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      {children}
    </div>
  );
}
