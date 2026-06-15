import { cn } from "@/lib/cn";

/** The Allegiance "Ask Alpha" lockup: a gold monogram + serif wordmark. */
export function Wordmark({
  className,
  variant = "dark",
  showEyebrow = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  showEyebrow?: boolean;
}) {
  const fg = variant === "light" ? "text-cream" : "text-fg";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Monogram />
      <div className="flex flex-col leading-none">
        <span className={cn("font-display text-[22px] font-semibold tracking-tight", fg)}>
          Ask <span className="gold-foil">Alpha</span>
        </span>
        {showEyebrow && (
          <span className="eyebrow mt-1 text-[9px]">Allegiance Real Estate</span>
        )}
      </div>
    </div>
  );
}

export function Monogram({ size = 34 }: { size?: number }) {
  // Allegiance "Alpha" mark — a green lowercase alpha (α).
  return (
    <svg
      width={size}
      height={size}
      viewBox="-3 -4 112 112"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <g
        fill="none"
        stroke="#67BD46"
        strokeWidth={12.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="40" cy="52" rx="28" ry="33" />
        <path d="M58 24 C79 39 72 66 85 82 C90 90 99 85 95 74" />
      </g>
    </svg>
  );
}
