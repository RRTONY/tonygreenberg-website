import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailGate } from "@/components/assessments/email-gate";

describe("EmailGate", () => {
  it("posts the email with the find-your-<slug> source, then unlocks", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const onUnlock = vi.fn();
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="coffee" onUnlock={onUnlock} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    await waitFor(() => expect(onUnlock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/subscribe");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ email: "me@example.com", source: "find-your-coffee" });
  });

  it("still unlocks when the subscribe call fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const onUnlock = vi.fn();
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="sleep" onUnlock={onUnlock} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    await waitFor(() => expect(onUnlock).toHaveBeenCalled());
  });

  it("does nothing without an @ in the address", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const onUnlock = vi.fn();
    render(<EmailGate assessmentSlug="sleep" onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText("Your email address");
    // Bypass the browser's own type=email check to reach the component's guard.
    input.removeAttribute("required");
    input.setAttribute("type", "text");
    const user = userEvent.setup();
    await user.type(input, "nope");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That email address doesn't look right.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it("shows a Yup message for an invalid email and ties it to the input, without sending or unlocking", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const onUnlock = vi.fn();
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="sleep" onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText("Your email address");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "false");
    await user.type(input, "me@");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("That email address doesn't look right.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it("asks for an email when submitted empty", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const onUnlock = vi.fn();
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="sleep" onUnlock={onUnlock} />);
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter your email address.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it("trims surrounding spaces before sending", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const onUnlock = vi.fn();
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="tea" onUnlock={onUnlock} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "  me@example.com ");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    await waitFor(() => expect(onUnlock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ email: "me@example.com", source: "find-your-tea" });
  });

  // House rule 7: a real spinner beside the label, never ellipsis text like "Unlocking...".
  it("shows a spinner (no ellipsis text), disables and marks the button busy while sending", async () => {
    let resolve!: (r: Response) => void;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => (resolve = r))));
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="x" onUnlock={vi.fn()} />);
    const button = screen.getByRole("button", { name: /get my results/i });
    expect(screen.queryByTestId("email-gate-spinner")).toBeNull();
    expect(button).toHaveAttribute("aria-busy", "false");
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(button);
    expect(await screen.findByTestId("email-gate-spinner")).toHaveClass("animate-spin");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Get My Results");
    expect(button.textContent).not.toMatch(/\.\.\.|…/);
    resolve(new Response("{}"));
  });
});
