import "server-only";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { esc, sendEmail } from "@/lib/email";
import { TRUST_QUOTE } from "@/lib/content/friend-gate";

// Server side of the Three Friends Gate, ported from legacy
// server/routers/friendGate.ts + friendGateNotify.ts. Email only (owner's
// choice, 2026-10-06): Resend sends the invites and one-time codes.
// Tables: friend_gate_sessions / friend_gate_slots (service role only).
const GATE_HOURS = 72;
const OTP_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com", "yopmail.com", "sharklasers.com", "spam4.me",
  "trashmail.com", "trashmail.me", "trashmail.net", "dispostable.com", "mailnull.com", "maildrop.cc", "discard.email",
  "fakeinbox.com", "tempinbox.com", "throwaway.email", "getairmail.com", "filzmail.com",
]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const token = () => randomBytes(32).toString("hex");
const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const hashContact = (email: string) => sha(email.toLowerCase().trim());
const db = () => createServiceRoleClient();

export type GateStatus = "pending" | "open" | "blocked";

export function checkFriendEmail(email: string): string | null {
  if (!EMAIL.test(email.trim())) return "Enter a valid email address.";
  if (DISPOSABLE_DOMAINS.has(email.split("@")[1]?.toLowerCase() ?? "")) return "Disposable email addresses are not accepted.";
  return null;
}

export async function createGate(origin: string, seekerName: string, friends: { name: string; email: string }[]): Promise<string> {
  const seekerToken = token();
  const { data: session, error } = await db()
    .from("friend_gate_sessions")
    .insert({ seeker_token: seekerToken, seeker_name: seekerName, status: "pending", expires_at: new Date(Date.now() + GATE_HOURS * 3600_000).toISOString() })
    .select("id")
    .single();
  if (error || !session) throw new Error(error?.message ?? "Could not create the gate.");

  const slots = friends.map((f, i) => ({
    session_id: session.id,
    slot_index: i,
    friend_name: f.name,
    contact_type: "email",
    contact_value: f.email.trim(),
    contact_hash: hashContact(f.email),
    survey_token: token(),
  }));
  const { error: slotError } = await db().from("friend_gate_slots").insert(slots);
  if (slotError) throw new Error(slotError.message);

  await Promise.all(slots.map((s) => sendEmail(s.contact_value, `${seekerName} needs your honest voice`, inviteEmail(origin, s.friend_name, seekerName, s.survey_token))));
  return seekerToken;
}

// Status for the seeker's page. A pending gate opens by itself after 72 hours.
export async function getGateStatus(seekerToken: string) {
  const { data: session } = await db().from("friend_gate_sessions").select("id, status, expires_at").eq("seeker_token", seekerToken).maybeSingle();
  if (!session) return null;
  let status = session.status as GateStatus;
  if (status === "pending" && new Date() > new Date(session.expires_at)) {
    await db().from("friend_gate_sessions").update({ status: "open", resolved_at: new Date().toISOString() }).eq("id", session.id);
    status = "open";
  }
  const { data: slots } = await db().from("friend_gate_slots").select("slot_index, friend_name, verdict, responded_at, survey_response").eq("session_id", session.id).order("slot_index");
  const rows = slots ?? [];
  const messages = rows
    .map((s) => (s.survey_response as Record<string, unknown> | null)?.q6)
    .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
    // Not in friend order, so a message can't be matched to who wrote it.
    .sort((a, b) => a.localeCompare(b));
  return {
    status,
    expiresAt: session.expires_at as string,
    friends: rows.map((s) => ({ name: s.friend_name as string, responded: s.responded_at !== null })),
    responded: rows.filter((s) => s.responded_at !== null).length,
    support: rows.filter((s) => s.verdict === "support").length,
    wait: rows.filter((s) => s.verdict === "wait").length,
    unsure: rows.filter((s) => s.verdict === "unsure").length,
    messages,
  };
}

export async function getSlot(surveyToken: string) {
  if (!/^[a-f0-9]{64}$/.test(surveyToken)) return null;
  const { data } = await db()
    .from("friend_gate_slots")
    .select("id, session_id, friend_name, contact_hash, otp_hash, otp_expires_at, otp_attempts, verified, responded_at, friend_gate_sessions(seeker_name)")
    .eq("survey_token", surveyToken)
    .maybeSingle();
  if (!data) return null;
  const session = data.friend_gate_sessions as unknown as { seeker_name: string | null } | null;
  return { ...data, seekerName: session?.seeker_name ?? "Someone you know" };
}

export async function requestCode(surveyToken: string, email: string): Promise<string | null> {
  const slot = await getSlot(surveyToken);
  if (!slot) return "This survey link is invalid or has expired.";
  if (slot.responded_at) return "This survey has already been completed.";
  if (hashContact(email) !== slot.contact_hash) return "That email doesn't match the one this link was sent to.";
  const otp = String(randomInt(100000, 1000000));
  await db()
    .from("friend_gate_slots")
    .update({ otp_hash: sha(otp), otp_expires_at: new Date(Date.now() + OTP_MINUTES * 60_000).toISOString(), otp_attempts: 0 })
    .eq("id", slot.id);
  const sent = await sendEmail(email.trim(), `Your verification code: ${otp}`, codeEmail(slot.friend_name ?? "Friend", otp));
  return sent ? null : "We couldn't send the code just now. Please try again.";
}

export async function verifyCode(surveyToken: string, code: string): Promise<string | null> {
  const slot = await getSlot(surveyToken);
  if (!slot) return "This survey link is invalid or has expired.";
  if (slot.responded_at) return "This survey has already been completed.";
  if (!slot.otp_hash || !slot.otp_expires_at) return "Please request a verification code first.";
  if (new Date() > new Date(slot.otp_expires_at)) return "That code expired. Request a new one.";
  if (slot.otp_attempts >= MAX_OTP_ATTEMPTS) return "Too many tries. Request a new code.";
  const ok = /^\d{6}$/.test(code) && timingSafeEqual(Buffer.from(sha(code)), Buffer.from(slot.otp_hash));
  if (!ok) {
    await db().from("friend_gate_slots").update({ otp_attempts: slot.otp_attempts + 1 }).eq("id", slot.id);
    return "Incorrect code. Please try again.";
  }
  await db().from("friend_gate_slots").update({ verified: true, verified_at: new Date().toISOString(), otp_hash: null }).eq("id", slot.id);
  return null;
}

// Saves a verified friend's answers; once all three are in, 2+ "wait"
// verdicts block the gate, otherwise it opens (legacy rule).
export async function saveSurvey(surveyToken: string, responses: Record<string, number | string>, verdict: "support" | "wait" | "unsure"): Promise<string | null> {
  const slot = await getSlot(surveyToken);
  if (!slot) return "This survey link is invalid or has expired.";
  if (!slot.verified) return "Please verify your identity first.";
  if (slot.responded_at) return "You have already submitted this survey.";
  await db().from("friend_gate_slots").update({ survey_response: responses, verdict, responded_at: new Date().toISOString() }).eq("id", slot.id);

  const { data: all } = await db().from("friend_gate_slots").select("verdict, responded_at").eq("session_id", slot.session_id);
  if ((all ?? []).filter((s) => s.responded_at).length === 3) {
    const waits = (all ?? []).filter((s) => s.verdict === "wait").length;
    await db()
      .from("friend_gate_sessions")
      .update({ status: waits >= 2 ? "blocked" : "open", resolved_at: new Date().toISOString() })
      .eq("id", slot.session_id)
      .eq("status", "pending");
  }
  return null;
}

// ── Emails (copy from legacy friendGateNotify.ts) ──
function frame(inner: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#FAFAF5;font-family:Georgia,serif;">
<div style="max-width:560px;margin:2rem auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">${inner}
<div style="background:#FAFAF5;padding:1rem 2rem;text-align:center;border-top:1px solid rgba(26,18,8,.08);"><p style="font-size:11px;color:rgba(26,18,8,.5);margin:0;">© 2026 Tony Greenberg · onlytimebuystrust.com · Only Time Buys Trust</p></div>
</div></body></html>`;
}

function inviteEmail(origin: string, friendName: string, seekerName: string, surveyToken: string): string {
  const url = `${origin}/friend-survey/${surveyToken}`;
  const f = esc(friendName);
  const s = esc(seekerName);
  return frame(`<div style="background:linear-gradient(135deg,#B45309 0%,#D97706 100%);padding:2rem 2rem 1.5rem;text-align:center;">
<div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:.5rem;">Only Time Buys Trust</div>
<h1 style="color:#fff;font-size:22px;margin:0;font-weight:700;">Your friend needs your honest voice.</h1></div>
<div style="padding:2rem;">
<p style="font-size:16px;color:#1A1208;line-height:1.7;margin-top:0;">Hi ${f},</p>
<p style="font-size:15px;color:#1A1208;line-height:1.7;"><strong>${s}</strong> is considering a significant inner journey — the kind that reshapes how a person moves through the world. Before they take another step, they've asked three people who know them well to weigh in honestly.</p>
<p style="font-size:15px;color:#1A1208;line-height:1.7;">You are one of those three people.</p>
<p style="font-size:15px;color:#1A1208;line-height:1.7;">This is a short, private survey — six questions, five minutes. Your response is anonymous. <strong>${s}</strong> will see a summary, not your name or your specific answers.</p>
<p style="font-size:14px;color:rgba(26,18,8,.65);line-height:1.6;font-style:italic;border-left:3px solid #D97706;padding-left:1rem;margin:1.5rem 0;">"${TRUST_QUOTE}"</p>
<div style="text-align:center;margin:2rem 0;"><a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#D97706 0%,#F59E0B 100%);color:#1A1208;text-decoration:none;font-weight:700;font-size:15px;padding:.9rem 2rem;border-radius:8px;">Share My Honest View</a></div>
<p style="font-size:13px;color:rgba(26,18,8,.55);line-height:1.6;text-align:center;">This link is unique to you. It expires in 72 hours.<br />You will need to verify your identity with a one-time code before responding.</p>
</div>`);
}

function codeEmail(friendName: string, otp: string): string {
  return frame(`<div style="background:linear-gradient(135deg,#B45309 0%,#D97706 100%);padding:1.5rem 2rem;text-align:center;"><div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);">Only Time Buys Trust</div></div>
<div style="padding:2rem;text-align:center;">
<p style="font-size:15px;color:#1A1208;line-height:1.7;">Hi ${esc(friendName)},</p>
<p style="font-size:15px;color:#1A1208;line-height:1.7;">Your verification code is:</p>
<div style="font-size:36px;font-weight:700;color:#B45309;letter-spacing:.2em;margin:1.5rem 0;font-family:monospace;">${otp}</div>
<p style="font-size:13px;color:rgba(26,18,8,.6);">This code expires in 15 minutes.</p>
</div>`);
}
