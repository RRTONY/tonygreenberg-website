import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/manifesto/page";

vi.mock("@/components/sake/pages/manifesto", () => ({ SakeManifesto: () => <div data-testid="page" /> }));

describe("/sake/manifesto page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Anti-Score Manifesto | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Why we reject 100-point scoring. Why EVI and EEI matter more than Parker points. The soul of this site distilled into words.");
    expect(metadata.alternates?.canonical).toBe("/sake/manifesto");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
