import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PartnerQuotes } from "@/components/marketing/partner-quotes";

describe("PartnerQuotes", () => {
  it("shows three quotes by default, starting with Paul Sams", () => {
    const { container } = render(<PartnerQuotes />);
    expect(container.querySelectorAll("figure")).toHaveLength(3);
    expect(screen.getByText("Paul Sams")).toBeInTheDocument();
    expect(screen.getByText("COO, Blizzard Entertainment")).toBeInTheDocument();
    expect(screen.getByText(/most reliable global resource/)).toBeInTheDocument();
  });

  it("respects count and offset, and wraps around the list", () => {
    const { container } = render(<PartnerQuotes count={2} offset={18} />);
    const names = Array.from(container.querySelectorAll("figcaption > div:first-child")).map((d) => d.textContent);
    expect(names).toEqual(["Todd Miller", "Paul Sams"]);
  });
});
