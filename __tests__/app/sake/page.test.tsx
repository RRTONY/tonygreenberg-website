import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/page";
import { SAKE_HOME_DESCRIPTION, SAKE_HOME_TITLE } from "@/lib/content/sake/seo";

vi.mock("@/components/sake/pages/home", () => ({ SakeHome: () => <div data-testid="page" /> }));

describe("/sake page", () => {
  it("uses the app's site title and description, and renders JSON-LD plus the home page", () => {
    expect(metadata.title).toEqual({ absolute: SAKE_HOME_TITLE });
    // The shared SEO helper cuts descriptions to 160 characters at a word.
    expect(SAKE_HOME_DESCRIPTION.startsWith(String(metadata.description).replace(/…$/, "").trim())).toBe(true);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe("/sake");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
