"use client";

import { FileText, Quote } from "lucide-react";
import type { DocumentQuotesCard as DocumentQuotesCardData } from "@/lib/types";
import { titleCase } from "@/lib/format";
import { CardFrame, Pill } from "./kit";

/**
 * Renders retrieved document passages ("From the documents") as styled
 * blockquotes — each with a gold left rule, the snippet, and a source footer.
 */
export function DocumentQuotesCard({ card }: { card: DocumentQuotesCardData }) {
  const items = (card.items ?? []).filter((c) => c && c.content && c.content.trim());
  if (items.length === 0) return null;

  const quotes = items.slice(0, 4);

  return (
    <CardFrame icon={<FileText className="h-4 w-4" />} title="From the documents" accent>
      <div className="flex flex-col gap-3">
        {quotes.map((chunk, i) => {
          const pct =
            chunk.similarity != null && !Number.isNaN(chunk.similarity)
              ? Math.round(Math.max(0, Math.min(1, chunk.similarity)) * 100)
              : null;
          const project = chunk.project_name && chunk.project_name.trim();
          const kind = chunk.source_kind && chunk.source_kind.trim();

          return (
            <figure
              key={`${chunk.project_id ?? "x"}-${chunk.chunk_index ?? i}`}
              className="rounded-lg border border-border bg-muted/30 py-2.5 pl-4 pr-3.5"
              style={{ borderLeft: "3px solid var(--gold-500, #C1A777)" }}
            >
              <blockquote className="flex gap-2">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" />
                <p className="line-clamp-4 text-[13px] leading-relaxed text-fg">
                  {chunk.content}
                </p>
              </blockquote>

              {(project || kind || pct != null) && (
                <figcaption className="mt-2.5 flex flex-wrap items-center gap-2 pl-[1.375rem]">
                  {project && (
                    <span className="truncate font-display text-[12px] font-semibold text-green-800">
                      {project}
                    </span>
                  )}
                  {kind && <Pill tone="gold">{titleCase(kind)}</Pill>}
                  {pct != null && (
                    <span className="ml-auto text-[11px] font-medium text-fg-subtle">
                      {pct}% match
                    </span>
                  )}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </CardFrame>
  );
}
