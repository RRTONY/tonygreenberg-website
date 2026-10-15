import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/forgot-password-form";
import { requestPasswordReset } from "@/app/(auth)/actions";

vi.mock("@/app/(auth)/actions", () => ({ requestPasswordReset: vi.fn() }));
const action = vi.mocked(requestPasswordReset);

describe("ForgotPasswordForm", () => {
  it("sends the typed email and swaps the form for the confirmation", async () => {
    action.mockResolvedValue({ message: "If that email has an account, a reset link is on its way." });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/reset link is on its way/);
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    const fd = action.mock.calls[0][1] as FormData;
    expect(fd.get("email")).toBe("me@example.com");
  });

  it("shows the server's error and keeps the form", async () => {
    action.mockResolvedValue({ error: "Enter a valid email address." });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email address.");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("marks the email field as required", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });
});
