import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/speaking/page";

vi.mock("@/components/sake/pages/speaking", () => ({ SakeSpeaking: () => <div data-testid="page" /> }));

describe("/sake/speaking page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Speaking Guide | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("The words you use shape the sake you tas")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/speaking");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
