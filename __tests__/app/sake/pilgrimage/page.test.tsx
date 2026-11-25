import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/pilgrimage/page";

vi.mock("@/components/sake/pages/pilgrimage", () => ({ SakePilgrimage: () => <div data-testid="page" /> }));

describe("/sake/pilgrimage page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Pilgrimage | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Multi-day journeys through sake country. Each route includes transport, accommodation, and the bottles not on the regular menu.");
    expect(metadata.alternates?.canonical).toBe("/sake/pilgrimage");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
