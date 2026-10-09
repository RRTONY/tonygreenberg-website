"use server";

import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/auth";
import { visitorSessionId } from "@/lib/visitor-session";

// Quiz results and members' journey progress, ported from legacy's
// assessments.submit and journey.* routers so Manus can be switched off.
// Tables: supabase/migrations/0005_assessments.sql. Called from the browser
// by the shared completion helpers (journey-tracker.tsx's markComplete and
// result-log.ts's saveAssessmentResult), never awaited by the quiz itself:
// a failure here must not stop anyone seeing their result.

const isKey = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9_-]{1,80}$/.test(s);

// Both helpers can fire for the same finish (a quiz marks its journey step
// and logs its result), so a repeat within this window updates the first row
// instead of adding a second one.
const SAME_FINISH_MS = 30 * 60 * 1000;

export async function recordAssessmentResult(input: {
  assessment: string;
  journeyId?: string;
  summary?: string;
  score?: number;
}): Promise<void> {
  if (!isServiceRoleConfigured() || !isKey(input.assessment)) return;
  const summary = typeof input.summary === "string" ? input.summary.trim().slice(0, 500) || null : null;
  const score = typeof input.score === "number" && Number.isFinite(input.score) ? Math.round(input.score) : null;

  try {
    const [sid, user] = await Promise.all([visitorSessionId(true), getUser()]);
    const db = createServiceRoleClient();

    const since = new Date(Date.now() - SAME_FINISH_MS).toISOString();
    // One read covers both checks: this browser's recent results (light
    // flood guard: at most 20 per half hour) and an earlier row for the same
    // finish. The journey write runs alongside it.
    const [{ data: recent }] = await Promise.all([
      db
        .from("assessment_results")
        .select("id, assessment, summary, score")
        .eq("session_id", sid)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(20),
      user && isKey(input.journeyId)
        ? db.from("journey_progress").upsert({ user_id: user.id, experience_id: input.journeyId }, { onConflict: "user_id,experience_id" })
        : null,
    ]);
    const same = recent?.find((r) => r.assessment === input.assessment);
    if (!same && (recent?.length ?? 0) >= 20) return;

    if (same) {
      if ((summary && !same.summary) || (score !== null && same.score === null)) {
        await db
          .from("assessment_results")
          .update({ summary: same.summary ?? summary, score: same.score ?? score })
          .eq("id", same.id);
      }
      return;
    }

    await db.from("assessment_results").insert({
      assessment: input.assessment,
      session_id: sid,
      user_id: user?.id ?? null,
      summary,
      score,
    });
  } catch (err) {
    console.error("recordAssessmentResult failed", err);
  }
}

// Signed-in members only: merges this browser's finished experiences into
// their account and returns the full list, so progress follows them across
// devices. Returns null for visitors who aren't signed in.
export async function syncJourneyProgress(localIds: string[]): Promise<string[] | null> {
  if (!isServiceRoleConfigured()) return null;
  try {
    const user = await getUser();
    if (!user) return null;
    const db = createServiceRoleClient();
    const ids = Array.isArray(localIds) ? localIds.filter(isKey).slice(0, 100) : [];
    if (ids.length) {
      await db
        .from("journey_progress")
        .upsert(ids.map((id) => ({ user_id: user.id, experience_id: id })), { onConflict: "user_id,experience_id", ignoreDuplicates: true });
    }
    const { data } = await db.from("journey_progress").select("experience_id").eq("user_id", user.id);
    return (data ?? []).map((r) => r.experience_id as string);
  } catch (err) {
    console.error("syncJourneyProgress failed", err);
    return null;
  }
}

// The Journey Tracker's manual tick box, for signed-in members.
export async function setJourneyStep(experienceId: string, done: boolean): Promise<void> {
  if (!isServiceRoleConfigured() || !isKey(experienceId)) return;
  try {
    const user = await getUser();
    if (!user) return;
    const db = createServiceRoleClient();
    if (done) {
      await db.from("journey_progress").upsert({ user_id: user.id, experience_id: experienceId }, { onConflict: "user_id,experience_id" });
    } else {
      await db.from("journey_progress").delete().eq("user_id", user.id).eq("experience_id", experienceId);
    }
  } catch (err) {
    console.error("setJourneyStep failed", err);
  }
}
