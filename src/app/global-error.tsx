"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import "./globals.css";

// Last-resort error page: only shown when the root layout itself fails (site
// header, footer, fonts or the layout's own data), where error.tsx can't
// help because it renders inside that layout. Next replaces the whole
// document with this, so it brings its own <html>/<body> and stylesheet, and
// no site header (which may be what broke). Plain <a> links on purpose: a
// full page load is the safest way out of a broken layout. Error boundaries
// are Client Components, so the title is a React <title>, not `metadata`.
export default function GlobalError({
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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-background px-6 py-16 text-foreground">
        <title>Something went wrong | Tony Greenberg</title>
        <main className="max-w-md text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">tonygreenberg.com</p>
          <h1 className="mt-3 font-heading text-4xl font-bold">Something went wrong</h1>
          <p className="mt-4 text-foreground/70">
            The site didn&apos;t load properly. Please try again in a moment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <RotateCw aria-hidden="true" className="size-4" />
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full page load, not client navigation, so a broken layout isn't reused */}
            <a
              href="/"
              className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-accent"
            >
              Go to the homepage
            </a>
          </div>
          {error.digest && <p className="mt-6 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
