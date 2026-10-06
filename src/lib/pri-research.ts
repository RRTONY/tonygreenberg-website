import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

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
