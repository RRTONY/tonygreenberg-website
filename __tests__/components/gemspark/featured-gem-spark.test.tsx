import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedGemSpark } from "@/components/gemspark/featured-gem-spark";

describe("FeaturedGemSpark", () => {
  it("invites submissions when none are featured yet", () => {
    render(<FeaturedGemSpark sparks={[]} />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Featured GemSparks" })).toBeInTheDocument();
  });

  it("shows each featured story with its name, and location and tagline when given", () => {
    render(
      <FeaturedGemSpark
        sparks={[
          { id: "1", name: "Ana", story: "A wrong train, the right job.", tagline: "Detour", location: "Lisbon" },
          { id: "2", name: "Ben", story: "The song came on as I read the letter.", tagline: null, location: null },
        ]}
      />,
    );
    expect(screen.getByText("Founding GemSpark Spotters")).toBeInTheDocument();
    expect(screen.getByText("A wrong train, the right job.")).toBeInTheDocument();
    expect(screen.getByText("Lisbon")).toBeInTheDocument();
    expect(screen.getByText("Detour")).toBeInTheDocument();
    expect(screen.getByText("Ben")).toBeInTheDocument();
    expect(screen.queryByText("Coming Soon")).toBeNull();
  });
});
