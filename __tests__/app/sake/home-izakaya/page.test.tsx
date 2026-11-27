import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/home-izakaya/page";

vi.mock("@/components/sake/pages/home-izakaya", () => ({ SakeHomeIzakaya: () => <div data-testid="page" /> }));

describe("/sake/home-izakaya page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Home Izakaya | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Transform your kitchen into a Kyoto backstreet bar. Lighting, music, vessels, temperature, food sequence, seasonal ikebana.");
    expect(metadata.alternates?.canonical).toBe("/sake/home-izakaya");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
