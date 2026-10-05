"use server";

import { redirect } from "next/navigation";
import { isGatedPost, passwordMatches, rememberUnlock } from "@/lib/gated-posts";

export type UnlockState = { error: boolean };

// Checks a password-protected essay's password on the server; on success sets
// the unlock cookie and reloads the essay, now rendered in full.
export async function unlockPost(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const slug = String(formData.get("slug") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!isGatedPost(slug) || !passwordMatches(password)) return { error: true };
  await rememberUnlock(slug);
  redirect(`/blog/${slug}`);
}
