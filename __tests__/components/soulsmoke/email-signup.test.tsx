import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailSignup } from "@/components/soulsmoke/email-signup";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function mockFetch(response: { ok?: boolean; body?: unknown; throws?: boolean; badJson?: boolean }) {
  const fn = vi.fn(async () => {
    if (response.throws) throw new Error("offline");
    return {
      ok: Boolean(response.ok),
      json: async () => {
        if (response.badJson) throw new Error("not json");
        return response.body;
      },
    } as Response;
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function renderSignup(variant: "default" | "compact" | "hero") {
  return render(
    <SoulsmokeProviders>
      <EmailSignup source="soulsmoke-test" variant={variant} />
    </SoulsmokeProviders>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("SoulSmoke EmailSignup", () => {
  it("hero: subscribes through /api/subscribe with the name and source, then clears", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({ ok: true, body: { success: true } });
    renderSignup("hero");
    expect(screen.getByRole("heading", { name: "Join the Hunt" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Your name (optional)"), "Ana");
    await user.type(screen.getByLabelText("Your email address"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: /Subscribe to the List/ }));
    expect(fetchMock).toHaveBeenCalledWith("/api/subscribe", expect.objectContaining({ method: "POST" }));
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toEqual({ email: "ana@example.com", firstName: "Ana", source: "soulsmoke-test" });
    expect(await screen.findByRole("status")).toHaveTextContent("Successfully subscribed!");
    expect(screen.getByLabelText("Your email address")).toHaveValue("");
  });

  it("hero: shows the server's message when it fails", async () => {
    const user = userEvent.setup();
    mockFetch({ ok: false, body: { success: false, message: "A valid email is required" } });
    renderSignup("hero");
    await user.type(screen.getByLabelText("Your email address"), "x@y.z");
    await user.click(screen.getByRole("button", { name: /Subscribe to the List/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("A valid email is required");
  });

  it("compact: falls back to a generic message for an unreadable reply", async () => {
    const user = userEvent.setup();
    mockFetch({ ok: false, badJson: true });
    renderSignup("compact");
    await user.type(screen.getByLabelText("Your email"), "x@y.z");
    await user.click(screen.getByRole("button", { name: "Join" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Failed to subscribe. Please try again.");
  });

  it("compact: confirms a success", async () => {
    const user = userEvent.setup();
    mockFetch({ ok: true, body: { success: true } });
    renderSignup("compact");
    await user.type(screen.getByLabelText("Your email"), "x@y.z");
    await user.click(screen.getByRole("button", { name: "Join" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Successfully subscribed!");
  });

  it("default: handles a network error and a success", async () => {
    const user = userEvent.setup();
    mockFetch({ throws: true });
    renderSignup("default");
    expect(screen.getByRole("heading", { name: "Stay in the Loop" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Your name (optional)"), "Bo");
    await user.type(screen.getByLabelText("Your email address"), "x@y.z");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Something went wrong. Please try again.");
    mockFetch({ ok: true, body: { success: true } });
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Successfully subscribed!");
  });

  it("does nothing without an email, and shows Spanish copy", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({ ok: true, body: { success: true } });
    window.localStorage.setItem("soulsmoke-language", '"es"');
    const { container } = renderSignup("hero");
    expect(screen.getByRole("heading", { name: "Únete a la Cacería" })).toBeInTheDocument();
    container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await user.click(document.body);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
