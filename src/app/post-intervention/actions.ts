"use server";

import { randomUUID } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { esc, sendEmail } from "@/lib/email";

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

// The page tells visitors "Results go to tony@tonygreenberg.com", so every
// saved check-in is emailed there too. Nothing identifying is collected.
const OWNER_EMAIL = "tony@tonygreenberg.com";

const score = (n: unknown) => (Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 10 ? (n as number) : null);
const text = (v: unknown, max = 5000) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

// Saves an anonymous post-intervention check-in, then emails it to Tony.
// Validates everything on the server (the browser only enables Submit once
// the four ratings are in). A failed email never fails the submission.
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

  const row = {
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
  };
  const { error } = await createServiceRoleClient().from("post_intervention_assessments").insert(row);
  if (error) {
    console.error("[post-intervention] insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  const rows: [string, string | null][] = [
    ["Day", `Day ${row.day_choice}`],
    ["Type", row.intervention_type],
    ["Facilitator", row.facilitator_ref],
    ["Integration", `${integration}/10`],
    ["Safety", `${safety}/10`],
    ["Trust", `${trust}/10`],
    ["Would recommend", row.would_recommend],
    ["Went well", row.went_well],
    ["Could improve", row.could_improve],
    ["Message to facilitator", row.message_to_facilitator],
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v as string)}</td></tr>`,
    )
    .join("");
  await sendEmail(
    OWNER_EMAIL,
    `Post-intervention check-in: day ${row.day_choice}, ${row.intervention_type}`,
    `<p>An anonymous post-intervention check-in came in. It's saved in Supabase (post_intervention_assessments).</p><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${table}</table>`,
  );
  return { ok: true };
}
