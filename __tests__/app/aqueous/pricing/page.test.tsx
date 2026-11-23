import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/pricing/page";

vi.mock("@/components/aqueous/pages/pricing", () => ({ Pricing: () => <div data-testid="page-body" /> }));

describe("/aqueous/pricing", () => {
  it("renders the ported page with the app's SEO copy", () => {
    const { container } = render(<Page />);
    expect(screen.getByTestId("page-body")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]') !== null).toBe(true);
    expect(metadata.title).toBe("Pricing | Aqueous");
    expect(metadata.alternates?.canonical).toBe("/aqueous/pricing");
    expect(metadata.robots).toEqual(undefined);
  });
});
