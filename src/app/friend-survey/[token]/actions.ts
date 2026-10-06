"use server";

import { requestCode, saveSurvey, verifyCode } from "@/lib/friend-gate";
import { FRIEND_SURVEY_QUESTIONS } from "@/lib/content/friend-gate";

export async function sendCode(token: string, email: string): Promise<{ error?: string }> {
  const error = await requestCode(token, String(email ?? "").slice(0, 320));
  return error ? { error } : {};
}

export async function checkCode(token: string, code: string): Promise<{ error?: string }> {
  const error = await verifyCode(token, String(code ?? "").trim());
  return error ? { error } : {};
}

// Only the six known answers are kept: scales 1-5, the verdict, and up to
// 2,000 characters of free text.
export async function submitFriendSurvey(token: string, answers: Record<string, number | string>): Promise<{ error?: string }> {
  const clean: Record<string, number | string> = {};
  for (const q of FRIEND_SURVEY_QUESTIONS) {
    const v = answers[q.id];
    if (q.type === "scale" && Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 5) clean[q.id] = v as number;
    if (q.type === "verdict" && (v === "support" || v === "wait" || v === "unsure")) clean[q.id] = v;
    if (q.type === "text" && typeof v === "string" && v.trim()) clean[q.id] = v.trim().slice(0, 2000);
  }
  const verdict = clean.q5;
  if (verdict !== "support" && verdict !== "wait" && verdict !== "unsure") return { error: "Please answer question 5 — your overall verdict." };
  const error = await saveSurvey(token, clean, verdict);
  return error ? { error } : {};
}
