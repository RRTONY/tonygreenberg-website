import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useBrewSoulQuiz } from "@/components/brewsoul/brewsoul-quiz/hook/use-brewsoul-quiz";
import { QUESTIONS } from "@/components/brewsoul/brewsoul-quiz/data/brewsoul-quiz.data";

function answerAndWait(result: { current: ReturnType<typeof useBrewSoulQuiz> }, dim: string, score: number) {
  act(() => result.current.answer(dim, score));
  act(() => vi.advanceTimersByTime(250));
}

describe("useBrewSoulQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("starts on question 1 of step 1 with no answers", () => {
    const { result } = renderHook(() => useBrewSoulQuiz());
    expect(result.current.state).toEqual({ step: 1, questionIndex: 0, answers: {}, visible: true });
    expect(result.current.progress).toBe(0);
  });

  it("fades out, then records the answer and moves on", () => {
    const { result } = renderHook(() => useBrewSoulQuiz());
    act(() => result.current.answer("acidity", 9));
    expect(result.current.state.visible).toBe(false);
    expect(result.current.state.questionIndex).toBe(0);
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.state).toMatchObject({ visible: true, questionIndex: 1, answers: { acidity: 9 } });
    expect(result.current.progress).toBeCloseTo((1 / QUESTIONS.length) * 100);
  });

  it("goes to the results step after the last question with every answer kept", () => {
    const { result } = renderHook(() => useBrewSoulQuiz());
    for (const q of QUESTIONS) answerAndWait(result, q.dim, q.opts[0].score);
    expect(result.current.state.step).toBe(2);
    expect(result.current.progress).toBe(100);
    expect(result.current.state.answers).toEqual(Object.fromEntries(QUESTIONS.map((q) => [q.dim, q.opts[0].score])));
  });

  it("back never goes before the first question, and reset starts over", () => {
    const { result } = renderHook(() => useBrewSoulQuiz());
    act(() => result.current.back());
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.state.questionIndex).toBe(0);
    answerAndWait(result, "acidity", 6);
    answerAndWait(result, "body", 5);
    act(() => result.current.back());
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.state.questionIndex).toBe(1);
    act(() => result.current.reset());
    expect(result.current.state).toEqual({ step: 1, questionIndex: 0, answers: {}, visible: true });
  });

  it("onNext jumps to a given step", () => {
    const { result } = renderHook(() => useBrewSoulQuiz());
    act(() => result.current.onNext(2));
    expect(result.current.state.step).toBe(2);
    act(() => result.current.onNext());
    expect(result.current.state.step).toBe(3);
  });
});
