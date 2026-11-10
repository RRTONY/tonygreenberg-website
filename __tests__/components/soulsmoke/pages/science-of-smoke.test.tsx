import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScienceOfSmoke, pitFactors, smokeProfiles, woodTypes } from "@/components/soulsmoke/pages/science-of-smoke";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("ScienceOfSmoke", () => {
  it("shows the woods, pit factors and the five-step smoke scale", () => {
    render(
      <SoulsmokeProviders>
        <ScienceOfSmoke />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Science of Smoke");
    for (const wood of woodTypes) expect(screen.getByRole("heading", { name: wood.name })).toBeInTheDocument();
    for (const pit of pitFactors) expect(screen.getByRole("heading", { name: pit.factor })).toBeInTheDocument();
    for (const profile of smokeProfiles) {
      const bars = screen.getByRole("img", { name: `${profile.intensity} of 5` });
      const filled = [...bars.children].filter((bar) => !bar.classList.contains("bg-gray-800"));
      expect(filled).toHaveLength(profile.intensity);
    }
    expect(screen.getByRole("link", { name: /Back to Home/ })).toHaveAttribute("href", "/soul-smoke");
  });
});
