"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/auth";

export type ClockKeeperValues = {
  respondentName: string;
  respondentEmail: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  reframe: string;
};

const MAX_ANSWER = 20_000;
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Saves a Clock Keeper response (anonymous allowed). Same rule as legacy:
// at least one answer with more than 10 characters.
export async function submitClockKeeper(values: ClockKeeperValues): Promise<{ ok: boolean; error?: string }> {
  const answers = {
    q1: clip(values.q1, MAX_ANSWER),
    q2: clip(values.q2, MAX_ANSWER),
    q3: clip(values.q3, MAX_ANSWER),
    q4: clip(values.q4, MAX_ANSWER),
    q5: clip(values.q5, MAX_ANSWER),
    reframe: clip(values.reframe, MAX_ANSWER),
  };
  if (!Object.values(answers).some((a) => a.length > 10)) {
    return { ok: false, error: "Write a little more in at least one answer before leaving your trace." };
  }
  const email = clip(values.respondentEmail, 320);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "That email address doesn't look right." };

  const user = await getUser();
  const { error } = await createServiceRoleClient()
    .from("clock_keeper_responses")
    .insert({ respondent_name: clip(values.respondentName, 256) || null, respondent_email: email || null, ...answers, user_id: user?.id ?? null });
  if (error) {
    console.error("[clock-keeper] insert failed:", error.message);
    return { ok: false, error: "Your response couldn't be saved just now. Please try again in a minute." };
  }
  return { ok: true };
}
