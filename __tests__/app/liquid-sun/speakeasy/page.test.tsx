import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/speakeasy/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
}));

describe("/liquid-sun/speakeasy page", () => {
  it("uses the page's own title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("Restricted Area | LiquidSun");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/speakeasy");
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent("Restricted Area");
    expect(container.querySelector('script[type="application/ld+json"]')?.textContent).toContain("/liquid-sun/speakeasy");
  });
});
