import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/exv/page";

vi.mock("@/components/sake/pages/exv-system", () => ({ SakeExvSystem: () => <div data-testid="page" /> }));

describe("/sake/exv page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "EXV System | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toContain("Experience Value. Not what sake IS");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/exv");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
