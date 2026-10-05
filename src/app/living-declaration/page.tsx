import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { BlueprintForm } from "./blueprint-form";

// Ported from legacy client/src/pages/Manifesto.tsx ("A Living Declaration
// — The Measurement of Becoming"). Real essay prose, all real pull quotes
// (Tristan Harris, Toffler, Harari, Eisenstein), the original six
// principles, the six numbered practices, and the "Ecosystem Map" section
// ported in full.
//
// The hero background photo, the "hand breakthrough" image and Clarisse
// Abelarde's artwork were on the Manus `/api/img/` host; all three were
// rescued into Sanity on 2026-09-28 (docs/ai/manus-media-rescue.md) and are
// back in legacy's positions with legacy's alt text. The artwork caption
// drops legacy's link to Clarisse's Manus-hosted site (zero-Manus rule). The
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
//
// 2026-10-01: copy re-synced to the rewritten live page (Tony's current
// wording for the hero, premise, essay sections, six practices, six
// principles, coda, puzzle pieces, "Your Turn" and "Next Step"). The live
// page restored the six-question blueprint form, so it's back as
// `blueprint-form.tsx` (still a pre-filled email, no backend), and the hero
// "Add Your Voice" button jumps to it. Ecosystem chips follow live's set,
// minus live's Manus-hosted micro-site links and its self-link for
// FusionRamp / STRATUM; "The Index" goes to /search and "Life Assessment"
// to /the-mirror (where those URLs redirect), "Homeaglow Exposed" keeps
// homeaglowexposed.com (live's internal route isn't ported). The
// assessment CTA now follows live to /assessment (a real page here).
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
  { value: "$10B+", label: "Enterprise Contracts" },
];

const PRINCIPLES = [
  {
    num: "I",
    title: "Measure What Matters",
    body: "The number I care about is not productivity, output, or GDP. It is the distance between the life someone has and the life they know they could be living. If we are going to measure anything, let it be whether the tools, habits, and people around us are helping close that distance.",
  },
  {
    num: "II",
    title: "Take Care of the Body",
    body: "A tired, anxious, inflamed body makes everything harder. So does treating every new protocol like a miracle. I am interested in the patient work: better information, better questions, careful experimentation, and qualified medical guidance when it is needed. The point is not to become a project. The point is to feel more present in your own life.",
  },
  {
    num: "III",
    title: "Use Less. Live More.",
    body: "I do not think a better life requires a larger pile of stuff. It requires less waste, less extraction, and fewer systems that turn people and places into inputs. A good life has room for health, friendship, useful work, beauty, and time. If we can get more of that while doing less damage, that is a trade worth making.",
  },
  {
    num: "IV",
    title: "Find Your People",
    body: "We are surrounded by ways to connect and strangely starved for real connection. I am not interested in another feed. I am interested in the people you call when something breaks, the collaborator who makes your idea better, and the friend who tells you the truth. Most meaningful things begin when two people who should have met finally do.",
  },
  {
    num: "V",
    title: "Tell the Truth About the Score",
    body: "Measurement can be useful when it keeps us honest. It can also become a costume. The work here is to make useful mirrors: ways to see where a team is stuck, where an idea is thin, or where a health question needs a better answer. I want the score to start a better conversation, not end one.",
  },
  {
    num: "VI",
    title: "Make It With People, Not At Them",
    body: "This page is a work in progress, not a sermon from a mountaintop. Tell me what I have missed. Tell me what does not hold up. Tell me what you would build if you had more help and fewer hoops to jump through. The best ideas get better when someone has the nerve to challenge them.",
  },
];

const NUMBERED_PRACTICES = [
  { num: "1", title: "Choose satisficing over maximizing.", body: "Write down what is good enough. When you get there, stop. Endless comparison is a game designed to keep you dissatisfied." },
  { num: "2", title: "Embrace voluntary simplification.", body: "Make your life a little less complicated before life does it for you. Fewer accounts, fewer things to maintain, and a few deeper relationships can be a very good trade." },
  { num: "3", title: "Build at human scale.", body: "Put real effort into the people who know you well and show up when it matters. Big systems come and go. Your close circle is the part you can actually tend." },
  { num: "4", title: "Redefine abundance.", body: "Abundance is not simply having more. It is having enough room, enough health, and enough agency to make a decent choice. Ask less often, \"Do I have enough?\" and more often, \"What am I making possible?\"" },
  { num: "5", title: "Let the titans compete.", body: "Large companies, governments, and AI systems will fight for dominance. You do not have to make their contest your whole life. Put your energy into the people and places you can actually affect." },
  { num: "6", title: "Love more, need less.", body: "Real love, attention, and friendship are not small things. They are the parts of life that resist being turned into a product, and they are worth protecting." },
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
    links: [
      { label: "The Index", href: "/search" },
      { label: "Flow Circuit", href: "/flow-circuit" },
      { label: "Human OS", href: "/humanos" },
    ],
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
      { label: "Open Door", href: "/the-open-door" },
      { label: "Intel", href: "/intel" },
    ],
  },
  {
    principle: "The Invitation",
    proof: "This page. The Life Assessment below. Find Your Journey maps your path. The community you build here becomes the infrastructure for what comes next.",
    links: [
      { label: "Life Assessment", href: "/the-mirror" },
      { label: "Find Your Journey", href: "/find-your-journey" },
      { label: "Community", href: "/community" },
      { label: "All 11 Sites", href: "/recent-creations" },
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

const IMG_BASE = "https://cdn.sanity.io/images/a3q1cyqs/production/";
const HERO_IMG = `${IMG_BASE}72768f467b1504fe9d4870dea2f907d4bf3bf204-1200x669.webp`;
const HAND_IMG = `${IMG_BASE}71fd25c09d03114e8c6a59aa38fd4d4dede6c7ea-1200x669.webp`;
const CLARISSE_ART_IMG = `${IMG_BASE}d8e3526e3f1115dbeaf0b0e85435c5ce0614bb86-817x800.webp`;

export default function LivingDeclarationPage() {
  return (
    <div>
      {/* Live's 90vh hero sits under its header; ours starts below the header, so the
          min-height drops the header (~4.2rem) and the larger bottom padding keeps the
          text centered where live centers it. */}
      <div className="relative isolate flex min-h-[calc(90vh-4.2rem)] flex-col items-center justify-center overflow-hidden bg-[#0A0A10] px-6 pt-16 pb-33 text-center sm:px-10">
        <Image src={HERO_IMG} alt="" fill fetchPriority="high" loading="eager" sizes="100vw" className="-z-20 object-cover brightness-35 saturate-80" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,105,20,0.15)_0%,transparent_70%)]"
        />
        <p className="mb-6 font-mono text-[0.72rem]/[1.85] tracking-[0.3em] text-brand-gold-light uppercase">
          A Living Declaration
        </p>
        <h1 className="mx-auto mb-6 max-w-2xl font-heading text-[clamp(2.4rem,6vw,4.5rem)]/[1.08] font-normal text-[#F5F0E8]">
          The Measurement <span className="text-brand-gold-light">of Becoming</span>
        </h1>
        <p className="mx-auto mb-8 max-w-155 text-[1.2rem]/[1.8] text-[#F5F0E8]/75">
          This is a working declaration, not a new religion. I am interested in a simple
          question: how do we help people get closer to the life they know they could live? The
          answers live in the body, in our relationships, in our habits, and in the systems we
          choose to build.
        </p>
        <a
          href="#your-turn"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-brand-gold-light px-10 py-3.5 font-mono text-xs tracking-[0.15em] text-[#0A0A10] uppercase transition-colors hover:bg-[#F5F0E0]"
        >
          Add Your Voice <ArrowRight aria-hidden="true" className="size-3.5" />
        </a>
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
          For twenty-five years, I have built companies, picked apart bad incentives, invested in
          difficult ideas, and written about what happens when you refuse to accept the world
          exactly as it is handed to you. Some of that work has involved enterprise contracts,
          some has involved medicine, some has involved fossils and oceans. It has all been an
          attempt to find the people and systems worth betting on.
        </p>
        <p>
          Underneath all of it is one question:{" "}
          <strong>
            What helps a person live with more clarity, more agency, and more room to become who
            they are?
          </strong>
        </p>
        <p>
          This is not my final answer. It is a set of working principles, and I expect it to
          change when somebody smarter than me shows me a better way to think about it. The best
          work I have done has always been improved by people willing to take me to school.
        </p>
      </div>

      <hr className="border-border" />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>Boiling the Human Revisited</EyebrowLabel>
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          The Talk That Started It All
        </h2>
        <p>
          At a Humanity+ conference at Harvard in 2010, I shared a stage with{" "}
          <strong>Ray Kurzweil</strong> during the high-water mark of tech optimism. I was
          excited by the possibility too. I was also already worried about what happened when
          the business model was to keep people staring at the machine.
        </p>
        <p>
          I warned about the slow drift toward smaller print, worse products, and another dollar
          squeezed from every interaction. The danger was not one dramatic betrayal. It was the
          thousand tiny tradeoffs that make life meaner while we are busy admiring the
          convenience.
        </p>
        <p>
          Two years later, I wrote about the <strong>Human Operating System</strong>. My point was
          blunt: artificial intelligence is no match for natural stupidity, and technology should
          fit human beings like a glove, not a cast. That still feels like a useful test.
        </p>
        <p>
          I am less interested in claiming prophecy than in noticing what is right in front of
          us. The tools have become startlingly powerful. That does not automatically make us
          wiser, kinder, or less lonely. It means we have work to do.
        </p>
        <div className="my-8 text-center">
          <Link
            href="/blog/boiling-the-human-summit-harvard-kurzweil"
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-gold/30 px-6 py-2.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
          >
            Read the Original &quot;Boiling the Human&quot; Essay <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <Image
          src={HAND_IMG}
          alt="A hand breaking through the algorithmic grid — organic energy and golden flowers bursting through the machine"
          width={1200}
          height={669}
          sizes="(max-width: 768px) 100vw, 672px"
          className="my-12 h-auto w-full rounded-sm opacity-90"
        />

        <EyebrowLabel>The World Waking Up</EyebrowLabel>
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground sm:text-2xl">
          The Frog Was Boiled Too Fast — and Can Still Jump
        </h2>
        <p>
          The speed of change has at least made the problem harder to ignore.{" "}
          <strong>Tristan Harris</strong>, former Design Ethicist at Google, calls it &quot;human
          downgrading&quot;: products tuned for engagement instead of attention, judgment, or
          peace. <strong>Aza Raskin</strong>, who helped create the infinite scroll, has spoken
          openly about the cost. Their warning is simple: we should not confuse a tool that
          captures us with a tool that serves us.
        </p>
        <p>
          I know Tristan and Aza, and I am glad their work is getting a wider hearing. It gives
          the rest of us a chance to stop pretending that convenience is neutral.
        </p>
      </div>

      <PullQuote
        quote="What we really need are people who grieve their way through the full metabolism and recognition of the metacrisis. And on the other side of that grief is the love you have for the world — post-tragic optimism, which is coming from love to protect that world as best as possible, being in service of that, but unattached to the outcome."
        attribution="Tristan Harris, Reclaiming Human Agency (2026)"
      />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>An Algorithm for Human Scale Agency</EyebrowLabel>
        <p>
          I did not write this to make anxiety into another product. Fear is easy to sell. It
          keeps people scrolling, arguing, and handing over their attention. I am more interested
          in what we can do with the piece of life directly in front of us.
        </p>
        <p>
          I offer something smaller and harder: <strong>agency at human scale</strong>. Know what
          you value. Put your attention there. Build enough steadiness to make your own
          decisions. Then help somebody else do the same.
        </p>
        <h3 className="mt-8 mb-2 font-heading text-lg font-bold text-foreground">
          Old Ideas, Still Useful
        </h3>
        <p>
          The traditions that lasted tend to return to the same unglamorous things: moderation,
          community, presence, and enough. The Stoics wrote about it. Buddhists wrote about it
          earlier. You do not need a new app to understand the basic assignment.
        </p>
        <p>
          <strong>Alvin Toffler</strong> warned about too much choice. Later,{" "}
          <strong>Barry Schwartz</strong> gave the problem a name in{" "}
          <em>The Paradox of Choice</em>: maximizers keep searching for perfect, while{" "}
          <Link href="/the-territory" className="text-brand-gold underline underline-offset-2">
            satisficers
          </Link>{" "}
          know when good enough is genuinely enough. That is not laziness. It is a way of keeping
          your life from becoming a series of browser tabs.
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
          Start by getting yourself a little steadier. Like the oxygen-mask instruction, it is
          hard to help anyone else if you cannot breathe. Then bring what you have learned into
          the systems around you.
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
          , I am trying to prove that making a living and doing some good do not have to
          be enemies. The work is messy. That is fine. It is better than waiting for a clean
          theory.
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
          Balaji is building a new airplane. I am asking you to secure your oxygen mask first.
          Find your center. Then build something worth sharing.
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
          The weather is already rough in plenty of places. You cannot control all of it. You can
          decide what you pay attention to, what you make, and who you stand beside. Get steady
          enough to be useful. Then make the road a little easier for the next person.
        </p>
        <p className="font-heading text-lg font-bold text-foreground">Start where your feet are.</p>
      </div>

      <hr className="border-border" />

      <div className="article-body mx-auto max-w-2xl px-6 py-14 leading-[1.9] sm:px-10 [&>p]:mb-4">
        <EyebrowLabel>The Puzzle Pieces</EyebrowLabel>
        <p>
          Most of the decent things I believe were smuggled in through conversations: an argument
          over coffee, an advisor who called bullshit, a friend who did not let me off the hook.
          Even the people who signed up for my bag of cookies have had a hand in this.
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
          my partner and glorious artist Clarisse Abelarde, whose work is shown here as a
          constant inspiration to my creativity and my love for humankind.
        </p>
        <figure className="my-10">
          <Image
            src={CLARISSE_ART_IMG}
            alt="Artwork by Clarisse Abelarde — mixed media collage portrait"
            width={817}
            height={800}
            sizes="(max-width: 640px) 100vw, 520px"
            className="h-auto w-full max-w-130 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
          />
          <figcaption className="mt-3 font-mono text-[0.72rem] tracking-[0.12em] text-brand-gold uppercase">
            Artwork by Clarisse Abelarde
          </figcaption>
        </figure>
        <p>
          Advisors, skeptics, artists, and people who saw something before I could name it have
          all left fingerprints here. The Human OS is not a finished system and it is not mine
          alone. It is a pile of useful questions, gathered from people willing to argue in good
          faith.
        </p>
        <p>
          No one gets through a strange century by themselves. We will need the patience to
          learn, the courage to change our minds, and enough humility to admit we do not have the
          formula yet.
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
          These ideas are not just words on a page. They show up in projects, essays,
          investments, experiments, and conversations that are already underway. Some will work.
          Some will need to be dismantled. All of them are open to scrutiny.
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
                      className="inline-flex items-center gap-1.5 rounded-sm border border-brand-gold/20 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase"
                    >
                      {link.label} <ArrowUpRight aria-hidden="true" className="size-3" />
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
          This is not a personality label. It is a chance to notice how you make decisions, what
          technology is doing to your attention, and where you might be making life harder than
          it needs to be. Take it if that sounds useful. Leave it if it does not.
        </p>
        <Link
          href="/assessment"
          className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-8 py-3 font-mono text-sm tracking-wide text-background uppercase"
        >
          Take the Assessment <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
        <div>
          <Link
            href="/humanos"
            className="inline-flex items-center gap-1.5 rounded-md border border-red-800/30 px-6 py-2.5 font-mono text-xs tracking-wide text-red-800 uppercase"
          >
            Or Explore Human OS V2.0 <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>

      <hr className="border-border" />

      <div id="your-turn" className="mx-auto max-w-2xl scroll-mt-20 px-6 py-14 sm:px-10">
        <EyebrowLabel>Your Turn</EyebrowLabel>
        <h2 className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Tell Me Where <em className="text-brand-gold not-italic">I Have This Wrong</em>
        </h2>
        <p className="mb-10 text-foreground/70">
          This is an open notebook, not a survey. Answer one question or all six. Tell me what
          you are trying to solve, what you wish existed, or where this whole thing gets too
          precious. Honest answers are useful, especially the inconvenient ones.
        </p>
        <BlueprintForm />
      </div>

      <div className="bg-secondary px-6 py-16 text-center sm:px-10 dark:bg-[#0A0A10]">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          The Next Step
        </p>
        <h2 className="mx-auto mb-4 max-w-lg font-heading text-2xl font-normal text-foreground sm:text-3xl">
          Bring Your People Into the Room.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-foreground/70">
          Invite the people you care about. There may be a conversation, a collaborator, or an
          unexpected connection worth making. At minimum, it is better to build with people you
          trust than to shout into the void alone.
        </p>
        <Link
          href="/community"
          className="mb-5 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Enter the Community <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
        <div className="mb-3">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-gold/40 px-6 py-2.5 font-mono text-xs tracking-wide text-brand-gold uppercase"
          >
            Or Take the Assessment First <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
        <div>
          <Link
            href="/humanos"
            className="inline-flex items-center gap-1.5 rounded-md border border-red-800/30 px-6 py-2.5 font-mono text-xs tracking-wide text-red-800 uppercase"
          >
            Explore Human OS V2.0 <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/community" className="inline-flex items-center gap-1.5 font-mono text-sm tracking-wide text-brand-gold min-h-11 md:min-h-6">
          Continue to The Community <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
