"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

const MAX = 4000;

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    requestAnimationFrame(() => ref.current?.focus());
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  const near = value.length > MAX * 0.85;

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-surface p-2 pl-4 shadow-card transition",
          "border-border-strong focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
        )}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX))}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Ask Alpha about Dubai property — projects, prices, market, investment…"
          className="max-h-44 min-h-[24px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle/70"
        />
        <div className="flex items-center gap-2">
          {near && (
            <span className={cn("text-[11px]", value.length >= MAX ? "text-danger" : "text-fg-subtle")}>
              {value.length}/{MAX}
            </span>
          )}
          <button
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition",
              value.trim() && !disabled
                ? "bg-primary text-ink hover:bg-primary-hover"
                : "bg-grey-200 text-fg-subtle",
            )}
          >
            <ArrowUp className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
