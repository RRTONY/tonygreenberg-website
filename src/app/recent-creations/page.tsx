import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Zap,
  BookOpen,
  Shield,
  Wine,
  Droplets,
  Heart,
  Briefcase,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

// Ported from legacy client/src/pages/Portfolio.tsx ("Built by Tony G").
// Real content kept as-is. Per-card accent colors are genuinely dynamic
// (11 different hex values from data) — the one documented exception to
// the no-inline-style rule, since Tailwind can't express an arbitrary
// runtime color as a static class. Two link fixes: "/" meant the old
// homepage (now "/the-letter"); "Homeaglow Exposed" pointed at a dead
// internal route (`/homeaglow-the-anatomy-of-a-consumer-fraud`, which
// doesn't exist anywhere) instead of the real external site already used
// consistently elsewhere on this site (homeaglowexposed.com).

export const metadata: Metadata = {
  title: "Built by Tony G",
  description: "A living portfolio of digital creation. Eleven sites, eleven ideas that needed a home.",
  alternates: { canonical: "/recent-creations" },
};

type Project = {
  title: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  accent: string;
  icon: LucideIcon;
};

const PROJECTS: Project[] = [
  {
    title: "Human OS V2.0",
    tagline: "Are you a Maximizer or a Satisficer?",
    description: "An interactive diagnostic that maps your decision-making operating system. Take the quiz, get your profile, understand how you process the world.",
    url: "/humanos",
    category: "Interactive Diagnostic",
    accent: "#059669",
    icon: Gamepad2,
  },
  {
    title: "Find Your Team (The Flow Circuit)",
    tagline: "Team performance, decoded.",
    description: "A framework for understanding how high-performing teams actually work. Maps the invisible circuitry of collaboration, conflict, and creative output.",
    url: "/flow-circuit",
    category: "Find Your ___ Ecosystem",
    accent: "#4A90D9",
    icon: Zap,
  },
  {
    title: "The Gem Spark",
    tagline: "When serendipity meets synchronicity.",
    description: "A long-form narrative essay exploring the intersection of chance encounters and meaningful coincidence. The kind of piece that makes you reconsider every accident in your life.",
    url: "https://serensynch-2agjfwhe.manus.space",
    category: "Narrative Essay",
    accent: "#D97706",
    icon: BookOpen,
  },
  {
    // Note: legacy source also pointed this at /humanos, same as the Human OS
    // card above — likely a copy-paste bug (this describes Web3 adoption
    // infrastructure, an unrelated product), but there's no confirmed correct
    // destination anywhere else in the codebase, so ported as-is rather than
    // guessed. Worth a content-team check.
    title: "FusionRamp / STRATUM",
    tagline: "The Alloy of Vision and Velocity.",
    description: "Web3 adoption infrastructure — bridging the gap between blockchain's promise and enterprise reality. Built to accelerate the transition from proof-of-concept to production.",
    url: "/humanos",
    category: "Web3 Infrastructure",
    accent: "#DC2626",
    icon: Globe,
  },
  {
    title: "Homeaglow Exposed",
    tagline: "When the cleaning service gets dirty.",
    description: "A consumer crusade documenting deceptive practices in the home cleaning industry. Investigative journalism meets personal advocacy.",
    url: "https://homeaglowexposed.com",
    category: "Consumer Crusade",
    accent: "#B91C1C",
    icon: Shield,
  },
  {
    title: "SoulSmoke",
    tagline: "The Alchemy of Agave.",
    description: "A deep dive into mezcal — not the drink, the culture. From the jimador's machete to the copper still, from the terroir of Oaxaca to the ritual of the copita.",
    url: "https://mezcalagave-ahru9fq8.manus.space",
    category: "Agave Education",
    accent: "#92400E",
    icon: Wine,
  },
  {
    title: "LiquidSun",
    tagline: "Tequila, illuminated.",
    description: "A visual guide to tequila that treats the spirit with the reverence it deserves. From highland agave fields to the barrel. Not a buying guide. A love letter.",
    url: "https://tequilaazul-fxqrr3js.manus.space",
    category: "Tequila Guide",
    accent: "#B45309",
    icon: Wine,
  },
  {
    title: "Aqueous",
    tagline: "Know what flows through your life.",
    description: "The world's first personalized water rating. The AWI scores every bottled water on Quality, Purity, and Resonance — weighted to your priorities. Tap water lookup, Wall of Shame, and a filter guide that actually helps.",
    url: "https://aqwaterqpr-wvzsc3ph.manus.space",
    category: "Water Intelligence",
    accent: "#0369A1",
    icon: Droplets,
  },
  {
    title: "Regenerative Protocol",
    tagline: "The body knows how to heal. You just forgot.",
    description: "A restricted-access portal for regenerative health protocols — biohacking meets ancient wisdom. Serious science behind a password.",
    url: "https://regenhealth-4nns6jnd.manus.space",
    category: "Regenerative Health",
    accent: "#047857",
    icon: Heart,
  },
  {
    title: "Vancefolio",
    tagline: "Family office intelligence, enforced.",
    description: "A password-protected portfolio enforcement dashboard built for a family office. Tiered access controls, session management, and confidential analytics.",
    url: "https://portfoliofamilyoffice.manus.space",
    category: "Family Office / DD",
    accent: "#7C3AED",
    icon: Briefcase,
  },
  {
    title: "Intimacy Intelligence (UIIA)",
    tagline: "The science of sacred partnership.",
    description: "A 15-question assessment mapping your intimacy intelligence across five dimensions — presence, vulnerability, attunement, repair, and sacred play. Built from the research behind Love as Dharma.",
    url: "https://intimacyassess-tcir3hon.manus.space",
    category: "Relationship Assessment",
    accent: "#C4536A",
    icon: Heart,
  },
];

export default function RecentCreationsPage() {
  return (
    <div>
      <div className="border-b border-border bg-muted/30 px-8 pt-12 pb-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/the-letter" className="font-mono text-xs tracking-wide text-brand-gold uppercase">
            ← Back to The Broadsheet
          </Link>
          <h1 className="mt-6 mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Built by Tony G
          </h1>
          <p className="mb-5 max-w-lg text-lg text-muted-foreground">
            Eleven ideas that needed a home. Each one built in days, not months. Click any card to
            explore.
          </p>
          <div className="max-w-lg rounded-xl border border-brand-gold/15 bg-brand-gold/5 p-6 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-brand-gold">What you&apos;re looking at:</strong> A living
              portfolio of digital products Tony has designed and shipped — interactive
              diagnostics, educational platforms, consumer investigations, and intelligence
              engines. Each one is a standalone site you can use right now.
            </p>
            <p className="mb-2">
              <strong className="text-brand-gold">Why it matters:</strong> These aren&apos;t
              mockups or pitch decks. Every card links to a working product. They demonstrate a
              specific thesis: that meaningful software can be built in days when the thinking has
              been done in decades.
            </p>
            <p>
              <strong className="text-brand-gold">What to do:</strong> Click any card to open the
              live site. Categories range from health diagnostics to agave education to consumer
              advocacy. Start with whatever catches your eye.
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            const isExternal = project.url.startsWith("http");
            const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Link
                key={project.title}
                href={project.url}
                {...linkProps}
                className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div
                  className="flex items-center justify-between border-b border-border p-4"
                  style={{ background: `linear-gradient(135deg, ${project.accent}14 0%, transparent 100%)` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-8 items-center justify-center rounded-md"
                      style={{ background: `${project.accent}22` }}
                    >
                      <Icon size={16} style={{ color: project.accent }} />
                    </div>
                    <span
                      className="font-mono text-xs tracking-wide uppercase"
                      style={{ color: project.accent }}
                    >
                      {project.category}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="opacity-30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    style={{ color: project.accent }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1.5 font-heading text-xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mb-3 font-mono text-xs" style={{ color: project.accent }}>
                    {project.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div
                    className="mt-4 flex items-center gap-1.5 font-mono text-xs tracking-wide opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: project.accent }}
                  >
                    VISIT SITE <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-8 py-10 text-center">
        <p className="mx-auto mb-4 max-w-md font-heading text-lg text-foreground">
          &ldquo;The best way to understand someone is to see what they build.&rdquo;
        </p>
        <Link
          href="/the-letter"
          className="inline-block rounded-md bg-brand-gold px-6 py-2.5 font-mono text-xs tracking-wide text-white uppercase transition-transform hover:scale-105"
        >
          Back to The Broadsheet
        </Link>
      </div>
    </div>
  );
}
