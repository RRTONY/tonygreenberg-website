import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookieJar } from "@tests/helpers/next";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";
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
