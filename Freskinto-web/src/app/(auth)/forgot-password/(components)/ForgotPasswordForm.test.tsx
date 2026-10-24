import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  it("validates empty email before submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("validates invalid email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email Address"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
  });

  it("submits valid email and displays transparent support assistance notice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email Address"), "customer@example.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Email reset isn't available yet")).toBeInTheDocument();
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to sign in/i })).toBeInTheDocument();
  });
});
