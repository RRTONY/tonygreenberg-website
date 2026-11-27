import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/science-of-spirit/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("/liquid-sun/science-of-spirit page", () => {
  it("uses the page's own heading as its title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("Science of Spirit | LiquidSun");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/science-of-spirit");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Science of Spirit");
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
