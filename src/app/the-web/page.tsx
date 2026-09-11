import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Ported from legacy client/src/pages/TheWeb.tsx ("The Folio" — Ecosystem).
// Real content kept as-is. Client badges no longer link out via `linkMap` —
// same reason as AutoLinkedText elsewhere in Phase 4. The recovered original
// hero is served from managed storage instead of the retired Sanity CDN.

export const metadata: Metadata = {
  title: "The Web",
  description:
    "Tony Greenberg's network — the clients, partners, and relationships built over 25 years. Disney, Microsoft, Goldman Sachs, Nike, and more.",
  alternates: { canonical: "/the-web" },
};

const HERO_IMAGE = "/manus-storage/the-web-hero_39e97b3f.webp";

const CLIENTS = [
  "Microsoft",
  "Disney",
  "Goldman Sachs",
  "Nike",
  "Sony",
  "Warner Bros.",
  "NBCUniversal",
  "Verizon",
  "AT&T",
  "T-Mobile",
  "Salesforce",
  "Oracle",
  "SAP",
  "Dell Technologies",
  "HP",
  "Cisco",
  "IBM",
  "Accenture",
  "Deloitte",
  "PwC",
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

export default function TheWebPage() {
  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80">
        <Image
          src={HERO_IMAGE}
          alt="Connected network of golden threads"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          The Network
        </p>
        <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Ecosystem
        </h1>
        <p className="mb-4 text-foreground/80">
          The real value isn&apos;t in any single company — it&apos;s in the connections between
          them. Twenty-five years of building relationships across enterprise technology,
          psychedelic medicine, payments, social impact, and consumer advocacy has created an
          ecosystem where a single phone call can unlock years of trust-building.
        </p>
        <p className="mb-10 text-foreground/80">
          The network effect applied to human relationships. Every new connection strengthens every
          existing one.
        </p>

        <blockquote className="mb-10 text-center font-heading text-xl italic text-foreground">
          &ldquo;I can cut out years of trust-building with a single phone call to activate
          important technologies that benefit society. That&apos;s not networking — that&apos;s
          infrastructure.&rdquo;
        </blockquote>

        <h2 className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          Select Clients &amp; Relationships
        </h2>
        <div className="mb-10 flex flex-wrap gap-3">
          {CLIENTS.map((client) => (
            <span
              key={client}
              className="rounded-full border border-border bg-muted/50 px-4 py-1.5 text-foreground/80"
            >
              {client}
            </span>
          ))}
        </div>

        <h2 className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          Key Partnerships
        </h2>
        <div className="mb-10 divide-y divide-border">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex flex-wrap items-baseline gap-4 py-3">
              <span className="font-heading font-bold text-foreground">{p.name}</span>
              <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                {p.area}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-10 space-y-4">
          {ADAGES.map((adage) => (
            <blockquote
              key={adage}
              className="border-l-2 border-brand-gold pl-5 text-foreground/80 italic"
            >
              &ldquo;{adage}&rdquo;
              <footer className="mt-2 font-mono text-xs text-muted-foreground not-italic">
                — TG
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
            The Lesson
          </p>
          <p className="leading-relaxed text-foreground/80">
            A network isn&apos;t a Rolodex. It&apos;s a living organism. The relationships that
            matter most are the ones where both sides get stronger over time — and the only way to
            build those is to show up consistently, for years, without keeping score.
          </p>
        </div>

        <div className="border-t border-border py-6 text-center">
          <Link
            href="/pick-up-the-phone"
            className="font-mono text-sm tracking-wide text-brand-gold"
          >
            Pick Up the Phone <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
