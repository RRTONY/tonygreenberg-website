import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/ichigo-ichie/page";

vi.mock("@/components/sake/pages/ichigo-ichie", () => ({ SakeIchigoIchie: () => <div data-testid="page" /> }));

describe("/sake/ichigo-ichie page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Ichi-go Ichi-e | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Every combination is unrepeatable. This ")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/ichigo-ichie");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
