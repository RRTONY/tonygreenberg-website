import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterPopup } from "@/components/marketing/newsletter-popup";

let fetchMock: ReturnType<typeof vi.fn>;
let loc: { href: string };

// Renders, waits out the 3-minute delay, then goes back to real timers for typing.
function showPopup() {
  vi.useFakeTimers();
  render(<NewsletterPopup />);
  act(() => vi.advanceTimersByTime(180_000));
  vi.useRealTimers();
  return userEvent.setup();
}

describe("NewsletterPopup", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    loc = { href: "http://localhost/" };
    vi.stubGlobal("location", loc);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays hidden for 3 minutes, then appears once per session", () => {
    vi.useFakeTimers();
    render(<NewsletterPopup />);
    act(() => vi.advanceTimersByTime(179_000));
    expect(screen.queryByText("Still here? Good.")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText("Still here? Good.")).toBeInTheDocument();
    expect(sessionStorage.getItem("tg-popup-shown")).toBe("1");
  });

  it("never shows again in the same session or once subscribed", () => {
    vi.useFakeTimers();
    sessionStorage.setItem("tg-popup-shown", "1");
    const { unmount } = render(<NewsletterPopup />);
    act(() => vi.advanceTimersByTime(200_000));
    expect(screen.queryByText("Still here? Good.")).not.toBeInTheDocument();
    unmount();
    sessionStorage.clear();
    localStorage.setItem("tg_subscribed", "true");
    render(<NewsletterPopup />);
    act(() => vi.advanceTimersByTime(200_000));
    expect(screen.queryByText("Still here? Good.")).not.toBeInTheDocument();
  });

  it("subscribes through /api/subscribe and says You're in", async () => {
    const user = showPopup();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Join the Conversation" }));
    expect(await screen.findByRole("heading", { name: "You're in." })).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ email: "me@example.com" });
    expect(localStorage.getItem("tg_subscribed")).toBe("true");
  });

  it("falls back to a pre-filled email when the service fails", async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error("offline");
    });
    const user = showPopup();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Join the Conversation" }));
    expect(await screen.findByRole("heading", { name: "Almost there." })).toBeInTheDocument();
    expect(loc.href).toMatch(/^mailto:tony@tonygreenberg\.com/);
  });

  it("closes with the Dismiss button", async () => {
    const user = showPopup();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Still here? Good.")).not.toBeInTheDocument();
  });

  it("shows a spinner and blocks double submits while sending (house rule 7)", async () => {
    fetchMock.mockImplementation(() => new Promise<Response>(() => {}));
    const user = showPopup();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    const btn = screen.getByRole("button", { name: "Join the Conversation" });
    await user.click(btn);
    expect(btn).toBeDisabled();
  });
});
