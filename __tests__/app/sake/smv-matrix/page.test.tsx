import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/smv-matrix/page";

vi.mock("@/components/sake/pages/smv-matrix", () => ({ SakeSmvMatrix: () => <div data-testid="page" /> }));

describe("/sake/smv-matrix page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "SMV Matrix | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Sake Meter Value (SMV) measures")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/smv-matrix");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
