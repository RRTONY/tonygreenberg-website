"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requestOrigin, safeNext } from "@/lib/auth";

// Member accounts: email + password via Supabase Auth (owner's choice,
// 2026-10-06). Every check that matters runs here on the server; the
// browser-side Yup validation in the forms is only for quick feedback.
export type AuthState = { error?: string; message?: string } | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!EMAIL.test(email) || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error: /confirm/i.test(error.message)
        ? "Please confirm your email first: check your inbox for the link we sent."
        : "That email and password don't match.",
    };
  }
  redirect(safeNext(formData.get("next")));
}

export async function signUp(values: { email: string; password: string; next?: string; ref?: string }): Promise<AuthState> {
  const email = values.email.trim();
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (values.password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters for your password.` };

  const supabase = await createClient();
  const origin = await requestOrigin();
  const next = safeNext(values.next);
  const { error } = await supabase.auth.signUp({
    email,
    password: values.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // Kept on the account so the referral can be recorded once the email
      // is confirmed (see /auth/callback).
      data: values.ref ? { referral_code: values.ref.slice(0, 64) } : undefined,
    },
  });
  if (error) return { error: error.message };
  return { message: "Check your inbox: we sent a link to confirm your email." };
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  const supabase = await createClient();
  const origin = await requestOrigin();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
  // Same answer whether or not the account exists, so this can't be used to
  // check which emails are registered.
  return { message: "If that email has an account, a reset link is on its way." };
}

export async function updatePassword(values: { password: string }): Promise<AuthState> {
  if (values.password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters for your password.` };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: values.password });
  if (error) return { error: "That link has expired. Request a new reset link." };
  redirect("/my-highlights");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
