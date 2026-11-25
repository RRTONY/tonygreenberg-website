import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/defects/page";

vi.mock("@/components/sake/pages/defects", () => ({ SakeDefects: () => <div data-testid="page" /> }));

describe("/sake/defects page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Off-Flavors | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("How to identify them, and why some \"defects\" are actually features. Kintsugi applied to flavor — the crack is where the gold enters.");
    expect(metadata.alternates?.canonical).toBe("/sake/defects");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
