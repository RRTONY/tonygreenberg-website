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
    // Essays the page couldn't find in Sanity are left out, never shown as a raw slug.
    const rabbit = screen.getByText("Rabbit Holes Worth Falling Into").parentElement!;
    expect(within(rabbit).getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByText(expected.articles[1])).not.toBeInTheDocument();
  });

  it("hides the essay block when none of the result's essays exist", async () => {
    const picks = QUESTIONS.map(() => 0);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await answerAll(user, picks);
    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByText("Rabbit Holes Worth Falling Into")).not.toBeInTheDocument();
  });

  it("Shuffle the Deck starts over", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await answerAll(user, QUESTIONS.map(() => 1));
    await user.click(await screen.findByRole("button", { name: /shuffle the deck/i }));
    expect(screen.getByRole("button", { name: /show me what i already know/i })).toBeInTheDocument();
  });

  it("a wound card's Browse button scrolls to its directory section and highlights it for 3 seconds", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    const section = () => screen.getByRole("heading", { level: 3, name: "Love & Belonging" }).parentElement!.parentElement!;
    expect(section().className).not.toContain("shadow-");
    const scroll = vi.mocked(Element.prototype.scrollIntoView);
    scroll.mockClear();
    await user.click(screen.getAllByRole("button", { name: /browse love & belonging/i })[0]);
    expect(section().className).toContain("shadow-");
    expect(scroll).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    await act(async () => vi.advanceTimersByTime(3000));
    expect(section().className).not.toContain("shadow-");
  });

  it("a second click while the answer is moving on is ignored (no skipped question)", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /show me what i already know/i }));
    await user.click(screen.getByRole("button", { name: QUESTIONS[0].choices[0].text }));
    await act(async () => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: QUESTIONS[0].choices[1].text })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: QUESTIONS[0].choices[1].text }));
    await act(async () => vi.advanceTimersByTime(2000));
    expect(screen.getByText(`2 / ${QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("the share buttons post the archetype's share text and count toward 10 shares", async () => {
    const picks = QUESTIONS.map(() => 0);
    const expected = expectedArchetype(picks);
    const open = vi.fn();
    vi.stubGlobal("open", open);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<FindYourMeQuiz articleTitles={{}} />);
    await answerAll(user, picks);
    const url = "https://tonygreenberg.com/find-your-me";
    await user.click(await screen.findByRole("button", { name: "Share on X" }));
    expect(open).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(expected.shareText)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
    expect(screen.getByText("1 of 10 shared · 9 to go")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Share on LinkedIn" }));
    expect(open).toHaveBeenLastCalledWith(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    await user.click(screen.getByRole("button", { name: "Share by email" }));
    expect(open).toHaveBeenLastCalledWith(
      `mailto:?subject=${encodeURIComponent(`Find My — ${expected.name}`)}&body=${encodeURIComponent(`${expected.shareText}\n\n${url}`)}`,
      "_blank",
    );
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith(`${expected.shareText}\n\n${url}`);
    expect(screen.getByText("4 of 10 shared · 6 to go")).toBeInTheDocument();
    for (let i = 0; i < 6; i++) await user.click(screen.getByRole("button", { name: "Share on LinkedIn" }));
    expect(screen.getByText("10 of 10 shared · You're a Tribe Weaver already")).toBeInTheDocument();
  });
});
