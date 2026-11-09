import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/tasting-journal/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

// The page's member features call the server; here the visitor is signed out.
vi.mock("@/app/soul-smoke/actions", () => {
  const signedOut = async () => ({ ok: false, error: "Please sign in first.", signedOut: true });
  return {
    listTradeListings: async () => ({ ok: true, data: { listings: [], signedIn: false } }),
    listTastingEntries: signedOut,
    listPriceAlerts: signedOut,
    getMyBusinessProfile: signedOut,
  };
});

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
