import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/trade-board/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/trade-board", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Trade Board | SoulSmoke");
    expect(metadata.description).toMatch(/^Connect with fellow collectors/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/trade-board");
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
