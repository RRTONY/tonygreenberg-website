import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/aroma/page";

vi.mock("@/components/sake/pages/aroma", () => ({ SakeAroma: () => <div data-testid="page" /> }));

describe("/sake/aroma page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Aroma Finder | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Select the aromas that speak to you.")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/aroma");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
