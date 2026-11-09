import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/business/page";
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

describe("/soul-smoke/business", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("Register Your Business | SoulSmoke");
    expect(metadata.description).toMatch(/^Join the SoulSmoke network/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/business");
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
