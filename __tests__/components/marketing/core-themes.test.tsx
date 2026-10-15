import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoreThemes } from "@/components/marketing/core-themes";
import { FEATURED_THEMES } from "@/lib/content/theme-map";

describe("CoreThemes", () => {
  it("shows one card per featured theme linking to its category", () => {
    render(<CoreThemes categoryCounts={{}} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Core Themes");
    for (const t of FEATURED_THEMES) {
      const link = screen.getByRole("link", { name: new RegExp(t.key.replace("&", "\\&")) });
      expect(link).toHaveAttribute("href", `/blog/category/${t.categorySlug}`);
    }
  });

  it("shows each category's essay count, zero when missing", () => {
    const first = FEATURED_THEMES[0];
    render(<CoreThemes categoryCounts={{ [first.categorySlug]: 27 }} />);
    expect(screen.getByText(/27 ESSAYS/)).toBeInTheDocument();
    expect(screen.getAllByText(/0 ESSAYS/)).toHaveLength(FEATURED_THEMES.length - 1);
  });

  it("spells out the number of lenses", () => {
    render(<CoreThemes categoryCounts={{}} />);
    expect(screen.getByText(/lenses on a life spent building bridges/)).toHaveTextContent(/^(Two|Three|Four|Five|Six|Seven|Eight) lenses/);
  });
});
