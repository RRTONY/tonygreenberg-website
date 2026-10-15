import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VarietiesExplorer } from "@/components/brewsoul/varieties-explorer";
import { VARIETIES } from "@/lib/content/brewsoul-encyclopedia";

const cards = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("VarietiesExplorer", () => {
  it("shows every variety before searching", () => {
    render(<VarietiesExplorer varieties={VARIETIES} />);
    expect(cards()).toEqual(VARIETIES.map((v) => v.name));
  });

  it("narrows by name, case-insensitively", async () => {
    const user = userEvent.setup();
    render(<VarietiesExplorer varieties={VARIETIES} />);
    const q = VARIETIES[0].name.slice(0, 4).toUpperCase();
    await user.type(screen.getByPlaceholderText("Search varieties..."), q);
    const expected = VARIETIES.filter((v) => v.name.toLowerCase().includes(q.toLowerCase()) || v.origin.toLowerCase().includes(q.toLowerCase()));
    expect(cards()).toEqual(expected.map((v) => v.name));
    expect(expected.length).toBeLessThan(VARIETIES.length);
  });

  it("matches on origin too", async () => {
    const user = userEvent.setup();
    render(<VarietiesExplorer varieties={VARIETIES} />);
    const origin = VARIETIES[0].origin;
    await user.type(screen.getByPlaceholderText("Search varieties..."), origin);
    expect(cards()).toContain(VARIETIES[0].name);
    expect(cards()).toEqual(VARIETIES.filter((v) => v.origin.toLowerCase().includes(origin.toLowerCase()) || v.name.toLowerCase().includes(origin.toLowerCase())).map((v) => v.name));
  });

  it("shows nothing for a search with no match", async () => {
    const user = userEvent.setup();
    render(<VarietiesExplorer varieties={VARIETIES} />);
    await user.type(screen.getByPlaceholderText("Search varieties..."), "zzzqqq");
    expect(cards()).toEqual([]);
  });
});
