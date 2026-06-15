"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        if (error) throw error;
        // If the project has email confirmation on, there's no session yet.
        if (data.session) {
          router.push(next);
          router.refresh();
        } else {
          setEmailSent(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setError(error.message);
  }

  if (emailSent) {
    return (
      <div className="animate-[rise_0.45s_var(--ease-out)_both] text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-success" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-semibold text-fg">Check your inbox</h2>
        <p className="mt-2 text-fg-muted">
          We sent a confirmation link to <span className="font-medium text-fg">{email}</span>.
          Click it to activate your account, then sign in.
        </p>
        <button
          onClick={() => {
            setEmailSent(false);
            setMode("signin");
          }}
          className="mt-6 text-sm font-medium text-green-600 underline underline-offset-4 hover:text-accent-press"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="animate-[rise_0.45s_var(--ease-out)_both]">
      <div className="mb-8">
        <p className="eyebrow mb-2">{mode === "signin" ? "Welcome back" : "Get started"}</p>
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-fg">
          {mode === "signin" ? "Sign in to Alpha" : "Create your account"}
        </h1>
        <p className="mt-2 text-fg-muted">
          Your intelligent Dubai real-estate desk — projects, market data, and investment analysis.
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
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          minLength={6}
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
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-fg-subtle">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border-strong bg-surface px-4 py-3 font-medium text-fg transition hover:bg-muted"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          className="font-medium text-green-600 underline underline-offset-4 hover:text-accent-press"
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
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
  minLength,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 text-fg-subtle">{icon}</span>
        <input
          type={type}
          required
          minLength={minLength}
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
