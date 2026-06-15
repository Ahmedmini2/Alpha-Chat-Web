"use client";

import { useEffect, useState } from "react";
import { Clapperboard, FileText, Scale, Sparkles } from "lucide-react";
import { Monogram } from "@/components/ui/Wordmark";
import { fetchDailyVolume } from "@/lib/api";
import { compactNumber, relativeDay } from "@/lib/format";

const SUGGESTIONS = [
  {
    icon: Clapperboard,
    title: "Make project videos",
    subtitle: "AI-avatar promo videos for any project",
    prompt: "I'd like to make a promo video for a project. Which projects can you create one for?",
  },
  {
    icon: FileText,
    title: "Get brochures & flyers",
    subtitle: "Branded PDF brochures on demand",
    prompt: "Create a branded mini-brochure (PDF) for a project.",
  },
  {
    icon: Scale,
    title: "Get comparison reports",
    subtitle: "Side-by-side project comparisons",
    prompt: "Create a side-by-side comparison report for two projects.",
  },
  {
    icon: Sparkles,
    title: "Chat with Alpha",
    subtitle: "Ask anything about Dubai real estate",
    prompt: "What can you help me with?",
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

  // Live DLD market hook — refetched each time a new chat opens this screen.
  // Cached server-side so the number is stable within a day and only changes
  // when fresh transaction data lands.
  const [hook, setHook] = useState<{ aed: string; when: string } | null>(null);
  useEffect(() => {
    let active = true;
    fetchDailyVolume()
      .then((v) => {
        if (active && v.total_aed && v.total_aed > 0) {
          setHook({ aed: `AED ${compactNumber(v.total_aed)}`, when: relativeDay(v.date) });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
          {hook ? (
            <>
              Dubai sold <span className="font-semibold text-accent">{hook.aed}</span> {hook.when}.{" "}
              How much did you sell?
            </>
          ) : (
            "How much did you sell today?"
          )}
        </p>

        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => onPrompt(s.prompt)}
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-soft transition hover:border-border-gold hover:shadow-card"
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-accent transition group-hover:bg-[rgba(196,245,66,0.12)]">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-medium leading-snug text-fg">
                  {s.title}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-fg-subtle">
                  {s.subtitle}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
