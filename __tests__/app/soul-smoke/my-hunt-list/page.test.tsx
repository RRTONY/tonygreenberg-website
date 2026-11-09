import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/my-hunt-list/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/my-hunt-list", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("My Hunt List | SoulSmoke");
    expect(metadata.description).toMatch(/^Start exploring the Quadrant/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/my-hunt-list");
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
