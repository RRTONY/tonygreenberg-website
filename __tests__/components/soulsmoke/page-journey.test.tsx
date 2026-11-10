import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageJourney } from "@/components/soulsmoke/page-journey";

describe("PageJourney", () => {
  it("on the first page shows only Next, and the step count", () => {
    render(<PageJourney currentPath="/" />);
    expect(screen.getByText(/1 of 6/)).toBeInTheDocument();
    expect(screen.queryByText("PREVIOUS")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /NEXT\s*The Agaves/ })).toHaveAttribute(
      "href",
      "/soul-smoke/agave-encyclopedia",
    );
  });

  it("in the middle links back and forward", () => {
    render(<PageJourney currentPath="/ancestral-process" />);
    expect(screen.getByRole("link", { name: /PREVIOUS\s*The Agaves/ })).toHaveAttribute(
      "href",
      "/soul-smoke/agave-encyclopedia",
    );
    expect(screen.getByRole("link", { name: /NEXT\s*Find by Scent/ })).toHaveAttribute("href", "/soul-smoke/scent-finder");
  });

  it("on the last page offers to start over", () => {
    render(<PageJourney currentPath="/mexico-source" />);
    expect(screen.getByRole("link", { name: /START OVER\s*Return Home/ })).toHaveAttribute("href", "/soul-smoke");
    expect(screen.getByRole("link", { name: "1 of 6: Home" })).toHaveAttribute("href", "/soul-smoke");
  });
});
