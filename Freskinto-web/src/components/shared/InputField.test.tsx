import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputField } from "./InputField";

describe("InputField", () => {
  it("links the label to the input", () => {
    render(<InputField id="email" label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("sets aria-invalid and shows the error under the input", () => {
    render(<InputField id="email" label="Email" error="Invalid email address" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email address");
  });

  it("is not marked invalid without an error and shows the hint instead", () => {
    render(<InputField id="pc" label="Postcode" hint="e.g. E1 6AN" />);
    expect(screen.getByLabelText("Postcode")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByText("e.g. E1 6AN")).toBeInTheDocument();
  });
});
