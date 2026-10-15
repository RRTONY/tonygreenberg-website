import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoastersExplorer } from "@/components/brewsoul/roasters-explorer";
import { ROASTERS } from "@/lib/content/brewsoul-encyclopedia";

const cards = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("RoastersExplorer", () => {
  it("shows every roaster to begin with", () => {
    render(<RoastersExplorer roasters={ROASTERS} />);
    expect(cards()).toEqual(ROASTERS.map((r) => r.name));
  });

  it.each([
    ["legendary", (g: string) => g === "A"],
    ["exceptional", (g: string) => g === "B"],
    ["excellent", (g: string) => g === "C" || g === "D"],
  ])("the %s tier filter shows only matching grades", async (tier, match) => {
    const user = userEvent.setup();
    render(<RoastersExplorer roasters={ROASTERS} />);
    await user.selectOptions(screen.getByLabelText("Filter by tier"), tier);
    expect(cards()).toEqual(ROASTERS.filter((r) => match(r.overallGrade)).map((r) => r.name));
  });

  it("searches name and country together with the tier", async () => {
    const user = userEvent.setup();
    render(<RoastersExplorer roasters={ROASTERS} />);
    const country = ROASTERS[0].country;
    await user.type(screen.getByPlaceholderText("Search roasters..."), country.toLowerCase());
    const expected = ROASTERS.filter(
      (r) => r.name.toLowerCase().includes(country.toLowerCase()) || `${r.country} ${r.region || ""}`.toLowerCase().includes(country.toLowerCase()),
    );
    expect(cards()).toEqual(expected.map((r) => r.name));
    await user.type(screen.getByPlaceholderText("Search roasters..."), "zzzqqq");
    expect(cards()).toEqual([]);
  });

  it("shows grade, scores and the visit link", () => {
    render(<RoastersExplorer roasters={ROASTERS} />);
    const r = ROASTERS[0];
    expect(screen.getAllByText(`Grade ${r.overallGrade}`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`Quality: ${r.qualityScore}`).length).toBeGreaterThan(0);
    expect(screen.queryAllByRole("link", { name: /Visit/ })).toHaveLength(ROASTERS.filter((x) => x.url).length);
  });
});
