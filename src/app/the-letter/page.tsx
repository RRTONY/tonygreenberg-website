import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import { postCountQuery } from "@/lib/sanity/queries";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { FourDoors, type Door } from "@/components/marketing/four-doors";
import { NewsletterSignupForm } from "@/components/marketing/newsletter-signup-form";
import { DailyProvocation } from "@/components/marketing/daily-provocation";
import { EditorialDivider } from "@/components/marketing/editorial-divider";
import { postHref } from "@/lib/content/post-redirects";

// Ported from legacy client/src/pages/Home.tsx ("v2.0 Glass-Morphism Edition").
// Real copy/links/data kept as-is; the bespoke visual effects (floating
// particle animation, glowing-bowl radial gradients, glitch text, magnetic
// hover physics, typewriter intro) are deliberately not reproduced — same
// judgment call as Phase 3's engagement widgets. Two legacy bugs fixed while
// porting: /ramprate and /human-os pointed at routes that don't exist
// (should be https://ramprate.com and /humanos); Most Read's 5 links all
// pointed at the same "/blog" placeholder instead of each post's real slug.
//
// 2026-10-01 live-sync pass: added the daily provocation strip, the
// "memory layer" pull quote, the client ROI ticker, the closing sign-off and
// the Dispatch signup, and updated copy to match live. Essay and coffee
// counts stay computed from Sanity / BREWSOUL_COFFEES (live's hardcoded
// "123 essays" and "103 coffees" are live's own numbers, not this site's).
// The provocation's "Read the full essay" link is not ported: live points it
// at /blog/manifesto, which has no matching post (live silently redirects it
// to an unrelated essay), and the quote isn't in any Sanity post body. The
// ticker is a static wrapped strip, not a scrolling marquee (that needs a
// keyframe in globals.css). The Featured Essay card's copy is hardcoded to
// what live shows; the Sanity post behind it keeps its own title.

export const metadata: Metadata = {
  title: "The Letter",
  description:
    "Tony Greenberg — 25 years exposing broken systems and building what replaces them. Enterprise technology, impact investing, human systems.",
  alternates: { canonical: "/the-letter" },
};

const HERO_IMAGE =
  "https://cdn.sanity.io/images/a3q1cyqs/production/4b0c5b229fd4f51c9134a30943d369cadbceab70-1200x670.webp";

// Live uses its own card image here, not the post's hero (rescued 2026-10-01).
const FEATURED_IMAGE =
  "https://cdn.sanity.io/images/a3q1cyqs/production/6adbe2febec7bd4ddbb62e24abc658036c5c8b26-1200x670.webp";

const THREE_PATHS = [
  {
    eyebrow: "Work with Tony",
    headline: "You have a problem that insiders have normalized.",
    body: "Strategic, pricing, infrastructure, or transformation challenges. Tony opens rooms. You walk through them.",
    cta: "Start a conversation",
    href: "/engage",
  },
  {
    eyebrow: "Read Tony's Thinking",
    headline: "You came here because you want to understand his ideas.",
    body: "{count} essays. Start with the 7 that explain everything. No algorithm. No paywall.",
    cta: "Start here",
    href: "/start-here",
  },
  {
    eyebrow: "Explore What Tony Builds",
    headline: "You want to see the companies, experiments, and systems.",
    body: "RampRate. ImpactSoul. Human OS. The things being built before they make the news.",
    cta: "See the ecosystem",
    href: "/ecosystem",
  },
];

const START_HERE_ESSAYS = [
  { num: "01", slug: "when-healing-becomes-extraction", title: "When Healing Becomes Extraction", why: "The clearest statement of what I stand for — and what I'll fight against.", theme: "Ethics & Systems", time: "22 min" },
  { num: "02", slug: "your-blood-lies-without-your-dna", title: "Your Blood Lies Without Your DNA", why: "How I think about broken systems and what replaces them. Health as a case study.", theme: "Health Systems", time: "12 min" },
  { num: "03", slug: "energy-is-money-money-is-memory", title: "Energy Is Money. Money Is Memory.", why: "The physics underneath the AI buildout. Why this matters for everything.", theme: "AI & Energy", time: "10 min" },
  { num: "04", slug: "only-time-buys-trust", title: "Trust Us? Are You Really My Friend?", why: "The foundational idea behind everything I build. Only time buys trust.", theme: "Trust", time: "8 min" },
  { num: "05", slug: "greenberg-kurzweil-scientist-foundation-of-trust", title: "Rise of the Citizen-Scientist", why: "On stage with Kurzweil. Why verification matters more than credentials.", theme: "Technology", time: "7 min" },
  { num: "06", slug: "energy-as-impact", title: "Energy as Impact", why: "How I think about infrastructure as a moral act, not just a cost.", theme: "Impact", time: "6 min" },
  { num: "07", slug: "google-verizon-walled-garden-plan", title: "The Google/Verizon Walled Garden Plan", why: "From 2010. Still the most accurate prediction I ever made about the internet.", theme: "Infrastructure", time: "5 min" },
];

const FOUR_DOORS: Door[] = [
  {
    num: "01",
    title: "Read",
    sub: "Essays on culture, capital & human systems",
    href: "/blog",
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/7670024ec62a664462e3d5bfdc26cb79475fc237-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Twenty-five years of thinking, unfiltered",
    body: "Essays that challenge extractive systems and explore what comes next. Culture, capital, human systems — written for people who are tired of being managed and ready to think for themselves.",
    bullets: [
      "121 essays spanning enterprise technology, impact investing, and social systems",
      "Featured in Harvard H+, Davos 2022, and independent media",
      "No paywall. No algorithm. Just the work.",
    ],
    cta: "Read the Essays",
  },
  {
    num: "02",
    title: "Diagnose",
    sub: "Assessments that clarify who you are",
    href: "/find-my",
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/9fa1715fe62fd90ee02f9c4741afc2c5456c4db8-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Clarity is a competitive advantage",
    body: "Short assessments — five to ten minutes — that surface decisions you've been avoiding. Who you are, what you want, and what's getting in the way. Immediate insight, no consultant required.",
    bullets: [
      "Psychographic profiling across leadership, risk, and values",
      "Calibrated against 25 years of pattern recognition",
      "Results you can actually act on",
    ],
    cta: "Find Your Fit",
  },
  {
    num: "03",
    title: "Engage",
    sub: "Builders & investors in regenerative systems",
    href: "/ecosystem",
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/f5a276d213f7ddc29f6a9b196028e268413108e2-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "The people building what comes after extraction",
    body: "A curated network of builders, investors, and operators who are done with the old playbook. Real capital. Real projects. No pitch decks required — just alignment on what matters.",
    bullets: [
      "Active investments across impact tokens, consciousness research, and payments infrastructure",
      "ImpactSoul — a Certified B Corp tokenizing cultural and real estate assets",
      "Introductions by merit, not by LinkedIn connection count",
    ],
    cta: "Explore the Ecosystem",
  },
  {
    num: "04",
    title: "Verify",
    sub: "COA checks, testing & vendor scoring",
    href: "/verify-your-coa",
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/305e817d671e9a50f85d064760e1e01f5a7bb73e-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Trust, but verify. Actually, just verify.",
    body: "Before you order anything from anyone — peptides, supplements, compounds — here's how to actually confirm what you're getting. COA interpretation, independent testing labs, and vendor scoring built from real sourcing experience.",
    bullets: [
      "Certificate of Analysis (COA) reading guide",
      "Independent third-party lab recommendations",
      "Vendor scoring rubric based on $10B+ procurement experience",
    ],
    cta: "Verify Your Source",
  },
];

const OPEN_QUESTIONS = [
  { q: "Was I wrong about blockchain?", note: "Wrote about it optimistically in 2018. The infrastructure thesis held. The governance thesis did not. Still deciding." },
  { q: "Can capital actually regenerate?", note: "ImpactSoul is the experiment. The hypothesis is that tokenized assets can fund restoration without extraction. The data is still coming in." },
  { q: "What does consciousness have to do with enterprise technology?", note: "This is the question that connects everything on this site. I don't have a clean answer. I have 25 years of circumstantial evidence." },
  { q: "Is psychedelic medicine being captured before it can heal?", note: "The Eli Lilly acquisition happened the same week Tina Sodhi died. I wrote about both. I don't know how the story ends." },
];

const WHAT_I_BUILD = [
  {
    tag: "Infrastructure",
    title: "RampRate",
    body: "The trust layer between buyers and sellers. $10B+ in transactions. 25 years. The intermediary that makes enterprise decisions defensible.",
    href: "https://ramprate.com",
    external: true,
    linkLabel: "ramprate.com",
  },
  {
    tag: "Impact Capital",
    title: "ImpactSoul",
    body: "ImpactSoul is a RampRate company tokenizing cultural, regenerative, and natural assets. ABITs: the financial instrument that prices what markets cannot see yet.",
    href: "https://impactsoul.is",
    external: true,
    linkLabel: "impactsoul.is",
  },
  {
    tag: "Operating System",
    title: "Human OS 2.0",
    body: "The framework for upgrading how humans think, decide, and connect. Built on A Living Declaration — the foundational document for what comes after extraction.",
    href: "/humanos",
    external: false,
    linkLabel: "Human OS 2.0",
  },
];

const MOST_READ = [
  { num: "01", title: "Boiling the Human", subtitle: "Harvard H+ / Kurzweil", slug: "boiling-the-human-summit-harvard-kurzweil" },
  { num: "02", title: "Trust Us? Are You Really My Friend?", slug: "only-time-buys-trust" },
  { num: "03", title: "Return on Investment: Are You Going Green?", slug: "return-on-investment-going-green-going-green-2" },
  { num: "04", title: "Customer Service: The Key to Business Success", slug: "customer-service-key-to-business-success" },
  { num: "05", title: "Davos 2022 — World Economic Forum", slug: "davos-2022-world-economic-forum-here-we-come" },
];

// Client proof points, shown as a strip under the Four Doors (live: a
// scrolling ticker).
const PROOF_TICKER = [
  "Disney — 21× ROI",
  "Blizzard — 24× ROI",
  "$10B+ Benchmarked",
  "Microsoft — 18× ROI",
  "H+ Summit at Harvard with Kurzweil",
  "eBay — 22× ROI",
  "93% Client Success Score",
  "ViacomCBS — 19× ROI",
  "25 Years · 1M+ Data Points",
  "Sony Music — 24× ROI",
  "Goldman Sachs — 16× ROI",
  "Nike — 20× ROI",
  "BBC — 17× ROI",
  "Certified B Corp",
  "19 Client Testimonials",
  "3× Guarantee on Every Retainer",
];

// Live's narrow editorial column for the lower sections (2026-10 redesign).
const EDITORIAL_SECTION = "mx-auto max-w-[39rem] px-6 py-8 sm:px-10";
const EDITORIAL_EYEBROW =
  "mb-6 font-mono text-[0.78rem] font-normal tracking-[0.35em] text-brand-gold uppercase";

export default async function TheLetterPage() {
  const essayCount = await sanityFetch<number>({ query: postCountQuery, tags: ["post"] });

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[70vh] max-h-[650px] min-h-[420px] overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/5 to-black/55" />
        <div className="relative flex h-full max-w-3xl flex-col justify-end px-6 pb-12 sm:px-10">
          <p className="mb-3 font-mono text-xs tracking-[0.15em] text-brand-gold-light uppercase">
            A Living Document · Updated Continuously
          </p>
          <h1 className="mb-2 font-heading text-4xl leading-tight text-white sm:text-6xl">
            I expose broken systems.
            <br />
            <span className="text-brand-gold-light">Then I build what comes next.</span>
          </h1>
          <p className="mb-5 max-w-lg text-base text-white/75">
            $10B+ in enterprise contracts priced, audited, and renegotiated
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/find-my"
              className="inline-flex items-center justify-center rounded-sm bg-brand-gold-light px-4 py-2.5 font-mono text-xs tracking-wide text-[#0A0A10] uppercase shadow-[0_0_20px_rgba(212,185,106,0.3)] transition-transform hover:scale-105"
            >
              Find Your Fit →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-sm border border-brand-gold-light/50 bg-brand-gold-light/10 px-4 py-2.5 font-mono text-xs tracking-wide text-brand-gold-light uppercase backdrop-blur-md transition-transform hover:scale-105"
            >
              {essayCount} Essays →
            </Link>
          </div>
        </div>
      </div>

      {/* Daily provocation: today's line, share button, archive search */}
      <DailyProvocation />

      {/* Three Visitor Pathways */}
      <div className="border-b border-border bg-background px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Where do you want to start?
          </p>
          <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {THREE_PATHS.map((path) => (
              <Link key={path.href} href={path.href} className="block p-6 transition-colors hover:bg-brand-gold/5">
                <p className="mb-2 font-mono text-[0.6rem] tracking-[0.18em] text-brand-gold uppercase">
                  {path.eyebrow}
                </p>
                <p className="mb-2 font-heading text-lg font-bold leading-snug text-foreground">
                  {path.headline}
                </p>
                <p className="text-sm text-muted-foreground">
                  {path.body.replace("{count}", String(essayCount))}
                </p>
                <p className="mt-3 font-mono text-xs tracking-wide text-brand-gold">{path.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Start Here */}
      <div className="border-b border-border bg-background px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-1 flex flex-wrap items-baseline gap-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Start Here</h2>
            <p className="font-mono text-xs tracking-wide text-brand-gold uppercase">
              7 essays that explain what I think and what I&apos;m building
            </p>
          </div>
          <div className="mb-6 h-0.5 w-10 bg-brand-gold" />
          <div className="flex flex-col">
            {START_HERE_ESSAYS.map((essay) => (
              <Link
                key={essay.slug}
                href={postHref(essay.slug)}
                className="grid grid-cols-[2rem_1fr_auto] gap-4 border-t border-border py-4 transition-colors hover:bg-brand-gold/5"
              >
                <span className="font-mono text-xs text-brand-gold">{essay.num}</span>
                <span>
                  <span className="block font-heading font-bold leading-tight text-foreground">
                    {essay.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{essay.why}</span>
                </span>
                <span className="min-w-20 text-right">
                  <span className="block font-mono text-[0.58rem] tracking-wide text-brand-gold uppercase">
                    {essay.theme}
                  </span>
                  <span className="font-mono text-[0.6rem] text-muted-foreground">{essay.time}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link href="/articles" className="mt-4 inline-block border-t border-border pt-3 font-mono text-xs tracking-wide text-brand-gold uppercase">
            All {essayCount} essays →
          </Link>
        </div>
      </div>

      {/* What I'm thinking now */}
      <div className="border-b border-brand-gold-light/10 bg-[#0A0A10] px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6">
          <p className="shrink-0 font-mono text-[0.58rem] tracking-[0.2em] text-brand-gold-light/85 uppercase">
            Aug 2026
          </p>
          <p className="min-w-0 flex-1 basis-64 font-heading text-base leading-normal text-[#F5F0E0]/85 italic sm:text-lg">
            &quot;The most important political question of the next decade is not who controls the
            government. It is who controls the memory layer of AI — and whether that memory
            serves the person or the platform.&quot;
          </p>
          <Link
            href="/blog/energy-is-money-money-is-memory"
            className="inline-flex min-h-11 shrink-0 items-center font-mono text-[0.6rem] tracking-[0.12em] text-brand-gold-light uppercase md:min-h-6"
          >
            Read the essay →
          </Link>
        </div>
      </div>

      {/* Four Doors */}
      <div className="bg-[#0E0C09]">
        <div className="px-4 pt-10 pb-5 text-center">
          <p className="mb-1.5 font-mono text-xs tracking-[0.22em] text-brand-gold-light/85 uppercase">
            Four Doors
          </p>
          <p className="font-heading text-2xl text-[#F5F0E6]">
            Choose how you want to <em className="text-brand-gold-light">begin</em>
          </p>
        </div>
        <FourDoors doors={FOUR_DOORS} />
      </div>

      {/* Proof strip */}
      <div className="border-y border-brand-gold/15 bg-[#F5F0E6] px-4 py-3 dark:bg-[#15120C]">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2">
          {PROOF_TICKER.map((item) => (
            <li
              key={item}
              className="font-mono text-xs tracking-[0.12em] text-brand-gold uppercase dark:text-brand-gold-light"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Essay */}
      <div className="bg-linear-to-b from-background to-[#1A0A2E] px-4 py-12 dark:from-[#0A0A10]">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
            Featured Essay — July 2026
          </p>
          <Link
            href="/blog/when-healing-becomes-extraction"
            className="grid overflow-hidden rounded-xl border border-brand-gold-light/20 shadow-2xl transition-transform hover:-translate-y-1 sm:grid-cols-2"
          >
            <div className="relative min-h-72">
              <Image
                src={FEATURED_IMAGE}
                alt="When Healing Becomes Extraction"
                fill
                sizes="(min-width: 640px) 448px, 100vw"
                className="object-cover brightness-90"
              />
              <span className="absolute top-4 left-4 rounded-sm bg-[#836311] px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] text-white uppercase">
                Open Letter
              </span>
            </div>
            <div className="flex flex-col justify-center bg-[#0A0A10] p-8">
              <p className="mb-3 font-mono text-xs tracking-wide text-brand-gold-light uppercase">
                Harm Reduction · ImpactSoul
              </p>
              <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                When Healing Becomes Extraction
              </h3>
              <p className="mb-5 text-white/70">
                Tina Sodhi paid $2,000. She trusted a man with her life. The pharmacology was
                predictable. The outcome was not an accident. An open letter to Rick Doblin and the
                field that must say something now.
              </p>
              <p className="mb-5 font-mono text-xs text-brand-gold-light/85">
                July 2026 · 22 min read · Investor Disclosure Included
              </p>
              <p className="font-mono text-xs tracking-wide text-brand-gold-light uppercase">
                Read the Letter →
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* How Tony Works in the World (live's narrow editorial column) */}
      <section className={EDITORIAL_SECTION}>
        <h2 className={EDITORIAL_EYEBROW}>How Tony Works in the World</h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col rounded-xl border border-brand-gold/20 bg-linear-to-br from-brand-gold-light/10 to-brand-gold-light/5 p-7">
            <p className="mb-2.5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
              The Amplifier
            </p>
            <h3 className="mb-2.5 font-heading text-[1.2rem]/[1.3] font-bold text-foreground">
              For companies already scaling who need the external layer no internal coach provides.
            </h3>
            <p className="mb-4 text-[0.95rem]/[1.7] text-foreground/75">
              Tony opens rooms. You walk through them. Engagements begin with a scoping conversation.
            </p>
            <p className="mb-4 font-mono text-[0.72rem] font-bold tracking-[0.08em] text-brand-gold uppercase">
              2X on consulting return guarantee
            </p>
            <Link
              href="/amplifier"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-linear-to-br from-brand-gold-light to-[#C5A23C] px-6 py-2.5 text-center font-mono text-xs tracking-[0.1em] text-[#0A0A10] uppercase"
            >
              Engagements begin with a scoping conversation
              <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
            </Link>
          </div>
          <div className="flex flex-col rounded-xl border border-border bg-card p-7">
            <p className="mb-2.5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
              The Diamond Cut
            </p>
            <h3 className="mb-2.5 font-heading text-[1.2rem]/[1.3] font-bold text-foreground">
              For services businesses sitting on unproductized expertise.
            </h3>
            <p className="mb-4 text-[0.95rem]/[1.7] text-foreground/75">
              Tony finds the diamond. Together you cut it. Engagements begin with a scoping conversation.
            </p>
            <p className="mb-4 font-mono text-[0.72rem] font-bold tracking-[0.08em] text-brand-gold uppercase">
              3X on sourcing return guarantee
            </p>
            <Link
              href="/diamond-cut"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-brand-gold/30 px-6 py-2.5 text-center font-mono text-xs tracking-[0.1em] text-brand-gold uppercase"
            >
              Engagements begin with a scoping conversation
              <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
            </Link>
          </div>
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <p className="border-l-4 border-[#C5A23C] pl-4 text-left font-heading text-[1.3rem]/[1.45] font-extrabold text-foreground">
              Both engagements include a handpicked vertical domain expert. Tony does not show up alone.
            </p>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* Investment Thesis */}
      <section className={EDITORIAL_SECTION}>
        <h2 className={EDITORIAL_EYEBROW}>The Investment Thesis</h2>
        <div className="rounded-xl border border-brand-gold-light/10 bg-muted/40 p-8">
          <p className="mb-4 text-[1.05rem]/[1.75] text-foreground/85">
            ImpactSoul Asset-Backed Impact Tokens (ABITs) launch Q1 2027. Tokenizing cultural,
            regenerative, and natural assets that traditional capital markets cannot price.
          </p>
          <a
            href="https://impactsoul.is"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-brand-gold/30 px-5 py-2.5 font-mono text-[0.78rem] tracking-[0.12em] text-brand-gold uppercase"
          >
            Join the waitlist
            <ArrowRight aria-hidden="true" className="size-3.5" />
            impactsoul.is
          </a>
        </div>
      </section>

      {/* Open Questions */}
      <section className="mt-10 border-y border-border bg-[#F5F0E8] px-6 py-10 sm:px-10 dark:bg-muted/40">
        <div className="mx-auto max-w-[56.25rem]">
          <h2 className="mb-6 font-mono text-[0.65rem] font-normal tracking-[0.2em] text-brand-gold uppercase">
            Still Figuring Out
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OPEN_QUESTIONS.map((item) => (
              <div key={item.q} className="rounded border border-brand-gold/10 bg-background/70 p-5">
                <p className="mb-2 font-heading font-semibold text-foreground">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I Build */}
      <section className={`${EDITORIAL_SECTION} mt-10`}>
        <h2 className={EDITORIAL_EYEBROW}>What I Build</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {WHAT_I_BUILD.map((item) => {
            const linkProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Link
                key={item.title}
                href={item.href}
                {...linkProps}
                className="block rounded-lg border border-border bg-background/60 p-6 transition-colors hover:border-brand-gold/30"
              >
                <p className="mb-2 font-mono text-[0.58rem] tracking-[0.18em] text-brand-gold uppercase">
                  {item.tag}
                </p>
                <p className="mb-1.5 font-heading text-[1.1rem] font-bold text-foreground">{item.title}</p>
                <p className="text-[0.85rem]/[1.6] text-muted-foreground">{item.body}</p>
                <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-brand-gold">
                  {item.linkLabel}
                  <ArrowRight aria-hidden="true" className="size-3" />
                </p>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          Also active in:{" "}
          <Link href="/psychedelic-readiness-index" className="text-brand-gold">
            Psychedelic Medicine
          </Link>{" "}
          ·{" "}
          <Link href="/brewsoul" className="text-brand-gold">
            BrewSoul
          </Link>{" "}
          ·{" "}
          <Link href="/ecosystem" className="inline-flex items-center gap-1 text-brand-gold">
            Full Ecosystem
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </p>
      </section>

      <EditorialDivider />

      {/* Most Read */}
      <section className={EDITORIAL_SECTION}>
        <h2 className={EDITORIAL_EYEBROW}>Most Read</h2>
        <div className="rounded-xl border border-brand-gold-light/10 bg-muted/30 px-6">
          {MOST_READ.map((item, i) => (
            <Link
              key={item.num}
              href={postHref(item.slug)}
              className={`flex items-baseline gap-4 py-4 transition-colors hover:bg-brand-gold/5 ${
                i < MOST_READ.length - 1 ? "border-b border-brand-gold-light/10" : ""
              }`}
            >
              <span className="font-mono text-xs text-brand-gold dark:text-brand-gold-light">{item.num}</span>
              <span>
                <span className="font-heading text-[1.05rem] font-semibold text-foreground">{item.title}</span>
                {item.subtitle && (
                  <span className="ml-2 font-mono text-xs text-muted-foreground">— {item.subtitle}</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <EditorialDivider />

      {/* BrewSoul teaser */}
      <section className={`${EDITORIAL_SECTION} mb-10`}>
        <h2 className={EDITORIAL_EYEBROW}>The Intelligence of Coffee</h2>
        <div className="rounded-xl border border-[#6F4E37]/15 bg-[#6F4E37]/5 p-8">
          <p className="mb-5 text-[1.05rem]/[1.75] text-foreground/85">
            {BREWSOUL_COFFEES.length} coffees scored. 100 chains ranked. 6 identity archetypes. The most opinionated
            coffee intelligence platform on the internet — built on data, not vibes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/brewsoul"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-linear-to-br from-[#6F4E37] to-[#A68B3C] px-5 py-2.5 font-mono text-xs tracking-wide text-white uppercase"
            >
              Enter BrewSoul
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
            <Link
              href="/brewsoul/chains"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#6F4E37]/30 px-5 py-2.5 font-mono text-xs tracking-wide text-[#6F4E37] uppercase dark:text-[#C9A27E]"
            >
              Chain Rankings
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sign-off */}
      <section className="bg-[#0A0A10] px-6 py-10 text-center">
        <p className="mx-auto mb-4 max-w-[31.25rem] font-heading text-xl/normal text-[#F5F0E0]/70 italic sm:text-[1.6rem]/normal">
          &quot;Only time buys trust.
          <br />
          The gold is in the cracks.&quot;
        </p>
        <p className="mb-1 text-sm">
          <a href="mailto:tony@impactsoul.is" className="text-brand-gold-light">
            tony@impactsoul.is
          </a>
        </p>
        <p className="font-mono text-xs tracking-[0.08em] text-[#F5F0E0]/65">
          tonygreenberg.com &nbsp;·&nbsp; impactsoul.is &nbsp;·&nbsp; ramprate.com
        </p>
      </section>

      {/* The Dispatch */}
      <div className="px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-3xl border-y border-brand-gold/20 bg-brand-gold-light/5 px-4 py-6 sm:px-8">
          <p className="mb-1.5 font-mono text-[0.62rem] tracking-[0.18em] text-brand-gold uppercase">
            ◆ The Dispatch
          </p>
          <p className="mb-1.5 font-heading text-lg leading-snug font-semibold text-foreground italic sm:text-xl">
            Not a newsletter. More like a note left on your windshield.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Arrives when something is actually worth saying. No cadence. No funnel. Just the things
            I couldn&apos;t not write.
          </p>
          <NewsletterSignupForm
            source="homepage"
            buttonLabel="I'm in →"
            placeholder="your@email.com"
            className="flex flex-col gap-3 sm:flex-row"
          />
          <p className="mt-2 text-xs text-muted-foreground italic">
            No algorithm. No pitch deck. Leave whenever.
          </p>
        </div>
      </div>
    </div>
  );
}
