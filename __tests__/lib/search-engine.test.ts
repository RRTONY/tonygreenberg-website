import { describe, expect, it } from "vitest";
import { scoreItem, searchPages, type PageItem } from "@/lib/search-engine";

const item = { title: "Coffee Quiz", description: "Find your brew soul", tags: ["brewsoul", "coffee"] };

describe("scoreItem", () => {
  it("weights exact, prefix and substring title matches", () => {
    expect(scoreItem("coffee quiz", item)).toBe(100 + 30);
    expect(scoreItem("coffee", item)).toBe(85 + 45);
    expect(scoreItem("quiz", item)).toBe(65);
  });

  it("adds tag and description bonuses, case-insensitively", () => {
    expect(scoreItem("BREWSOUL", item)).toBe(45);
    expect(scoreItem("brew soul", item)).toBe(25 + 30);
  });

  it("gives 10 for a fuzzy subsequence only when nothing else matched", () => {
    expect(scoreItem("cfqz", item)).toBe(10);
    expect(scoreItem("xyz", item)).toBe(0);
  });

  it("handles a missing tags list", () => {
    expect(scoreItem("find", { title: "A", description: "find me" })).toBe(25);
  });
});

describe("searchPages", () => {
  const pages: PageItem[] = [
    { title: "About", description: "Tony's story", href: "/about" },
    { title: "Coffee Quiz", description: "brew", href: "/brewsoul" },
    { title: "Coffee", description: "", href: "/coffee" },
  ];

  it("returns the first pages for an empty query", () => {
    expect(searchPages("   ", pages, 2).map((p) => p.href)).toEqual(["/about", "/brewsoul"]);
  });

  it("sorts by score and drops non-matches", () => {
    expect(searchPages("coffee", pages).map((p) => p.href)).toEqual(["/coffee", "/brewsoul"]);
  });

  it("respects the limit", () => {
    expect(searchPages("coffee", pages, 1)).toHaveLength(1);
  });
});
