import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/evolution/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/evolution", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("From Worm to Wonder | SoulSmoke");
    expect(metadata.description).toMatch(/^The journey of mezcal/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/evolution");
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
