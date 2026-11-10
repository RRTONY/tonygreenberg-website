import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SoulsmokeSiteMap, siteMapPages } from "@/components/soulsmoke/pages/site-map";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("SoulsmokeSiteMap", () => {
  it("lists every page in its section, linked under /soul-smoke", () => {
    render(
      <SoulsmokeProviders>
        <SoulsmokeSiteMap />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Site Map");
    for (const name of ["The Journey", "Explore", "Reference", "By the Numbers"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    for (const page of siteMapPages) {
      const link = screen.getByRole("link", { name: new RegExp(page.title) });
      expect(link).toHaveAttribute("href", page.path === "/" ? "/soul-smoke" : `/soul-smoke${page.path}`);
    }
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});
