import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/price-tracker/page";
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
