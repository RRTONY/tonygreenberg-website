import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/yeast/page";

vi.mock("@/components/sake/pages/yeast", () => ({ SakeYeast: () => <div data-testid="page" /> }));

describe("/sake/yeast page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Yeast Strains | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Association No. 7, No. 9, No. 14, No. 18. Plus wild flower yeasts captured from petals and house yeasts living in brewery walls. Each strain is a personality.");
    expect(metadata.alternates?.canonical).toBe("/sake/yeast");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
