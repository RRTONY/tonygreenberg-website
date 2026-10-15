import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoffeeCard, TierIcons } from "@/components/brewsoul/coffee-card";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeTier } from "@/lib/intelligence-engine/scoring";

const base = BREWSOUL_COFFEES[0];

describe("CoffeeCard", () => {
  it("shows the name, producer, origin line, notes, price and QPR", () => {
    render(<CoffeeCard coffee={base} scores={{ qpr: 72 }} />);
    expect(screen.getByText(base.name)).toBeInTheDocument();
    expect(screen.getByText(base.producer)).toBeInTheDocument();
    expect(screen.getByText(`${base.originCountry} · ${base.variety} · ${base.processingMethod}`)).toBeInTheDocument();
    expect(screen.getByText(base.tastingNotes.join(", "))).toBeInTheDocument();
    expect(screen.getByText(`$${base.priceUsd}`)).toBeInTheDocument();
    expect(screen.getByText("QPR 72")).toBeInTheDocument();
  });

  it.each([
    [85, "text-[#3B6548]"],
    [65, "text-[#836311]"],
    [30, "text-[#8B2500]"],
  ])("colours a QPR of %i with %s", (qpr, cls) => {
    render(<CoffeeCard coffee={base} scores={{ qpr }} />);
    expect(screen.getByText(`QPR ${qpr}`).className).toContain(cls);
  });

  it("shows the Mold-Free and Limited badges only when they apply", () => {
    const { unmount } = render(<CoffeeCard coffee={{ ...base, moldTestStatus: "verified", limitedRelease: true }} scores={{ qpr: 50 }} />);
    expect(screen.getByText("Mold-Free")).toBeInTheDocument();
    expect(screen.getByText("Limited")).toBeInTheDocument();
    unmount();
    render(<CoffeeCard coffee={{ ...base, moldTestStatus: "untested", limitedRelease: false }} scores={{ qpr: 50 }} />);
    expect(screen.queryByText("Mold-Free")).not.toBeInTheDocument();
    expect(screen.queryByText("Limited")).not.toBeInTheDocument();
  });

  it("falls back to generic notes when none are listed, and labels the tier", () => {
    render(<CoffeeCard coffee={{ ...base, tastingNotes: [] }} scores={{ qpr: 50 }} />);
    expect(screen.getByText("Complex, nuanced")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `Tier ${computeTier(base.cuppingScore || 0)}` })).toBeInTheDocument();
  });
});

describe("TierIcons", () => {
  it("has a screen-reader label for each tier", () => {
    for (const t of [1, 2, 3, 4] as const) {
      const { unmount } = render(<TierIcons tier={t} />);
      expect(screen.getByRole("img", { name: `Tier ${t}` }).querySelectorAll("svg").length).toBeGreaterThan(0);
      unmount();
    }
  });
});
