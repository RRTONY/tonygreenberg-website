import { PlacesList, type PlaceRegion } from "@/components/liquidsun/pages/places-list";

// Ported from the LiquidSun app's client/src/pages/JaliscoSource.tsx (2026-11-21). Same places and copy.
export const jaliscoSources: PlaceRegion[] = [
  {
    region: "Tequila (The Town)",
    spots: [
      { name: "La Capilla", desc: "The oldest bar in Tequila. Home of the Batanga. Don Javier is gone, but his spirit remains." },
      { name: "La Cata", desc: "The best tasting room in town. Curated by people who actually know the producers." },
      { name: "Hotel Solar de las Animas", desc: "Luxury in the heart of the plaza. A good base for exploring the valley." },
    ],
  },
  {
    region: "Arandas (Highlands)",
    spots: [
      { name: "Happy Bar", desc: "Where the master distillers drink. If you want to meet Carlos Camarena, go here." },
      { name: "Carnitas Jaimes", desc: "The best pork in the highlands. Essential fuel for a day of tasting." },
    ],
  },
  {
    region: "Guadalajara",
    spots: [
      { name: "El Buho", desc: "A legendary agave bar in Tlaquepaque. Thousands of bottles, deep knowledge." },
      { name: "De La O", desc: "Modern cantina with a killer selection of artisanal spirits." },
      { name: "Pare de Sufrir", desc: "Technically a mezcaleria, but they respect the agave in all forms." },
    ],
  },
];

export function JaliscoSource() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">Jalisco Source</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Going to the source is a pilgrimage. These are the waypoints for the faithful.
          </p>
        </div>
        <PlacesList regions={jaliscoSources} />
      </div>
    </div>
  );
}
