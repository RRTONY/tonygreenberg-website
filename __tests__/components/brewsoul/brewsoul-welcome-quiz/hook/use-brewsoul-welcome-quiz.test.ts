import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { IDENTITY_KEY, useBrewSoulWelcomeQuiz } from "@/components/brewsoul/brewsoul-welcome-quiz/hook/use-brewsoul-welcome-quiz";
import { PALATE_QUESTIONS, SCREENS } from "@/components/brewsoul/brewsoul-welcome-quiz/data/brewsoul-welcome-quiz.data";

type Quiz = { current: ReturnType<typeof useBrewSoulWelcomeQuiz> };
const wait = () => act(() => vi.advanceTimersByTime(300));

// Walks all eight screens: why-here, relationship, dark side, bright side,
// palate, pay-more (multi), weirdness slider, how-you-drink.
function walk(result: Quiz, a: { why: string; rel: string; weird: number; drink: string }) {
  act(() => result.current.choose(a.why));
  wait();
  act(() => result.current.choose(a.rel));
  wait();
  act(() => result.current.choose("sleep"));
  wait();
  act(() => result.current.choose("longevity"));
  wait();
  for (const pq of PALATE_QUESTIONS) act(() => result.current.setPalate(pq.dim, pq.options[0]));
  act(() => result.current.continuePalate());
  wait();
  act(() => result.current.toggleMulti("mold"));
  act(() => result.current.continueMulti());
  wait();
  act(() => result.current.setWeirdness(a.weird));
  act(() => result.current.continueSlider());
  wait();
  act(() => result.current.choose(a.drink));
  wait();
}

describe("useBrewSoulWelcomeQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts on screen 1 with weirdness 5 and no identity", () => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    expect(result.current.state).toMatchObject({ step: 1, screen: 0, weirdness: 5, identity: null, visible: true });
    expect(result.current.progress).toBe(0);
  });

  it("fades, records the choice and moves to the next screen", () => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    act(() => result.current.choose("consumer"));
    expect(result.current.state.visible).toBe(false);
    wait();
    expect(result.current.state).toMatchObject({ screen: 1, answers: { 0: "consumer" }, visible: true });
    expect(result.current.progress).toBeCloseTo((1 / SCREENS.length) * 100);
  });

  it("only continues past the palate check once every row is answered", () => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    act(() => result.current.setPalate("acid", "Love it"));
    expect(result.current.palateComplete).toBe(false);
    expect(result.current.continuePalate()).toBe(false);
    for (const pq of PALATE_QUESTIONS) act(() => result.current.setPalate(pq.dim, pq.options[1]));
    expect(result.current.palateComplete).toBe(true);
  });

  it("multi-select toggles tags on and off and clears them after continuing", () => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    act(() => result.current.toggleMulti("rare"));
    act(() => result.current.toggleMulti("mold"));
    act(() => result.current.toggleMulti("rare"));
    expect(result.current.state.multi).toEqual(["mold"]);
    act(() => result.current.continueMulti());
    wait();
    expect(result.current.state.answers[0]).toEqual(["mold"]);
    expect(result.current.state.multi).toEqual([]);
  });

  it.each([
    [{ why: "impact", rel: "activist", weird: 5, drink: "flexible" }, "impact-alchemist"],
    [{ why: "consumer", rel: "functional", weird: 2, drink: "latte" }, "the-awakening"],
    [{ why: "connoisseur", rel: "obsessed", weird: 9, drink: "cold" }, "fermentation-explorer"],
    [{ why: "b2b", rel: "professional", weird: 5, drink: "latte" }, "pressure-seeker"],
    [{ why: "consumer", rel: "ritual", weird: 5, drink: "flexible" }, "ritual-architect"],
    [{ why: "connoisseur", rel: "obsessed", weird: 5, drink: "purist" }, "terroir-purist"],
  ])("%o -> %s, saved in the browser", (answers, id) => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    walk(result, answers);
    expect(result.current.state.step).toBe(2);
    expect(result.current.state.identity?.id).toBe(id);
    expect(result.current.progress).toBe(100);
    expect(localStorage.getItem(IDENTITY_KEY)).toBe(id);
  });

  it("retake forgets the identity and starts over", () => {
    const { result } = renderHook(() => useBrewSoulWelcomeQuiz());
    walk(result, { why: "impact", rel: "activist", weird: 5, drink: "purist" });
    act(() => result.current.retake());
    expect(localStorage.getItem(IDENTITY_KEY)).toBeNull();
    expect(result.current.state).toMatchObject({ step: 1, screen: 0, identity: null, answers: {} });
  });
});
