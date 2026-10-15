import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChainsExplorer } from "@/components/brewsoul/chains-explorer";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

const ALL = CHAIN_RANKINGS;
const names = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const tierButton = (t: string) => screen.getByRole("button", { name: new RegExp(`^${t} \\(\\d+\\)$`) });

describe("ChainsExplorer", () => {
  it("shows every chain in rank order with the real tier counts", () => {
    render(<ChainsExplorer chains={ALL} />);
    expect(screen.getByText(`Showing ${ALL.length} of ${ALL.length} chains`)).toBeInTheDocument();
    expect(names()).toEqual(ALL.map((c) => c.name));
    for (const t of ["S", "A", "B", "C", "D", "F"]) {
      expect(tierButton(t)).toHaveTextContent(`(${ALL.filter((c) => c.tier === t).length})`);
    }
  });

  it("filters by tier, and clicking the same tier again clears it", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    await user.click(tierButton("A"));
    expect(names()).toEqual(ALL.filter((c) => c.tier === "A").map((c) => c.name));
    await user.click(tierButton("A"));
    expect(names()).toHaveLength(ALL.length);
  });

  it("combines the type filter with the tier filter", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    await user.click(screen.getByRole("button", { name: "Fast Food" }));
    expect(names()).toEqual(ALL.filter((c) => c.type === "fast-food").map((c) => c.name));
    await user.click(tierButton("D"));
    const expected = ALL.filter((c) => c.type === "fast-food" && c.tier === "D");
    expect(screen.getByText(`Showing ${expected.length} of ${ALL.length} chains`)).toBeInTheDocument();
  });

  it("searches name, HQ and verdict, and says when nothing matches", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    const box = screen.getByPlaceholderText("Search chains by name, location, or keyword...");
    await user.type(box, "seattle");
    const expected = ALL.filter((c) => [c.name, c.hq, c.verdict].some((s) => s.toLowerCase().includes("seattle")));
    expect(expected.length).toBeGreaterThan(0);
    expect(names()).toEqual(expected.map((c) => c.name));
    await user.clear(box);
    await user.type(box, "zzzqqq");
    expect(screen.getByText("No chains match your filters. Try adjusting your criteria.")).toBeInTheDocument();
  });

  it("expands one chain at a time to show its scores, strengths and website", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    const [first, second] = ALL;
    expect(screen.queryByText("Strengths")).not.toBeInTheDocument();
    await user.click(screen.getByText(first.name));
    expect(screen.getByText("Strengths")).toBeInTheDocument();
    expect(screen.getByText(first.strengths[0])).toBeInTheDocument();
    expect(screen.getByText(`Signature: ${first.signatureDrink}`)).toBeInTheDocument();
    await user.click(screen.getByText(second.name));
    expect(screen.queryByText(first.strengths[0])).not.toBeInTheDocument();
    expect(screen.getAllByText("Strengths")).toHaveLength(1);
  });

  it("opening the website link doesn't collapse the card", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    const withSite = ALL.find((c) => c.website)!;
    await user.click(screen.getByText(withSite.name));
    const visit = screen.getByRole("link", { name: /Visit/ });
    expect(visit).toHaveAttribute("href", withSite.website);
    visit.addEventListener("click", (e) => e.preventDefault());
    await user.click(visit);
    expect(screen.getByText("Strengths")).toBeInTheDocument();
  });

  it("a chain card can be expanded from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ChainsExplorer chains={ALL} />);
    await user.tab();
    for (let i = 0; i < 20 && !document.activeElement?.textContent?.includes(ALL[0].verdict); i++) await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Strengths")).toBeInTheDocument();
  });
});
