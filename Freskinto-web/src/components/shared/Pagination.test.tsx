import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("disables Prev on the first page and shows the visible range", () => {
    render(<Pagination currentPage={1} totalPages={3} total={25} limit={10} onPageChange={vi.fn()} itemLabel="orders" />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();
    expect(screen.getByText("1-10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
  });

  it("disables Next on the last page", () => {
    render(<Pagination currentPage={3} totalPages={3} total={25} limit={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByText("21-25")).toBeInTheDocument();
  });

  it("calls onPageChange with the requested page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={3} total={25} limit={10} onPageChange={onPageChange} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    await userEvent.setup().click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange.mock.calls).toEqual([[2], [3]]);
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} total={0} limit={10} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
