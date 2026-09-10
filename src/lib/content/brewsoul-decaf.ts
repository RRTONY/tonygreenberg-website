export interface FameBrand {
  name: string;
  price: string;
  perOz: string;
  process: string;
  cert: string;
  origin: string;
  notes: string;
  url: string;
  tier: string;
  colorClass: string;
  borderClass: string;
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulDecaf.tsx's real
// 13-brand "Hall of Fame" clean-decaf list, unchanged. Kept as a plain
// data module (not exported from the "use client" `decaf-fame.tsx`)
// since a Server Component (`app/brewsoul/decaf/page.tsx`) also needs it
// for the price-comparison table — a non-component named export from a
// client module isn't available to Server Components across the RSC
// boundary.
export const FAME: FameBrand[] = [
  {
    name: "Holistic Roasters Biodynamic Decaf",
    price: "$19.95/10.6oz",
    perOz: "$1.88",
    process: "Swiss Water",
    cert: "Demeter + USDA Organic + EcoCert",
    origin: "Honduras (18 Conejo)",
    notes:
      "WORLD'S FIRST biodynamic decaf. Launched Dec 2025 in partnership with Swiss Water Process. Lab tested for mold, mycotoxins, heavy metals. SCA 85-87. The gold standard.",
    url: "https://biodynamic.coffee?ref=brewsoul",
    tier: "LEGENDARY",
    colorClass: "bg-[#c4873b]",
    borderClass: "border-l-[#c4873b]",
  },
  {
    name: "Purity Coffee Calm Decaf",
    price: "$29/12oz",
    perOz: "$2.42",
    process: "Swiss Water",
    cert: "USDA Organic, Rainforest Alliance, Bird Friendly, Demeter (select)",
    origin: "Multi-origin",
    notes:
      "Tests for 350+ chemical compounds. Also offers 1/3-caf option. Highest CGA focus. Health-first brand. N₂-flushed bags. Smokeless roaster.",
    url: "https://puritycoffee.com?ref=brewsoul",
    tier: "PREMIUM",
    colorClass: "bg-[#3a7a4a]",
    borderClass: "border-l-[#3a7a4a]",
  },
  {
    name: "Lifeboost Swiss Water Decaf",
    price: "~$30/12oz",
    perOz: "$2.50",
    process: "Swiss Water",
    cert: "USDA Organic",
    origin: "Nicaragua (single origin, shade-grown)",
    notes:
      "Tests for 450+ toxins. Low acid. Highest-ranked SWP decaf in blind tastings (Decadent Decaf review). Berry, caramel, raisin notes. Spring-water washed.",
    url: "https://lifeboostcoffee.com?ref=brewsoul",
    tier: "PREMIUM",
    colorClass: "bg-[#3a7a4a]",
    borderClass: "border-l-[#3a7a4a]",
  },
  {
    name: "Cafe Altura Organic Decaf",
    price: "~$14.99/12oz",
    perOz: "$1.25",
    process: "Swiss Water",
    cert: "USDA Organic, Non-GMO, Demeter (caf lines)",
    origin: "Multi-origin",
    notes:
      "From the OG biodynamic company (est. 1980). Their decaf line uses SWP but isn't Demeter-certified biodynamic. Still excellent value organic SWP decaf.",
    url: "https://cafealtura.com?ref=brewsoul",
    tier: "VALUE KING",
    colorClass: "bg-[#4a5e3c]",
    borderClass: "border-l-[#4a5e3c]",
  },
  {
    name: "Allegro Coffee Decaf (Whole Foods)",
    price: "~$12.50/12oz",
    perOz: "$1.04",
    process: "Swiss Water",
    cert: "USDA Organic, Fair Trade",
    origin: "Multi-origin",
    notes:
      "Best affordable Swiss Water decaf. Available at every Whole Foods. Italian Roast and French Roast options. Reliable daily driver. Low acidity.",
    url: "https://www.amazon.com/Allegro-Coffee?ref=brewsoul",
    tier: "BUDGET CHAMP",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
  {
    name: "Caribou Coffee Decaf",
    price: "~$11/12oz",
    perOz: "$0.92",
    process: "Swiss Water",
    cert: "Rainforest Alliance",
    origin: "Multi-origin",
    notes:
      "Major chain using SWP. Widely available. Caribou Blend Decaf is their flagship. Smooth, accessible flavor. Good for offices.",
    url: "https://www.cariboucoffee.com?ref=brewsoul",
    tier: "MAINSTREAM",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
  {
    name: "Jo Coffee 'No Fun Jo' Decaf",
    price: "$16.99/12oz",
    perOz: "$1.42",
    process: "Swiss Water",
    cert: "USDA Organic",
    origin: "Multi-origin",
    notes:
      "Top-rated on Amazon. Available in ground, whole bean, K-Cup, and Nespresso formats. Note: SWP now subject to 35% tariff (processed in Canada). Price rising.",
    url: "https://www.jocoffee.com?ref=brewsoul",
    tier: "CONVENIENCE",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
  {
    name: "Kicking Horse Decaf",
    price: "~$14/10oz",
    perOz: "$1.40",
    process: "Swiss Water",
    cert: "Organic, Fair Trade",
    origin: "Multi-origin",
    notes:
      "Canadian roaster. Rich chocolate and caramel notes. Good body for a decaf. Widely available at grocery stores. One of the original SWP advocates.",
    url: "https://www.kickinghorsecoffee.com?ref=brewsoul",
    tier: "GROCERY PICK",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
  {
    name: "Subtle Earth Organic Decaf",
    price: "~$24/2lb",
    perOz: "$0.75",
    process: "Swiss Water",
    cert: "CCOF Organic",
    origin: "Multi-origin",
    notes:
      "Best bulk value. 2lb bags. Chocolate, honey, caramel notes. Medium-dark. Beans appear darker due to SWP processing (normal). Non-GMO.",
    url: "https://www.amazon.com/Subtle-Earth-Organic-Decaf?ref=brewsoul",
    tier: "BULK VALUE",
    colorClass: "bg-[#4a5e3c]",
    borderClass: "border-l-[#4a5e3c]",
  },
  {
    name: "Charleston Coffee Roasters SWP Decaf",
    price: "~$16/12oz",
    perOz: "$1.33",
    process: "Swiss Water",
    cert: "USDA Organic",
    origin: "Single origin",
    notes:
      "Cult following. 5-star reviews across the board. Tastes like regular single-origin. 'Best decaf I've ever had' is the most common review. Small batch.",
    url: "https://www.charlestoncoffeeroasters.com?ref=brewsoul",
    tier: "CULT FAVORITE",
    colorClass: "bg-[#3a7a4a]",
    borderClass: "border-l-[#3a7a4a]",
  },
  {
    name: "Blue Spruce Decaf",
    price: "~$18/12oz",
    perOz: "$1.50",
    process: "Swiss Water",
    cert: "Organic, Non-GMO",
    origin: "Multi-origin",
    notes:
      "Decaf-only company. Shade grown. Espresso and regular options. If a company does nothing but decaf, they'd better be great at it — they are.",
    url: "https://bluesprucedecaf.com?ref=brewsoul",
    tier: "SPECIALIST",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
  {
    name: "Verena Street SWP Decaf",
    price: "~$14/12oz",
    perOz: "$1.17",
    process: "Swiss Water",
    cert: "Organic, Fair Trade, Rainforest Alliance",
    origin: "Multi-origin",
    notes:
      "Solar-powered roastery. Triple certified. 30-day money-back guarantee. Multiple grind options. Free shipping over $40.",
    url: "https://www.verenastreet.com?ref=brewsoul",
    tier: "SUSTAINABLE",
    colorClass: "bg-[#4a5e3c]",
    borderClass: "border-l-[#4a5e3c]",
  },
  {
    name: "Peet's Coffee Decaf",
    price: "~$13/12oz",
    perOz: "$1.08",
    process: "Swiss Water (confirmed select lines)",
    cert: "Varies by line",
    origin: "Multi-origin",
    notes:
      "Major chain using SWP on select decaf lines. Check label — not all Peet's decaf is SWP. Their Major Dickason's Decaf is SWP. Widely available.",
    url: "https://www.peets.com?ref=brewsoul",
    tier: "CHAIN BEST",
    colorClass: "bg-[#4a7c8c]",
    borderClass: "border-l-[#4a7c8c]",
  },
];
