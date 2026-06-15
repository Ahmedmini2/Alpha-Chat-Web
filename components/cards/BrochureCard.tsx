"use client";

import { FileText, Download, Send } from "lucide-react";
import type { BrochureCard as BrochureCardData } from "@/lib/types";
import { titleCase } from "@/lib/format";
import { CardFrame, LinkButton, Pill, statusTone } from "./kit";

/**
 * Brochure card — a single branded document deliverable. Leads with a red PDF
 * glyph block, the project name, and a download (or Telegram) call to action.
 */
export function BrochureCard({ card }: { card: BrochureCardData }) {
  const projectName = card.project_name?.trim() || null;
  const filename = card.filename?.trim() || null;
  const pdfUrl = card.pdf_url?.trim() || null;
  const status = card.status?.trim() || null;
  const sentToTelegram = card.sent_to_telegram === true;

  // Only surface the status pill when it adds signal beyond a plain "ready".
  const showStatus = status && !/^(ready|done|ok|success|complete[d]?)$/i.test(status);

  return (
    <CardFrame
      icon={<FileText className="h-4 w-4" />}
      eyebrow="Document"
      title="Mini brochure"
      actions={
        showStatus ? <Pill tone={statusTone(status)}>{titleCase(status)}</Pill> : undefined
      }
      accent
    >
      <div className="flex items-center gap-3.5">
        {/* Red-ish PDF glyph block */}
        <div className="relative grid h-16 w-12 shrink-0 place-items-center rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-soft">
          <FileText className="h-6 w-6 text-red-500/80" strokeWidth={1.5} />
          <span className="absolute bottom-1 rounded bg-red-600 px-1 py-px text-[8px] font-bold uppercase tracking-wide text-white">
            PDF
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {projectName && (
            <p className="truncate font-display text-[15px] font-semibold leading-tight text-fg">
              {projectName}
            </p>
          )}
          <p className="mt-0.5 text-[12px] text-fg-subtle">6-page branded PDF</p>
          {filename && (
            <p className="mt-1 truncate text-[11px] text-fg-muted" title={filename}>
              {filename}
            </p>
          )}
        </div>
      </div>

      {pdfUrl ? (
        <div className="mt-4">
          <LinkButton href={pdfUrl} download>
            <Download className="h-4 w-4" />
            Download PDF
          </LinkButton>
        </div>
      ) : sentToTelegram ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-[12.5px] text-fg-muted">
          <Send className="h-4 w-4 shrink-0 text-accent" />
          Sent to your Telegram.
        </div>
      ) : null}
    </CardFrame>
  );
}
