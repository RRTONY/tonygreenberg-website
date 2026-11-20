"use client";

import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { BottleThumb } from "@/components/liquidsun/flavor-matrix/components/bottle-thumb";
import { usePresence } from "@/components/liquidsun/flavor-matrix/components/modal-shell";
import { isRare, quadrants, toPercent, type Bottle, type BottleType } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";
import { getCheapestBuyLink, getProducerById } from "@/lib/content/liquidsun/producers";

// The Flavor Matrix scatter plot, ported from the app's FlavorMatrix.tsx "matrix" view.
// Motion, as in the app:
// - dots grow in from scale 0 with a springy overshoot (spring stiffness 200, damping 20 ->
//   cubic-bezier(0.34,1.56,0.64,1)); on a tab change the old dots shrink out first
//   (AnimatePresence popLayout -> `leaving` from the parent, 200ms).
// - the "You Are Here" pin grows in and glides to each new quiz position (CSS transition on
//   left/bottom), its dot pulses.
// - the hover card fades and rises in (opacity 0, y 10, scale 0.95 -> 1) and out again.
// Dot and pin positions are the bottles' own coordinates, the one place inline style is used.
// Added (rule 20): dots are buttons, so the card also opens on keyboard focus and on tap, and
// it opens to the left / below when a dot sits near the right / top edge instead of being cut off.

export function MatrixView({
  tab,
  bottles,
  leaving,
  hovered,
  setHovered,
  userCoordinates,
}: {
  tab: BottleType;
  bottles: Bottle[];
  leaving: boolean;
  hovered: Bottle | null;
  setHovered: (bottle: Bottle | null) => void;
  userCoordinates: { x: number; y: number } | null;
}) {
  const currentQuadrants = quadrants[tab];
  const card = usePresence(hovered);

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/30 backdrop-blur-sm md:aspect-video">
      {/* AXIS LABELS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-4 left-8 font-mono text-[10px] text-slate-500 uppercase">Valley (Earth/Mineral)</div>
        <div className="absolute right-8 bottom-4 font-mono text-[10px] text-slate-500 uppercase">Highlands (Fruit/Floral)</div>
        <div className="absolute top-8 left-4 origin-left -rotate-90 font-mono text-[10px] text-slate-500 uppercase">Rich / Complex</div>
        <div className="absolute bottom-8 left-4 origin-left -rotate-90 font-mono text-[10px] text-slate-500 uppercase">Light / Crisp</div>
      </div>

      {/* GRID LINES */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-px w-full bg-amber-500" />
        <div className="absolute h-full w-px bg-amber-500" />
      </div>

      {/* QUADRANT LABELS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-8 left-8 font-serif text-2xl font-bold text-white/5">{currentQuadrants.tl}</div>
        <div className="absolute top-8 right-8 text-right font-serif text-2xl font-bold text-white/5">{currentQuadrants.tr}</div>
        <div className="absolute bottom-8 left-8 font-serif text-2xl font-bold text-white/5">{currentQuadrants.bl}</div>
        <div className="absolute right-8 bottom-8 text-right font-serif text-2xl font-bold text-white/5">{currentQuadrants.br}</div>
      </div>

      {/* SCATTER PLOT */}
      <div className="absolute inset-12">
        {userCoordinates && (
          <div
            data-testid="ls-user-pin"
            className="absolute z-20 -mb-3 -ml-3 size-6 animate-in transition-[left,bottom] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fade-in zoom-in-0"
            style={{ left: `${toPercent(userCoordinates.x)}%`, bottom: `${toPercent(userCoordinates.y)}%` }}
          >
            <div className="size-full animate-pulse rounded-full border-2 border-white bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-[10px] font-bold tracking-widest whitespace-nowrap text-amber-500 uppercase">
              You Are Here
            </div>
          </div>
        )}

        {bottles.map((bottle) => {
          const active = hovered?.id === bottle.id;
          return (
            <button
              key={bottle.id}
              type="button"
              aria-label={`${bottle.brand} ${bottle.expression}, ${bottle.rarity}, $${bottle.price}`}
              aria-pressed={active}
              className={
                leaving
                  ? "absolute z-10 -mb-2 -ml-2 size-4 animate-out cursor-pointer duration-200 fade-out fill-mode-forwards zoom-out-0"
                  : "absolute z-10 -mb-2 -ml-2 size-4 animate-in cursor-pointer duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fade-in zoom-in-0"
              }
              style={{ left: `${toPercent(bottle.x)}%`, bottom: `${toPercent(bottle.y)}%` }}
              onMouseEnter={() => setHovered(bottle)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(bottle)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered(active ? null : bottle)}
            >
              <span
                className={
                  active
                    ? "relative block size-full scale-150 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all duration-300"
                    : "relative block size-full rounded-full border-2 border-amber-500/50 bg-slate-900 transition-all duration-300 hover:border-amber-500"
                }
              >
                {/* Pulse Effect for Unicorns/Rare */}
                {isRare(bottle) && <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/50" />}
              </span>

              {/* LABEL */}
              <span
                aria-hidden="true"
                className={
                  active
                    ? "absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase opacity-0 transition-opacity duration-300"
                    : "absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider whitespace-nowrap text-slate-400 uppercase opacity-60 transition-opacity duration-300"
                }
              >
                {bottle.brand}
              </span>
            </button>
          );
        })}
      </div>

      {/* HOVER CARD */}
      {card.item && <HoverCard bottle={card.item} open={card.open} />}
    </div>
  );
}

function HoverCard({ bottle, open }: { bottle: Bottle; open: boolean }) {
  const x = toPercent(bottle.x);
  const y = toPercent(bottle.y);
  const flipX = x > 55;
  const flipY = y > 60;
  const prod = bottle.producerId ? getProducerById(bottle.producerId) : null;
  const link = prod ? getCheapestBuyLink(prod) : null;
  // Where the card sits: beside the dot (the app: 20px right of and above it), flipped near an edge.
  const position = {
    ...(flipX ? { right: `${100 - x}%` } : { left: `${x}%` }),
    ...(flipY ? { top: `${100 - y}%` } : { bottom: `${y}%` }),
  };
  const offset = flipX ? (flipY ? "mt-5 mr-5" : "mr-5 mb-5") : flipY ? "mt-5 ml-5" : "mb-5 ml-5";

  return (
    <div
      data-testid="ls-hover-card"
      className={
        open
          ? "pointer-events-none absolute z-50 animate-in duration-200 fade-in zoom-in-95 slide-in-from-bottom-2.5"
          : "pointer-events-none absolute z-50 animate-out duration-200 fade-out fill-mode-forwards zoom-out-95 slide-out-to-bottom-2.5"
      }
      style={position}
    >
      <div className={offset}>
      <div className="w-64 rounded-xl border border-amber-500/30 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex gap-4">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-black/50">
            <BottleThumb bottle={bottle} sizes="64px" imageClassName="object-cover opacity-90" />
          </div>
          <div>
            <h3 className="mb-1 font-serif text-lg leading-none text-white">{bottle.brand}</h3>
            <p className="mb-2 text-xs text-slate-400">{bottle.expression}</p>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <Star aria-hidden="true" className="size-3 fill-current" />
              {bottle.rarity}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {bottle.notes.split(", ").map((note) => (
              <span key={note} className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300">
                {note}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="font-mono text-lg text-white">${bottle.price}</span>
            {link ? (
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                Buy at {link.retailer} <ExternalLink aria-hidden="true" className="size-3" />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                Click to Buy <ArrowRight aria-hidden="true" className="size-3" />
              </span>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
