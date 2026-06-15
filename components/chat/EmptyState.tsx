"use client";

import { TrendingUp, Building2, LineChart, Scale } from "lucide-react";
import { Monogram } from "@/components/ui/Wordmark";

const SUGGESTIONS = [
  {
    icon: Building2,
    label: "Find projects",
    text: "Show me 2-bedroom apartments in Dubai Marina under 3M AED",
  },
  {
    icon: TrendingUp,
    label: "Market pulse",
    text: "How is the property market in Business Bay performing right now?",
  },
  {
    icon: LineChart,
    label: "Investment check",
    text: "Is Emaar Beachfront a good investment?",
  },
  {
    icon: Scale,
    label: "Compare",
    text: "Compare DAMAC Lagoons and Emaar South for a buy-to-let",
  },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function EmptyState({
  userName,
  onPrompt,
}: {
  userName: string;
  onPrompt: (text: string) => void;
}) {
  const first = userName.split(" ")[0];
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-2xl text-center animate-[rise_0.5s_var(--ease-out)_both]">
        <div className="mb-6 flex justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface shadow-card">
            <Monogram size={40} />
          </div>
        </div>

        <h2 className="font-display text-[2.1rem] font-medium leading-tight text-fg">
          {greeting()}, {first}.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-fg-muted">
          I&apos;m Alpha — your Dubai real-estate desk. Ask me about projects, prices,
          market trends, or whether something&apos;s worth buying.
        </p>

        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => onPrompt(s.text)}
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-soft transition hover:border-border-gold hover:shadow-card"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-accent transition group-hover:bg-gold-100">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-fg-muted">
                  {s.text}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
