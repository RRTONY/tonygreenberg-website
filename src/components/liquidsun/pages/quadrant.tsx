import Image from "next/image";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { FlavorMatrix } from "@/components/liquidsun/flavor-matrix/flavor-matrix";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/Quadrant.tsx (2026-11-21). Same heading, copy
// and background (next/image, same opacity and grayscale); the matrix is FlavorMatrix.
export function Quadrant() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <AudioController />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.tahonaMill.src} alt="" fill priority sizes="100vw" className="object-cover opacity-20 grayscale" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/95 to-slate-950" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
            The Flavor Matrix
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light tracking-wide text-amber-200/60">
            Map your palate. Find your soul.
            <br />
            <span className="mt-2 block text-xs tracking-widest text-slate-500 uppercase">
              X-Axis: Terroir (Valley vs. Highlands) • Y-Axis: Intensity (Light vs. Rich)
            </span>
          </p>
        </div>

        <FlavorMatrix />
      </div>
    </div>
  );
}
