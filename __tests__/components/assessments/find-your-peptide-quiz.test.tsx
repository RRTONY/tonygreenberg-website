import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourPeptideQuiz } from "@/components/assessments/find-your-peptide-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 10;
type User = ReturnType<typeof userEvent.setup>;
const choices = () => screen.getAllByRole("button").filter((b) => !/previous|journey|hide details/i.test(b.textContent ?? ""));

async function answer(user: User, picks: number[]) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`QUESTION ${i + 1} OF ${TOTAL}`)).toBeInTheDocument();
    expect(screen.getByText(`${i * 10}%`)).toBeInTheDocument();
    await user.click(choices()[picks[i]]);
  }
}
async function unlock(user: User) {
  await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
  await user.click(screen.getByRole("button", { name: "Unlock" }));
}

describe("FindYourPeptideQuiz", () => {
  it("Previous goes back and keeps the earlier choice highlighted", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(choices()).toHaveLength(5);
    await user.click(choices()[1]);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(`QUESTION 1 OF ${TOTAL}`)).toBeInTheDocument();
    expect(choices()[1].className).toContain("bg-brand-gold-light/12");
  });

  it("all first answers: The Rebuilder, readiness 22 with no flags; the gate unlocks without any network call", async () => {
    // Axis scores (raw / 15, capped at 100): recovery 40, vitality 60, cognitive 20, immune 13, others 7.
    // Readiness = average 22, no contraindication flags.
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(0));
    expect(screen.getByText("22/100")).toBeInTheDocument();
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Rebuilder");
    expect(screen.getByText("60/100")).toBeInTheDocument();
    expect(screen.getByText("Low readiness — physician consultation strongly recommended before starting")).toBeInTheDocument();
    expect(screen.queryByText(/contraindication flag/)).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-peptide", summary: "The Rebuilder", score: 22 }));
  });

  it("all last answers: seven contraindication flags take 56 points off readiness (to 5) and show the warning", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(4));
    expect(screen.getByText("5/100")).toBeInTheDocument();
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Vanguard");
    expect(screen.getByText(/7 contraindication flags detected/)).toBeInTheDocument();
  });

  it("Retake starts over from the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(1));
    await unlock(user);
    await user.click(await screen.findByRole("button", { name: /retake assessment/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  // The Catalyst (metabolic+cognitive), The Healer (recovery+immune) and The Sovereign
  // (vitality+longevity) use the same axis pair as an earlier profile, and the lookup ignores order.
  it.fails("BUG: three peptide profiles repeat an earlier profile's axis pair and can never be shown (metabolic-first, cognitive-second shows The Strategist, never The Catalyst)", async () => {
    // These answers give metabolic 87, cognitive 67, then vitality/immune 53.
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, [3, 2, 2, 0, 2, 3, 3, 3, 0, 1]);
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Catalyst");
  });
});
