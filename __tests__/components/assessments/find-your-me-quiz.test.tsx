import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourMeQuiz } from "@/components/assessments/find-your-me-quiz";
import { ARCHETYPES, DIMENSIONS, DIRECTORY, DIRECTORY_TOTAL, QUESTIONS, type Dimension } from "@/lib/content/find-your-me";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

type User = ReturnType<typeof userEvent.setup>;

// Expected result from the data: each dimension = sum / (times scored * 9), out of 10; highest wins.
function expectedArchetype(picks: number[]) {
  const sum: Record<string, number> = {};
  const count: Record<string, number> = {};
  for (const d of DIMENSIONS) {
    sum[d] = 0;
    count[d] = 0;
  }
  picks.forEach((ci, qi) => {
    for (const [d, w] of Object.entries(QUESTIONS[qi].choices[ci].dimensions)) {
      sum[d] += w ?? 0;
      count[d] += 1;
    }
  });
  const scores = DIMENSIONS.map((d) => [d, count[d] ? Math.min(10, Math.round((sum[d] / (count[d] * 9)) * 100) / 10) : 0] as [Dimension, number]);
  const top = [...scores].sort((a, b) => b[1] - a[1])[0][0];
  return ARCHETYPES.find((a) => a.id === top)!;
}

async function answerAll(user: User, picks: number[]) {
  await user.click(screen.getByRole("button", { name: /show me what i already know/i }));
  for (let qi = 0; qi < QUESTIONS.length; qi++) {
    expect(screen.getByText(`${qi + 1} / ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: QUESTIONS[qi].choices[picks[qi]].text }));
    await act(async () => vi.advanceTimersByTime(1000));
  }
}

describe("FindYourMeQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("the landing lists the whole directory and filters it by status and search", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Me");
    const firstLive = DIRECTORY.flatMap((s) => s.items).find((i) => i.status === "live")!;
    const firstComing = DIRECTORY.flatMap((s) => s.items).find((i) => i.status === "coming")!;
    expect(screen.getAllByText(firstLive.name).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Live" }));
    expect(screen.queryByText(firstComing.hook)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All" }));
    await user.type(screen.getByPlaceholderText("Search experiences..."), "zzzz-no-match");
    for (const s of DIRECTORY) for (const i of s.items) expect(screen.queryByText(i.hook)).not.toBeInTheDocument();
    expect(screen.getAllByText(String(DIRECTORY_TOTAL)).length).toBeGreaterThan(0);
  });

  it("Back on question 1 returns to the landing; Back later goes one question back", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /show me what i already know/i }));
    await user.click(screen.getByRole("button", { name: QUESTIONS[0].choices[0].text }));
    await act(async () => vi.advanceTimersByTime(1000));
    expect(screen.getByText(`2 / ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^back$/i }));
    expect(screen.getByText(`1 / ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^back$/i }));
    expect(screen.getByRole("button", { name: /show me what i already know/i })).toBeInTheDocument();
  });

  it.each([[0], [1], [2]])("always choice %i: shows the archetype the scoring gives and saves it", async (index) => {
    const picks = QUESTIONS.map((q) => Math.min(index, q.choices.length - 1));
    const expected = expectedArchetype(picks);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await answerAll(user, picks);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(expected.name);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-me", summary: expected.name }));
  });

  it("links the archetype's essays, using the real title when the page resolved one", async () => {
    const picks = QUESTIONS.map(() => 0);
    const expected = expectedArchetype(picks);
    const slug = expected.articles[0];
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{ [slug]: "A Real Essay Title" }} />);
    await answerAll(user, picks);
    const link = (await screen.findByText("A Real Essay Title")).closest("a")!;
    expect(link.getAttribute("href")).toContain(slug);
    const rabbit = screen.getByText("Rabbit Holes Worth Falling Into").parentElement!;
    expect(within(rabbit).getAllByRole("link")).toHaveLength(expected.articles.length);
  });

  it("Shuffle the Deck starts over", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await answerAll(user, QUESTIONS.map(() => 1));
    await user.click(await screen.findByRole("button", { name: /shuffle the deck/i }));
    expect(screen.getByRole("button", { name: /show me what i already know/i })).toBeInTheDocument();
  });
});
