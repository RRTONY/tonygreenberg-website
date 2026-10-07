import "server-only";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";

export type CalibrationRow = {
  id: number;
  created_at: string;
  rankings: string[];
  pairwise_choices: unknown[];
  dim_scores: Record<string, number>;
};

// Totals for every calibration, and the anonymized rows of those who opted in.
export async function getPriResearch(): Promise<{ total: number; optIn: number; rows: CalibrationRow[] }> {
  const db = createServiceRoleClient();
  const [all, opted, rows] = await Promise.all([
    db.from("pri_calibrations").select("id", { count: "exact", head: true }),
    db.from("pri_calibrations").select("id", { count: "exact", head: true }).eq("research_opt_in", true),
    db.from("pri_calibrations").select("id, created_at, rankings, pairwise_choices, dim_scores").eq("research_opt_in", true).order("created_at", { ascending: false }).limit(1000),
  ]);
  return { total: all.count ?? 0, optIn: opted.count ?? 0, rows: (rows.data ?? []) as CalibrationRow[] };
}

export type PriLiveStats = { total: number; optIn: number; avgScores: Record<string, number> };

// Public, aggregate-only numbers for /pri-efficacy's "Live Calibrations" tab (no rows leave the
// server). Null when Supabase isn't configured or the table isn't there yet, so the page can say
// so instead of showing a fake zero.
export async function getPriLiveStats(): Promise<PriLiveStats | null> {
  if (!isServiceRoleConfigured()) return null;
  const db = createServiceRoleClient();
  const [opted, rows] = await Promise.all([
    db.from("pri_calibrations").select("id", { count: "exact", head: true }).eq("research_opt_in", true),
    db.from("pri_calibrations").select("dim_scores", { count: "exact" }).limit(5000),
  ]);
  if (opted.error || rows.error) return null;

  const sums: Record<string, { sum: number; n: number }> = {};
  for (const { dim_scores } of (rows.data ?? []) as { dim_scores: Record<string, number> | null }[]) {
    for (const [dim, score] of Object.entries(dim_scores ?? {})) {
      if (!Number.isFinite(score)) continue;
      sums[dim] ??= { sum: 0, n: 0 };
      sums[dim].sum += score;
      sums[dim].n += 1;
    }
  }
  const avgScores = Object.fromEntries(Object.entries(sums).map(([dim, { sum, n }]) => [dim, sum / n]));
  return { total: rows.count ?? 0, optIn: opted.count ?? 0, avgScores };
}
