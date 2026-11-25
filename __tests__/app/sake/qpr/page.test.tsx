import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/qpr/page";

vi.mock("@/components/sake/pages/qpr-rankings", () => ({ SakeQprRankings: () => <div data-testid="page" /> }));

describe("/sake/qpr page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "QPR Rankings | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("The only number that matters when buying sake.")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/qpr");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
