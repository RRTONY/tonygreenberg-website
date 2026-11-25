import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/temperature/page";

vi.mock("@/components/sake/pages/temperature", () => ({ SakeTemperature: () => <div data-testid="page" /> }));

describe("/sake/temperature page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Temperature | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("The same sake transforms at every degree")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/temperature");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
