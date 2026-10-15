import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookieJar } from "@tests/helpers/next";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { recordAssessmentResult, setJourneyStep, syncJourneyProgress } from "@/app/assessments/actions";

const SID = "11111111-2222-3333-4444-555555555555";

function signIn(id = "user-1") {
  fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id } }, error: null } as never);
}

describe("recordAssessmentResult", () => {
  beforeEach(() => {
    cookieJar.set("tg_sid", SID);
    supabaseResult.data = [];
  });

  it("saves a new result against this browser's session", async () => {
    await recordAssessmentResult({ assessment: "grant-study", summary: "  Warm relationships  ", score: 72.6 });
    expect(fakeSupabase.from).toHaveBeenCalledWith("assessment_results");
    expect(fakeSupabase.insert).toHaveBeenCalledWith({
      assessment: "grant-study",
      session_id: SID,
      user_id: null,
      summary: "Warm relationships",
      score: 73,
    });
  });

  it("ignores an assessment key that isn't a plain slug", async () => {
    await recordAssessmentResult({ assessment: "Grant Study; drop table" });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("does nothing when the database isn't configured", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    await recordAssessmentResult({ assessment: "grant-study" });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("fills in the earlier row for the same finish instead of adding a second one", async () => {
    supabaseResult.data = [{ id: 9, assessment: "grant-study", summary: null, score: null }];
    await recordAssessmentResult({ assessment: "grant-study", summary: "Purpose", score: 40 });
    expect(fakeSupabase.update).toHaveBeenCalledWith({ summary: "Purpose", score: 40 });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("id", 9);
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("stops saving after 20 results in half an hour from one browser", async () => {
    supabaseResult.data = Array.from({ length: 20 }, (_, i) => ({ id: i, assessment: "other", summary: null, score: null }));
    await recordAssessmentResult({ assessment: "grant-study" });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("marks the journey step for a signed-in member", async () => {
    signIn();
    await recordAssessmentResult({ assessment: "grant-study", journeyId: "grant-study" });
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      { user_id: "user-1", experience_id: "grant-study" },
      { onConflict: "user_id,experience_id" },
    );
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "user-1" }));
  });
});

describe("syncJourneyProgress", () => {
  it("returns null for a visitor who isn't signed in", async () => {
    await expect(syncJourneyProgress(["grant-study"])).resolves.toBeNull();
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("merges valid local ids into the account and returns the full list", async () => {
    signIn();
    supabaseResult.data = [{ experience_id: "grant-study" }, { experience_id: "the-mirror" }];
    await expect(syncJourneyProgress(["grant-study", "Not Valid!"])).resolves.toEqual(["grant-study", "the-mirror"]);
    expect(fakeSupabase.upsert).toHaveBeenCalledWith([{ user_id: "user-1", experience_id: "grant-study" }], {
      onConflict: "user_id,experience_id",
      ignoreDuplicates: true,
    });
  });
});

describe("setJourneyStep", () => {
  it("ticks a step for a signed-in member", async () => {
    signIn();
    await setJourneyStep("dharma-finder", true);
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      { user_id: "user-1", experience_id: "dharma-finder" },
      { onConflict: "user_id,experience_id" },
    );
  });

  it("unticks a step by deleting only that member's row", async () => {
    signIn();
    await setJourneyStep("dharma-finder", false);
    expect(fakeSupabase.delete).toHaveBeenCalled();
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("experience_id", "dharma-finder");
  });

  it("does nothing for a visitor who isn't signed in", async () => {
    await setJourneyStep("dharma-finder", true);
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });
});

// A database outage must never reach the visitor: each action logs and carries on.
function databaseThrows() {
  vi.mocked(createServiceRoleClient).mockImplementation(() => {
    throw new Error("db down");
  });
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

describe("when the database fails or isn't set up", () => {
  it("recordAssessmentResult logs the failure instead of throwing", async () => {
    const log = databaseThrows();
    await expect(recordAssessmentResult({ assessment: "grant-study" })).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("recordAssessmentResult failed", expect.objectContaining({ message: "db down" }));
  });

  it("recordAssessmentResult leaves a complete earlier row alone and drops an unusable score", async () => {
    cookieJar.set("tg_sid", SID);
    supabaseResult.data = [{ id: 3, assessment: "grant-study", summary: "Kept", score: 10 }];
    await recordAssessmentResult({ assessment: "grant-study", summary: "New", score: Number.NaN });
    expect(fakeSupabase.update).not.toHaveBeenCalled();
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("syncJourneyProgress returns null when the database isn't configured", async () => {
    signIn();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    await expect(syncJourneyProgress(["grant-study"])).resolves.toBeNull();
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("syncJourneyProgress returns null and logs when the database throws", async () => {
    signIn();
    const log = databaseThrows();
    await expect(syncJourneyProgress(["grant-study"])).resolves.toBeNull();
    expect(log).toHaveBeenCalledWith("syncJourneyProgress failed", expect.any(Error));
  });

  it("syncJourneyProgress skips the merge when there's nothing valid to merge, and handles no rows", async () => {
    signIn();
    supabaseResult.data = null;
    await expect(syncJourneyProgress("nope" as unknown as string[])).resolves.toEqual([]);
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("setJourneyStep ignores a bad id and an unconfigured database", async () => {
    signIn();
    await setJourneyStep("Not Valid!", true);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    await setJourneyStep("dharma-finder", true);
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("setJourneyStep logs the failure instead of throwing", async () => {
    signIn();
    const log = databaseThrows();
    await expect(setJourneyStep("dharma-finder", true)).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("setJourneyStep failed", expect.any(Error));
  });
});
