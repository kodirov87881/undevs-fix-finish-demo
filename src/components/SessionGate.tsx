"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Blocks children until the Supabase session has hydrated.
 * Prevents a flash of logged-out UI on hard refresh.
 */
export function SessionGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <>
        {fallback ?? (
          <div
            className="flex min-h-[40vh] items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <span
                className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800"
                aria-hidden
              />
              <p className="text-sm">Checking session…</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
