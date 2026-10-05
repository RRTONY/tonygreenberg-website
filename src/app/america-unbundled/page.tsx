import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkle } from "lucide-react";
import { ShareRail } from "@/components/america-unbundled/share-rail";

// "AI Does Not Have a Candidate" (Part One of Tony's two-part America,
// Unbundled series; Part Two is /america-unbundled-field-guide). Live-only: it
// was added to the live site after the `_legacy-manus-app/` snapshot, so it
// was ported 2026-10-01 straight from https://tonygreenberg.com/america-unbundled
// (copy, links, metadata and JSON-LD verbatim). On live it's a standalone page
// with its own masthead/footer; here it sits inside the normal site chrome,
// with the series masthead, Part One/Part Two map and footer line kept in-page
// and styled to match Part Two. The hero image was on the Manus image proxy
// host and is rescued into Sanity (`age-of-ai-no-party`, shared with Part Two).
// Live's "keep the last words together" non-breaking spaces are replaced by
// `text-balance`/`text-pretty`. Part Two links to `#sources` here.

const PAGE_URL = "https://tonygreenberg.com/america-unbundled";
const HERO_IMG =
  "https://cdn.sanity.io/images/a3q1cyqs/production/1f524a6b2fbe9f105982d4997d4df1f6a18d937b-1200x800.webp";
const TITLE = "AI Does Not Have a Candidate: Politics for the AI Age";
const DESCRIPTION =
  "Why America needs an independent civic grid to govern AI, energy, and political power, with constitutional accountability and local proof.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "AI governance",
    "independent AI governance",
    "decentralized governance",
    "Wulf Kaal",
    "Menagerie.is",
    "DAO governance",
    "AI political accountability",
    "civic infrastructure",
  ],
  alternates: { canonical: "/america-unbundled" },
  openGraph: {
    type: "article",
    siteName: "Tony Greenberg",
    title: TITLE,
    description: DESCRIPTION,
    url: "/america-unbundled",
    images: [
      {
        url: HERO_IMG,
        width: 1200,
        height: 800,
        alt: "A person standing between an obsolete records room and a bright public gathering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [HERO_IMG],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  url: PAGE_URL,
  description: DESCRIPTION,
  image: HERO_IMG,
  datePublished: "2026-09-21",
  dateModified: "2026-09-22",
  author: {
    "@type": "Person",
    name: "Tony Greenberg",
    jobTitle: "Investor, Impact Futurist, Data-Center Provocateur, Founder and CEO",
    affiliation: [
      { "@type": "Organization", name: "RampRate", url: "https://ramprate.com/" },
      { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is/" },
    ],
  },
  about: ["AI politics", "AI governance", "Independent political movement", "Energy policy", "Civic accountability"],
  mentions: [
    { "@type": "Person", name: "Wulf A. Kaal" },
    { "@type": "Organization", name: "Menagerie.is" },
    { "@type": "Organization", name: "DevXDAO" },
  ],
  isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: "https://tonygreenberg.com/" },
};

const GALLUP_URL = "https://news.gallup.com/poll/700499/new-high-identify-political-independents.aspx";
const DOE_URL =
  "https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers";
const EIA_URL = "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_03";
const ARCHIVES_URL = "https://www.archives.gov/founding-docs/bill-of-rights-transcript";
const NIST_URL = "https://www.nist.gov/itl/ai-risk-management-framework";
const ARXIV_URL = "https://arxiv.org/abs/2504.09865";
const HAGENS_URL = "https://www.thegreatsimplification.com/";

const EVIDENCE = [
  { href: GALLUP_URL, index: "01 · Fact", title: "45% identify independent", body: "Gallup, 2025." },
  { href: DOE_URL, index: "02 · Fact", title: "AI consumes physical power", body: "Data-center demand is rising." },
  { href: ARCHIVES_URL, index: "03 · Law", title: "Speech needs a public forum", body: "Rights remain the floor." },
  { href: NIST_URL, index: "04 · Standard", title: "Trust needs practice", body: "NIST supplies a baseline." },
];

const LADDER = [
  {
    step: "Build now",
    body: "Association, journalism, civic technology, candidate recruitment, accountability tools, and advisory citizens’ assemblies already fit inside First Amendment freedoms.",
  },
  {
    step: "State-law path",
    body: "Primaries, ballot access, ranked-choice voting, and presidential-elector rules largely move through state law, sometimes by ballot initiative.",
  },
  {
    step: "Federal-law path",
    body: "Congress can regulate congressional elections, spending, disclosure, procurement, and national AI accountability within its constitutional powers.",
  },
  {
    step: "Amendment path",
    body: "Replacing elected legislators with sortition or bypassing the Electoral College would require constitutional change. Advisory sortition can begin now.",
  },
];

const TRUST = [
  { title: "Show the change.", body: "Publish a readable change log." },
  { title: "Name the power.", body: "Map who decides and who benefits." },
  { title: "Protect the participant.", body: "Make challenge and exit visible." },
  { title: "Earn the scale.", body: "Test locally before expanding." },
];

const INSTRUMENTS = [
  {
    index: "01 · Publication",
    title: "Menu prices",
    body: "Publish every dollar, donor, and meeting in a machine-readable format within seventy-two hours.",
  },
  {
    index: "02 · Allocation",
    title: "The vote that funds",
    body: "Let a vote carry a defined allocation toward a public project, then measure the result.",
  },
  {
    index: "03 · Trust",
    title: "Reputation staking",
    body: "Build citizen-held reputation with real accountability, while naming the surveillance and coercion risks.",
  },
  {
    index: "04 · Receipts",
    title: "Certification with clawback",
    body: "A certification without revocation is a bumper sticker. Build the revocation first.",
  },
  {
    index: "05 · Proof",
    title: "Local first",
    body: "Win a school board, fix a water district, or site a data center with a real community benefit.",
  },
];

const GLOSSARY = [
  { term: "AI constituency", def: "Everyone absorbing AI’s benefits, costs, and risks." },
  { term: "America House", def: "A Virginia civic creator headquarters distinct from INC." },
  { term: "Civic infrastructure", def: "Rules, tools, and relationships that make power accountable." },
  { term: "Compression algorithm", def: "Parties reducing millions of beliefs to two bundles." },
  { term: "INC", def: "The 2026 Independent National Convention in Washington." },
  { term: "Polycentric governance", def: "Overlapping centers of authority that can correct one another." },
  { term: "Ranked-choice voting", def: "Voters rank candidates; votes transfer during elimination." },
  { term: "Sortition", def: "Random selection of a deliberative public." },
];

const SOURCES = [
  { href: GALLUP_URL, name: "Gallup", note: "Party identification." },
  { href: DOE_URL, name: "DOE + Lawrence Berkeley", note: "Data-center energy." },
  { href: EIA_URL, name: "U.S. Energy Information Administration", note: "Retail electricity prices." },
  { href: ARCHIVES_URL, name: "National Archives", note: "First Amendment." },
  { href: "https://constitution.congress.gov/browse/article-1/section-4/", name: "Constitution Annotated", note: "Elections Clause." },
  { href: "https://constitution.congress.gov/browse/article-2/section-1/", name: "Constitution Annotated", note: "Presidential electors." },
  { href: NIST_URL, name: "NIST", note: "AI Risk Management Framework." },
  { href: ARXIV_URL, name: "Gallegos et al.", note: "AI-generated messages and political persuasion." },
  {
    href: "https://ostromworkshop.indiana.edu/courses-teaching/teaching-tools/polycentric-goverance/key-examples.html",
    name: "Ostrom Workshop",
    note: "Polycentric governance.",
  },
  { href: HAGENS_URL, name: "Nate Hagens", note: "Energy, economics, and lower-throughput futures." },
  {
    href: "https://ivn.us/independent-national-convention-2026-americas-independent-movement-is-entering-the-same-room/",
    name: "Christopher Life",
    note: "INC 2026 context.",
  },
];

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="text-[#5b3ca8] underline underline-offset-2 hover:text-[#4b2a8d] dark:text-[#b3a1ec] dark:hover:text-[#cfc2f5]"
    >
      {children}
    </a>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold tracking-[0.18em] text-brand-gold uppercase">{children}</div>;
}

/** The small "KIND · note" line that opens each passage on live. */
function PassageMeta({ kind, note }: { kind: string; note: string }) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 font-sans">
      <span className="border-b-2 border-[#5b3ca8] pb-0.5 text-[11px] font-bold tracking-[0.12em] text-foreground uppercase dark:border-[#b3a1ec]">
        {kind}
      </span>
      <span className="text-[11px] font-bold tracking-[0.12em] text-brand-gold uppercase">{note}</span>
    </div>
  );
}

function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      className="mt-4 scroll-mt-24 font-serif text-3xl leading-tight font-normal text-balance text-foreground sm:text-4xl"
    >
      {children}
    </h3>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-8! border-y-2 border-t-foreground border-b-border py-5 font-sans text-2xl leading-tight font-extrabold tracking-tight text-balance text-foreground uppercase sm:text-3xl">
      {children}
    </p>
  );
}

function Proposal({ children }: { children: React.ReactNode }) {
  return (
    <p>
      <strong className="text-foreground">Proposal:</strong> {children}
    </p>
  );
}

export default function AmericaUnbundledPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6">
        {/* Series masthead */}
        <nav
          aria-label="America, Unbundled series"
          className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-foreground pb-4 text-xs font-bold tracking-[0.12em] uppercase"
        >
          <div className="flex items-center gap-1.5">
            Tony Greenberg <Sparkle aria-hidden="true" className="size-3 fill-current text-brand-gold" /> America, Unbundled
          </div>
          <Link
            href="/america-unbundled-field-guide"
            className="inline-flex items-center gap-1.5 text-[#5b3ca8] hover:underline dark:text-[#b3a1ec]"
          >
            02 · Continue to the field guide <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </nav>

        <nav
          aria-label="America, Unbundled two-part series"
          className="mt-4 grid border-2 border-foreground sm:grid-cols-2"
        >
          <span aria-current="page" className="block bg-[#5b3ca8] px-4 py-3 text-white">
            <small className="block text-xs font-bold tracking-[0.12em] uppercase">Part One · You are here</small>
            <strong className="mt-1 block font-serif text-xl font-normal">AI Does Not Have a Candidate</strong>
          </span>
          <Link
            href="/america-unbundled-field-guide"
            className="block px-4 py-3 transition-colors hover:bg-muted"
          >
            <small className="block text-xs font-bold tracking-[0.12em] text-[#5b3ca8] uppercase dark:text-[#b3a1ec]">
              Part Two · Companion field guide
            </small>
            <strong className="mt-1 block font-serif text-xl font-normal">America, Unbundled: The Field Guide</strong>
          </Link>
        </nav>

        {/* Hero */}
        <header className="mt-14 sm:mt-20">
          <div className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">
            Part One of Two · The Opening Argument
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] font-normal tracking-tight sm:text-7xl lg:text-8xl">
            <span>AI Does Not</span>
            <br />
            <em className="text-[#5b3ca8] not-italic dark:text-[#b3a1ec]">Have a Candidate.</em>
          </h1>
          <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-pretty text-foreground/80 sm:text-3xl">
            Why America needs an independent civic grid to govern AI, energy, and power.
          </p>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
            A question carried into the Independent National Convention · September 23 to 25, 2026
          </p>
        </header>

        <figure className="relative mt-8 aspect-3/2 overflow-hidden bg-muted">
          <Image
            src={HERO_IMG}
            alt="A person stands between an obsolete records room and a bright public gathering."
            fill
            fetchPriority="high"
            loading="eager"
            sizes="(min-width: 1152px) 1104px, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          <figcaption className="absolute right-4 bottom-4 max-w-48 text-right text-xs font-bold tracking-widest text-white/85 uppercase">
            The machine was built for scarcity
          </figcaption>
        </figure>

        <ShareRail />

        {/* TL;DR */}
        <aside
          aria-label="Thirty-second summary"
          className="mt-8 grid gap-4 border-y-2 border-t-foreground border-b-border py-6 md:grid-cols-[13rem_1fr_auto] md:items-center md:gap-8"
        >
          <div>
            <Label>TL;DR · 30 seconds</Label>
            <h2 className="mt-2 font-serif text-4xl leading-none font-normal tracking-tight uppercase">
              AI is the warning.
            </h2>
          </div>
          <p className="max-w-2xl text-pretty text-foreground/85">
            America is pushing AI-age power through two political sockets built for another century. We need a civic
            grid with constitutional rights beneath it, local proof, public receipts, and the power to revoke authority
            when it fails.
          </p>
          <a
            href="#argument"
            className="inline-flex min-h-11 items-center gap-1.5 self-start border-b border-foreground text-xs font-bold tracking-[0.08em] uppercase hover:text-[#5b3ca8] md:self-end dark:hover:text-[#b3a1ec]"
          >
            Stay with the question <ArrowDown aria-hidden="true" className="size-3.5" />
          </a>
        </aside>

        {/* The argument */}
        <section
          id="argument"
          className="mt-12 grid scroll-mt-24 gap-4 border-t-2 border-foreground pt-4 md:grid-cols-[13rem_1fr] md:gap-12"
        >
          <Label>The argument</Label>
          <article className="max-w-2xl font-serif text-lg leading-relaxed text-pretty text-foreground/85 [&>p]:mt-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans">
              <span className="border-b-2 border-[#5b3ca8] pb-0.5 text-[11px] font-bold tracking-[0.12em] text-foreground uppercase dark:border-[#b3a1ec]">
                The proposition
              </span>
              <span className="text-[11px] font-bold tracking-[0.12em] text-brand-gold uppercase">
                What is different, in plain English.
              </span>
            </div>
            <p className="text-xl text-foreground">AI has no candidate, yet it is already changing how candidates win.</p>
            <p>
              Politics was vulnerable to algorithmic influence before generative AI arrived. Now persuasion can be
              produced, personalized, and tested at industrial scale.{" "}
              <ExternalLink href={ARXIV_URL}>Recent experimental research</ExternalLink> found AI-generated policy
              messages persuasive even when readers were told who made them. Neither major party, and very few
              independent movements, are prepared to govern machinery they will increasingly use to gain power.
            </p>
            <p>
              The two parties still force millions of beliefs through two old sockets. I want a civic grid where people
              can form coalitions around specific problems without buying an entire party platform. Decisions, money,
              authority, and results stay visible. Start locally, inside the Constitution, long before anyone wins the
              presidency.
            </p>
            <p>
              I keep coming back to this: what kind of independent movement are we building? Another vehicle for
              capturing power, or a civic grid built to expose it, distribute it, and take it back when it fails?
            </p>
            <p>
              AI already shapes work, energy, speech, and government. Its constituency includes everyone who will pay
              for its power, live with its decisions, or defend the rights it can amplify and erase.
            </p>

            <PassageMeta kind="Objections" note="State the hard case before answering it." />
            <H3>The objections are real</H3>
            <p>
              “Independent” can describe a reasonable person without producing a coalition capable of governing.
              Exclude too little and bad actors capture the room. Exclude too much and the movement loses its mandate.
              Without ranked-choice voting, an independent candidacy can become a spoiler. These are not cynical
              objections. They are the design brief.
            </p>

            <div aria-label="Evidence spine" className="mt-8 border-b border-border pb-6 font-sans">
              <Label>Evidence / four anchors</Label>
              <div className="mt-4 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {EVIDENCE.map((e) => (
                  <a key={e.index} href={e.href} target="_blank" rel="noopener" className="group block">
                    <span className="block text-[11px] font-bold tracking-[0.12em] text-brand-gold uppercase">
                      {e.index}
                    </span>
                    <strong className="mt-3 block text-sm leading-snug font-bold text-[#5b3ca8] group-hover:underline dark:text-[#b3a1ec]">
                      {e.title}
                    </strong>
                    <span className="mt-1 block font-serif text-base text-foreground/80">{e.body}</span>
                  </a>
                ))}
              </div>
            </div>

            <p>
              Christopher Life’s convention is attempting something independents usually fail to pull off: putting
              relationships, standards, leadership, and coordination in the same room. I want that room to answer a
              harder question: who will hold AI’s political power accountable?
            </p>
            <Proposal>
              build candidates, coalitions, and civic mechanisms that represent the people absorbing AI’s
              consequences.
            </Proposal>
            <Pull>AI does not need a candidate. It already has a super PAC called inevitability.</Pull>
            <p>
              Nearly half the country uses the independent label. A label cannot organize power. That gap is the work.
              Trust has withdrawn and sits in a mattress while politics tries to convince the mattress it is a bank.
            </p>
            <Pull>Can we organize power without organizing away the person?</Pull>

            <H3>Power without erasure</H3>
            <p>
              Elinor Ostrom’s work asks whether people can make durable rules without one center owning the system.
              Independence must preserve local knowledge, visible monitoring, revisable rules, and fair conflict
              resolution.
            </p>
            <Pull>The goal is power that can hold disagreement without demanding surrender.</Pull>

            <PassageMeta kind="Tony / Thesis" note="The physical cost of intelligence." />
            <H3>AI has a power cord.</H3>
            <p>
              AI arrives in counties as data centers, substations, water demand, electricity bills, jobs, and arguments
              over who pays. <ExternalLink href={EIA_URL}>EIA data</ExternalLink> show average residential electricity
              prices rising nearly 32% in nominal terms from 2020 to 2025. That does not establish permanent scarcity,
              but it does expose the collision between cheap intelligence and dearer electricity.
            </p>
            <p>
              My long-running thesis is that abundance means getting more health, time, agency, and belonging from each
              kilowatt-hour and each ton we extract. <ExternalLink href={HAGENS_URL}>Nate Hagens</ExternalLink> makes
              the related point that GDP measures priced activity rather than contentment. AI governance therefore
              belongs at the same table as energy, water, land use, and local consent.
            </p>
            <Pull>
              Lowering the cost of useful power creates abundance. Lowering consumption without lowering the cost of
              living creates austerity.
            </Pull>
            <Proposal>
              design data centers, grids, water, compute, and civic power together. Every project should say plainly
              who pays, who benefits, who measures, and who can say no.
            </Proposal>

            <H3>Every coalition gets a door policy</H3>
            <p>
              There is no centrist majority waiting behind the independent label. Independents hold incompatible
              convictions. The moment a movement can deliver a vote, a seat, or a committee assignment, it must decide
              who speaks, who benefits, and who can challenge the decision. Those boundaries belong in daylight. They
              reveal which independent movement is actually being built.
            </p>

            <PassageMeta kind="Interpretation" note="The compression metaphor." />
            <H3>One reason the parties no longer fit</H3>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-y border-border py-5">
              <div>
                <small className="block font-sans text-[11px] font-bold tracking-[0.12em] text-brand-gold uppercase">
                  1789
                </small>
                <strong className="mt-2 block leading-snug font-normal text-foreground">
                  <span className="block">Information was expensive.</span>
                  <span className="block">Compress the country.</span>
                </strong>
              </div>
              <ArrowRight aria-hidden="true" className="size-6 text-[#5b3ca8] dark:text-[#b3a1ec]" />
              <div>
                <small className="block font-sans text-[11px] font-bold tracking-[0.12em] text-brand-gold uppercase">
                  2026
                </small>
                <strong className="mt-2 block leading-snug font-normal text-foreground">
                  <span className="block">Information is abundant.</span>
                  <span className="block">Resolve the country.</span>
                </strong>
              </div>
            </div>
            <p>
              A political party is a compression algorithm built when information was expensive. Information is now
              cheap to synthesize; trust, attention, and local knowledge are not. Yet you are still forced to buy a
              bundle containing four positions you hold and eleven you find repugnant, then told that discomfort is a
              character flaw.
            </p>
            <Pull>Compute is the new district. Nobody represents it. The phrase is literal: it is a siting map.</Pull>
            <p>
              DOE says data centers used 4.4% of U.S. electricity in 2023 and could reach 6.7–12% by 2028. Those
              facilities land in specific counties. The people absorbing their costs deserve a vote and a public record.
            </p>

            <PassageMeta kind="Law + Inference" note="Rights are the floor." />
            <H3>What a candidate must defend</H3>
            <p>
              A candidate for an AI-shaped future cannot be only a vote-getter. The First Amendment protects speech,
              press, peaceful assembly, and petition. A new civic system has to make those rights more usable in
              practice, not merely more legible in a manifesto.
            </p>

            <PassageMeta kind="Constitutional path" note="From provocation to lawful power." />
            <H3>The real power lies in grounding.</H3>
            <p>
              A grid without grounding can kill. So can a political movement. Grounding means constitutional rights,
              lawful authority, local proof, public records, and the power to remove the people in charge. The
              Constitution recognizes no party or movement. It recognizes offices, elections, rights, powers, states,
              and citizens. That is not the obstacle. It is where this becomes real.
            </p>
            <div aria-label="Constitutional implementation ladder" className="mt-6 border-t-2 border-foreground">
              {LADDER.map((l) => (
                <div
                  key={l.step}
                  className="grid gap-2 border-b border-border py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <b className="font-sans text-[11px] font-bold tracking-[0.12em] text-foreground uppercase">{l.step}</b>
                  <span className="text-base leading-relaxed">{l.body}</span>
                </div>
              ))}
            </div>
            <Pull>
              Revolutionary language is cheap. Constitutional sequencing is how an idea survives contact with power.
            </Pull>

            <aside id="trust-mechanisms" aria-label="Public trust mechanisms" className="mt-12">
              <div className="inline-block border-b-2 border-[#5b3ca8] pb-0.5 font-sans text-[11px] font-bold tracking-[0.12em] text-foreground uppercase dark:border-[#b3a1ec]">
                Proposal / Trust mechanisms
              </div>
              <h4 className="mt-4 font-serif text-3xl leading-tight font-normal text-balance text-foreground">
                Trust is not the mood. It is the mechanism.
              </h4>
              <p className="mt-3">
                Dr. Wulf A. Kaal helped turn the lesson practical: decentralization alone creates no legitimacy.
                Authority has to stay visible, contestable, and correctable. Before you ask for labor, money, reputation,
                or a vote, make power legible.{" "}
                <ExternalLink href="https://wulfkaal.com/publications/">
                  <strong>
                    Read Wulf Kaal’s published work{" "}
                    <ArrowRight aria-hidden="true" className="inline size-4 align-text-bottom" />
                  </strong>
                </ExternalLink>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-4 font-sans lg:grid-cols-4">
                {TRUST.map((t) => (
                  <div key={t.title}>
                    <b className="block text-sm text-foreground">{t.title}</b>
                    <span className="mt-1 block text-xs text-muted-foreground">{t.body}</span>
                  </div>
                ))}
              </div>
            </aside>

            <PassageMeta kind="Proposal" note="Mechanisms to test in public." />
            <H3>Five instruments worth building</H3>
            <div className="mt-6 border-t border-border">
              {INSTRUMENTS.map((i) => (
                <div
                  key={i.index}
                  className="grid gap-2 border-b border-border py-4 sm:grid-cols-[9rem_11rem_1fr] sm:gap-4"
                >
                  <small className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#5b3ca8] dark:text-[#b3a1ec]">
                    {i.index}
                  </small>
                  <h3 className="font-serif text-xl leading-tight font-normal text-foreground uppercase">{i.title}</h3>
                  <p className="text-base leading-relaxed">{i.body}</p>
                </div>
              ))}
            </div>
            <p>
              These are proposals, not proven mechanisms. NIST’s voluntary AI Risk Management Framework offers a useful
              baseline: govern, map, measure, and manage risk. The independent movement needs its own political
              equivalent, with named owners and consequences when promises fail.
            </p>
            <p>
              Put the anti-corruption index in this layer, alongside ranked-choice-voting and National Popular Vote
              Compact advocates. An independent movement worth taking seriously should work tactically with either major
              party when the alliance produces a measurable reform. Breaking a duopoly does not require refusing every
              useful transaction with the people currently inside it.
            </p>
            <p>
              Over yonder, another experiment is taking shape.{" "}
              <ExternalLink href="https://america.co/house">America House</ExternalLink> is a{" "}
              <strong className="text-foreground">creator house for civic power</strong>: a permanent place near
              Washington where creators, builders, organizers, technologists, and public servants live, argue, film, and
              turn attention into working groups. Jack Jay, a brilliant creative strategist, and his partner Sydney
              Thackray are testing whether putting people under one roof can do useful work for democratic life.
            </p>
            <p>
              Their larger system separates the jobs. <ExternalLink href="https://america.co/">America.co</ExternalLink>{" "}
              connects media, civic technology, people, and events. America House supplies physical collaboration.{" "}
              <ExternalLink href="https://www.election.org/">Election.org</ExternalLink> makes races, candidates,
              officials, campaign finance, and sources searchable.{" "}
              <ExternalLink href="https://www.impactline.org/">Impactline</ExternalLink> follows public spending;{" "}
              <ExternalLink href="https://www.voteimpact.org/">VoteImpact</ExternalLink> follows legislation. The
              projects are not equally mature, but the plan is serious.
            </p>
            <p>
              America House has just wrapped its{" "}
              <ExternalLink href="https://summit.america.co/">Creator Summit</ExternalLink> and is holding the most
              consequential after-party of INC. The convention assembles political capacity. America House brings
              culture, production, and a place to keep talking after the badges come off. Put those together and ideas
              can find storytellers, attention can land somewhere, and a temporary gathering can leave something behind.
              It takes a family to make a public.
            </p>
            <Proposal>
              each public mechanism should ship with a change log, decision-owner map, beneficiary map, measurement
              plan, and revocation path. Without them, the movement has a story, not infrastructure.
            </Proposal>

            <PassageMeta kind="Pragmatic realism" note="Design for the world that exists." />
            <H3>Build for cynics, not only good faith</H3>
            <p>
              Make circumvention more costly than compliance. Use AI to audit claims, map interests, surface conflicts,
              and translate public records. Take tactical alliances when they produce measurable reform. Win locally
              first, then document the result so it is difficult to reverse. Otherwise the movement risks becoming a
              sincere group chat with excellent values and no receipts.
            </p>

            <PassageMeta kind="Fact + Inference" note="There is no single founder." />
            <H3>Who is building the civic body?</H3>
            <p>
              INC is a field, not a finished party: some coordinate, some build a party, some change election rules, and
              others organize voters. Calling it one thing would flatten the work before it earns a common name.
            </p>
            <Pull>Independence may be the door. It should not be the whole house.</Pull>
            <p>INC puts competing theories of independence in the same room.</p>
            <Pull>
              The convention is where independence stops being a slogan and starts becoming a design problem.
            </Pull>

            <PassageMeta kind="The Tony Greenberg Test" note="Ten questions. One uncomfortable score." />
            <H3>How independent are you, really?</H3>
            <p>
              <Link
                href="/america-unbundled-field-guide#questions"
                className="text-[#5b3ca8] underline underline-offset-2 hover:text-[#4b2a8d] dark:text-[#b3a1ec] dark:hover:text-[#cfc2f5]"
              >
                <strong>
                  Continue to the ten independence questions{" "}
                  <ArrowRight aria-hidden="true" className="inline size-4 align-text-bottom" />
                </strong>
              </Link>
            </p>

            <PassageMeta kind="The point" note="Why this can work." />
            <H3>AI is taking power without asking for your vote.</H3>
            <p>
              A civic grid lets people organize around the decision in front of them, see who holds power, and take that
              power back when it fails. That is different from another party selling a larger bundle of promises.
            </p>
            <p>
              This can succeed because it does not need to capture Washington to prove anything. Start with one town,
              one election, one public decision, and one result nobody can hide. Then earn the next piece.
            </p>
            <p>
              This grid is already showing up in your job, electric bill, information, and government. What remains open
              is whether citizens will help govern it or merely be charged by it. The real power lies in grounding.
            </p>

            {/* About the author */}
            <aside
              aria-label="About Tony Greenberg, RampRate, and ImpactSoul"
              className="mt-12 border-y-2 border-t-foreground border-b-border py-6"
            >
              <Label>The work behind the argument</Label>
              <h4 className="mt-3 font-serif text-3xl leading-tight font-normal text-balance text-foreground">
                Ideas matter when they survive implementation.
              </h4>
              <p className="mt-3">
                Tony “WhyNot” Greenberg is an investor, entrepreneur, impact futurist, longtime provocateur inside the
                data-center business, and founder and CEO of{" "}
                <ExternalLink href="https://ramprate.com/">
                  <strong>RampRate</strong>
                </ExternalLink>
                . For more than 25 years, he has worked where technology, infrastructure, capital, and human systems
                collide, which is usually where the invoices become interesting.
              </p>
              <p className="mt-5">
                RampRate is the B Corp holding company and consulting engine behind that work. Its practices span AI and
                data-center infrastructure, strategic sourcing, governance, and{" "}
                <ExternalLink href="https://ramprate.com/torque">
                  <strong>Torque</strong>
                </ExternalLink>
                , which helps leaders resolve critical issues before they become existential ones. Its deepest asset is
                25 years of compounded trust across enterprise, technology, capital, and impact: relationships that
                become access, leverage, and revenue when a difficult problem needs more than advice. Its documented{" "}
                <ExternalLink href="https://ramprate.com/proof">
                  <strong>client history</strong>
                </ExternalLink>{" "}
                includes Microsoft, eBay, Sony, and Nike.
              </p>
              <p className="mt-5">
                Tony also co-founded{" "}
                <ExternalLink href="https://impactsoul.is/">
                  <strong>ImpactSoul</strong>
                </ExternalLink>
                , a regenerative investment and operating system that directs capital, technology, and culture toward
                restoration rather than extraction. He has been arguing with the future since sharing a stage with Ray
                Kurzweil in 2010. His favorite operating question remains: Why not?
              </p>
              <p className="mt-5 tracking-[0.06em] text-foreground/80 uppercase">
                The political views are his. The receipts are linked. The trouble is intentional.
              </p>
            </aside>

            <H3>Appendix / terms</H3>
            <dl
              aria-label="Appendix of terms"
              className="mt-4 grid gap-x-6 gap-y-3 border-t border-border pt-4 sm:grid-cols-[12rem_1fr]"
            >
              {GLOSSARY.map((g) => (
                <div key={g.term} className="contents">
                  <dt className="font-sans text-[11px] font-bold tracking-[0.12em] text-foreground uppercase sm:pt-1.5">
                    {g.term}
                  </dt>
                  <dd className="mb-2 text-base sm:mb-0">{g.def}</dd>
                </div>
              ))}
            </dl>

            <H3 id="sources">Appendix / bibliography + receipts</H3>
            <p>Sources for central claims.</p>
            <div
              aria-label="Bibliography and evidence appendix"
              className="mt-4 grid border-t border-border font-sans sm:grid-cols-2"
            >
              {SOURCES.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="group block min-h-11 border-b border-border py-3 sm:pr-4"
                >
                  <strong className="block text-sm text-[#5b3ca8] group-hover:underline dark:text-[#b3a1ec]">
                    {s.name}
                  </strong>
                  <span className="block text-xs text-muted-foreground">{s.note}</span>
                </a>
              ))}
            </div>

            <aside
              aria-label="Authorship and AI use declaration"
              className="mt-12 border-y-2 border-t-foreground border-b-border py-6"
            >
              <Label>Authors + AI / A transparent note</Label>
              <h4 className="mt-3 font-serif text-3xl leading-tight font-normal text-balance text-foreground">
                I thought first. The machine typed second.
              </h4>
              <p className="mt-3">
                <strong className="text-foreground">
                  I am Tony Greenberg. I wrote this with AI. Every opinion in it is regrettably my own.
                </strong>
              </p>
              <p className="mt-5">
                AI helped organize, tighten, and test the structure. The ideas, judgments, voice, and final
                responsibility are mine. The machine can arrange the constellation. It does not get to claim the stars.
              </p>
              <p className="mt-5 text-base text-muted-foreground">
                <strong className="text-foreground">Disclosure:</strong> Wulf Kaal, Christopher Life, Jack Jay, and
                Sydney Thackray are friends and colleagues. Their work is interpreted here, not quoted or endorsed unless
                explicitly stated.
              </p>
            </aside>
          </article>
        </section>

        {/* Series footer line */}
        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-5 text-xs tracking-widest text-muted-foreground uppercase sm:flex-row sm:justify-between">
          <span>Part One · AI Does Not Have a Candidate</span>
          <Link
            href="/america-unbundled-field-guide"
            className="inline-flex min-h-11 items-center gap-1.5 underline underline-offset-2 hover:text-foreground sm:min-h-0"
          >
            Continue to Part Two: America, Unbundled <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
