import { describe, expect, it } from "vitest";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { getOrCreateReferralCode, recordReferral } from "@/lib/referrals";

describe("getOrCreateReferralCode", () => {
  it("returns the member's existing code", async () => {
    supabaseResult.data = { code: "abc12" };
    await expect(getOrCreateReferralCode("u1")).resolves.toBe("abc12");
    expect(fakeSupabase.from).toHaveBeenCalledWith("referral_codes");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("creates and saves a url-safe code on first use", async () => {
    const code = await getOrCreateReferralCode("u1");
    expect(code).toMatch(/^[A-Za-z0-9_-]{7}$/);
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ user_id: "u1", code });
  });
});

describe("recordReferral", () => {
  it("records who invited the new member", async () => {
    supabaseResult.data = { user_id: "owner" };
    await recordReferral("new", "abc12");
    expect(fakeSupabase.from).toHaveBeenCalledWith("referrals");
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      { referrer_id: "owner", referred_user_id: "new", referral_code: "abc12" },
      { onConflict: "referred_user_id", ignoreDuplicates: true },
    );
  });

  it("ignores an unknown code", async () => {
    await recordReferral("new", "nope");
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();
  });

  it("ignores a member referring themselves", async () => {
    supabaseResult.data = { user_id: "same" };
    await recordReferral("same", "abc12");
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();
  });
});
