import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GemSparkCard } from "@/components/blog/gem-spark-card";

describe("GemSparkCard", () => {
  it("uses the anchor id for the Contents jump and labels the section by its title", () => {
    render(
      <GemSparkCard anchorId="gemspark" subtitle="The Taxi Driver">
        <p>A real encounter.</p>
      </GemSparkCard>,
    );
    const section = screen.getByRole("region", { name: "The Taxi Driver" });
    expect(section).toHaveAttribute("id", "gemspark");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "gemspark-title");
    expect(screen.getByText("A real encounter.")).toBeInTheDocument();
  });

  it("falls back to 'GemSpark' with no subtitle", () => {
    render(<GemSparkCard>body</GemSparkCard>);
    expect(screen.getByRole("heading", { level: 2, name: "GemSpark" })).toBeInTheDocument();
  });

  it("explains what a GemSpark is in a popover with a read-more link", async () => {
    const user = userEvent.setup();
    render(<GemSparkCard>body</GemSparkCard>);
    await user.click(screen.getByRole("button", { name: "What is this?" }));
    expect(await screen.findByRole("link", { name: /read more about serendipity/i })).toHaveAttribute(
      "href",
      "/blog/the-molecule-as-mirror-from-substance-to-service",
    );
  });
});
