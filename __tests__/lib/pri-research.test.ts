import { describe, expect, it, vi } from "vitest";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { getPriLiveStats, getPriResearch } from "@/lib/pri-research";

describe("getPriResearch", () => {
  it("returns totals and only the opted-in rows", async () => {
    supabaseResult.count = 12;
    supabaseResult.data = [{ id: 1, created_at: "2026-01-01", rankings: [], pairwise_choices: [], dim_scores: {} }];
    const r = await getPriResearch();
    expect(r).toEqual({ total: 12, optIn: 12, rows: supabaseResult.data });
    expect(fakeSupabase.from).toHaveBeenCalledWith("pri_calibrations");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("research_opt_in", true);
    expect(fakeSupabase.limit).toHaveBeenCalledWith(1000);
  });

  it("falls back to zeros and [] when nothing comes back", async () => {
    await expect(getPriResearch()).resolves.toEqual({ total: 0, optIn: 0, rows: [] });
  });
});

describe("getPriLiveStats", () => {
  it("is null when Supabase isn't configured", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    await expect(getPriLiveStats()).resolves.toBeNull();
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("is null when the query errors (e.g. table missing)", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    supabaseResult.error = { message: "relation does not exist" };
    await expect(getPriLiveStats()).resolves.toBeNull();
  });

  it("averages each dimension, skipping nulls and non-finite scores", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    supabaseResult.count = 3;
    supabaseResult.data = [
      { dim_scores: { trust: 4, time: 2 } },
      { dim_scores: { trust: 2, time: Number.NaN } },
      { dim_scores: null },
    ];
    await expect(getPriLiveStats()).resolves.toEqual({ total: 3, optIn: 3, avgScores: { trust: 3, time: 2 } });
  });
});
