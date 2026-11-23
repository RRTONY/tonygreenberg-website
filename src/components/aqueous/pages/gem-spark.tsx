import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Compass,
  Droplets,
  Eye,
  Globe,
  Heart,
  Sparkles,
  Star,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare, ShareButton } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/GemSpark.tsx (2026-11-24): Aqueous's own Gem Spark
// journey, at /aqueous/gem-spark (not the site's /gem-spark). Same copy, markup and classes.
// The infinite framer loops are aqueous.css classes: the sparkle's rotate [0,5,-5,0] 4s = aq-sway,
// the down arrow's y [0,8,0] 2s = aq-bob.
// "Deeper reading" pointed at Tony's essays on https://tonygreenberg.com/<old path>/ in a new tab; that is
// this site now, so they are same-tab links to where each old path lands (/blog/...). Their typed "→"
// is an ArrowRight icon.

type Step = {
  phase: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Icon tile classes (the app's `bgColor` + `color`). */
  tile: string;
  description: string;
  action: string;
  link: string;
  articles: { title: string; url: string }[];
};

export const journeySteps: Step[] = [
  {
    phase: "IGNITION",
    title: "The Gem Spark",
    subtitle: "Where serendipity meets synchronicity",
    icon: Sparkles,
    tile: "bg-amber-500/10 text-amber-600",
    description: `You found this page. That wasn't an accident. The Gem Spark is the moment when what you've been searching for and what's been searching for you collide — the precise intersection of serendipity and synchronicity. You didn't just stumble onto a water app. You arrived at the threshold of a different way of living.`,
    action: "Take the 10-Point Water Profile Survey",
    link: "/tap-water",
    articles: [
      { title: "Powering Purpose-Driven Innovation", url: "/blog/powering-purpose-driven-innovation" },
      { title: "The Ties That Bind", url: "/blog/the-ties-that-bind-interpersonal-relationships" },
    ],
  },
  {
    phase: "DISCOVERY",
    title: "Know Your Water",
    subtitle: "The mirror that reflects your choices",
    icon: Droplets,
    tile: "bg-primary/10 text-primary",
    description: `Water is the most intimate thing you consume — it becomes you, literally. Your AWI score isn't just a number. It's a mirror. It reflects how much attention you're paying to the most fundamental input of your biology. When your water score approaches 1, you're not just drinking better water. You're becoming someone who pays attention.`,
    action: "Explore the AWI Index",
    link: "/awi",
    articles: [{ title: "Forever Chemicals in My Blood", url: "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics" }],
  },
  {
    phase: "AWAKENING",
    title: "Find Your Dharma",
    subtitle: "The alignment between values and daily action",
    icon: Compass,
    tile: "bg-emerald-500/10 text-emerald-600",
    description: `Dharma isn't a destination — it's the practice of aligning what you believe with what you do, every single day. Water is the first domino. When you choose consciously about something as fundamental as water, the ripple extends to food, to products, to relationships, to how you spend your time and money. The QPR engine doesn't just rate water. It trains your discernment muscle.`,
    action: "Read the Manifesto",
    link: "/manifesto",
    articles: [{ title: "India: My Virtual Soul Home", url: "/blog/india-my-virtual-soul-home" }],
  },
  {
    phase: "SIMPLIFICATION",
    title: "The Conscious Satisfier",
    subtitle: "Spending less. Living more. Giving everything.",
    icon: Sun,
    tile: "bg-orange-500/10 text-orange-600",
    description: `The Harvard Grant Study — 87 years of tracking what actually makes humans happy — proved it definitively: it's not wealth, not status, not the premium water brand. It's relationships. The Conscious Satisfier spends less on overpriced products, negotiates for discounts, and allocates the savings to a philanthropy fund that enables others to build sustainable, regenerative lives. Less GDP. More contentment. More abundance for everyone.`,
    action: "See the Value Comparison",
    link: "/explore",
    articles: [{ title: "Return on Investment Going Green", url: "/blog/return-on-investment-going-green-going-green-2" }],
  },
  {
    phase: "FLOW STATE",
    title: "The Flow Circuit",
    subtitle: "Finding your tribe. Working without friction.",
    icon: Zap,
    tile: "bg-violet-500/10 text-violet-600",
    description: `Flow isn't something you achieve alone. It's a circuit — energy moving between people who are aligned in purpose. When you find your tribe through Aqueous, you're not joining a community. You're plugging into a current. Health and healing, personal growth, percentage toward your healed state — these aren't solo journeys. The Flow Circuit connects you with others who are on the same frequency, working effortlessly and without friction toward the same vision.`,
    action: "Share & Find Your Tribe",
    link: "/pricing",
    articles: [{ title: "Mastering Human and Business Development", url: "/blog/mastering-human-and-business-development" }],
  },
  {
    phase: "TRANSFORMATION",
    title: "Present → Healed State",
    subtitle: "Where you are now. Where you're becoming.",
    icon: Star,
    tile: "bg-primary/10 text-primary",
    description: `The Grant Study Index measures the gap between your present state and your healed state — not as a judgment, but as a compass. Your AWI score, your water choices, your consumption patterns, your community engagement — they all feed into a picture of who you're becoming. This isn't about perfection. It's about trajectory. Are you moving toward the version of yourself that drinks clean water, breathes clean air, loves deeply, and gives generously? That's all that matters.`,
    action: "Take the Survey",
    link: "/tap-water",
    articles: [{ title: "Boiling the Human: H+ Summit", url: "/blog/building-services-market-transhuman-era" }],
  },
];

const practices: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Eye, label: "See clearly", desc: "Know what you consume. Know what it costs. Know who profits." },
  { icon: Heart, label: "Live fully", desc: "Spend less on things. Invest more in relationships and growth." },
  { icon: Globe, label: "Give everything", desc: "Every dollar saved becomes a dollar toward regenerative futures." },
];

// was motion.div initial={{ opacity: 0, y: 20 }} animate/whileInView={{ opacity: 1, y: 0 }} (default duration)
const fadeUpEnter = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both";

export function GemSpark() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="sacred-geo-bg absolute inset-0 opacity-3" />
        <div className="relative container">
          <div className={`mx-auto max-w-3xl text-center ${fadeUpEnter}`}>
            {/* was motion.div animate={{ rotate: [0, 5, -5, 0] }} 4s infinite */}
            <div className="aq-sway mb-6 inline-block">
              <Sparkles aria-hidden="true" className="size-12 text-amber-500" />
            </div>
            <h1 className="mb-6 font-aq-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              The Gem Spark
            </h1>
            <p className="mx-auto mb-2 max-w-2xl font-aq-display text-xl text-muted-foreground">
              The intersection of serendipity and synchronicity.
            </p>
            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground">
              The world&apos;s most efficient guide to becoming you — in the greatest sense and your greatest
              possibility. Starting with water. Ending with everything.
            </p>
            {/* was motion.div animate={{ y: [0, 8, 0] }} 2s infinite */}
            <div className="aq-bob">
              <ArrowDown aria-hidden="true" className="mx-auto size-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* The Premise */}
      <section className="bg-primary/3 py-16">
        <div className="container">
          <Reveal enter={fadeUpEnter} className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center font-aq-display text-2xl font-bold">Why This Exists</h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Nate Hagens calls it <strong className="text-foreground">The Great Simplification</strong> — the
                inevitable transition from a world built on infinite growth to one that must learn to thrive on less.
                Not less joy. Not less meaning. Less waste. Less extraction. Less pretending that a $4 bottle of water
                with a beautiful label is worth more than the spring it was stolen from.
              </p>
              <p>
                The only way to save ourselves from ourselves — the only way to prevent the universe from folding in on
                top of us — is to{" "}
                <strong className="text-foreground">
                  reduce gross national product and turn on becoming a conscious satisfier
                </strong>
                . That means finding the intersection between what you need and what the Earth can give. It means
                spending less, asking for discounts, and allocating every saved dollar to a philanthropy fund that
                enables others to build regenerative lives.
              </p>
              <p>
                This platform is that intersection. Water is the entry point.{" "}
                <strong className="text-foreground">You</strong> are the destination.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <ShareButton
                variant="inline"
                text="The Gem Spark — where serendipity meets synchronicity. The world's most efficient guide to becoming your greatest self."
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                // was motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
                // viewport={{ once: true, margin: '-50px' }}
                <Reveal
                  key={step.phase}
                  margin="-50px"
                  enter={
                    i % 2 === 0
                      ? "animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both"
                      : "animate-in fade-in slide-in-from-right-5 duration-500 fill-mode-both"
                  }
                  className="relative mb-16 last:mb-0"
                >
                  {/* Connector line */}
                  {i < journeySteps.length - 1 && (
                    <div className="absolute top-20 bottom-0 left-7 -mb-16 w-px bg-linear-to-b from-border to-transparent" />
                  )}

                  <div className="flex gap-6">
                    {/* Icon */}
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${step.tile}`}>
                      <Icon aria-hidden="true" className="size-8" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        PHASE {String(i + 1).padStart(2, "0")} — {step.phase}
                      </div>
                      <h3 className="mb-1 font-aq-display text-2xl font-bold">{step.title}</h3>
                      <p className="mb-4 text-sm text-muted-foreground italic">{step.subtitle}</p>
                      <p className="mb-4 leading-relaxed text-muted-foreground">{step.description}</p>

                      {/* Related reading */}
                      {step.articles.length > 0 && (
                        <div className="mb-4">
                          <p className="mb-1.5 text-xs font-medium text-muted-foreground/60">DEEPER READING</p>
                          <div className="flex flex-wrap gap-2">
                            {step.articles.map((a) => (
                              <Link
                                key={a.url}
                                href={a.url}
                                className="inline-flex items-center gap-1 rounded-lg bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                              >
                                {a.title} <ArrowRight aria-hidden="true" className="size-3" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={aq(step.link)}>
                            {step.action} <ArrowRight aria-hidden="true" className="ml-1.5 size-3" />
                          </Link>
                        </Button>
                        <ShareButton variant="icon" text={`${step.title} — ${step.subtitle}`} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* The New Tomorrow */}
      <section className="relative overflow-hidden bg-primary/3 py-20">
        <div className="sacred-geo-bg absolute inset-0 opacity-2" />
        <div className="relative container">
          <Reveal enter={fadeUpEnter} className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-aq-display text-3xl font-bold md:text-4xl">The Constant State of Flow</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Not a destination. A practice. Every day, all day, for the rest of your life — finding the intersection
              between serendipity and synchronicity. That&apos;s the Gem Spark. It&apos;s not something that happens
              once. It&apos;s something you become.
            </p>

            <div className="mb-12 grid gap-6 sm:grid-cols-3">
              {practices.map((item, i) => {
                const Icon = item.icon;
                return (
                  // was motion.div initial={{ opacity: 0, y: 10 }} whileInView transition={{ delay: i * 0.1 }}
                  <Reveal
                    key={item.label}
                    enter="animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both"
                    delay={i * 0.1}
                    className="text-center"
                  >
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-6" />
                    </div>
                    <h4 className="mb-1 text-sm font-bold">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </Reveal>
                );
              })}
            </div>

            <blockquote className="mx-auto mb-8 max-w-xl border-l-2 border-primary/30 pl-6 text-left text-lg text-muted-foreground italic">
              &quot;Cleanliness is next to godliness. The value-to-price ratio of everything — water, food,
              relationships, time — is the compass that guides us toward the most beautiful, wonderful, abundant life
              with as few dollars as possible.&quot;
            </blockquote>

            <p className="mb-8 text-sm text-muted-foreground">
              It takes so little to be part of this. A survey. A share. A conversation with someone you love about
              what&apos;s in their water. The spark is already lit. You&apos;re already here.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild>
                <Link href={aq("/tap-water")}>
                  Begin Your Journey <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={aq("/pricing")}>See Pricing &amp; Impact</Link>
              </Button>
            </div>

            <div className="mt-8">
              <ShareButton
                variant="card"
                className="mx-auto max-w-md"
                title="The Gem Spark"
                text="The world's most efficient guide to becoming your greatest self. Starting with water. Ending with everything."
              />
            </div>
          </Reveal>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
