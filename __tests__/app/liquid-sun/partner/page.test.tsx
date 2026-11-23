import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/partner/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
  submitPartnerInquiry: vi.fn(),
}));

describe("/liquid-sun/partner page", () => {
  it("uses the page's heading and intro as its title and description", () => {
    expect(metadata.title).toBe("Become a Partner | LiquidSun");
    expect(metadata.description).toMatch(/^LiquidSun reaches the most discerning tequila enthusiasts/);
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/partner");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Become a Partner");
    expect(container.querySelector('script[type="application/ld+json"]')?.textContent).toContain("Become a Partner");
  });
});
