"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

// The 404 page body (src/app/not-found.tsx). Ported from legacy
// client/src/pages/NotFound.tsx — same auto-redirect
// behavior (a deliberate site convention, not an accident). Missing pages
// still answer with HTTP 404 (Next sets it for not-found.tsx); never add a
// loading.tsx above a dynamic route, which would turn that into a 200.
export function NotFoundRedirect() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-lg text-foreground/70">
          This page doesn&apos;t exist. Redirecting you home&hellip;
        </p>
        <p className="mt-6 font-mono text-sm text-brand-gold">Redirecting in {countdown}s</p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-brand-gold underline transition-colors hover:text-brand-gold-light"
        >
          Go to tonygreenberg.com now
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
