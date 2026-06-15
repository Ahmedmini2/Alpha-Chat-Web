import { Suspense } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh">
      {/* Left brand panel */}
      <aside className="silk relative hidden w-[46%] flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

        <Wordmark variant="light" />

        <div className="relative max-w-md">
          <div className="rule-gold mb-7 w-16" />
          <h2 className="font-display text-[2.6rem] font-medium leading-[1.1] text-cream">
            Smarter property decisions, <span className="gold-foil">backed by data.</span>
          </h2>
          <p className="mt-5 text-green-100/80">
            Search 1,900+ Dubai projects, pull real transaction-based market intelligence,
            run investment analysis, and generate branded brochures — all in one conversation.
          </p>
        </div>

        <p className="relative text-xs uppercase tracking-[0.22em] text-green-200/60">
          Allegiance · Global Investment Advisory
        </p>
      </aside>

      {/* Right form panel */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Wordmark />
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
