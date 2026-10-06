import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ported from legacy client/src/pages/Community.tsx. Legacy is almost
// entirely a functional community/CRM platform — auth-gated profile
// editing, CSV contact upload, an invite-by-email system, and a member
// directory, all backed by tRPC mutations and a custom auth system this
// migration doesn't carry over (see NEXTJS-MIGRATION-TODO.md's "no backend
// features" scope decision). The only real editorial content is the hero
// copy and the closing manifesto quote, both kept verbatim below. The
// contact-upload/invite/member-matching functionality itself is out of
// scope for this pass, not a content gap — there's no static version of
// "upload your address book" to port.
export const metadata: Metadata = {
  title: "Community",
  description:
    "Find your tribe, your partner, your collaborator. Building an abundant future together.",
  alternates: { canonical: "/community" },
};

// Live (2026-10) shows member / contact / invitation counters in the hero;
// they're left out on purpose: the numbers aren't real. Sign-in uses this
// site's own auth (/login), returning here afterwards.
export default function CommunityPage() {
  return (
    <div>
      <section className="bg-[#0A0A10] px-6 py-16 text-center sm:px-16 sm:py-28">
        <p className="mb-[1.2rem] font-mono text-[0.72rem]/[1.85] tracking-[0.3em] text-brand-gold-light uppercase">
          The Community
        </p>
        <h1 className="mx-auto mb-4 max-w-[43.75rem] font-heading text-[2.25rem]/[1.1] font-normal text-[#F5F0E0] sm:text-[3.5rem]/[1.1]">
          Find Your Tribe. Build{" "}
          <em className="bg-linear-to-r from-[#8B6914] to-brand-gold-light bg-clip-text text-transparent not-italic">
            What&apos;s Next.
          </em>
        </h1>
        <p className="mx-auto max-w-[35rem] text-[1.1rem]/[1.7] text-white/60">
          Upload your contacts. Invite your people. Find your partner, your business
          collaborator, your tribe. Every great movement started with two people who
          shouldn&apos;t have met but did.
        </p>
      </section>

      <section className="mx-auto max-w-[39rem] px-6 py-20 text-center sm:px-10">
        <h2 className="mb-4 font-heading text-[1.6rem] font-normal text-foreground">
          Sign In to Join the Community
        </h2>
        <p className="mx-auto mb-6 max-w-[31.25rem] text-foreground/70">
          Create your profile, upload contacts, invite friends, and start building your tribe. It
          takes 30 seconds.
        </p>
        <Link
          href="/login?next=/community"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-[#0A0A10] px-10 py-3.5 font-mono text-[0.78rem] tracking-[0.12em] text-[#F5F0E0] uppercase transition-opacity hover:opacity-90 dark:bg-brand-gold-light dark:text-[#0A0A10]"
        >
          Sign In
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </section>

      <section className="bg-[#0A0A10] px-6 py-16 text-center sm:px-10 sm:py-20">
        <p className="mx-auto mb-6 max-w-[37.5rem] font-heading text-[1.5rem]/[1.6] text-[#F5F0E0] italic sm:text-[1.8rem]/[1.6]">
          &quot;The best architecture is the one your community finishes for you.&quot;
        </p>
        <Link
          href="/living-declaration"
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.72rem] tracking-[0.15em] text-brand-gold-light uppercase md:min-h-6"
        >
          Read the Manifesto
          <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </section>

      <div className="py-12 text-center">
        <Link
          href="/living-declaration"
          className="inline-flex min-h-11 items-center gap-1.5 border border-essay-red/40 px-6 py-2.5 font-mono text-[0.88rem] text-essay-red transition-colors hover:border-essay-red"
        >
          The Manifesto
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
