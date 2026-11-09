import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScentFinder } from "@/components/soulsmoke/pages/scent-finder/hook/use-scent-finder";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const wrapper = ({ children }: { children: ReactNode }) => <SoulsmokeProviders>{children}</SoulsmokeProviders>;

describe("useScentFinder", () => {
  it("starts on step 1 with nothing selected, in English", () => {
    const { result } = renderHook(() => useScentFinder(), { wrapper });
    expect(result.current.state).toEqual({ step: 1, selectedNotes: [], matches: [] });
    expect(result.current.copy.title).toBe("Scent-to-Agave Finder");
  });

  it("toggles notes on and off", () => {
    const { result } = renderHook(() => useScentFinder(), { wrapper });
    act(() => result.current.toggleNote("Pine"));
    expect(result.current.isSelected("Pine")).toBe(true);
    act(() => result.current.toggleNote("Pine"));
    expect(result.current.isSelected("Pine")).toBe(false);
  });

  it("does nothing on find with no notes; otherwise matches and moves to step 2", () => {
    const { result } = renderHook(() => useScentFinder(), { wrapper });
    act(() => result.current.findMatches());
    expect(result.current.state.step).toBe(1);
    act(() => result.current.toggleNote("Anise"));
    act(() => result.current.findMatches());
    expect(result.current.state.step).toBe(2);
    expect(result.current.state.matches.map((m) => m.name)).toEqual(["Cuishe"]);
    act(() => result.current.reset());
    expect(result.current.state.step).toBe(1);
  });

  it("onNext moves forward one step or to a given step", () => {
    const { result } = renderHook(() => useScentFinder(), { wrapper });
    act(() => result.current.onNext());
    expect(result.current.state.step).toBe(2);
    act(() => result.current.onNext(1));
    expect(result.current.state.step).toBe(1);
  });
});
