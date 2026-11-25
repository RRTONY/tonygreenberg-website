import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/journal/page";

vi.mock("@/components/sake/pages/journal", () => ({ SakeJournal: () => <div data-testid="page" /> }));

describe("/sake/journal page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Journal | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Not just what you tasted. Who you were with, what you felt, the weather, the music.");
    expect(metadata.alternates?.canonical).toBe("/sake/journal");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
