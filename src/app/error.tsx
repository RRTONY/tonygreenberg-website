"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-foreground/70">
          An unexpected error occurred while loading this page. It&apos;s been logged.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
