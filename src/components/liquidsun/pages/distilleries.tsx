import Image from "next/image";
import { Factory, MapPin, User } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";
import { producers } from "@/lib/content/liquidsun/producers";

// Ported from the LiquidSun app's client/src/pages/Distilleries.tsx (route /distilleries, H1
// "The Sources", 2026-11-21). One card per NOM, same copy and classes; each fades up as it
// scrolls in (y 30, 0.5s, once). Images are the rescued Sanity copies (next/image).

/** One producer per NOM, first one wins, as in the app. */
export const uniqueDistilleries = Array.from(new Set(producers.map((p) => p.nom))).map(
  (nom) => producers.find((p) => p.nom === nom)!,
);

export function Distilleries() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Sources</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            The physical places where alchemy happens. These are not factories; they are temples of agave.
          </p>
        </div>

        <div className="space-y-12">
          {uniqueDistilleries.map((distillery) => (
            <Reveal
              key={distillery.nom}
              margin="0px"
              enter="animate-in duration-500 fade-in fill-mode-both slide-in-from-bottom-[30px]"
              className="flex flex-col items-center gap-8 rounded-lg border border-border bg-card/30 p-6 transition-colors hover:border-primary/30 md:flex-row md:p-8"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border/50 md:w-1/3">
                <Image
                  src={distillery.image.src}
                  alt={`Distillery for NOM ${distillery.nom}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              </div>

              <div className="w-full space-y-4 md:w-2/3">
                <div className="flex items-baseline justify-between border-b border-border pb-2">
                  <h2 className="font-display text-2xl text-foreground">NOM {distillery.nom}</h2>
                  <span className="font-mono text-sm text-primary">{distillery.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User aria-hidden="true" className="size-3.5 text-accent" />
                    <span>{distillery.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Factory aria-hidden="true" className="size-3.5 text-accent" />
                    <span>{distillery.cooking}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-3.5 text-accent" />
                    <span>{distillery.region}</span>
                  </div>
                </div>

                <p className="leading-relaxed text-foreground/80">{distillery.description}</p>

                <div className="mt-4 border-l-2 border-primary bg-background/50 p-4">
                  <p className="text-sm text-muted-foreground italic">&quot;{distillery.soul}&quot;</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
