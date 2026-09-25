import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          UnDevs · Fix &amp; Finish
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">
          Next.js + Supabase demo
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Correct patterns for auth redirect loops, session hydration, RLS-scoped
          dashboard data, token expiration, and resilient UI states.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Dashboard
        </Link>
      </div>

      <ul className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
        <li className="rounded-xl border border-zinc-200 bg-white p-4">
          Wait for session before redirect
        </li>
        <li className="rounded-xl border border-zinc-200 bg-white p-4">
          Filter items by <code className="text-xs">user_id</code> + RLS
        </li>
        <li className="rounded-xl border border-zinc-200 bg-white p-4">
          No flash of logged-out UI
        </li>
        <li className="rounded-xl border border-zinc-200 bg-white p-4">
          JWT expired → signOut + login
        </li>
      </ul>
    </main>
  );
}
