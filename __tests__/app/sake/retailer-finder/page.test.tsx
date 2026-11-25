import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/retailer-finder/page";

vi.mock("@/components/sake/pages/retailer-finder", () => ({ SakeRetailerFinder: () => <div data-testid="page" /> }));

describe("/sake/retailer-finder page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Retailer Finder | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Enter your ZIP code")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/retailer-finder");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
