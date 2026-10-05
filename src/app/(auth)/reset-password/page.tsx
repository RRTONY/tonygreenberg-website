import type { Metadata } from "next";
import { AuthCard } from "../auth-card";
import { ResetPasswordForm } from "./reset-password-form";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
  alternates: { canonical: "/reset-password" },
};

// Reached from the reset email: /auth/callback signs the member in first.
export default async function ResetPasswordPage() {
  await requireUser("/reset-password");
  return (
    <AuthCard title="Choose a new password" description="Pick a new password for your account.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
