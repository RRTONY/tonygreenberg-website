import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import AqueousHomePage, { metadata } from "@/app/aqueous/page";
import { AQUEOUS_SEO } from "@/lib/content/aqueous/seo";

vi.mock("@/components/aqueous/pages/home", () => ({ AqueousHome: () => <div data-testid="home" /> }));

describe("/aqueous page", () => {
  it("uses the app's home SEO and renders JSON-LD plus the home page", () => {
    expect(String(metadata.description)).toBe(AQUEOUS_SEO.home.description);
    expect(metadata.alternates?.canonical).toMatch(/\/aqueous$/);
    const { container, getByTestId } = render(<AqueousHomePage />);
    expect(getByTestId("home")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
