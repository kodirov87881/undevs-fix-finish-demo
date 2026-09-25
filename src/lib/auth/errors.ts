/**
 * Detect JWT / session-expiration style errors from Supabase Auth & PostgREST.
 */
export function isAuthExpiredError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as {
    message?: string;
    status?: number;
    code?: string;
    name?: string;
  };

  const message = (err.message ?? "").toLowerCase();
  const code = (err.code ?? "").toLowerCase();

  if (err.status === 401) return true;
  if (code === "pgrst301" || code === "401") return true;
  if (code.includes("jwt")) return true;

  const expiredSignals = [
    "jwt expired",
    "jwt malformed",
    "invalid jwt",
    "invalid claim",
    "session not found",
    "refresh_token_not_found",
    "refresh token not found",
    "token is expired",
    "not authenticated",
    "auth session missing",
  ];

  return expiredSignals.some((s) => message.includes(s));
}

/**
 * Log Supabase errors with enough context for debugging.
 */
export function logSupabaseError(
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  const payload =
    error && typeof error === "object"
      ? {
          message: (error as { message?: string }).message,
          code: (error as { code?: string }).code,
          status: (error as { status?: number }).status,
          details: (error as { details?: string }).details,
          hint: (error as { hint?: string }).hint,
          ...extra,
        }
      : { error, ...extra };

  console.error(`[Supabase] ${context}`, payload);
}
