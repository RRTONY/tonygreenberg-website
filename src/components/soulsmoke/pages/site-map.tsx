import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Globe,
  Home,
  Leaf,
  Map,
  MapPin,
  Search,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Appendix.tsx (route /site-map). Same pages,
// copy and layout; the card wrapper's classes sit on the Link itself.

type PageInfo = {
  path: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: "journey" | "explore" | "reference";
};

export const siteMapPages: PageInfo[] = [
  // The Journey
  {
    path: "/",
    title: "Home",
    description: "The gateway to mezcal. Our manifesto: liquids that touch your mouth must touch your mind and heart.",
    icon: Home,
    category: "journey",
  },
  {
    path: "/evolution",
    title: "The Evolution",
    description: "From the 'worm era' to mezcal's rightful place alongside Cognac. A visual timeline of transformation.",
    icon: Clock,
    category: "journey",
  },
  {
    path: "/agave-encyclopedia",
    title: "The Agaves",
    description: "27 agave varieties explored. Filter by flavor, region, and rarity. The plants behind the spirit.",
    icon: Leaf,
    category: "journey",
  },
  {
    path: "/ancestral-process",
    title: "The Process",
    description: "Jima to bottle. The six sacred stages of ancestral mezcal production, told through scroll.",
    icon: Flame,
    category: "journey",
  },
  // Explore
  {
    path: "/scent-finder",
    title: "Find by Scent",
    description: "Reverse-engineer your perfect mezcal. Select aromas you love, discover the agave that creates them.",
    icon: Search,
    category: "explore",
  },
  {
    path: "/us-hunt",
    title: "The US Hunt",
    description: "Top 25 extraordinary mezcals available in the United States. Sorted by Value and Experience indices.",
    icon: MapPin,
    category: "explore",
  },
  {
    path: "/mexico-source",
    title: "The Mexico Source",
    description: "Top 25 wild, ancestral mezcals to seek in Mexico. The esoteric bottles worth the journey.",
    icon: Globe,
    category: "explore",
  },
  {
    path: "/fane-kantsini",
    title: "Fane Kantsini",
    description: "The matriarchs of mezcal. Sósima Olivera's story and the ancestral traditions of Santa María Ixcatlán.",
    icon: Users,
    category: "explore",
  },
  // Reference
  {
    path: "/library",
    title: "The Library",
    description: "Essential reading. The 10 books that will transform your understanding of mezcal.",
    icon: BookOpen,
    category: "reference",
  },
  {
    path: "/sacred-kitchens",
    title: "Sacred Kitchens",
    description: "Where to eat in Oaxaca. Origen, Alfonsina, Crudo, and the restaurants that honor the land.",
    icon: UtensilsCrossed,
    category: "reference",
  },
  {
    path: "/assholes",
    title: "The Assholes",
    description: "Celebrity cash grabs and additive-laden frauds. The brands that chose money over truth.",
    icon: AlertTriangle,
    category: "reference",
  },
];

const journeyPages = siteMapPages.filter((p) => p.category === "journey");
const explorePages = siteMapPages.filter((p) => p.category === "explore");
const referencePages = siteMapPages.filter((p) => p.category === "reference");

export function SoulsmokeSiteMap() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-earth py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Map aria-hidden="true" className="mx-auto mb-6 size-12 text-terracotta" />
            <h1 className="mb-4 font-display text-4xl md:text-6xl">Site Map</h1>
            <p className="font-body text-xl text-white/70">Your guide to everything within. 11 pages, one journey.</p>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 font-display text-3xl text-earth">The Journey</h2>
            <p className="mb-8 font-body text-earth/60">Start here. Follow the path from discovery to mastery.</p>

            <div className="space-y-4">
              {journeyPages.map((page, index) => (
                <Link
                  key={page.path}
                  href={ss(page.path)}
                  className="group flex cursor-pointer items-center gap-4 rounded-xl border border-earth/10 bg-white p-6 transition-all hover:border-terracotta/30 hover:shadow-lg"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                    <page.icon aria-hidden="true" className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-earth/40">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="font-heading text-xl text-earth transition-colors group-hover:text-terracotta">
                        {page.title}
                      </h3>
                    </div>
                    <p className="mt-1 font-body text-sm text-earth/60">{page.description}</p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-earth/30 transition-all group-hover:translate-x-1 group-hover:text-terracotta"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="bg-sage/10 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 font-display text-3xl text-earth">Explore</h2>
            <p className="mb-8 font-body text-earth/60">Dive deeper. Find your bottles, discover producers.</p>

            <div className="grid gap-4 md:grid-cols-2">
              {explorePages.map((page) => (
                <Link
                  key={page.path}
                  href={ss(page.path)}
                  className="group block h-full cursor-pointer rounded-xl border border-earth/10 bg-white p-6 transition-all hover:border-sage/50 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-colors group-hover:bg-sage group-hover:text-white">
                      <page.icon aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg text-earth transition-colors group-hover:text-sage">{page.title}</h3>
                  </div>
                  <p className="font-body text-sm text-earth/60">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reference */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 font-display text-3xl text-earth">Reference</h2>
            <p className="mb-8 font-body text-earth/60">The extras. Books, restaurants, and brands to avoid.</p>

            <div className="grid gap-4 md:grid-cols-3">
              {referencePages.map((page) => (
                <Link
                  key={page.path}
                  href={ss(page.path)}
                  className="group block h-full cursor-pointer rounded-xl border border-earth/10 bg-white p-6 transition-all hover:border-coral/30 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-coral/10 text-coral transition-colors group-hover:bg-coral group-hover:text-white">
                      <page.icon aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg text-earth transition-colors group-hover:text-coral">{page.title}</h3>
                  </div>
                  <p className="font-body text-sm text-earth/60">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-earth py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-display text-2xl">By the Numbers</h2>
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              <div>
                <div className="font-display text-4xl text-terracotta">11</div>
                <div className="font-body text-sm text-white/80">Pages</div>
              </div>
              <div>
                <div className="font-display text-4xl text-terracotta">27</div>
                <div className="font-body text-sm text-white/80">Agave Varieties</div>
              </div>
              <div>
                <div className="font-display text-4xl text-terracotta">50</div>
                <div className="font-body text-sm text-white/80">Mezcals Reviewed</div>
              </div>
              <div>
                <div className="font-display text-4xl text-terracotta">10</div>
                <div className="font-body text-sm text-white/80">Essential Books</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth/95 py-8 text-white/80">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-sm">&quot;Liquids that touch my mouth must touch my mind and touch my heart.&quot;</p>
          <p className="mt-2 font-mono text-xs text-white/40">MEZCAL — The Alchemy of Agave</p>
        </div>
      </footer>
    </div>
  );
}
