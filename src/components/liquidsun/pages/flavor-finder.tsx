"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Droplets, Mountain, RotateCw, Wind, Zap, type LucideIcon } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { usePresenceSwap } from "@/components/liquidsun/motion";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/FlavorFinder.tsx ("The Compass", 2026-11-21).
// Same profiles, copy and wheel. framer-motion became CSS:
// - The wheel's spring rotation (stiffness 50, damping 20) is a 1s transform transition with an
//   overshooting curve; the angle is the one runtime style.
// - The centre button's whileHover 1.1 / whileTap 0.9 are hover:scale-110 / active:scale-90.
// - The profile card's AnimatePresence swap (x 50 in, x -50 out, 0.3s) is usePresenceSwap.
// - The heading drops in 20px on load.
// Fixed from live (rule 20): on phones the card sat at -10% right of a 300px wheel, off the edge of
// the screen and over the wheel; below md it now sits under the wheel. From md up it is placed as
// on the app.

type Profile = {
  id: string;
  region: string;
  notes: string[];
  description: string;
  bottles: string[];
  /** The icon bubble's classes (the app's `color` on a white/5 circle). */
  iconClass: string;
  icon: LucideIcon;
};

export const flavorProfiles: Profile[] = [
  {
    id: "highlands-floral",
    region: "Highlands",
    notes: ["White Flower", "Citrus Peel", "Green Apple"],
    description:
      "The high altitude stress creates smaller agaves with concentrated sugars, resulting in floral, fruity, and feminine profiles.",
    bottles: ["G4 Blanco", "Siete Leguas", "Ocho Plata"],
    iconClass: "rounded-full bg-white/5 p-2 text-amber-300",
    icon: Wind,
  },
  {
    id: "highlands-mineral",
    region: "Highlands",
    notes: ["Wet Cement", "Rainwater", "Slate"],
    description: "Grown in iron-rich red clay soil, these tequilas carry a distinct mineral backbone that speaks of the earth.",
    bottles: ["El Tesoro", "Tapatio", "Don Fulano"],
    iconClass: "rounded-full bg-white/5 p-2 text-slate-300",
    icon: Mountain,
  },
  {
    id: "valley-earthy",
    region: "Valley",
    notes: ["Black Pepper", "Olive Brine", "Damp Earth"],
    description: "The volcanic soil of the valley produces masculine, spicy, and earthy spirits with a heavy mouthfeel.",
    bottles: ["Fortaleza", "Cascahuín", "Arette"],
    iconClass: "rounded-full bg-white/5 p-2 text-green-700",
    icon: Droplets,
  },
  {
    id: "valley-herbal",
    region: "Valley",
    notes: ["Mint", "Basil", "Jalapeño"],
    description: "Vegetal and herbaceous, these spirits capture the raw essence of the plant before it was tamed.",
    bottles: ["Siembra Valles", "Gran Dovejo", "Volans"],
    iconClass: "rounded-full bg-white/5 p-2 text-emerald-500",
    icon: Zap,
  },
];

export function FlavorFinder() {
  const [rotation, setRotation] = useState(0);
  const [activeProfile, setActiveProfile] = useState(flavorProfiles[0]);
  const { shown, leaving } = usePresenceSwap(activeProfile, 300);

  const rotateWheel = () => {
    const newRotation = rotation + 90;
    setRotation(newRotation);
    setActiveProfile(flavorProfiles[(newRotation / 90) % 4]);
  };

  const Icon = shown.icon;

  return (
    <div className="min-h-screen overflow-hidden bg-black font-sans text-white">
      <AudioController />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.agaveFieldMoon.src} alt="" fill sizes="100vw" className="object-cover opacity-20 blur-sm" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24 md:h-screen md:py-0">
        <div className="mb-12 animate-in text-center duration-500 fade-in fill-mode-both slide-in-from-top-5">
          <h1 className="mb-4 font-serif text-4xl text-amber-50 md:text-6xl">The Compass</h1>
          <p className="font-serif font-light text-slate-400 italic">Spin the wheel to align your palate with the terroir.</p>
        </div>

        <div className="relative flex flex-col items-center md:size-[500px]">
          <div className="relative flex size-[300px] items-center justify-center md:size-[500px]">
            {/* The Wheel */}
            <div
              data-testid="compass-wheel"
              // The wheel's angle changes on every spin: the one runtime style.
              style={{ transform: `rotate(${rotation}deg)` }}
              className="absolute inset-0 rounded-full border border-white/10 bg-black/40 shadow-[0_0_50px_rgba(245,158,11,0.1)] backdrop-blur-md transition-transform duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
            >
              {/* Quadrant Lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-px w-full bg-white/10" />
                <div className="absolute h-full w-px bg-white/10" />
              </div>

              {/* Labels */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-amber-500 uppercase">Highlands</div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-emerald-500 uppercase">Valley</div>
              <div className="absolute top-1/2 left-6 -translate-y-1/2 -rotate-90 font-mono text-xs tracking-widest text-slate-500 uppercase">Mineral</div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 rotate-90 font-mono text-xs tracking-widest text-amber-200 uppercase">Floral</div>
            </div>

            {/* Center Button */}
            <button
              type="button"
              onClick={rotateWheel}
              aria-label="Spin the wheel"
              className="group relative z-20 flex size-24 items-center justify-center rounded-full bg-amber-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-[color,background-color,scale] duration-300 hover:scale-110 hover:bg-amber-400 active:scale-90"
            >
              <RotateCw aria-hidden="true" className="size-8 transition-transform duration-500 group-hover:rotate-180" />
            </button>
          </div>

          {/* Active Profile Card */}
          <div
            key={shown.id}
            aria-live="polite"
            className={
              leaving
                ? "mt-8 w-64 animate-out rounded-xl border border-white/10 bg-black/80 p-6 shadow-2xl backdrop-blur-xl duration-300 fade-out fill-mode-forwards slide-out-to-left-[50px] md:absolute md:top-1/2 md:-right-[40%] md:mt-0 md:w-80 md:-translate-y-1/2"
                : "mt-8 w-64 animate-in rounded-xl border border-white/10 bg-black/80 p-6 shadow-2xl backdrop-blur-xl duration-300 fade-in fill-mode-both slide-in-from-right-[50px] md:absolute md:top-1/2 md:-right-[40%] md:mt-0 md:w-80 md:-translate-y-1/2"
            }
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={shown.iconClass}>
                <Icon aria-hidden="true" className="size-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-white">{shown.region}</h2>
                <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">Terroir Profile</p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {shown.notes.map((note) => (
                <span key={note} className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-300 uppercase">
                  {note}
                </span>
              ))}
            </div>

            <p className="mb-6 text-sm leading-relaxed font-light text-slate-400">{shown.description}</p>

            <div className="space-y-2">
              <p className="mb-2 font-mono text-xs tracking-widest text-amber-500 uppercase">Recommended</p>
              {shown.bottles.map((bottle) => (
                <div key={bottle} className="flex items-center justify-between border-b border-white/5 pb-1 text-sm text-white">
                  <span>{bottle}</span>
                  <ArrowRight aria-hidden="true" className="size-3 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
