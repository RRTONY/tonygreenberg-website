import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../auth-card";
import { SignUpForm } from "./signup-form";
import { safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
  alternates: { canonical: "/signup" },
};

export default async function SignUpPage({ searchParams }: PageProps<"/signup">) {
  const params = await searchParams;
  const ref = typeof params?.ref === "string" ? params.ref : undefined;
  return (
    <AuthCard
      title="Create an account"
      description="Save highlights from the essays, track your invites, and open the member pages."
      footer={
        <Link href="/login" className="underline underline-offset-4">
          Already have an account? Sign in
        </Link>
      }
    >
      <SignUpForm next={safeNext(params?.next)} referralCode={ref} />
    </AuthCard>
  );
}
