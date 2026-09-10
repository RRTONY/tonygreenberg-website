import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/Territory.tsx ("The Folio" — Heroes &
// Gratitude). Real content kept as-is. AutoLinkedText's auto-hyperlinking
// not reproduced here for the same reason noted in /walk-through's page.tsx.

export const metadata: Metadata = {
  title: "The Territory",
  description:
    "The heroes, influences, and intellectual lineage that shaped Tony Greenberg's worldview. From Arnold Patent to Ram Dass to systems thinking.",
  alternates: { canonical: "/the-territory" },
};

const HEROES = [
  {
    name: "Arnold Patent",
    role: "Teacher, Author",
    note: "Taught me that abundance isn't something you acquire — it's something you tune into. His book 'You Can Have It All' rewired how I think about value, exchange, and what it means to receive.",
  },
  {
    name: "Buckminster Fuller",
    role: "Architect, Systems Thinker",
    note: "'You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.' Read that at 22. Never recovered.",
  },
  {
    name: "Ram Dass",
    role: "Spiritual Teacher",
    note: "'Be here now.' Three words that took me twenty years to understand. His bridge between Eastern wisdom and Western psychology is the operating system underneath everything I build. 'Be Love Now' is the sequel your soul didn't know it needed.",
  },
  {
    name: "Donella Meadows",
    role: "Systems Scientist, Author",
    note: "'Thinking in Systems' is the most dangerous book I've ever read — dangerous because once you see leverage points, you can't unsee them. She proved that the most powerful place to intervene in a system is the mindset out of which it arises.",
  },
  {
    name: "Rick Doblin",
    role: "Founder, MAPS",
    note: "Spent 40 years getting MDMA through FDA trials. That's not persistence — that's a calling. He taught me what real conviction looks like.",
  },
  {
    name: "Margaret Wheatley",
    role: "Systems Thinker, Author",
    note: "'Leadership and the New Science' taught me that organizations are living systems, not machines. You don't control them — you create the conditions for them to self-organize. That insight saved me from a decade of bad management.",
  },
  {
    name: "Joanna Macy",
    role: "Buddhist Scholar, Systems Thinker",
    note: "The woman who married Buddhism with systems theory and told the rest of us to stop looking away. Her 'Work That Reconnects' is the emotional infrastructure for anyone trying to build something that matters while the world burns.",
  },
  {
    name: "Matt Mochary",
    role: "CEO Coach, Author",
    note: "What Matt built is a phenomenon — the operating system for the most important, most skilled companies on the planet. 'The Great CEO Within' should be the operating Bible for anyone building a product company. Full stop. We occupy different terrain: RampRate lives at the extremes — Fortune 500 giants and tiny emerging companies just finding their footing. Matt owns the specific middle with surgical precision. He's the best in the world at what he does. We're the best in the world at what we do. That mutual recognition is rare, and it's the criteria by which we choose who to work with.",
  },
  {
    name: "Clarisse Abelarde",
    role: "Artist, Partner, Muse",
    note: "A constant source of inspiration for creativity and love for humankind. Her art reminds me daily that the most important things can't be measured, benchmarked, or tokenized.",
  },
  {
    name: "The RampRate Team",
    role: "25 Years Deep",
    note: "The people who stayed. Who built. Who believed in the mission when the market didn't. Every company is only as good as the people who refuse to leave.",
  },
];

export default function TheTerritoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
        Gratitude
      </p>
      <h1 className="mb-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Heroes &amp; Influences
      </h1>
      <p className="mb-10 text-foreground/80">
        None of this was built alone. These are the people and ideas that shaped how I think, what I
        build, and why I bother. Some are mentors. Some are partners. Some are ideas that hit me
        like a truck and never let go.
      </p>

      <div className="divide-y divide-border">
        {HEROES.map((hero) => (
          <div key={hero.name} className="py-8">
            <div className="mb-2 flex items-baseline gap-3">
              <h3 className="font-heading text-lg font-bold text-foreground">{hero.name}</h3>
              <span className="font-mono text-xs tracking-wide text-brand-gold uppercase">
                {hero.role}
              </span>
            </div>
            <p className="leading-relaxed text-foreground/80">{hero.note}</p>
          </div>
        ))}
      </div>

      <blockquote className="my-10 text-center font-heading text-xl italic text-foreground">
        The people in your life are not resources to be managed. They are mirrors. They show you who
        you are when you&apos;re not performing. Pay attention to the ones who stay when the show is
        over.
      </blockquote>

      <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">Operating Philosophy</h2>
      <p className="mb-4 text-foreground/80">
        I&apos;m a satisficer, not a maximizer. I don&apos;t need the best deal — I need the right
        deal. I don&apos;t need the most connections — I need the real ones. This distinction has
        saved me from more bad decisions than any spreadsheet ever could.
      </p>
      <p className="mb-4 text-foreground/80">
        My companies operate on &quot;rolling closes&quot; — never stop building, never stop
        connecting, never stop iterating. The moment you think you&apos;re done is the moment you
        start dying. Every conversation is a potential collaboration. Every problem is a potential
        product.
      </p>
      <p className="mb-10 text-foreground/80">
        Radical transparency, obsessive documentation, and the power of showing up. Half of success
        is being in the room. The other half is knowing which room.
      </p>

      <div className="mb-10 rounded-r-md border-l-4 border-brand-gold bg-brand-gold/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">The Lesson</p>
        <p className="leading-relaxed text-foreground/80">
          The people who shape you most are rarely the ones with the biggest titles. They&apos;re
          the ones who stayed when the show was over, who told you the truth when the truth was
          expensive, and who modeled what conviction looks like across decades, not quarters.
        </p>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/engine-room" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to The Engine Room <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
