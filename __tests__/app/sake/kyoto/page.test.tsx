import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/kyoto/page";

vi.mock("@/components/sake/pages/kyoto", () => ({ SakeKyoto: () => <div data-testid="page" /> }));

describe("/sake/kyoto page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Kyoto Backstreets | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Forget the golden pavilion. Behind Ponto")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/kyoto");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
