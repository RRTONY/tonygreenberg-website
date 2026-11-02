import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AmericaUnbundledSeries } from "@/components/blog/america-unbundled-series";

describe("AmericaUnbundledSeries", () => {
  it("links both parts with a category and a summary", () => {
    render(<AmericaUnbundledSeries className="mb-10" />);
    expect(screen.getByRole("region", { name: "America, Unbundled series" })).toHaveClass("mb-10");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("America, Unbundled: Two-Part Series");
    const one = screen.getByRole("link", { name: /AI Does Not Have a Candidate/ });
    expect(one).toHaveAttribute("href", "/america-unbundled");
    expect(one).toHaveTextContent("Politics and AI · Part One");
    expect(one).toHaveTextContent(/independent civic grid/);
    const two = screen.getByRole("link", { name: /The Field Guide/ });
    expect(two).toHaveAttribute("href", "/america-unbundled-field-guide");
    expect(two).toHaveTextContent("Civic Governance · Part Two");
    expect(two).toHaveTextContent(/independent political infrastructure/);
  });
});
