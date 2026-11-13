import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterPopup } from "@/components/gemspark/newsletter-popup";

function scrollTo(y: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 3000, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

const okFetch = () =>
  vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () => new Response(JSON.stringify({ success: true })));

describe("NewsletterPopup", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens after the delay, subscribes through /api/subscribe and never shows again", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<NewsletterPopup delaySeconds={30} enableScrollTrigger={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByRole("dialog", { name: "Catch the Next Spark" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Email address"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("heading", { name: "You're In!" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/subscribe", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ email: "ana@example.com", source: "short-form-popup" });
    expect(localStorage.getItem("newsletter_subscribed")).toBe("true");
  });

  it("opens at the scroll threshold and stays closed after a dismissal (button or Escape)", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { unmount } = render(<NewsletterPopup scrollTriggerPercent={50} enableTimeDelay={false} />);
    scrollTo(500);
    expect(screen.queryByRole("dialog")).toBeNull();
    scrollTo(1100);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem("newsletter_dismissed")).toBe("true");
    unmount();

    render(<NewsletterPopup delaySeconds={1} scrollTriggerPercent={10} />);
    scrollTo(2000);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes with Escape, not with other keys", async () => {
    render(<NewsletterPopup delaySeconds={1} enableScrollTrigger={false} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the service's error, or a generic one when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: false, message: "A valid email is required" }), { status: 400 }))
        .mockResolvedValueOnce(new Response("not json", { status: 502 }))
        .mockRejectedValueOnce(new Error("offline")),
    );
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<NewsletterPopup delaySeconds={1} enableScrollTrigger={false} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await user.type(screen.getByLabelText("Email address"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("A valid email is required");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
    expect(localStorage.getItem("newsletter_subscribed")).toBeNull();
  });

  it("checks the email before sending: missing or malformed shows the message and nothing is sent", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<NewsletterPopup delaySeconds={1} enableScrollTrigger={false} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const input = screen.getByLabelText("Email address");
    expect(input).toBeRequired();
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Add your email.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "gemspark-newsletter-email-error");
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("disables the form and shows a spinner while sending", async () => {
    let resolve!: (r: Response) => void;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => (resolve = r))));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<NewsletterPopup delaySeconds={1} enableScrollTrigger={false} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await user.type(screen.getByLabelText("Email address"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Subscribe" })).toBeDisabled());
    expect(screen.getByLabelText("Email address")).toBeDisabled();
    expect(document.querySelector(".animate-spin")).not.toBeNull();
    resolve(new Response(JSON.stringify({ success: true })));
    expect(await screen.findByRole("heading", { name: "You're In!" })).toBeInTheDocument();
  });

  it("still works when storage is blocked", () => {
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<NewsletterPopup delaySeconds={1} enableScrollTrigger={false} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    get.mockRestore();
    set.mockRestore();
  });
});
