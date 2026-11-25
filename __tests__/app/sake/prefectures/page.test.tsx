import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/prefectures/page";

vi.mock("@/components/sake/pages/prefectures", () => ({ SakePrefectures: () => <div data-testid="page" /> }));

describe("/sake/prefectures page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Prefectures | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("From Niigata's snow country")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/prefectures");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
