import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/sommelier-card/page";

vi.mock("@/components/sake/pages/sommelier-card/sommelier-card", () => ({ SakeSommelierCard: () => <div data-testid="page" /> }));

describe("/sake/sommelier-card page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Sommelier Card | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Discover your sake personality")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/sommelier-card");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
