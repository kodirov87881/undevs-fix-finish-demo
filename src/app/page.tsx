import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-4 py-16">
      <div>
        <p className="text-sm font-semibold tracking-wide text-zinc-900">
          Northline
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
          Operations dashboard for your team
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          Track work, stay aligned, and keep every item in one secure place —
          built for teams that need clarity without the clutter.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
        >
          Open dashboard
        </Link>
      </div>

      <ul className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
        <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="font-medium text-zinc-900">Secure by default</p>
          <p className="mt-1 text-zinc-500">
            Session-aware access for every workspace.
          </p>
        </li>
        <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="font-medium text-zinc-900">Team-scoped items</p>
          <p className="mt-1 text-zinc-500">
            Each user sees only their own work.
          </p>
        </li>
        <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="font-medium text-zinc-900">Clear status</p>
          <p className="mt-1 text-zinc-500">
            Loading, empty, and error states you can trust.
          </p>
        </li>
      </ul>
    </main>
  );
}
