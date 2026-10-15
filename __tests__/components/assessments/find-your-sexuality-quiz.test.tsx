import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourSexualityQuiz } from "@/components/assessments/find-your-sexuality-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 16;

async function walk(user: ReturnType<typeof userEvent.setup>, index: number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`QUESTION ${i + 1} OF ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[index]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const tile = (dim: string) => screen.getByText(dim, { selector: "div" }).nextElementSibling?.textContent;

describe("FindYourSexualityQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("starts on the intro and shows the research context under question 1", async () => {
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Sexuality");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText(/Klein Sexual Orientation Grid/)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("third answers everywhere: fluidity 30 (20 or more) gives The River", async () => {
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    await walk(user, 2);
    expect(await screen.findByRole("heading", { level: 2, name: "The River" })).toBeInTheDocument();
    expect(screen.getByText("Sexually Fluid")).toBeInTheDocument();
    expect(tile("fluidity")).toBe("30");
  });

  it("saves only that the quiz was finished, never the result or the answers", async () => {
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    await walk(user, 2);
    await screen.findByRole("heading", { level: 2, name: "The River" });
    expect(recordFinish).toHaveBeenCalledTimes(1);
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "find-your-sexuality", journeyId: "find-your-sexuality" });
    // The email signup only carries the email and the quiz name.
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(body).toEqual({ email: "me@example.com", source: "find-your-sexuality" });
    expect(document.cookie).not.toContain("River");
  });

  it.fails("BUG: thresholds are per-question averages but scores are summed over 16 questions, so the most different-gender answers show The Lighthouse (Gay / Lesbian) and The Compass can never appear", async () => {
    // First options are all "exclusively a different gender": attraction 6, behavior 3, identity 9,
    // fantasy 3, emotional 4, fluidity 0 (sum 25, "avg" 5 because it divides by 5 dimensions, not 16 questions).
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent("The Compass");
  });
});
