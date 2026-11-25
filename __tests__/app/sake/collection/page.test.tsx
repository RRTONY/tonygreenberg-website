import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/collection/page";

vi.mock("@/components/sake/pages/collection", () => ({ SakeCollection: () => <div data-testid="page" /> }));

describe("/sake/collection page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Collection | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toContain("bottles that define what sake can be");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/collection");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
