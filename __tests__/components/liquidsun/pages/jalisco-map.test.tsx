import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JaliscoMap } from "@/components/liquidsun/pages/jalisco-map";

describe("JaliscoMap", () => {
  it("starts on the intro and switches between the two regions by hover, click and keyboard", () => {
    render(<JaliscoMap />);
    expect(screen.getByRole("heading", { level: 1, name: "The Terroir Map" })).toBeVisible();
    const highlands = screen.getByRole("button", { name: "Los Altos, the Highlands" });
    const valley = screen.getByRole("button", { name: "El Valle, the Valley" });

    fireEvent.mouseEnter(highlands);
    expect(screen.getByRole("heading", { level: 2, name: "The Highlands" })).toBeInTheDocument();
    expect(screen.getByText("Red Clay (Iron Rich)")).toBeInTheDocument();
    expect(valley).toHaveClass("opacity-30");
    expect(highlands).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(valley);
    expect(screen.getByRole("heading", { level: 2, name: "The Valley" })).toBeInTheDocument();
    expect(highlands).toHaveClass("opacity-30");

    fireEvent.focus(highlands);
    expect(screen.getByText("Ocho")).toBeInTheDocument();
    fireEvent.keyDown(valley, { key: "Enter" });
    expect(screen.getByText("Black Volcanic")).toBeInTheDocument();
    fireEvent.keyDown(highlands, { key: " " });
    expect(screen.getByText("2,000m+")).toBeInTheDocument();
    fireEvent.keyDown(valley, { key: "a" });
    expect(screen.getByText("2,000m+")).toBeInTheDocument();
    expect(screen.getByTestId("ls-terroir-panel")).toHaveClass("animate-in");
  });
});
