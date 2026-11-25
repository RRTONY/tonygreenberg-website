import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/toji/page";

vi.mock("@/components/sake/pages/toji-lineage", () => ({ SakeTojiLineage: () => <div data-testid="page" /> }));

describe("/sake/toji page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Toji Lineage | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Five great guilds. Centuries of tradition. Each guild shaped a region's sake identity through philosophy, technique, and the water they mastered.");
    expect(metadata.alternates?.canonical).toBe("/sake/toji");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
