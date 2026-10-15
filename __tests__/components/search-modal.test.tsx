import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchModal } from "@/components/search-modal";
import { navigation } from "@tests/helpers/next";

const POSTS = [{ title: "Five Cups of Coffee", href: "/blog/five-cups", description: "On ritual", category: "Body" }];
let fetchMock: ReturnType<typeof vi.fn>;

function setup() {
  const onOpenChange = vi.fn();
  render(<SearchModal open onOpenChange={onOpenChange} essayCount={300} />);
  return { onOpenChange, user: userEvent.setup(), input: screen.getByPlaceholderText(/search everything/i) };
}

describe("SearchModal", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ posts: POSTS })));
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows featured pages before anything is typed, and focuses the input", async () => {
    const { input } = setup();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText(/6 results/)).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("typing shows matching pages and essays from /api/search", async () => {
    const { user, input } = setup();
    await user.type(input, "coffee");
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /coffee/i }).length).toBeGreaterThan(0);
    expect(await screen.findByRole("button", { name: /Five Cups of Coffee/ }, { timeout: 5000 })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/search?q=coffee", expect.anything());
  });

  it("Enter opens the highlighted result and arrow keys move the highlight", async () => {
    const { user, input, onOpenChange } = setup();
    await user.type(input, "coffee");
    await screen.findByText("Essays", {}, { timeout: 5000 });
    const first = screen.getAllByRole("button", { name: /coffee/i })[0];
    expect(first.className).toContain("bg-brand-gold/10");
    await user.keyboard("{ArrowDown}{ArrowUp}{Enter}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(navigation.router.push).toHaveBeenCalledTimes(1);
    expect(navigation.router.push.mock.calls[0][0]).toMatch(/^\//);
  });

  it("clicking an essay result navigates to it", async () => {
    const { user, input } = setup();
    await user.type(input, "coffee");
    await user.click(await screen.findByRole("button", { name: /Five Cups of Coffee/ }, { timeout: 5000 }));
    expect(navigation.router.push).toHaveBeenCalledWith("/blog/five-cups");
  });

  it("shows a no-results state with a link to the full essay search", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ posts: [] })));
    const { user, input } = setup();
    await user.type(input, "zqxjvw");
    expect(await screen.findByText('No results for "zqxjvw"', {}, { timeout: 5000 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /search all essays/i }));
    expect(navigation.router.push).toHaveBeenCalledWith("/search?q=zqxjvw");
  });

  it("Escape closes the dialog", async () => {
    const { user, onOpenChange } = setup();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
