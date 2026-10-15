import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, Frame, outlineButton, primaryButton } from "@/components/post-intervention/components/frame";

describe("post-intervention Frame and Card", () => {
  it("shows the eyebrow, one H1 title, the sub line and children", () => {
    render(
      <Frame eyebrow="Eyebrow" title="The Title" sub="Sub line">
        <p>child</p>
      </Frame>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Title");
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByText("Sub line")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("switches the header band to green when done", () => {
    const { container, rerender } = render(<Frame eyebrow="e" title="t" sub="s">x</Frame>);
    expect(container.querySelector("header")?.className).toContain("from-[#78350F]");
    rerender(<Frame done eyebrow="e" title="t" sub="s">x</Frame>);
    expect(container.querySelector("header")?.className).toContain("from-[#065F46]");
  });

  it("Card shows an H2 only when given a title", () => {
    const { rerender } = render(<Card title="Scores">body</Card>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Scores");
    rerender(<Card>body</Card>);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("buttons are at least 48px tall", () => {
    expect(primaryButton).toContain("min-h-12");
    expect(outlineButton).toContain("min-h-12");
  });
});
