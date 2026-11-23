import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/dashboard/page";

vi.mock("@/components/aqueous/pages/dashboard", () => ({ Dashboard: () => <div data-testid="page-body" /> }));

describe("/aqueous/dashboard", () => {
  it("renders the ported page with the app's SEO copy", () => {
    const { container } = render(<Page />);
    expect(screen.getByTestId("page-body")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]') !== null).toBe(false);
    expect(metadata.title).toBe("Dashboard | Aqueous");
    expect(metadata.alternates?.canonical).toBe("/aqueous/dashboard");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
