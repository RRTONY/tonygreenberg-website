"use server";

import { redirect } from "next/navigation";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  return {
    error:
      "Staff sign-in is not configured in this managed deployment. Contact the site administrator for access.",
  };
}

export async function logout() {
  redirect("/");
}
