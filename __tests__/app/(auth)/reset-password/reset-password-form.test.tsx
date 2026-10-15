import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/app/(auth)/reset-password/reset-password-form";
import { updatePassword } from "@/app/(auth)/actions";

vi.mock("@/app/(auth)/actions", () => ({ updatePassword: vi.fn() }));
const action = vi.mocked(updatePassword);

function setup() {
  render(<ResetPasswordForm />);
  return userEvent.setup();
}

describe("ResetPasswordForm", () => {
  it("asks for both fields when submitted empty", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: /save new password/i }));
    expect(await screen.findByText("Choose a password.")).toBeInTheDocument();
    expect(screen.getByText("Type the password again.")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("rejects a short password and a mismatch", async () => {
    const user = setup();
    await user.type(screen.getByLabelText("New password"), "short");
    await user.type(screen.getByLabelText("Confirm new password"), "other");
    await user.click(screen.getByRole("button", { name: /save new password/i }));
    expect(await screen.findByText("Use at least 8 characters.")).toBeInTheDocument();
    expect(screen.getByText("The passwords don't match.")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("sends only the new password, and shows the server error", async () => {
    action.mockResolvedValue({ error: "That link has expired. Request a new reset link." });
    const user = setup();
    await user.type(screen.getByLabelText("New password"), "longenough");
    await user.type(screen.getByLabelText("Confirm new password"), "longenough");
    await user.click(screen.getByRole("button", { name: /save new password/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/link has expired/);
    expect(action).toHaveBeenCalledWith({ password: "longenough" });
  });
});
