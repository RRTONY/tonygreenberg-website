import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/exv-builder/page";

vi.mock("@/components/sake/pages/exv-builder", () => ({ SakeExvBuilder: () => <div data-testid="page" /> }));

describe("/sake/exv-builder page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "EXV Builder | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Score any sake across 7")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/exv-builder");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
