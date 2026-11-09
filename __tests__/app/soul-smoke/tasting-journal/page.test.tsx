import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/tasting-journal/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/tasting-journal", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Your Tasting Journal | SoulSmoke");
    expect(metadata.description).toMatch(/^Track every mezcal you taste/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/tasting-journal");
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
