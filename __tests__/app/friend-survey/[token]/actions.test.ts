import { describe, expect, it, vi } from "vitest";
import { sendCode, checkCode, submitFriendSurvey } from "@/app/friend-survey/[token]/actions";
import { requestCode, verifyCode, saveSurvey } from "@/lib/friend-gate";

vi.mock("@/lib/friend-gate", () => ({ requestCode: vi.fn(), verifyCode: vi.fn(), saveSurvey: vi.fn() }));

describe("friend survey actions", () => {
  it("sendCode passes the email through (capped) and returns any error", async () => {
    vi.mocked(requestCode).mockResolvedValue(null);
    await expect(sendCode("t", "me@example.com")).resolves.toEqual({});
    expect(requestCode).toHaveBeenCalledWith("t", "me@example.com");
    vi.mocked(requestCode).mockResolvedValue("That email doesn't match.");
    await expect(sendCode("t", "x".repeat(400))).resolves.toEqual({ error: "That email doesn't match." });
    expect(vi.mocked(requestCode).mock.calls[1][1]).toHaveLength(320);
  });

  it("checkCode trims the code", async () => {
    vi.mocked(verifyCode).mockResolvedValue(null);
    await expect(checkCode("t", " 123456 ")).resolves.toEqual({});
    expect(verifyCode).toHaveBeenCalledWith("t", "123456");
  });

  it("needs the overall verdict", async () => {
    await expect(submitFriendSurvey("t", { q1: 3 })).resolves.toEqual({ error: expect.stringMatching(/question 5/) });
    await expect(submitFriendSurvey("t", { q5: "maybe" })).resolves.toMatchObject({ error: expect.any(String) });
    expect(saveSurvey).not.toHaveBeenCalled();
  });

  it("keeps only valid answers: 1-5 scales, the verdict and trimmed text", async () => {
    vi.mocked(saveSurvey).mockResolvedValue(null);
    const res = await submitFriendSurvey("t", { q1: 5, q2: 0, q3: 2.5, q4: "4", q5: "wait", q6: `  ${"x".repeat(2500)} `, junk: "drop" });
    expect(res).toEqual({});
    const [token, clean, verdict] = vi.mocked(saveSurvey).mock.calls[0];
    expect(token).toBe("t");
    expect(verdict).toBe("wait");
    expect(Object.keys(clean).sort()).toEqual(["q1", "q5", "q6"]);
    expect(clean.q1).toBe(5);
    expect(clean.q6).toHaveLength(2000);
  });

  it("returns the save error", async () => {
    vi.mocked(saveSurvey).mockResolvedValue("Already submitted.");
    await expect(submitFriendSurvey("t", { q5: "support" })).resolves.toEqual({ error: "Already submitted." });
  });
});
