import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoaChecklist, type CheckItem } from "@/components/marketing/coa-checklist";

const ITEMS: CheckItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  title: `Check ${i + 1}`,
  description: `Description ${i + 1}`,
  passLabel: `Pass ${i + 1}`,
}));

function setup() {
  render(<CoaChecklist items={ITEMS} />);
  return userEvent.setup();
}
const item = (n: number) => screen.getByRole("button", { name: new RegExp(`^${n}\\. Check ${n}`) });

describe("CoaChecklist", () => {
  it("starts at 0/7, Walk Away", () => {
    setup();
    expect(screen.getByText("0/7")).toBeInTheDocument();
    expect(screen.getByText("Walk Away")).toBeInTheDocument();
    expect(screen.getByText("Pass = Pass 1")).toBeInTheDocument();
  });

  it("moves through Red Flag, Questionable and Clean as items are checked", async () => {
    const user = setup();
    for (const n of [1, 2, 3]) await user.click(item(n));
    expect(screen.getByText("3/7")).toBeInTheDocument();
    expect(screen.getByText("Red Flag")).toBeInTheDocument();
    for (const n of [4, 5]) await user.click(item(n));
    expect(screen.getByText("Questionable")).toBeInTheDocument();
    for (const n of [6, 7]) await user.click(item(n));
    expect(screen.getByText("7/7")).toBeInTheDocument();
    expect(screen.getByText("Clean")).toBeInTheDocument();
  });

  it("clicking a checked item unchecks it", async () => {
    const user = setup();
    await user.click(item(1));
    expect(screen.getByText("1/7")).toBeInTheDocument();
    await user.click(item(1));
    expect(screen.getByText("0/7")).toBeInTheDocument();
  });
});
