import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/price-tracker/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/price-tracker", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Price Tracker | SoulSmoke");
    expect(metadata.description).toMatch(/^Track prices across retailers/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/price-tracker");
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
