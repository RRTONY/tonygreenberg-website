import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/premium/page";
import SuccessPage, { metadata as successMetadata } from "@/app/liquid-sun/premium/success/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
  startPremiumCheckout: vi.fn(),
  openBillingPortal: vi.fn(),
}));

afterEach(() => vi.unstubAllEnvs());

const wrap = (node: React.ReactNode) => render(<LiquidsunProviders>{node}</LiquidsunProviders>);

describe("/liquid-sun/premium page", () => {
  it("has its own title and canonical", () => {
    expect(metadata.title).toEqual({ absolute: "Unlock the Full Experience | LiquidSun Premium" });
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/premium");
  });

  it("shows the test-card hint only on a Stripe test key", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    const { unmount } = wrap(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Unlock the Full Experience");
    expect(screen.getByText(/4242 4242 4242 4242/)).toBeInTheDocument();
    unmount();
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_x");
    wrap(<Page />);
    expect(screen.queryByText(/4242/)).not.toBeInTheDocument();
  });
});

describe("/liquid-sun/premium/success page", () => {
  it("is kept out of search and renders the welcome", () => {
    expect(successMetadata.robots).toEqual({ index: false, follow: true });
    expect(successMetadata.alternates?.canonical).toBe("/liquid-sun/premium/success");
    wrap(<SuccessPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to the Inner Circle");
  });
});
