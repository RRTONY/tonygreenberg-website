import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsciousnessScaleQuiz } from "@/components/assessments/consciousness-scale-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 25;
type User = ReturnType<typeof userEvent.setup>;
// Plain DOM lookups: role queries over this long page are too slow for a 25-question walk.
const options = () => [...document.querySelectorAll("h3 + div > button")] as HTMLElement[];
const nextButton = () => screen.getByText(/^(Next|See My Level)$/).closest("button") as HTMLElement;

async function walk(user: User, index: number | ((question: number) => number)) {
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    if (i === 0) expect(nextButton()).toBeDisabled();
    await user.click(options()[typeof index === "number" ? index : index(i)]);
    await user.click(nextButton());
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const calibration = () => screen.getByText("Your Calibration").nextElementSibling;

describe("ConsciousnessScaleQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("opens on question 1 with the hero heading and a disabled Previous", () => {
    render(<ConsciousnessScaleQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Where Does Your Consciousness Actually Calibrate?");
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(options()).toHaveLength(5);
  });

  it("shows a running average after each answer and keeps answers when going back", async () => {
    const user = userEvent.setup();
    render(<ConsciousnessScaleQuiz />);
    await user.click(options()[3]); // score 500
    expect(screen.getByText("500 — Love")).toBeInTheDocument();
    expect(screen.getByText(`1 of ${TOTAL} answered`)).toBeInTheDocument();
    await user.click(nextButton());
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(`1 / ${TOTAL}`)).toBeInTheDocument();
    expect(nextButton()).toBeEnabled();
  });

  // The final score is the average of all 25 answers, mapped to the highest level at or below it.
  it.each([
    [0, "152", "Anger", "Hate"],
    [2, "332", "Willingness", "Optimism"],
    [4, "598", "Joy", "Serenity"],
  ])("always option %i: calibrates at %s, %s", async (index, score, name, emotion) => {
    const user = userEvent.setup();
    render(<ConsciousnessScaleQuiz />);
    await walk(user, index);
    expect(await screen.findByText("Your Calibration")).toBeInTheDocument();
    expect(calibration()).toHaveTextContent(score);
    expect(calibration()?.nextElementSibling).toHaveTextContent(name);
    expect(recordFinish).toHaveBeenCalledWith(
      expect.objectContaining({ assessment: "consciousness-scale", summary: `${name} (${emotion})`, score: Number(score) }),
    );
  }, 60000);

  it("saves a 6-month reminder in this browser, and Retake starts over", async () => {
    const user = userEvent.setup();
    render(<ConsciousnessScaleQuiz />);
    await walk(user, 1);
    await user.click(await screen.findByRole("button", { name: /save my score \(192 — pride\)/i }));
    expect(screen.getByText("Reminder saved. Come back in 6 months.")).toBeInTheDocument();
    const saved = new Date(localStorage.getItem("consciousness_reminder")!);
    expect(saved.getTime()).toBeGreaterThan(Date.now() + 150 * 24 * 3600 * 1000);
    await user.click(screen.getByRole("button", { name: /retake/i }));
    expect(screen.getByText(`1 / ${TOTAL}`)).toBeInTheDocument();
  }, 60000);
  // Option 3 on the first 12 questions, option 2 on the rest: average 249.
  it("a 200-309 average gets the Courage reading, and the share buttons post the real score", async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    vi.stubGlobal("open", open);
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ConsciousnessScaleQuiz />);
    await walk(user, (i) => (i < 12 ? 2 : 1));
    expect(await screen.findByText("Your Calibration")).toBeInTheDocument();
    expect(calibration()).toHaveTextContent("249");
    expect(calibration()?.nextElementSibling).toHaveTextContent("Courage");
    expect(screen.getByText(/You have crossed the threshold of Courage \(200\)/)).toBeInTheDocument();

    const text = "I calibrated at 249 on the Hawkins Map of Consciousness — Courage. Where do you land?";
    const url = "https://tonygreenberg.com/consciousness-scale";
    await user.click(screen.getByRole("button", { name: "Post on X" }));
    expect(open).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
    await user.click(screen.getByRole("button", { name: "Share on LinkedIn" }));
    expect(open).toHaveBeenLastCalledWith(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(writeText).toHaveBeenCalledWith(`${text} ${url}`);
  }, 60000);
});
