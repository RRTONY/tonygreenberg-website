import { Droplets, FlaskConical, Flame, Gem, Hourglass, Slice, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/pages/Process.tsx (2026-11-21). Same steps and copy.
// The app's emoji step icons (🔪 🔥 🪨 ⚗️ 💧 ⏳) are lucide icons at the same size and opacity
// (CONTRIBUTING rule 18). whileInView (y 20, delay index * 0.1, once) is a <Reveal>.
// The warning text used `text-destructive-foreground`, which this site's theme doesn't define;
// it is the app's value written out (#fee2e2).

type Step = { title: string; icon: LucideIcon; description: string; glitch: string };

export const steps: Step[] = [
  {
    title: "Harvest (Jima)",
    icon: Slice,
    description:
      "It starts with patience. The Blue Weber agave takes 7-10 years to mature. The Jimador uses a razor-sharp coa to slice away the spiky pencas, revealing the heart (piña). If you harvest too early, it's bitter. Too late, it rots. The timing is everything.",
    glitch:
      "The Glitch: Industrial brands harvest 3-year-old agaves and use acid hydrolysis to fake the sugar. We only drink mature agave.",
  },
  {
    title: "Cooking (Cocción)",
    icon: Flame,
    description:
      "The piñas are loaded into masonry ovens (hornos) or autoclaves. They are slow-roasted for 24-72 hours. This transforms the complex starches (inulin) into fermentable sugars. The air smells like roasted sweet potato and honey.",
    glitch:
      "The Glitch: Diffusers use high-pressure water and sulfuric acid to extract raw starch without cooking. It's efficient, soulless, and tastes like medicine.",
  },
  {
    title: "Extraction (Molienda)",
    icon: Gem,
    description:
      "The cooked agave must be crushed to release the juice (mosto). The most traditional method is the Tahona—a two-ton volcanic stone wheel pulled by a tractor (or mule). It gently crushes the fibers, keeping them intact for fermentation.",
    glitch: "The Glitch: The Tahona is incredibly inefficient. It loses 30% of the sugar. But that loss is where the flavor lives.",
  },
  {
    title: "Fermentation (Fermentación)",
    icon: FlaskConical,
    description:
      "The mosto (juice) and bagasso (fiber) are placed in open-air wooden vats. Wild airborne yeast or proprietary strains begin to eat the sugar and convert it into alcohol. This is where the magic happens. The weather, the wood, and the microscopic life of the distillery all contribute to the flavor.",
    glitch:
      "The Glitch: Industrial tequila uses closed stainless steel tanks and accelerators to finish in 12 hours. Real fermentation takes 3-5 days.",
  },
  {
    title: "Distillation (Destilación)",
    icon: Droplets,
    description:
      "The fermented wash is heated in copper pot stills. The alcohol vapor rises, condenses, and drips out as clear spirit. Tequila must be distilled twice. The first run is 'Ordinario'. The second run is 'Tequila'. The master distiller makes the 'cuts'—separating the heads and tails from the heart.",
    glitch:
      "The Glitch: Distilling to proof (40% ABV) is hard. Most brands distill to 55% and dilute with water. The best producers distill close to bottle strength to preserve texture.",
  },
  {
    title: "Aging (Maduración)",
    icon: Hourglass,
    description:
      "Blanco is bottled immediately (or rested up to 2 months). Reposado rests 2-12 months in oak. Añejo sleeps 1-3 years. Extra Añejo sleeps 3+ years. The wood adds vanilla, caramel, and spice, but it should never overpower the agave.",
    glitch:
      "The Glitch: Additives (abocantes) like caramel color and glycerin are legally allowed up to 1% to fake age and smoothness. We demand transparency.",
  },
];

export function Process() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Process</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Alchemy is not magic; it is a rigorous, inefficient, and beautiful conversation with nature.
          </p>
        </div>

        <div className="grid gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal
                key={step.title}
                margin="0px"
                delay={index * 0.1}
                enter="animate-in fade-in fill-mode-both slide-in-from-bottom-5"
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-colors hover:border-primary/50"
              >
                <div aria-hidden="true" className="absolute top-0 right-0 p-8 opacity-10 grayscale transition-opacity select-none group-hover:opacity-20">
                  <Icon className="size-32" strokeWidth={1} />
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-4">
                    <Icon aria-hidden="true" className="size-9 text-primary" />
                    <h2 className="font-display text-2xl text-foreground">{step.title}</h2>
                  </div>

                  <p className="mb-6 max-w-3xl leading-relaxed text-foreground/80">{step.description}</p>

                  <div className="rounded-r-md border-l-2 border-destructive/70 bg-background/50 p-4">
                    <p className="font-mono text-sm text-[#fee2e2]">
                      <span className="mr-2 font-bold uppercase">Warning:</span>
                      {step.glitch}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
