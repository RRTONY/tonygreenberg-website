import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrewSoulNav, BrewSoulFooter } from "@/components/brewsoul/brewsoul-nav";
import { navigation } from "../../helpers/next";
import { BREWSOUL_ECOSYSTEM } from "@/lib/content/brewsoul-config";
import { BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("BrewSoulNav", () => {
  it("shows the logo link and the first 8 sections, marking the current one", () => {
    navigation.pathname = "/brewsoul/browse";
    render(<BrewSoulNav />);
    expect(screen.getByRole("link", { name: /BrewSoul\s*Coffee Intelligence/ })).toHaveAttribute("href", "/brewsoul");
    expect(screen.getByRole("link", { name: "Catalog" }).className).toContain("font-semibold");
    expect(screen.getByRole("link", { name: "Home" }).className).not.toContain("font-semibold");
  });

  it("opens the full menu (with ecosystem links) and closes it again", async () => {
    const user = userEvent.setup();
    render(<BrewSoulNav />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guest: Shanita Nicholas" })).toHaveAttribute("href", "/brewsoul/guest/shanita-nicholas");
    for (const e of BREWSOUL_ECOSYSTEM) expect(screen.getByRole("link", { name: e.label })).toHaveAttribute("href", e.url);
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  it("closes the menu when the page changes", async () => {
    const user = userEvent.setup();
    navigation.pathname = "/brewsoul/browse";
    const { rerender } = render(<BrewSoulNav />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    navigation.pathname = "/brewsoul/glossary";
    rerender(<BrewSoulNav />);
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });

  it("adds a border once the page is scrolled", () => {
    render(<BrewSoulNav />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("border-transparent");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(nav.className).not.toContain("border-transparent");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it.fails("BUG: every menu link points at a page that exists (My Collection goes to /brewsoul/my-coffees, the route is /brewsoul/collection)", async () => {
    const user = userEvent.setup();
    render(<BrewSoulNav />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const internal = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href")!)
      .filter((h) => h.startsWith("/brewsoul"));
    const missing = internal.filter((h) => !existsSync(join(process.cwd(), "src/app", h, "page.tsx")));
    expect(missing).toEqual([]);
  });
});

describe("BrewSoulFooter", () => {
  it("links to the directory with the live page count and the ecosystem sites", () => {
    render(<BrewSoulFooter />);
    expect(screen.getByRole("link", { name: `See All ${BREWSOUL_TOTAL_PAGES} Pages` })).toHaveAttribute("href", "/brewsoul/directory");
    for (const e of BREWSOUL_ECOSYSTEM) expect(screen.getByRole("link", { name: e.label })).toHaveAttribute("href", e.url);
  });
});
