import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/discovery/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/discovery", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Discovery Engine | SoulSmoke");
    expect(metadata.description).toMatch(/^Find your perfect mezcal/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/discovery");
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
