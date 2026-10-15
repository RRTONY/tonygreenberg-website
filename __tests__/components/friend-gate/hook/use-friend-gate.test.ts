import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFriendGate } from "@/components/friend-gate/hook/use-friend-gate";

describe("useFriendGate", () => {
  it("starts on step 1 (the intro)", () => {
    const { result } = renderHook(() => useFriendGate());
    expect(result.current.step).toBe(1);
  });

  it("onNext() moves forward one step", () => {
    const { result } = renderHook(() => useFriendGate());
    act(() => result.current.onNext());
    expect(result.current.step).toBe(2);
  });

  it("onNext(n) jumps straight to step n (used by Back)", () => {
    const { result } = renderHook(() => useFriendGate());
    act(() => result.current.onNext());
    act(() => result.current.onNext(1));
    expect(result.current.step).toBe(1);
  });
});
