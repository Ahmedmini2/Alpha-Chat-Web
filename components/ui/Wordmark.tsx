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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#15161a" />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" fill="none" stroke="rgba(196,245,66,0.25)" strokeWidth="1.5" />
      <path
        d="M32 14 L46 50 H38.5 L35.6 42 H28.4 L25.5 50 H18 Z M30.3 35.5 H33.7 L32 30.6 Z"
        fill="#c4f542"
      />
    </svg>
  );
}
