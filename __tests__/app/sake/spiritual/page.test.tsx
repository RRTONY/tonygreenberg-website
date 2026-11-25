import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/spiritual/page";

vi.mock("@/components/sake/pages/spiritual", () => ({ SakeSpiritual: () => <div data-testid="page" /> }));

describe("/sake/spiritual page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Spiritual Realms | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Sake is not a beverage. It is a vehicle.")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/spiritual");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
