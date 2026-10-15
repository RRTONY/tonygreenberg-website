import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDharmaFinder } from "@/components/assessments/dharma-finder-quiz/hook/use-dharma-finder";
import { SECTIONS, TOTAL } from "@/components/assessments/dharma-finder-quiz/data/dharma-finder.data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

describe("useDharmaFinder", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("starts on step 1, question 1, with progress 1/TOTAL", () => {
    const { result } = renderHook(() => useDharmaFinder());
    expect(result.current.state).toEqual({ step: 1, current: 0, answers: {}, interstitial: 0 });
    expect(result.current.isFirstInSection).toBe(true);
    expect(result.current.progress).toBeCloseTo(100 / TOTAL);
  });

  it("stores the answer under the question id and moves forward and back", () => {
    const { result } = renderHook(() => useDharmaFinder());
    act(() => result.current.answer("I would build schools"));
    expect(result.current.state.answers).toEqual({ 1: "I would build schools" });
    act(() => result.current.next());
    expect(result.current.state.current).toBe(1);
    expect(result.current.isFirstInSection).toBe(false);
    act(() => result.current.prev());
    act(() => result.current.prev());
    expect(result.current.state.current).toBe(0);
  });

  it("shows the between-parts quote at the end of a part, then moves on after 4 seconds", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDharmaFinder());
    const firstPartLength = SECTIONS[0].questions.length;
    for (let i = 0; i < firstPartLength - 1; i++) act(() => result.current.next());
    expect(result.current.state.current).toBe(firstPartLength - 1);
    act(() => result.current.next());
    expect(result.current.state.step).toBe(2);
    expect(result.current.state.interstitial).toBe(0);
    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.state.step).toBe(1);
    expect(result.current.state.current).toBe(firstPartLength);
    expect(result.current.section).toBe(1);
    expect(result.current.isFirstInSection).toBe(true);
    vi.useRealTimers();
  });

  it("finishing the last question marks the journey step done and opens the email gate; unlock shows results", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDharmaFinder());
    while (!result.current.isLast) {
      act(() => result.current.next());
      if (result.current.state.step === 2) act(() => vi.advanceTimersByTime(4000));
    }
    expect(result.current.state.current).toBe(TOTAL - 1);
    expect(result.current.progress).toBe(100);
    act(() => result.current.next());
    expect(result.current.state.step).toBe(3);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "dharma-finder", journeyId: "find-your-purpose" }));
    // Free-text answers never go to the database.
    expect(vi.mocked(recordFinish).mock.calls[0][0]).not.toHaveProperty("summary", expect.anything());
    act(() => result.current.unlock());
    expect(result.current.state.step).toBe(4);
    vi.useRealTimers();
  });

  it("builds the profile from the answers and retake clears everything", () => {
    const { result } = renderHook(() => useDharmaFinder());
    act(() => result.current.answer("I want to teach and build things"));
    expect(result.current.profile.archetypes).toEqual(["Creator / Builder", "Guide / Teacher"]);
    expect(result.current.profile.totalAnswered).toBe(1);
    act(() => result.current.retake());
    expect(result.current.state).toEqual({ step: 1, current: 0, answers: {}, interstitial: 0 });
    expect(result.current.profile.totalAnswered).toBe(0);
  });
});
