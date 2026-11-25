import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import SubscriptionPage, { metadata as subscriptionMeta } from "@/app/sake/subscription/page";
import MyReviewsPage, { metadata as myReviewsMeta } from "@/app/sake/my-reviews/page";
import ScannerPage, { metadata as scannerMeta } from "@/app/sake/sake-scanner/page";
import MenuPage, { metadata as menuMeta } from "@/app/sake/menu-analyzer/page";
import DealAlertsPage, { metadata as alertsMeta } from "@/app/sake/deal-alerts/page";

vi.mock("@/components/sake/pages/subscription", () => ({
  SakeSubscription: (p: { checkoutOpen: boolean; testMode: boolean }) => <div data-testid="page">{`${p.checkoutOpen}/${p.testMode}`}</div>,
}));
vi.mock("@/components/sake/pages/my-reviews", () => ({ SakeMyReviews: () => <div data-testid="page" /> }));
vi.mock("@/components/sake/pages/sake-scanner", () => ({ SakeScanner: () => <div data-testid="page" /> }));
vi.mock("@/components/sake/pages/menu-analyzer", () => ({ SakeMenuAnalyzer: () => <div data-testid="page" /> }));
vi.mock("@/components/sake/pages/deal-alerts", () => ({ SakeDealAlerts: () => <div data-testid="page" /> }));

afterEach(() => vi.unstubAllEnvs());

const cases = [
  { name: "subscription", Page: SubscriptionPage, meta: subscriptionMeta, title: "Subscription Box", path: "/sake/subscription", starts: "Three bottles. Every month." },
  { name: "my-reviews", Page: MyReviewsPage, meta: myReviewsMeta, title: "My Reviews", path: "/sake/my-reviews", starts: "Sign in to view" },
  { name: "sake-scanner", Page: ScannerPage, meta: scannerMeta, title: "Sake Scanner", path: "/sake/sake-scanner", starts: "Snap a photo" },
  { name: "menu-analyzer", Page: MenuPage, meta: menuMeta, title: "Menu Analyzer", path: "/sake/menu-analyzer", starts: "Enter sake names" },
  { name: "deal-alerts", Page: DealAlertsPage, meta: alertsMeta, title: "Deal Alerts", path: "/sake/deal-alerts", starts: "Get notified" },
];

describe("server-batch /sake route files", () => {
  it.each(cases)("$name has its title, description, canonical and JSON-LD", ({ Page, meta, title, path, starts }) => {
    expect(meta.title).toEqual({ absolute: `${title} | Sake for Sake's Sake™` });
    expect(String(meta.description).startsWith(starts)).toBe(true);
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
    expect(meta.alternates?.canonical).toBe(path);
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });

  it("keeps My Reviews out of search, and the others in", () => {
    expect(myReviewsMeta.robots).toEqual({ index: false, follow: true });
    expect(alertsMeta.robots).toMatchObject({ index: true });
  });

  it("tells the subscription page whether ordering is open and in test mode", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    vi.stubEnv("SAKE_CHECKOUT_ENABLED", "true");
    expect(render(<SubscriptionPage />).getByTestId("page")).toHaveTextContent("true/true");
  });
});
