import "server-only";
import { randomBytes } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// Invite links for /my-impact. Ported from legacy's referral_codes /
// referrals tables (drizzle/schema.ts): one code per member, one referral row
// per member who joined through it.

// The member's invite code, created on first use.
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const db = createServiceRoleClient();
  const { data } = await db.from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
  if (data?.code) return data.code;
  const code = randomBytes(5).toString("base64url");
  await db.from("referral_codes").insert({ user_id: userId, code });
  return code;
}

// Called once, after a new member confirms their email.
export async function recordReferral(newUserId: string, code: string): Promise<void> {
  const db = createServiceRoleClient();
  const { data: owner } = await db.from("referral_codes").select("user_id").eq("code", code).maybeSingle();
  if (!owner || owner.user_id === newUserId) return;
  await db.from("referrals").upsert(
    { referrer_id: owner.user_id, referred_user_id: newUserId, referral_code: code },
    { onConflict: "referred_user_id", ignoreDuplicates: true },
  );
}
