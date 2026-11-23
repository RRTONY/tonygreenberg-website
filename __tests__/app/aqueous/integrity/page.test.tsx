import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/integrity/page";
import { AQUEOUS_SEO } from "@/lib/content/aqueous/seo";

vi.mock("@/components/aqueous/pages/integrity", () => ({ Integrity: () => <div data-testid="page" /> }));

describe("/aqueous/integrity page", () => {
  it("uses the app's own SEO and renders JSON-LD plus the page", () => {
    expect(String(metadata.description)).toBe(AQUEOUS_SEO.integrity.description);
    expect(metadata.alternates?.canonical).toMatch(/\/aqueous\/integrity$/);
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
