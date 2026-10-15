import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderServer, pageProps } from "@tests/helpers/render";
import SignUpPage, { metadata } from "@/app/(auth)/signup/page";
import { signUp } from "@/app/(auth)/actions";

vi.mock("@/app/(auth)/actions", () => ({ signUp: vi.fn() }));
type Props = Parameters<typeof SignUpPage>[0];
const props = (sp: Record<string, string> = {}) => pageProps({}, sp) as unknown as Props;

describe("/signup", () => {
  it("is noindex with its own canonical", () => {
    expect(metadata.title).toBe("Create an account");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/signup");
  });

  it("renders one H1 and a link back to sign in", async () => {
    await renderServer(SignUpPage(props()));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /already have an account/i })).toHaveAttribute("href", "/login");
  });

  it("passes the referral code and a safe return page to the sign-up", async () => {
    vi.mocked(signUp).mockResolvedValue({ message: "Check your inbox" });
    await renderServer(SignUpPage(props({ ref: "friend42", next: "//evil.com" })));
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "me@example.com");
    await user.type(screen.getByLabelText("Password"), "longenough");
    await user.type(screen.getByLabelText("Confirm password"), "longenough");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await screen.findByRole("status");
    expect(signUp).toHaveBeenCalledWith({ email: "me@example.com", password: "longenough", next: "/my-highlights", ref: "friend42" });
  });
});
