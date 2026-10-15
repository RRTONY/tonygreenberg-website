import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HighlightSaveButton } from "@/components/blog/highlight-save-button";
import { saveHighlight } from "@/app/my-highlights/actions";

vi.mock("@/app/my-highlights/actions", () => ({ saveHighlight: vi.fn() }));
const save = vi.mocked(saveHighlight);

const PASSAGE = "The best ideas don't inform, they transform.";

// jsdom has no layout, so the selection is a stand-in pointing at a real node.
function select(text: string, inBody = true) {
  const host = document.createElement("div");
  if (inBody) host.className = "article-body";
  const p = document.createElement("p");
  p.textContent = `Before. ${text} After.`;
  host.appendChild(p);
  document.body.appendChild(host);
  const node = p.firstChild!;
  vi.spyOn(window, "getSelection").mockReturnValue({
    toString: () => text,
    isCollapsed: false,
    getRangeAt: () => ({
      commonAncestorContainer: node,
      startContainer: node,
      getBoundingClientRect: () => ({ left: 100, width: 50, top: 300 }),
    }),
  } as unknown as Selection);
  act(() => {
    fireEvent.mouseUp(document);
  });
  return host;
}

describe("HighlightSaveButton", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
    document.body.innerHTML = "";
  });

  it("appears only for a 10+ character selection inside the essay body", () => {
    render(<HighlightSaveButton postSlug="five-cups" />);
    select("short");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    select(PASSAGE, false);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    select(PASSAGE);
    expect(screen.getByRole("button", { name: /save highlight/i })).toBeInTheDocument();
  });

  it("saves the passage with its paragraph and confirms", async () => {
    const user = userEvent.setup();
    render(<HighlightSaveButton postSlug="five-cups" />);
    select(PASSAGE);
    await user.click(screen.getByRole("button", { name: /save highlight/i }));
    expect(save).toHaveBeenCalledWith({ postSlug: "five-cups", text: PASSAGE, context: `Before. ${PASSAGE} After.` });
    const done = await screen.findByRole("button", { name: "Saved to your Commonplace Book" });
    expect(done).toBeDisabled();
  });

  it("shows a spinner while saving", async () => {
    let resolve!: (v: { ok: boolean }) => void;
    save.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<HighlightSaveButton postSlug="five-cups" />);
    select(PASSAGE);
    await user.click(screen.getByRole("button", { name: /save highlight/i }));
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    await act(async () => resolve({ ok: true }));
  });

  it("offers a sign-in link when signed out, and a retry on error", async () => {
    save.mockResolvedValue({ ok: false, needsLogin: true });
    const user = userEvent.setup();
    render(<HighlightSaveButton postSlug="five-cups" />);
    select(PASSAGE);
    await user.click(screen.getByRole("button", { name: /save highlight/i }));
    expect(await screen.findByRole("link", { name: "Sign in to save highlights" })).toHaveAttribute(
      "href",
      `/login?next=${encodeURIComponent("/blog/five-cups")}`,
    );

    save.mockResolvedValue({ ok: false });
    select(PASSAGE);
    await user.click(screen.getByRole("button", { name: /save highlight/i }));
    expect(await screen.findByRole("button", { name: "Couldn't save. Try again" })).toBeEnabled();
  });

  it("hides on scroll", () => {
    render(<HighlightSaveButton postSlug="five-cups" />);
    select(PASSAGE);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
