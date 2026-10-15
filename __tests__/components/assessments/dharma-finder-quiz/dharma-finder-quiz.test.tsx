import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DharmaFinderQuiz } from "@/components/assessments/dharma-finder-quiz/dharma-finder-quiz";
import { ALL_QUESTIONS, INTERSTITIAL_QUOTES, TOTAL } from "@/components/assessments/dharma-finder-quiz/data/dharma-finder.data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

describe("DharmaFinderQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("walks every question, the between-parts quotes, the email gate and the results", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DharmaFinderQuiz />);

    expect(screen.getByText(`Question 1 of ${TOTAL}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();

    for (let i = 0; i < TOTAL; i++) {
      expect(screen.getByLabelText(ALL_QUESTIONS[i].text)).toBeInTheDocument();
      if (i === 0) await user.type(screen.getByRole("textbox"), "I would create and build schools");
      if (i === 8) await user.type(screen.getByRole("textbox"), "truth and justice");
      const isLast = i === TOTAL - 1;
      await user.click(screen.getByRole("button", { name: isLast ? /see my dharma profile/i : /^next/i }));
      if (!isLast && [7, 16, 23].includes(i)) {
        expect(screen.getByText(new RegExp(INTERSTITIAL_QUOTES[[7, 16, 23].indexOf(i)].text.slice(0, 20)))).toBeInTheDocument();
        await act(async () => vi.advanceTimersByTime(4000));
      }
    }

    expect(screen.getByRole("heading", { name: /enter your email/i })).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));

    expect(await screen.findByRole("heading", { level: 1, name: "The Threads of Your Purpose" })).toBeInTheDocument();
    expect(screen.getByText("Creator / Builder")).toBeInTheDocument();
    expect(screen.getByText("Truth & Authenticity")).toBeInTheDocument();
    expect(screen.getByText("Justice & Equity")).toBeInTheDocument();
    expect(screen.getByText(/Based on your 2 responses/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/subscribe", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)).toEqual({ email: "me@example.com", source: "find-your-dharma-finder" });
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "dharma-finder", summary: expect.stringContaining("Creator / Builder") }));
  });

  it("Previous goes back and keeps the typed answer", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DharmaFinderQuiz />);
    await user.type(screen.getByRole("textbox"), "first answer");
    await user.click(screen.getByRole("button", { name: /^next/i }));
    expect(screen.getByText(`Question 2 of ${TOTAL}`)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByRole("textbox")).toHaveValue("first answer");
  });
});
