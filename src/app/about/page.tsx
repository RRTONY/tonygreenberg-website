import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PartnerQuotes } from "@/components/marketing/partner-quotes";

// Ported from legacy client/src/pages/About.tsx ("The Story"). Real content
// kept as-is. Reuses recovered original imagery served from managed storage,
// rather than retaining a runtime dependency on the retired Sanity CDN.
// "Back to the Essays" correctly points at "/" — that's the blog index in
// this app, matching the label, unlike other pages' "/" references which
// meant the old homepage.

export const metadata: Metadata = {
  title: "The Story",
  description:
    "Systems thinker. Impact builder. Corporate accountability crusader. This is the story of why — and what happens next.",
  alternates: { canonical: "/about" },
};

const HEADSHOT = "/manus-storage/about-walkthrough-portrait_f97955e3.webp";
const HERO_IMAGE = "/manus-storage/the-letter-hero_f831d229.webp";

const RECEIPTS = [
  { label: "Enterprise tech benchmarked", value: "$10B+" },
  { label: "SPY Index data points", value: "1,000,000+" },
  { label: "Fortune 500 clients served", value: "Hundreds" },
  { label: "Years of unsolicited opinions", value: "25+" },
];

const FEATURED_IN = [
  "Forbes",
  "Wired",
  "Business Week",
  "Huffington Post",
  "Ars Technica",
  "All Things D",
  "Computer World",
  "Psychedelic Times",
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.35]"
        />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-wrap items-center gap-10 px-6 py-16 sm:px-10">
          <Image
            src={HEADSHOT}
            alt="Tony Greenberg"
            width={200}
            height={200}
            unoptimized
            className="size-40 shrink-0 rounded-md border-2 border-brand-gold-light/40 object-cover object-top sm:size-52"
          />
          <div className="min-w-70 flex-1">
            <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
              The Story
            </p>
            <h1 className="mb-5 font-heading text-4xl leading-tight font-normal text-white sm:text-5xl">
              The broken things
              <br />
              <em className="text-brand-gold-light not-italic">taught me everything.</em>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/75">
              Wrong about the timing. Right about everything else. For 25 years. First URL on live
              TV. First webcast. First digital record label. Cloud before AWS was trusted.
              Blockchain before the lawyers showed up. Psychedelic medicine before it was
              respectable.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
          Chapter One
        </p>
        <h2 className="mb-6 font-heading text-2xl font-normal text-foreground">
          Before the systems, there was the question.
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/80">
          It started with retail. Boutique shops, direct-response marketing, the unglamorous work of
          selling things to people who didn&apos;t know they needed them. The 1990s were a
          masterclass in hustle — launching businesses, selling businesses, learning that the
          distance between a good idea and a dead company is about six months of cash flow and one
          honest conversation nobody wants to have.
        </p>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Then came Exodus Communications. A $37 billion IPO. Raindance Communications — running
          sales and marketing for a company that was scaling faster than anyone could steer. The
          lesson wasn&apos;t about scale. It was about what happens when growth outpaces wisdom. The
          answer: spectacular, instructive wreckage.
        </p>
        <blockquote className="my-8 border-l-2 border-brand-gold-light pl-6 font-heading text-xl text-foreground/70">
          &ldquo;The infrastructure that actually matters? Meaning itself.&rdquo;
        </blockquote>
      </div>

      <div className="mx-auto max-w-3xl border-t border-border px-6 py-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
          Chapter Two
        </p>
        <h2 className="mb-6 font-heading text-2xl font-normal text-foreground">
          $10 billion in truth-telling.
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/80">
          RampRate was born from a simple observation: enterprise technology vendors lie about what
          things cost, and their customers don&apos;t know enough to call them on it. So we built
          the most comprehensive benchmarking operation on the planet. The SPY Index — over a
          million data points on what infrastructure actually costs versus what vendors claim.
          Microsoft, Disney, Goldman Sachs, Nike. Hundreds of Fortune 500s. $10 billion benchmarked.
        </p>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Eighteen years of saving companies hundreds of millions of dollars. And then the question
          that changed everything: <em>what is all this money for?</em> Saving a corporation $40
          million on cloud infrastructure is satisfying. But if that $40 million goes into stock
          buybacks while the planet burns, the victory is hollow. The work needed to point
          somewhere.
        </p>
        <div className="my-8 rounded-md bg-brand-gold/5 p-6">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            The Receipts
          </p>
          <div className="space-y-2">
            {RECEIPTS.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between border-b border-border py-2"
              >
                <span className="text-foreground/70">{item.label}</span>
                <span className="font-mono font-semibold text-brand-gold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl border-t border-border px-6 py-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
          Chapter Three
        </p>
        <h2 className="mb-6 font-heading text-2xl font-normal text-foreground">
          Consciousness expansion isn&apos;t optional anymore.
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/80">
          ImpactSoul is a Certified B Corp venture foundry that tokenizes high-value cultural and
          real estate assets to fund regenerative impact. Four live token ecosystems — BEYOND (ocean
          cleanup), REX (paleontology), SPACE (digital access), BEING (mental health) — putting
          everyday people into investments previously reserved for the 0.1%. Facilitated a
          multi-million-dollar grant for XPRIZE Foundation. Advised Bhutan&apos;s Gross National
          Happiness Centre. Championed tribal rights from Latin America to Africa under the Nagoya
          Protocol.
        </p>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Investor in MycoMedica Life Sciences and five other psychedelic medicine ventures — from
          FDA Breakthrough Therapy designations to consciousness research platforms. Because the
          next infrastructure revolution isn&apos;t servers and switches. It&apos;s the operating
          system between our ears.
        </p>
        <p className="mb-6 leading-relaxed text-foreground/80">
          Spoke at Harvard&apos;s H+ Summit alongside Ray Kurzweil in 2010 on the convergence of
          humanity and technology. Keynoted at Davos, Paris Blockchain Week, UCLA, and more
          conferences than memory permits. Written up by Forbes, Wired, Business Week, and others
          who occasionally regret giving a platform to someone who says what he actually thinks.
        </p>
        <blockquote className="my-8 border-l-2 border-brand-gold-light pl-6 font-heading text-xl text-foreground/70">
          &ldquo;Everyone and their golden retriever is doing AI and data centers. The question
          isn&apos;t what to build. It&apos;s what&apos;s worth building.&rdquo;
        </blockquote>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-lg bg-linear-to-br from-[#11111A] to-[#20162C] p-8 text-[#F5F0E0]">
          <p className="mb-3 font-mono text-xs tracking-[0.17em] text-brand-gold-light uppercase">
            What I am thinking about now
          </p>
          <p className="mb-3 font-heading text-2xl leading-snug">
            AI is a memory machine with an energy problem. The people solving the energy problem
            will quietly decide what the future gets to remember.
          </p>
          <p className="mb-4 text-[#F5F0E0]/70">
            I am following the collision of AI buildout, nuclear manufacturing, and the trust layer
            underneath every serious system.
          </p>
          <Link
            href="/blog/energy-is-money-money-is-memory"
            className="inline-block border-b border-brand-gold-light/50 font-mono text-xs tracking-wide text-brand-gold-light uppercase"
          >
            Read the field note <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl border-t border-border px-6 py-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
          The Muse
        </p>
        <h2 className="mb-5 font-heading text-2xl font-normal text-foreground">
          Clarisse Abelarde
        </h2>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Behind every relentless builder is someone who reminds them why beauty matters. Clarisse
          Abelarde — artist, partner, constant source of inspiration for creativity and love for
          humankind. Her work is a permanent influence on everything here.
        </p>
        <a
          href="https://clarisseart-jyfqwtnv.manus.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-brand-gold/30 text-brand-gold"
        >
          clarisseart.manus.space
        </a>
      </div>

      <div className="bg-muted/30 px-6 py-6 text-center">
        <p className="mb-5 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Featured In &amp; Quoted By
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {FEATURED_IN.map((outlet) => (
            <span key={outlet} className="font-heading font-semibold text-foreground/70">
              {outlet}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <PartnerQuotes count={3} />
      </div>

      <div className="bg-[#0A0A10] px-6 py-14 text-center">
        <p className="mb-5 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
          What Happens Next
        </p>
        <h2 className="mx-auto mb-6 max-w-xl font-heading text-2xl leading-relaxed text-white/90">
          The door is open. The work is ongoing.
          <br />
          <em className="text-brand-gold-light not-italic">The aligned are welcome.</em>
        </h2>
        <p className="mx-auto mb-8 max-w-md text-white/50">
          Got an injustice worth exposing? A story that needs telling? Something broken that needs
          naming? The best thinking comes from people who refuse to stay quiet.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:tony@tonygreenberg.com"
            className="rounded-sm bg-brand-gold-light px-6 py-2.5 font-mono text-xs tracking-wide text-background"
          >
            Reach Out
          </a>
          <Link
            href="/ecosystem"
            className="rounded-sm border border-brand-gold-light/40 px-6 py-2.5 font-mono text-xs tracking-wide text-brand-gold-light"
          >
            Join the Ecosystem
          </Link>
        </div>
        <p className="mt-6 font-mono text-xs text-white/30">Santa Monica · Aspen · At Large</p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/" className="font-mono text-sm tracking-wide text-brand-gold">
          Back to the Essays <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
