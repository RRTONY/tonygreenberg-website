import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/app/(auth)/signup/signup-form";
import { signUp } from "@/app/(auth)/actions";

vi.mock("@/app/(auth)/actions", () => ({ signUp: vi.fn() }));
const action = vi.mocked(signUp);

async function fill(user: ReturnType<typeof userEvent.setup>, email: string, pw: string, confirm = pw) {
  if (email) await user.type(screen.getByLabelText("Email"), email);
  if (pw) await user.type(screen.getByLabelText("Password"), pw);
  if (confirm) await user.type(screen.getByLabelText("Confirm password"), confirm);
  await user.click(screen.getByRole("button", { name: /create account/i }));
}

describe("SignUpForm", () => {
  it("asks for every field when submitted empty", async () => {
    render(<SignUpForm next="/my-highlights" />);
    await fill(userEvent.setup(), "", "");
    expect(await screen.findByText("Enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Choose a password.")).toBeInTheDocument();
    expect(screen.getByText("Type the password again.")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("rejects a bad email, short password and mismatched confirm", async () => {
    render(<SignUpForm next="/" />);
    await fill(userEvent.setup(), "nope", "short", "shorter");
    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Use at least 8 characters.")).toBeInTheDocument();
    expect(screen.getByText("The passwords don't match.")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("sends the account details and shows the check-your-inbox message", async () => {
    action.mockResolvedValue({ message: "Check your inbox: we sent a link to confirm your email." });
    render(<SignUpForm next="/my-impact" referralCode="abc" />);
    await fill(userEvent.setup(), "me@example.com", "longenough");
    expect(await screen.findByRole("status")).toHaveTextContent(/Check your inbox/);
    expect(action).toHaveBeenCalledWith({ email: "me@example.com", password: "longenough", next: "/my-impact", ref: "abc" });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the server error and keeps the form", async () => {
    action.mockResolvedValue({ error: "User already registered" });
    render(<SignUpForm next="/" />);
    await fill(userEvent.setup(), "me@example.com", "longenough");
    expect(await screen.findByRole("alert")).toHaveTextContent("User already registered");
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
