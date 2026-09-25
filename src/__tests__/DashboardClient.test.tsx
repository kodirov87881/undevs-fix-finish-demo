import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseAuth = vi.fn();
const mockUseItems = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/hooks/useItems", () => ({
  useItems: (opts: unknown) => mockUseItems(opts),
}));

import { DashboardClient } from "@/components/DashboardClient";

describe("DashboardClient UI states", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: "user-1", email: "demo@example.com" },
      session: {},
      isHydrated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      handleExpiredSession: vi.fn(),
    });
  });

  it("shows Northline header with user email", () => {
    mockUseItems.mockReturnValue({
      items: [],
      loading: false,
      error: null,
      saving: false,
      refetch: vi.fn(),
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByText("Northline")).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("shows loading indicator", () => {
    mockUseItems.mockReturnValue({
      items: [],
      loading: true,
      error: null,
      saving: false,
      refetch: vi.fn(),
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    expect(screen.getByText(/loading your items/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseItems.mockReturnValue({
      items: [],
      loading: false,
      error: null,
      saving: false,
      refetch: vi.fn(),
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument();
  });

  it("shows error with Retry button", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    mockUseItems.mockReturnValue({
      items: [],
      loading: false,
      error: "network down",
      saving: false,
      refetch,
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByText(/network down/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders items when populated", () => {
    mockUseItems.mockReturnValue({
      items: [
        {
          id: "1",
          user_id: "user-1",
          title: "Ship fix",
          notes: "done",
          created_at: "2026-03-25T00:00:00.000Z",
        },
      ],
      loading: false,
      error: null,
      saving: false,
      refetch: vi.fn(),
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByText("Ship fix")).toBeInTheDocument();
  });

  it("waits for session hydration (no flash)", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      isHydrated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      handleExpiredSession: vi.fn(),
    });
    mockUseItems.mockReturnValue({
      items: [],
      loading: true,
      error: null,
      saving: false,
      refetch: vi.fn(),
      createItem: vi.fn(),
    });

    render(<DashboardClient />);
    expect(screen.getByText(/checking session/i)).toBeInTheDocument();
    expect(screen.queryByText("demo@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("Northline")).not.toBeInTheDocument();
  });
});
