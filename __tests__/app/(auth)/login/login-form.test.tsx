import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { signIn } from "@/app/(auth)/actions";

vi.mock("@/app/(auth)/actions", () => ({ signIn: vi.fn() }));
const action = vi.mocked(signIn);

describe("LoginForm", () => {
  it("sends email, password and the return page to the sign-in action", async () => {
    action.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LoginForm next="/my-impact" />);
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await vi.waitFor(() => expect(action).toHaveBeenCalled());
    const fd = action.mock.calls[0][1] as FormData;
    expect(fd.get("email")).toBe("me@example.com");
    expect(fd.get("password")).toBe("secret123");
    expect(fd.get("next")).toBe("/my-impact");
  });

  it("shows the error the action returns", async () => {
    action.mockResolvedValue({ error: "That email and password don't match." });
    const user = userEvent.setup();
    render(<LoginForm next="/" />);
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That email and password don't match.");
  });

  it("disables the button while signing in", async () => {
    let finish: (v: undefined) => void = () => {};
    action.mockImplementation(() => new Promise((r) => (finish = r)));
    const user = userEvent.setup();
    render(<LoginForm next="/" />);
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.type(screen.getByLabelText("Password"), "pw");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled());
    finish(undefined);
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled());
  });
});
