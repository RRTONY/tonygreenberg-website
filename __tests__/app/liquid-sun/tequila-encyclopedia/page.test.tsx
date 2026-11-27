import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/tequila-encyclopedia/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("/liquid-sun/tequila-encyclopedia page", () => {
  it("uses the page's own heading as its title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("The Tequilas | LiquidSun");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/tequila-encyclopedia");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Tequilas");
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
