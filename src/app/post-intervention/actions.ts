"use server";

import { randomUUID } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const TYPES = ["psychedelic", "meditation", "breathwork", "ceremony", "other"] as const;
const RECOMMEND = ["yes", "no", "unsure"] as const;
const DAYS = [1, 3, 7] as const;

export type PostInterventionInput = {
  dayChoice: number;
  interventionType: string;
  facilitatorRef: string;
  integrationScore: number;
  safetyScore: number;
  trustScore: number;
  wouldRecommend: string;
  wentWell: string;
  couldImprove: string;
  messageToFacilitator: string;
};

const score = (n: unknown) => (Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 10 ? (n as number) : null);
const text = (v: unknown, max = 5000) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

// Saves an anonymous post-intervention check-in. Validates everything on
// the server (the browser only enables Submit once the four ratings are in).
export async function submitPostIntervention(input: PostInterventionInput): Promise<{ ok: boolean; error?: string }> {
  const integration = score(input.integrationScore);
  const safety = score(input.safetyScore);
  const trust = score(input.trustScore);
  if (
    !DAYS.includes(input.dayChoice as (typeof DAYS)[number]) ||
    !TYPES.includes(input.interventionType as (typeof TYPES)[number]) ||
    !RECOMMEND.includes(input.wouldRecommend as (typeof RECOMMEND)[number]) ||
    integration === null ||
    safety === null ||
    trust === null
  ) {
    return { ok: false, error: "Please rate integration, safety, trust, and recommendation to continue." };
  }

  const { error } = await createServiceRoleClient()
    .from("post_intervention_assessments")
    .insert({
      session_token: randomUUID(),
      day_choice: input.dayChoice,
      intervention_type: input.interventionType,
      facilitator_ref: text(input.facilitatorRef, 256),
      integration_score: integration,
      safety_score: safety,
      trust_score: trust,
      would_recommend: input.wouldRecommend,
      went_well: text(input.wentWell),
      could_improve: text(input.couldImprove),
      message_to_facilitator: text(input.messageToFacilitator),
    });
  if (error) {
    console.error("[post-intervention] insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
