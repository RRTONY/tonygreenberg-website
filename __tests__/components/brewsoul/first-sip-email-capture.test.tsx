import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  it("shows a Yup message for an invalid email and sends nothing", async () => {
    const fetchMock = stubFetch({ success: true });
    const user = userEvent.setup();
    render(<FirstSipEmailCapture />);
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toBeRequired();
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("That email address doesn't look right.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
  });

  it("asks for an email when only spaces were typed", async () => {
    const fetchMock = stubFetch({ success: true });
    const user = userEvent.setup();
    render(<FirstSipEmailCapture />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "   ");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter your email address.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("trims the address before sending", async () => {
    const fetchMock = stubFetch({ success: true });
    const user = userEvent.setup();
    render(<FirstSipEmailCapture />);
    await user.type(screen.getByPlaceholderText("your@email.com"), " me@example.com  ");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ email: "me@example.com", source: "first-sip" });
  });

  // House rule 7: a real spinner beside the label, never ellipsis text.
  it("shows a spinner, disables and marks the button busy while sending", async () => {
    let resolve!: (r: Response) => void;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => (resolve = r))));
    const user = userEvent.setup();
    render(<FirstSipEmailCapture />);
    const button = screen.getByRole("button", { name: "Subscribe" });
    expect(screen.queryByTestId("first-sip-spinner")).toBeNull();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(button);
    expect(await screen.findByTestId("first-sip-spinner")).toHaveClass("animate-spin");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Subscribe");
    expect(button.textContent).not.toMatch(/\.\.\.|…/);
    resolve(new Response(JSON.stringify({ success: true })));
    expect(await screen.findByRole("button", { name: "Subscribed" })).toHaveAttribute("aria-busy", "false");
  });

  it("the email box has an accessible label", () => {
    render(<FirstSipEmailCapture />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
