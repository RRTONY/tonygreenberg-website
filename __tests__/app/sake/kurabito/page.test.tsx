import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { metadata } from "@/app/sake/kurabito/page";

vi.mock("@/components/sake/pages/kurabito", () => ({ SakeKurabito: () => <div data-testid="page" /> }));

describe("/sake/kurabito page", () => {
  it("has its own title, description and canonical, and renders JSON-LD plus the page", () => {
    expect(metadata.title).toEqual({ absolute: "Kurabito Diaries | Sake for Sake's Sake™" });
    expect(String(metadata.description).startsWith("They leave their families in October and")).toBe(true);
    expect(metadata.alternates?.canonical).toBe("/sake/kurabito");
    const { container, getByTestId } = render(<Page />);
    expect(getByTestId("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
