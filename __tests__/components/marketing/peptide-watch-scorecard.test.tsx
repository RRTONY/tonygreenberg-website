import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideWatchScorecard } from "@/components/marketing/peptide-watch-scorecard";
import { SCORECARD_CATEGORIES, SCORE_TIERS } from "@/lib/content/peptide-watch";

const card = (name: string) => screen.getByRole("heading", { name }).parentElement!;

describe("PeptideWatchScorecard", () => {
  it("lists every category and tier, with no total until something is scored", () => {
    render(<PeptideWatchScorecard />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(SCORECARD_CATEGORIES.length);
    for (const t of SCORE_TIERS) expect(screen.getByText(t.verdict)).toBeInTheDocument();
    expect(screen.queryByText(/\/ 50/)).not.toBeInTheDocument();
  });

  it("adds up the scores and counts the categories scored", async () => {
    const user = userEvent.setup();
    render(<PeptideWatchScorecard />);
    const [a, b] = SCORECARD_CATEGORIES;
    await user.click(within(card(a.name)).getByRole("button", { name: "5" }));
    await user.click(within(card(b.name)).getByRole("button", { name: "3" }));
    expect(screen.getByText("8 / 50")).toBeInTheDocument();
    expect(screen.getByText(`2 of ${SCORECARD_CATEGORIES.length} categories scored`)).toBeInTheDocument();
    await user.click(within(card(a.name)).getByRole("button", { name: "1" }));
    expect(screen.getByText("4 / 50")).toBeInTheDocument();
    expect(within(card(a.name)).getByRole("button", { name: "1" })).toHaveClass("bg-brand-gold");
  });
});
