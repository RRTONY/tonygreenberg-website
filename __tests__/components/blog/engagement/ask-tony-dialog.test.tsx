import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AskTonyDialog } from "@/components/blog/engagement/ask-tony-dialog";
import { askTony } from "@/app/blog/[slug]/engagement-actions";

vi.mock("@/app/blog/[slug]/engagement-actions", () => ({ askTony: vi.fn() }));
const ask = vi.mocked(askTony);

async function open(title = "Five Cups") {
  const user = userEvent.setup();
  render(<AskTonyDialog slug="five-cups" title={title} />);
  await user.click(screen.getByRole("button", { name: /ask tony directly/i }));
  return user;
}

describe("AskTonyDialog", () => {
  beforeEach(() => {
    ask.mockResolvedValue({ ok: true });
  });

  it("opens with the essay title in the heading, or a generic one without a title", async () => {
    await open();
    expect(screen.getByRole("heading", { name: 'A question about "Five Cups"' })).toBeInTheDocument();
  });

  it("falls back to a generic heading when there is no title", async () => {
    await open("");
    expect(screen.getByRole("heading", { name: "What's on your mind?" })).toBeInTheDocument();
  });

  it("requires a name and a question", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: /send to tony/i }));
    expect(await screen.findByText("Add your name.")).toBeInTheDocument();
    expect(screen.getByText("Write your question first.")).toBeInTheDocument();
    expect(ask).not.toHaveBeenCalled();
  });

  it("sends the question (email optional) and shows the confirmation", async () => {
    const user = await open();
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/your question/i), "Why five cups?");
    await user.click(screen.getByRole("button", { name: /send to tony/i }));
    await waitFor(() =>
      expect(ask).toHaveBeenCalledWith({
        slug: "five-cups",
        postTitle: "Five Cups",
        name: "Ada",
        email: "",
        question: "Why five cups?",
        website: "",
      }),
    );
    expect(await screen.findByRole("heading", { name: "Tony will read this." })).toBeInTheDocument();
  });

  it("rejects a malformed email", async () => {
    const user = await open();
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/email/i), "bad");
    await user.type(screen.getByLabelText(/your question/i), "Q");
    await user.click(screen.getByRole("button", { name: /send to tony/i }));
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(ask).not.toHaveBeenCalled();
  });

  it("shows a spinner while sending and the error when it fails", async () => {
    let resolve!: (v: { ok: boolean; error?: string }) => void;
    ask.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = await open();
    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/your question/i), "Q");
    await user.click(screen.getByRole("button", { name: /send to tony/i }));
    const button = screen.getByRole("button", { name: /send to tony/i });
    await waitFor(() => expect(button).toBeDisabled());
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve({ ok: false, error: "Too many questions." });
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many questions.");
  });
});
