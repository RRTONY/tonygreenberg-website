import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/importers/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/importers", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("The Gatekeepers | SoulSmoke");
    expect(metadata.description).toMatch(/^A ranked guide to US mezcal importers/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/importers");
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
