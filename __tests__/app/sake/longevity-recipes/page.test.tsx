import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/longevity-recipes/page";

vi.mock("@/components/sake/pages/longevity-recipes", () => ({ SakeLongevityRecipes: () => <div data-testid="page" /> }));

describe("/sake/longevity-recipes page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Longevity Recipes | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Sake isn't just for drinking.")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/longevity-recipes");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
