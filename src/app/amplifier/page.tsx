import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { ForwardIcon } from "@/components/ui/inline-icons";

// Ported from legacy client/src/pages/Amplifier.tsx ("The Amplifier").
// Real content, unchanged — pricing tiers, the 2x guarantee, the Matt
// Mochary note, all real. No backend dependency at all (every CTA is
// either an internal /engage link or a mailto:), so this is a full,
// unreduced port.
export const metadata: Metadata = {
  title: "The Amplifier — Networked Advisory",
  description:
    "For companies already scaling who need the external layer no internal coach provides. Tony opens rooms. You walk through them.",
  alternates: { canonical: "/amplifier" },
};

const PILLARS = [
  {
    num: "01",
    title: "Network Activation",
    desc: "25 years of Fortune 50 relationships mapped to your specific growth problem. Microsoft. Disney. Goldman Sachs. Nike. And hundreds more.",
  },
  {
    num: "02",
    title: "Vendor Intelligence",
    desc: "RampRate's SPY Index: 1M+ datapoints on what Fortune 500 companies actually pay vs. what they should. If you have a technology stack, Tony will tell you exactly where you are being extracted from — and by how much. Most clients find 20–40% cost reduction before the session ends.",
  },
  {
    num: "03",
    title: "Capital Pattern Recognition",
    desc: "35+ portfolio companies across blockchain, psychedelic medicine, regenerative real estate, cultural asset tokenization. Tony identifies capital misalignment faster than any operating coach — because he has seen where money actually goes.",
  },
  {
    num: "04",
    title: "Regenerative Business Stress Test",
    desc: "Every business is either extractive or regenerative. Tony will tell you which one yours is — and what it costs you to stay extractive. This is not a values conversation. It is a survival conversation.",
  },
  {
    num: "05",
    title: "ImpactSoul Alignment",
    desc: "If your venture intersects with cultural assets, regenerative real estate, natural resources, or conscious capital — Tony evaluates fit with ImpactSoul's ABIT program. Launching Q3 2026.",
  },
];

const TIERS = [
  {
    tier: "Diagnostic",
    price: "$5,000",
    note: "floor",
    details: [
      "Donate true value after.",
      "Full pattern match.",
      "One network activation.",
      "One vendor benchmark.",
    ],
    cta: "Enter the Gate",
    href: "/engage",
    featured: false,
  },
  {
    tier: "Half-Day Briefing",
    price: "$10,000",
    note: "floor",
    details: ["Deep diagnostic.", "Written output.", "3 targeted introductions."],
    cta: "Enter the Gate",
    href: "/engage",
    featured: true,
  },
  {
    tier: "Monthly Amplifier",
    price: "$15,000–$25,000",
    note: "per month",
    details: ["Continuous BD activation.", "Deal flow access.", "ImpactSoul pipeline visibility."],
    cta: "Enter the Gate",
    href: "/engage",
    featured: false,
  },
  {
    tier: "Board / Advisory",
    price: "Equity + Cash",
    note: "contact directly",
    details: ["Full strategic alignment.", "Board-level engagement.", "Contact directly."],
    cta: "Make Your Case",
    href: "mailto:tony@impactsoul.is?subject=Board%20/%20Advisory%20Inquiry",
    featured: false,
  },
];

const WONT_DO = [
  "Sign NDAs before a first conversation",
  "Review decks over 10 slides without a paid engagement in place",
  "Take equity-only from undercapitalized ventures",
  "Validate ideas he believes are extractive",
  "Send follow-up summary emails (that is what Fireflies is for)",
];

export default function AmplifierPage() {
  return (
    <div>
      <section className="bg-linear-to-br from-background to-secondary px-6 py-16 text-center sm:px-10 dark:from-[#0A0A10] dark:via-[#111118] dark:to-[#1a1a24]">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">
            The Amplifier
          </p>
          <h1 className="mb-4 font-heading text-3xl leading-tight font-bold text-foreground sm:text-4xl">
            Matt builds the CEO.
            <br />
            <span className="text-brand-gold">I expand the arena the CEO gets to play in.</span>
          </h1>
          <p className="mx-auto mb-3 max-w-lg text-foreground/70">
            If you can get both — get both.
          </p>
          <div className="font-mono text-xs text-muted-foreground">
            Engagements begin with a scoping conversation · tony@impactsoul.is
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>A Personal Note on Matt Mochary</EyebrowLabel>
        <p className="mb-4 leading-relaxed text-foreground/80">
          I have known{" "}
          <a
            href="https://mochary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-brand-gold/30 text-brand-gold"
          >
            Matt Mochary
          </a>{" "}
          for 25 years. He was my neighbor in Kauai. I have been coached by him personally. I love
          him like a brother.
        </p>
        <p className="mb-4 leading-relaxed text-foreground/80">
          His honor and integrity are above almost anyone I have encountered in 25 years across
          hundreds of companies. What he has built — becoming genuinely the best in the world at
          what he does — I hold in complete awe.
        </p>
        <p className="mb-4 font-semibold text-foreground">
          Follow his method to the letter. Not selectively. To the letter. Then call me.
        </p>
        <p className="text-sm text-muted-foreground italic">
          He probably just thinks I am a funny guy. I will take it. I am just glad he lets me make
          him laugh.
        </p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>What The Amplifier Is</EyebrowLabel>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Matt Mochary builds your internal operating system. What he does not — and cannot —
          provide is the external surface:
        </p>
        <div className="mb-4 pl-6">
          {[
            "The room you have not been in yet.",
            "The vendor benchmark that proves you are overpaying by 30–60%.",
            "The capital pattern that tells you why your raise is structured wrong.",
            "The introduction that changes everything.",
          ].map((line) => (
            <p key={line} className="mb-1.5 text-foreground/70">
              {line}
            </p>
          ))}
        </div>
        <p className="font-semibold text-foreground">That is The Amplifier.</p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The Unfair Advantage</EyebrowLabel>
        <p className="mb-4 text-lg font-semibold text-foreground">Tony does not show up alone.</p>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Every Amplifier engagement includes:
        </p>
        <div className="mb-4 pl-6">
          {[
            "Tony's 12-person core team",
            "Hundreds of vetted specialist resources",
            "One handpicked domain expert from your specific vertical — someone Tony has a deep personal relationship with, built on a value exchange model",
          ].map((line) => (
            <p key={line} className="mb-1.5 text-foreground/70">
              — {line}
            </p>
          ))}
        </div>
        <p className="mb-2 text-foreground/80">
          This is not a referral. Not a warm intro on LinkedIn. Your vertical expert shows up
          invested.
        </p>
        <p className="text-sm text-muted-foreground italic">
          Very few people in the world can convene a room this way.
        </p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The 5 Pillars</EyebrowLabel>
        {PILLARS.map((p, i) => (
          <div
            key={p.num}
            className={`flex gap-5 py-5 ${i < PILLARS.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="shrink-0 pt-0.5 font-mono text-xs tracking-wide text-brand-gold">
              {p.num}
            </div>
            <div>
              <h3 className="mb-1 font-heading text-lg font-bold text-foreground">{p.title}</h3>
              <p className="leading-relaxed text-foreground/70">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <div className="rounded-md border border-brand-gold/20 bg-brand-gold/5 px-8 py-6 text-center">
          <div className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            The 2× Guarantee
          </div>
          <p className="mb-2 font-semibold text-foreground">
            Do the work. Show the receipts. Get 2x back — or Tony keeps working until you do.
          </p>
          <p className="text-sm text-muted-foreground">
            Proof of work = completed preparation document + all session action items documented in
            writing. No proof, no guarantee. Simple.
          </p>
        </div>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        <EyebrowLabel>Tiers</EyebrowLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className={`relative flex flex-col rounded-md p-6 ${
                t.featured
                  ? "border border-brand-gold/40 bg-linear-to-br from-brand-gold/8 to-brand-gold/3"
                  : "border border-border bg-card"
              }`}
            >
              {t.featured && (
                <div className="absolute top-0 right-4 -translate-y-1/2 rounded-sm bg-brand-gold px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-white uppercase">
                  Most Popular
                </div>
              )}
              <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
                {t.tier}
              </div>
              <div className="mb-3">
                <span className="font-heading text-2xl font-bold text-foreground">{t.price}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">{t.note}</span>
              </div>
              <div className="mb-4 flex-1">
                {t.details.map((d) => (
                  <p key={d} className="mb-0.5 text-sm text-foreground/70">
                    {d}
                  </p>
                ))}
              </div>
              {t.href.startsWith("/") ? (
                <Link
                  href={t.href}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-sm py-2.5 text-center font-mono text-xs tracking-wide uppercase ${
                    t.featured
                      ? "bg-brand-gold text-white"
                      : "border border-brand-gold/30 text-brand-gold"
                  }`}
                >
                  {t.cta} <ForwardIcon aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href={t.href}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-brand-gold/30 py-2.5 text-center font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  {t.cta} <ForwardIcon aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>How to Prepare</EyebrowLabel>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Complete the preparation document and send to{" "}
          <a
            href="mailto:tony@impactsoul.is"
            className="border-b border-brand-gold/30 text-brand-gold"
          >
            tony@impactsoul.is
          </a>{" "}
          48 hours before your session.
        </p>
        <p className="mb-2 text-foreground/80">The document asks you to quantify:</p>
        <div className="mb-4 pl-6">
          {[
            "The single decision worth the most if you get it right",
            "The dollar value of that decision",
            "The door you need opened and what you offer in return",
            "What you would do if this conversation did not exist",
          ].map((line) => (
            <p key={line} className="mb-1 text-sm text-foreground/70">
              — {line}
            </p>
          ))}
        </div>
        <p className="mb-2 font-semibold text-foreground">
          Vague questions produce general answers. Specific high-stakes questions produce specific
          high-value answers.
        </p>
        <p className="text-sm text-muted-foreground italic">
          All sessions recorded via Fireflies. Transcript delivered within 24 hours.
        </p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>What Tony Will Not Do</EyebrowLabel>
        {WONT_DO.map((item, i) => (
          <div
            key={item}
            className={`flex items-start gap-3 py-2.5 ${i < WONT_DO.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <span className="shrink-0 text-red-800">—</span>
            <p className="text-foreground/70">{item}</p>
          </div>
        ))}
      </div>

      <section className="bg-secondary px-6 py-12 text-center sm:px-10 dark:bg-[#0A0A10]">
        <p className="mb-3 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">Book</p>
        <p className="mb-3">
          <a href="mailto:tony@impactsoul.is" className="text-brand-gold">
            tony@impactsoul.is
          </a>
        </p>
        <Link
          href="/engage"
          className="mb-3 inline-block rounded-sm bg-brand-gold px-10 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Enter the Gate <ForwardIcon aria-hidden="true" />
        </Link>
        <div className="font-mono text-xs text-muted-foreground">
          $5,000 minimum · preparation doc required · all sessions recorded via Fireflies
        </div>
      </section>
    </div>
  );
}
