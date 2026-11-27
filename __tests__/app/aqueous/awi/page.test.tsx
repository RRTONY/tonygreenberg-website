import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/awi/page";
import { AQUEOUS_SEO } from "@/lib/content/aqueous/seo";

vi.mock("@/components/aqueous/pages/awi-index", () => ({ AWIIndex: () => <div data-testid="page" /> }));

describe("/aqueous/awi page", () => {
  it("uses the app's SEO copy and renders JSON-LD plus the page", () => {
    expect(String(metadata.description)).toBe(AQUEOUS_SEO.awi.description);
    expect(String(metadata.title)).toContain(AQUEOUS_SEO.awi.title);
    expect(metadata.alternates?.canonical).toBe("/aqueous/awi");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
