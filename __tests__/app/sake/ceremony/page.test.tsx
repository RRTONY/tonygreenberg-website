import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/ceremony/page";

vi.mock("@/components/sake/pages/ceremony", () => ({ SakeCeremony: () => <div data-testid="page" /> }));

describe("/sake/ceremony page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Ceremony | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Eight steps from purification")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/ceremony");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
