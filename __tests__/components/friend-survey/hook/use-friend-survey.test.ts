import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFriendSurvey } from "@/components/friend-survey/hook/use-friend-survey";
import { checkCode, sendCode, submitFriendSurvey } from "@/app/friend-survey/[token]/actions";

vi.mock("@/app/friend-survey/[token]/actions", () => ({ sendCode: vi.fn(), checkCode: vi.fn(), submitFriendSurvey: vi.fn() }));

describe("useFriendSurvey", () => {
  beforeEach(() => {
    vi.mocked(sendCode).mockResolvedValue({});
    vi.mocked(checkCode).mockResolvedValue({});
    vi.mocked(submitFriendSurvey).mockResolvedValue({});
  });

  it("starts at identity, or straight at the questions when already verified", () => {
    expect(renderHook(() => useFriendSurvey("t", false)).result.current.state.step).toBe(1);
    expect(renderHook(() => useFriendSurvey("t", true)).result.current.state.step).toBe(3);
  });

  it("update() merges fields into the state", () => {
    const { result } = renderHook(() => useFriendSurvey("t", false));
    act(() => result.current.update({ email: "f@x.com", error: "x" }));
    expect(result.current.state).toMatchObject({ email: "f@x.com", error: "x", step: 1, pending: false });
  });

  it("requestCode sends the token and email, then moves to the code step", async () => {
    const { result } = renderHook(() => useFriendSurvey("tok", false));
    act(() => result.current.update({ email: "f@x.com" }));
    await act(() => result.current.requestCode());
    expect(sendCode).toHaveBeenCalledWith("tok", "f@x.com");
    expect(result.current.state).toMatchObject({ step: 2, pending: false, error: null });
  });

  it("verify checks the code and opens the questions; an error keeps the step", async () => {
    vi.mocked(checkCode).mockResolvedValueOnce({ error: "Wrong code." });
    const { result } = renderHook(() => useFriendSurvey("tok", false));
    await act(() => result.current.verify("123456"));
    expect(checkCode).toHaveBeenCalledWith("tok", "123456");
    expect(result.current.state).toMatchObject({ step: 1, error: "Wrong code.", pending: false });
    await act(() => result.current.verify("654321"));
    expect(result.current.state.step).toBe(3);
  });

  it("submit sends the answers and finishes on the thank-you step", async () => {
    const { result } = renderHook(() => useFriendSurvey("tok", true));
    act(() => result.current.update({ answers: { q1: 4, q5: "support" } }));
    await act(() => result.current.submit());
    expect(submitFriendSurvey).toHaveBeenCalledWith("tok", { q1: 4, q5: "support" });
    expect(result.current.state.step).toBe(4);
  });

  it("is pending while a call is in flight", async () => {
    let finish: (v: { error?: string }) => void = () => {};
    vi.mocked(sendCode).mockImplementationOnce(() => new Promise((r) => (finish = r)));
    const { result } = renderHook(() => useFriendSurvey("tok", false));
    let p: Promise<void> = Promise.resolve();
    act(() => {
      p = result.current.resendCode();
    });
    expect(result.current.state.pending).toBe(true);
    await act(async () => {
      finish({});
      await p;
    });
    expect(result.current.state).toMatchObject({ pending: false, step: 2 });
  });
});
