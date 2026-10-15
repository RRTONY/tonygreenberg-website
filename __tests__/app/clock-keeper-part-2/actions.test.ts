import { describe, expect, it, vi } from "vitest";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { submitClockKeeper, type ClockKeeperValues } from "@/app/clock-keeper-part-2/actions";

const EMPTY: ClockKeeperValues = { respondentName: "", respondentEmail: "", q1: "", q2: "", q3: "", q4: "", q5: "", reframe: "" };
const ANSWER = "The clock keeps time so the rest of us can keep faith.";

describe("submitClockKeeper", () => {
  it("asks for more when no answer is longer than 10 characters", async () => {
    await expect(submitClockKeeper({ ...EMPTY, q1: "short", q2: "   tiny   " })).resolves.toEqual({
      ok: false,
      error: "Write a little more in at least one answer before leaving your trace.",
    });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    await expect(submitClockKeeper({ ...EMPTY, q3: ANSWER, respondentEmail: "not-an-email" })).resolves.toEqual({
      ok: false,
      error: "That email address doesn't look right.",
    });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("saves an anonymous response with trimmed answers and empty fields as null", async () => {
    await expect(submitClockKeeper({ ...EMPTY, q2: `  ${ANSWER}  ` })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("clock_keeper_responses");
    expect(fakeSupabase.insert).toHaveBeenCalledWith({
      respondent_name: null,
      respondent_email: null,
      q1: "",
      q2: ANSWER,
      q3: "",
      q4: "",
      q5: "",
      reframe: "",
      user_id: null,
    });
  });

  it("links the response to a signed-in member and keeps their name and email", async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "member-7" } }, error: null } as never);
    await submitClockKeeper({ ...EMPTY, reframe: ANSWER, respondentName: "Ada", respondentEmail: "ada@example.com" });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ respondent_name: "Ada", respondent_email: "ada@example.com", reframe: ANSWER, user_id: "member-7" }),
    );
  });

  it("caps very long answers at 20,000 characters", async () => {
    await submitClockKeeper({ ...EMPTY, q1: "x".repeat(25_000) });
    const row = vi.mocked(fakeSupabase.insert).mock.calls[0][0] as { q1: string };
    expect(row.q1).toHaveLength(20_000);
  });

  it("returns a friendly error when saving fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    supabaseResult.error = { message: "db down" };
    await expect(submitClockKeeper({ ...EMPTY, q1: ANSWER })).resolves.toEqual({
      ok: false,
      error: "Your response couldn't be saved just now. Please try again in a minute.",
    });
  });
});
