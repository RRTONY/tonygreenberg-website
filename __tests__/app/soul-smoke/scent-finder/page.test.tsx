import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/scent-finder/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/scent-finder", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Scent-to-Agave Finder | SoulSmoke");
    expect(metadata.description).toMatch(/^Select the aromas you taste/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/scent-finder");
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
