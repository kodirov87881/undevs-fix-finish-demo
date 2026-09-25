import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const order = vi.fn();
const eq = vi.fn();
const select = vi.fn();
const from = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: (...args: unknown[]) => from(...args),
  }),
}));

import { useItems } from "@/hooks/useItems";

describe("useItems user_id filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    order.mockResolvedValue({ data: [], error: null });
    eq.mockReturnValue({ order });
    select.mockReturnValue({ eq });
    from.mockReturnValue({ select });
  });

  it("filters by user_id when fetching", async () => {
    const onAuthExpired = vi.fn();
    renderHook(() => useItems({ userId: "user-42", onAuthExpired }));

    await waitFor(() => {
      expect(from).toHaveBeenCalledWith("items");
      expect(eq).toHaveBeenCalledWith("user_id", "user-42");
      expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
    });
  });
});
