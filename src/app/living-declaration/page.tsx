import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";

// Ported from legacy client/src/pages/Manifesto.tsx ("A Living Declaration
// — The Measurement of Becoming"). Real essay prose, all real pull quotes
// (Tristan Harris, Toffler, Harari, Eisenstein), the original six
// principles, the six numbered practices, and the "Ecosystem Map" section
// ported in full.
//
// Not ported: the hero background photo and the "hand breakthrough" image
// — both on the now-fully-dead Manus `/api/img/` host, unrecoverable (see
// NEXTJS-MIGRATION-TODO.md Phase 13); replaced with a CSS gradient instead
// of fabricating a substitute. Clarisse Abelarde's artwork image is gone
// the same way — kept the real text crediting her, dropped the photo. The
// "Ecosystem Map" grid originally linked out to 6 other Manus-hosted
// micro-sites (Gem Spark, Regenerative Protocol, SoulSmoke, LiquidSun,
// Sacred Waters, Intimacy Assessment) plus a "Vancefolio" site — all
// confirmed 503, so those link chips are dropped; only chips pointing at
// pages that are actually live in this app (or genuinely planned, like
// /humanos and /flow-circuit, both already referenced elsewhere in this
// migration) are kept. The interactive questionnaire (a `trpc.manifesto
// .submit` mutation with no client-side logic of its own — unlike
// /engage's audit, this one has nothing that works without a backend) is
// replaced with a real, working alternative: a direct email invitation to
// share the same answers, rather than a form that would silently go
// nowhere. "/assessment" (singular) is corrected to "/assessments" — the
// real legacy route name, confirmed elsewhere in App.tsx; likely a typo in
// the original.
export const metadata: Metadata = {
  title: "A Living Declaration",
  description:
    "The Measurement of Becoming — a declaration for measuring human potential, optimizing biochemistry, reducing carbon, and building community toward an abundant future.",
  alternates: { canonical: "/living-declaration" },
};

const STATS = [
  { value: "25", label: "Years Building" },
  { value: "90", label: "Essays Written" },
  { value: "12", label: "Sites Launched" },
  { value: "1M+", label: "Data Points" },
  { value: "6", label: "Active Investments" },
  { value: "$10B+", label: "Benchmarked" },
];

const PRINCIPLES = [
  {
    num: "I",
    title: "Measure the Becoming",
    body: "We believe the most important metric in human history has never been tracked: the speed at which a person becomes their best self. Not productivity. Not output. Not GDP. The velocity of becoming. Every system we build, every index we create, every community we convene exists to compress the distance between who you are and who you're capable of being — and to measure that compression with the same rigor Wall Street applies to quarterly earnings.",
  },
  {
    num: "II",
    title: "Optimize the Vessel",
    body: "Your biochemistry is not a footnote — it's the operating system. Peptides, exosomes, regenerative protocols, psychedelic-assisted therapy, biometric feedback loops with Oura and continuous glucose monitors — these aren't biohacking vanity projects. They're the infrastructure of human potential. You cannot think clearly in a body running on cortisol and seed oils. You cannot love deeply when your nervous system is stuck in fight-or-flight. We connect people to the biochemistry optimization that allows them to lead their most sacred, most fulfilling, most abundant life. Not as luxury. As prerequisite.",
  },
  {
    num: "III",
    title: "Shrink the Footprint, Expand the Soul",
    body: "Here is the heresy that makes economists nervous: the goal is not more GDP. The goal is less. Less extraction. Less waste. Less of the frantic production-consumption cycle that's cooking the planet and hollowing out the species. We're building toward a world where the lowest carbon footprint enables the highest quality of life — where abundance is measured in health, connection, creative output, and time sovereignty, not in units shipped. Every token we mint, every protocol we design, every community we build is oriented toward this inversion: reduce the economic footprint, expand the human one.",
  },
  {
    num: "IV",
    title: "Connect the Dots, Build the Tribe",
    body: "The loneliest generation in human history is also the most connected — digitally. The paradox is the diagnosis. We're not building another social network. We're building the connective tissue for people who've already done the inner work and are ready to find their tribe, their partner, their collaborator, their co-conspirator in building what comes next. Finding your people isn't a feature. It's the foundation. Every great company, every great movement, every great love story started with two people in a room who shouldn't have met but did.",
  },
  {
    num: "V",
    title: "Sacred Accountability",
    body: "We measure everything. Not because measurement is sacred — but because what you measure, you can improve, and what you improve, you can share. The Flow Circuit tracks team performance. The Regenerative Protocol tracks biological optimization. The QPR Index scores intellectual rigor. Sacred Waters maps the geometry of healing. These aren't vanity dashboards. They're mirrors. And mirrors don't lie — even when the reflection is uncomfortable. We hold ourselves accountable first, then invite others to do the same.",
  },
  {
    num: "VI",
    title: "The Invitation Is the Architecture",
    body: "This Living Declaration is not a monologue. It's an open door. We're asking you: What do you want to measure? What indices don't exist yet that should? What community would you build if you had the infrastructure? What does your most abundant life look like — and what's standing between you and it? The answers to these questions become the blueprint. Your input becomes the architecture. This isn't a platform built for you. It's a platform built with you.",
  },
];

const NUMBERED_PRACTICES = [
  { num: "1", title: "Choose satisficing over maximizing.", body: "Set clear criteria for \"good enough.\" Once met, stop searching. The maximizer's pursuit is a trap algorithms exploit. The satisficer's contentment is a fortress they cannot breach." },
  { num: "2", title: "Embrace voluntary simplification.", body: "Reduce complexity by choice before circumstances compel it. This is not deprivation but liberation. Own fewer things. Maintain fewer accounts. Cultivate fewer but deeper relationships." },
  { num: "3", title: "Build at human scale.", body: "Robin Dunbar discovered humans can maintain approximately 150 stable relationships. Invest in these Dunbar-scale communities — your 15-50 deep bonds, your 5 inner circle. These sustain you when large systems fail." },
  { num: "4", title: "Redefine abundance.", body: "True abundance is not accumulation; it is alignment. When resources flow toward your conscious intentions, scarcity dissolves. Shift from \"Do I have enough?\" to \"Am I contributing enough?\"" },
  { num: "5", title: "Let the titans compete.", body: "Large corporations, governments, and AI systems will compete for dominance. You don't need to participate. Turn inward. Build community. Create meaning. Redirect attention to what you can actually affect." },
  { num: "6", title: "Love more, need less.", body: "The ultimate hedge against AI dominance and civilizational stress is genuine human love, presence, and connection. These require no external energy, scale poorly (which is their strength), and constitute the irreducible core of flourishing." },
];

const STEPS = [
  { label: "On your information diet", text: "Limit news to one focused session daily. Eliminate notifications except direct messages from people you know." },
  { label: "On your finances", text: "Maintain 6-12 months liquidity. Avoid debt that creates dependency. Invest in resilience — skills, relationships, community." },
  { label: "On your relationships", text: "Quality over quantity. Depth over breadth. Difficult conversations now, boundary-setting now, repair work now." },
  { label: "On your mind", text: "Invest in practices that restore your nervous system: meditation, nature, exercise, connection, sleep. These are not luxuries. They are infrastructure." },
];

const ECOSYSTEM_MAP = [
  {
    principle: "Measure the Becoming",
    proof: "The QPR Index scores intellectual rigor across 91 essays. The Flow Circuit maps team performance. Human OS V2.0 diagnoses decision-making patterns. The Gem Spark maps serendipity.",
    links: [{ label: "Human OS", href: "/humanos" }],
  },
  {
    principle: "Optimize the Vessel",
    proof: "The Regenerative Protocol tracks biological optimization. SoulSmoke and LiquidSun honor what enters the body. Sacred Waters maps the molecule that remembers.",
    links: [{ label: "The Liquid Library", href: "/spirits" }],
  },
  {
    principle: "Shrink the Footprint",
    proof: "The Dairy Tax calculated the true carbon cost of cheese. ImpactSoul tokenizes assets for ocean cleanup. FusionRamp/STRATUM bridges Web3 to enterprise reality.",
    links: [
      { label: "Dairy Tax Essay", href: "/blog/the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet" },
      { label: "Ecosystem", href: "/ecosystem" },
      { label: "Going Green", href: "/blog/return-on-investment-going-green-going-green-2" },
    ],
  },
  {
    principle: "Connect the Dots",
    proof: "The Intimacy Assessment maps your relationship intelligence. The Relationship Circuit threads four essays on love. The community invites you to find your tribe.",
    links: [
      { label: "Journeys", href: "/journeys" },
      { label: "Community", href: "/community" },
      { label: "Love as Dharma", href: "/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership" },
    ],
  },
  {
    principle: "Sacred Accountability",
    proof: "Homeaglow Exposed holds corporations accountable. Vancefolio enforces portfolio intelligence. Every essay is scored, rated, and open to reaction.",
    links: [
      { label: "Homeaglow Exposed", href: "https://homeaglowexposed.com" },
      { label: "Intel", href: "/intel" },
    ],
  },
  {
    principle: "The Invitation",
    proof: "This page. The Life Assessment below. Find Your Journey maps your path. The community you build here becomes the infrastructure for what comes next.",
    links: [
      { label: "Community", href: "/community" },
      { label: "All Sites", href: "/recent-creations" },
    ],
  },
];

function PullQuote({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div className="bg-secondary px-6 py-14 text-center sm:px-10 dark:bg-[#0A0A10]">
      <blockquote className="mx-auto max-w-2xl font-heading text-xl leading-relaxed text-foreground italic sm:text-2xl">
        &quot;{quote}&quot;
      </blockquote>
      <p className="mt-5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        — {attribution}
      </p>
    </div>
  );
}

export default function LivingDeclarationPage() {
  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 py-24 text-center sm:px-10 dark:from-[#0A0A10] dark:to-background">
        <p className="mb-5 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          A Living Declaration
        </p>
        <h1 className="mx-auto mb-6 max-w-2xl font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
          The Measurement <span className="text-brand-gold">of Becoming</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-foreground/70">
          We&apos;re going to measure how fast people can become their best self — and connect
          them to the biochemistry, the community, and the accountability infrastructure that
          makes it possible. The most abundant life. The lowest carbon footprint. A better
          humanity for the future.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 border-y border-brand-gold/20 bg-secondary px-6 py-10 text-center sm:grid-cols-3 sm:px-10 lg:grid-cols-6 dark:bg-[#0A0A10]">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-heading text-2xl font-bold text-brand-gold">{s.value}</div>
            <div className="mt-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>The Premise</EyebrowLabel>
        <p>
          For twenty-five years I&apos;ve been building companies, exposing extractive systems,
          investing in consciousness-expanding medicine, tokenizing dinosaur skeletons for ocean
          cleanup, and writing about what happens when you refuse to accept the world as it&apos;s
          handed to you. Ninety-one essays. Twelve sites. A million data points. Six psychedelic
          medicine investments. A B Corp that tokenizes impact. A payments corridor measured in
          billions.
        </p>
        <p>
          All of it — every single thread — converges on one question:{" "}
          <strong>
            How fast can a human being become the best version of themselves, and what
            infrastructure do they need to get there?
          </strong>
        </p>
        <p>
          This Living Declaration is the answer. Not a final answer — a living one. It will
          change as you change it. Because the most important thing I&apos;ve learned in
          twenty-five years of building is this: the best architecture is the one your community
          finishes for you.
        </p>
      </div>

      <hr className="border-border" />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>Boiling the Human Revisited</EyebrowLabel>
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          The Talk That Started It All
        </h2>
        <p>
          At a Humanity+ conference at Harvard in 2010, I shared the stage with{" "}
          <strong>Ray Kurzweil</strong> to celebrate human potential and ingenuity. Yet even in
          that heady age of tech optimism — on the eve of Arab Spring when social media was
          undermining rather than enabling authoritarianism — I wasn&apos;t there to blindly
          cheerlead progress.
        </p>
        <p>
          Instead, I warned about the drive to exploit, to add fine print, to enshittify every
          product for an additional dollar — and how the process could be so slow and
          imperceptible that we would fail to notice it like a frog slowly being boiled alive.
          Few listened. The congregation was drunk on possibility.
        </p>
        <p>
          Two years later, in 2012, I wrote about the <strong>Human Operating System</strong> —
          arguing that &quot;artificial intelligence is no match for natural stupidity&quot; and
          that we needed technology built to fit humans &quot;like a glove instead of a
          cast.&quot; The thesis has only become more urgent.
        </p>
        <p>
          Today we both can claim the mantle of prophecy. In the last five years, we&apos;ve made
          as big a leap as any since splitting the atom. Yet the value of this change to humanity
          is just as ambiguous as the nuclear age. With superhuman intelligence at our
          fingertips, we haven&apos;t become supermen. We&apos;ve become shallower, more anxious,
          and less capable.
        </p>
        <div className="my-8 text-center">
          <Link
            href="/blog/boiling-the-human-summit-harvard-kurzweil"
            className="rounded-md border border-brand-gold/30 px-6 py-2.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
          >
            Read the Original &quot;Boiling the Human&quot; Essay →
          </Link>
        </div>

        <EyebrowLabel>The World Waking Up</EyebrowLabel>
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground sm:text-2xl">
          The Frog Was Boiled Too Fast — and Can Still Jump
        </h2>
        <p>
          The good news is that the pace of change has jolted us into awareness.{" "}
          <strong>Tristan Harris</strong>, former Design Ethicist at Google, describes &quot;human
          downgrading&quot; — the systematic erosion of human capacity through technologies
          optimized for engagement rather than flourishing. <strong>Aza Raskin</strong>, who
          invented the infinite scroll, now speaks with deep regret. They founded the Center for
          Humane Technology, warning that social media was humanity&apos;s first contact with AI
          — and that humanity lost.
        </p>
        <p>
          Tristan and Aza are acquaintances of mine, and I&apos;m gratified to see their power and
          direction become more relevant every day. They&apos;ve reached hundreds of millions
          with their message. The world is finally listening.
        </p>
      </div>

      <PullQuote
        quote="What we really need are people who grieve their way through the full metabolism and recognition of the metacrisis. And on the other side of that grief is the love you have for the world — post-tragic optimism, which is coming from love to protect that world as best as possible, being in service of that, but unattached to the outcome."
        attribution="Tristan Harris, Reclaiming Human Agency (2026)"
      />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>An Algorithm for Human Scale Agency</EyebrowLabel>
        <p>
          Yet I did not write this to add to the chorus of doom. Fear is not just a poor
          foundation for flourishing — it&apos;s a surrender to the very forces you think
          you&apos;re fighting. The attention economy profits from your anxiety. Don&apos;t let
          them.
        </p>
        <p>
          I offer a different path: <strong>agency at human scale</strong>. In a world of systems
          designed to break you down, you can stand tall and reclaim your self-determination.
        </p>
        <h3 className="mt-8 mb-2 font-heading text-lg font-bold text-foreground">
          Ancient Wisdom and Modern Science Converge
        </h3>
        <p>
          Many wisdom traditions that survived millennia converge on similar core practices:
          moderation, community, presence, contentment. The Stoics knew this two thousand years
          ago. The Buddhists knew it five hundred years before that. This convergence reflects
          invariant features of human flourishing.
        </p>
        <p>
          Fifty-five years ago, <strong>Alvin Toffler</strong> warned of &quot;Overchoice.&quot;
          Thirty-four years later, <strong>Barry Schwartz</strong> proved him right. In{" "}
          <em>The Paradox of Choice</em>, he identified Maximizers (who exhaustively search for
          optimal) and{" "}
          <Link href="/the-territory" className="text-brand-gold underline underline-offset-2">
            Satisficers
          </Link>{" "}
          (who stop at &quot;good enough&quot;). The finding was counterintuitive: satisficers
          are happier.
        </p>
      </div>

      <PullQuote
        quote="The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn."
        attribution="Alvin Toffler"
      />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The Original Six Principles</EyebrowLabel>
        <h2 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Not Commandments. Invitations.
        </h2>
        <p className="mb-8 text-muted-foreground">
          For those who feel they can&apos;t get their head above water, here&apos;s an imperfect
          start.
        </p>
        {NUMBERED_PRACTICES.map((p) => (
          <div key={p.num} className="mb-8 grid grid-cols-[2.5rem_1fr] gap-4">
            <div className="pt-1 font-heading text-2xl text-brand-gold">{p.num}</div>
            <div>
              <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground">{p.title}</h3>
              <p className="leading-relaxed text-foreground/80">{p.body}</p>
            </div>
          </div>
        ))}

        <div className="mt-8 border-t border-border pt-8">
          <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
            For Every Rule, There Are Exceptions
          </h3>
          <p className="leading-relaxed text-foreground/80">
            This framework assumes baseline security. If you&apos;re in survival mode, meet basic
            needs first. Satisficing is not settling. The satisficer chooses sufficiency from
            clarity. The settler accepts inadequacy from exhaustion. Know when to maximize.
            Don&apos;t satisfice on safety, health, or ethics. Maximize your child&apos;s
            blossoming. Maximize your closest relationships. Satisfice on secondary decisions
            that drain bandwidth without adding meaning.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
            Specific Steps to Take Today
          </h3>
          {STEPS.map((step) => (
            <p key={step.label} className="mb-3 leading-relaxed text-foreground/80">
              <strong className="text-foreground">{step.label}:</strong> {step.text}
            </p>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>Phase 2: Rebuilding the Systems</EyebrowLabel>
        <p>
          Just like pre-flight instructions that tell you to put on your oxygen mask before
          assisting others, find your own serenity first. Then join me in designing
          systems-breakers to help us find ourselves again.
        </p>
        <p>
          When I build{" "}
          <a
            href="https://impactsoul.is"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold underline underline-offset-2"
          >
            ImpactSoul
          </a>
          , I&apos;m enabling reconciliation between making a living and doing good — while
          rebuilding human-scale connections in self-governing decentralized communities.
        </p>
        <p>
          <strong>Balaji Srinivasan</strong> — crypto-philosopher and architect of{" "}
          <em>The Network State</em> — offers the maximizer&apos;s complement to this framework.
          He&apos;s building a startup society prototype near Singapore, arguing technology
          should &quot;reduce the barrier to exit&quot; by giving people alternatives to broken
          systems. But we converge on a crucial point: a startup society must be &quot;about
          community culture first, and technological innovation second.&quot; Technology serves
          values, not the reverse.
        </p>
        <p>
          Balaji builds the new airplane. I&apos;m asking you to secure your oxygen mask first.
          First find your center. Then build.
        </p>
        <div className="mt-8 border-t border-border pt-8">
          <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
            Recommended Reading
          </h3>
          <p>
            For those who want to understand the man racing to build the future before we&apos;ve
            decided what it should look like, read{" "}
            <a
              href="https://www.amazon.com/Optimist-Sam-Altman-OpenAI-Invent/dp/1668066920"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold underline underline-offset-2"
            >
              <em>The Optimist: Sam Altman, OpenAI, and the Race to Invent the Future</em>
            </a>{" "}
            by <strong>Keach Hagey</strong> of the Wall Street Journal. Written with Altman&apos;s
            cooperation but no hagiography — it lets you see how thoroughly Silicon Valley has
            absorbed its own mythology, and why that matters for everything this Living
            Declaration is about.
          </p>
        </div>
      </div>

      <PullQuote
        quote="The danger is that if we invest too much in developing AI and too little in developing human consciousness, the very sophisticated artificial intelligence of computers might only serve to empower the natural stupidity of humans."
        attribution="Yuval Noah Harari"
      />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 text-center leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>Coda</EyebrowLabel>
        <p>
          The storm is coming — or perhaps it is already here. You cannot control the storm. But
          you can become the kind of person who navigates storms with grace. You can build the
          kind of community that weathers storms together. And once you do, you can start
          systemic change to make the journey easier for others.
        </p>
        <p className="font-heading text-lg font-bold text-foreground">
          It begins with you. It begins now.
        </p>
      </div>

      <hr className="border-border" />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>The Puzzle Pieces</EyebrowLabel>
        <p>
          Each person I&apos;ve met, each conversation I&apos;ve had, each advisor who signed up
          for my bag of cookies — they are all part of the development of my ideals. And for
          that, I appreciate each one of them.
        </p>
        <p>
          These ideals are belief systems: thoughts attached to feelings. This construct was
          brought out by{" "}
          <Link href="/the-territory" className="text-brand-gold underline underline-offset-2">
            Arnold Patent
          </Link>{" "}
          in his seminal book <em>You Can Have It All</em> — do buy and read it. I&apos;m also
          shaped by{" "}
          <Link href="/the-territory" className="text-brand-gold underline underline-offset-2">
            Ram Dass
          </Link>
          , after studying with him for much time in Maui. And I&apos;m profoundly influenced by
          my partner and glorious artist Clarisse Abelarde, whose work has been a constant
          inspiration to my creativity and my love for humankind.
        </p>
        <p>
          Every advisor who joined this journey, every skeptic who challenged my assumptions,
          every visionary who saw what I couldn&apos;t yet articulate — they each added a piece
          to the puzzle. The Human OS framework you see here is not mine alone. It&apos;s the
          distillation of collective wisdom, the simplification of profound complexity that only
          emerges when diverse minds collide and collaborate.
        </p>
        <p>
          This is how we absorb AI and AGI into our lives. This is how we find our place in the
          sun. Not through individual genius, but through the patient accumulation of insight,
          the willingness to learn and unlearn, and the humility to recognize that the formula
          for navigating this new era was always going to be a collaborative effort.
        </p>
        <p className="font-semibold text-foreground italic">
          To everyone who contributed — whether you know it or not — thank you. You are the
          operating system behind the Operating System.
        </p>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The Six Principles</EyebrowLabel>
        <h2 className="mb-8 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          What We Believe. What We Build. <em className="text-brand-gold not-italic">What We Measure.</em>
        </h2>
        {PRINCIPLES.map((p) => (
          <div key={p.num} className="mb-9 grid grid-cols-[3rem_1fr] gap-5">
            <div className="pt-1 font-heading text-3xl text-brand-gold">{p.num}</div>
            <div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">{p.title}</h3>
              <p className="leading-relaxed text-foreground/80">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <PullQuote
        quote="The goal is not more GDP. The goal is less. Less extraction. Less waste. Less of the frantic production-consumption cycle that's cooking the planet and hollowing out the species."
        attribution="Principle III — Shrink the Footprint, Expand the Soul"
      />

      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        <EyebrowLabel>The Living Proof</EyebrowLabel>
        <h2 className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          This Isn&apos;t Theory. It&apos;s Already Being Built.
        </h2>
        <p className="mb-8 max-w-2xl text-foreground/70">
          Every principle in this Living Declaration maps to something that already exists — a
          site, a protocol, an investment, an essay, a community. The infrastructure isn&apos;t
          hypothetical. It&apos;s live.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_MAP.map((item) => (
            <div key={item.principle} className="flex flex-col rounded-md border border-border bg-card p-6">
              <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
                {item.principle}
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-foreground/70">
                {item.proof}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.links.map((link) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-brand-gold/20 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="rounded-sm border border-brand-gold/20 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PullQuote
        quote="The old world is falling apart. The new world is being born. In between, there is a great deal of confusion and suffering. But this is also a time of tremendous opportunity — to let go of what no longer serves us and to create something beautiful."
        attribution="Charles Eisenstein"
      />

      <div className="mx-auto max-w-2xl px-6 py-14 text-center sm:px-10">
        <EyebrowLabel>Discover Your Operating System</EyebrowLabel>
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Are You a Conscious Satisficer?
        </h2>
        <p className="mb-8 text-foreground/70">
          The ideas in this Living Declaration aren&apos;t abstract — they&apos;re diagnostic.
          Take the assessment to discover your decision-making pattern, understand your
          relationship with technology, and find out where you sit on the spectrum between
          maximizer and satisficer. Then share your results with someone who needs to read this.
        </p>
        <Link
          href="/assessments"
          className="mb-4 inline-block rounded-md bg-foreground px-8 py-3 font-mono text-sm tracking-wide text-background uppercase"
        >
          Take the Assessment →
        </Link>
        <div>
          <Link
            href="/humanos"
            className="inline-block rounded-md border border-red-800/30 px-6 py-2.5 font-mono text-xs tracking-wide text-red-800 uppercase"
          >
            Or Explore Human OS V2.0 →
          </Link>
        </div>
      </div>

      <hr className="border-border" />

      <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
        <EyebrowLabel>Your Turn</EyebrowLabel>
        <h2 className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          The Architecture Needs <em className="text-brand-gold not-italic">Your Blueprint</em>
        </h2>
        <p className="mb-8 text-foreground/70">
          This isn&apos;t a survey. It&apos;s an invitation to co-create. What do you want to
          measure? What indices don&apos;t exist yet that should? What community would you build
          if you had the infrastructure? What does your most abundant life look like? Send your
          answers directly — one question or all of them, there are no wrong answers, only
          honest ones.
        </p>
        <a
          href="mailto:tony@impactsoul.is?subject=My%20Blueprint%20for%20the%20Living%20Declaration"
          className="inline-block rounded-md bg-brand-gold px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Submit My Blueprint →
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          Your responses are read personally. They shape what gets built. Nothing is sold or
          shared.
        </p>
      </div>

      <div className="bg-secondary px-6 py-16 text-center sm:px-10 dark:bg-[#0A0A10]">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          The Next Step
        </p>
        <h2 className="mx-auto mb-4 max-w-lg font-heading text-2xl font-normal text-foreground sm:text-3xl">
          Build Your Tribe. Find Your People.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-foreground/70">
          Upload your contacts. Invite your people. Let the community find the connections you
          didn&apos;t know existed. Finding your tribe, your partner, your collaborator — it all
          starts here.
        </p>
        <Link
          href="/community"
          className="mb-5 inline-block rounded-md bg-brand-gold px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Enter the Community →
        </Link>
        <div className="mb-3">
          <Link
            href="/assessments"
            className="inline-block rounded-md border border-brand-gold/40 px-6 py-2.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
          >
            Or Take the Assessment First →
          </Link>
        </div>
        <div>
          <Link
            href="/humanos"
            className="inline-block rounded-md border border-red-800/30 px-6 py-2.5 font-mono text-xs tracking-wide text-red-800 uppercase"
          >
            Explore Human OS V2.0 →
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/community" className="font-mono text-sm tracking-wide text-brand-gold">
          Continue to The Community →
        </Link>
      </div>
    </div>
  );
}
