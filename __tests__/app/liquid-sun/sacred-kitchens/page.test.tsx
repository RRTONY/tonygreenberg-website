import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/sacred-kitchens/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("/liquid-sun/sacred-kitchens page", () => {
  it("uses the page's own heading as its title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("Sacred Kitchens | LiquidSun");
    expect(metadata.description).toMatch(/best food in Jalisco/);
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/sacred-kitchens");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sacred Kitchens");
    expect(container.querySelector('script[type="application/ld+json"]')?.textContent).toContain("Sacred Kitchens");
  });
});
