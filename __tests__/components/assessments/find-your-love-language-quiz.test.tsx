import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourLoveLanguageQuiz } from "@/components/assessments/find-your-love-language-quiz";
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
    expect(screen.getByText(`Question ${i + 1} of 15`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[index]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

describe("FindYourLoveLanguageQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("starts on the intro and walks to question 1", async () => {
    const user = userEvent.setup();
    render(<FindYourLoveLanguageQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Love Language");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Which of these makes you feel most loved?");
  });

  // Totals from the data for "always pick option N":
  // 0: Words 16, Gifts 7 / 1: Service 15, Words 13 / 2: Gifts 17, Service 13 / 3: Time 19, Touch 14.
  it.each([
    [0, "The Encourager", "Words of Affirmation", "Receiving Gifts"],
    [1, "The Helper", "Acts of Service", "Words of Affirmation"],
    [2, "The Giver", "Receiving Gifts", "Acts of Service"],
    [3, "The Companion", "Quality Time", "Physical Touch"],
  ])("always option %i: %s (primary %s, secondary %s)", async (index, name, primary, secondary) => {
    const user = userEvent.setup();
    render(<FindYourLoveLanguageQuiz />);
    await walk(user, index);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
    expect(screen.getByText("Primary:").parentElement).toHaveTextContent(`Primary: ${primary}`);
    expect(screen.getByText("Secondary:").parentElement).toHaveTextContent(`Secondary: ${secondary}`);
    expect(recordFinish).toHaveBeenCalledWith(
      expect.objectContaining({ assessment: "find-your-love-language", summary: `Primary: ${primary}; Secondary: ${secondary}` }),
    );
  });
});
