import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/process/page";

vi.mock("@/components/sake/pages/process", () => ({ SakeProcess: () => <div data-testid="page" /> }));

describe("/sake/process page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Brewing Process | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Eight stages. Centuries of wisdom. A jou")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/process");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
