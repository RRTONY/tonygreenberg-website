import { soulsmokeImages, type SoulsmokeImage } from "@/lib/content/soulsmoke/images";

// Scent Finder notes, agaves and UI copy (EN/ES), from the SoulSmoke app's
// client/src/pages/ScentFinder.tsx. Unchanged content; images point at the rescued Sanity copies.

export type ScentCategory = "fruit" | "earth" | "floral" | "spice" | "smoke";

export interface ScentNote {
  name: string;
  category: ScentCategory;
  /** Background when the note is selected (full literal class). */
  color: string;
}

export interface AgaveMatch {
  name: string;
  scientificName: string;
  region: string;
  maturity: string;
  notes: string[];
  description: string;
  image: SoulsmokeImage;
}

export const scentNotes: ScentNote[] = [
  { name: "Green Apple", category: "fruit", color: "bg-lime-500" },
  { name: "Citrus", category: "fruit", color: "bg-yellow-400" },
  { name: "Pineapple", category: "fruit", color: "bg-yellow-500" },
  { name: "Banana", category: "fruit", color: "bg-yellow-300" },
  { name: "Wet Clay", category: "earth", color: "bg-orange-700" },
  { name: "Mineral", category: "earth", color: "bg-gray-500" },
  { name: "Leather", category: "earth", color: "bg-amber-800" },
  { name: "Earth", category: "earth", color: "bg-stone-600" },
  { name: "White Flowers", category: "floral", color: "bg-purple-300" },
  { name: "Jasmine", category: "floral", color: "bg-purple-400" },
  { name: "Lavender", category: "floral", color: "bg-violet-400" },
  { name: "Black Pepper", category: "spice", color: "bg-red-700" },
  { name: "Cinnamon", category: "spice", color: "bg-orange-600" },
  { name: "Anise", category: "spice", color: "bg-green-700" },
  { name: "Wood Smoke", category: "smoke", color: "bg-gray-700" },
  { name: "Charcoal", category: "smoke", color: "bg-gray-900" },
  { name: "Pine", category: "smoke", color: "bg-green-800" },
];

export const scentCategories: ScentCategory[] = ["fruit", "earth", "floral", "spice", "smoke"];

export const agaveDatabase: AgaveMatch[] = [
  {
    name: "Espadín",
    scientificName: "Agave angustifolia",
    region: "Oaxaca",
    maturity: "6-8 years",
    notes: ["Green Apple", "Citrus", "Wood Smoke", "White Flowers"],
    description: "The workhorse of mezcal. Bright, clean, accessible. A perfect introduction to the spirit.",
    image: soulsmokeImages.agavePlant,
  },
  {
    name: "Tobalá",
    scientificName: "Agave potatorum",
    region: "Oaxaca (high altitude)",
    maturity: "12-15 years",
    notes: ["White Flowers", "Jasmine", "Mineral", "Citrus"],
    description: "The 'King of Mezcals.' Delicate, floral, complex. Grows wild at high altitudes.",
    image: soulsmokeImages.wildAgave,
  },
  {
    name: "Tepeztate",
    scientificName: "Agave marmorata",
    region: "Oaxaca (cliff faces)",
    maturity: "25-30 years",
    notes: ["Mineral", "Pine", "Lavender", "Wet Clay"],
    description: "The patient one. Grows on cliff faces. Intense minerality and floral complexity.",
    image: soulsmokeImages.wildTepeztate,
  },
  {
    name: "Jabalí",
    scientificName: "Agave convallis",
    region: "Oaxaca",
    maturity: "12-15 years",
    notes: ["Green Apple", "Leather", "Earth", "Black Pepper"],
    description: "The 'Wild Boar.' Foams during distillation. Earthy, funky, challenging.",
    image: soulsmokeImages.agavePlant,
  },
  {
    name: "Arroqueño",
    scientificName: "Agave americana",
    region: "Oaxaca",
    maturity: "18-20 years",
    notes: ["White Flowers", "Cinnamon", "Banana", "Wood Smoke"],
    description: "Massive agaves (200+ kg). Floral, spicy, layered. A meditation in a glass.",
    image: soulsmokeImages.agaveField1,
  },
  {
    name: "Cuishe",
    scientificName: "Agave karwinskii",
    region: "Oaxaca",
    maturity: "10-12 years",
    notes: ["Citrus", "Mineral", "Anise", "Pine"],
    description: "Bright acids and high minerality. Like licking a wet stone in a thunderstorm.",
    image: soulsmokeImages.wildAgave,
  },
  {
    name: "Sierra Negra",
    scientificName: "Agave americana",
    region: "Oaxaca",
    maturity: "25+ years",
    notes: ["Leather", "Earth", "Charcoal", "Black Pepper"],
    description: "Fermented in bovine hide. Unfiltered, raw, chaotic. The earth breathing.",
    image: soulsmokeImages.bottleWild,
  },
];

/** Score every agave by the share of the selected notes it has; best first, no-shares dropped. */
export function matchAgaves(selectedNotes: string[]): AgaveMatch[] {
  if (selectedNotes.length === 0) return [];
  return agaveDatabase
    .map((agave) => {
      const matchCount = agave.notes.filter((note) => selectedNotes.includes(note)).length;
      return { agave, matchPercentage: (matchCount / selectedNotes.length) * 100 };
    })
    .filter((item) => item.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .map((item) => item.agave);
}

export const scentFinderData = {
  en: {
    title: "Scent-to-Agave Finder",
    subtitle: "Select the aromas you taste, discover the agave behind them",
    back: "Back to Home",
    find: (count: number) => `Find My Agave (${count} notes selected)`,
    clear: "Clear Selection",
    resultsTitle: "Your Agave Matches",
    tryAgain: "Try Again",
  },
  es: {
    title: "Buscador Aroma-Agave",
    subtitle: "Selecciona los aromas que percibes, descubre el agave detrás de ellos",
    back: "Volver",
    find: (count: number) => `Encuentra Mi Agave (${count} notas)`,
    clear: "Limpiar",
    resultsTitle: "Tus Agaves Compatibles",
    tryAgain: "Intentar de Nuevo",
  },
  // English only in the original app.
  basedOn: "Based on your selected notes:",
  matchBadge: (rank: number) => `MATCH #${rank}`,
  tastingNotes: "Tasting Notes",
  noMatches: "No matches found. Try selecting different notes!",
};
