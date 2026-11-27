import Image from "next/image";
import { Crown, Sparkles, Star } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { Reveal } from "@/components/liquidsun/motion";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/Altar.tsx (2026-11-21). Same three bottles, copy
// and layout; all three used the same bottle photo on the app, so they do here. framer-motion became
// CSS: the header rises 50px over 1s on load, each shrine scales in from 90% over 0.8s when it
// scrolls into view (-100px margin). The app's unused useScroll call is dropped. Each bottle's glow
// gradient is its full class string (Tailwind needs literal classes).

export const pinnacleBottles = [
  {
    id: "fuenteseca-21",
    name: "Fuenteseca Reserva",
    age: "21 Year Extra Añejo",
    price: "$1,200",
    description:
      "The oldest commercially available tequila. Aged in a blend of French Oak, American White Oak, and Canadian Rye barrels. A spirit that transcends time.",
    notes: ["Dried Apricot", "Sandalwood", "Dark Chocolate"],
    glow: "pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-amber-500/20 to-yellow-600/20 opacity-30 blur-[100px]",
  },
  {
    id: "tears-llorona",
    name: "Tears of Llorona",
    age: "Extra Añejo",
    price: "$280",
    description:
      "Master Distiller Germán González's masterpiece. Aged in Scotch, Sherry, and Brandy barrels. A symphony of complexity that rivals the world's finest cognacs.",
    notes: ["Sherry", "Caramelized Agave", "Black Cherry"],
    glow: "pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-red-900/20 to-amber-900/20 opacity-30 blur-[100px]",
  },
  {
    id: "rey-sol",
    name: "Rey Sol",
    age: "Extra Añejo",
    price: "$300",
    description:
      "Aged for 6 years in French Oak. The bottle was designed by famous Mexican artist Sergio Bustamante. Liquid sunshine in a bottle.",
    notes: ["Vanilla Bean", "Roasted Almond", "Oak Spice"],
    glow: "pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-yellow-400/20 to-orange-500/20 opacity-30 blur-[100px]",
  },
];

type Bottle = (typeof pinnacleBottles)[number];

function BottleShrine({ bottle, index }: { bottle: Bottle; index: number }) {
  const odd = index % 2 === 1;
  const image = liquidsunImages.bottleVolcanico;
  return (
    <Reveal
      enter="animate-in fade-in zoom-in-90 duration-800 fill-mode-both"
      className="relative flex flex-col items-center gap-12 md:flex-row md:gap-24"
    >
      {/* Sacred Geometry Background for Bottle */}
      <div className={bottle.glow} />

      {/* Bottle Image */}
      <div className={odd ? "relative z-10 flex w-full justify-center md:order-2 md:w-1/2" : "relative z-10 flex w-full justify-center md:w-1/2"}>
        <div className="group relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 opacity-0 blur-3xl transition-opacity duration-1000 group-hover:opacity-50" />
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            sizes="340px"
            alt={bottle.name}
            className="relative h-[600px] w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
          />

          {/* Floating Particles */}
          <div className="pointer-events-none absolute inset-0">
            <Sparkles aria-hidden="true" className="absolute top-10 left-10 size-4 animate-ping text-amber-200" />
            <Sparkles aria-hidden="true" className="absolute right-20 bottom-20 size-6 animate-pulse text-amber-400" />
          </div>
        </div>
      </div>

      {/* Bottle Info */}
      <div className={odd ? "z-10 w-full text-center md:order-1 md:w-1/2 md:text-right" : "z-10 w-full text-center md:w-1/2 md:text-left"}>
        <div className={odd ? "mb-4 flex items-center justify-center gap-3 md:justify-end" : "mb-4 flex items-center justify-center gap-3 md:justify-start"}>
          <Star aria-hidden="true" className="size-5 fill-amber-500 text-amber-500" />
          <span className="font-mono text-sm tracking-[0.2em] text-amber-500 uppercase">{bottle.age}</span>
        </div>

        <h2 className="mb-6 font-serif text-5xl leading-tight text-white md:text-7xl">{bottle.name}</h2>

        <p className="mb-8 font-serif text-2xl text-amber-200/80 italic">{bottle.price}</p>

        <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed font-light text-slate-300 md:mx-0">{bottle.description}</p>

        <div className={odd ? "flex flex-wrap justify-center gap-3 md:justify-end" : "flex flex-wrap justify-center gap-3 md:justify-start"}>
          {bottle.notes.map((note) => (
            <span
              key={note}
              className="cursor-default rounded-full border border-white/10 px-4 py-2 font-mono text-xs tracking-wider text-slate-400 uppercase transition-colors hover:border-amber-500/50 hover:text-amber-400"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function Altar() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      <AudioController />

      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.altarShrine.src} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pt-32 pb-20">
        <div className="mb-32 animate-in text-center duration-1000 fade-in fill-mode-both slide-in-from-bottom-[50px]">
          <div className="mb-6 flex justify-center">
            <Crown aria-hidden="true" className="size-12 animate-pulse text-amber-500" strokeWidth={1} />
          </div>
          <h1 className="mb-6 bg-linear-to-b from-amber-100 via-amber-400 to-amber-800 bg-clip-text font-serif text-6xl font-bold text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] md:text-9xl">
            The Altar
          </h1>
          <p className="mx-auto max-w-2xl font-serif text-xl font-light text-slate-400 italic md:text-2xl">
            &quot;Here lies the pinnacle of the spirit. Offerings to the gods of agave.&quot;
          </p>
        </div>

        <div className="mx-auto max-w-7xl space-y-40">
          {pinnacleBottles.map((bottle, index) => (
            <BottleShrine key={bottle.id} bottle={bottle} index={index} />
          ))}
        </div>

        <div className="mt-40 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-slate-500 uppercase">Only the worthy may drink</p>
        </div>
      </div>
    </div>
  );
}
