import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DirectoryExplorer } from "@/components/brewsoul/directory-explorer";
import { BREWSOUL_CATEGORIES, BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";

const pageLinks = () => screen.getAllByRole("link").map((a) => a.getAttribute("href"));

describe("DirectoryExplorer", () => {
  it("shows every page of every category with the real counts", () => {
    render(<DirectoryExplorer />);
    expect(screen.getByRole("button", { name: `All (${BREWSOUL_TOTAL_PAGES})` })).toBeInTheDocument();
    for (const cat of BREWSOUL_CATEGORIES) {
      expect(screen.getByRole("button", { name: `${cat.title} (${cat.pages.length})` })).toHaveAttribute("aria-pressed", "false");
    }
    expect(pageLinks()).toEqual(BREWSOUL_CATEGORIES.flatMap((c) => c.pages.map((p) => p.path)));
  });

  it("narrows to one category, and clicking it again shows all", async () => {
    const user = userEvent.setup();
    render(<DirectoryExplorer />);
    const cat = BREWSOUL_CATEGORIES[1];
    const chip = screen.getByRole("button", { name: `${cat.title} (${cat.pages.length})` });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(pageLinks()).toEqual(cat.pages.map((p) => p.path));
    await user.click(chip);
    expect(pageLinks()).toHaveLength(BREWSOUL_TOTAL_PAGES);
  });

  it("the All chip clears a category filter", async () => {
    const user = userEvent.setup();
    render(<DirectoryExplorer />);
    const cat = BREWSOUL_CATEGORIES[0];
    await user.click(screen.getByRole("button", { name: `${cat.title} (${cat.pages.length})` }));
    await user.click(screen.getByRole("button", { name: `All (${BREWSOUL_TOTAL_PAGES})` }));
    expect(pageLinks()).toHaveLength(BREWSOUL_TOTAL_PAGES);
  });

  it("every directory entry is an internal BrewSoul link with no duplicates", () => {
    const paths = BREWSOUL_CATEGORIES.flatMap((c) => c.pages.map((p) => p.path));
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) expect(p.startsWith("/")).toBe(true);
  });
});
