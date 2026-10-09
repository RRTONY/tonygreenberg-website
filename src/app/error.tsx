"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown inside the site's header and footer when a page fails to render
// (Next answers with a 500 for a request-time server error). The root
// layout's own failures are handled by global-error.tsx instead. `retry`
// (Next 16.2+) re-fetches the page's data and renders it again, which fixes
// a temporary Sanity or Supabase hiccup; `error.digest` matches the entry in
// the server logs (Netlify function logs) without exposing the real message.
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Error</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-foreground/70">
          This page didn&apos;t load properly. Trying again usually fixes it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => retry()} className="min-h-11 gap-1.5">
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/">Go to the homepage</Link>
          </Button>
        </div>
        <Link
          href="/the-index"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-brand-gold uppercase hover:opacity-70"
        >
          Browse the site index
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
