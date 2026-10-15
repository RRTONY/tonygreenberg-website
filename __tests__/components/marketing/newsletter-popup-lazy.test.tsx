import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { NewsletterPopupLazy } from "@/components/marketing/newsletter-popup-lazy";

vi.mock("@/components/marketing/newsletter-popup", () => ({
  NewsletterPopup: () => <div data-testid="real-popup" />,
}));

describe("NewsletterPopupLazy", () => {
  it("loads the real NewsletterPopup", async () => {
    const { findByTestId } = render(<NewsletterPopupLazy />);
    expect(await findByTestId("real-popup", {}, { timeout: 5000 })).toBeInTheDocument();
  });
});
