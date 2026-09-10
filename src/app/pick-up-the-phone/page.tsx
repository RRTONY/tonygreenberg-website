import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/PickUp.tsx ("The Folio" — Connect).
// Real content kept as-is. No phone number published, by design — funnels
// to /engage ("The Gate").

export const metadata: Metadata = {
  title: "Pick Up the Phone",
  description:
    "Ready to work with Tony Greenberg? Seven out of ten don't qualify. Enter The Gate to find out if you do.",
  alternates: { canonical: "/pick-up-the-phone" },
};

const TOPICS = [
  "Enterprise technology procurement & AI infrastructure",
  "Social impact tokenization & B Corp strategy",
  "Psychedelic medicine & consciousness research",
  "Payments infrastructure & stablecoin settlement",
  "Health & longevity protocols",
  "Consumer advocacy & regulatory investigations",
  "Decentralized identity & Web3 governance",
  "Speaking engagements & advisory roles",
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", url: "https://linkedin.com/in/tonygreenberg" },
  { label: "Linktree", url: "https://linktr.ee/TonyG2" },
  { label: "RampRate", url: "https://ramprate.com" },
  { label: "ImpactSoul", url: "https://impactsoul.is" },
  { label: "Blog", url: "https://tonygreenberg.com/blog" },
];

export default function PickUpThePhonePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        Let&apos;s Talk
      </p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">Connect</h1>
      <p className="mb-4 leading-relaxed text-foreground/80">
        If something on this site resonated — or if you think we should be working together — I want
        to hear from you. But I don&apos;t take cold calls, and I don&apos;t take meetings without
        preparation. The best partnerships start with clarity, not small talk.
      </p>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        Seven out of ten inquiries aren&apos;t the right fit. That&apos;s not arrogance — it&apos;s
        respect for your time and mine. The Gate is a five-question audit that ensures we&apos;re
        both clear on what you&apos;re building, why it matters, and whether this is the right
        partnership. Pass it, and you&apos;ll get the booking link. Make it compelling enough, and I
        might reach out to you first.
      </p>

      <div className="mb-8 rounded-lg border border-brand-gold-light/15 bg-linear-to-br from-background to-secondary p-8 text-center dark:from-[#0A0A10] dark:to-[#111118]">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
          The Engagement Audit
        </p>
        <p className="mb-3 font-heading text-2xl font-bold text-foreground">
          Ready to make your case?
        </p>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          Five questions. No right answers — but there are wrong ones. Specificity, evidence of
          action, and clarity get you through.
        </p>
        <Link
          href="/engage"
          className="inline-block rounded-sm bg-brand-gold-light px-8 py-3 font-mono text-sm tracking-wide text-background uppercase"
        >
          Enter The Gate <ForwardIcon aria-hidden="true" />
        </Link>
        <p className="mt-5 font-mono text-xs tracking-wide text-brand-gold-light">
          2× MONEY-BACK GUARANTEE — Do the work we specify. Document it. Zero results? Fee refunded,
          times two.
        </p>
      </div>

      <div className="mb-8 grid gap-4 rounded-md border border-border bg-muted/30 p-6 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs tracking-wide text-brand-gold uppercase">
            Email
          </span>
          <a
            href="mailto:tony@impactsoul.is"
            className="border-b border-brand-gold/30 text-foreground"
          >
            tony@impactsoul.is
          </a>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs tracking-wide text-brand-gold uppercase">
            Location
          </span>
          <span className="text-foreground">Santa Monica, CA</span>
        </div>
      </div>

      <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        What to Talk About
      </h2>
      <ul className="mb-10 divide-y divide-border">
        {TOPICS.map((topic) => (
          <li key={topic} className="flex gap-3 py-2.5 text-foreground/80">
            <span className="font-bold text-brand-gold-light">›</span>
            {topic}
          </li>
        ))}
      </ul>

      <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        Find Me Online
      </h2>
      <div className="mb-10 flex flex-wrap gap-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wide text-brand-gold uppercase transition-transform hover:scale-105"
          >
            {link.label}
          </a>
        ))}
      </div>

      <blockquote className="mb-10 text-center font-heading text-xl italic text-foreground">
        The best conversations start with the right question. What&apos;s yours?
      </blockquote>

      <div className="rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">The Lesson</p>
        <p className="leading-relaxed text-foreground/80">
          The conversation you&apos;re afraid to start is usually the one that matters most. But
          start it with clarity — know what you want, know why it matters, and know what you&apos;ve
          already done about it. That&apos;s how you earn the meeting.
        </p>
      </div>
    </div>
  );
}
