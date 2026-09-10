import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/StartHere.tsx. Real content kept as-is.
// All 5 essays here are ALSO among the 99 blog posts with no real hero image
// (see BLOG-IMAGE-BRIEFS.md) — flagged as high priority there since this is
// the site's own curated "read these first" page, more visible than an
// average post. Renders a graceful text-only fallback panel instead of a
// broken/missing image in the meantime.

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "Five essays that define the worldview. Start with the thinking that started everything.",
  alternates: { canonical: "/start-here" },
};

type Essay = { num: string; slug: string; title: string; why: string; hook: string; tag: string };

const ESSAYS: Essay[] = [
  {
    num: "01",
    slug: "boiling-the-human-summit-harvard-kurzweil",
    title: '"Boiling the Human" — H+ Summit / Harvard-Kurzweil',
    why: "Because the line between human and machine was drawn on a stage at Harvard in 2010. This transcript captures the moment the question stopped being theoretical.",
    hook: "What happens when the people building the future forget to ask the people living in it?",
    tag: "THE RECKONING",
  },
  {
    num: "02",
    slug: "only-time-buys-trust",
    title: "Trust Us? Are You Really My Friend?",
    why: "Because trust is the only currency that compounds. This essay is the thesis statement for everything else on this site.",
    hook: "In a world optimized for speed, the most radical act is patience.",
    tag: "THE LESSON",
  },
  {
    num: "03",
    slug: "psychedelics-could-become-extractive-capitalism",
    title: "Psychedelics Could Become Extractive Capitalism",
    why: "Because consciousness expansion without accountability is just another gold rush. Six investments deep, this is what the view looks like from inside.",
    hook: "The medicine works. The question is whether the business model will poison it.",
    tag: "THE SYSTEMS MAP",
  },
  {
    num: "04",
    slug: "the-ball-and-blockchain-decentralization",
    title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory",
    why: "Because decentralization promised liberation and delivered speculation. This essay maps the gap between the vision and the reality.",
    hook: "Every revolution gets co-opted. The question is when you notice.",
    tag: "THE RECKONING",
  },
  {
    num: "05",
    slug: "return-on-investment-going-green-going-green-2",
    title: "Return on Investment — Are You Going Green?",
    why: "Because impact without returns is charity, and returns without impact is extraction. The math has to work for both.",
    hook: "Green isn't a color. It's a calculation.",
    tag: "THE SYSTEMS MAP",
  },
];

const TAG_COLORS: Record<string, string> = {
  "THE RECKONING": "#9B2335",
  "THE LESSON": "#8B6914",
  "THE SYSTEMS MAP": "#4682B4",
};

function EssayCard({ essay, index }: { essay: Essay; index: number }) {
  const isEven = index % 2 === 0;
  const tagColor = TAG_COLORS[essay.tag] ?? "#8B6914";

  const numberPanel = (
    <div
      className="relative flex min-h-56 items-end p-6"
      style={{ background: `linear-gradient(135deg, ${tagColor}22 0%, ${tagColor}08 100%)` }}
    >
      <span className="font-heading text-7xl font-bold" style={{ color: `${tagColor}33` }}>
        {essay.num}
      </span>
    </div>
  );

  return (
    <Link
      href={`/blog/${essay.slug}`}
      className="mb-8 grid overflow-hidden rounded-md bg-card shadow-sm transition-shadow hover:shadow-lg sm:grid-cols-2"
    >
      {isEven && numberPanel}
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <span
          className="mb-3 inline-block self-start rounded-sm px-2.5 py-1 font-mono text-xs tracking-wide text-white uppercase"
          style={{ background: tagColor }}
        >
          {essay.tag}
        </span>
        <h2 className="mb-4 font-heading text-xl font-normal text-foreground sm:text-2xl">
          {essay.title}
        </h2>
        <p
          className="mb-4 border-l-2 pl-4 font-heading text-foreground/70 italic"
          style={{ borderColor: tagColor }}
        >
          &ldquo;{essay.hook}&rdquo;
        </p>
        <p className="mb-5 text-foreground/70">{essay.why}</p>
        <span className="font-mono text-xs tracking-wide" style={{ color: tagColor }}>
          Read this essay <ForwardIcon aria-hidden="true" />
        </span>
      </div>
      {!isEven && numberPanel}
    </Link>
  );
}

export default function StartHerePage() {
  return (
    <div>
      <div className="bg-[#0A0A10] px-6 py-16 text-center sm:px-10 sm:py-20">
        <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">
          The Foundation
        </p>
        <h1 className="mx-auto mb-6 max-w-xl font-heading text-4xl leading-tight font-normal text-[#F5F0E0] sm:text-5xl">
          Five essays.
          <br />
          <em className="text-brand-gold-light not-italic">One worldview.</em>
        </h1>
        <p className="mx-auto max-w-lg text-lg text-white/60">
          If you&apos;re new here, start with these. They&apos;re the load-bearing walls. Everything
          else is built on top of them.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        {ESSAYS.map((essay, i) => (
          <EssayCard key={essay.slug} essay={essay} index={i} />
        ))}
      </div>

      <div className="bg-[#0A0A10] px-6 py-16 text-center sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
            After the Foundation
          </p>
          <h2 className="mb-6 font-heading text-2xl leading-snug font-normal text-[#F5F0E0]">
            Once you&apos;ve read these five, you&apos;ll know whether this work resonates — or
            repels.
          </h2>
          <p className="mb-8 leading-relaxed text-white/60">
            Either response is useful. The essays that follow explore psychedelic medicine, payments
            infrastructure, enterprise technology, tokenized impact, and the personal cost of
            building systems that matter. Ninety dispatches from twenty-five years in the field. No
            algorithm. No sponsors. Just one person&apos;s attempt to make sense of the largest
            wealth transfer in human history.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-sm bg-brand-gold-light px-7 py-3 font-mono text-xs tracking-wide text-background uppercase"
            >
              Explore All Essays <ForwardIcon aria-hidden="true" />
            </Link>
            <Link
              href="/ecosystem"
              className="rounded-sm border border-white/20 px-7 py-3 font-mono text-xs tracking-wide text-white/70 uppercase"
            >
              Join the Ecosystem <ForwardIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
