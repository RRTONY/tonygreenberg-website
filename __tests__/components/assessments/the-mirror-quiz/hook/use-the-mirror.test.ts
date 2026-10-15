import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheMirror } from "@/components/assessments/the-mirror-quiz/hook/use-the-mirror";
import { MIRROR_DIMENSIONS, MIRROR_QUESTIONS } from "@/lib/content/mirror-data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

function answerAt(result: { current: ReturnType<typeof useTheMirror> }, idx: number) {
  act(() => result.current.answer(idx));
  act(() => vi.advanceTimersByTime(400));
}

describe("useTheMirror", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("begin goes to the questions and exit back to the intro", () => {
    const { result } = renderHook(() => useTheMirror());
    expect(result.current.state.step).toBe(1);
    act(() => result.current.begin());
    expect(result.current.state.step).toBe(2);
    act(() => result.current.exit());
    expect(result.current.state.step).toBe(1);
  });

  it("answer highlights first, ignores a second click, then saves the score and advances after 400ms", () => {
    const { result } = renderHook(() => useTheMirror());
    act(() => result.current.begin());
    act(() => result.current.answer(3));
    expect(result.current.state.selected).toBe(3);
    act(() => result.current.answer(0));
    expect(result.current.state.selected).toBe(3);
    act(() => vi.advanceTimersByTime(400));
    expect(result.current.state).toMatchObject({ current: 1, selected: null, answers: { 0: MIRROR_QUESTIONS[0].options[3].score } });
  });

  it("averages each dimension, sorts weakest first, and finishing goes to the gate and marks done", () => {
    const { result } = renderHook(() => useTheMirror());
    act(() => result.current.begin());
    const expected: Record<string, number[]> = {};
    MIRROR_QUESTIONS.forEach((q, i) => {
      const idx = q.dimension === "relationships" ? 0 : q.options.length - 1;
      (expected[q.dimension] ??= []).push(q.options[idx].score);
      answerAt(result, idx);
      if (i < MIRROR_QUESTIONS.length - 1) expect(result.current.state.current).toBe(i + 1);
    });
    expect(result.current.state.step).toBe(3);
    const dims = Object.fromEntries(Object.entries(expected).map(([k, v]) => [k, Math.round(v.reduce((a, b) => a + b, 0) / v.length)]));
    expect(result.current.dimensionScores).toEqual(dims);
    const vals = Object.values(dims);
    expect(result.current.overallScore).toBe(Math.round(vals.reduce((a, b) => a + b, 0) / vals.length));
    expect(result.current.sortedDims[0].id).toBe("relationships");
    expect(result.current.sortedDims).toHaveLength(MIRROR_DIMENSIONS.length);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "the-mirror", journeyId: "find-your-mirror" }));
    act(() => result.current.unlock());
    expect(result.current.state.step).toBe(4);
  });

  it("back moves one question back and reset starts over", () => {
    const { result } = renderHook(() => useTheMirror());
    act(() => result.current.begin());
    answerAt(result, 0);
    answerAt(result, 0);
    act(() => result.current.back());
    expect(result.current.state.current).toBe(1);
    act(() => result.current.reset());
    expect(result.current.state).toEqual({ step: 1, current: 0, answers: {}, selected: null });
    expect(result.current.overallScore).toBe(0);
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
