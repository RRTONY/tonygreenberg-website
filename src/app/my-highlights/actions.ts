"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

// Saving and removing highlights runs as the signed-in member (their own
// Supabase session), so row-level security only lets them touch their own
// rows (see supabase/migrations/0001_member_features.sql).
export async function saveHighlight(input: { postSlug: string; text: string; context?: string }): Promise<{ ok: boolean; needsLogin?: boolean }> {
  const user = await getUser();
  if (!user) return { ok: false, needsLogin: true };
  const text = input.text.trim();
  if (text.length < 10 || text.length > 2000 || !/^[a-z0-9-]{1,200}$/.test(input.postSlug)) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.from("highlights").insert({
    user_id: user.id,
    post_slug: input.postSlug,
    text,
    context: input.context?.trim().slice(0, 4000) || null,
  });
  if (error) console.error("[highlights] save failed:", error.message);
  else revalidatePath("/my-highlights");
  return { ok: !error };
}

export async function deleteHighlight(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const supabase = await createClient();
  await supabase.from("highlights").delete().eq("id", id);
  revalidatePath("/my-highlights");
}
