"use server";

import { redirect } from "next/navigation";
import { gatedPath, isGatedPage, passwordMatches, rememberUnlock } from "@/lib/gated-posts";

export type ReportUnlockState = { error: boolean };

// Checks a locked page's password on the server (same password and cookie
// scheme as the locked essays, src/lib/gated-posts.ts); on success the page
// reloads with the report in it.
export async function unlockReport(_prev: ReportUnlockState, formData: FormData): Promise<ReportUnlockState> {
  const key = String(formData.get("key") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!isGatedPage(key) || !passwordMatches(password)) return { error: true };
  await rememberUnlock(key);
  redirect(gatedPath(key));
}
