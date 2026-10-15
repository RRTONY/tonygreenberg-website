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
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it("shows a spinner and disables the button while sending", async () => {
    let resolve!: (r: Response) => void;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => (resolve = r))));
    const user = userEvent.setup();
    render(<EmailGate assessmentSlug="x" onUnlock={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    const button = await screen.findByRole("button", { name: /unlocking/i });
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve(new Response("{}"));
  });
});
