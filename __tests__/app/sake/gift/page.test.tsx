import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/gift/page";

vi.mock("@/components/sake/pages/gift", () => ({ SakeGift: () => <div data-testid="page" /> }));

describe("/sake/gift page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Gift Protocol | Sake for Sake's Sake™" });
    expect(String(metadata.description)).toBe("The art of giving sake in Japan. Which bottles for which occasions. The wrapping. The social choreography that turns a bottle into a message.");
    expect(metadata.alternates?.canonical).toBe("/sake/gift");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
