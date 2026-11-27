import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/aging/page";

vi.mock("@/components/sake/pages/aging", () => ({ SakeAging: () => <div data-testid="page" /> }));

describe("/sake/aging page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Aging & Time | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("From crystal-clear shiboritate to near-b")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/aging");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
