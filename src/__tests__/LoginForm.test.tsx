import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockReplace = vi.fn();
const mockRefresh = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isHydrated: true,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: vi.fn(),
    handleExpiredSession: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

import { LoginForm } from "@/components/LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockReplace.mockReset();
    mockRefresh.mockReset();
  });

  it("shows Northline branding and sample account", () => {
    render(<LoginForm />);
    expect(screen.getByText("Northline")).toBeInTheDocument();
    expect(
      screen.getByText(/operations dashboard for your team/i),
    ).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByText("Northline-Demo-2026!")).toBeInTheDocument();
  });

  it("fills sample account without submitting", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: /use sample account/i }),
    );

    expect(screen.getByLabelText(/^email$/i)).toHaveValue("demo@example.com");
    expect(screen.getByLabelText(/^password$/i)).toHaveValue(
      "Northline-Demo-2026!",
    );
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockSignUp).not.toHaveBeenCalled();
  });
});
