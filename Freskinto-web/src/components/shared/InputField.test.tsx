import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Mail } from "lucide-react";
import { InputField } from "./InputField";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandInput } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";

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

  it("renders with icon using InputGroup and ensures inner input has dark:bg-transparent", () => {
    render(<InputField id="icon-email" label="Email with Icon" leftIcon={<Mail data-testid="mail-icon" />} />);
    const input = screen.getByLabelText("Email with Icon");
    // Inner input must be transparent in both light and dark mode so it doesn't break the pill container
    expect(input.className).toContain("bg-transparent");
    expect(input.className).toContain("dark:bg-transparent");
    // Ensure dark:bg-input/30 is overridden by dark:bg-transparent
    expect(input.className).not.toContain("dark:bg-input/30");
    // Text must have explicit foreground color
    expect(input.className).toContain("text-foreground");
  });

  it("standalone Input includes text-foreground and dark-mode tokens", () => {
    render(<Input data-testid="standalone-input" placeholder="Type here" />);
    const input = screen.getByTestId("standalone-input");
    expect(input.className).toContain("text-foreground");
    expect(input.className).toContain("dark:bg-input/30");
    expect(input.className).toContain("dark:disabled:bg-muted/60");
  });

  it("InputGroupTextarea overrides dark background to remain seamless", () => {
    render(
      <InputGroup data-testid="group-textarea-wrap">
        <InputGroupTextarea data-testid="group-textarea" />
      </InputGroup>
    );
    const textarea = screen.getByTestId("group-textarea");
    expect(textarea.className).toContain("bg-transparent");
    expect(textarea.className).toContain("dark:bg-transparent");
    expect(textarea.className).not.toContain("dark:bg-input/30");
  });

  it("InputGroup includes overflow-hidden and dark-mode disabled/read-only states", () => {
    render(
      <InputGroup data-testid="test-input-group">
        <Input placeholder="nested" />
      </InputGroup>
    );
    const group = screen.getByTestId("test-input-group");
    expect(group.className).toContain("overflow-hidden");
    expect(group.className).toContain("dark:has-disabled:bg-muted/60");
    expect(group.className).toContain("dark:has-read-only:bg-muted/40");
  });

  it("standalone Input and Textarea include dark color-scheme and read-only states", () => {
    render(<Input data-testid="cs-input" />);
    const input = screen.getByTestId("cs-input");
    expect(input.className).toContain("dark:[color-scheme:dark]");
    expect(input.className).toContain("dark:read-only:bg-muted/40");

    render(<Textarea data-testid="cs-textarea" />);
    const textarea = screen.getByTestId("cs-textarea");
    expect(textarea.className).toContain("dark:[color-scheme:dark]");
    expect(textarea.className).toContain("dark:read-only:bg-muted/40");
  });

  it("CommandInput renders with transparent dark input and text-foreground", () => {
    render(
      <Command>
        <CommandInput placeholder="Search items..." />
      </Command>
    );
    const input = screen.getByPlaceholderText("Search items...");
    expect(input.className).toContain("bg-transparent");
    expect(input.className).toContain("dark:bg-transparent");
    expect(input.className).toContain("text-foreground");
  });

  it("Switch thumb renders light foreground in dark mode", () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).not.toBeNull();
    expect(thumb?.className).toContain("dark:bg-foreground");
  });
});

