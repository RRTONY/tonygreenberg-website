import { liquidsunImages, type LiquidsunImage } from "@/lib/content/liquidsun/images";

// The Flavor Matrix data, ported unchanged from the LiquidSun app's client/src/components/FlavorMatrix.tsx
// (2026-11-21). Only the images changed: the six bottle photos that existed are rescued to Sanity;
// the other eleven (/images/bottle-cascahuin.jpg etc.) never existed on the live site (Manus served
// an HTML page, so visitors saw a broken image), so `image` is null and the page shows a placeholder.

export type BottleType = "Blanco" | "Reposado" | "Añejo" | "Extra Añejo";

export interface Bottle {
  id: string;
  brand: string;
  expression: string;
  price: number;
  x: number; // -100 (Valley/Earth) to 100 (Highlands/Fruit)
  y: number; // -100 (Light/Crisp) to 100 (Rich/Complex)
  type: BottleType;
  image: LiquidsunImage | null;
  notes: string;
  rarity: string;
  producerId?: string; // links to producers.ts for buy links
}

export const BOTTLE_TYPES: BottleType[] = ["Blanco", "Reposado", "Añejo", "Extra Añejo"];

/** Unicorn and Legendary bottles pulse and get "Notify Me". */
export const isRare = (b: Bottle) => b.rarity === "Unicorn" || b.rarity === "Legendary";

/** A -100..100 axis value as a percentage across the plot. */
export const toPercent = (v: number) => ((v + 100) / 200) * 100;

export const bottles: Bottle[] = [
  // BLANCOS
  { id: "caballito-46", brand: "Caballito Cerrero", expression: "Azul 46", price: 75, x: -85, y: 60, type: "Blanco", image: liquidsunImages.bottleCaballito, notes: "Brine, Grilled Pineapple, Smoke", rarity: "Cult", producerId: "caballito-cerrero-azul" },
  { id: "cascahuin-tahona", brand: "Cascahuín", expression: "Tahona", price: 90, x: -60, y: 40, type: "Blanco", image: null, notes: "Mineral, Earth, Citrus", rarity: "Rare", producerId: "cascahuin-tahona" },
  { id: "g4-madera", brand: "G4", expression: "Madera", price: 120, x: 20, y: 90, type: "Blanco", image: liquidsunImages.bottleG4, notes: "Pine, Wet Cement, Rain", rarity: "Unicorn", producerId: "g4-blanco" },
  { id: "ocho-plata", brand: "Tequila Ocho", expression: "Plata", price: 42, x: 80, y: -20, type: "Blanco", image: null, notes: "Citrus, Floral, Pepper", rarity: "Staple", producerId: "ocho-plata" },
  { id: "fortaleza-blanco", brand: "Fortaleza", expression: "Blanco", price: 86, x: -40, y: 30, type: "Blanco", image: liquidsunImages.bottleFortaleza, notes: "Olive, Butter, Agave", rarity: "Rare", producerId: "fortaleza-blanco" },
  { id: "lalo", brand: "LALO", expression: "Blanco", price: 40, x: 40, y: -50, type: "Blanco", image: null, notes: "Clean, Champagne, Citrus", rarity: "Staple", producerId: "lalo-blanco" },
  { id: "siete-blanco", brand: "Siete Leguas", expression: "Blanco", price: 45, x: 10, y: 10, type: "Blanco", image: null, notes: "Mint, Earth, Agave", rarity: "Staple", producerId: "siete-leguas-blanco" },
  { id: "volans-ss", brand: "Volans", expression: "Still Strength", price: 85, x: 50, y: 20, type: "Blanco", image: null, notes: "Apple, Rainwater, Pepper", rarity: "Rare", producerId: "volans-blanco" },
  { id: "wild-common", brand: "Wild Common", expression: "Blanco", price: 75, x: -20, y: 50, type: "Blanco", image: null, notes: "Wet Stone, Lime, Agave", rarity: "Rare", producerId: "wild-common-still" },
  { id: "fuenteseca-18", brand: "Fuenteseca", expression: "Cosecha 2018", price: 140, x: 60, y: 70, type: "Blanco", image: liquidsunImages.bottleFuenteseca, notes: "Sweet Potato, White Pepper", rarity: "Unicorn", producerId: "fuenteseca-reserva" },

  // REPOSADOS
  { id: "la-gritona", brand: "La Gritona", expression: "Reposado", price: 45, x: -30, y: -40, type: "Reposado", image: null, notes: "Vegetal, Raw Agave, Light Oak", rarity: "Staple" },
  { id: "fortaleza-repo", brand: "Fortaleza", expression: "Reposado", price: 85, x: -50, y: 40, type: "Reposado", image: liquidsunImages.bottleFortaleza, notes: "Butterscotch, Olive, Oak", rarity: "Rare", producerId: "fortaleza-blanco" },
  { id: "g4-repo", brand: "G4", expression: "Reposado", price: 60, x: 30, y: 10, type: "Reposado", image: liquidsunImages.bottleG4, notes: "Light Oak, Agave Punch", rarity: "Staple", producerId: "g4-blanco" },
  { id: "ocho-repo", brand: "Tequila Ocho", expression: "Reposado", price: 65, x: 70, y: 20, type: "Reposado", image: null, notes: "Fruit, Spice, Oak", rarity: "Staple", producerId: "ocho-plata" },
  { id: "don-fulano-repo", brand: "Don Fulano", expression: "Reposado", price: 60, x: 50, y: 50, type: "Reposado", image: null, notes: "French Oak, Spice, Fruit", rarity: "Staple" },
  { id: "el-tesoro-repo", brand: "El Tesoro", expression: "Reposado", price: 65, x: 20, y: 30, type: "Reposado", image: null, notes: "Olive, Oak, Citrus", rarity: "Staple", producerId: "el-tesoro-blanco" },
  { id: "volans-repo", brand: "Volans", expression: "Reposado", price: 75, x: 40, y: 25, type: "Reposado", image: null, notes: "Apple, Oak, Rain", rarity: "Rare", producerId: "volans-blanco" },
  { id: "wild-common-repo", brand: "Wild Common", expression: "Reposado", price: 90, x: -10, y: 45, type: "Reposado", image: null, notes: "Stone, Oak, Lime", rarity: "Rare", producerId: "wild-common-still" },

  // AÑEJOS & EXTRA AÑEJOS
  { id: "fortaleza-anejo", brand: "Fortaleza", expression: "Añejo", price: 120, x: -40, y: 60, type: "Añejo", image: liquidsunImages.bottleFortaleza, notes: "Butter, Caramel, Agave", rarity: "Rare", producerId: "fortaleza-blanco" },
  { id: "g4-xa", brand: "G4", expression: "Extra Añejo", price: 130, x: 20, y: 50, type: "Extra Añejo", image: liquidsunImages.bottleG4, notes: "Oak, Agave, Vanilla", rarity: "Rare", producerId: "g4-blanco" },
  { id: "tears", brand: "Tears of Llorona", expression: "Extra Añejo", price: 230, x: 60, y: 90, type: "Extra Añejo", image: liquidsunImages.bottleTears, notes: "Sherry, Cognac, Chocolate", rarity: "Legendary", producerId: "tears-extra-anejo" },
  { id: "rey-sol", brand: "Rey Sol", expression: "Extra Añejo", price: 300, x: 50, y: 80, type: "Extra Añejo", image: liquidsunImages.bottleReySol, notes: "French Oak, Fruit, Spice", rarity: "Luxury" },
  { id: "fuenteseca-21", brand: "Fuenteseca", expression: "Reserva 21yr", price: 800, x: 40, y: 95, type: "Extra Añejo", image: liquidsunImages.bottleFuenteseca, notes: "Old Library, Dried Apricot", rarity: "Luxury", producerId: "fuenteseca-reserva" },
  { id: "tapatio-excelencia", brand: "Tapatio", expression: "Excelencia", price: 180, x: 30, y: 85, type: "Extra Añejo", image: null, notes: "Spicy, Intense, Wood", rarity: "Legendary", producerId: "tapatio-110" },
  { id: "el-tesoro-xa", brand: "El Tesoro", expression: "Extra Añejo", price: 130, x: 25, y: 70, type: "Extra Añejo", image: null, notes: "Balanced, Elegant, Agave", rarity: "Rare", producerId: "el-tesoro-blanco" },
  { id: "el-tequileno-rare", brand: "El Tequileño", expression: "Rare", price: 200, x: 10, y: 75, type: "Extra Añejo", image: null, notes: "Pipon Oak, Complex Fruit", rarity: "Luxury" },
];

// --- QUADRANT DEFINITIONS ---
export const quadrants = {
  Blanco: {
    tl: "The Mineralist", // Valley + Complex
    tr: "The Fruit Bomb", // Highlands + Complex
    bl: "The Purist", // Valley + Light
    br: "The Floralist", // Highlands + Light
  },
  Reposado: {
    tl: "The Earthy Oak",
    tr: "The Spiced Fruit",
    bl: "The Light Barrel",
    br: "The Balanced Sip",
  },
  Añejo: {
    tl: "The Dark Earth",
    tr: "The Sweet Spice",
    bl: "The Agave Forward",
    br: "The Elegant Oak",
  },
  "Extra Añejo": {
    tl: "The Deep Cellar",
    tr: "The Cognac Style",
    bl: "The Agave Soul",
    br: "The Sherry Bomb",
  }
};

// --- QUIZ QUESTIONS ---
export const quizQuestions = [
  {
    id: 1,
    question: "What's your ideal flavor profile?",
    options: [
      { label: "Crisp & Clean", value: { x: 0, y: -50 } },
      { label: "Rich & Complex", value: { x: 0, y: 50 } },
    ]
  },
  {
    id: 2,
    question: "Pick a landscape:",
    options: [
      { label: "Volcanic Valley (Earth/Mineral)", value: { x: -50, y: 0 } },
      { label: "Highland Fields (Fruit/Floral)", value: { x: 50, y: 0 } },
    ]
  },
  {
    id: 3,
    question: "How adventurous are you?",
    options: [
      { label: "I like the classics", value: { x: 0, y: -20 } },
      { label: "Surprise me", value: { x: 0, y: 20 } },
    ]
  }
];
