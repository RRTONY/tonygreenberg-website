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

async function walk(user: ReturnType<typeof userEvent.setup>, index: number | number[]) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`QUESTION ${i + 1} OF ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[typeof index === "number" ? index : index[i]]);
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

  it("most different-gender answers give The Compass (fixed: dimensions are now averaged, not summed over 16 questions)", async () => {
    // First options are all "exclusively a different gender": attraction 6, behavior 3, identity 9,
    // fantasy 3, emotional 4, fluidity 0 (sum 25, "avg" 5 because it divides by 5 dimensions, not 16 questions).
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent("The Compass");
  });

  // One honest answer set (option index per question, 0-based) for every profile, so none is
  // unreachable again. Found with a random-answer search over the scoring.
  it.each([
    ["The Compass", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    ["The Explorer", [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 2, 0, 1]],
    ["The Mosaic", [5, 5, 2, 3, 5, 5, 0, 5, 5, 5, 5, 0, 5, 0, 5, 5]],
    ["The Sovereign", [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 3, 5, 5, 2, 4, 0]],
    ["The River", [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]],
    ["The Spectrum", [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]],
    ["The Dreamer", [3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 3, 0, 4]],
    ["The Bridge", [3, 4, 2, 4, 0, 2, 5, 4, 5, 5, 5, 5, 0, 3, 4, 2]],
    ["The Unspoken", [5, 1, 2, 2, 1, 0, 2, 1, 5, 4, 3, 2, 4, 2, 1, 0]],
    ["The Current", [3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3]],
    ["The Anchor", [3, 4, 4, 4, 3, 4, 3, 3, 4, 4, 1, 0, 2, 1, 1, 4]],
    ["The Lighthouse", [4, 4, 4, 4, 3, 0, 3, 3, 0, 4, 1, 0, 3, 1, 1, 4]],
  ])("%s is reachable", async (name, answers) => {
    const user = userEvent.setup();
    render(<FindYourSexualityQuiz />);
    await walk(user, answers);
    expect(await screen.findByRole("heading", { level: 2, name })).toBeInTheDocument();
  });
});
