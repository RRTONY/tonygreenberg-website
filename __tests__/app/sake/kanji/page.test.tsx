import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/kanji/page";

vi.mock("@/components/sake/pages/kanji-decoder", () => ({ SakeKanjiDecoder: () => <div data-testid="page" /> }));

describe("/sake/kanji page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Kanji Decoder | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("Every sake label is a coded message.")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/kanji");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
