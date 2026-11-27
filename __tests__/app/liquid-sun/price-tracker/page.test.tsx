import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/price-tracker/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("/liquid-sun/price-tracker page", () => {
  it("uses the page's own heading as its title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("Price Tracker | LiquidSun");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/price-tracker");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Price Tracker");
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
