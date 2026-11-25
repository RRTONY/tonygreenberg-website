import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/fushimi/page";

vi.mock("@/components/sake/pages/fushimi", () => ({ SakeFushimi: () => <div data-testid="page" /> }));

describe("/sake/fushimi page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Fushimi | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("The second-largest sake district in Japan, hidden in southern Kyoto.");
    expect(metadata.alternates?.canonical).toBe("/sake/fushimi");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
