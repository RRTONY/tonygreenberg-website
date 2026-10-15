import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PathSubscribeForm } from "@/components/marketing/path-subscribe-form";

let fetchMock: ReturnType<typeof vi.fn>;

function setup() {
  render(<PathSubscribeForm archetypeKey="builder" />);
  return { user: userEvent.setup(), input: screen.getByPlaceholderText("your@email.com") };
}

describe("PathSubscribeForm", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
  });

  it("keeps Subscribe disabled until an email is typed", async () => {
    const { user, input } = setup();
    expect(screen.getByText(/Get essays curated for your archetype/)).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Subscribe" });
    expect(btn).toBeDisabled();
    await user.type(input, "a@b.co");
    expect(btn).toBeEnabled();
  });

  it("sends the email with the path-<archetype> source and shows Subscribed", async () => {
    const { user, input } = setup();
    await user.type(input, "me@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("button", { name: /Subscribed/ })).toBeDisabled();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: "me@example.com", source: "path-builder" });
  });

  it("shows the server's message when it refuses", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ success: false, message: "Invalid email." })));
    const { user, input } = setup();
    await user.type(input, "me@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByText("Invalid email.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
  });

  it("shows a generic error when the network fails, with a spinner while pending", async () => {
    let reject!: (e: Error) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((_r, j) => (reject = j)));
    const { user, input } = setup();
    await user.type(input, "me@example.com");
    const btn = screen.getByRole("button", { name: "Subscribe" });
    await user.click(btn);
    expect(btn).toBeDisabled();
    expect(btn.querySelector(".animate-spin")).not.toBeNull();
    reject(new Error("offline"));
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });
});
