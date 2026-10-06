"use server";

import { randomUUID } from "node:crypto";
import { DIMS, type DimKey } from "@/lib/content/pri-data";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// Saves one PRI calibration, anonymously (no name, email or account link),
// as legacy did; `research_opt_in` marks the ones shown on /pri-research.
export async function saveCalibration(input: {
  rankings: string[];
  pairwiseChoices: { pair: [string, string]; chosen: string }[];
  dimScores: Record<string, number>;
  researchOptIn: boolean;
}): Promise<{ ok: boolean }> {
  const dims = new Set<string>(DIMS);
  const rankings = input.rankings.filter((d) => dims.has(d)) as DimKey[];
  const choices = input.pairwiseChoices
    .filter((c) => Array.isArray(c.pair) && c.pair.every((d) => dims.has(d)) && dims.has(c.chosen))
    .slice(0, 50);
  const scores = Object.fromEntries(
    Object.entries(input.dimScores)
      .filter(([k, v]) => dims.has(k) && Number.isFinite(v))
      .map(([k, v]) => [k, Math.max(0, Math.min(100, Math.round(v)))]),
  );
  if (rankings.length !== DIMS.length) return { ok: false };

  const { error } = await createServiceRoleClient().from("pri_calibrations").insert({
    session_id: randomUUID(),
    rankings,
    pairwise_choices: choices,
    dim_scores: scores,
    research_opt_in: input.researchOptIn === true,
  });
  if (error) console.error("[pri-calibration] save failed:", error.message);
  return { ok: !error };
}
