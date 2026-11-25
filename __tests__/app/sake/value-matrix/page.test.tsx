import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/value-matrix/page";

vi.mock("@/components/sake/pages/value-matrix", () => ({ SakeValueMatrix: () => <div data-testid="page" /> }));

describe("/sake/value-matrix page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Value Matrix | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("The best sake experience isn't always")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/value-matrix");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
