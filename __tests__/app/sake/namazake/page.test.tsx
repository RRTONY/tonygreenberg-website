import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/namazake/page";

vi.mock("@/components/sake/pages/namazake", () => ({ SakeNamazake: () => <div data-testid="page" /> }));

describe("/sake/namazake page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Namazake | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toContain("Unpasteurized. Unfiltered by convention.");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/namazake");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
