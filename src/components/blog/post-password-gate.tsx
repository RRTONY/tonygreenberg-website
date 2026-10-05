"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Diamond, Loader2 } from "lucide-react";
import { unlockPost, type UnlockState } from "@/app/blog/[slug]/unlock-action";

// The lock screen for a password-protected essay. Copy and look ported from
// legacy BlogPost.tsx's password gate ("This One's Behind a Door"); the check
// itself now runs on the server (see src/lib/gated-posts.ts).
export function PostPasswordGate({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(unlockPost, { error: false });

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#FAFAF7] px-8">
      <div className="w-full max-w-110 py-12 text-center">
        <Diamond aria-hidden="true" className="mx-auto mb-4 size-10 fill-brand-gold-light text-brand-gold-light" />
        <h1 className="mb-2 font-heading text-[1.6rem] text-[#0A0A10]">This One&apos;s Behind a Door</h1>
        <p className="mb-8 text-base/[1.6] text-[#666]">
          You need the password to read this piece. If you have it, enter it below.
        </p>
        <form action={formAction}>
          <input type="hidden" name="slug" value={slug} />
          <label htmlFor="post-password" className="sr-only">
            Password
          </label>
          <input
            id="post-password"
            name="password"
            type="password"
            placeholder="Enter password"
            autoFocus
            required
            aria-invalid={state.error || undefined}
            aria-describedby={state.error ? "post-password-error" : undefined}
            className={`mb-3 w-full rounded-lg border-2 bg-white px-4 py-3 text-center font-mono text-[0.95rem] tracking-[0.15em] outline-none focus-visible:ring-2 focus-visible:ring-ring ${state.error ? "border-[#8B0000]" : "border-brand-gold-light"}`}
          />
          {state.error && (
            <p id="post-password-error" role="alert" className="mb-3 font-mono text-[0.85rem] text-[#8B0000]">
              That&apos;s not it. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold py-3 font-mono text-[0.85rem] tracking-[0.15em] text-[#FAFAF7] uppercase disabled:cursor-wait"
          >
            {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Unlock
          </button>
        </form>
        <Link href="/blog" className="mt-6 inline-flex items-center gap-1.5 font-mono text-[0.8rem] tracking-widest text-brand-gold">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to The Blog
        </Link>
      </div>
    </div>
  );
}
