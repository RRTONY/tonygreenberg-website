import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/vessels/page";

vi.mock("@/components/sake/pages/vessels", () => ({ SakeVessels: () => <div data-testid="page" /> }));

describe("/sake/vessels page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(String((metadata.title as { absolute: string }).absolute)).toMatch(/\| Sake for Sake's Sake™$/);
    expect(String(metadata.description).length).toBeGreaterThan(40);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/vessels");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
