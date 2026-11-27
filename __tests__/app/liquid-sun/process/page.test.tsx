import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/process/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

describe("/liquid-sun/process page", () => {
  it("uses the page's own heading as its title, with a canonical under /liquid-sun", () => {
    expect(metadata.title).toBe("The Process | LiquidSun");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/process");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Process");
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
