"use server";

import { getUser } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { visitorSessionId } from "@/lib/visitor-session";
import { esc, sendEmail } from "@/lib/email";

// The GemSpark's reader features, ported from its Manus app's tRPC routers
// (stories.submit, analytics.trackView / getCounts, featured.list) onto this
// site's Supabase (tables: supabase/migrations/0008_gemspark.sql). No sign-in,
// as on the Manus app. Tony is emailed every story, as its notifyOwner did.
// The newsletter goes to Kit through /api/subscribe instead (no table here).

const OWNER_EMAIL = "tony@tonygreenberg.com";
const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This couldn't be sent just now. Please try again in a minute.";

export type GemSparkResult = { ok: true } | { ok: false; error: string };
export type GemSparkPage = "long-form" | "short-form";
export type GemSparkCounts = { longForm: number; shortForm: number };
export type FeaturedSpark = { id: string; name: string; story: string; tagline: string | null; location: string | null };

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** "Share Your Spark" (stories.submit): a story of at least 10 characters, optional email. */
export async function submitGemSparkStory(input: { story: string; email?: string }): Promise<GemSparkResult> {
  const story = typeof input.story === "string" ? input.story.trim().slice(0, 10000) : "";
  const email = typeof input.email === "string" ? input.email.trim().slice(0, 320) : "";
  if (story.length < 10) return { ok: false, error: "Story must be at least 10 characters" };
  if (email && !isEmail(email)) return { ok: false, error: "That email address doesn't look right." };
  if (!isServiceRoleConfigured()) return { ok: false, error: UNAVAILABLE };
  const sid = await visitorSessionId(true);
  const db = createServiceRoleClient();
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const recent = await db
    .from("gemspark_story_submissions")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sid)
    .gte("created_at", since);
  if ((recent.count ?? 0) >= 5) return { ok: false, error: "Thanks, we have this already. Please wait a few minutes before sending more." };
  const { data, error } = await db
    .from("gemspark_story_submissions")
    .insert({ story, email: email || null, session_id: sid, user_id: (await getUser())?.id ?? null })
    .select("id")
    .single();
  if (error) {
    console.error("[gemspark] story insert failed:", error.message);
    return { ok: false, error: UNAVAILABLE };
  }
  await sendEmail(
    OWNER_EMAIL,
    "The GemSpark: a reader shared their spark",
    `<p>A reader shared their synchronicity story on The GemSpark.</p>` +
      `<p style="color:#666">Email: ${esc(email || "Not provided")}<br>Submission: ${esc(String(data.id))}</p>` +
      `<p style="white-space:pre-wrap">${esc(story)}</p>` +
      `<p><a href="${SITE}/gem-spark">${SITE}/gem-spark</a></p>`,
  );
  return { ok: true };
}

/** analytics.trackView: one read per browser per page per 30 minutes. Never throws. */
export async function trackGemSparkView(page: GemSparkPage): Promise<void> {
  if (page !== "long-form" && page !== "short-form") return;
  if (!isServiceRoleConfigured()) return;
  try {
    const sid = await visitorSessionId(true);
    const db = createServiceRoleClient();
    const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const recent = await db
      .from("gemspark_page_views")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sid)
      .eq("page", page)
      .gte("created_at", since);
    if ((recent.count ?? 0) > 0) return;
    const { error } = await db.from("gemspark_page_views").insert({ page, session_id: sid });
    if (error) console.error("[gemspark] view insert failed:", error.message);
  } catch (e) {
    console.error("[gemspark] trackView failed:", e);
  }
}

/** analytics.getCounts: total reads of the long and short versions, for the Impact Report. */
export async function getGemSparkCounts(): Promise<GemSparkCounts | null> {
  if (!isServiceRoleConfigured()) return null;
  const db = createServiceRoleClient();
  const [long, short] = await Promise.all([
    db.from("gemspark_page_views").select("id", { count: "exact", head: true }).eq("page", "long-form"),
    db.from("gemspark_page_views").select("id", { count: "exact", head: true }).eq("page", "short-form"),
  ]);
  if (long.error || short.error) {
    console.error("[gemspark] counts failed:", long.error?.message ?? short.error?.message);
    return null;
  }
  return { longForm: long.count ?? 0, shortForm: short.count ?? 0 };
}

/** featured.list: the reader stories Tony marked active, in display order. */
export async function getFeaturedSparks(): Promise<FeaturedSpark[]> {
  if (!isServiceRoleConfigured()) return [];
  const { data, error } = await createServiceRoleClient()
    .from("gemspark_featured_sparks")
    .select("id, name, story, tagline, location")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) {
    console.error("[gemspark] featured failed:", error.message);
    return [];
  }
  return (data as { id: number; name: string; story: string; tagline: string | null; location: string | null }[]).map((r) => ({
    ...r,
    id: String(r.id),
  }));
}
