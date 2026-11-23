import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/tap-water/page";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => null }));

describe("/aqueous/tap-water page", () => {
  it("uses the app's own title and description, with a canonical under /aqueous", () => {
    expect(JSON.stringify(metadata.title)).toContain("Tap Water Report");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/aqueous/tap-water");
  });

  it("renders the ported page with its structured data", () => {
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tap Water Lookup");
    expect(container.querySelector('script[type="application/ld+json"]')?.textContent).toContain("/aqueous/tap-water");
  });
});
