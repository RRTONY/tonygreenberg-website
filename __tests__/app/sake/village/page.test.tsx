import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/village/page";

vi.mock("@/components/sake/pages/village", () => ({ SakeVillage: () => <div data-testid="page" /> }));

describe("/sake/village page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Village Breweries | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Tiny 1-3 person operations in remote mountain villages. The breweries you'll never find on Google. Where the toji IS the owner IS the farmer.");
    expect(metadata.alternates?.canonical).toBe("/sake/village");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
