"use client";

import { Scale, Download, Send, FileText } from "lucide-react";
import type { ComparisonPdfCard as ComparisonPdfCardData } from "@/lib/types";
import { CardFrame, Pill, LinkButton } from "./kit";

/**
 * Side-by-side comparison deliverable card. Renders the project matchup, the
 * computed Alpha Scores as gold chips, and a download / Telegram delivery state.
 */
export function ComparisonPdfCard({ card }: { card: ComparisonPdfCardData }) {
  const names = (card.project_names ?? []).filter((n) => n && n.trim());
  const scores = (card.alpha_scores ?? []).filter((s) => s != null && String(s).trim());
  const matchup = names.length > 0 ? names.join(" vs ") : null;

  return (
    <CardFrame
      icon={<Scale className="h-4 w-4" />}
      eyebrow="Comparison sheet"
      title="Side-by-side comparison"
      accent
    >
      {/* Matchup */}
      {matchup ? (
        <p className="font-display text-[17px] font-semibold leading-snug text-green-800">
          {matchup}
        </p>
      ) : (
        <p className="text-[13px] text-fg-subtle">Property comparison</p>
      )}

      {/* Alpha scores */}
      {scores.length > 0 && (
        <div className="mt-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Alpha Score{scores.length > 1 ? "s" : ""}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {scores.map((score, i) => (
              <Pill key={i} tone="gold">
                {names[i] ? (
                  <>
                    <span className="font-semibold">{score}</span>
                    <span className="text-gold-900/70">· {names[i]}</span>
                  </>
                ) : (
                  <span className="font-semibold">{score}</span>
                )}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {/* Delivery / download */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {card.pdf_url ? (
          <LinkButton href={card.pdf_url} download>
            <Download className="h-4 w-4" />
            Download PDF
          </LinkButton>
        ) : card.sent_to_telegram ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-success">
            <Send className="h-4 w-4" />
            Sent to your Telegram.
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-fg-subtle">
            <FileText className="h-4 w-4 text-accent" />
            Comparison prepared.
          </span>
        )}

        {card.pdf_url && card.sent_to_telegram && (
          <span className="inline-flex items-center gap-1 text-[12px] text-fg-subtle">
            <Send className="h-3.5 w-3.5" />
            Also sent to Telegram
          </span>
        )}
      </div>

      {card.filename && (
        <p className="mt-2.5 truncate text-[11.5px] text-fg-subtle">{card.filename}</p>
      )}
    </CardFrame>
  );
}
