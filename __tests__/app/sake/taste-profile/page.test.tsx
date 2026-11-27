import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/taste-profile/page";

vi.mock("@/components/sake/pages/taste-profile/taste-profile", () => ({ SakeTasteProfile: () => <div data-testid="page" /> }));

describe("/sake/taste-profile page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Taste Profile | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Seven questions. No wrong answers.")).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake/taste-profile");
    expect(metadata.robots).toMatchObject({ index: true, noarchive: true });
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
