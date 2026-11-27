import { Reveal } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/pages/Evolution.tsx (2026-11-21). Same timeline, copy
// and classes. framer-motion's whileInView (x -50 / +50 alternating, 0.5s, once) is a <Reveal> with
// tw-animate's slide-in-from-left/right-[50px].

export const timeline = [
  {
    year: "1000 BC",
    title: "The Sacred Plant",
    description:
      "Indigenous peoples of Mexico ferment agave sap into Pulque. It is a drink for priests and sacrificial victims. The plant is a gift from the gods.",
  },
  {
    year: "1500s",
    title: "The Alchemical Collision",
    description:
      "Spanish conquistadors run out of brandy. They introduce distillation technology (likely Filipino or Arab in origin) to the fermented agave mash. 'Vino de Mezcal' is born.",
  },
  {
    year: "1600",
    title: "The First Factory",
    description:
      "Don Pedro de Tagle, the Marquis of Altamira, establishes the first factory in the town of Tequila, Jalisco. The industrialization of the spirit begins.",
  },
  {
    year: "1758",
    title: "The Cuervo Dynasty",
    description:
      "Jose Antonio de Cuervo is granted land by the King of Spain to cultivate agave. The first official commercial license is issued.",
  },
  {
    year: "1873",
    title: "The Export",
    description:
      "Don Cenobio Sauza (founder of Sauza Tequila) identifies the Blue Weber agave as the superior species and sends the first barrels to the United States.",
  },
  {
    year: "1974",
    title: "The Denomination",
    description:
      "Tequila becomes the first product outside of Europe to receive a Denomination of Origin (DOT). 'Tequila' can now only be made in specific regions of Mexico.",
  },
  {
    year: "1990s",
    title: "The Industrial Glitch",
    description:
      "Mass production explodes. Diffusers (chemical extraction) replace ovens. Additives (vanilla, glycerin) replace time. The soul of the spirit is nearly lost.",
  },
  {
    year: "2010s",
    title: "The Renaissance",
    description:
      "A new wave of producers (Fortaleza, Cascahuin, G4) return to ancestral methods. The 'Glitch' is reclaimed. The search for the soul of tequila begins again.",
  },
];

export function Evolution() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Evolution</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            From sacred sap to industrial commodity, and back to art. The history of Tequila is a war between efficiency and soul.
          </p>
        </div>

        <div className="relative ml-4 space-y-12 border-l-2 border-primary/30 md:ml-1/2">
          {timeline.map((event, index) => (
            <Reveal
              key={event.year}
              margin="0px"
              enter={
                index % 2 === 0
                  ? "animate-in duration-500 fade-in fill-mode-both slide-in-from-left-[50px]"
                  : "animate-in duration-500 fade-in fill-mode-both slide-in-from-right-[50px]"
              }
              className={
                index % 2 === 0
                  ? "relative pl-8 md:ml-[-50%] md:pr-12 md:pl-0 md:text-right"
                  : "relative pl-8 md:ml-[50%] md:pl-12"
              }
            >
              <div className="absolute top-0 left-[-9px] size-4 rounded-full border-4 border-background bg-primary md:top-1 md:right-auto md:left-1/2 md:-translate-x-1/2" />

              <span className="mb-1 block font-mono text-sm text-accent">{event.year}</span>
              <h2 className="mb-2 font-display text-2xl text-foreground">{event.title}</h2>
              <p className="leading-relaxed text-muted-foreground">{event.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
