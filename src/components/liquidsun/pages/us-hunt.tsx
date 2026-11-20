import { PlacesList, type PlaceRegion } from "@/components/liquidsun/pages/places-list";

// Ported from the LiquidSun app's client/src/pages/USHunt.tsx (2026-11-21). Same places and copy.
export const usSources: PlaceRegion[] = [
  {
    region: "Online (National)",
    spots: [
      { name: "Old Town Tequila", url: "https://www.oldtowntequila.com", location: "San Diego, CA", desc: "The deepest inventory in the US. Based in San Diego." },
      { name: "Sip Tequila", url: "https://siptequila.com", location: "Online", desc: "Curated selection of additive-free brands. Premium service." },
      { name: "K&L Wine Merchants", url: "https://www.klwines.com", location: "California", desc: "Incredible direct imports and exclusive single barrels." },
    ],
  },
  {
    region: "California",
    spots: [
      { name: "Tahona Mercado", location: "San Francisco", desc: "A temple to agave. Only the good stuff." },
      { name: "Madre", location: "Los Angeles", desc: "Oaxacan soul in LA, but their tequila list is serious." },
      { name: "Alamo City Liquor", location: "San Antonio", desc: "The secret weapon for rare bottles." },
    ],
  },
  {
    region: "New York",
    spots: [
      { name: "Astor Wines", location: "NYC", desc: "The gold standard for spirits retail in Manhattan." },
      { name: "Agave Restaurant", location: "NYC", desc: "Great selection of highlands tequilas." },
    ],
  },
  {
    region: "Texas",
    spots: [
      { name: "Pogo's Wine & Spirits", location: "Dallas", desc: "High-end selection with knowledgeable staff." },
      { name: "Spec's", location: "Statewide", desc: "The big box store that surprisingly hides gems." },
    ],
  },
];

export function UsHunt() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The US Hunt</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            These bottles are rare. They don&apos;t live on the bottom shelf of your local grocery store. You have to hunt for them.
          </p>
        </div>
        <PlacesList regions={usSources} />
      </div>
    </div>
  );
}
