import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/quadrant/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/quadrant", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("The Mezcal Quadrant | SoulSmoke");
    expect(metadata.description).toMatch(/^80 bottles plotted/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/quadrant");
  });

  it("renders one H1", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
