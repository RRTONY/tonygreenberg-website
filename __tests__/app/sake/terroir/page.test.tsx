import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/terroir/page";

vi.mock("@/components/sake/pages/terroir", () => ({ SakeTerroir: () => <div data-testid="page" /> }));

describe("/sake/terroir page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Terroir | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Select two prefectures and see how clima")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/terroir");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
