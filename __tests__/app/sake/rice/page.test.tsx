import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/rice/page";

vi.mock("@/components/sake/pages/rice", () => ({ SakeRice: () => <div data-testid="page" /> }));

describe("/sake/rice page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Rice Encyclopedia | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Every great sake begins with a grain of ")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/rice");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
