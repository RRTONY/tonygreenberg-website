"use server";

import { requestOrigin } from "@/lib/auth";
import { checkFriendEmail, createGate } from "@/lib/friend-gate";

export type GateInput = { seekerName: string; friends: { name: string; email: string }[] };

// Starts a Three Friends Gate: saves it and emails each friend their link.
export async function startGate(input: GateInput): Promise<{ token?: string; error?: string }> {
  const seekerName = input.seekerName?.trim().slice(0, 128);
  if (!seekerName) return { error: "Please enter your first name." };
  if (!Array.isArray(input.friends) || input.friends.length !== 3) return { error: "Add all three friends." };
  const friends = input.friends.map((f) => ({ name: String(f.name ?? "").trim().slice(0, 128), email: String(f.email ?? "").trim().slice(0, 320) }));
  for (const f of friends) {
    if (!f.name) return { error: "Give each friend a name." };
    const bad = checkFriendEmail(f.email);
    if (bad) return { error: `${f.name}: ${bad}` };
  }
  if (new Set(friends.map((f) => f.email.toLowerCase())).size !== 3) return { error: "Use three different email addresses." };
  try {
    return { token: await createGate(await requestOrigin(), seekerName, friends) };
  } catch (err) {
    console.error("[friend-gate] create failed:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
