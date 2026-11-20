import { ExternalLink, MapPin } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";

// The region -> spots list shared by the LiquidSun app's USHunt.tsx and JaliscoSource.tsx (the app
// wrote it out twice). Each region fades up as it scrolls in (y 20, delay index * 0.1, once).
// Spots with a website show the external-link icon, as in the app; the app never linked the
// card itself, so neither does this.

export type Spot = { name: string; desc: string; location?: string; url?: string };
export type PlaceRegion = { region: string; spots: Spot[] };

export function PlacesList({ regions }: { regions: PlaceRegion[] }) {
  return (
    <div className="grid gap-12">
      {regions.map((region, index) => (
        <Reveal
          key={region.region}
          margin="0px"
          delay={index * 0.1}
          enter="animate-in fade-in fill-mode-both slide-in-from-bottom-5"
        >
          <h2 className="mb-6 inline-block border-b border-primary/30 pb-2 font-display text-2xl text-foreground">{region.region}</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {region.spots.map((spot) => (
              <div key={spot.name} className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">{spot.name}</h3>
                  {spot.url ? (
                    <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-primary" />
                  ) : (
                    <MapPin aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>

                {spot.location && <p className="mb-2 font-mono text-xs tracking-wider text-accent uppercase">{spot.location}</p>}

                <p className="text-sm leading-relaxed text-muted-foreground">{spot.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
