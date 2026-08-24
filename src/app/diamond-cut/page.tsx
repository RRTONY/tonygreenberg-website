import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";

// Ported from legacy client/src/pages/DiamondCut.tsx ("The Diamond Cut").
// Real content ported in full. Legacy's tier cards used a live
// `StripeCheckoutButton` (direct Stripe checkout) for 3 of the 4 tiers —
// checkout/billing integration is deferred per this migration's scope
// (see NEXTJS-MIGRATION-TODO.md's Stripe note), so those now route to
// /engage instead, same as every other tier on this page and on
// /amplifier — pricing/copy unchanged, just no live payment flow yet.
export const metadata: Metadata = {
  title: "The Diamond Cut — Services to Product",
  description:
    "For services businesses not yet at product scale. Tony identifies the diamond in your rough, maps services to scalable product, and activates Fortune 50 distribution.",
  alternates: { canonical: "/diamond-cut" },
};

const FIVE_CUTS = [
  {
    num: "01",
    title: "Diamond Identification",
    desc: "Most services businesses cannot see their own product. They are too close. Tony has spent 25 years looking at thousands of companies through a Fortune 50 CXO lens — identifying the one thing inside a services business that a $50B company would actually buy, integrate, and scale. That is the diamond.",
  },
  {
    num: "02",
    title: "The CXO Lens",
    desc: "The difference between a product and a tolerated vendor is how a CXO perceives you. Tony translates your offering into the language, metrics, and decision frameworks that Fortune 50 executives actually use. If a CXO cannot explain your value in one sentence to their board, you do not have a product yet.",
  },
  {
    num: "03",
    title: "Product Architecture",
    desc: "Services revenue is linear. Product revenue compounds. Tony maps the architecture: what stays bespoke, what becomes repeatable, what gets automated, and what becomes the platform. The goal is not to eliminate services — it is to make them the onramp to something that scales without you in every room.",
  },
  {
    num: "04",
    title: "BD Activation",
    desc: "A product without distribution is a hobby. Tony activates business development through his 25-year Fortune 500 network — not introductions, but strategic placement. Your product in front of the three people who can say yes, with context they trust, from someone they have trusted for decades.",
  },
  {
    num: "05",
    title: "Regenerative Positioning",
    desc: "The market is shifting. Extractive business models are being repriced by regulation, consumer sentiment, and capital allocation. Tony positions your product on the right side of that shift — so you are not just scaling, you are building something that compounds value for everyone it touches.",
  },
];

const TIERS = [
  {
    tier: "Rough Cut",
    price: "$5,000",
    note: "floor",
    details: ["Diamond identification.", "CXO lens assessment.", "Written output: is there a product here?"],
    cta: "Enter the Gate →",
    href: "/engage",
    featured: false,
  },
  {
    tier: "Full Cut",
    price: "$10,000",
    note: "floor",
    details: ["All 5 cuts.", "Product architecture map.", "3 BD introductions.", "Written deliverable."],
    cta: "Enter the Gate →",
    href: "/engage",
    featured: true,
  },
  {
    tier: "Monthly Polish",
    price: "$15,000/mo",
    note: "per month",
    details: ["Ongoing product refinement.", "Active BD pipeline.", "CXO translation on demand.", "ImpactSoul alignment."],
    cta: "Enter the Gate →",
    href: "/engage",
    featured: false,
  },
  {
    tier: "The Setting",
    price: "Equity + Cash",
    note: "contact directly",
    details: ["Full strategic partnership.", "Board-level engagement.", "The diamond gets set."],
    cta: "Make Your Case →",
    href: "mailto:tony@impactsoul.is?subject=Diamond%20Cut%20-%20The%20Setting",
    featured: false,
  },
];

export default function DiamondCutPage() {
  return (
    <div>
      <section className="bg-linear-to-br from-background to-secondary px-6 py-16 text-center sm:px-10 dark:from-[#0A0A10] dark:via-[#111118] dark:to-[#1a1a24]">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase">
            The Diamond Cut
          </p>
          <h1 className="mb-4 font-heading text-3xl leading-tight font-bold text-foreground sm:text-4xl">
            Every services business has
            <br />
            <span className="text-brand-gold">a product trapped inside it.</span>
          </h1>
          <p className="mx-auto mb-3 max-w-lg text-foreground/70">
            Most founders cannot see it. They are too close. Tony has spent 25 years finding
            diamonds in rough — and cutting them into something Fortune 50 companies actually buy.
          </p>
          <div className="font-mono text-xs text-muted-foreground">
            Engagements begin with a scoping conversation · tony@impactsoul.is
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>An Honest Note</EyebrowLabel>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Tony is not a great CEO. He is a magnificent number two. A consigliere. The person who
          has guided top CXOs at Fortune 50 companies for 25 years — not by running the company,
          but by seeing what they cannot see from inside it.
        </p>
        <p className="mb-4 leading-relaxed text-foreground/80">
          His zone of genius is finding diamonds in rough. Translating what a services business
          actually does into something a CXO would pay for, integrate, and scale. That is a very
          specific skill. It is not coaching. It is not consulting. It is pattern recognition
          built on scar tissue from thousands of deals.
        </p>
        <p className="mb-4 font-semibold text-foreground">
          If you are a technology company founder — go to{" "}
          <a
            href="https://mochary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-brand-gold/30 text-brand-gold"
          >
            Matt Mochary
          </a>
          . He is the best in the world at that. This is not for you.
        </p>
        <p className="text-sm text-muted-foreground italic">
          The Diamond Cut is for services businesses that know they have something valuable — but
          have not yet figured out how to make it scale without the founder in every room.
        </p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The 5 Cuts</EyebrowLabel>
        {FIVE_CUTS.map((c, i) => (
          <div
            key={c.num}
            className={`flex gap-5 py-5 ${i < FIVE_CUTS.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="shrink-0 pt-0.5 font-mono text-xs tracking-wide text-brand-gold">
              {c.num}
            </div>
            <div>
              <h3 className="mb-1 font-heading text-lg font-bold text-foreground">{c.title}</h3>
              <p className="leading-relaxed text-foreground/70">{c.desc}</p>
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
            Proof of work = completed preparation document + all session action items documented
            in writing. No proof, no guarantee.
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
                  Recommended
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
                  className={`rounded-sm py-2.5 text-center font-mono text-xs tracking-wide uppercase ${
                    t.featured ? "bg-brand-gold text-white" : "border border-brand-gold/30 text-brand-gold"
                  }`}
                >
                  {t.cta}
                </Link>
              ) : (
                <a
                  href={t.href}
                  className="rounded-sm border border-brand-gold/30 py-2.5 text-center font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  {t.cta}
                </a>
              )}
            </div>
          ))}
        </div>
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
          Enter the Gate →
        </Link>
        <div className="font-mono text-xs text-muted-foreground">
          $5,000 minimum · preparation doc required · all sessions recorded via Fireflies
        </div>
      </section>
    </div>
  );
}
