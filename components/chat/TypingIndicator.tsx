import { Monogram } from "@/components/ui/Wordmark";

export function TypingIndicator() {
  return (
    <div className="flex gap-3.5 animate-[fade-in_0.3s_var(--ease-out)_both]">
      <span className="mt-0.5 shrink-0">
        <Monogram size={30} />
      </span>
      <div className="flex flex-col">
        <p className="mb-1.5 text-[13px] font-semibold tracking-tight text-fg">Alpha</p>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-3 w-fit">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="typing-dot h-2 w-2 rounded-full bg-accent"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
