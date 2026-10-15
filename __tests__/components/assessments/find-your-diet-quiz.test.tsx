import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourDietQuiz } from "@/components/assessments/find-your-diet-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

type User = ReturnType<typeof userEvent.setup>;

// Answers every question by clicking the option `pick` chooses (by index or text).
async function walk(user: User, pick: (qi: number, options: HTMLElement[]) => HTMLElement) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let qi = 0; qi < 15; qi++) {
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    await user.click(pick(qi, screen.getAllByRole("button")));
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

const scoreOf = (dim: string) => screen.getByText(dim, { selector: "span" }).nextElementSibling?.textContent;

describe("FindYourDietQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("opens on the intro and starts the 15 questions", async () => {
    const user = userEvent.setup();
    render(<FindYourDietQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Diet");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("How do you feel after eating a high-carb meal?");
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("all first answers: sums each dimension and lands on The Mediterranean Soul", async () => {
    // First options add Metabolic 4+4+4+2=14, Gut 4x4=16, Inflammation 4x4=16, Energy 14,
    // Nutrient 12, Mindful 14. Nearest profile by total distance: Mediterranean Soul.
    const user = userEvent.setup();
    render(<FindYourDietQuiz />);
    await walk(user, (_q, opts) => opts[0]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Mediterranean Soul");
    expect(scoreOf("Metabolic Type")).toBe("14");
    expect(scoreOf("Gut Health")).toBe("16");
    expect(scoreOf("Nutrient Density")).toBe("12");
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-diet", summary: "The Mediterranean Soul" }));
  });

  it("all last answers: lands on The Fasting Philosopher", async () => {
    // Last options: Metabolic 8, Gut 4, Inflammation 3, Energy 3, Nutrient 1, Mindful 9, which as
    // average answers (2, 1, 1, 0.75, 0.25, 2.25) sit nearest The Fasting Philosopher. (Before the
    // 2026-10-16 fix the raw sums were compared and this showed The Plant Alchemist.)
    const user = userEvent.setup();
    render(<FindYourDietQuiz />);
    await walk(user, (_q, opts) => opts[opts.length - 1]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Fasting Philosopher");
    expect(scoreOf("Mindful Eating")).toBe("9");
    expect(scoreOf("Nutrient Density")).toBe("1");
  });

  // Answers that match The Ancestral Eater's own profile (Metabolic 4, Gut 3, Inflammation 4,
  // Energy 3, Nutrient 4, Mindful 2) question by question.
  const ANCESTRAL = [
    "Energized and satisfied", "Occasionally, after certain foods", "Stable and consistent", "Rarely, I prefer whole foods",
    "A mix of focused and distracted eating", "Rested and refreshed", "A wide variety, 10+ types",
    "I eat when I feel gentle hunger and stop when satisfied", "Almost never", "It's complicated and sometimes stressful",
    "Clear and calm", "Full, focused, and satiated for hours", "Occasionally, once or twice a week",
    "Not very sensitive, I can drink it any time", "I tend to lose my appetite",
  ];

  it("answers matching The Ancestral Eater's profile give The Ancestral Eater (fixed: average answers, not sums, are compared with the 1-4 profiles)", async () => {
    const user = userEvent.setup();
    render(<FindYourDietQuiz />);
    await walk(user, (qi) => screen.getByRole("button", { name: ANCESTRAL[qi] }));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Ancestral Eater");
  });

  // One answer set (option index per question, 0-based) for every profile, found with a
  // random-answer search over the scoring, so none is unreachable again.
  it.each([
    ["The Ancestral Eater", [0, 2, 0, 0, 2, 2, 2, 3, 0, 1, 3, 3, 0, 1, 3]],
    ["The Plant Alchemist", [3, 0, 3, 3, 1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 1]],
    ["The Intuitive Grazer", [2, 0, 0, 2, 1, 2, 1, 0, 0, 2, 1, 2, 3, 1, 2]],
    ["The Performance Fueler", [3, 3, 0, 0, 2, 3, 1, 1, 1, 3, 0, 0, 2, 1, 3]],
    ["The Mediterranean Soul", [1, 0, 3, 0, 0, 2, 0, 3, 1, 1, 1, 1, 1, 2, 0]],
    ["The Fasting Philosopher", [3, 2, 1, 3, 0, 3, 1, 0, 3, 2, 3, 3, 1, 3, 2]],
  ])("%s is reachable", async (name, answers) => {
    const user = userEvent.setup();
    render(<FindYourDietQuiz />);
    await walk(user, (qi, opts) => opts[answers[qi]]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
  });
});
