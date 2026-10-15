import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterSignupForm } from "@/components/marketing/newsletter-signup-form";

let fetchMock: ReturnType<typeof vi.fn>;
let loc: { href: string };

function setup(props: Parameters<typeof NewsletterSignupForm>[0] = {}) {
  render(<NewsletterSignupForm {...props} />);
  return userEvent.setup();
}

describe("NewsletterSignupForm", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    loc = { href: "http://localhost/" };
    vi.stubGlobal("location", loc);
  });

  it("has a labelled, required email box and the default button", () => {
    setup();
    const input = screen.getByLabelText("Email address");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
    expect(screen.getByRole("button", { name: "Subscribe Free" })).toBeInTheDocument();
  });

  it("sends the email and source to /api/subscribe and shows the success message", async () => {
    const user = setup({ source: "the-letter" });
    await user.type(screen.getByLabelText("Email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe Free" }));
    expect(await screen.findByRole("status")).toHaveTextContent("You're in. New essays will arrive in your inbox.");
    expect(fetchMock).toHaveBeenCalledWith("/api/subscribe", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: "me@example.com", source: "the-letter" });
    expect(localStorage.getItem("tg_subscribed")).toBe("true");
    expect(loc.href).toBe("http://localhost/");
  });

  it("falls back to a pre-filled email when the service says no", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ success: false, message: "down" })));
    const user = setup();
    await user.type(screen.getByLabelText("Email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe Free" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Your mail app should open");
    expect(loc.href).toMatch(/^mailto:tony@tonygreenberg\.com\?subject=/);
    expect(decodeURIComponent(loc.href)).toContain("me@example.com");
  });

  it("shows a spinner and disables the button while sending, and blocks double submits", async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((r) => (resolve = r)));
    const user = setup();
    await user.type(screen.getByLabelText("Email address"), "me@example.com");
    const btn = screen.getByRole("button", { name: "Subscribe Free" });
    await user.click(btn);
    expect(btn).toBeDisabled();
    expect(btn.querySelector(".animate-spin")).not.toBeNull();
    await user.click(btn);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(new Response(JSON.stringify({ success: true })));
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("does not send an empty form", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Subscribe Free" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
