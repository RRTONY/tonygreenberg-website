import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FirstSipEmailCapture } from "@/components/brewsoul/first-sip-email-capture";

function stubFetch(body: unknown, ok = true) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status: ok ? 200 : 500 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("FirstSipEmailCapture", () => {
  it("can't be submitted empty", () => {
    const fetchMock = stubFetch({ success: true });
    render(<FirstSipEmailCapture />);
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the email to /api/subscribe with the first-sip source and confirms", async () => {
    const fetchMock = stubFetch({ success: true });
    const user = userEvent.setup();
    render(<FirstSipEmailCapture />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("button", { name: "Subscribed" })).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/subscribe");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ email: "me@example.com", source: "first-sip" });
  });

  it("falls back to a pre-filled email to Tony when the signup fails", async () => {
    stubFetch({ success: false, message: "down" });
    const hrefs: string[] = [];
    const original = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...original, set href(v: string) { hrefs.push(v); }, get href() { return original.href; } },
    });
    try {
      const user = userEvent.setup();
      render(<FirstSipEmailCapture />);
      await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
      await user.click(screen.getByRole("button", { name: "Subscribe" }));
      expect(await screen.findByRole("button", { name: "Sent" })).toBeInTheDocument();
      expect(hrefs[0]).toMatch(/^mailto:tony@tonygreenberg\.com\?subject=/);
      expect(decodeURIComponent(hrefs[0])).toContain("Please add this address to the list: me@example.com");
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: original });
    }
  });

  it.fails("BUG: the email box has an accessible label (it only has a placeholder)", () => {
    render(<FirstSipEmailCapture />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
