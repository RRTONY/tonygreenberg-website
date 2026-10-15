import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import LoginPage, { metadata } from "@/app/(auth)/login/page";

vi.mock("@/app/(auth)/actions", () => ({ signIn: vi.fn() }));

type Props = Parameters<typeof LoginPage>[0];
const props = (sp: Record<string, string> = {}) => pageProps({}, sp) as unknown as Props;

describe("/login", () => {
  it("is noindex with its own canonical", () => {
    expect(metadata.title).toBe("Sign in");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/login");
  });

  it("renders one H1, the form, and sign-up and reset links that keep the return page", async () => {
    const { container } = await renderServer(LoginPage(props({ next: "/my-impact" })));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute("href", "/signup?next=%2Fmy-impact");
    expect(screen.getByRole("link", { name: /forgot your password/i })).toHaveAttribute("href", "/forgot-password");
    expect(container.querySelector('input[name="next"]')).toHaveValue("/my-impact");
  });

  it("drops an off-site return address", async () => {
    const { container } = await renderServer(LoginPage(props({ next: "//evil.com" })));
    expect(container.querySelector('input[name="next"]')).toHaveValue("/my-highlights");
  });

  it("explains an expired email link only when ?error=link", async () => {
    await renderServer(LoginPage(props({ error: "link" })));
    expect(screen.getByRole("alert")).toHaveTextContent(/expired or was already used/);
  });

  it("shows no error by default", async () => {
    await renderServer(LoginPage(props()));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
