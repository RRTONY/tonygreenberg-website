import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/squad-riders/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/squad-riders", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("The Squad Riders | SoulSmoke");
    expect(metadata.description).toMatch(/^Who to trust in the mezcal world/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/squad-riders");
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
