"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

/**
 * Login-only, email/password — shares the same Supabase Auth (and the same
 * `profiles`) as the Reelly CMS. Accounts are created in Reelly ("by
 * introduction only"); there is no self-service sign-up here.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-[rise_0.45s_var(--ease-out)_both]">
      <div className="mb-8">
        <p className="eyebrow mb-2">Member access</p>
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-fg">
          Sign in to Alpha
        </h1>
        <p className="mt-2 text-fg-muted">
          Use the same email and password as your Allegiance (Reelly) account. By
          introduction only — please use the address shared with your advisor.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          icon={<Mail className="h-4 w-4" />}
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@allegiance.ae"
          autoComplete="email"
        />
        <Field
          icon={<Lock className="h-4 w-4" />}
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-ink shadow-soft transition hover:bg-primary-hover disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-border/60 pt-5 text-center text-[11px] text-fg-subtle">
        Protected access · sessions are recorded for audit.
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 text-fg-subtle">{icon}</span>
        <input
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-border-strong bg-surface py-3 pl-10 pr-4 text-fg",
            "placeholder:text-fg-subtle/60 outline-none transition",
            "focus:border-accent focus:ring-2 focus:ring-accent/25",
          )}
        />
      </span>
    </label>
  );
}
