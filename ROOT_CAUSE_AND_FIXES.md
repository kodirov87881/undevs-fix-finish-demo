# Root causes and fixes

Technical summary of auth and dashboard issues and the patterns used to address them.

---

## 1. Auth redirect loop after sign-in

**Symptom:** Immediately after a successful sign-in, the user is bounced back to `/login` (or oscillates between `/login` and `/dashboard`).

**Root cause:** The client navigated to `/dashboard` before the auth cookies/session were fully written and readable by middleware. Middleware then saw “no user” and redirected to `/login`. The login page (or client) saw a session and sent them back — a race between middleware `getUser()` / cookie refresh and client-side redirect.

**Fix:**
- `signIn` / `signUp` in `AuthProvider` **await** `signInWithPassword` / `signUp` and only proceed when `data.session` is present.
- Middleware uses `getUser()` (validates JWT) and refreshes cookies via `@supabase/ssr` on every matched request.
- After sign-in, navigate with `router.replace` + `router.refresh()` so the server sees the new cookies.
- Authenticated users hitting `/login` are redirected to `/dashboard` only after `getUser()` resolves — no speculative client redirect before hydration.

**Files:** `src/hooks/useAuth.tsx`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`, `src/components/LoginForm.tsx`

---

## 2. Dashboard data missing for the logged-in user

**Symptom:** Dashboard sometimes shows empty or wrong data even when the user has saved items.

**Root cause:** Queries that omit `user_id` filtering (or rely only on weak client assumptions) can fail under RLS, return another user’s data incorrectly in buggy demos, or race before `user.id` is available.

**Fix:**
- Always filter: `.eq("user_id", userId)` when selecting.
- Insert with explicit `user_id: user.id`.
- RLS policies on `items` enforce `auth.uid() = user_id` for select/insert/update/delete.
- Do not fetch until `userId` is defined.

**Files:** `src/hooks/useItems.ts`, `supabase/migrations/20260325000000_create_items.sql`

---

## 3. Session hydration flash

**Symptom:** On hard refresh, the UI briefly shows a logged-out state (or login CTA) before flipping to authenticated.

**Root cause:** Components rendered based on `user === null` before the first `getSession()` / `onAuthStateChange` completed.

**Fix:**
- `AuthProvider` exposes `isHydrated`, set to `true` only after the initial `getSession()` settles.
- `SessionGate` blocks dashboard/login chrome until hydrated, showing a neutral “Checking session…” state instead of logged-out UI.

**Files:** `src/hooks/useAuth.tsx`, `src/components/SessionGate.tsx`

---

## 4. Token expiration mid-session

**Symptom:** After the JWT expires, fetches fail with opaque errors; the user is not returned to login.

**Root cause:** Expired JWT / missing refresh token errors were not classified or handled; the app stayed on protected pages with a dead session.

**Fix:**
- `isAuthExpiredError()` detects 401, JWT messages, `PGRST301`, etc.
- On those errors during hydrate or data ops, call `handleExpiredSession()` → `signOut()` + hard navigate to `/login?reason=session_expired`.
- Middleware continues to protect `/dashboard` for unauthenticated requests.

**Files:** `src/lib/auth/errors.ts`, `src/hooks/useAuth.tsx`, `src/hooks/useItems.ts`

---

## 5–8. UI enhancements

| Enhancement | Implementation |
| --- | --- |
| Loading indicator | Spinner + “Loading your items…” while `loading` |
| Error + Retry | Error panel with **Retry** calling `refetch()` |
| Empty state | Dashed panel when `items.length === 0` |
| Disable Save | `ItemForm` Save button `disabled={saving \|\| !title.trim()}` |

**Files:** `src/components/DashboardClient.tsx`, `src/components/ItemForm.tsx`

---

## 9. Structured Supabase error logging

**Fix:** `logSupabaseError(context, error, extra)` always logs `[Supabase] <context>` with `message`, `code`, `status`, and optional fields (`userId`, etc.) via `console.error`.

**File:** `src/lib/auth/errors.ts`
