import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePostIntervention } from "@/components/post-intervention/hook/use-post-intervention";
import { submitPostIntervention } from "@/app/post-intervention/actions";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));
const submit = vi.mocked(submitPostIntervention);

function filled() {
  const hook = renderHook(() => usePostIntervention());
  act(() =>
    hook.result.current.updateState({
      step: 3,
      day: 3,
      interventionType: "breathwork",
      facilitatorRef: "JB",
      integrationScore: 7,
      safetyScore: 9,
      trustScore: 8,
      wouldRecommend: "yes",
      wentWell: "Held well",
    }),
  );
  return hook;
}

describe("usePostIntervention", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("starts on step 1 with nothing answered and can't submit", () => {
    const { result } = renderHook(() => usePostIntervention());
    expect(result.current.state).toMatchObject({ step: 1, day: null, interventionType: "psychedelic", pending: false, error: null });
    expect(result.current.canSubmit).toBe(false);
  });

  it("onNext() steps forward, onNext(n) jumps", () => {
    const { result } = renderHook(() => usePostIntervention());
    act(() => result.current.onNext());
    act(() => result.current.onNext());
    expect(result.current.state.step).toBe(3);
    act(() => result.current.onNext(1));
    expect(result.current.state.step).toBe(1);
  });

  it("needs all three scores and a recommendation before submitting", () => {
    const { result } = renderHook(() => usePostIntervention());
    act(() => result.current.updateState({ integrationScore: 5, safetyScore: 5, trustScore: 5 }));
    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.updateState({ wouldRecommend: "no" }));
    expect(result.current.canSubmit).toBe(true);
  });

  it("sends exactly the answers and moves to the thank-you step", async () => {
    const { result } = filled();
    await act(() => result.current.submit());
    expect(submit).toHaveBeenCalledWith({
      dayChoice: 3,
      interventionType: "breathwork",
      facilitatorRef: "JB",
      integrationScore: 7,
      safetyScore: 9,
      trustScore: 8,
      wouldRecommend: "yes",
      wentWell: "Held well",
      couldImprove: "",
      messageToFacilitator: "",
    });
    expect(result.current.state).toMatchObject({ step: 4, pending: false });
  });

  it("does nothing when the answers are incomplete or no day was picked", async () => {
    const { result } = renderHook(() => usePostIntervention());
    await act(() => result.current.submit());
    act(() => result.current.updateState({ integrationScore: 1, safetyScore: 1, trustScore: 1, wouldRecommend: "no" }));
    await act(() => result.current.submit());
    expect(submit).not.toHaveBeenCalled();
  });

  it("keeps the survey open with the error (or a default one) when saving fails", async () => {
    submit.mockResolvedValueOnce({ ok: false, error: "Database down." }).mockResolvedValueOnce({ ok: false });
    const { result } = filled();
    await act(() => result.current.submit());
    expect(result.current.state).toMatchObject({ step: 3, error: "Database down.", pending: false });
    await act(() => result.current.submit());
    expect(result.current.state.error).toBe("Something went wrong. Please try again.");
  });

  it("reset starts over from scratch", () => {
    const { result } = filled();
    act(() => result.current.reset());
    expect(result.current.state).toMatchObject({ step: 1, day: null, integrationScore: null, facilitatorRef: "", wentWell: "" });
  });
});
