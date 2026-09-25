"use client";

import { SessionGate } from "@/components/SessionGate";
import { ItemForm } from "@/components/ItemForm";
import { ItemList } from "@/components/ItemList";
import { useAuth } from "@/hooks/useAuth";
import { useItems } from "@/hooks/useItems";

function DashboardContent() {
  const { user, signOut, handleExpiredSession } = useAuth();
  const { items, loading, error, saving, refetch, createItem } = useItems({
    userId: user?.id,
    onAuthExpired: handleExpiredSession,
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wide text-zinc-900">
            Northline
          </p>
          <p className="mt-0.5 truncate text-sm text-zinc-500">
            {user?.email ?? "…"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Sign out
        </button>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your items and keep work moving.
        </p>
      </div>

      <ItemForm onSubmit={createItem} saving={saving} />

      <section aria-live="polite">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Your items</h2>
          {!loading && !error && (
            <span className="text-xs text-zinc-400">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {loading && (
          <div
            className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-16"
            role="status"
            data-testid="loading-indicator"
          >
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800"
              aria-hidden
            />
            <span className="text-sm text-zinc-600">Loading your items…</span>
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center"
            role="alert"
            data-testid="error-state"
          >
            <p className="font-medium text-red-800">Couldn’t load items</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div
            className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-12 text-center"
            data-testid="empty-state"
          >
            <p className="font-medium text-zinc-800">No items yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Save your first item using the form above.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && <ItemList items={items} />}
      </section>
    </div>
  );
}

export function DashboardClient() {
  return (
    <SessionGate>
      <DashboardContent />
    </SessionGate>
  );
}
