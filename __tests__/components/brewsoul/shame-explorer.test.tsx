import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShameExplorer } from "@/components/brewsoul/shame-explorer";
import { SHAME_ENTRIES } from "@/lib/content/brewsoul-encyclopedia";

const cards = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const cats = Array.from(new Set(SHAME_ENTRIES.map((s) => s.category)));

describe("ShameExplorer", () => {
  it("offers All plus each real category and shows every entry in rank order", () => {
    render(<ShameExplorer entries={SHAME_ENTRIES} />);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["All", ...cats]);
    expect(cards()).toEqual(SHAME_ENTRIES.map((s) => `#${s.rank} ${s.brand}`));
  });

  it.each(cats)("narrows to %s", async (cat) => {
    const user = userEvent.setup();
    render(<ShameExplorer entries={SHAME_ENTRIES} />);
    await user.click(screen.getByRole("button", { name: cat }));
    expect(cards()).toEqual(SHAME_ENTRIES.filter((s) => s.category === cat).map((s) => `#${s.rank} ${s.brand}`));
  });

  it("shows the evidence and the severity score", () => {
    render(<ShameExplorer entries={SHAME_ENTRIES} />);
    expect(screen.getByText(SHAME_ENTRIES[0].evidence)).toBeInTheDocument();
    expect(screen.getByText(`Severity: ${SHAME_ENTRIES[0].severity}/100`)).toBeInTheDocument();
  });
});
