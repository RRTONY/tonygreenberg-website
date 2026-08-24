/**
 * BrewSoul Esoteric Coffee Index
 * "Where To Actually Buy The Legendary Coffees"
 * Last Updated: May 2026
 */

export interface BuySource {
  name: string;
  url: string;
  note?: string;
}

export interface EsotericCoffee {
  id: string;
  name: string;
  tier: 1 | 2;
  tierLabel: string;
  whyItMatters: string;
  origin?: string;
  tastingNotes: string[];
  rarity: number; // 1-10
  typicalCost: string;
  availability?: string;
  buySources: BuySource[];
  additionalSources?: BuySource[];
  references?: string;
  note?: string;
}

export interface ExplorerScore {
  coffee: string;
  tasteShock: number;
  rarity: number;
  story: number;
  worthBuying: number;
}

export const ESOTERIC_COFFEES: EsotericCoffee[] = [
  // ═══════════════════════════════════════════════════════
  // TIER 1: THE HOLY GRAIL COFFEES
  // ═══════════════════════════════════════════════════════
  {
    id: "panama-geisha",
    name: "Panama Geisha",
    tier: 1,
    tierLabel: "The Holy Grail Coffees",
    whyItMatters: "The most famous specialty coffee on Earth.",
    tastingNotes: ["Jasmine", "Bergamot", "Peach", "Orange Blossom", "Black Tea"],
    rarity: 10,
    typicalCost: "$50–$300+",
    buySources: [
      { name: "Panama Coffee Gold Reserve", url: "https://www.panamacoffeegoldreserve.com/collections/geisha-coffee" },
      { name: "Hacienda La Esmeralda (original legendary farm)", url: "https://blessedbeancoffee.com/products/panama-hacienda-la-esmeralda-geisha-1500" },
      { name: "9th Street Coffee", url: "https://9thstreetcoffee.com/products/organic-panama-geisha-coffee" },
    ],
    additionalSources: [
      { name: "Paradise Roasters", url: "https://paradiseroasters.com/collections/geisha-coffee" },
      { name: "Bean & Bean Coffee", url: "https://beannbeancoffee.com/collections/gesha-coffee" },
    ],
    references: "Panama Geisha routinely commands some of the highest prices in coffee and remains one of the world's most sought-after varieties.",
  },
  {
    id: "yemen-mokha",
    name: "Yemen Mokha",
    tier: 1,
    tierLabel: "The Holy Grail Coffees",
    whyItMatters: "The birthplace of coffee culture.",
    tastingNotes: ["Dark Chocolate", "Dried Fruit", "Cardamom", "Cinnamon", "Tobacco"],
    rarity: 10,
    typicalCost: "$25–$100+",
    buySources: [
      { name: "Al Mokha", url: "https://www.almokha.com/collections/all" },
      { name: "Port of Mokha", url: "https://portofmokha.com/collections/shop" },
    ],
    additionalSources: [
      { name: "Banyan Coffee Company", url: "https://www.banyancoffeecompany.com/product/yemen-coffee-mokha-hajjah/" },
    ],
    references: "Modern specialty Yemeni coffee traces much of its revival to Al Mokha and Port of Mokha.",
  },
  {
    id: "liberica",
    name: "Liberica",
    tier: 1,
    tierLabel: "The Holy Grail Coffees",
    whyItMatters: "Not a variety. An entirely different coffee species.",
    tastingNotes: ["Jackfruit", "Tropical Fruit", "Dark Honey", "Smoke"],
    rarity: 9,
    typicalCost: "$20–$60",
    buySources: [
      { name: "City Boy Coffee", url: "https://cityboycoffee.com/product/liberica-l1-natural/" },
      { name: "Channel Roasters", url: "https://www.channelroasterscoffee.com/product/uganda-liberica/63" },
      { name: "Philippines Kapeng Barako", url: "https://www.neworleanscoffeeimports.com/product-page/philippines-liberica-barako-batangas-co-op-grown-1" },
    ],
    references: "Liberica represents less than roughly 2% of world coffee production and is considered one of the rarest commercially available species.",
  },
  {
    id: "eugenioides",
    name: "Eugenioides",
    tier: 1,
    tierLabel: "The Holy Grail Coffees",
    whyItMatters: "One of Arabica's parent species.",
    tastingNotes: ["Honey", "Sweet Tea", "Candy", "Stone Fruit"],
    rarity: 10,
    typicalCost: "$75–$300+",
    availability: "Extremely limited. Often released in tiny lots by competition roasters and sold out within days.",
    buySources: [],
    additionalSources: [
      { name: "Search for availability", url: "https://www.google.com/search?q=eugenioides+coffee+beans" },
    ],
    note: "Often released in tiny lots by competition roasters and sold out within days.",
  },
  {
    id: "wush-wush",
    name: "Wush Wush",
    tier: 1,
    tierLabel: "The Holy Grail Coffees",
    whyItMatters: "One of Ethiopia's most exotic heirloom cultivars.",
    tastingNotes: ["Mango", "Honey", "Floral Tea", "Passionfruit"],
    rarity: 9,
    typicalCost: "$25–$80",
    buySources: [
      { name: "Passenger Coffee", url: "https://passengercoffee.com" },
      { name: "Black & White Coffee", url: "https://www.blackwhiteroasters.com" },
      { name: "Onyx Coffee Lab", url: "https://onyxcoffeelab.com" },
    ],
    references: "These roasters frequently secure Wush Wush lots when available. Community coffee experts consistently cite them as reliable rare-variety sources.",
  },

  // ═══════════════════════════════════════════════════════
  // TIER 2: COMPETITION MONSTERS
  // ═══════════════════════════════════════════════════════
  {
    id: "sidra",
    name: "Sidra",
    tier: 2,
    tierLabel: "Competition Monsters",
    whyItMatters: "A rising star in competition circuits, prized for its delicate complexity.",
    origin: "Ecuador",
    tastingNotes: ["Rose", "Berry", "Citrus"],
    rarity: 9,
    typicalCost: "$30–$80",
    buySources: [
      { name: "Passenger Coffee", url: "https://passengercoffee.com" },
      { name: "Onyx Coffee Lab", url: "https://onyxcoffeelab.com" },
    ],
  },
  {
    id: "pink-bourbon",
    name: "Pink Bourbon",
    tier: 2,
    tierLabel: "Competition Monsters",
    whyItMatters: "A genetic mystery that produces some of the most floral cups in specialty coffee.",
    origin: "Colombia",
    tastingNotes: ["Rosewater", "Strawberry", "Citrus"],
    rarity: 8,
    typicalCost: "$25–$60",
    buySources: [
      { name: "Black & White Coffee", url: "https://www.blackwhiteroasters.com" },
      { name: "Passenger Coffee", url: "https://passengercoffee.com" },
    ],
  },
  {
    id: "bourbon-aji",
    name: "Bourbon Aji",
    tier: 2,
    tierLabel: "Competition Monsters",
    whyItMatters: "An ultra-rare Colombian variety with candy-like sweetness.",
    origin: "Colombia",
    tastingNotes: ["Peach Candy", "Tropical Fruit"],
    rarity: 10,
    typicalCost: "$40–$120",
    buySources: [
      { name: "Onyx Coffee Lab", url: "https://onyxcoffeelab.com", note: "Competition-lot releases" },
      { name: "Black & White Coffee", url: "https://www.blackwhiteroasters.com", note: "Competition-lot releases" },
      { name: "Passenger Coffee", url: "https://passengercoffee.com", note: "Competition-lot releases" },
    ],
  },
  {
    id: "sudan-rume",
    name: "Sudan Rume",
    tier: 2,
    tierLabel: "Competition Monsters",
    whyItMatters: "A wild lineage coffee with extraordinary genetic diversity.",
    origin: "Sudan Lineage",
    tastingNotes: ["Wild Berry", "Floral", "Tropical Fruit"],
    rarity: 10,
    typicalCost: "$40–$100",
    buySources: [
      { name: "Onyx Coffee Lab", url: "https://onyxcoffeelab.com", note: "Auction lots and specialty releases" },
      { name: "Passenger Coffee", url: "https://passengercoffee.com", note: "Auction lots and specialty releases" },
    ],
  },
];

export const ACQUISITION_PRIORITY: string[] = [
  "Panama Geisha",
  "Yemen Mokha",
  "Liberica",
  "Wush Wush",
  "Eugenioides",
  "Sudan Rume",
  "Bourbon Aji",
  "Sidra",
  "Pink Bourbon",
  "Laurina",
];

export const EXPLORER_SCORES: ExplorerScore[] = [
  { coffee: "Panama Geisha", tasteShock: 10, rarity: 10, story: 10, worthBuying: 10 },
  { coffee: "Yemen Mokha", tasteShock: 9, rarity: 10, story: 10, worthBuying: 10 },
  { coffee: "Liberica", tasteShock: 10, rarity: 9, story: 10, worthBuying: 10 },
  { coffee: "Eugenioides", tasteShock: 10, rarity: 10, story: 9, worthBuying: 9 },
  { coffee: "Wush Wush", tasteShock: 9, rarity: 9, story: 8, worthBuying: 9 },
  { coffee: "Sudan Rume", tasteShock: 9, rarity: 10, story: 8, worthBuying: 8 },
  { coffee: "Bourbon Aji", tasteShock: 9, rarity: 10, story: 8, worthBuying: 8 },
  { coffee: "Sidra", tasteShock: 8, rarity: 9, story: 7, worthBuying: 8 },
  { coffee: "Pink Bourbon", tasteShock: 8, rarity: 8, story: 7, worthBuying: 8 },
  { coffee: "Laurina", tasteShock: 8, rarity: 9, story: 7, worthBuying: 8 },
];

export const FINAL_OBSERVATION = `Most coffee drinkers spend their lives exploring roast levels.
The real frontier is genetics.
Geisha, Liberica, Eugenioides, Sudan Rume, Wush Wush, Sidra, and Bourbon Aji are not merely different coffees.
They are different definitions of what coffee can be.`;
