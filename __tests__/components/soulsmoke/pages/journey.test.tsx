import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SoulsmokeJourney, journeySteps } from "@/components/soulsmoke/pages/journey";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("SoulsmokeJourney", () => {
  it("shows all six steps, photos for the first four and icons for the rest", () => {
    render(
      <SoulsmokeProviders>
        <SoulsmokeJourney />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/From Curious\s*to Connoisseur/);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      ...journeySteps.map((s) => s.title),
      "Ready to Begin?",
    ]);
    expect(screen.getByAltText("Discover")).toBeInTheDocument();
    expect(screen.queryByAltText("Connect")).not.toBeInTheDocument();
  });

  it("keeps every link inside /soul-smoke", () => {
    const { container } = render(
      <SoulsmokeProviders>
        <SoulsmokeJourney />
      </SoulsmokeProviders>,
    );
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs.length).toBeGreaterThan(10);
    expect(hrefs.every((h) => h?.startsWith("/soul-smoke/"))).toBe(true);
    expect(screen.getByRole("link", { name: /Begin the Journey/ })).toHaveAttribute("href", "/soul-smoke/evolution");
    expect(screen.getAllByRole("link", { name: /Take the Taste Quiz/ })[1]).toHaveAttribute("href", "/soul-smoke/taste-quiz");
  });
});
