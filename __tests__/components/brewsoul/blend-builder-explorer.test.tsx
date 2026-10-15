import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlendBuilderExplorer } from "@/components/brewsoul/blend-builder-explorer";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";

const picker = () => screen.getByLabelText("Add a coffee to the blend") as HTMLSelectElement;
const score = (label: string) => screen.getByText(label).previousElementSibling?.textContent;

describe("BlendBuilderExplorer", () => {
  it("shows no blend profile until a coffee is added", () => {
    render(<BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />);
    expect(screen.queryByText(/Blend Profile/)).not.toBeInTheDocument();
  });

  it("a single coffee at 100% scores exactly like that coffee", async () => {
    const user = userEvent.setup();
    render(<BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />);
    const c = BREWSOUL_COFFEES[0];
    await user.selectOptions(picker(), c.id);
    const s = computeToolScores(c);
    expect(screen.getByText("Total: 100%")).toBeInTheDocument();
    expect(score("QPR")).toBe(s.qpr.toFixed(1));
    expect(score("Overall")).toBe(s.overall.toFixed(1));
  });

  it("weights two coffees by their ratio and flags a total that isn't 100%", async () => {
    const user = userEvent.setup();
    render(<BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />);
    const [a, b] = BREWSOUL_COFFEES;
    await user.selectOptions(picker(), a.id);
    await user.selectOptions(picker(), b.id);
    expect(screen.getByText("Total: 150% (adjust to 100%)")).toBeInTheDocument();
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "75" } });
    fireEvent.change(sliders[1], { target: { value: "25" } });
    expect(screen.getByText("Total: 100%")).toBeInTheDocument();
    const sa = computeToolScores(a);
    const sb = computeToolScores(b);
    expect(score("QPR")).toBe((sa.qpr * 0.75 + sb.qpr * 0.25).toFixed(1));
    expect(score("Wow Factor")).toBe((sa.wow * 0.75 + sb.wow * 0.25).toFixed(1));
  });

  it("allows at most 5 coffees and removes one on request", async () => {
    const user = userEvent.setup();
    render(<BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />);
    for (const c of BREWSOUL_COFFEES.slice(0, 6)) await user.selectOptions(picker(), c.id);
    expect(screen.getAllByRole("slider")).toHaveLength(5);
    await user.click(screen.getAllByRole("button", { name: "Remove from blend" })[0]);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
    expect(screen.queryByText(BREWSOUL_COFFEES[0].name)).not.toBeInTheDocument();
  });

  it("puts the blend's name in the profile heading", async () => {
    const user = userEvent.setup();
    render(<BlendBuilderExplorer coffees={BREWSOUL_COFFEES} />);
    await user.type(screen.getByPlaceholderText("Name your blend..."), "Morning Fog");
    await user.selectOptions(picker(), BREWSOUL_COFFEES[0].id);
    expect(screen.getByText('Blend Profile: "Morning Fog"')).toBeInTheDocument();
  });
});
