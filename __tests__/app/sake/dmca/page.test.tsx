import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/dmca/page";

vi.mock("@/components/sake/pages/terms", () => ({ SakeTerms: () => <div data-testid="page" /> }));

describe("/sake/dmca page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "DMCA | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Last updated: 2026. These terms govern y")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/terms");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
