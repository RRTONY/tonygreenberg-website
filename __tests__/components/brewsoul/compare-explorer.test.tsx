import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompareExplorer } from "@/components/brewsoul/compare-explorer";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";

const picker = () => screen.getByLabelText("Add a coffee to compare") as HTMLSelectElement;

describe("CompareExplorer", () => {
  it("starts empty with every coffee in the picker", () => {
    render(<CompareExplorer coffees={BREWSOUL_COFFEES} />);
    expect(screen.getByText("Select coffees above to start comparing.")).toBeInTheDocument();
    expect(picker().options).toHaveLength(BREWSOUL_COFFEES.length + 1);
  });

  it("adds a coffee to the table with its real scores and removes it from the picker", async () => {
    const user = userEvent.setup();
    render(<CompareExplorer coffees={BREWSOUL_COFFEES} />);
    const c = BREWSOUL_COFFEES[0];
    await user.selectOptions(picker(), c.id);
    const table = screen.getByRole("table");
    expect(within(table).getByRole("link", { name: c.name })).toHaveAttribute("href", `/brewsoul/coffee/${c.id}`);
    const s = computeToolScores(c);
    const qprRow = within(table).getByText("QPR").closest("tr")!;
    expect(qprRow).toHaveTextContent(s.qpr.toFixed(1));
    expect(within(table).getByText("Origin").closest("tr")).toHaveTextContent(c.originCountry);
    expect(picker().options).toHaveLength(BREWSOUL_COFFEES.length);
    expect(Array.from(picker().options).map((o) => o.value)).not.toContain(c.id);
  });

  it("caps the comparison at 4 coffees", async () => {
    const user = userEvent.setup();
    render(<CompareExplorer coffees={BREWSOUL_COFFEES} />);
    for (const c of BREWSOUL_COFFEES.slice(0, 5)) await user.selectOptions(picker(), c.id);
    expect(screen.getAllByRole("button", { name: /^Remove .* from comparison$/ })).toHaveLength(4);
    expect(within(screen.getByRole("table")).getAllByRole("link")).toHaveLength(4);
  });

  it("removes a coffee with its chip and returns to the empty state", async () => {
    const user = userEvent.setup();
    render(<CompareExplorer coffees={BREWSOUL_COFFEES} />);
    const c = BREWSOUL_COFFEES[2];
    await user.selectOptions(picker(), c.id);
    await user.click(screen.getByRole("button", { name: `Remove ${c.name} from comparison` }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("Select coffees above to start comparing.")).toBeInTheDocument();
  });
});
