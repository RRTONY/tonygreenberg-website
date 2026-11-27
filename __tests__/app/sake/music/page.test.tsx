import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/music/page";

vi.mock("@/components/sake/pages/music", () => ({ SakeMusic: () => <div data-testid="page" /> }));

describe("/sake/music page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Music Pairing | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("Daiginjo with Ryuichi Sakamoto. Nigori with Boris. Koshu with Coltrane. Curated cross-sensory pairings where sound meets liquid.");
    expect(metadata.alternates?.canonical).toBe("/sake/music");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
