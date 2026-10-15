import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourSleepQuiz } from "@/components/assessments/find-your-sleep-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

type User = ReturnType<typeof userEvent.setup>;
const options = () => within(screen.getByRole("heading", { level: 2 }).nextElementSibling as HTMLElement).getAllByRole("button");

async function walk(user: User, pick: (opts: HTMLElement[]) => HTMLElement) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < 15; i++) {
    expect(screen.getByText(`Question ${i + 1} of 15`)).toBeInTheDocument();
    await user.click(pick(options()));
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

const dimScore = (dim: string) => screen.getByText(`${dim}:`).parentElement!.textContent;

describe("FindYourSleepQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("starts on the intro and shows question 1 of 15", async () => {
    const user = userEvent.setup();
    render(<FindYourSleepQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Sleep");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("Question 1 of 15")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("When do you feel most naturally alert and energetic?");
  });

  it("all first answers: Circadian Alignment 5 (3 or more) makes you The Dawn Walker", async () => {
    const user = userEvent.setup();
    render(<FindYourSleepQuiz />);
    await walk(user, (o) => o[0]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Dawn Walker");
    expect(dimScore("Circadian Alignment")).toBe("Circadian Alignment: 5");
    expect(dimScore("Wind-Down Ritual")).toBe("Wind-Down Ritual: 8");
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-sleep", summary: "The Dawn Walker" }));
  });

  it("all last answers: Circadian Alignment -4 makes you The Night Architect", async () => {
    const user = userEvent.setup();
    render(<FindYourSleepQuiz />);
    await walk(user, (o) => o[o.length - 1]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Night Architect");
    expect(dimScore("Circadian Alignment")).toBe("Circadian Alignment: -4");
  });

  it("all second answers: no threshold is met, the top dimension is Environment, so The Zen Sleeper", async () => {
    // Scores: Circadian 2, Architecture -2, Dream 0, Recovery 1, Environment 3, Wind-Down 0.
    const user = userEvent.setup();
    render(<FindYourSleepQuiz />);
    await walk(user, (o) => o[Math.min(1, o.length - 1)]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Zen Sleeper");
    expect(dimScore("Environment Sensitivity")).toBe("Environment Sensitivity: 3");
  });
});
