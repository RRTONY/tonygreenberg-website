import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { JourneyBar, MarkVisited, markVisited } from "@/components/brewsoul/journey-bar";
import { navigation } from "../../helpers/next";

const nextLinks = () =>
  screen
    .getAllByRole("link")
    .filter((a) => !a.getAttribute("aria-label"))
    .map((a) => a.getAttribute("href"));

describe("JourneyBar", () => {
  it("is hidden on the BrewSoul landing page", () => {
    navigation.pathname = "/brewsoul";
    const { container } = render(<JourneyBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current step and shows that page's next suggestions", () => {
    navigation.pathname = "/brewsoul/browse";
    render(<JourneyBar />);
    expect(screen.getByRole("link", { name: "Catalog" })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("link", { name: "Taste Quiz" })).not.toHaveAttribute("aria-current");
    expect(nextLinks()).toEqual(["/brewsoul/quiz", "/brewsoul/chains", "/brewsoul/compare"]);
  });

  it("uses the coffee-detail suggestions on a coffee page and the defaults elsewhere", () => {
    navigation.pathname = "/brewsoul/coffee/gesha-village-lot-74";
    const { unmount } = render(<JourneyBar />);
    expect(nextLinks()).toEqual(["/brewsoul/browse", "/brewsoul/quiz", "/brewsoul/compare"]);
    unmount();
    navigation.pathname = "/brewsoul/esoteric";
    render(<JourneyBar />);
    expect(nextLinks()).toEqual(["/brewsoul/home", "/brewsoul/browse", "/brewsoul/quiz"]);
  });

  it("shows steps already visited in a lighter gold", () => {
    markVisited("chains");
    navigation.pathname = "/brewsoul/browse";
    render(<JourneyBar />);
    expect(screen.getByRole("link", { name: "Chain Rankings" }).firstElementChild?.className).toContain("bg-[#C5A23C]/50");
    expect(screen.getByRole("link", { name: "Taste Quiz" }).firstElementChild?.className).toContain("bg-white/15");
  });

  it("every suggestion points at a real page (Drops suggests /brewsoul/my-coffees; the route is /brewsoul/collection)", () => {
    const appDir = join(process.cwd(), "src/app/brewsoul");
    const routes = readdirSync(appDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("["))
      .map((d) => `/brewsoul/${d.name}`);
    const missing = new Set<string>();
    for (const route of routes) {
      navigation.pathname = route;
      const { unmount } = render(<JourneyBar />);
      for (const href of nextLinks()) if (href && !existsSync(join(process.cwd(), "src/app", href, "page.tsx"))) missing.add(href);
      unmount();
    }
    expect([...missing]).toEqual([]);
  });
});

describe("markVisited / MarkVisited", () => {
  it("records a visited step in the browser", () => {
    markVisited("quiz");
    expect(localStorage.getItem("brewsoul-visited-quiz")).toBe("1");
    const { container } = render(<MarkVisited stepId="home" />);
    expect(container).toBeEmptyDOMElement();
    expect(localStorage.getItem("brewsoul-visited-home")).toBe("1");
  });
});
