import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/explore/page";
import { AQUEOUS_SEO } from "@/lib/content/aqueous/seo";

vi.mock("@/components/aqueous/pages/water-explorer", () => ({ WaterExplorer: () => <div data-testid="page" /> }));

describe("/aqueous/explore page", () => {
  it("uses the app's SEO copy and renders JSON-LD plus the page", () => {
    expect(String(metadata.description)).toBe(AQUEOUS_SEO.explore.description);
    expect(String(metadata.title)).toContain(AQUEOUS_SEO.explore.title);
    expect(metadata.alternates?.canonical).toBe("/aqueous/explore");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
