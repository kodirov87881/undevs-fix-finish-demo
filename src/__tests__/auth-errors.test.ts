import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isAuthExpiredError, logSupabaseError } from "@/lib/auth/errors";

describe("isAuthExpiredError", () => {
  it("detects HTTP 401", () => {
    expect(isAuthExpiredError({ status: 401, message: "Unauthorized" })).toBe(
      true,
    );
  });

  it("detects jwt expired message", () => {
    expect(isAuthExpiredError({ message: "JWT expired" })).toBe(true);
  });

  it("detects refresh token not found variants", () => {
    expect(
      isAuthExpiredError({
        message: "Invalid Refresh Token: Refresh Token Not Found",
      }),
    ).toBe(true);
    expect(isAuthExpiredError({ message: "refresh_token_not_found" })).toBe(
      true,
    );
  });

  it("detects pgrst301", () => {
    expect(isAuthExpiredError({ code: "PGRST301" })).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isAuthExpiredError({ message: "column does not exist" })).toBe(
      false,
    );
    expect(isAuthExpiredError(null)).toBe(false);
    expect(isAuthExpiredError("boom")).toBe(false);
  });
});

describe("logSupabaseError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs context and structured fields", () => {
    logSupabaseError(
      "fetch items",
      {
        message: "JWT expired",
        code: "PGRST301",
        status: 401,
      },
      { userId: "abc" },
    );

    expect(console.error).toHaveBeenCalledWith(
      "[Supabase] fetch items",
      expect.objectContaining({
        message: "JWT expired",
        code: "PGRST301",
        status: 401,
        userId: "abc",
      }),
    );
  });
});
