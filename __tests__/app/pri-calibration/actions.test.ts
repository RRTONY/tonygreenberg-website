import { describe, expect, it, vi } from "vitest";
import { saveCalibration } from "@/app/pri-calibration/actions";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { DIMS } from "@/lib/content/pri-data";

const valid = () => ({
  rankings: [...DIMS],
  pairwiseChoices: [{ pair: ["medical", "setting"] as [string, string], chosen: "medical" }],
  dimScores: { medical: 72.4, setting: 40 },
  researchOptIn: true,
});

describe("saveCalibration", () => {
  it("saves an anonymous calibration to pri_calibrations", async () => {
    await expect(saveCalibration(valid())).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("pri_calibrations");
    const row = fakeSupabase.insert.mock.calls[0][0];
    expect(row).toMatchObject({
      rankings: DIMS,
      pairwise_choices: [{ pair: ["medical", "setting"], chosen: "medical" }],
      dim_scores: { medical: 72, setting: 40 },
      research_opt_in: true,
    });
    expect(row.session_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Object.keys(row)).not.toContain("email");
  });

  it("refuses a ranking that doesn't cover all six dimensions", async () => {
    await expect(saveCalibration({ ...valid(), rankings: ["medical", "setting"] })).resolves.toEqual({ ok: false });
    await expect(saveCalibration({ ...valid(), rankings: [...DIMS.slice(0, 5), "not-a-dim"] })).resolves.toEqual({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("drops unknown dimensions and bad numbers, clamps scores to 0-100 and caps choices at 50", async () => {
    await saveCalibration({
      ...valid(),
      pairwiseChoices: [
        ...Array.from({ length: 60 }, () => ({ pair: ["medical", "intention"] as [string, string], chosen: "intention" })),
        { pair: ["medical", "bogus"], chosen: "medical" },
      ],
      dimScores: { medical: 140, setting: -5, intention: Number.NaN, bogus: 50 },
    });
    const row = fakeSupabase.insert.mock.calls[0][0];
    expect(row.pairwise_choices).toHaveLength(50);
    expect(row.dim_scores).toEqual({ medical: 100, setting: 0 });
  });

  it("only marks research opt-in when it is exactly true", async () => {
    await saveCalibration({ ...valid(), researchOptIn: "yes" as unknown as boolean });
    expect(fakeSupabase.insert.mock.calls[0][0].research_opt_in).toBe(false);
  });

  it("reports failure when the database refuses the row", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    supabaseResult.error = { message: "relation does not exist" };
    await expect(saveCalibration(valid())).resolves.toEqual({ ok: false });
    expect(err).toHaveBeenCalled();
  });
});
