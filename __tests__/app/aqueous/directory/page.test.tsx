import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/aqueous/directory/page";

vi.mock("@/components/aqueous/pages/directory", () => ({ Directory: () => <div data-testid="page-body" /> }));

describe("/aqueous/directory", () => {
  it("renders the ported page with the app's SEO copy", () => {
    const { container } = render(<Page />);
    expect(screen.getByTestId("page-body")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]') !== null).toBe(true);
    expect(metadata.title).toBe("Site Directory | Aqueous");
    expect(metadata.alternates?.canonical).toBe("/aqueous/directory");
    expect(metadata.robots).toEqual(undefined);
  });
});
