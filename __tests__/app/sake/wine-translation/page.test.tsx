import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/wine-translation/page";

vi.mock("@/components/sake/pages/wine-translation", () => ({ SakeWineTranslation: () => <div data-testid="page" /> }));

describe("/sake/wine-translation page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Sake ↔ Wine | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Daiginjo ≈ Riesling Spätlese. Yamahai ≈ Natural Burgundy. Koshu ≈ Amontillado. A translation guide between two worlds.");
    expect(metadata.alternates?.canonical).toBe("/sake/wine-translation");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
