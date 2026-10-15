import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssessmentQuiz } from "@/components/kava/assessment-quiz";

// The results bar saves to Supabase and prints; replaced so we can see what it was given.
vi.mock("@/components/assessments/result-actions", () => ({
  AssessmentResultActions: (p: { resultSlug?: string; resultSummary?: string; resultScore?: number }) => (
    <div data-testid="result-actions" data-slug={p.resultSlug} data-summary={p.resultSummary} data-score={p.resultScore} />
  ),
}));

type User = ReturnType<typeof userEvent.setup>;

// Click a choice for the question whose text matches.
async function choose(user: User, question: string, option: string) {
  const card = screen.getByText(question).parentElement!;
  await user.click(within(card).getByRole("button", { name: new RegExp(`^${option.replace(/[()+]/g, "\\$&")}`) }));
}
async function yesToAll(user: User) {
  for (const b of screen.queryAllByRole("button", { name: "Yes" })) await user.click(b);
}
const next = (user: User) => user.click(screen.getByRole("button", { name: /Next Domain/ }));

describe("Kava PRI AssessmentQuiz", () => {
  it("opens on domain 1 of 5 with Previous disabled", () => {
    render(<AssessmentQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("PRI Assessment");
    expect(screen.getByText("Domain 1 of 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Somatic Readiness" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Previous/ })).toBeDisabled();
  });

  it("Next, Previous and the domain tabs move between domains", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await next(user);
    expect(screen.getByRole("heading", { level: 2, name: "Psychological Readiness" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Previous/ }));
    expect(screen.getByRole("heading", { level: 2, name: "Somatic Readiness" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    expect(screen.getByText("Domain 5 of 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Results" })).toBeInTheDocument();
  });

  it("with no answers scores 0 and NOT READY", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    await user.click(screen.getByRole("button", { name: "View Results" }));
    expect(screen.getByText("NOT READY")).toBeInTheDocument();
    expect(screen.getByText("Significant support intervention needed before PRI pathway continues.")).toBeInTheDocument();
    expect(screen.getByTestId("result-actions")).toHaveAttribute("data-score", "0");
  });

  it("best answers everywhere score 93 (CLEARED) with the right domain breakdown", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await yesToAll(user);
    await choose(user, "Kava response in Stage 1 diagnostic session:", "Grounded");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava session depth:", "Accessed genuine emotional depth");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava circle group coherence:", "Achieved fully");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava ceremony quality:", "Honors lineage correctly");
    await next(user);
    await yesToAll(user);
    await user.click(screen.getByRole("button", { name: "View Results" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Results");
    expect(screen.getByText("93")).toBeInTheDocument();
    expect(screen.getByText("CLEARED")).toBeInTheDocument();
    expect(screen.getByText("Proceed to journey.")).toBeInTheDocument();
    const row = (name: string) => screen.getByRole("heading", { level: 4, name }).parentElement!;
    expect(row("Somatic Readiness")).toHaveTextContent("22 / 25");
    expect(row("Psychological Readiness")).toHaveTextContent("21 / 25");
    expect(row("Relational & Collective Readiness")).toHaveTextContent("20 / 20");
    expect(row("Cultural & Ceremonial Alignment")).toHaveTextContent("15 / 15");
    expect(row("Integration Architecture")).toHaveTextContent("15 / 15");
    const actions = screen.getByTestId("result-actions");
    expect(actions).toHaveAttribute("data-slug", "kava-assessment");
    expect(actions).toHaveAttribute("data-summary", "CLEARED");
    expect(actions).toHaveAttribute("data-score", "93");
  });

  it("a negative scale answer can't take a domain below 0", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await choose(user, "Kava response in Stage 1 diagnostic session:", "Dysregulated");
    await next(user);
    await choose(user, "Intention formulated clearly and written down?", "Yes");
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    await user.click(screen.getByRole("button", { name: "View Results" }));
    expect(screen.getByRole("heading", { level: 4, name: "Somatic Readiness" }).parentElement).toHaveTextContent("0 / 25");
    expect(screen.getByTestId("result-actions")).toHaveAttribute("data-score", "4");
  });

  it.each([
    // somatic yes x5 (18) + grounded 4 = 22; psych yes (13) + depth 8 = 21; relational yes x3 (12) + partial 4 = 16 -> 59
    ["DEFER", 59, "Partial"],
  ])("lands in %s at %i", async (rec, score, coherence) => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await yesToAll(user);
    await choose(user, "Kava response in Stage 1 diagnostic session:", "Grounded");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava session depth:", "Accessed genuine emotional depth");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava circle group coherence:", coherence);
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    await user.click(screen.getByRole("button", { name: "View Results" }));
    expect(screen.getByText(rec)).toBeInTheDocument();
    expect(screen.getByTestId("result-actions")).toHaveAttribute("data-score", String(score));
  });

  it("gives CONDITIONAL between 70 and 84", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await yesToAll(user);
    await choose(user, "Kava response in Stage 1 diagnostic session:", "Grounded");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava session depth:", "Accessed genuine emotional depth");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava circle group coherence:", "Achieved fully");
    await next(user);
    await yesToAll(user);
    await choose(user, "Kava ceremony quality:", "Honors lineage correctly");
    // 22 + 21 + 20 + 15 = 78, integration left blank
    await next(user);
    await user.click(screen.getByRole("button", { name: "View Results" }));
    expect(screen.getByText("CONDITIONAL")).toBeInTheDocument();
    expect(screen.getByTestId("result-actions")).toHaveAttribute("data-score", "78");
  });

  it("Start Over clears every answer and returns to domain 1", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await yesToAll(user);
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    await user.click(screen.getByRole("button", { name: "View Results" }));
    await user.click(screen.getByRole("button", { name: /Start Over/ }));
    expect(screen.getByText("Domain 1 of 5")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Integration Architecture/ }));
    await user.click(screen.getByRole("button", { name: "View Results" }));
    expect(screen.getByTestId("result-actions")).toHaveAttribute("data-score", "0");
  });

  it.fails("BUG: answering the 0-point question p4 ('Previous altered state experience?') highlights both Yes and No", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await next(user);
    const card = screen.getByText("Previous altered state experience? (context, not scored)").parentElement!;
    await user.click(within(card).getByRole("button", { name: "Yes" }));
    const yes = within(card).getByRole("button", { name: "Yes" });
    const no = within(card).getByRole("button", { name: "No" });
    expect(yes.className).not.toBe(no.className);
  });
});
