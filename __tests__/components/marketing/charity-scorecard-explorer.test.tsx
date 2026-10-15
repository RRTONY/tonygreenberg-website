import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharityScorecardExplorer } from "@/components/marketing/charity-scorecard-explorer";
import { ALL_SECTORS, CHARITIES, EVALUATORS, SCORE_DIMENSIONS } from "@/lib/content/charity-data";

// Charity names shown in the rankings list, in order.
const shownNames = () =>
  Array.from(document.querySelectorAll("span.text-sm.font-medium"))
    .map((s) => s.textContent)
    .filter((n): n is string => CHARITIES.some((c) => c.name === n));

function setup() {
  render(<CharityScorecardExplorer />);
  return userEvent.setup();
}

describe("CharityScorecardExplorer", () => {
  it("shows the top 25 by score with a Show More button", async () => {
    const user = setup();
    expect(screen.getByText(`Showing 25 of ${CHARITIES.length} charities`)).toBeInTheDocument();
    expect(shownNames().slice(0, 3)).toEqual(CHARITIES.slice(0, 3).map((c) => c.name));
    await user.click(screen.getByRole("button", { name: `Show More (${CHARITIES.length - 25} remaining)` }));
    expect(screen.getByText(`Showing 50 of ${CHARITIES.length} charities`)).toBeInTheDocument();
  });

  it("searches by name and filters by sector", async () => {
    const user = setup();
    await user.type(screen.getByPlaceholderText(/Search charities/), "givedirectly");
    expect(shownNames()).toEqual(["GiveDirectly"]);
    await user.clear(screen.getByPlaceholderText(/Search charities/));
    const sector = ALL_SECTORS[0];
    await user.selectOptions(screen.getByLabelText("Filter by sector"), sector);
    expect(shownNames()).toHaveLength(CHARITIES.filter((c) => c.sector === sector).length);
    expect(screen.getByText(/Showing/)).toHaveTextContent(`in ${sector}`);
  });

  it("sorts by name, toggling direction on a second click", async () => {
    const user = setup();
    const sorted = [...CHARITIES].map((c) => c.name).sort((a, b) => a.localeCompare(b));
    await user.click(screen.getByRole("button", { name: /^Charity/ }));
    expect(shownNames()[0]).toBe(sorted[0]);
    await user.click(screen.getByRole("button", { name: /^Charity/ }));
    expect(shownNames()[0]).toBe(sorted.at(-1));
  });

  it.fails("BUG: the first click on the Score column sorts highest score first", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Score" }));
    expect(shownNames()[0]).toBe(CHARITIES[0].name);
  });

  it("expands a charity to its breakdown and profile link", async () => {
    const user = setup();
    const top = CHARITIES[0];
    await user.click(screen.getByRole("button", { name: new RegExp(top.name) }));
    expect(screen.getByText("Score Breakdown")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Full Profile/ })).toHaveAttribute("href", `/charity-scorecard/${top.slug}`);
    expect(screen.getByRole("link", { name: /Website/ })).toHaveAttribute("href", top.website);
  });

  it("keeps the Scorecard and Evaluators tabs in the HTML and switches between them", async () => {
    const user = setup();
    const scorecard = screen.getByRole("heading", { name: "The Unified Impact Scorecard" });
    expect(scorecard.closest(".hidden")).not.toBeNull();
    for (const d of SCORE_DIMENSIONS) expect(screen.getByRole("heading", { level: 3, name: d.label })).toBeInTheDocument();
    for (const ev of EVALUATORS) expect(screen.getByRole("heading", { level: 3, name: ev.name })).toBeInTheDocument();
    const nav = screen.getByRole("navigation");
    await user.click(within(nav).getByRole("button", { name: "Scorecard" }));
    expect(scorecard.closest(".hidden")).toBeNull();
    await user.click(within(nav).getByRole("button", { name: "Evaluators" }));
    expect(screen.getByRole("heading", { name: "The Evaluator Landscape" }).closest(".hidden")).toBeNull();
    expect(scorecard.closest(".hidden")).not.toBeNull();
  });
});
