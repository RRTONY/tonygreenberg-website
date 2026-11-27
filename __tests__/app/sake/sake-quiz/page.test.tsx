import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/sake-quiz/page";

vi.mock("@/components/sake/pages/sake-quiz/sake-quiz", () => ({ SakeQuiz: () => <div data-testid="page" /> }));

describe("/sake/sake-quiz page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Your Profile | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("This profile is a starting point")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/sake-quiz");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
