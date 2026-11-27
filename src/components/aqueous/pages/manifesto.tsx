import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  Droplets,
  ExternalLink,
  Globe,
  Heart,
  Leaf,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare } from "@/components/aqueous/share-button";
import { aqueousImages } from "@/lib/content/aqueous/images";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Manifesto.tsx (2026-11-24). Same copy, markup and
// classes; the dead Manus spring photo is aqueousImages.natureSpringSource.
// The app linked Tony's essays on https://tonygreenberg.com/<old WordPress path>/ in a new tab. That
// is this site now, so they are same-tab next/link links straight to where each old path lands
// (legacy-post-redirects.ts / search-console-redirects.ts), shown with an arrow instead of the
// external-link icon. Outside sources (Nate Hagens, PNAS...) stay external.

const readClass = "text-primary hover:underline";

type Reading = { title: string; subtitle: string; url: string; source: string };

export const keyReadings: { category: string; items: Reading[] }[] = [
  {
    category: "The Founder's Journey",
    items: [
      { title: "India: My Virtual Soul & Home", subtitle: "Finding dharmic purpose through service", url: "/blog/india-my-virtual-soul-home", source: "tonygreenberg.com" },
      { title: "Forever Chemicals in My Blood", subtitle: "What I learned testing for PFAS and microplastics", url: "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics", source: "tonygreenberg.com" },
      { title: "Are You Going Green or Going for the Green?", subtitle: "The conscious satisfier's dilemma", url: "/blog/return-on-investment-going-green-going-green-2", source: "tonygreenberg.com" },
      { title: "The Tug of War: Ethical vs. Economic Decisions", subtitle: "Environment versus personal life choices", url: "/blog/the-tug-of-war-ethical-vs-economic-decisions", source: "tonygreenberg.com" },
      { title: "Boiling the Human — H+ Summit at Harvard", subtitle: "Madoff's Law and the exploitation machine", url: "/blog/building-services-market-transhuman-era", source: "tonygreenberg.com" },
      { title: "Human Operating System — 5 Disciplines", subtitle: "The Human 2.0 framework", url: "/blog/human-operating-system", source: "tonygreenberg.com" },
      { title: "DAO: The Way of Dao", subtitle: '"Water does not fight the Earth. Water flows, slows, inundates, and falls."', url: "/blog/the-way-of-dao", source: "tonygreenberg.com" },
      { title: "The Elixir of Life", subtitle: "Sacred spring water, ceremony, and the pendant", url: "/blog/elixir-of-life-device-and-journey", source: "tonygreenberg.com" },
    ],
  },
  {
    category: "The Great Simplification",
    items: [
      { title: "The Superorganism and the Self", subtitle: "How collective systems shape individual choices", url: "https://www.thegreatsimplification.com/frankly-original/73-the-superorganism-and-the-self", source: "Nate Hagens" },
      { title: "Growth Until Not...", subtitle: "The lack of purpose in modern life", url: "https://www.thegreatsimplification.com/frankly-original/frankly-07-growth-until-not", source: "Nate Hagens" },
      { title: "Daniel Schmachtenberger: Bend Not Break", subtitle: "Macro risks and pathways for civilization", url: "https://www.thegreatsimplification.com/episode/05-daniel-schmactenberger", source: "The Great Simplification" },
      { title: "Episode 100: Lower Throughput Lifestyles", subtitle: "Consuming less, living more", url: "https://www.youtube.com/watch?v=GocuMZX3hIs", source: "Nate Hagens" },
      { title: "Money is a Claim on Energy", subtitle: "The energy-money nexus that drives extraction", url: "https://www.youtube.com/results?search_query=nate+hagens+money+claim+energy", source: "Nate Hagens" },
    ],
  },
  {
    category: "The Science",
    items: [
      { title: "240,000 Nanoplastics Per Liter of Bottled Water", subtitle: "Columbia University / PNAS, January 2024", url: "https://www.pnas.org/doi/10.1073/pnas.2300582121", source: "PNAS" },
      { title: "Microplastics in Carotid Artery Plaque — 4.5x Heart Attack Risk", subtitle: "New England Journal of Medicine, March 2024", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2309822", source: "NEJM" },
      { title: "Microplastics Found in Human Blood", subtitle: "Vrije Universiteit Amsterdam, March 2022", url: "https://doi.org/10.1016/j.envint.2022.107199", source: "Environment International" },
      { title: "WHO: Microplastics in Drinking Water", subtitle: "Current knowledge and research needs", url: "https://www.who.int/publications/i/item/9789240054608", source: "World Health Organization" },
    ],
  },
];

const satisfierPoints: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: DollarSign, title: "Spending Less Creates More", text: "Every dollar not spent on overpriced, over-marketed products is a dollar that can fund something meaningful — philanthropy, community, regeneration." },
  { icon: Sparkles, title: "Asking for Discounts Is Not Cheap — It's Strategic", text: "Negotiating better prices is an act of conscious resistance against the extraction machine. The savings go to a philanthropy fund that creates sustainable, regenerative lives for others." },
  { icon: Globe, title: "Quality-to-Price Ratio Is the True Metric", text: "Not the cheapest. Not the most expensive. The best value — the highest quality per dollar spent. This is what the QPR engine measures." },
  { icon: Leaf, title: "Reducing GDP Is the Path to Contentment", text: "When we stop measuring success by how much we consume and start measuring by how well we live, everything changes." },
];

// was motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} (default duration)
const fadeUpEnter = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both";

function ReadingCard({ item }: { item: Reading }) {
  const body = (
    <div className="flex-1">
      <h4 className="font-semibold transition-colors group-hover:text-primary">{item.title}</h4>
      <p className="mt-0.5 text-sm text-muted-foreground">{item.subtitle}</p>
    </div>
  );
  const cardClass =
    "group flex items-start gap-4 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:shadow-md";
  if (item.url.startsWith("/")) {
    return (
      <Link href={item.url} className={cardClass}>
        {body}
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">{item.source}</span>
          <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </Link>
    );
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">{item.source}</span>
        <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </a>
  );
}

export function Manifesto() {
  const spring = aqueousImages.natureSpringSource;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — Contemplative, philosophical */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <div className="absolute inset-0">
          <Image src={spring.src} alt={spring.alt} fill priority sizes="100vw" className="size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,61,78,0.92)_0%,rgba(10,50,42,0.88)_100%)]" />
        </div>
        <div className="grain-overlay absolute inset-0" />
        <div className="relative z-10 container">
          {/* was motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} */}
          <div className="max-w-3xl animate-in fill-mode-both fade-in slide-in-from-bottom-[30px] duration-1000">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/10">
                <BookOpen aria-hidden="true" className="size-6 text-white/80" />
              </div>
              <span className="font-mono text-sm tracking-widest text-white/60 uppercase">White Paper / Manifesto</span>
            </div>
            <h1 className="mb-8 font-aq-display text-5xl font-bold tracking-tight text-[#F5F0E8] md:text-7xl">
              Finding Value.
              <br />
              Finding Your Dharma.
            </h1>
            <p className="text-xl leading-relaxed text-[#D4C5A9]">
              This site is a mirror of everything. It is 100% open source. It exists because of a simple craving: to
              allow people to live a better, more beautiful, more abundant life — with as few dollars as possible.
            </p>
          </div>
        </div>
      </section>

      {/* The Thesis */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal enter={fadeUpEnter}>
              <h2 className="mb-8 font-aq-display text-3xl font-bold md:text-4xl">
                The Only Way to Save Ourselves from Ourselves
              </h2>

              <div className="prose prose-lg max-w-none space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  We are living inside what Nate Hagens calls <strong className="text-foreground">The Superorganism</strong>{" "}
                  — a global metabolic system that converts energy and resources into economic growth, regardless of
                  whether that growth serves human wellbeing. The Superorganism doesn&apos;t care about your health. It
                  cares about throughput. It cares about GDP.
                </p>

                <p>
                  And here is the uncomfortable truth that Hagens, Daniel Schmachtenberger, Timothée Parrique, and others
                  have articulated:{" "}
                  <strong className="text-foreground">
                    the only way to prevent the universe from folding in on top of itself is to reduce Gross National
                    Product
                  </strong>
                  . Not redirect it. Not &quot;green&quot; it. <em>Reduce</em> it.
                </p>

                <blockquote className="my-8 border-l-4 border-primary/40 py-2 pl-6 font-aq-display text-[1.3rem] text-foreground/80 italic">
                  &quot;We don&apos;t have an energy crisis. We don&apos;t have a climate crisis. We have a consumption
                  crisis disguised as an economy.&quot;
                  <footer className="mt-2 text-sm text-muted-foreground not-italic">
                    — Nate Hagens, The Great Simplification
                  </footer>
                </blockquote>

                <p>
                  This is not about deprivation. This is about{" "}
                  <strong className="text-foreground">becoming a Conscious Satisfier</strong> — someone who has
                  discovered that contentment and true value in the universe come not from consuming more, but from
                  consuming <em>less, better, and with intention</em>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Conscious Satisfier */}
      <section className="bg-card py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal enter={fadeUpEnter}>
              <div className="mb-6 flex items-center gap-3">
                <Heart aria-hidden="true" className="size-6 text-primary" />
                <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Conscious Satisfier</h2>
              </div>

              <div className="prose prose-lg max-w-none space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  Herbert Simon coined the term <strong className="text-foreground">&quot;satisficer&quot;</strong> —
                  someone who seeks a solution that is &quot;good enough&quot; rather than optimal. But we need to evolve
                  this concept. A <strong className="text-foreground">Conscious Satisfier</strong> doesn&apos;t settle
                  for less out of laziness — they choose less out of wisdom. They understand that:
                </p>

                <div className="not-prose my-8 grid gap-4">
                  {satisfierPoints.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      // was motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      <Reveal
                        key={item.title}
                        enter="animate-in fade-in slide-in-from-left-2.5 duration-500 fill-mode-both"
                        delay={i * 0.1}
                        className="flex items-start gap-4 rounded-xl border border-border/50 p-5"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon aria-hidden="true" className="size-5" />
                        </div>
                        <div>
                          <h3 className="mb-1 font-bold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.text}</p>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>

                <p>
                  This philosophy extends beyond water. Water is where we start — because it&apos;s the most fundamental
                  human need, and it&apos;s where the gap between marketing and reality is most obscene. But the QPR
                  engine is designed to expand into every product category where corporations extract maximum profit
                  while delivering minimum value.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Human 2.0 + Dharma */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal enter={fadeUpEnter}>
              <div className="mb-6 flex items-center gap-3">
                <Zap aria-hidden="true" className="size-6 text-primary" />
                <h2 className="font-aq-display text-3xl font-bold md:text-4xl">Human 2.0: Finding Your Dharma</h2>
              </div>

              <div className="prose prose-lg max-w-none space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  At the H+ Summit at Harvard in 2010,{" "}
                  <Link href="/blog/building-services-market-transhuman-era" className={readClass}>
                    a presentation called &quot;Boiling the Human&quot;
                  </Link>{" "}
                  introduced <strong className="text-foreground">Madoff&apos;s Law</strong>:{" "}
                  <em>&quot;Anywhere profit can be made, it will be made.&quot;</em> This law explains the entire bottled
                  water industry. It explains why Coca-Cola sells repackaged tap water at a 3,000% markup. It explains
                  why PepsiCo was forced to add &quot;Public Water Source&quot; to Aquafina labels.
                </p>

                <p>
                  But Madoff&apos;s Law also points to the solution. If we can make it <em>unprofitable</em> to sell
                  garbage water in plastic bottles — by educating consumers, by providing transparent quality data, by
                  making the QPR score as ubiquitous as a Yelp rating — then the market will shift.
                </p>

                <blockquote className="my-8 border-l-4 border-primary/40 py-2 pl-6 font-aq-display text-[1.3rem] text-foreground/80 italic">
                  &quot;Water does not fight the Earth. Water flows, slows, inundates, and falls.&quot;
                  <footer className="mt-2 text-sm text-muted-foreground not-italic">
                    —{" "}
                    <Link href="/blog/the-way-of-dao" className={readClass}>
                      The Way of Dao
                    </Link>
                  </footer>
                </blockquote>

                <p>
                  The{" "}
                  <Link href="/blog/human-operating-system" className={readClass}>
                    Human 2.0 operating system
                  </Link>{" "}
                  isn&apos;t about becoming more machine-like. It&apos;s about becoming more <em>human</em> — more
                  conscious, more intentional, more connected to our dharmic purpose.{" "}
                  <Link href="/blog/india-my-virtual-soul-home" className={readClass}>
                    Finding your dharma
                  </Link>{" "}
                  means finding the work that serves both your soul and the world. For us, that work starts with water.
                </p>

                <p>
                  When{" "}
                  <Link href="/blog/forever-chemicals-in-my-blood-pfas-and-microplastics" className={readClass}>
                    PFAS and microplastics were found in our founder&apos;s blood
                  </Link>{" "}
                  — 17 particles, 170 particles per milliliter — it stopped being theoretical. 98% of Americans carry
                  measurable PFAS in their blood. This is not a future problem. This is happening inside your body right
                  now.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Great Simplification Connection */}
      <section className="bg-card py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal enter={fadeUpEnter}>
              <div className="mb-6 flex items-center gap-3">
                <Globe aria-hidden="true" className="size-6 text-primary" />
                <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Great Simplification</h2>
              </div>

              <div className="prose prose-lg max-w-none space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  Nate Hagens&apos; thesis is simple and devastating:{" "}
                  <strong className="text-foreground">
                    our entire civilization is a heat engine that converts fossil energy into economic activity
                  </strong>
                  . Money is a claim on energy. GDP is a measure of how fast we&apos;re burning through the planet&apos;s
                  finite resources. And the Superorganism — the emergent global system of markets, corporations, and
                  consumer behavior — is optimized for one thing: <em>more throughput</em>.
                </p>

                <p>
                  The Great Simplification is what happens when this system hits biophysical limits. It&apos;s not a
                  choice — it&apos;s a consequence. The question is whether we navigate it consciously or crash into it
                  blindly.
                </p>

                <p>Aqueous is a small but deliberate act of conscious navigation. By helping people:</p>

                <ul className="my-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Stop buying overpriced plastic water</strong> — reducing demand
                    for extractive corporations
                  </li>
                  <li>
                    <strong className="text-foreground">Filter their own water at home</strong> — reducing packaging
                    waste and transportation energy
                  </li>
                  <li>
                    <strong className="text-foreground">Choose glass over plastic</strong> — reducing microplastic
                    exposure and ocean pollution
                  </li>
                  <li>
                    <strong className="text-foreground">Understand the true cost of their choices</strong> — becoming
                    conscious participants rather than unconscious consumers
                  </li>
                  <li>
                    <strong className="text-foreground">Redirect savings to meaningful causes</strong> — funding
                    regenerative projects instead of corporate profits
                  </li>
                </ul>

                <p>
                  We contribute to what Hagens calls{" "}
                  <strong className="text-foreground">&quot;lower throughput lifestyles&quot;</strong> — not as
                  sacrifice, but as liberation. The person drinking $0.06/gallon RO-filtered water from a glass bottle is
                  healthier, wealthier, and more aligned with reality than the person paying $15/gallon for VOSS in
                  plastic.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Philanthropy Model */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal enter={fadeUpEnter}>
              <div className="mb-6 flex items-center gap-3">
                <Users aria-hidden="true" className="size-6 text-primary" />
                <h2 className="font-aq-display text-3xl font-bold md:text-4xl">The Philanthropy Model</h2>
              </div>

              <div className="prose prose-lg max-w-none space-y-6 leading-relaxed text-muted-foreground">
                <p>
                  Here is the philosophy in practice:{" "}
                  <strong className="text-foreground">
                    spend less on everything, ask for discounts everywhere, and allocate the savings to a philanthropy
                    fund
                  </strong>{" "}
                  that enables people to build more sustainable, regenerative lives.
                </p>

                <p>
                  This isn&apos;t about being cheap. It&apos;s about being <em>strategic</em>. Every dollar saved from a
                  negotiated discount, every dollar not spent on overmarketed garbage, every dollar redirected from
                  corporate extraction to human regeneration — that&apos;s the conscious satisfier in action.
                </p>

                <div className="not-prose my-8 rounded-2xl border-2 border-primary/20 bg-[rgba(78,205,196,0.05)] p-6">
                  <h3 className="mb-4 font-aq-display text-xl font-bold">The Aqueous Commitment</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-primary">01</span>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">100% Open Source</strong> — This entire platform, its data,
                        its methodology, and its code are open. Knowledge about water quality should never be locked
                        behind a paywall.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-primary">02</span>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Transparent Affiliate Model</strong> — When we recommend
                        products, we tell you exactly why. Affiliate revenue funds platform development and the
                        philanthropy fund.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-primary">03</span>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Philanthropy-First</strong> — A portion of all revenue goes
                        directly to funding clean water access, regenerative agriculture, and sustainable living
                        initiatives.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-primary">04</span>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">No Corporate Influence</strong> — We will never accept
                        sponsorship or advertising from water brands. Our QPR scores are independent and incorruptible.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  As the{" "}
                  <Link href="/blog/return-on-investment-going-green-going-green-2" className={readClass}>
                    Conscious Satisfier article
                  </Link>{" "}
                  asks: are you going green, or going for the green? The answer should be both — but in the right order.
                  Green first. Then the green follows, naturally, as a consequence of alignment rather than extraction.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key Readings */}
      <section className="bg-card py-20">
        <div className="container">
          <Reveal enter={fadeUpEnter} className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <BookOpen aria-hidden="true" className="size-6 text-primary" />
              <h2 className="font-aq-display text-3xl font-bold md:text-4xl">Essential Readings &amp; Resources</h2>
            </div>
            <p className="max-w-3xl text-lg text-muted-foreground">
              The intellectual foundation of Aqueous. Every source is open, every link is live, every idea is free.
            </p>
          </Reveal>

          <div className="grid max-w-4xl gap-10">
            {keyReadings.map((section, si) => (
              // was motion.div whileInView y 20 → 0, transition={{ delay: si * 0.1 }}
              <Reveal key={section.category} enter={fadeUpEnter} delay={si * 0.1}>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {si + 1}
                  </span>
                  {section.category}
                </h3>
                <div className="grid gap-3">
                  {section.items.map((item) => (
                    <ReadingCard key={item.url} item={item} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Droplets aria-hidden="true" className="mx-auto mb-6 size-12 text-primary" />
            <h2 className="mb-8 font-aq-display text-3xl font-bold md:text-5xl">Cleanliness Is Next to Godliness</h2>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Clean water. Clean data. Clean conscience. The path to a beautiful, abundant life doesn&apos;t require
              more money — it requires more <em>awareness</em>. Know what you&apos;re drinking. Know what you&apos;re
              paying. Know where your money goes. That&apos;s the beginning of everything.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={aq("/explore")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Water Ratings <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href={aq("/wall-of-shame")}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-medium transition-colors hover:bg-muted/50"
              >
                See the Wall of Shame <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
