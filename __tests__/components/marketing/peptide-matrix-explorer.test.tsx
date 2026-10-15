import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideMatrixExplorer } from "@/components/marketing/peptide-matrix-explorer";
import { ENTITIES } from "@/lib/content/peptide-matrix";

const bodyRows = () => within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");

describe("PeptideMatrixExplorer", () => {
  it("ranks every entity by gap, largest first", () => {
    render(<PeptideMatrixExplorer />);
    expect(screen.getByRole("heading", { level: 2, name: "All Entities Ranked" })).toBeInTheDocument();
    const rows = bodyRows();
    expect(rows).toHaveLength(ENTITIES.length);
    const ranked = [...ENTITIES].sort((a, b) => b.gap - a.gap);
    expect(rows[0].firstElementChild).toHaveTextContent(ranked[0].name);
    expect(rows.at(-1)!.firstElementChild).toHaveTextContent(ranked.at(-1)!.name);
  });

  it("clicking a row opens that entity's detail card", async () => {
    render(<PeptideMatrixExplorer />);
    const entity = [...ENTITIES].sort((a, b) => b.gap - a.gap)[0];
    await userEvent.setup().click(bodyRows()[0]);
    expect(screen.getByRole("heading", { level: 3, name: entity.name })).toBeInTheDocument();
    expect(screen.getAllByText(`${entity.riskLevel} RISK`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`${entity.evidence}/100`).length).toBeGreaterThan(0);
    expect(bodyRows()[0]).toHaveClass("bg-brand-gold/10");
  });

  it("the matrix panel collapses and reopens", async () => {
    const user = userEvent.setup();
    const { container } = render(<PeptideMatrixExplorer />);
    const toggle = screen.getByRole("button", { name: /Interactive Matrix/ });
    expect(container.querySelector("canvas")).not.toBeNull();
    await user.click(toggle);
    expect(container.querySelector("canvas")).toBeNull();
    await user.click(toggle);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
