import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteSearch } from "@/components/search/site-search";
import { navigation } from "@tests/helpers/next";

let fetchMock: ReturnType<typeof vi.fn>;
const REMOTE = {
  posts: [{ title: "Five Cups", href: "/blog/five-cups", description: "On ritual" }],
  coffees: [{ title: "Onyx Geometry", href: "/brewsoul/coffee/onyx-geometry", description: "A coffee" }],
  charities: [{ title: "Charity X", href: "https://charity.example", description: "Good", external: true }],
};

function setup(initialQuery = "") {
  render(<SiteSearch initialQuery={initialQuery} emptyStateLine="Find anything on the site." essayCount={300} />);
  return userEvent.setup();
}

describe("SiteSearch", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify(REMOTE)));
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows the empty state before a search", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Search");
    expect(screen.getByRole("heading", { name: "Search Everything" })).toBeInTheDocument();
    expect(screen.getByText("Find anything on the site.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("searches as you type, groups results and keeps ?q= in the address", async () => {
    const user = setup();
    await user.type(screen.getByRole("searchbox", { name: /search everything/i }), "coffee");
    expect(await screen.findByRole("link", { name: /Five Cups/ }, { timeout: 5000 })).toHaveAttribute("href", "/blog/five-cups");
    expect(fetchMock).toHaveBeenCalledWith("/api/search?all=1&q=coffee", expect.anything());
    expect(screen.getByRole("heading", { name: /Essays \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /BrewSoul/ })).toBeInTheDocument();
    expect(window.location.search).toBe("?q=coffee");
    const ext = screen.getByRole("link", { name: /Charity X/ });
    expect(ext).toHaveAttribute("target", "_blank");
  });

  it("filter chips narrow the results", async () => {
    const user = setup("coffee");
    await screen.findByRole("link", { name: /Five Cups/ }, { timeout: 5000 });
    const chips = screen.getByRole("group", { name: "Filter results" });
    await user.click(within(chips).getByRole("button", { name: "Essays" }));
    expect(within(chips).getByRole("button", { name: "Essays" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /Five Cups/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Onyx Geometry/ })).not.toBeInTheDocument();
  });

  it("shows a no-results message", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({})));
    setup("zqxjvw");
    expect(await screen.findByText(/No results for/, {}, { timeout: 5000 })).toHaveTextContent("zqxjvw");
  });

  it("clear empties the box and the back button goes home when there's no history", async () => {
    const user = setup("coffee");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    Object.defineProperty(window.history, "length", { value: 1, configurable: true });
    await user.click(screen.getByRole("button", { name: "Go back" }));
    expect(navigation.router.push).toHaveBeenCalledWith("/");
  });
});
