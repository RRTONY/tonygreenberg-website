import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/water/page";

vi.mock("@/components/sake/pages/water", () => ({ SakeWater: () => <div data-testid="page" /> }));

describe("/sake/water page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Water Atlas | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Sake is 80% water. The invisible ingredi")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/water");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
