import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTasteQuiz } from "@/components/soulsmoke/pages/taste-quiz/hook/use-taste-quiz";
import { questions } from "@/components/soulsmoke/pages/taste-quiz/data/taste-quiz.data";

afterEach(() => vi.useRealTimers());

describe("useTasteQuiz", () => {
  it("records an answer, moves on after 300ms, and opens the results after the last one", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTasteQuiz());
    expect(result.current.progress).toBe((1 / questions.length) * 100);
    for (const q of questions) {
      act(() => result.current.answer(q.dimension, 6));
      act(() => vi.advanceTimersByTime(300));
    }
    expect(result.current.state.step).toBe(2);
    expect(Object.keys(result.current.state.answers)).toHaveLength(questions.length);
    act(() => result.current.reset());
    expect(result.current.state).toEqual({ step: 1, currentQuestion: 0, answers: {} });
  });

  it("back never goes below the first question, onNext jumps to a step", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTasteQuiz());
    act(() => result.current.back());
    expect(result.current.state.currentQuestion).toBe(0);
    act(() => result.current.answer("smoke", 4));
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current.back());
    expect(result.current.state.currentQuestion).toBe(0);
    act(() => result.current.onNext());
    expect(result.current.state.step).toBe(2);
    act(() => result.current.onNext(1));
    expect(result.current.state.step).toBe(1);
  });
});
