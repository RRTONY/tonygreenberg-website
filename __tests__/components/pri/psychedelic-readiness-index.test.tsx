import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PsychedelicReadinessIndex } from "@/components/pri/psychedelic-readiness-index";
import { saveAssessmentResult } from "@/lib/assessments/result-log";
import { submitPriConsent } from "@/app/forms/actions";
import { DIM_LABELS, MEDICINES, PATHWAY_QUESTIONS, QUESTIONS, SLIDER_LABELS, type DimKey } from "@/lib/content/pri-data";
import { computeScores } from "@/lib/content/pri-shared";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));
vi.mock("@/app/forms/actions", () => ({ submitPriConsent: vi.fn(), submitPriCorrection: vi.fn() }));
const saved = vi.mocked(saveAssessmentResult);

type User = ReturnType<typeof userEvent.setup>;
const button = (name: string | RegExp) => screen.getByRole("button", { name });

async function startQuiz(user: User) {
  await user.click(button(/see where you actually stand/i));
  await user.click(button(new RegExp(`begin ${QUESTIONS.length}-question assessment`, "i")));
}

// Answers every readiness question (value per question index) and every pathway question.
// fireEvent rather than userEvent for the 60-odd slider steps: this page is
// large, and userEvent's per-click pointer simulation makes the walk-through slow.
async function finishQuiz(value: (i: number) => number) {
  for (let i = 0; i < QUESTIONS.length; i++) {
    expect(screen.getByText(`${i + 1} / ${QUESTIONS.length}`)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider"), { target: { value: String(value(i)) } });
    fireEvent.click(button(i === QUESTIONS.length - 1 ? /a few more questions/i : /^next$/i));
  }
  expect(screen.getByRole("heading", { name: "How You Want to Go" })).toBeInTheDocument();
  for (let i = 0; i < PATHWAY_QUESTIONS.length; i++) {
    fireEvent.click(button(i === PATHWAY_QUESTIONS.length - 1 ? /see my results/i : /^next$/i));
  }
}

async function consent(user: User) {
  await user.click(screen.getByRole("checkbox", { name: /yes, i read it/i }));
  fireEvent.change(screen.getByPlaceholderText("e.g. TG"), { target: { value: "tg" } });
  await user.click(button(/i understand/i));
}

// A large page: under a full parallel run the walk-throughs need extra time.
describe("PsychedelicReadinessIndex", { timeout: 120000 }, () => {
  beforeEach(() => {
    vi.mocked(submitPriConsent).mockResolvedValue({ ok: true });
  });

  it("shows every medicine and walks philosophy, intro, then the first question", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Find My\s*Medicine/);
    expect(screen.getByRole("heading", { name: `${MEDICINES.length} Sacred Medicines` })).toBeInTheDocument();
    await startQuiz(user);
    expect(screen.getByText(QUESTIONS[0].text)).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveValue("5");
    expect(button(/back/i)).toBeDisabled();
  });

  it("labels the slider value and keeps answers when going back", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await startQuiz(user);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "10" } });
    expect(screen.getByText(`... ${SLIDER_LABELS[4]}`, { exact: false })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider"), { target: { value: "1" } });
    expect(screen.getByText(`... ${SLIDER_LABELS[0]}`, { exact: false })).toBeInTheDocument();
    await user.click(button(/^next$/i));
    expect(screen.getByText(`2 / ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(button(/back/i));
    expect(screen.getByRole("slider")).toHaveValue("1");
  });

  it("asks for consent before the results, then scores exactly as computeScores does", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await startQuiz(user);
    const value = (i: number) => (i % 3 === 0 ? 9 : i % 3 === 1 ? 6 : 3);
    await finishQuiz(value);
    expect(screen.getByRole("heading", { name: "Before You Go In" })).toBeInTheDocument();
    await consent(user);

    const expected = computeScores(QUESTIONS.map((_, i) => value(i)));
    expect(await screen.findByText(expected.level.label, {}, { timeout: 15000 })).toBeInTheDocument();
    expect(screen.getByText(String(expected.overall), { selector: "div" })).toBeInTheDocument();
    for (const d of Object.keys(expected.dimScores) as DimKey[]) {
      const cell = screen.getAllByText(DIM_LABELS[d]).map((el) => el.parentElement!).find((el) => el.textContent?.includes("/100"));
      expect(cell).toHaveTextContent(`${expected.dimScores[d]}/100`);
    }
    for (const m of expected.topMatches) expect(screen.getAllByText(m.name).length).toBeGreaterThan(0);
    for (const s of expected.sequence) expect(screen.getAllByText(s.name).length).toBeGreaterThan(0);
    expect(saved).toHaveBeenCalledWith("psychedelic-readiness-index", {
      summary: `${expected.level.label}; Top matches: ${expected.topMatches.map((m) => m.name).join(", ")}`,
      score: expected.overall,
    });
    expect(sessionStorage.getItem("pri-consent")).toBe("true");
  });

  it("skips the gate once consented, gives the top level for all-10 answers, and Retake resets", async () => {
    sessionStorage.setItem("pri-consent", "true");
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await startQuiz(user);
    await finishQuiz(() => 10);
    expect(screen.queryByRole("heading", { name: "Before You Go In" })).not.toBeInTheDocument();
    expect(screen.getByText("Ready to Go Deep")).toBeInTheDocument();
    expect(computeScores(QUESTIONS.map(() => 10)).overall).toBe(100);
    await user.click(button(/retake assessment/i));
    expect(screen.getByRole("heading", { name: "Your Readiness Assessment" })).toBeInTheDocument();
    await user.click(button(/begin \d+-question assessment/i));
    expect(screen.getByRole("slider")).toHaveValue("5");
    expect(screen.getByText(`1 / ${QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("Back on the first pathway question returns to the last readiness question", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await startQuiz(user);
    for (let i = 0; i < QUESTIONS.length; i++) fireEvent.click(button(i === QUESTIONS.length - 1 ? /a few more questions/i : /^next$/i));
    await user.click(button(/back/i));
    expect(screen.getByText(`${QUESTIONS.length} / ${QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("opening a medicine before consenting shows the gate, then opens that medicine", async () => {
    const user = userEvent.setup();
    const m = MEDICINES.find((x) => x.id === "sananga")!;
    render(<PsychedelicReadinessIndex />);
    await user.click(screen.getAllByText(m.name)[0]);
    expect(screen.getByRole("heading", { name: "Before You Go In" })).toBeInTheDocument();
    await consent(user);
    // The modal is loaded with next/dynamic, so allow it time to arrive.
    expect(await screen.findByText(m.latin, {}, { timeout: 15000 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suggest Correction" })).toBeInTheDocument();
  });

  it("saves medicines to a shortlist kept in localStorage", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await user.click(screen.getAllByTitle("Save medicine")[0]);
    expect(JSON.parse(localStorage.getItem("pri-saved-medicines")!)).toEqual([MEDICINES[0].id]);
    expect(screen.getByRole("heading", { name: /my saved medicines \(1\)/i })).toBeInTheDocument();
    await user.click(screen.getAllByTitle("Remove from saved")[0]);
    expect(JSON.parse(localStorage.getItem("pri-saved-medicines")!)).toEqual([]);
    expect(screen.queryByRole("heading", { name: /my saved medicines/i })).not.toBeInTheDocument();
  });

  it("compare mode picks up to three medicines and shows them side by side", async () => {
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await user.click(button("Compare Medicines"));
    expect(screen.queryAllByTitle("Save medicine")).toHaveLength(0);
    const pick = (i: number) => user.click(screen.getAllByText(MEDICINES[i].name)[0]);
    await pick(0);
    expect(screen.getByText("Select 1 more medicine to compare")).toBeInTheDocument();
    await pick(1);
    expect(screen.getByRole("heading", { name: "Medicine Comparison" })).toBeInTheDocument();
    await pick(2);
    await pick(3);
    expect(button("Compare (3/3)")).toBeInTheDocument();
    await pick(0);
    expect(button("Compare (2/3)")).toBeInTheDocument();
    await user.click(button("Close"));
    expect(button("Compare Medicines")).toBeInTheDocument();
  });

  it("the referral request needs email and region, then confirms", async () => {
    sessionStorage.setItem("pri-consent", "true");
    vi.spyOn(console, "error").mockImplementation(() => {}); // jsdom can't open the mailto: link
    const user = userEvent.setup();
    render(<PsychedelicReadinessIndex />);
    await startQuiz(user);
    await finishQuiz(() => 5);
    await user.click(screen.getByRole("checkbox", { name: /connect me with a vetted facility/i }));
    const send = button(/send introduction request/i);
    expect(send).toBeDisabled();
    await user.type(screen.getByPlaceholderText("Your email"), "ada@example.com");
    expect(send).toBeDisabled();
    await user.type(screen.getByPlaceholderText(/your region/i), "London");
    expect(send).toBeEnabled();
    await user.click(send);
    await waitFor(() => expect(screen.getByText("Your email client should be open.")).toBeInTheDocument());
  });

  it.fails("BUG: medicine cards are clickable <div>s, so keyboard users can't open them", () => {
    render(<PsychedelicReadinessIndex />);
    expect(screen.getByRole("button", { name: new RegExp(MEDICINES[0].name) })).toBeInTheDocument();
  });
});
