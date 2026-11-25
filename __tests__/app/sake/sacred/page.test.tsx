import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/sacred/page";

vi.mock("@/components/sake/pages/sacred", () => ({ SakeSacred: () => <div data-testid="page" /> }));

describe("/sake/sacred page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Sacred Sake | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Before sake was an industry, it was a prayer. Before it was refined, it was raw. Before men brewed it, women did.");
    expect(metadata.alternates?.canonical).toBe("/sake/sacred");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
