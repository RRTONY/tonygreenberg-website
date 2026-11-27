import Link from "next/link";
import { Droplets } from "lucide-react";
import { aq } from "@/lib/content/aqueous/nav";

// The Aqueous app's Footer (client/src/components/Footer.tsx), same copy and classes; internal links
// go through aq(). Removed (no Manus links on this site, CONTRIBUTING rule 12): "The Way Out"
// (thewayout-fciushx2.manus.space, no other home yet). Removed: "fauxTony (AI Avatar)", the chatbot
// the owner cancelled (Phase 10; its buttons came off the site on 2026-10-09). "Tony Greenberg" now
// links within this site.

const exploreLinks = [
  { href: "/explore", label: "Water Explorer" },
  { href: "/tap-water", label: "Tap Water Lookup" },
  { href: "/compare", label: "Compare Waters" },
  { href: "/wall-of-shame", label: "Wall of Shame" },
  { href: "/filter-guide", label: "Filter Guide" },
  { href: "/pricing", label: "Pricing" },
  { href: "/directory", label: "Site Directory" },
];

const learnLinks = [
  { href: "/manifesto", label: "The Manifesto" },
  { href: "/landscape", label: "Collective Map" },
  { href: "/gem-spark", label: "The Gem Spark" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/methodology", label: "QPR Methodology" },
  { href: "/integrity", label: "Integrity Protocol" },
];

const dataLinks = [
  { href: "https://ramprate.com", label: "RampRate" },
  { href: "https://impactsoul.is", label: "ImpactSoul" },
  { href: "https://joyandwoe.com", label: "Joy and Woe" },
  { href: "https://www.epa.gov/DWdata", label: "EPA SDWIS" },
  { href: "https://www.ewg.org/tapwater/", label: "EWG Tap Water Database" },
  { href: "https://api.waterdata.usgs.gov/docs/", label: "USGS Water APIs" },
  { href: "https://www.waterqualitydata.us/", label: "Water Quality Portal" },
];

const linkClass = "text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors";

export function AqueousFooter() {
  return (
    <footer className="relative bg-primary text-primary-foreground">
      {/* Wave divider at top */}
      <div className="absolute -top-12 left-0 right-0 h-12 overflow-hidden">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 48L60 42C120 36 240 24 360 18C480 12 600 12 720 18C840 24 960 36 1080 38C1200 40 1320 32 1380 28L1440 24V48H1380C1320 48 1200 48 1080 48C960 48 840 48 720 48C600 48 480 48 360 48C240 48 120 48 60 48H0Z"
            className="fill-primary"
          />
        </svg>
      </div>

      <div className="container py-16 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <Droplets aria-hidden="true" className="w-4 h-4" />
              </div>
              <span className="font-aq-display text-lg font-semibold">Aqueous</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-3">
              100% open source. Built to empower conscious water choices through radical transparency and the QPR engine.
            </p>
            <p className="text-xs text-primary-foreground/50 leading-relaxed">
              Founded by{" "}
              <Link href="/" className="text-primary-foreground/70 hover:text-primary-foreground underline">
                Tony Greenberg
              </Link>{" "}
              — author of <em>&quot;Boiling the Human&quot;</em> (presented alongside Kurzweil at the H+ Summit, Harvard 2010), serial
              entrepreneur, and advocate for conscious consumption.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/50">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {exploreLinks.map((l) => (
                <Link key={l.href} href={aq(l.href)} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/50">Learn</h4>
            <div className="flex flex-col gap-2.5">
              {learnLinks.map((l) => (
                <Link key={l.href} href={aq(l.href)} className={linkClass}>
                  {l.label}
                </Link>
              ))}
              <a href="https://www.thegreatsimplification.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                The Great Simplification
              </a>
              <Link href={aq("/about")} className={linkClass}>
                About Tony
              </Link>
            </div>
          </div>

          {/* Open Data Sources */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/50">Ecosystem &amp; Data</h4>
            <div className="flex flex-col gap-2.5">
              {dataLinks.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">
            All water quality data sourced from publicly available, open-source databases. No proprietary data used. This site is a
            mirror of everything.
          </p>
          <p className="text-xs text-primary-foreground/50">Crafted for the era of conscious consumption. Spend less. Live more.</p>
        </div>
      </div>
    </footer>
  );
}
