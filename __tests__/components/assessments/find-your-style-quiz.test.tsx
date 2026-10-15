import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourStyleQuiz } from "@/components/assessments/find-your-style-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

async function walk(user: ReturnType<typeof userEvent.setup>, index: number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < 15; i++) {
    expect(screen.getByText(`Question ${i + 1} / 15`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[index]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const dim = (label: string) => screen.getByText(`${label}:`).parentElement!.textContent;

describe("FindYourStyleQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("starts on the intro and counts the questions", async () => {
    const user = userEvent.setup();
    render(<FindYourStyleQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Style");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("Question 1 / 15")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("When you enter a clothing store, what are you first drawn to?");
  });

  it("all first answers: Silhouette 11 and Sustainability 10 pass the first rule, The Tailored Classic", async () => {
    const user = userEvent.setup();
    render(<FindYourStyleQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Tailored Classic");
    expect(dim("Silhouette")).toBe("Silhouette: 11");
    expect(dim("Sustainability")).toBe("Sustainability: 10");
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-style", summary: "The Tailored Classic" }));
  });

  it("all last answers: Sustainability 3 skips the first two rules; Self-Expression 8 and Silhouette 7 give The Avant-Garde", async () => {
    const user = userEvent.setup();
    render(<FindYourStyleQuiz />);
    await walk(user, 3);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Avant-Garde");
    expect(dim("Self-Expression")).toBe("Self-Expression: 8");
    expect(dim("Color Philosophy")).toBe("Color Philosophy: -1");
  });
});
