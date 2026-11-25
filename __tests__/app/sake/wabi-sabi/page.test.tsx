import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/wabi-sabi/page";

vi.mock("@/components/sake/pages/wabi-sabi", () => ({ SakeWabiSabi: () => <div data-testid="page" /> }));

describe("/sake/wabi-sabi page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Wabi-Sabi | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Not \"rate this sake 92 points.\" Sit with")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/wabi-sabi");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
