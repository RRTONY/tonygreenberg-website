import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

// Internal approver login (Supabase Auth) — gates the publish-approval
// dashboard, not a public-facing feature. See NEXTJS-MIGRATION-TODO.md,
// Phase 2 / Phase 11.
export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading">Sign in</CardTitle>
          <CardDescription>Internal access for approvers only.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
