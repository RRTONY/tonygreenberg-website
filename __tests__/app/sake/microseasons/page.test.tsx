import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/microseasons/page";

vi.mock("@/components/sake/pages/microseasons", () => ({ SakeMicroseasons: () => <div data-testid="page" /> }));

describe("/sake/microseasons page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "72 Seasons | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Japan doesn't have 4 seasons.")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/microseasons");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
