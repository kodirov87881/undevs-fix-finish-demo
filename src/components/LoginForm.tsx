"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const SAMPLE_EMAIL = "demo@example.com";
const SAMPLE_PASSWORD = "Northline-Demo-2026!";

export function LoginForm() {
  const { signIn, signUp, isHydrated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(
    reason === "session_expired"
      ? "Your session expired. Please sign in again."
      : null,
  );

  // After hydration, if already signed in, go to dashboard (middleware also does this).
  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/dashboard");
    }
  }, [isHydrated, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const action = mode === "signin" ? signIn : signUp;
    const { error: authError } = await action(email.trim(), password);
    setSubmitting(false);

    if (authError) {
      setError(authError);
      return;
    }

    if (mode === "signup") {
      setInfo(
        "Account created. If email confirmation is enabled, check your inbox; otherwise you are signed in.",
      );
    }

    // Only redirect after session is confirmed in AuthProvider.signIn/signUp.
    router.replace(nextPath);
    router.refresh();
  }

  function fillSampleAccount() {
    setEmail(SAMPLE_EMAIL);
    setPassword(SAMPLE_PASSWORD);
    setError(null);
    setMode("signin");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-wide text-zinc-900">
          Northline
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Operations dashboard for your team
        </p>
      </div>

      <aside
        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        aria-label="Sample account"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Sample account
            </p>
            <dl className="mt-2 space-y-1 text-sm text-zinc-700">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-zinc-500">Email</dt>
                <dd className="font-mono text-xs text-zinc-800 sm:text-sm">
                  {SAMPLE_EMAIL}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-zinc-500">Password</dt>
                <dd className="font-mono text-xs text-zinc-800 sm:text-sm">
                  {SAMPLE_PASSWORD}
                </dd>
              </div>
            </dl>
          </div>
          <button
            type="button"
            onClick={fillSampleAccount}
            disabled={submitting}
            className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Use sample account
          </button>
        </div>
      </aside>

      {info && (
        <p
          className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="status"
        >
          {info}
        </p>
      )}
      {error && (
        <p
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            disabled={submitting}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            disabled={submitting}
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !isHydrated}
          className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 w-full text-center text-sm text-zinc-600 underline-offset-2 hover:underline"
        onClick={() => {
          setMode((m) => (m === "signin" ? "signup" : "signin"));
          setError(null);
        }}
        disabled={submitting}
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
