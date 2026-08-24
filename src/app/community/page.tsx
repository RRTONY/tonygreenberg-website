import type { Metadata } from "next";
import Link from "next/link";

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

export default function CommunityPage() {
  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 py-24 text-center sm:px-10 dark:from-[#0A0A10] dark:to-background">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          The Community
        </p>
        <h1 className="mx-auto mb-5 max-w-2xl font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
          Find Your Tribe. Build <span className="text-brand-gold">What&apos;s Next.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg text-foreground/70">
          Upload your contacts. Invite your people. Find your partner, your business
          collaborator, your tribe. Every great movement started with two people who
          shouldn&apos;t have met but did.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
        <h2 className="mb-3 font-heading text-2xl font-normal text-foreground">
          The Full Platform Is Still Being Built
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/70">
          Profiles, contact uploads, and a member directory are coming. Until then, the fastest
          way to actually find your tribe is the one that&apos;s always worked: reach out
          directly.
        </p>
        <Link
          href="/pick-up-the-phone"
          className="inline-block rounded-md bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Pick Up the Phone
        </Link>
      </div>

      <div className="bg-secondary px-6 py-16 text-center sm:px-10 dark:bg-[#0A0A10]">
        <p className="mx-auto mb-5 max-w-lg font-heading text-xl text-foreground italic">
          &quot;The best architecture is the one your community finishes for you.&quot;
        </p>
        <Link
          href="/living-declaration"
          className="font-mono text-xs tracking-wide text-brand-gold uppercase"
        >
          Read the Manifesto →
        </Link>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/living-declaration" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to The Manifesto →
        </Link>
      </div>
    </div>
  );
}
