import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bird, Sparkle } from "lucide-react";
import { FieldGuideResponses } from "@/components/america-unbundled/field-guide-responses";

// "America, Unbundled: The Field Guide" (Part Two of Tony's two-part
// America, Unbundled series). Live-only: it was added to the live site after
// the `_legacy-manus-app/` snapshot, so it was ported 2026-10-01 straight
// from https://tonygreenberg.com/america-unbundled-field-guide (copy, links,
// metadata and JSON-LD verbatim). On live it's a standalone page with its own
// masthead/footer; here it sits inside the normal site chrome, with the
// series masthead, Part One/Part Two map and footer line kept in-page.
//
// Part One lives at /america-unbundled (src/app/america-unbundled). The hero image was on the Manus
// `/api/img/` host and is rescued into Sanity (docs/ai/manus-media-rescue.md).
// The "keep the last three words together" script live runs on headings is
// replaced by `text-balance`/`text-pretty`.

const PAGE_URL = "https://tonygreenberg.com/america-unbundled-field-guide";
const HERO_IMG =
  "https://cdn.sanity.io/images/a3q1cyqs/production/1f524a6b2fbe9f105982d4997d4df1f6a18d937b-1200x800.webp";
const INC_URL = "https://independentnationalconvention.com/";

export const metadata: Metadata = {
  title: { absolute: "America, Unbundled | Independent Political Infrastructure & INC 2026" },
  description:
    "America, Unbundled is Tony Greenberg’s field guide to independent political infrastructure, decentralized governance, civic accountability, and the Independent National Convention 2026.",
  alternates: { canonical: "/america-unbundled-field-guide" },
  openGraph: {
    type: "article",
    siteName: "Tony Greenberg",
    title: "America, Unbundled | Independent Political Infrastructure",
    description:
      "A field guide to independent governance, civic accountability, decentralized decision-making, and the Independent National Convention 2026.",
    url: "/america-unbundled-field-guide",
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
  headline: "America, Unbundled",
  url: PAGE_URL,
  description:
    "A field guide to independent political infrastructure, decentralized governance, civic accountability, and the Independent National Convention 2026.",
  image: HERO_IMG,
  datePublished: "2026-09-22",
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
  about: [
    "Independent political movement",
    "Decentralized governance",
    "Civic infrastructure",
    "Independent National Convention",
  ],
  isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: "https://tonygreenberg.com/" },
};

const ACTIONS = [
  {
    href: INC_URL,
    external: true,
    kicker: "01 · Washington",
    title: "Attend the convention",
    body: "See the program and register for September 23–25.",
  },
  {
    href: INC_URL,
    external: true,
    kicker: "02 · Wherever you are",
    title: "Host a watch party",
    body: "Bring the independent conversation into a room of your own.",
  },
  {
    href: "#questions",
    external: false,
    kicker: "03 · Start now",
    title: "Make a 90-day commitment",
    body: "Answer the questions, save your responses, and choose one action.",
  },
];

const ARC = [
  { index: "01 · Inherit", title: "You arrive with a name.", body: "Country. Family. History. A promise written before you could question it." },
  { index: "02 · Wake", title: "You catch the script.", body: "The label was meant to help you locate yourself. Then it began locating you." },
  { index: "03 · Choose", title: "Keep your mind.", body: "A party can borrow your vote. It does not own your conscience." },
  { index: "04 · Act", title: "Enter the work.", body: "A private judgment becomes public when people act on it together." },
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

export default function AmericaUnbundledFieldGuidePage() {
  return (
    // Live sets this page in an "Iowan Old Style" stack (titles 500,
    // measured 2026-10-07), so font-serif is remapped for the whole page.
    <div className="bg-background text-foreground [--font-serif:'Iowan_Old_Style',Baskerville,Georgia,serif]">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6">
        {/* Series masthead */}
        <nav
          aria-label="America, Unbundled series"
          className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-foreground pb-4 text-xs font-bold tracking-[0.12em] uppercase"
        >
          <div className="flex items-center gap-1.5">
            Tony Greenberg <Sparkle aria-hidden="true" className="size-3 fill-current text-brand-gold" /> America, Unbundled
          </div>
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1">
            <Link href="/america-unbundled" className="hover:text-[#5b3ca8] dark:hover:text-[#b3a1ec]">
              01 · Opening essay
            </Link>
            <span aria-current="page" className="text-[#5b3ca8] dark:text-[#b3a1ec]">
              02 · Field guide
            </span>
          </div>
        </nav>

        <nav
          aria-label="America, Unbundled two-part series"
          className="mt-4 grid border-2 border-foreground sm:grid-cols-2"
        >
          <Link href="/america-unbundled" className="block px-4 py-3 transition-colors hover:bg-muted">
            <small className="block text-xs font-bold tracking-[0.12em] text-[#5b3ca8] uppercase dark:text-[#b3a1ec]">
              Part One · Opening argument
            </small>
            <strong className="mt-1 block font-serif text-xl font-normal">AI Does Not Have a Candidate</strong>
          </Link>
          <span aria-current="page" className="block bg-[#5b3ca8] px-4 py-3 text-white">
            <small className="block text-xs font-bold tracking-[0.12em] uppercase">Part Two · You are here</small>
            <strong className="mt-1 block font-serif text-xl font-normal">America, Unbundled: The Field Guide</strong>
          </span>
        </nav>

        {/* Hero */}
        <header className="mt-14 sm:mt-20">
          <div className="font-[Arial,sans-serif] text-xs font-semibold tracking-[0.25em] text-[#80520F] uppercase dark:text-brand-gold">
            Part Two of Two · The Field Guide
          </div>
          <h1 className="mt-4 font-serif text-[9vw] leading-[0.86] font-medium tracking-[-0.06em] sm:text-[clamp(3.7rem,7.4vw,6.8rem)]">
            <span>
              America Is <em className="text-[#5b3ca8] not-italic dark:text-[#b3a1ec]">Unbundled.</em>
            </span>
            <br />
            <span className="text-[#5b3ca8] dark:text-[#b3a1ec]">The Field Guide</span>
          </h1>
          <p className="mt-5 max-w-2xl font-serif text-2xl leading-[1.2] font-medium text-pretty text-foreground/80 sm:text-[1.8rem]">
            We have enough labels. Independence needs rules, receipts, and a way to take power back when it fails.
          </p>
          <p className="mt-4 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
            Tony Greenberg · September 2026
          </p>
        </header>

        <figure className="relative mt-8 aspect-3/2 overflow-hidden bg-muted sm:aspect-5/2">
          <Image
            src={HERO_IMG}
            alt="A person stands between an obsolete records room and a bright public gathering."
            fill
            fetchPriority="high"
            loading="eager"
            sizes="(min-width: 1152px) 1104px, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-4 bottom-4 flex flex-col gap-2 text-xs font-bold tracking-widest text-white uppercase sm:flex-row sm:items-end sm:justify-between">
            <span>Not a new flag. A new way to stand in public.</span>
            <span>INC ’26</span>
          </figcaption>
          <span className="absolute right-2 bottom-4 hidden rotate-180 text-[10px] [writing-mode:vertical-rl] font-bold tracking-[0.2em] whitespace-nowrap text-white/70 uppercase md:block">
            Washington, D.C. · September 23–25, 2026
          </span>
        </figure>

        {/* Ways to participate */}
        <nav aria-label="Ways to participate" className="mt-10 grid border-t-2 border-b border-t-foreground border-b-border md:grid-cols-3">
          {ACTIONS.map((a) => (
            <a
              key={a.kicker}
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener" } : {})}
              className="group block border-b border-border px-5 py-6 last:border-b-0 hover:bg-muted md:border-r md:border-b-0 md:last:border-r-0"
            >
              <small className="block text-xs font-bold tracking-[0.14em] text-brand-gold uppercase">{a.kicker}</small>
              <strong className="mt-5 block font-serif text-3xl leading-tight font-normal group-hover:text-[#5b3ca8] dark:group-hover:text-[#b3a1ec]">
                {a.title}
              </strong>
              <span className="mt-2 block text-sm text-muted-foreground">{a.body}</span>
            </a>
          ))}
        </nav>

        {/* The proposition */}
        <section id="storyline" className="mt-12 grid gap-4 border-t border-border pt-4 md:grid-cols-[13rem_1fr] md:gap-12">
          <Label>The proposition</Label>
          <div className="max-w-2xl font-serif text-lg leading-relaxed text-foreground/85 [&>p]:mt-5">
            <h2 className="font-serif text-4xl leading-[0.98] font-medium tracking-[-0.045em] text-balance text-foreground sm:text-[3.6rem]">
              Start with the objections.
            </h2>
            <p>
              Smart skeptics have earned the right to be difficult here. “Independent” can mean a mythical moderate
              with no actual coalition. A movement without a filter can become a big tent for bad-faith actors; a
              filter strong enough to keep them out can cost the majority mandate needed to win. Without ranked-choice
              voting already in place, an independent run can become a spoiler that hands power to the side its voters
              like least. Good intentions do not defend a system against sophisticated actors who know how to game it.
            </p>
            <p>
              That is an unusually unromantic way to begin a movement. Good. Romance is useful for the poster. It is
              less useful when someone arrives with a burner account, a donor list, and a plan.
            </p>
            <p>
              <span className="inline-block border-b border-brand-gold pb-0.5 font-sans text-xs font-bold tracking-[0.14em] text-brand-gold uppercase">
                Reframe
              </span>
            </p>
            <p>
              Calling yourself “independent” is easy. The real work is transparency standards, anti-corruption tooling,
              ranked-choice and National Popular Vote Compact advocacy, plus reputation and accountability mechanisms
              that can outlast one convention.
            </p>
            <p>
              We are not asking a new label to save democracy. Labels have already had several chances and mostly came
              back with a tote bag.
            </p>
            <p className="border-y border-border py-3">
              <Link
                href="/america-unbundled"
                className="text-[#5b3ca8] hover:underline dark:text-[#b3a1ec]"
              >
                <strong>Start with Part One:</strong> AI Does Not Have a Candidate{" "}
                <ArrowUpRight aria-hidden="true" className="inline size-4 align-text-bottom" />
              </Link>
            </p>

            <div className="mt-12">
              <Label>Consensus instrument</Label>
              <h3 className="mt-3 font-serif text-3xl leading-[1.1] font-medium text-foreground sm:text-[2.15rem]">
                Representation needs a smaller room
              </h3>
              <p className="mt-3">
                Start with the practical problem: there are too many consequential issues for everyone affected to
                follow, and too little reason for one voter among millions to put in the hours required to become
                genuinely informed.
              </p>
              <p className="mt-5">
                Sortition, or representative random selection, offers a different mechanism. A smaller group can mirror
                the population, hear diverse experts and lived experience, and do the work our mass politics keeps
                pretending can happen in a comment thread.
              </p>
              <p className="mt-5">
                That group could refine decision rules, set agendas, write legislative proposals, choose what reaches
                ratification, and hire or fire the administrators who carry the work forward.
              </p>
              <blockquote className="mt-6 border-l-2 border-[#5b3ca8] pl-4 font-serif text-xl leading-snug text-foreground italic dark:border-[#b3a1ec]">
                It takes a family to make a public. It may take a carefully chosen small public to make democracy think.
              </blockquote>
            </div>

            <div className="mt-12">
              <Label>Governance in practice</Label>
              <h3 className="mt-3 font-serif text-3xl leading-[1.1] font-medium text-foreground sm:text-[2.15rem]">
                Independent governance needs operating rules
              </h3>
              <p className="mt-3">
                My friend and colleague <ExternalLink href="https://ramprate.com/about">Josh Bykowski</ExternalLink>{" "}
                leads corporate development and legal work at my operating company, RampRate, and oversees our{" "}
                <ExternalLink href="https://ramprate.com/torque">Torque critical issue management practice</ExternalLink>.
                He is a licensed attorney working across emerging technology, data privacy, intellectual property, and
                blockchain, and has served as a voting associate for a decentralized organization with more than $250
                million under management.
              </p>
              <blockquote className="mt-6 border-l-2 border-[#5b3ca8] pl-4 font-serif text-xl leading-snug text-foreground italic dark:border-[#b3a1ec]">
                A political movement without a governance stack is just a group chat with merchandise.
              </blockquote>
              <p className="mt-6">
                That experience matters because independent political infrastructure cannot stop at aspiration. It
                needs explicit authority, defensible voting procedures, transparent records, conflict rules, and a
                method for challenging decisions. In his essay on{" "}
                <ExternalLink href="https://ramprate.com/blog/uni-token-governance">
                  Uniswap governance and incentives
                </ExternalLink>
                , Josh makes the essential point: “The proposed change is not without trade-offs. It provides another
                example in decentralized governance where turning one lever on, consequently turns another off.”
              </p>
              <p className="mt-5">
                Decentralization only becomes governance when participants can see who may decide, how power moves, and
                what happens when a decision fails.
              </p>
              <p className="mt-5">
                <strong className="text-foreground">Relationship disclosure:</strong> Josh works with me at RampRate and
                is a friend and colleague. The quoted sentence is his; the surrounding interpretation is mine.
              </p>
            </div>

            <aside aria-label="America House" className="mt-12">
              <Label>
                <span className="inline-flex items-center gap-1.5">
                  America House <Bird aria-hidden="true" className="size-3.5" /> · Civic creator headquarters
                </span>
              </Label>
              <h3 className="mt-3 font-serif text-3xl leading-[1.1] font-medium text-foreground sm:text-[2.15rem]">
                The house is the set. The people are the story.
              </h3>
              <p className="mt-3">
                <ExternalLink href="https://america.co/house">America House</ExternalLink> is in Virginia, across the
                Potomac from Washington. Jack Jay and his partner, Sydney Thackray, are building a permanent home for
                creators, builders, organizers, technologists, and public servants to live together, disagree without
                contempt, make media, form working groups, and turn attention into public work.
              </p>
              <p className="mt-5">
                Their Creator Summit has just concluded. America House is now holding what may become the most
                consequential after-party of the Independent National Convention. INC brings organizers, candidates,
                reform infrastructure, and national political reach. America House brings creators, production, cultural
                intelligence, and the chemistry of shared work.
              </p>
              <p className="mt-5">
                Here is the overlap: a political effort meets a cultural one. Relationships formed at the convention have
                somewhere to go after the badges come off, and ideas have storytellers. The two efforts remain distinct,
                but their overlap could turn independence from a voter category into a culture of participation.
              </p>
              <p className="mt-5">It takes a family to make a public.</p>
            </aside>

            {/* Native <details>: the content is in the server HTML whether open or closed. */}
            <details open className="mt-12 border-y border-border py-5 font-sans">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="block text-xs font-bold tracking-[0.18em] text-brand-gold uppercase">
                  The movement arc
                </span>
                <strong className="mt-1 block font-serif text-3xl font-normal text-foreground">
                  Inherit → Wake → Choose → Act
                </strong>
              </summary>
              <div
                aria-label="America, Unbundled narrative arc"
                className="mt-8 grid gap-8 border-t-2 border-t-[#5b3ca8]/40 pt-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
              >
                {ARC.map((s) => (
                  <article key={s.index}>
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand-gold uppercase">
                      <span aria-hidden className="size-3.5 rounded-full border border-brand-gold bg-brand-gold/10" />
                      {s.index}
                    </div>
                    <h3 className="mt-4 font-serif text-3xl leading-[0.94] font-medium text-balance text-foreground sm:text-[2.55rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 font-serif text-lg leading-relaxed text-foreground/80">{s.body}</p>
                  </article>
                ))}
              </div>
            </details>

            <details className="mt-5 border-y border-border py-4 font-sans">
              <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-xl text-foreground">Independent by synthesis</span>
                <span className="text-xs font-bold text-muted-foreground">
                  What can you build with someone you disagree with?
                </span>
              </summary>
              <p className="mt-3 font-serif text-lg leading-relaxed text-foreground/85">
                Independence means holding a judgment, revising it when evidence changes, and cooperating without
                demanding sameness. Centrism and permanent distance are both easier poses.
              </p>
            </details>
          </div>
        </section>

        {/* The decision point */}
        <section
          id="questions"
          className="mt-12 grid scroll-mt-24 gap-4 border-t border-border pt-4 md:grid-cols-[13rem_1fr] md:gap-12"
        >
          <Label>The decision point</Label>
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl leading-[0.98] font-medium tracking-[-0.045em] text-balance sm:text-[3.6rem]">
              Do not ask who they vote for. Ask what they will protect.
            </h2>
            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-foreground/85">
              Use these in a real conversation, not as a sorting exercise. They show how someone deals with power,
              evidence, liberty, and responsibility.
            </p>
            <FieldGuideResponses />
          </div>
        </section>

        {/* Event callout */}
        <aside
          aria-label="Independent National Convention context"
          className="mt-14 flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <span className="block text-xs font-bold tracking-[0.18em] text-brand-gold uppercase">
              One current gathering
            </span>
            <strong className="mt-1 block font-serif text-xl font-normal">
              Independent National Convention · September 23–25, 2026 · Washington, D.C.
            </strong>
            <small className="mt-1 block text-xs text-muted-foreground">
              This essay is commentary, not the official convention site.
            </small>
          </div>
          <a
            href={INC_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start border-b border-foreground text-xs font-bold tracking-[0.08em] uppercase hover:text-[#5b3ca8] sm:self-auto dark:hover:text-[#b3a1ec]"
          >
            Program and registration <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </aside>

        {/* Sources */}
        <section id="reading" className="mt-14 border-t-2 border-b border-t-foreground border-b-border pt-4 pb-10">
          <Label>Sources + further reading</Label>
          <h2 className="mt-3 font-serif text-4xl leading-[0.98] font-medium tracking-[-0.045em] text-balance sm:text-[3.6rem]">
            The receipts live with Part One.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The sources are there for anyone who wants to check the work. Nobody has to read a syllabus first.
          </p>
          <p className="mt-4">
            <Link
              href="/america-unbundled#sources"
              className="inline-flex items-center gap-1.5 font-bold text-[#5b3ca8] underline underline-offset-2 dark:text-[#b3a1ec]"
            >
              Open the bibliography and receipts <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </p>
        </section>

        {/* Closing */}
        <section className="relative my-16 px-2 sm:px-16">
          <Sparkle
            aria-hidden="true"
            className="absolute top-0 right-4 hidden size-20 fill-current text-brand-gold/25 sm:block"
          />
          <h2 className="max-w-2xl font-serif text-4xl leading-[0.98] font-medium tracking-[-0.045em] text-balance sm:text-[3.6rem]">
            Independents are not waiting for America to return.
          </h2>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-pretty text-foreground/85">
            They are putting relationships, standards, and working systems in place. That gives a civic order something
            to stand on.
          </p>
        </section>

        {/* About the author */}
        <aside
          aria-label="About Tony Greenberg, RampRate, and ImpactSoul"
          className="max-w-3xl font-serif text-lg leading-relaxed text-foreground/85"
        >
          <Label>About the author</Label>
          <h3 className="mt-3 font-serif text-3xl font-normal text-foreground">Tony Greenberg</h3>
          <p className="mt-3">
            Tony “WhyNot” Greenberg is an investor, entrepreneur, impact futurist, longtime provocateur inside the
            data-center business, and founder and CEO of <ExternalLink href="https://ramprate.com/">RampRate</ExternalLink>.
            For more than 25 years, he has worked where technology, infrastructure, capital, and human systems collide,
            which is usually where the invoices become interesting.
          </p>
          <p className="mt-5">
            RampRate is the B Corp holding company and consulting engine behind that work. Its practices include AI and
            data-center infrastructure, strategic sourcing, governance, and{" "}
            <ExternalLink href="https://ramprate.com/torque">Torque</ExternalLink>, which helps leaders resolve
            critical issues before they become existential ones. Its deepest asset is 25 years of compounded trust
            across enterprise, technology, capital, and impact: relationships that become access, leverage, and revenue
            when a difficult problem needs more than advice. Its documented{" "}
            <ExternalLink href="https://ramprate.com/proof">client history</ExternalLink> includes Microsoft, eBay,
            Sony, and Nike.
          </p>
          <p className="mt-5">
            Tony also co-founded <ExternalLink href="https://impactsoul.is/">ImpactSoul</ExternalLink>, a regenerative
            investment and operating system that directs capital, technology, and culture toward restoration rather
            than extraction. He has been arguing with the future since sharing a stage with Ray Kurzweil in 2010. His
            favorite operating question remains: Why not?
          </p>
          <p className="mt-5 tracking-[0.06em] text-foreground/80 uppercase">
            The political views are his. The receipts are linked. The trouble is intentional.
          </p>
        </aside>

        {/* Series footer line */}
        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-5 text-xs tracking-widest text-muted-foreground uppercase sm:flex-row sm:justify-between">
          <span>Part Two · America, Unbundled</span>
          <Link href="/america-unbundled" className="inline-flex min-h-11 items-center gap-1.5 underline underline-offset-2 hover:text-foreground sm:min-h-0">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Read Part One: AI Does Not Have a Candidate
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
