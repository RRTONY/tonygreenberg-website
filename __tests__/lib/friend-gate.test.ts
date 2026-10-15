import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { sendEmail } from "@/lib/email";
import { checkFriendEmail, createGate, getGateStatus, getSlot, requestCode, saveSurvey, verifyCode } from "@/lib/friend-gate";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const TOKEN = "a".repeat(64);
const future = () => new Date(Date.now() + 600_000).toISOString();
const past = () => new Date(Date.now() - 600_000).toISOString();

function slot(over: Record<string, unknown> = {}) {
  return {
    id: 7,
    session_id: 3,
    friend_name: "Kim",
    contact_hash: sha("kim@example.com"),
    otp_hash: sha("123456"),
    otp_expires_at: future(),
    otp_attempts: 0,
    verified: false,
    responded_at: null,
    friend_gate_sessions: { seeker_name: "Tony" },
    ...over,
  };
}
const withSlot = (s: object | null) => fakeSupabase.maybeSingle.mockResolvedValueOnce({ data: s, error: null });

afterEach(() => {
  vi.useRealTimers();
});

describe("checkFriendEmail", () => {
  it("accepts a normal email and rejects malformed or disposable ones", () => {
    expect(checkFriendEmail("kim@example.com")).toBeNull();
    expect(checkFriendEmail("not-an-email")).toBe("Enter a valid email address.");
    expect(checkFriendEmail("x@Mailinator.com")).toBe("Disposable email addresses are not accepted.");
  });
});

describe("createGate", () => {
  it("creates the session and three slots, and emails each friend their own link", async () => {
    fakeSupabase.single.mockResolvedValueOnce({ data: { id: 3 }, error: null });
    const friends = [
      { name: "Kim", email: " Kim@Example.com " },
      { name: "<b>Dar</b>", email: "d@example.com" },
      { name: "Al", email: "a@example.com" },
    ];
    const seekerToken = await createGate("https://site.test", "Tony & Co", friends);
    expect(seekerToken).toMatch(/^[a-f0-9]{64}$/);
    const slots = fakeSupabase.insert.mock.calls[1][0] as { contact_value: string; contact_hash: string; survey_token: string; slot_index: number }[];
    expect(slots.map((s) => s.slot_index)).toEqual([0, 1, 2]);
    expect(slots[0]).toMatchObject({ contact_value: "Kim@Example.com", contact_hash: sha("kim@example.com") });
    expect(new Set(slots.map((s) => s.survey_token)).size).toBe(3);
    expect(sendEmail).toHaveBeenCalledTimes(3);
    const [, subject, html] = vi.mocked(sendEmail).mock.calls[1];
    expect(subject).toBe("Tony & Co needs your honest voice");
    expect(html).toContain(`https://site.test/friend-survey/${slots[1].survey_token}`);
    expect(html).toContain("&lt;b&gt;Dar&lt;/b&gt;");
    expect(html).not.toContain("<b>Dar</b>");
  });

  it("throws and sends nothing when the session can't be created", async () => {
    fakeSupabase.single.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    await expect(createGate("https://x", "T", [])).rejects.toThrow("db down");
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("getGateStatus", () => {
  it("returns null for an unknown seeker token", async () => {
    await expect(getGateStatus("nope")).resolves.toBeNull();
  });

  it("opens an expired pending gate and summarises verdicts without revealing who said what", async () => {
    fakeSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 3, status: "pending", expires_at: past() }, error: null });
    supabaseResult.data = [
      { slot_index: 0, friend_name: "Kim", verdict: "support", responded_at: "t", survey_response: { q6: "Zed note" } },
      { slot_index: 1, friend_name: "Dar", verdict: "wait", responded_at: "t", survey_response: { q6: "Alpha note" } },
      { slot_index: 2, friend_name: "Al", verdict: null, responded_at: null, survey_response: null },
    ];
    const s = await getGateStatus("seek");
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: "open" }));
    expect(s).toMatchObject({ status: "open", responded: 2, support: 1, wait: 1, unsure: 0, messages: ["Alpha note", "Zed note"] });
    expect(s!.friends).toEqual([
      { name: "Kim", responded: true },
      { name: "Dar", responded: true },
      { name: "Al", responded: false },
    ]);
  });
});

describe("getSlot", () => {
  it("refuses anything that isn't a 64-char hex token without querying", async () => {
    await expect(getSlot("../etc")).resolves.toBeNull();
    await expect(getSlot("A".repeat(64))).resolves.toBeNull();
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("returns the slot with the seeker name, defaulting it", async () => {
    withSlot(slot());
    await expect(getSlot(TOKEN)).resolves.toMatchObject({ id: 7, seekerName: "Tony" });
    withSlot(slot({ friend_gate_sessions: null }));
    await expect(getSlot(TOKEN)).resolves.toMatchObject({ seekerName: "Someone you know" });
  });
});

describe("requestCode", () => {
  it("refuses an invalid link, a finished survey or the wrong email", async () => {
    await expect(requestCode("bad", "kim@example.com")).resolves.toMatch(/invalid or has expired/);
    withSlot(slot({ responded_at: "t" }));
    await expect(requestCode(TOKEN, "kim@example.com")).resolves.toMatch(/already been completed/);
    withSlot(slot());
    await expect(requestCode(TOKEN, "other@example.com")).resolves.toMatch(/doesn't match/);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("stores only a hash of a fresh 6-digit code and emails the code", async () => {
    withSlot(slot());
    await expect(requestCode(TOKEN, " KIM@example.com ")).resolves.toBeNull();
    const [to, subject] = vi.mocked(sendEmail).mock.calls[0];
    const otp = subject.match(/(\d{6})$/)![1];
    expect(to).toBe("KIM@example.com");
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ otp_hash: sha(otp), otp_attempts: 0 }));
  });

  it("says so when the email can't be sent", async () => {
    withSlot(slot());
    vi.mocked(sendEmail).mockResolvedValueOnce(false);
    await expect(requestCode(TOKEN, "kim@example.com")).resolves.toMatch(/couldn't send the code/);
  });
});

describe("verifyCode", () => {
  it("verifies the right code and clears the stored hash", async () => {
    withSlot(slot());
    await expect(verifyCode(TOKEN, "123456")).resolves.toBeNull();
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ verified: true, otp_hash: null }));
  });

  it("counts a wrong attempt", async () => {
    withSlot(slot({ otp_attempts: 2 }));
    await expect(verifyCode(TOKEN, "654321")).resolves.toBe("Incorrect code. Please try again.");
    expect(fakeSupabase.update).toHaveBeenCalledWith({ otp_attempts: 3 });
  });

  it("refuses with no code requested, an expired code, or too many tries", async () => {
    withSlot(slot({ otp_hash: null }));
    await expect(verifyCode(TOKEN, "123456")).resolves.toMatch(/request a verification code first/);
    withSlot(slot({ otp_expires_at: past() }));
    await expect(verifyCode(TOKEN, "123456")).resolves.toMatch(/expired/);
    withSlot(slot({ otp_attempts: 5 }));
    await expect(verifyCode(TOKEN, "123456")).resolves.toMatch(/Too many tries/);
    withSlot(slot({ responded_at: "t" }));
    await expect(verifyCode(TOKEN, "123456")).resolves.toMatch(/already been completed/);
    expect(fakeSupabase.update).not.toHaveBeenCalled();
  });

  it("rejects a non-numeric code even if its hash were stored", async () => {
    withSlot(slot({ otp_hash: sha("abcdef") }));
    await expect(verifyCode(TOKEN, "abcdef")).resolves.toMatch(/Incorrect code/);
  });
});

describe("saveSurvey", () => {
  it("refuses unverified friends and second submissions", async () => {
    withSlot(slot());
    await expect(saveSurvey(TOKEN, {}, "support")).resolves.toMatch(/verify your identity first/);
    withSlot(slot({ verified: true, responded_at: "t" }));
    await expect(saveSurvey(TOKEN, {}, "support")).resolves.toMatch(/already submitted/);
    expect(fakeSupabase.update).not.toHaveBeenCalled();
  });

  it("blocks the gate when two of three friends say wait", async () => {
    withSlot(slot({ verified: true }));
    supabaseResult.data = [
      { verdict: "wait", responded_at: "t" },
      { verdict: "wait", responded_at: "t" },
      { verdict: "support", responded_at: "t" },
    ];
    await expect(saveSurvey(TOKEN, { q6: "hi" }, "wait")).resolves.toBeNull();
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ survey_response: { q6: "hi" }, verdict: "wait" }));
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: "blocked" }));
    expect(fakeSupabase.eq).toHaveBeenCalledWith("status", "pending");
  });

  it("opens the gate with fewer than two waits, and does nothing until all three answered", async () => {
    withSlot(slot({ verified: true }));
    supabaseResult.data = [
      { verdict: "wait", responded_at: "t" },
      { verdict: "unsure", responded_at: "t" },
      { verdict: "support", responded_at: "t" },
    ];
    await saveSurvey(TOKEN, {}, "support");
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: "open" }));

    fakeSupabase.update.mockClear();
    withSlot(slot({ verified: true }));
    supabaseResult.data = [{ verdict: "wait", responded_at: "t" }];
    await saveSurvey(TOKEN, {}, "wait");
    expect(fakeSupabase.update).toHaveBeenCalledTimes(1);
  });
});
