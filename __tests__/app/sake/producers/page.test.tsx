import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/producers/page";

vi.mock("@/components/sake/pages/producers", () => ({ SakeProducers: () => <div data-testid="page" /> }));

describe("/sake/producers page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Producers | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Your sake has a soul")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/producers");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
