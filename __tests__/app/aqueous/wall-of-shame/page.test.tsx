import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/wall-of-shame/page";
import { AQUEOUS_SEO } from "@/lib/content/aqueous/seo";

vi.mock("@/components/aqueous/pages/wall-of-shame", () => ({ WallOfShame: () => <div data-testid="page" /> }));

describe("/aqueous/wall-of-shame page", () => {
  it("uses the app's SEO copy and renders JSON-LD plus the page", () => {
    expect(String(metadata.description)).toBe(AQUEOUS_SEO.wallOfShame.description);
    expect(String(metadata.title)).toContain(AQUEOUS_SEO.wallOfShame.title);
    expect(metadata.alternates?.canonical).toBe("/aqueous/wall-of-shame");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
