"use server";

import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/auth";
import { visitorSessionId } from "@/lib/visitor-session";
import { esc, sendEmail } from "@/lib/email";

// Reader engagement under each essay, ported from legacy's comments /
// reactions / blogRating / commitments / askTony routers. Tables:
// supabase/migrations/0002_blog_engagement.sql. Essay pages stay static, so
// these load from the browser after the page arrives (post-engagement.tsx).
// One anonymous id per browser (an httpOnly cookie, like legacy's session id)
// keeps reactions and ratings to one per essay. Tony gets an email for every
// comment and direct question, as on live.

const OWNER_EMAIL = "tony@tonygreenberg.com";
const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This isn't available just now. Please try again later.";

export type Reaction = "up" | "neutral" | "down";
export type Rating = "completely" | "partially" | "not-yet";

export type PostEngagement = {
  available: boolean;
  comments: { id: number; name: string; content: string; createdAt: string }[];
  reactions: { up: number; neutral: number; down: number; notes: { reaction: Reaction; comment: string }[] };
  myReaction: Reaction | null;
  myRating: Rating | null;
  commitments: string[];
  myCommitment: boolean;
};

type Result = { ok: boolean; error?: string };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isSlug = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9-]{1,200}$/.test(s);
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const configured = isServiceRoleConfigured;

const sessionId = visitorSessionId;

const EMPTY: PostEngagement = {
  available: false,
  comments: [],
  reactions: { up: 0, neutral: 0, down: 0, notes: [] },
  myReaction: null,
  myRating: null,
  commitments: [],
  myCommitment: false,
};

export async function loadPostEngagement(slug: string): Promise<PostEngagement> {
  if (!isSlug(slug) || !configured()) return EMPTY;
  const db = createServiceRoleClient();
  const sid = await sessionId(false);
  const [comments, reactions, rating, commitments] = await Promise.all([
    db.from("blog_comments").select("id, name, content, created_at").eq("post_slug", slug).eq("hidden", false).order("created_at", { ascending: false }).limit(200),
    db.from("blog_reactions").select("reaction, comment, session_id, created_at").eq("post_slug", slug).order("created_at", { ascending: false }).limit(2000),
    sid ? db.from("blog_ratings").select("rating").eq("post_slug", slug).eq("session_id", sid).maybeSingle() : null,
    db.from("blog_commitments").select("commitment, session_id").eq("post_slug", slug).order("created_at", { ascending: false }).limit(50),
  ]);
  if (comments.error || reactions.error || commitments.error) {
    console.error("[blog-engagement] load failed:", comments.error?.message ?? reactions.error?.message ?? commitments.error?.message);
    return EMPTY;
  }
  const counts = { up: 0, neutral: 0, down: 0 };
  for (const r of reactions.data) counts[r.reaction as Reaction]++;
  return {
    available: true,
    comments: comments.data.map((c) => ({ id: c.id, name: c.name, content: c.content, createdAt: c.created_at })),
    reactions: {
      ...counts,
      notes: reactions.data
        .filter((r) => r.comment)
        .slice(0, 5)
        .map((r) => ({ reaction: r.reaction as Reaction, comment: r.comment as string })),
    },
    myReaction: (sid && (reactions.data.find((r) => r.session_id === sid)?.reaction as Reaction)) || null,
    myRating: (rating?.data?.rating as Rating) ?? null,
    commitments: commitments.data.slice(0, 3).map((c) => c.commitment),
    myCommitment: !!sid && commitments.data.some((c) => c.session_id === sid),
  };
}

export async function addComment(input: {
  slug: string;
  postTitle: string;
  name: string;
  email: string;
  content: string;
  website?: string; // honeypot: a hidden field people never fill in
}): Promise<Result> {
  if (!isSlug(input.slug)) return { ok: false, error: "Something went wrong." };
  if (input.website) return { ok: true };
  if (!configured()) return { ok: false, error: UNAVAILABLE };
  const user = await getUser();
  const name = clip(input.name, 128) || clip(user?.user_metadata?.name, 128);
  const content = clip(input.content, 2000);
  const email = clip(input.email, 320);
  if (!name) return { ok: false, error: "Add your name." };
  if (!content) return { ok: false, error: "Write your thought first." };
  if (email && !isEmail(email)) return { ok: false, error: "That email address doesn't look right." };

  const sid = await sessionId(true);
  const db = createServiceRoleClient();
  // Light flood guard: at most 5 comments per browser per 10 minutes.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const recent = await db.from("blog_comments").select("id", { count: "exact", head: true }).eq("session_id", sid).gte("created_at", since);
  if ((recent.count ?? 0) >= 5) return { ok: false, error: "Thanks for all the thoughts. Please wait a few minutes before adding more." };

  const { error } = await db.from("blog_comments").insert({
    post_slug: input.slug,
    user_id: user?.id ?? null,
    name,
    email: email || null,
    session_id: sid,
    content,
  });
  if (error) {
    console.error("[blog-engagement] comment insert failed:", error.message);
    return { ok: false, error: "Your thought couldn't be saved just now. Please try again in a minute." };
  }
  const title = clip(input.postTitle, 300) || input.slug;
  await sendEmail(
    OWNER_EMAIL,
    `New reader comment on “${title}”`,
    `<p>From: ${esc(name)}${email ? ` &lt;${esc(email)}&gt;` : ""}</p><p>“${esc(content)}”</p><p><a href="${SITE}/blog/${input.slug}">${SITE}/blog/${input.slug}</a></p>`,
  );
  return { ok: true };
}

export async function react(input: { slug: string; reaction: Reaction; comment?: string }): Promise<Result> {
  if (!isSlug(input.slug) || !["up", "neutral", "down"].includes(input.reaction)) return { ok: false, error: "Something went wrong." };
  if (!configured()) return { ok: false, error: UNAVAILABLE };
  const sid = await sessionId(true);
  const { error } = await createServiceRoleClient()
    .from("blog_reactions")
    .insert({ post_slug: input.slug, reaction: input.reaction, session_id: sid, comment: clip(input.comment, 500) || null });
  // 23505 = already reacted from this browser: nothing to do.
  if (error && error.code !== "23505") {
    console.error("[blog-engagement] reaction insert failed:", error.message);
    return { ok: false, error: UNAVAILABLE };
  }
  return { ok: true };
}

export async function rate(input: { slug: string; rating: Rating }): Promise<Result> {
  if (!isSlug(input.slug) || !["completely", "partially", "not-yet"].includes(input.rating)) return { ok: false, error: "Something went wrong." };
  if (!configured()) return { ok: false, error: UNAVAILABLE };
  const sid = await sessionId(true);
  const { error } = await createServiceRoleClient().from("blog_ratings").insert({ post_slug: input.slug, rating: input.rating, session_id: sid });
  if (error && error.code !== "23505") {
    console.error("[blog-engagement] rating insert failed:", error.message);
    return { ok: false, error: UNAVAILABLE };
  }
  return { ok: true };
}

export async function commit(input: { slug: string; commitment: string }): Promise<Result> {
  const commitment = clip(input.commitment, 500);
  if (!isSlug(input.slug) || !commitment) return { ok: false, error: "Write what you'll do first." };
  if (!configured()) return { ok: false, error: UNAVAILABLE };
  const sid = await sessionId(true);
  const user = await getUser();
  const { error } = await createServiceRoleClient()
    .from("blog_commitments")
    .insert({ post_slug: input.slug, commitment, session_id: sid, user_id: user?.id ?? null });
  if (error) {
    console.error("[blog-engagement] commitment insert failed:", error.message);
    return { ok: false, error: UNAVAILABLE };
  }
  return { ok: true };
}

// "Ask Tony directly": emailed straight to Tony, nothing stored (as on live).
export async function askTony(input: { slug: string; postTitle: string; name: string; email: string; question: string; website?: string }): Promise<Result> {
  if (input.website) return { ok: true };
  const name = clip(input.name, 128);
  const question = clip(input.question, 2000);
  const email = clip(input.email, 320);
  if (!name) return { ok: false, error: "Add your name." };
  if (!question) return { ok: false, error: "Write your question first." };
  if (email && !isEmail(email)) return { ok: false, error: "That email address doesn't look right." };
  const title = clip(input.postTitle, 300);
  const sent = await sendEmail(
    OWNER_EMAIL,
    `Direct question from ${name}${title ? ` (re: “${title}”)` : ""}`,
    `<p>From: ${esc(name)}${email ? ` &lt;${esc(email)}&gt;` : ""}</p><p>“${esc(question)}”</p>${
      isSlug(input.slug) ? `<p><a href="${SITE}/blog/${input.slug}">${SITE}/blog/${input.slug}</a></p>` : ""
    }`,
  );
  return sent ? { ok: true } : { ok: false, error: UNAVAILABLE };
}
