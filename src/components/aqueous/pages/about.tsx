import Link from "next/link";
import { ArrowRight, Droplets, ExternalLink, Globe, Heart, Pen, Zap, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare, ShareButton } from "@/components/aqueous/share-button";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/About.tsx (2026-11-24). Same copy, markup and classes.
// The app's `fadeUp` variants (hidden {opacity 0, y 24} → visible, delay i * 0.1, 0.6s) are the
// FADE_UP classes below, with the same per-item delay.
// Ecosystem changes:
// - "TonyG — Essays & Frameworks" pointed at https://tonygreenberg.com/essays, which is this site now:
//   a same-tab link to /essays (arrow instead of the external-link icon). Same for "Read the Essays".
// - "The Way Out" card removed: its only home was a Manus-hosted app and it has no new home yet.
// - "fauxTony" (the AI avatar) card removed: the owner cancelled FauxTony and its buttons came off the
//   site on 2026-10-09.

const FADE_UP = "animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both";

type Project = { name: string; url: string; description: string; icon: LucideIcon; tag: string };

export const ecosystem: Project[] = [
  {
    name: "TonyG — Essays & Frameworks",
    url: "/essays",
    description:
      "105 essays over 15 years. Ideas and tools for making better decisions about identity, relationships, and what you build.",
    icon: Pen,
    tag: "Hub",
  },
  {
    name: "RampRate",
    url: "https://ramprate.com",
    description:
      "Enterprise infrastructure advisory. 25 years of wisdom, discernment, and relationships powering the world's most demanding organizations.",
    icon: Zap,
    tag: "Enterprise",
  },
  {
    name: "ImpactSoul",
    url: "https://impactsoul.is",
    description: "Regenerative capitalism at breakneck speed. Where impact investing meets the builders who give a damn.",
    icon: Heart,
    tag: "Impact",
  },
  {
    name: "Joy and Woe",
    url: "https://joyandwoe.com",
    description:
      "The full spectrum. A creative space where light and shadow meet — because the gold is always in the cracks.",
    icon: Globe,
    tag: "Creative",
  },
];

const cardClass =
  "group block h-full p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300";

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  const internal = project.url.startsWith("/");
  const body = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Icon aria-hidden="true" className="size-5 text-primary" />
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{project.tag}</span>
      </div>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold transition-colors group-hover:text-primary">
        {project.name}
        {internal ? (
          <ArrowRight aria-hidden="true" className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        ) : (
          <ExternalLink aria-hidden="true" className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
    </>
  );
  return internal ? (
    <Link href={project.url} className={cardClass}>
      {body}
    </Link>
  ) : (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
    </a>
  );
}

const connectClass =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors text-sm font-medium";

export function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative container">
          {/* was motion.div initial="hidden" animate="visible" with fadeUp children custom 0..2 */}
          <div className="mx-auto max-w-3xl text-center">
            <p className={`mb-4 text-sm font-medium tracking-widest text-primary uppercase ${FADE_UP}`}>
              The Builder Behind the Water
            </p>
            <h1
              className={`mb-6 font-aq-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl ${FADE_UP} delay-100`}
            >
              Only Time Buys Trust
            </h1>
            <p className={`mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground ${FADE_UP} delay-200`}>
              Aqueous didn&apos;t start as a water project. It started as a question:{" "}
              <em>
                what happens when you apply radical transparency to something everyone consumes but nobody examines?
              </em>
            </p>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <Reveal enter={FADE_UP} className="space-y-6 leading-relaxed text-muted-foreground">
              <p className="text-lg">
                <strong className="text-foreground">Tony Greenberg</strong> has spent 25 years building systems that
                challenge extractive economies — from enterprise infrastructure at{" "}
                <a href="https://ramprate.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  RampRate
                </a>{" "}
                to regenerative investing at{" "}
                <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ImpactSoul
                </a>
                . Author of <em>&quot;boy in the human&quot;</em> and presenter alongside Ray Kurzweil at the H+ Summit
                at Harvard in 2010, his work sits at the intersection of technology, consciousness, and the stubborn
                belief that better systems create better humans.
              </p>

              <p className="text-lg">
                Aqueous emerged from a simple realization: the bottled water industry spends billions telling you what
                to drink, but almost nothing helping you understand <em>what you&apos;re actually drinking</em>. The QPR
                engine — Quality, Purity, Resonance — was built to flip that equation. Open data. Transparent
                methodology. Your priorities, not theirs.
              </p>

              <p className="text-lg">
                This isn&apos;t a company. It&apos;s a crusade dressed as a water index. Every score is open-source.
                Every data point is traceable. The goal isn&apos;t to sell you better water — it&apos;s to make you a
                more conscious consumer of <em>everything</em>.
              </p>
            </Reveal>
          </div>

          {/* Quote. Was motion.blockquote x -20 → 0 (0.6s); the Reveal wrapper carries its margin. */}
          <Reveal enter="animate-in fade-in slide-in-from-left-5 duration-600 fill-mode-both" className="my-12">
            <blockquote className="border-l-4 border-primary/40 pl-6">
              <p className="font-aq-display text-xl leading-relaxed text-foreground/80 italic md:text-2xl">
                &quot;The gold is in the cracks. The extractive economy ends when enough people start asking what&apos;s
                actually in the glass.&quot;
              </p>
              <cite className="mt-3 block text-sm text-muted-foreground not-italic">— Tony &quot;WhyNot&quot; Greenberg</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Inspiration */}
      <section className="bg-muted/30 py-16">
        <div className="container max-w-3xl">
          <Reveal enter={FADE_UP}>
            <h2 className="mb-6 font-aq-display text-2xl font-bold md:text-3xl">The Spark</h2>
          </Reveal>
          <Reveal enter={FADE_UP} delay={0.1} className="space-y-5 leading-relaxed text-muted-foreground">
            <p className="text-lg">
              The philosophical DNA of this project draws from builders and thinkers who refuse to accept the world as
              given:{" "}
              <a
                href="https://www.thegreatsimplification.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Nate Hagens
              </a>{" "}
              on energy and ecology, Kate Raworth on doughnut economics, and the quiet conviction that conscious
              consumption isn&apos;t a lifestyle brand — it&apos;s a survival strategy.
            </p>
            <p className="text-lg">
              Water became the entry point because it&apos;s universal. Everyone drinks it. Almost nobody questions it.
              That gap between trust and truth is where Aqueous lives.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Ecosystem */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Reveal enter={FADE_UP}>
              <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">The Ecosystem</p>
            </Reveal>
            <Reveal enter={FADE_UP} delay={0.1}>
              <h2 className="mb-4 font-aq-display text-3xl font-bold md:text-4xl">Everything Connects</h2>
            </Reveal>
            <Reveal enter={FADE_UP} delay={0.2}>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Aqueous is one node in a larger network. Each project tackles a different dimension of the same
                question: how do we build systems worthy of the humans inside them?
              </p>
            </Reveal>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map((project, i) => (
              // was motion.a initial={{ opacity: 0, y: 20 }} whileInView transition={{ delay: i * 0.08, duration: 0.5 }};
              // the Reveal is the grid item and the card fills it (block h-full).
              <Reveal
                key={project.name}
                enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                delay={i * 0.08}
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Want to explore the full collection?</p>
            <Link
              href={aq("/directory")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Site Directory <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Connect */}
      <section className="bg-muted/30 py-16">
        <div className="container max-w-3xl text-center">
          <Reveal enter={FADE_UP}>
            <h2 className="mb-4 font-aq-display text-2xl font-bold md:text-3xl">Connect</h2>
          </Reveal>
          <Reveal enter={FADE_UP} delay={0.1}>
            <p className="mb-8 text-muted-foreground">
              The best conversations start with a question. The best partnerships start with shared values.
            </p>
          </Reveal>
          <Reveal enter={FADE_UP} delay={0.2} className="flex flex-wrap justify-center gap-4">
            <Link href="/essays" className={connectClass}>
              <Pen aria-hidden="true" className="size-4 text-primary" /> Read the Essays
            </Link>
            <a href="https://www.linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" className={connectClass}>
              <Globe aria-hidden="true" className="size-4 text-primary" /> LinkedIn
            </a>
            <a href="https://ramprate.com/about-tony-greenberg/" target="_blank" rel="noopener noreferrer" className={connectClass}>
              <Zap aria-hidden="true" className="size-4 text-primary" /> Full Bio at RampRate
            </a>
            <a href="mailto:t@ramprate.com" className={connectClass}>
              <Droplets aria-hidden="true" className="size-4 text-primary" /> t@ramprate.com
            </a>
          </Reveal>

          {/* Share */}
          <Reveal enter={FADE_UP} delay={0.3} className="mt-8">
            <ShareButton
              title="About Tony Greenberg & Aqueous"
              text="Meet the builder behind Aqueous — the world's first personalized water rating."
            />
          </Reveal>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
