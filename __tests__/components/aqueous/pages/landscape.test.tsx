import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Landscape, coCreators, consumerGuides } from "@/components/aqueous/pages/landscape";

vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: () => <button type="button">share</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("Landscape", () => {
  it("renders the hero, quadrant dots, additions and CTA links", () => {
    render(<Landscape />);
    expect(screen.getByRole("heading", { level: 1, name: /The Collective\s*Consciousness Map/ })).toBeInTheDocument();
    for (const cc of coCreators) expect(screen.getByRole("button", { name: cc.name })).toBeInTheDocument();
    expect(screen.getByText("Inverted Scale (1 = Perfect)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Begin the Journey/ })).toHaveAttribute("href", "/aqueous/gem-spark");
    expect(screen.getByRole("link", { name: "Open Integrity Protocol" })).toHaveAttribute("href", "/aqueous/integrity");
  });

  it("selects a dot by mouse or keyboard and shows its details; hover and focus show the name", () => {
    const { container } = render(<Landscape />);
    const ewg = screen.getByRole("button", { name: "EWG Tap Water Database" });

    fireEvent.mouseEnter(ewg);
    expect(container.querySelectorAll("svg text")).toHaveLength(13); // 8 quadrant + 2 axis labels, AQ, Aqueous, hovered name
    fireEvent.mouseLeave(ewg);
    fireEvent.focus(ewg);
    expect(container.querySelectorAll("svg text")).toHaveLength(13);
    fireEvent.blur(ewg);

    fireEvent.click(ewg);
    expect(ewg).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 4, name: "EWG Tap Water Database" })).toBeInTheDocument();
    expect(screen.getByText("pioneer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Visit/ })).toHaveAttribute("href", "https://ewg.org/tapwater");
    fireEvent.click(ewg);
    expect(screen.queryByRole("heading", { level: 4, name: "EWG Tap Water Database" })).toBeNull();

    const cr = screen.getByRole("button", { name: "Consumer Reports" });
    fireEvent.keyDown(cr, { key: "Enter" });
    expect(screen.getByText("legacy")).toBeInTheDocument();
    fireEvent.keyDown(cr, { key: " " });
    expect(screen.queryByText("legacy")).toBeNull();
    fireEvent.keyDown(cr, { key: "Tab" });
    expect(screen.queryByText("legacy")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Oasis Health App" }));
    expect(screen.getByText("builder")).toBeInTheDocument();
  });

  it("shows 12 guides, then all 25", () => {
    render(<Landscape />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(13);
    fireEvent.click(screen.getByRole("button", { name: /Show All 25/ }));
    expect(within(table).getAllByRole("row")).toHaveLength(consumerGuides.length + 1);
    expect(screen.queryByRole("button", { name: /Show All 25/ })).toBeNull();
    expect(within(table).getByRole("link", { name: "Water Filter Guru" })).toHaveAttribute("target", "_blank");
  });
});
