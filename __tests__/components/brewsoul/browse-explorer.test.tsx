import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowseExplorer } from "@/components/brewsoul/browse-explorer";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeQPR } from "@/lib/intelligence-engine/scoring";

const ALL = BREWSOUL_COFFEES;
const shownIds = () =>
  screen
    .queryAllByRole("link")
    .map((a) => a.getAttribute("href")!)
    .filter((h) => h.startsWith("/brewsoul/coffee/"))
    .map((h) => h.replace("/brewsoul/coffee/", ""));
const count = () => screen.getByText(/coffees? found$/).textContent;
const plural = (n: number) => `${n} coffee${n !== 1 ? "s" : ""} found`;

describe("BrowseExplorer", () => {
  it("shows the whole catalog, best QPR first, with the live counts", () => {
    render(<BrowseExplorer />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Browse All Coffees");
    expect(count()).toBe(plural(ALL.length));
    const expected = [...ALL].sort((a, b) => computeQPR(b, ALL) - computeQPR(a, ALL)).map((c) => c.id);
    expect(shownIds()).toEqual(expected);
  });

  it("filters by origin and processing method together", async () => {
    render(<BrowseExplorer />);
    const origin = ALL[0].originCountry;
    const process = ALL[0].processingMethod;
    fireEvent.change(screen.getByLabelText("Filter by origin"), { target: { value: origin } });
    expect(count()).toBe(plural(ALL.filter((c) => c.originCountry === origin).length));
    fireEvent.change(screen.getByLabelText("Filter by processing method"), { target: { value: process } });
    const expected = ALL.filter((c) => c.originCountry === origin && c.processingMethod === process);
    expect(count()).toBe(plural(expected.length));
    expect(shownIds().sort()).toEqual(expected.map((c) => c.id).sort());
  });

  it("filters by roaster and by mold-free only", async () => {
    render(<BrowseExplorer />);
    fireEvent.click(screen.getByLabelText("Mold-Free Only"));
    expect(shownIds().sort()).toEqual(ALL.filter((c) => c.moldTestStatus === "verified").map((c) => c.id).sort());
    fireEvent.click(screen.getByLabelText("Mold-Free Only"));
    fireEvent.change(screen.getByLabelText("Filter by roaster"), { target: { value: ALL[0].producer } });
    expect(shownIds().sort()).toEqual(ALL.filter((c) => c.producer === ALL[0].producer).map((c) => c.id).sort());
  });

  it("searches names, roasters, varieties and tasting notes", async () => {
    render(<BrowseExplorer />);
    fireEvent.change(screen.getByLabelText("Search coffees"), { target: { value: "jasmine" } });
    const expected = ALL.filter(
      (c) =>
        [c.name, c.producer, c.variety].some((s) => s.toLowerCase().includes("jasmine")) ||
        c.tastingNotes.some((n) => n.toLowerCase().includes("jasmine")),
    );
    expect(expected.length).toBeGreaterThan(0);
    expect(shownIds().sort()).toEqual(expected.map((c) => c.id).sort());
  });

  it("caps by price and sorts by price and name", async () => {
    render(<BrowseExplorer />);
    fireEvent.change(screen.getByLabelText("Maximum price"), { target: { value: "30" } });
    expect(screen.getByText("Max $30")).toBeInTheDocument();
    const cheap = ALL.filter((c) => c.priceUsd <= 30);
    expect(count()).toBe(plural(cheap.length));
    fireEvent.change(screen.getByLabelText("Sort coffees"), { target: { value: "price-desc" } });
    const prices = shownIds().map((id) => ALL.find((c) => c.id === id)!.priceUsd);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    fireEvent.change(screen.getByLabelText("Sort coffees"), { target: { value: "name" } });
    const names = shownIds().map((id) => ALL.find((c) => c.id === id)!.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("says so when nothing matches", async () => {
    render(<BrowseExplorer />);
    fireEvent.change(screen.getByLabelText("Search coffees"), { target: { value: "zzzqqq" } });
    expect(count()).toBe("0 coffees found");
    expect(screen.getByText("No coffees match your filters.")).toBeInTheDocument();
  });

  it("marks the browse step as visited on the journey", () => {
    render(<BrowseExplorer />);
    expect(localStorage.getItem("brewsoul-visited-browse")).toBe("1");
  });
});
