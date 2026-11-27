import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/food-pairing/page";

vi.mock("@/components/sake/pages/food-pairing", () => ({ SakeFoodPairing: () => <div data-testid="page" /> }));

describe("/sake/food-pairing page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Food Pairing | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("In Japan, sake and food are not paired")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/food-pairing");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
