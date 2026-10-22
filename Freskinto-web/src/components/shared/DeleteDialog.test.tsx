import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteDialog, StandardDestructiveModal } from "./DeleteDialog";

describe("Pattern A: DeleteDialog", () => {
  it("renders title, description and calls onConfirm when clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChange}
        title="Remove item?"
        description="This will remove the item permanently."
        confirmLabel="Remove"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText("Remove item?")).toBeInTheDocument();
    expect(screen.getByText("This will remove the item permanently.")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Remove" });
    await user.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when loading", () => {
    render(
      <DeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Deleting..."
        onConfirm={vi.fn()}
        isLoading={true}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });

    expect(cancelBtn).toBeDisabled();
    expect(deleteBtn).toBeDisabled();
  });
});

describe("Pattern B: StandardDestructiveModal", () => {
  it("renders entity summary card, warning badge, and requires checkbox to confirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    const { rerender } = render(
      <StandardDestructiveModal
        open={true}
        onOpenChange={vi.fn()}
        title="Delete Category?"
        description="This will permanently delete this category."
        confirmLabel="Delete category"
        onConfirm={onConfirm}
        entitySummary={<div data-testid="summary">Category: Organic Fruits</div>}
      />,
    );

    expect(screen.getByTestId("summary")).toHaveTextContent("Category: Organic Fruits");
    expect(screen.getByText("This action cannot be undone")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Delete category" });
    expect(confirmBtn).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(confirmBtn).toBeEnabled();

    await user.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    // When modal closes and reopens, checkbox should be reset to unchecked
    rerender(
      <StandardDestructiveModal
        open={false}
        onOpenChange={vi.fn()}
        title="Delete Category?"
        confirmLabel="Delete category"
        onConfirm={onConfirm}
        entitySummary={<div data-testid="summary">Category: Organic Fruits</div>}
      />,
    );

    rerender(
      <StandardDestructiveModal
        open={true}
        onOpenChange={vi.fn()}
        title="Delete Category?"
        confirmLabel="Delete category"
        onConfirm={onConfirm}
        entitySummary={<div data-testid="summary">Category: Organic Fruits</div>}
      />,
    );

    const reopenedCheckbox = screen.getByRole("checkbox");
    expect(reopenedCheckbox).not.toBeChecked();
    const reopenedBtn = screen.getByRole("button", { name: "Delete category" });
    expect(reopenedBtn).toBeDisabled();
  });
});
