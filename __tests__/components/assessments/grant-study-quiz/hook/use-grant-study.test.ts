import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGrantStudy } from "@/components/assessments/grant-study-quiz/hook/use-grant-study";
import { QUESTIONS } from "@/components/assessments/grant-study-quiz/data/grant-study.data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

describe("useGrantStudy", () => {
  it("starts on question 1 of the first factor", () => {
    const { result } = renderHook(() => useGrantStudy());
    expect(result.current.state).toEqual({ step: 1, current: 0, answers: {} });
    expect(result.current.factor.key).toBe("relationships");
    expect(result.current.progress).toBe(4);
    expect(result.current.overall).toBe(0);
  });

  it("select stores the score by question id; next/prev move and prev stops at 0", () => {
    const { result } = renderHook(() => useGrantStudy());
    act(() => result.current.select(7));
    expect(result.current.state.answers).toEqual({ 1: 7 });
    act(() => result.current.next());
    expect(result.current.state.current).toBe(1);
    act(() => result.current.prev());
    act(() => result.current.prev());
    expect(result.current.state.current).toBe(0);
  });

  it("scores factors and overall from the answers, then goes gate -> results and marks done", () => {
    const { result } = renderHook(() => useGrantStudy());
    for (let i = 0; i < QUESTIONS.length; i++) {
      act(() => result.current.select(QUESTIONS[i].factor === "relationships" ? 10 : 5));
      act(() => result.current.next());
    }
    expect(result.current.state.step).toBe(2);
    const byKey = Object.fromEntries(result.current.factorScores.map((f) => [f.key, f.score]));
    expect(byKey).toEqual({ relationships: 100, coping: 50, generativity: 50, career: 50, health: 50 });
    expect(result.current.overall).toBe(60);
    expect(recordFinish).not.toHaveBeenCalled();
    act(() => result.current.unlock());
    expect(result.current.state.step).toBe(3);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "grant-study", journeyId: "find-your-score" }));
  });

  it("retake resets to the start", () => {
    const { result } = renderHook(() => useGrantStudy());
    act(() => result.current.select(3));
    act(() => result.current.next());
    act(() => result.current.retake());
    expect(result.current.state).toEqual({ step: 1, current: 0, answers: {} });
  });
});
