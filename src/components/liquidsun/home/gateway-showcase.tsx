import Link from "next/link";
import { ArrowRight, DoorOpen, ExternalLink, Shield, ShoppingCart, Star } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";
import { TierBadge } from "@/components/liquidsun/badges";
import { Button } from "@/components/liquidsun/ui";
import { getCheapestBuyLink, getGateway, type Producer } from "@/lib/content/liquidsun/producers";
import { ls } from "@/lib/content/liquidsun/nav";

// Ported from the LiquidSun app's client/src/components/GatewayShowcase.tsx (2026-11-21). As on the
// app, the Gateway bottles show their price and buy link to everyone (only the editorial collection
// above is gated). whileInView reveals: header 30px over 0.6s, each card 30px over 0.5s with a
// 0.05s stagger, the closing link fades in. The CTA was a window.location button; now a Link.

function GatewayCard({ producer, index }: { producer: Producer; index: number }) {
  const cheapest = getCheapestBuyLink(producer);

  return (
    <Reveal
      margin="0px"
      delay={index * 0.05}
      enter="animate-in fade-in slide-in-from-bottom-[30px] duration-500 fill-mode-both"
      className="group rounded-xl border border-white/5 bg-white/2 p-5 transition-all duration-500 hover:border-emerald-500/20 hover:bg-emerald-500/2"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-serif text-lg text-white transition-colors group-hover:text-amber-400">{producer.brand}</h4>
          <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">
            NOM {producer.nom} • {producer.region}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {producer.panelScore > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-1 font-mono text-[10px] text-amber-400">
              <Star aria-hidden="true" className="size-3" />
              {producer.panelScore}
            </span>
          )}
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-sm leading-relaxed font-light text-slate-400">{producer.description}</p>

      <div className="mb-4 flex flex-wrap gap-1">
        {producer.flavorNotes.slice(0, 4).map((note) => (
          <span key={note} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-500">
            {note}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          {producer.additiveFree && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
              <Shield aria-hidden="true" className="size-3" />
              Clean
            </span>
          )}
        </div>
        {cheapest ? (
          <a
            href={cheapest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-sm bg-amber-600/80 px-3 py-1.5 font-mono text-[10px] tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500"
          >
            <ShoppingCart aria-hidden="true" className="size-3" />${cheapest.price.toFixed(0)}
            <ExternalLink aria-hidden="true" className="size-2.5 opacity-60" />
          </a>
        ) : (
          <span className="font-mono text-xs text-slate-600">Check local stores</span>
        )}
      </div>
    </Reveal>
  );
}

export function GatewayShowcase() {
  const gatewayBottles = getGateway();

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="container mx-auto max-w-7xl">
        <Reveal
          margin="0px"
          enter="animate-in fade-in slide-in-from-bottom-[30px] duration-600 fill-mode-both"
          className="mb-16 flex flex-col items-end justify-between gap-8 border-b border-white/10 pb-8 md:flex-row"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <DoorOpen aria-hidden="true" className="size-5 text-emerald-400" />
              <h2 className="font-mono text-xs tracking-[0.4em] text-emerald-400 uppercase">The Gateway</h2>
            </div>
            <h3 className="mb-4 font-serif text-4xl text-amber-50 md:text-6xl">Start Here</h3>
            <p className="max-w-xl font-serif text-lg font-light text-slate-400 italic">
              Additive-free daily drivers. $14 to $65. Every one of these bottles punches above its weight.
            </p>
          </div>
          <TierBadge tier="Gateway" size="md" />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gatewayBottles.map((producer, index) => (
            <GatewayCard key={producer.id} producer={producer} index={index} />
          ))}
        </div>

        <Reveal margin="0px" enter="animate-in fade-in duration-300 fill-mode-both" className="mt-16 text-center">
          <Button
            asChild
            variant="link"
            className="group font-mono text-sm tracking-widest text-amber-400 uppercase hover:text-amber-300"
          >
            <Link href={ls("/quadrant")}>
              Explore All Bottles on the Flavor Matrix
              <ArrowRight aria-hidden="true" className="ml-2 size-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
