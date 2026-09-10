import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Ported from legacy client/src/pages/Nightstand.tsx ("The Folio" —
// Library). Real content kept as-is. The recovered original hero is served
// from managed storage instead of the retired Sanity CDN.

export const metadata: Metadata = {
  title: "The Nightstand",
  description:
    "What Tony Greenberg is reading, watching, and thinking about. Books, articles, and ideas that shape the worldview.",
  alternates: { canonical: "/the-nightstand" },
};

const HERO_IMAGE = "/manus-storage/the-nightstand-hero_ffcf4739.webp";

const BOOKS = [
  {
    title: "Operating Manual for Spaceship Earth",
    author: "Buckminster Fuller",
    note: "The book that rewired my brain at 22. We're all crew on this ship — there are no passengers.",
  },
  {
    title: "The Doors of Perception",
    author: "Aldous Huxley",
    note: "The original map of consciousness expansion. Still the most elegant articulation of what psychedelics reveal.",
  },
  {
    title: "Finite and Infinite Games",
    author: "James P. Carse",
    note: "Finite players play within boundaries. Infinite players play with boundaries. I try to be the latter.",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    note: "The satisficer vs. maximizer framework changed how I make decisions. I'm a satisficer — and proud of it.",
  },
  {
    title: "The Master and His Emissary",
    author: "Iain McGilchrist",
    note: "Left brain vs. right brain isn't what you think. This book is about the crisis of Western civilization.",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    note: '"The mystery of life isn\'t a problem to solve, but a reality to experience." Business advice disguised as science fiction.',
  },
  {
    title: "The Tao Te Ching",
    author: "Lao Tzu",
    note: "The water that wears away the stone. Patience as strategy. Emptiness as fullness.",
  },
];

const CONCEPTS = [
  {
    term: "Satisficing",
    def: "Choosing the first option that meets your criteria rather than exhaustively searching for the optimal one. My operating system.",
  },
  {
    term: "Hedonic Engineering",
    def: "The deliberate design of experiences that maximize well-being. Applied to business, health, and relationships.",
  },
  {
    term: "Rolling Close",
    def: "Never stopping. Every conversation is a potential collaboration. Every problem is a potential product.",
  },
  {
    term: "The Glitch",
    def: "People are the glitches in the system. The beautiful, unpredictable, irreducible anomalies that make everything interesting.",
  },
  {
    term: "Radical Transparency",
    def: "Say what you mean. Show your work. Let people see the process, not just the product.",
  },
];

export default function TheNightstandPage() {
  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80">
        <Image
          src={HERO_IMAGE}
          alt="Books and reading lamp"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          Intellectual Infrastructure
        </p>
        <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          The Library
        </h1>
        <p className="mb-10 text-foreground/80">
          The books and ideas that built my operating system. Not a comprehensive reading list — a
          curated set of texts that actually changed how I think and act.
        </p>

        <div className="mb-10 divide-y divide-border">
          {BOOKS.map((book) => (
            <div key={book.title} className="py-6">
              <div className="mb-1 flex flex-wrap items-baseline gap-3">
                <h3 className="font-heading font-bold text-foreground">{book.title}</h3>
                <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                  {book.author}
                </span>
              </div>
              <p className="leading-relaxed text-foreground/80">{book.note}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          Key Concepts
        </h2>
        <div className="mb-10 divide-y divide-border">
          {CONCEPTS.map((c) => (
            <div key={c.term} className="py-4">
              <span className="font-heading font-bold text-foreground">{c.term}</span>
              <span className="ml-2 text-foreground/80">— {c.def}</span>
            </div>
          ))}
        </div>

        <blockquote className="mb-10 text-center font-heading text-xl italic text-foreground">
          &ldquo;I read the way some people eat — compulsively, omnivorously, with no regard for
          what&apos;s &apos;appropriate.&apos; The best ideas come from the strangest intersections.
          A mycology textbook next to a payments whitepaper next to a Sufi poem. That&apos;s my
          bookshelf.&rdquo;
        </blockquote>

        <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
            The Lesson
          </p>
          <p className="leading-relaxed text-foreground/80">
            Your bookshelf is your autobiography. The ideas you return to aren&apos;t just
            preferences — they&apos;re the scaffolding of every decision you&apos;ll make. Curate
            ruthlessly. The wrong book at the right time can change everything.
          </p>
        </div>

        <div className="border-t border-border py-6 text-center">
          <Link href="/the-web" className="font-mono text-sm tracking-wide text-brand-gold">
            Continue to The Web <ForwardIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
