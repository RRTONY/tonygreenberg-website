import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageFontVariables } from "@/lib/fonts/page-fonts";

// Ported from legacy client/src/pages/TheWeb.tsx ("The Folio" — Ecosystem).
// Real content kept as-is. Client badges no longer link out via `linkMap` —
// same reason as AutoLinkedText elsewhere in Phase 4. Hero image rescued
// from the still-live legacy `/api/img/` proxy into Sanity before porting.

export const metadata: Metadata = {
  title: "The Web",
  description:
    "Tony Greenberg's network — the clients, partners, and relationships built over 25 years. Disney, Microsoft, Goldman Sachs, Nike, and more.",
  alternates: { canonical: "/the-web" },
};

const HERO_IMAGE =
  "https://cdn.sanity.io/images/a3q1cyqs/production/7669924e0a6ab0065dd7437992b96bddb45c60d8-1200x670.webp";

const CLIENTS = [
  "Microsoft", "Disney", "Goldman Sachs", "Nike", "Sony",
  "Warner Bros.", "NBCUniversal", "Verizon", "AT&T", "T-Mobile",
  "Salesforce", "Oracle", "SAP", "Dell Technologies", "HP",
  "Cisco", "IBM", "Accenture", "Deloitte", "PwC",
];

const PARTNERS = [
  { name: "MAPS / Rick Doblin", area: "Psychedelic Research" },
  { name: "B Lab", area: "B Corp Certification" },
  { name: "Ocean Cleanup Partners", area: "BEYOND Token Ecosystem" },
  { name: "Paleontological Research Institution", area: "REX Token Ecosystem" },
];

const ADAGES = [
  "The long-term success of powerful international clients — spanning 20+ years — is driven by wisdom, the power of discernment, and the strength of relationships.",
  "Half of success is just being in the room. The other half is knowing which room to be in.",
];

// 2026-10-07: restyled to live's current design: Cormorant title, red
// letter-spaced eyebrow, a cream quote box with a red rule, red hairline
// divider, and the two "TG" adages in a full-width near-black band.
export default function TheWebPage() {
  return (
    <div className={pageFontVariables}>
      <div className="relative h-64 overflow-hidden bg-[#111] sm:h-[25.3rem]">
        <Image src={HERO_IMAGE} alt="Connected network of golden threads" fill fetchPriority="high" loading="eager" sizes="100vw" className="object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-background"
        />
        <p className="absolute right-8 bottom-6 hidden font-mono text-[0.72rem] tracking-[0.25em] text-[#F1EBDD]/80 uppercase sm:block">
          Est. 2003 • Only Time Buys Trust
        </p>
      </div>

      <section className="mx-auto max-w-[39.125rem] px-6 py-8 sm:px-10">
        <p className="mb-6 font-mono text-[0.78rem] tracking-[0.35em] text-[#8E1E25] uppercase dark:text-[#E07A80]">
          The Network
        </p>
        <h1 className="mb-4 font-cormorant text-[2.6rem]/[1.25] font-normal text-[#111] dark:text-foreground">
          Ecosystem
        </h1>
        <p className="mb-6 text-lg/[1.85] text-[#222] dark:text-foreground/85">
          The real value isn&apos;t in any single company — it&apos;s in the connections between
          them. Twenty-five years of building relationships across enterprise technology,
          psychedelic medicine, payments, social impact, and consumer advocacy has created an
          ecosystem where a single phone call can unlock years of trust-building.
        </p>
        <p className="mb-6 text-lg/[1.85] text-[#222] dark:text-foreground/85">
          The network effect applied to human relationships. Every new connection strengthens
          every existing one.
        </p>

        <blockquote className="my-10 border-l-2 border-[#8E1E25] bg-[#F1EBDD] px-6 py-8 font-cormorant text-[1.28rem]/[1.75] text-[#111] sm:px-11 dark:border-[#E07A80] dark:bg-secondary dark:text-foreground">
          &quot;I can cut out years of trust-building with a single phone call to activate
          important technologies that benefit society. That&apos;s not networking — that&apos;s
          infrastructure.&quot;
        </blockquote>

        <div
          aria-hidden="true"
          className="mx-auto my-10 h-px w-48 bg-linear-to-r from-transparent via-[#8E1E25] to-transparent"
        />

        <h2 className="mb-6 font-mono text-[0.78rem] tracking-[0.2em] text-brand-gold uppercase">
          Select Clients &amp; Relationships
        </h2>
        <div className="mb-10 flex flex-wrap gap-2.5">
          {CLIENTS.map((client) => (
            <span
              key={client}
              className="rounded-[1.25rem] border border-black/8 bg-[#F7F3EA]/50 px-4 py-1.5 text-[1.05rem] text-[#333] dark:border-border dark:bg-muted/50 dark:text-foreground/80"
            >
              {client}
            </span>
          ))}
        </div>

        <h2 className="mb-6 font-mono text-[0.78rem] tracking-[0.2em] text-brand-gold uppercase">
          Key Partnerships
        </h2>
        <div className="divide-y divide-black/8 dark:divide-border">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
              <span className="font-heading font-bold text-[#111] dark:text-foreground">{p.name}</span>
              <span className="font-mono text-[0.78rem] tracking-[0.08em] text-brand-gold uppercase">
                {p.area}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="my-6 bg-[#111] px-6 py-8">
        <div className="mx-auto max-w-195 divide-y divide-[#F1EBDD]/16">
          {ADAGES.map((adage) => (
            <blockquote key={adage} className="py-5 font-cormorant text-[1.28rem]/[1.65] text-[#F1EBDD]">
              &quot;{adage}&quot;
              <footer className="mt-1.5 font-mono text-[0.72rem] tracking-[0.1em] text-[#B7AEA1]">— TG</footer>
            </blockquote>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[39.125rem] px-6 py-8 sm:px-10">
        <div className="mt-4 border-l-3 border-brand-gold bg-brand-gold-light/6 p-6">
          <p className="mb-2 font-mono text-[0.78rem] tracking-[0.08em] text-brand-gold uppercase">
            The Lesson
          </p>
          <p className="text-base/[1.8] text-[#222] dark:text-foreground/80">
            A network isn&apos;t a Rolodex. It&apos;s a living organism. The relationships that
            matter most are the ones where both sides get stronger over time — and the only way
            to build those is to show up consistently, for years, without keeping score.
          </p>
        </div>
      </section>

      <div className="py-8 text-center">
        <Link
          href="/pick-up-the-phone"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xs border border-[#8E1E25]/40 px-5 py-2 font-mono text-sm text-[#8E1E25] dark:text-[#E07A80]"
        >
          Pick Up the Phone <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
