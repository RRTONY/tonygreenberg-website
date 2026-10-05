import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../auth-card";
import { LoginForm } from "./login-form";
import { safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

// Member sign-in (Supabase Auth, email + password): saved highlights,
// invites, and the members-only pages.
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(params?.next);
  const linkError = params?.error === "link";

  return (
    <AuthCard
      title="Sign in"
      description="Your saved highlights, invites and member pages."
      footer={
        <>
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-brand-gold underline underline-offset-4">
            New here? Create an account
          </Link>
          <Link href="/forgot-password" className="underline underline-offset-4">
            Forgot your password?
          </Link>
        </>
      }
    >
      {linkError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          That link has expired or was already used. Sign in, or request a new one.
        </p>
      )}
      <LoginForm next={next} />
    </AuthCard>
  );
}
