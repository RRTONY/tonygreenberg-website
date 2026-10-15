import { describe, expect, it, vi } from "vitest";
import { submitPostIntervention, type PostInterventionInput } from "@/app/post-intervention/actions";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { sendEmail } from "@/lib/email";

const valid: PostInterventionInput = {
  dayChoice: 3,
  interventionType: "breathwork",
  facilitatorRef: "",
  integrationScore: 7,
  safetyScore: 9,
  trustScore: 8,
  wouldRecommend: "yes",
  wentWell: "  Calm room  ",
  couldImprove: "",
  messageToFacilitator: "<script>x</script>",
};

describe("submitPostIntervention", () => {
  it("needs a known day, type, recommendation and 1-10 scores", async () => {
    for (const bad of [
      { dayChoice: 2 },
      { interventionType: "skydiving" },
      { wouldRecommend: "maybe" },
      { integrationScore: 0 },
      { safetyScore: 11 },
      { trustScore: 7.5 },
    ]) {
      await expect(submitPostIntervention({ ...valid, ...bad })).resolves.toMatchObject({ ok: false });
    }
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("saves an anonymous row, empty text as null, and emails Tony an escaped summary", async () => {
    await expect(submitPostIntervention(valid)).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("post_intervention_assessments");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        session_token: expect.stringMatching(/^[0-9a-f-]{36}$/),
        day_choice: 3,
        facilitator_ref: null,
        went_well: "Calm room",
        could_improve: null,
        integration_score: 7,
      }),
    );
    const [to, subject, html] = vi.mocked(sendEmail).mock.calls[0];
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toBe("Post-intervention check-in: day 3, breathwork");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("Facilitator<");
  });

  it("reports a failed save and sends no email", async () => {
    supabaseResult.error = { message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(submitPostIntervention(valid)).resolves.toEqual({ ok: false, error: "Something went wrong. Please try again." });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("still succeeds when the email fails", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce(false);
    await expect(submitPostIntervention(valid)).resolves.toEqual({ ok: true });
  });
});
