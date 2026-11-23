import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/payment/success/page";

vi.mock("@/components/aqueous/pages/payment-success", () => ({ PaymentSuccess: () => <div data-testid="page-body" /> }));

describe("/aqueous/payment/success", () => {
  it("renders the ported page with the app's SEO copy", () => {
    const { container } = render(<Page />);
    expect(screen.getByTestId("page-body")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]') !== null).toBe(false);
    expect(metadata.title).toBe("Payment Successful | Aqueous");
    expect(metadata.alternates?.canonical).toBe("/aqueous/payment/success");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
