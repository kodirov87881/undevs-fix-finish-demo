# Northline

Operations dashboard for your team.

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase application with production-ready patterns for:

1. Auth redirect after sign-in (wait for session; middleware + client aligned)
2. Dashboard data scoped to the logged-in user (`user_id` filter + RLS)
3. Session hydration (no flash of logged-out UI)
4. Token expiration (JWT/expired → `signOut` + redirect to login)
5. Loading indicator while fetching
6. Error state with **Retry**
7. Empty state
8. Disable **Save** during submit
9. `console.error` with context for Supabase errors

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- `@supabase/ssr` + `@supabase/supabase-js`
- Vitest + Testing Library

## Local setup

```bash
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sample account

- Email: `demo@example.com`
- Password: `Northline-Demo-2026!`

### Database

Apply the SQL migration in the Supabase SQL editor (or CLI):

- `supabase/migrations/20260325000000_create_items.sql`

Creates `public.items` with RLS policies so authenticated users can only CRUD their own rows.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit/UI tests |

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Apply the migration on your Supabase project before testing auth/dashboard.

## Key routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/login` | Sign in / sign up |
| `/dashboard` | Protected items dashboard (middleware + session) |

## Docs

See [ROOT_CAUSE_AND_FIXES.md](./ROOT_CAUSE_AND_FIXES.md) for technical root-cause analysis of auth and dashboard patterns.
