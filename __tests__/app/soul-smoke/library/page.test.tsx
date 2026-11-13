import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/library/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/library page", () => {
  it("uses the page's own heading as its title, with a canonical under /soul-smoke", () => {
    // Over 60 with " | Tony Greenberg", so seoTitle drops the ending (limit 60 since 2026-11-14).
    expect(metadata.title).toEqual({ absolute: "The Essential Mezcal Reading List | SoulSmoke" });
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/library");
  });

  it("renders the ported page", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The Essential/);
  });
});
