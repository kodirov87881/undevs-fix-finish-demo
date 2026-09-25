import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemForm } from "@/components/ItemForm";

describe("ItemForm", () => {
  it("disables Save while submitting", async () => {
    const user = userEvent.setup();
    let resolveSubmit: (v: { error: string | null }) => void = () => {};
    const onSubmit = vi.fn(
      () =>
        new Promise<{ error: string | null }>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    const { rerender } = render(
      <ItemForm onSubmit={onSubmit} saving={false} />,
    );

    await user.type(screen.getByLabelText(/title/i), "My task");
    const saveBtn = screen.getByRole("button", { name: /^save$/i });
    expect(saveBtn).not.toBeDisabled();

    await user.click(saveBtn);
    expect(onSubmit).toHaveBeenCalled();

    rerender(<ItemForm onSubmit={onSubmit} saving={true} />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    resolveSubmit({ error: null });
    await waitFor(() => {
      rerender(<ItemForm onSubmit={onSubmit} saving={false} />);
    });
  });

  it("shows error from onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ error: "RLS denied" });

    render(<ItemForm onSubmit={onSubmit} saving={false} />);
    await user.type(screen.getByLabelText(/title/i), "Bad");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("RLS denied");
  });
});
