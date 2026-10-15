import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordAssessmentResult } from "@/app/assessments/actions";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/app/assessments/actions", () => ({ recordAssessmentResult: vi.fn(async () => undefined) }));

describe("recordFinish", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("sends nothing until the 1.5s merge window passes", () => {
    recordFinish({ assessment: "quiz-a", score: 3 });
    vi.advanceTimersByTime(1499);
    expect(recordAssessmentResult).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(recordAssessmentResult).toHaveBeenCalledWith({ assessment: "quiz-a", score: 3, journeyId: undefined, summary: undefined });
  });

  it("merges two calls for the same quiz into one, keeping earlier fields", () => {
    recordFinish({ assessment: "quiz-b", journeyId: "j1" });
    vi.advanceTimersByTime(1000);
    recordFinish({ assessment: "quiz-b", summary: "You are a Builder", score: 7 });
    vi.advanceTimersByTime(1500);
    expect(recordAssessmentResult).toHaveBeenCalledTimes(1);
    expect(recordAssessmentResult).toHaveBeenCalledWith({ assessment: "quiz-b", journeyId: "j1", summary: "You are a Builder", score: 7 });
  });

  it("keeps different quizzes separate", () => {
    recordFinish({ assessment: "quiz-c" });
    recordFinish({ assessment: "quiz-d" });
    vi.advanceTimersByTime(1500);
    expect(recordAssessmentResult).toHaveBeenCalledTimes(2);
  });

  it("a score of 0 from the second call is kept, not dropped", () => {
    recordFinish({ assessment: "quiz-e", score: 5 });
    recordFinish({ assessment: "quiz-e", score: 0 });
    vi.advanceTimersByTime(1500);
    expect(recordAssessmentResult).toHaveBeenCalledWith(expect.objectContaining({ score: 0 }));
  });
});
