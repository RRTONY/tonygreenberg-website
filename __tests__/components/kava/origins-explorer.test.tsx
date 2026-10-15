import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ISLANDS, OriginsExplorer } from "@/components/kava/origins-explorer";

describe("OriginsExplorer", () => {
  it("shows a button per island and no detail until one is picked", () => {
    render(<OriginsExplorer />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
    expect(screen.getByRole("button", { name: /Vanuatu ~3000 BCE/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("Vanuatu shows its facts, ceremony and safety note, but no cultivar", async () => {
    render(<OriginsExplorer />);
    await userEvent.click(screen.getByRole("button", { name: /Vanuatu/ }));
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Vanuatu");
    ISLANDS[0].facts.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument());
    expect(screen.getByText("Safety Note")).toBeInTheDocument();
    expect(screen.queryByText(/Key Cultivar/)).not.toBeInTheDocument();
  });

  it("Hawaii shows the Mo'i cultivar; picking it again closes it", async () => {
    render(<OriginsExplorer />);
    const hawaii = screen.getByRole("button", { name: /Hawaii/ });
    await userEvent.click(hawaii);
    expect(screen.getByText("Key Cultivar: Mo'i")).toBeInTheDocument();
    expect(hawaii.className).toContain("text-white");
    await userEvent.click(hawaii);
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("island data has unique ids and full literal classes", () => {
    expect(new Set(ISLANDS.map((i) => i.id)).size).toBe(ISLANDS.length);
    ISLANDS.forEach((i) => {
      expect(i.bgClass).toMatch(/^bg-/);
      expect(i.colorClass).toMatch(/^text-/);
      expect(i.facts.length).toBeGreaterThan(0);
    });
  });
});
