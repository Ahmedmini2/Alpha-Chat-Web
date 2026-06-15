// Formatting helpers — AED-first (USD in brackets above 1M), Dubai real-estate idioms.

// AED is pegged to USD at 3.6725.
const AED_PER_USD = 3.6725;

/** Compact AED price, e.g. "AED 1.2M", "AED 850K". USD added in brackets above 1M. */
export function formatPrice(
  value: number | null | undefined,
  currency: string | null = "AED",
): string {
  if (value == null || Number.isNaN(value) || value <= 0) return "Price on request";
  const cur = currency || "AED";
  const compact = compactNumber(value);
  let out = `${cur} ${compact}`;
  if (cur === "AED" && value >= 1_000_000) {
    const usd = value / AED_PER_USD;
    out += ` ($${compactNumber(usd)})`;
  }
  return out;
}

/** A price range "AED 1.2M – 3.4M" (collapses to single value when equal/missing). */
export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null = "AED",
): string {
  const lo = min && min > 0 ? min : null;
  const hi = max && max > 0 ? max : null;
  if (lo && hi && hi > lo) {
    const cur = currency || "AED";
    return `${cur} ${compactNumber(lo)} – ${compactNumber(hi)}`;
  }
  return formatPrice(lo ?? hi, currency);
}

/** 1500000 -> "1.5M", 850000 -> "850K", 1234 -> "1,234". */
export function compactNumber(value: number): string {
  const n = Math.abs(value);
  if (n >= 1_000_000_000) return trim(value / 1_000_000_000) + "B";
  if (n >= 1_000_000) return trim(value / 1_000_000) + "M";
  if (n >= 1_000) return trim(value / 1_000) + "K";
  return Math.round(value).toLocaleString("en-US");
}

function trim(n: number): string {
  return n.toFixed(n % 1 === 0 ? 0 : n >= 100 ? 0 : 1).replace(/\.0$/, "");
}

/** Plain integer with thousands separators. */
export function formatInt(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

/** Signed percent, e.g. "+6.1%", "-3.2%", "0%". */
export function formatPctSigned(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatPct(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

/** Bedrooms label: 0 -> "Studio", 1 -> "1 BR". */
export function formatBeds(beds: number | null | undefined): string {
  if (beds == null) return "—";
  if (beds === 0) return "Studio";
  const n = beds % 1 === 0 ? String(beds) : String(beds);
  return `${n} BR`;
}

/** Size in sqft, e.g. "1,240 sqft". */
export function formatSize(size: number | null | undefined, unit: string | null = "sqft"): string {
  if (size == null || size <= 0) return "—";
  return `${Math.round(size).toLocaleString("en-US")} ${unit || "sqft"}`;
}

/** Distance: 850 -> "850 m", 3400 -> "3.4 km". */
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDays(days: number | null | undefined): string {
  if (days == null) return "—";
  return `${Math.round(days)} day${Math.round(days) === 1 ? "" : "s"}`;
}

/** Clock time "2:32 PM" (locale-aware). */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** Full timestamp for tooltips, e.g. "12 Jun 2026, 2:32 PM". */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Short date "12 Jun 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** "just now", "3m", "2h", "Yesterday", or a short date. */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "";
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 172800) return "Yesterday";
  return formatDate(iso);
}

export type DateBucket = "Today" | "Yesterday" | "Previous 7 days" | "Previous 30 days" | "Older";

/** Bucket a timestamp for the conversation-history sidebar (Claude-style groups). */
export function dateBucket(iso: string): DateBucket {
  const now = new Date();
  const d = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = 86400_000;
  const t = d.getTime();
  if (t >= startOfToday) return "Today";
  if (t >= startOfToday - day) return "Yesterday";
  if (t >= startOfToday - 7 * day) return "Previous 7 days";
  if (t >= startOfToday - 30 * day) return "Previous 30 days";
  return "Older";
}

export const BUCKET_ORDER: DateBucket[] = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Previous 30 days",
  "Older",
];

/** Title-case a status/label like "off plan" -> "Off Plan". */
export function titleCase(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Join non-empty location parts: "Dubai Marina, Dubai". */
export function locationLine(...parts: Array<string | null | undefined>): string {
  return parts.filter((p) => p && p.trim()).join(", ");
}
