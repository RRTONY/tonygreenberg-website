// Ported from the SoulSmoke Manus app (client/src/data/mezcalData.ts, exported 2026-11-10). Real content, unchanged.
// Mezcal Data with 8-Dimension Flavor Scoring
// Scores are 1-10 scale

export interface FlavorProfile {
  smoke: number;      // 1 = None, 10 = Intense charred/ashy
  sweetness: number;  // 1 = Bone dry/austere, 10 = Candied/honey
  funk: number;       // 1 = Clean/polished, 10 = Wild/barnyard/cheese
  herbal: number;     // 1 = Minimal, 10 = Intense green/vegetal/earthy
  fruit: number;      // 1 = None, 10 = Tropical/citrus/stone fruit
  spice: number;      // 1 = Mild, 10 = Intense pepper/warming
  mineral: number;    // 1 = Soft, 10 = Intense wet stone/chalk
  complexity: number; // 1 = Simple/direct, 10 = Layered/evolving
}

// Pricing context - most rare mezcals have complex pricing situations
export type PricingType = 
  | 'retail'           // Available at retail stores
  | 'wholesale'        // Price reflects wholesale/distributor cost
  | 'allocation'       // Only available through maker relationships
  | 'not-for-sale';    // Museum pieces, personal collections, discontinued

// Lot sizes - true artisanal mezcal comes in tiny batches
export type LotSize = 
  | 'micro'     // 20-50 bottles per lot
  | 'small'     // 50-200 bottles per lot  
  | 'medium'    // 200-500 bottles per lot
  | 'large'     // 500+ bottles per lot
  | 'industrial'; // Mass production

export interface Mezcal {
  id: string;
  name: string;
  brand: string;
  agave: string;
  region: string;
  producer: string;
  method: 'ancestral' | 'artisanal' | 'industrial';
  abv: number;
  price: number; // USD - see pricingType for context
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
  pricingType?: PricingType; // Context for the price shown
  lotSize?: LotSize; // How many bottles per production lot
  allocationOnly?: boolean; // Requires relationship with maker to purchase
  availability: 'easy' | 'moderate' | 'hard' | 'rare' | 'unicorn'; // unicorn = nearly impossible
  market: 'us' | 'mexico' | 'both';
  flavor: FlavorProfile;
  evi: number; // Extraordinary Value Index (1-10, manually assigned)
  eei: number; // Extraordinary Experience Index (1-10, manually assigned)
  tastingNotes: string;
  story: string;
  expertQuote?: string;
  expertSource?: string;
  whereToBuy?: string[];
}

// US MARKET - Top 25 Extraordinary Bottles
// EVI = Value for money (high = great bang for buck)
// EEI = Experience intensity (high = mind-blowing, transcendent)
// Distributed across all 4 quadrants:
// - THE GRAIL: High EVI (>5.5), High EEI (>5.5) - Best of both worlds
// - HIDDEN GEMS: Low EVI (<5.5), High EEI (>5.5) - Expensive but worth it
// - OVERPRICED: High EVI (>5.5), Low EEI (<5.5) - Good value, meh experience
// - SKIP THESE: Low EVI (<5.5), Low EEI (<5.5) - Neither value nor experience

export const usMezcals: Mezcal[] = [
  // THE GRAIL - High Value, High Experience
  {
    id: 'us-1',
    name: 'Chichicapa',
    brand: 'Del Maguey',
    agave: 'Espadín',
    region: 'San Baltazar Chichicapa, Oaxaca',
    producer: 'Faustino García Vásquez',
    method: 'artisanal',
    abv: 46,
    price: 65,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 8, sweetness: 2, funk: 2, herbal: 9,
      fruit: 6, spice: 4, mineral: 7, complexity: 8
    },
    evi: 8.5, // Great value for the quality
    eei: 7.5, // Excellent experience
    tastingNotes: 'Roasted agave, wet clay, green herbs, citrus peel, white pepper. Long mineral finish.',
    story: 'From the village that put single-village mezcal on the map. Faustino\'s family has been making mezcal for generations.',
    expertQuote: '"The gateway drug to serious mezcal appreciation."',
    expertSource: 'Steve Olson',
    whereToBuy: ['Total Wine', 'K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-2',
    name: 'Vida',
    brand: 'Del Maguey',
    agave: 'Espadín',
    region: 'San Luis del Río, Oaxaca',
    producer: 'Paciano Cruz',
    method: 'artisanal',
    abv: 42,
    price: 32,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 3, funk: 1, herbal: 7,
      fruit: 3, spice: 6, mineral: 5, complexity: 3
    },
    evi: 9.0, // Incredible value for entry point
    eei: 5.5, // Decent but not transcendent
    tastingNotes: 'Clean smoke, citrus, light herbs. Approachable.',
    story: 'The bottle that introduced a generation to mezcal. Perfect for cocktails.',
    whereToBuy: ['Total Wine', 'BevMo', 'Most liquor stores']
  },
  {
    id: 'us-3',
    name: 'Espadín',
    brand: 'Banhez',
    agave: 'Espadín',
    region: 'San Juan del Río, Oaxaca',
    producer: 'Community cooperative',
    method: 'artisanal',
    abv: 42,
    price: 28,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 3, funk: 3, herbal: 3,
      fruit: 7, spice: 1, mineral: 2, complexity: 6
    },
    evi: 8.5, // Great value
    eei: 4.5, // Simple but pleasant
    tastingNotes: 'Light smoke, green apple, clean finish.',
    story: 'Cooperative model supports multiple families.',
    whereToBuy: ['Total Wine', 'Trader Joe\'s area stores']
  },
  {
    id: 'us-4',
    name: 'Espadín',
    brand: 'Bozal',
    agave: 'Espadín',
    region: 'Santiago Matatlán, Oaxaca',
    producer: 'Various producers',
    method: 'artisanal',
    abv: 47,
    price: 45,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 4, sweetness: 6, funk: 4, herbal: 5,
      fruit: 6, spice: 7, mineral: 6, complexity: 4
    },
    evi: 7.5, // Good value
    eei: 6.0, // Solid experience
    tastingNotes: 'Balanced smoke, agave sweetness, mineral notes.',
    story: 'Consistent quality from Matatlán producers.',
    whereToBuy: ['Total Wine', 'K&L Wine']
  },
  {
    id: 'us-5',
    name: 'Reposado en Barro',
    brand: 'Nuestra Soledad',
    agave: 'Espadín',
    region: 'Santiago Matatlán, Oaxaca',
    producer: 'El Jolgorio family',
    method: 'artisanal',
    abv: 45,
    price: 55,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 8, sweetness: 4, funk: 6, herbal: 6,
      fruit: 6, spice: 4, mineral: 7, complexity: 7
    },
    evi: 8.0, // Excellent value for clay-aged
    eei: 7.0, // Interesting experience
    tastingNotes: 'Clay-aged smoothness, mineral depth, subtle smoke.',
    story: 'Aged in clay pots, traditional method.',
    whereToBuy: ['Astor Wines', 'K&L Wine']
  },
  // HIDDEN GEMS - Low Value (expensive), High Experience
  {
    id: 'us-6',
    name: 'Pechuga',
    brand: 'Del Maguey',
    agave: 'Espadín',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Florencio Carlos',
    method: 'ancestral',
    abv: 49,
    price: 200,
    priceRange: 'luxury',
    availability: 'hard',
    market: 'us',
    flavor: {
      smoke: 8, sweetness: 6, funk: 7, herbal: 8,
      fruit: 10, spice: 3, mineral: 9, complexity: 10
    },
    evi: 4.0, // Expensive for what you get
    eei: 9.5, // Transcendent experience
    tastingNotes: 'Wild fruits, herbs, subtle meat essence, ethereal complexity.',
    story: 'Distilled with wild fruits, spices, and raw chicken breast. Ceremonial.',
    expertQuote: '"Not for beginners. This is PhD-level mezcal."',
    expertSource: 'Doug Frost, MS, MW',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-7',
    name: 'Tobalá',
    brand: 'Del Maguey',
    agave: 'Tobalá',
    region: 'San Luis del Río, Oaxaca',
    producer: 'Paciano Cruz',
    method: 'artisanal',
    abv: 45,
    price: 120,
    priceRange: 'premium',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 5, sweetness: 5, funk: 8, herbal: 7,
      fruit: 10, spice: 5, mineral: 10, complexity: 9
    },
    evi: 5.0, // Pricey but worth it
    eei: 8.5, // Excellent experience
    tastingNotes: 'Floral, tropical fruit, mineral depth, elegant.',
    story: 'Wild-harvested Tobalá from high altitude.',
    expertQuote: '"The agave that separates the curious from the committed."',
    expertSource: 'Alvin Starkman',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-8',
    name: 'Arroqueño',
    brand: 'El Jolgorio',
    agave: 'Arroqueño',
    region: 'San Baltazar Guelavila, Oaxaca',
    producer: 'Various producers',
    method: 'artisanal',
    abv: 47,
    price: 140,
    priceRange: 'premium',
    availability: 'hard',
    market: 'us',
    flavor: {
      smoke: 5, sweetness: 2, funk: 7, herbal: 9,
      fruit: 9, spice: 8, mineral: 10, complexity: 10
    },
    evi: 4.5, // Expensive
    eei: 8.5, // Excellent
    tastingNotes: 'Intense minerality, herbs, stone fruit, long finish.',
    story: '15-20 year maturation makes this rare and complex.',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-9',
    name: 'Madrecuixe',
    brand: 'Vago',
    agave: 'Madrecuixe',
    region: 'Candelaria Yegolé, Oaxaca',
    producer: 'Aquilino García López',
    method: 'artisanal',
    abv: 47.8,
    price: 95,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 1, funk: 7, herbal: 9,
      fruit: 4, spice: 8, mineral: 8, complexity: 9
    },
    evi: 6.5, // Decent value
    eei: 8.5, // Excellent experience
    tastingNotes: 'Herbal intensity, green pepper, wet stone, complex.',
    story: 'Aquilino\'s Madrecuixe is legendary among aficionados.',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-10',
    name: 'Tepeztate',
    brand: 'Vago',
    agave: 'Tepeztate',
    region: 'Miahuatlán, Oaxaca',
    producer: 'Tío Rey',
    method: 'artisanal',
    abv: 51.4,
    price: 130,
    priceRange: 'premium',
    availability: 'hard',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 3, funk: 9, herbal: 10,
      fruit: 7, spice: 10, mineral: 10, complexity: 10
    },
    evi: 5.0, // Expensive
    eei: 9.5, // Mind-blowing
    tastingNotes: 'Wild, funky, herbal explosion. Green pepper, wet slate, long finish.',
    story: '25+ year maturation. Tío Rey\'s masterpiece.',
    expertQuote: '"The complexity rivals the finest single malts."',
    expertSource: 'Doug Frost, MS, MW',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  // OVERPRICED - High Value, Low Experience (good deals but boring)
  {
    id: 'us-11',
    name: 'Joven',
    brand: 'Montelobos',
    agave: 'Espadín',
    region: 'Santiago Matatlán, Oaxaca',
    producer: 'Iván Saldaña',
    method: 'artisanal',
    abv: 43.2,
    price: 38,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 5, funk: 2, herbal: 4,
      fruit: 3, spice: 1, mineral: 1, complexity: 3
    },
    evi: 7.0, // Good value
    eei: 4.0, // Boring experience
    tastingNotes: 'Clean, simple, approachable. Light smoke.',
    story: 'Designed for cocktails and mass market.',
    whereToBuy: ['Total Wine', 'BevMo', 'Most liquor stores']
  },
  {
    id: 'us-12',
    name: 'Espadin',
    brand: 'Ilegal',
    agave: 'Espadín',
    region: 'Tlacolula, Oaxaca',
    producer: 'Various producers',
    method: 'artisanal',
    abv: 40,
    price: 40,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 4, funk: 3, herbal: 5,
      fruit: 5, spice: 4, mineral: 6, complexity: 3
    },
    evi: 6.5, // Decent value
    eei: 4.0, // Nothing special
    tastingNotes: 'Balanced, approachable, cocktail-friendly.',
    story: 'Started as a bar in Guatemala, now mass produced.',
    whereToBuy: ['Total Wine', 'BevMo', 'Most liquor stores']
  },
  {
    id: 'us-13',
    name: 'Joven',
    brand: 'Sombra',
    agave: 'Espadín',
    region: 'San Juan del Río, Oaxaca',
    producer: 'Richard Betts',
    method: 'artisanal',
    abv: 45,
    price: 35,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 8, sweetness: 4, funk: 3, herbal: 4,
      fruit: 2, spice: 4, mineral: 6, complexity: 4
    },
    evi: 7.5, // Good value
    eei: 4.5, // Meh experience
    tastingNotes: 'Smoky, straightforward, good for cocktails.',
    story: 'Sustainable practices, carbon neutral.',
    whereToBuy: ['Total Wine', 'BevMo']
  },
  {
    id: 'us-14',
    name: 'Mezcal',
    brand: 'Gracias a Dios',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 45,
    price: 42,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 4, funk: 1, herbal: 4,
      fruit: 4, spice: 1, mineral: 5, complexity: 5
    },
    evi: 6.0, // OK value
    eei: 4.0, // Boring
    tastingNotes: 'Clean, simple, unremarkable.',
    story: 'Mass market brand.',
    whereToBuy: ['Total Wine']
  },
  {
    id: 'us-15',
    name: 'Blanco',
    brand: 'Mezcal Vago Elote',
    agave: 'Espadín',
    region: 'Candelaria Yegolé, Oaxaca',
    producer: 'Aquilino García López',
    method: 'artisanal',
    abv: 50.3,
    price: 75,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 7, funk: 2, herbal: 5,
      fruit: 4, spice: 3, mineral: 7, complexity: 7
    },
    evi: 5.5, // Borderline value
    eei: 5.0, // Average experience
    tastingNotes: 'Corn sweetness from elote distillation. Interesting but one-note.',
    story: 'Distilled with roasted corn. Novelty.',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  // SKIP THESE - Low Value, Low Experience
  {
    id: 'us-16',
    name: 'Joven',
    brand: 'Casamigos',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 40,
    price: 55,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 8, funk: 1, herbal: 1,
      fruit: 5, spice: 1, mineral: 2, complexity: 2
    },
    evi: 2.0, // Terrible value
    eei: 2.0, // Terrible experience
    tastingNotes: 'Sweet, simple, no character. Celebrity marketing.',
    story: 'George Clooney\'s brand. Sold for $1B. Not for mezcal lovers.',
    whereToBuy: ['Everywhere']
  },
  {
    id: 'us-17',
    name: 'Artesanal',
    brand: 'Clase Azul',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 42,
    price: 150,
    priceRange: 'premium',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 8, funk: 1, herbal: 2,
      fruit: 2, spice: 2, mineral: 1, complexity: 2
    },
    evi: 1.0, // Worst value
    eei: 2.0, // Boring
    tastingNotes: 'Sweet, simple, additives suspected. Pretty bottle.',
    story: 'All marketing, no soul. Additives reported.',
    whereToBuy: ['Everywhere']
  },
  {
    id: 'us-18',
    name: 'Espadin',
    brand: 'Dos Hombres',
    agave: 'Espadín',
    region: 'San Luis del Río, Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 42,
    price: 48,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 6, funk: 1, herbal: 3,
      fruit: 5, spice: 2, mineral: 1, complexity: 2
    },
    evi: 3.0, // Poor value
    eei: 3.0, // Boring
    tastingNotes: 'Simple, unremarkable. Celebrity brand.',
    story: 'Bryan Cranston & Aaron Paul. Marketing over quality.',
    whereToBuy: ['Total Wine', 'Most liquor stores']
  },
  {
    id: 'us-19',
    name: 'Joven',
    brand: '400 Conejos',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 40,
    price: 25,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 4, funk: 1, herbal: 3,
      fruit: 1, spice: 1, mineral: 3, complexity: 1
    },
    evi: 5.0, // OK value for price
    eei: 3.0, // Boring
    tastingNotes: 'Smoky, simple, harsh finish.',
    story: 'Mass market budget option.',
    whereToBuy: ['Total Wine', 'BevMo']
  },
  {
    id: 'us-20',
    name: 'Reposado',
    brand: 'Zignum',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 38,
    price: 30,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 5, funk: 1, herbal: 1,
      fruit: 3, spice: 1, mineral: 1, complexity: 2
    },
    evi: 3.5, // Poor value
    eei: 2.0, // Very boring
    tastingNotes: 'Oak-aged, sweet, no mezcal character.',
    story: 'Trying to be tequila. Missing the point.',
    whereToBuy: ['Total Wine']
  },
  // MORE GRAIL BOTTLES
  {
    id: 'us-21',
    name: 'San Martin',
    brand: 'Del Maguey',
    agave: 'Espadín',
    region: 'San Martín Tilcajete, Oaxaca',
    producer: 'Espiridión Morales Luis',
    method: 'artisanal',
    abv: 49,
    price: 75,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 8, sweetness: 2, funk: 8, herbal: 9,
      fruit: 5, spice: 8, mineral: 7, complexity: 10
    },
    evi: 7.5, // Good value
    eei: 7.5, // Great experience
    tastingNotes: 'Bold smoke, mineral, herbal depth. Village character.',
    story: 'Known for wood carving, also makes excellent mezcal.',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-22',
    name: 'Cuixe',
    brand: 'Bozal',
    agave: 'Cuixe',
    region: 'San Agustín Amatengo, Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 47,
    price: 70,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 1, funk: 5, herbal: 10,
      fruit: 7, spice: 8, mineral: 7, complexity: 8
    },
    evi: 7.0, // Good value
    eei: 7.5, // Great experience
    tastingNotes: 'Herbal, earthy, mineral. Wild agave character.',
    story: 'Cuixe (Karwinskii family) offers unique herbal profile.',
    whereToBuy: ['Total Wine', 'K&L Wine']
  },
  {
    id: 'us-23',
    name: 'Ensamble',
    brand: 'Vago',
    agave: 'Espadín/Cuixe',
    region: 'Sola de Vega, Oaxaca',
    producer: 'Salomón Rey Rodriguez',
    method: 'artisanal',
    abv: 50.9,
    price: 65,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 5, sweetness: 3, funk: 6, herbal: 9,
      fruit: 4, spice: 7, mineral: 8, complexity: 9
    },
    evi: 8.0, // Excellent value
    eei: 7.5, // Great experience
    tastingNotes: 'Balanced blend, herbal, mineral, complex.',
    story: 'Salomón\'s ensamble showcases blending artistry.',
    whereToBuy: ['K&L Wine', 'Astor Wines']
  },
  {
    id: 'us-24',
    name: 'Mexicano',
    brand: 'Bozal',
    agave: 'Mexicano',
    region: 'Durango',
    producer: 'Various',
    method: 'artisanal',
    abv: 47,
    price: 55,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 3, funk: 3, herbal: 6,
      fruit: 7, spice: 2, mineral: 5, complexity: 9
    },
    evi: 7.5, // Good value
    eei: 6.5, // Good experience
    tastingNotes: 'Fruity, floral, different terroir from Oaxaca.',
    story: 'Durango mezcal offers different character.',
    whereToBuy: ['Total Wine', 'K&L Wine']
  },
  {
    id: 'us-25',
    name: 'Cenizo',
    brand: 'Bozal',
    agave: 'Cenizo',
    region: 'Durango',
    producer: 'Various',
    method: 'artisanal',
    abv: 47,
    price: 60,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 2, funk: 7, herbal: 8,
      fruit: 3, spice: 8, mineral: 7, complexity: 7
    },
    evi: 7.0, // Good value
    eei: 7.0, // Good experience
    tastingNotes: 'Earthy, mineral, herbal. Durango character.',
    story: 'Cenizo is the signature agave of Durango.',
    whereToBuy: ['Total Wine', 'K&L Wine']
  }
];

// MEXICO MARKET - Top 25 Extraordinary Bottles
export const mexicoMezcals: Mezcal[] = [
  // THE GRAIL - High Value, High Experience
  {
    id: 'mx-1',
    name: 'Espadín',
    brand: 'Real Minero',
    agave: 'Espadín',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 65,
    priceRange: 'mid',
    availability: 'hard',
    market: 'mexico',
    flavor: {
      smoke: 6, sweetness: 5, funk: 7, herbal: 8,
      fruit: 8, spice: 7, mineral: 10, complexity: 10
    },
    evi: 9.0, // Incredible value for quality
    eei: 9.0, // Transcendent
    tastingNotes: 'Clay pot purity, mineral depth, floral elegance. Ancestral perfection.',
    story: 'Four generations of women making mezcal. Withdrew from CRM to protect tradition.',
    expertQuote: '"Porque sólo lo auténtico perdura. (Only the authentic endures)"',
    expertSource: 'Graciela Ángeles Carreño',
    whereToBuy: ['Real Minero palenque', 'In Situ Oaxaca']
  },
  {
    id: 'mx-2',
    name: 'Largo',
    brand: 'Real Minero',
    agave: 'Largo',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 90,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 3, sweetness: 6, funk: 9, herbal: 10,
      fruit: 7, spice: 6, mineral: 10, complexity: 10
    },
    evi: 8.5, // Great value for rare agave
    eei: 10.0, // Peak experience
    tastingNotes: 'Profound minerality. Wet slate, herbs, ethereal.',
    story: 'Largo is extremely rare. This is the definitive expression.',
    whereToBuy: ['Real Minero palenque only']
  },
  {
    id: 'mx-3',
    name: 'Espadín Capón',
    brand: 'Fane Kantsini',
    agave: 'Espadín',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 49,
    price: 125,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'mexico',
    flavor: {
      smoke: 6, sweetness: 6, funk: 5, herbal: 9,
      fruit: 8, spice: 3, mineral: 8, complexity: 8
    },
    evi: 6.0, // Premium price for ultra-exclusive
    eei: 8.0, // Excellent
    tastingNotes: 'Capón Espadín. Sweeter, more concentrated. Clay-pot distilled ancestral method.',
    story: 'The matriarchs\' capón expression. Rich and balanced. Tres Colibrí cooperative produces only 90 liters per batch.',
    whereToBuy: ['Mezcalia CDMX (Roma Norte)', 'Direct from cooperative in Oaxaca']
  },
  {
    id: 'mx-4',
    name: 'Tobalá',
    brand: 'Mezcaloteca',
    agave: 'Tobalá',
    region: 'San Baltazar Guelavila, Oaxaca',
    producer: 'Village producers',
    method: 'ancestral',
    abv: 48,
    price: 70,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 3, sweetness: 5, funk: 2, herbal: 9,
      fruit: 10, spice: 3, mineral: 10, complexity: 9
    },
    evi: 8.0, // Great value
    eei: 8.5, // Excellent
    tastingNotes: 'Floral, tropical, mineral. Wild Tobalá perfection.',
    story: 'Mezcaloteca curates the best from village producers.',
    expertQuote: '"Mezcaloteca is a library, not a bar."',
    expertSource: 'Marco Ochoa',
    whereToBuy: ['Mezcaloteca Oaxaca']
  },
  {
    id: 'mx-5',
    name: 'Jabalí',
    brand: '5 Sentidos',
    agave: 'Jabalí',
    region: 'San Juan del Río, Oaxaca',
    producer: 'Alberto Ortiz',
    method: 'ancestral',
    abv: 48,
    price: 85,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 3, funk: 10, herbal: 10,
      fruit: 3, spice: 7, mineral: 8, complexity: 9
    },
    evi: 7.5, // Good value for rare agave
    eei: 9.0, // Wild experience
    tastingNotes: 'Wild, funky, cheese notes. Not for beginners.',
    story: 'Jabalí is notoriously difficult to ferment. Alberto masters it.',
    whereToBuy: ['In Situ', 'Direct from 5 Sentidos']
  },
  // HIDDEN GEMS - Low Value (expensive), High Experience
  {
    id: 'mx-6',
    name: 'Tobalá de Montaña',
    brand: 'Real Minero',
    agave: 'Tobalá',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 150,
    priceRange: 'luxury',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 3, funk: 7, herbal: 8,
      fruit: 10, spice: 6, mineral: 10, complexity: 10
    },
    evi: 5.0, // Expensive
    eei: 10.0, // Transcendent
    tastingNotes: 'High altitude Tobalá. Ethereal, transcendent.',
    story: 'The pinnacle of Tobalá expression. Clay pot perfection.',
    whereToBuy: ['Real Minero palenque only']
  },
  {
    id: 'mx-7',
    name: 'Tepemete',
    brand: 'Lalocura',
    agave: 'Tepemete',
    region: 'San Pablo Ameyaltepec, Oaxaca',
    producer: 'Eduardo Ángeles',
    method: 'ancestral',
    abv: 48,
    price: 120,
    priceRange: 'premium',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 6, funk: 9, herbal: 10,
      fruit: 5, spice: 8, mineral: 10, complexity: 10
    },
    evi: 5.5, // Borderline
    eei: 9.5, // Incredible
    tastingNotes: 'Mountain agave. Herbal, mineral, intense.',
    story: 'Grows at high altitude. Intense terroir expression.',
    whereToBuy: ['Lalocura palenque']
  },
  {
    id: 'mx-8',
    name: 'Arroqueño Silvestre',
    brand: 'Real Minero',
    agave: 'Arroqueño',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 140,
    priceRange: 'premium',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 3, funk: 8, herbal: 9,
      fruit: 9, spice: 7, mineral: 10, complexity: 10
    },
    evi: 5.0, // Expensive
    eei: 9.5, // Incredible
    tastingNotes: 'Wild Arroqueño. More complex than cultivated versions.',
    story: 'Wild-harvested Arroqueño, clay pot distilled.',
    whereToBuy: ['Real Minero palenque']
  },
  {
    id: 'mx-9',
    name: 'Chino',
    brand: 'Lalocura',
    agave: 'Chino',
    region: 'San Pablo Ameyaltepec, Oaxaca',
    producer: 'Eduardo Ángeles',
    method: 'ancestral',
    abv: 48,
    price: 110,
    priceRange: 'premium',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 7, sweetness: 2, funk: 8, herbal: 10,
      fruit: 9, spice: 4, mineral: 9, complexity: 10
    },
    evi: 5.5, // Borderline
    eei: 8.5, // Excellent
    tastingNotes: 'Curly-leaved agave. Herbal, mineral, elegant.',
    story: 'Named for its curly leaves. Rare and distinctive.',
    whereToBuy: ['Lalocura palenque']
  },
  {
    id: 'mx-10',
    name: 'Pechuga de Mole',
    brand: 'Real Minero',
    agave: 'Espadín',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 180,
    priceRange: 'luxury',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 6, sweetness: 5, funk: 7, herbal: 8,
      fruit: 8, spice: 8, mineral: 10, complexity: 10
    },
    evi: 4.5, // Expensive
    eei: 10.0, // Peak
    tastingNotes: 'Mole spices, chocolate, chiles, fruit. Ceremonial.',
    story: 'Distilled with mole ingredients. Sacred.',
    whereToBuy: ['Real Minero palenque only']
  },
  // OVERPRICED - High Value, Low Experience
  {
    id: 'mx-11',
    name: 'Espadín',
    brand: 'Los Danzantes',
    agave: 'Espadín',
    region: 'Santiago Matatlán, Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 47,
    price: 35,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 3, sweetness: 6, funk: 3, herbal: 4,
      fruit: 5, spice: 3, mineral: 2, complexity: 5
    },
    evi: 6.5, // OK value
    eei: 4.0, // Boring
    tastingNotes: 'Clean, simple, approachable.',
    story: 'Restaurant brand. Consistent but uninspiring.',
    whereToBuy: ['Los Danzantes restaurants', 'Oaxaca shops']
  },
  {
    id: 'mx-12',
    name: 'Joven',
    brand: 'Alipús',
    agave: 'Espadín',
    region: 'San Andrés, Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 47,
    price: 30,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 8, sweetness: 6, funk: 3, herbal: 3,
      fruit: 6, spice: 2, mineral: 3, complexity: 4
    },
    evi: 7.0, // Good value
    eei: 4.5, // Average
    tastingNotes: 'Village-specific but mass produced.',
    story: 'Good introduction but lacks depth.',
    whereToBuy: ['Oaxaca shops', 'Mexico City']
  },
  {
    id: 'mx-13',
    name: 'Reposado',
    brand: 'Koch',
    agave: 'Espadín',
    region: 'Santiago Matatlán, Oaxaca',
    producer: 'Carlos Méndez',
    method: 'artisanal',
    abv: 47,
    price: 40,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 6, funk: 1, herbal: 2,
      fruit: 3, spice: 2, mineral: 3, complexity: 3
    },
    evi: 5.5, // Borderline
    eei: 3.5, // Boring
    tastingNotes: 'Oak-aged, loses mezcal character.',
    story: 'Trying to appeal to tequila drinkers.',
    whereToBuy: ['Mexico City', 'Oaxaca']
  },
  {
    id: 'mx-14',
    name: 'Blanco',
    brand: 'Meteoro',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 45,
    price: 25,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 5, sweetness: 2, funk: 1, herbal: 4,
      fruit: 5, spice: 2, mineral: 5, complexity: 1
    },
    evi: 6.0, // OK value
    eei: 3.5, // Boring
    tastingNotes: 'Simple, smoky, nothing special.',
    story: 'Budget brand.',
    whereToBuy: ['Oaxaca shops']
  },
  {
    id: 'mx-15',
    name: 'Espadín',
    brand: 'Wahaka',
    agave: 'Espadín',
    region: 'San Dionisio Ocotepec, Oaxaca',
    producer: 'Alberto Morales',
    method: 'artisanal',
    abv: 45,
    price: 35,
    priceRange: 'budget',
    availability: 'moderate',
    market: 'mexico',
    flavor: {
      smoke: 7, sweetness: 7, funk: 1, herbal: 6,
      fruit: 4, spice: 3, mineral: 5, complexity: 4
    },
    evi: 6.5, // OK value
    eei: 4.5, // Average
    tastingNotes: 'Balanced, approachable, unremarkable.',
    story: 'Solid but not exciting.',
    whereToBuy: ['Oaxaca shops', 'Mexico City']
  },
  // SKIP THESE - Low Value, Low Experience
  {
    id: 'mx-16',
    name: 'Gusano Rojo',
    brand: 'Gusano Rojo',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 38,
    price: 20,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 6, funk: 1, herbal: 1,
      fruit: 2, spice: 1, mineral: 1, complexity: 2
    },
    evi: 3.0, // Poor
    eei: 2.0, // Terrible
    tastingNotes: 'Worm in bottle. Tourist trap.',
    story: 'The worm is marketing, not tradition.',
    whereToBuy: ['Tourist shops']
  },
  {
    id: 'mx-17',
    name: 'Monte Alban',
    brand: 'Monte Alban',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 40,
    price: 18,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 1, funk: 1, herbal: 1,
      fruit: 1, spice: 3, mineral: 2, complexity: 1
    },
    evi: 3.5, // Poor
    eei: 2.0, // Terrible
    tastingNotes: 'Harsh, industrial, worm included.',
    story: 'Mass market tourist mezcal.',
    whereToBuy: ['Tourist shops', 'Airports']
  },
  {
    id: 'mx-18',
    name: 'Scorpion',
    brand: 'Scorpion',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 40,
    price: 22,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 3, funk: 2, herbal: 1,
      fruit: 2, spice: 1, mineral: 2, complexity: 1
    },
    evi: 2.5, // Poor
    eei: 2.0, // Terrible
    tastingNotes: 'Scorpion in bottle. Gimmick.',
    story: 'Pure marketing, no quality.',
    whereToBuy: ['Tourist shops']
  },
  {
    id: 'mx-19',
    name: 'Crema de Mezcal',
    brand: 'Various',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Various',
    method: 'artisanal',
    abv: 25,
    price: 15,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 10, funk: 1, herbal: 1,
      fruit: 1, spice: 1, mineral: 1, complexity: 1
    },
    evi: 2.0, // Terrible
    eei: 1.5, // Worst
    tastingNotes: 'Sweet cream liqueur. Not real mezcal.',
    story: 'Tourist product.',
    whereToBuy: ['Tourist shops']
  },
  {
    id: 'mx-20',
    name: 'Mezcal Joven',
    brand: 'Beneva',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'artisanal',
    abv: 38,
    price: 20,
    priceRange: 'budget',
    availability: 'easy',
    market: 'mexico',
    flavor: {
      smoke: 4, sweetness: 6, funk: 1, herbal: 1,
      fruit: 2, spice: 2, mineral: 3, complexity: 1
    },
    evi: 4.0, // Poor
    eei: 3.0, // Boring
    tastingNotes: 'Simple, unremarkable.',
    story: 'Mass market brand.',
    whereToBuy: ['Supermarkets']
  },
  // MORE GRAIL BOTTLES
  {
    id: 'mx-21',
    name: 'Coyote',
    brand: '5 Sentidos',
    agave: 'Coyote',
    region: 'San Cristóbal Lachirioag, Oaxaca',
    producer: 'Alberto Ortiz',
    method: 'ancestral',
    abv: 48,
    price: 75,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 6, sweetness: 4, funk: 8, herbal: 10,
      fruit: 6, spice: 7, mineral: 10, complexity: 10
    },
    evi: 8.0, // Great value
    eei: 9.0, // Excellent
    tastingNotes: 'Village-specific Coyote. Wild, herbal, mineral.',
    story: 'Each village\'s Coyote tastes different. This is Alberto\'s.',
    whereToBuy: ['In Situ', 'Direct from 5 Sentidos']
  },
  {
    id: 'mx-22',
    name: 'Madrecuixe',
    brand: 'Lalocura',
    agave: 'Madrecuixe',
    region: 'San Pablo Ameyaltepec, Oaxaca',
    producer: 'Eduardo Ángeles',
    method: 'ancestral',
    abv: 49,
    price: 95,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 4, sweetness: 5, funk: 8, herbal: 9,
      fruit: 3, spice: 8, mineral: 10, complexity: 10
    },
    evi: 7.0, // Good value
    eei: 9.0, // Excellent
    tastingNotes: 'Wild-harvested. Herbal intensity, mineral depth.',
    story: 'Eduardo\'s Madrecuixe is legendary.',
    whereToBuy: ['Lalocura palenque']
  },
  {
    id: 'mx-23',
    name: 'Barril',
    brand: 'Lalocura',
    agave: 'Barril',
    region: 'San Pablo Ameyaltepec, Oaxaca',
    producer: 'Eduardo Ángeles',
    method: 'ancestral',
    abv: 49,
    price: 90,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 4, funk: 6, herbal: 7,
      fruit: 9, spice: 5, mineral: 8, complexity: 10
    },
    evi: 7.5, // Good value
    eei: 8.0, // Excellent
    tastingNotes: 'Barrel-shaped agave. Rich, complex.',
    story: 'Barril offers unique sweetness and depth.',
    whereToBuy: ['Lalocura palenque']
  },
  {
    id: 'mx-24',
    name: 'Cuishe',
    brand: 'Mezcaloteca',
    agave: 'Cuishe',
    region: 'Miahuatlán, Oaxaca',
    producer: 'Village producers',
    method: 'ancestral',
    abv: 48,
    price: 65,
    priceRange: 'mid',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 3, funk: 5, herbal: 9,
      fruit: 4, spice: 7, mineral: 10, complexity: 10
    },
    evi: 8.0, // Great value
    eei: 8.0, // Excellent
    tastingNotes: 'Wild Cuishe. Herbal, earthy, balanced.',
    story: 'Wild-harvested Cuishe from Miahuatlán.',
    whereToBuy: ['Mezcaloteca Oaxaca']
  },
  {
    id: 'mx-25',
    name: 'Tepeztate',
    brand: 'Real Minero',
    agave: 'Tepeztate',
    region: 'Santa Catarina Minas, Oaxaca',
    producer: 'Graciela Ángeles Carreño',
    method: 'ancestral',
    abv: 51,
    price: 100,
    priceRange: 'premium',
    availability: 'rare',
    market: 'mexico',
    flavor: {
      smoke: 3, sweetness: 1, funk: 10, herbal: 10,
      fruit: 4, spice: 10, mineral: 10, complexity: 10
    },
    evi: 7.5, // Good value for what it is
    eei: 10.0, // Peak experience
    tastingNotes: 'Wild, funky, herbal explosion. Wet slate, long finish.',
    story: '25+ year maturation. Clay pot distilled. The ultimate.',
    expertQuote: '"Terroir matters more in mezcal than almost any other spirit."',
    expertSource: 'Doug Frost, MS, MW',
    whereToBuy: ['Real Minero palenque']
  },
  // FANE KANTSINI COLLECTION - The Matriarchs' Portfolio
  // Ultra-exclusive cooperative from Sierra Sur. Most bottles only available in Mexico.
  // US availability extremely limited through specialty importers like Raíces Imports.
  {
    id: 'mx-26',
    name: 'Chuparrosas',
    brand: 'Fane Kantsini',
    agave: 'Chuparrosas',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 52,
    price: 200,
    priceRange: 'luxury',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 2, funk: 7, herbal: 10,
      fruit: 8, spice: 4, mineral: 10, complexity: 10
    },
    evi: 5.0, // Ultra-exclusive pricing
    eei: 10.0, // Transcendent
    tastingNotes: 'The Tasmanian Tiger of agaves. Floral, ethereal, impossibly complex. History in a glass.',
    story: 'Almost extinct. Sósima is one of the few guardians of this wild agave. Each bottle is a piece of resistance. Micro-batches of 90 liters.',
    expertQuote: '"This is the Tasmanian Tiger of agaves. It\'s almost extinct. This is history in a glass."',
    expertSource: 'Tony Aoun',
    whereToBuy: ['Mezcalia CDMX (Roma Norte)', 'Koven Spirits CDMX', 'Direct from cooperative']
  },
  {
    id: 'mx-27',
    name: 'Pelon Verde',
    brand: 'Fane Kantsini',
    agave: 'Pelon Verde',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 55,
    price: 160,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'both',
    flavor: {
      smoke: 3, sweetness: 2, funk: 9, herbal: 10,
      fruit: 5, spice: 10, mineral: 9, complexity: 9
    },
    evi: 5.5, // Premium pricing
    eei: 9.0, // Excellent
    tastingNotes: '55 degrees. Not for the faint of heart. You can taste the earth, the smoke, the hands that made it.',
    story: 'The high-proof expression that showcases the matriarchs\' mastery. Fire and finesse. One of the few Fane Kantsini expressions occasionally found in the US.',
    expertQuote: '"This is 55 degrees. This is not for the faint of heart."',
    expertSource: 'Tony Aoun',
    whereToBuy: ['K&L Wine (CA) - $159.99', 'Pogo\'s Wine (TX) - $158.99', 'Mezcalia CDMX']
  },
  {
    id: 'mx-28',
    name: 'Tobalá',
    brand: 'Fane Kantsini',
    agave: 'Tobalá',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 48,
    price: 180,
    priceRange: 'luxury',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'mexico',
    flavor: {
      smoke: 1, sweetness: 5, funk: 7, herbal: 8,
      fruit: 10, spice: 2, mineral: 9, complexity: 10
    },
    evi: 5.0, // Ultra-exclusive pricing
    eei: 9.0, // Excellent
    tastingNotes: 'Wild Tobalá from the Sierra Sur. Floral, tropical, profound mineral depth.',
    story: 'The cooperative plants twenty magueyes for every ten they harvest. Sustainability as religion. Micro-batches only.',
    whereToBuy: ['Mezcalia CDMX (Roma Norte)', 'Koven Spirits CDMX', 'Direct from cooperative']
  },
  {
    id: 'mx-29',
    name: 'Madre Cuishe',
    brand: 'Fane Kantsini',
    agave: 'Madre Cuishe',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 49,
    price: 170,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'mexico',
    flavor: {
      smoke: 4, sweetness: 4, funk: 7, herbal: 9,
      fruit: 5, spice: 7, mineral: 10, complexity: 10
    },
    evi: 5.5, // Premium pricing
    eei: 8.5, // Excellent
    tastingNotes: 'Wild-harvested Madre Cuishe. Herbal intensity, mineral backbone, long finish.',
    story: 'The matriarchs\' wild agave expression. Communal over commercial. Micro-batches only.',
    whereToBuy: ['Mezcalia CDMX (Roma Norte)', 'Koven Spirits CDMX', 'Direct from cooperative']
  },
  {
    id: 'mx-30',
    name: 'Tepeztate',
    brand: 'Fane Kantsini',
    agave: 'Tepeztate',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 50,
    price: 150,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'mexico',
    flavor: {
      smoke: 2, sweetness: 1, funk: 9, herbal: 10,
      fruit: 7, spice: 10, mineral: 10, complexity: 10
    },
    evi: 6.0, // Premium pricing for rare agave
    eei: 9.5, // Near transcendent
    tastingNotes: '25+ year maturation. Wild, funky, herbal. The spirit of the glitch.',
    story: 'Tepeztate takes decades to mature. This is patience distilled. Koven Spirits in CDMX sometimes has this on sale.',
    expertQuote: '"Sósima, she\'s a genius. She\'s an absolute genius."',
    expertSource: 'Tony Aoun',
    whereToBuy: ['Koven Spirits CDMX - $75 on sale', 'Mezcalia CDMX (Roma Norte)', 'Direct from cooperative']
  },
  {
    id: 'mx-31',
    name: 'Chato',
    brand: 'Fane Kantsini',
    agave: 'Chato (Agave seemanniana)',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 48,
    price: 170,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'both',
    flavor: {
      smoke: 3, sweetness: 3, funk: 8, herbal: 9,
      fruit: 6, spice: 5, mineral: 10, complexity: 9
    },
    evi: 5.5, // Premium pricing
    eei: 9.0, // Excellent
    tastingNotes: 'Earthy minerals, herbal freshness, savory complexity. Clay-pot distilled.',
    story: 'Chato (Agave seemanniana) from the Sierra Sur. One of the few Fane Kantsini expressions available in the US through specialty importers.',
    whereToBuy: ['K&L Wine (CA) - $170', 'Travis Heights Wine (TX) - $155.99', 'Mezcalia CDMX']
  },
  {
    id: 'mx-32',
    name: 'Coyote',
    brand: 'Fane Kantsini',
    agave: 'Coyote (Agave americana)',
    region: 'San Miguel Suchiltepec, Oaxaca',
    producer: 'Sósima Olivera / Tres Colibrí Cooperative',
    method: 'ancestral',
    abv: 50,
    price: 170,
    priceRange: 'premium',
    pricingType: 'retail',
    lotSize: 'micro',
    availability: 'unicorn',
    market: 'both',
    flavor: {
      smoke: 4, sweetness: 4, funk: 7, herbal: 8,
      fruit: 5, spice: 8, mineral: 9, complexity: 9
    },
    evi: 5.5, // Premium pricing
    eei: 8.5, // Excellent
    tastingNotes: 'Agave americana expression. Earthy, herbal, with warming spice. 6-year maturation.',
    story: 'Coyote from the Chontal highlands. Micro-batches of 90 liters. Available at select US retailers.',
    whereToBuy: ['K&L Wine (CA) - $170', 'Mezcalia CDMX - $125 (~2,181 MXN)']
  }
];

// SKIP THESE - Celebrity brands, industrial, overmarketed
// Low EVI (poor value), Low EEI (boring experience)
export const skipTheseMezcals: Mezcal[] = [
  {
    id: 'skip-1',
    name: 'Mezcal',
    brand: 'Casamigos',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial contractor',
    method: 'industrial',
    abv: 40,
    price: 55,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 5, funk: 1, herbal: 2,
      fruit: 2, spice: 1, mineral: 1, complexity: 2
    },
    evi: 2.0, // Terrible value - celebrity markup
    eei: 2.5, // Boring, one-dimensional
    tastingNotes: 'Sweet, simple, designed to not offend. Agave-flavored vodka.',
    story: 'George Clooney\'s cash grab. Sold to Diageo for $1B. The mezcal equivalent of selling out.',
    whereToBuy: ['Every liquor store', 'Target', 'Costco']
  },
  {
    id: 'skip-2',
    name: 'Joven',
    brand: 'Clase Azul',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial facility',
    method: 'industrial',
    abv: 40,
    price: 170,
    priceRange: 'luxury',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 7, funk: 1, herbal: 1,
      fruit: 4, spice: 2, mineral: 1, complexity: 2
    },
    evi: 1.5, // Absurd price for mediocre liquid
    eei: 2.0, // Pretty bottle, boring mezcal
    tastingNotes: 'Sweet, smooth, inoffensive. You\'re paying for the ceramic bottle.',
    story: 'The bottle costs more than the liquid inside. Instagram mezcal for people who don\'t like mezcal.',
    whereToBuy: ['Duty Free', 'Upscale liquor stores']
  },
  {
    id: 'skip-3',
    name: 'Espadin',
    brand: 'Dos Hombres',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract distillery',
    method: 'artisanal',
    abv: 42,
    price: 50,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 4, funk: 1, herbal: 3,
      fruit: 2, spice: 1, mineral: 1, complexity: 1
    },
    evi: 3.0, // Celebrity tax
    eei: 3.5, // Decent but unremarkable
    tastingNotes: 'Inoffensive smoke, mild sweetness. Breaking Bad fans only.',
    story: 'Bryan Cranston and Aaron Paul\'s vanity project. Better than Casamigos, still a cash grab.',
    whereToBuy: ['Total Wine', 'BevMo', 'Most liquor stores']
  },
  {
    id: 'skip-4',
    name: 'Reposado',
    brand: 'Gusano Rojo',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'industrial',
    abv: 38,
    price: 25,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 3, funk: 2, herbal: 2,
      fruit: 1, spice: 1, mineral: 1, complexity: 1
    },
    evi: 3.5, // Cheap but you get what you pay for
    eei: 2.0, // Harsh, industrial
    tastingNotes: 'Harsh smoke, chemical aftertaste. The worm is a gimmick.',
    story: 'The worm was a marketing ploy from the 1950s. Real mezcal doesn\'t need gimmicks.',
    whereToBuy: ['Everywhere']
  },
  {
    id: 'skip-5',
    name: 'Joven',
    brand: 'Monte Alban',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'industrial',
    abv: 40,
    price: 20,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 2, funk: 1, herbal: 1,
      fruit: 1, spice: 2, mineral: 1, complexity: 1
    },
    evi: 3.0, // Rock bottom price, rock bottom quality
    eei: 1.5, // Headache in a bottle
    tastingNotes: 'Harsh, chemical, with a worm for tourists.',
    story: 'Another worm-in-the-bottle tourist trap. This is what gives mezcal a bad name.',
    whereToBuy: ['Gas stations', 'Walmart']
  },
  {
    id: 'skip-6',
    name: 'Silver',
    brand: 'Scorpion Mezcal',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial',
    method: 'industrial',
    abv: 40,
    price: 30,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 2, funk: 1, herbal: 2,
      fruit: 1, spice: 2, mineral: 1, complexity: 1
    },
    evi: 2.5, // Gimmick pricing
    eei: 2.0, // Scorpion doesn't improve the taste
    tastingNotes: 'Mediocre mezcal with a scorpion. The scorpion adds nothing.',
    story: 'If you need a dead insect to sell your spirit, the spirit isn\'t good enough.',
    whereToBuy: ['Tourist shops', 'Novelty stores']
  },
  {
    id: 'skip-7',
    name: 'Artesanal',
    brand: '400 Conejos',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Large producer',
    method: 'artisanal',
    abv: 40,
    price: 28,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 4, funk: 2, herbal: 3,
      fruit: 2, spice: 1, mineral: 2, complexity: 1
    },
    evi: 4.0, // Decent entry level
    eei: 3.0, // Nothing special
    tastingNotes: 'Generic mezcal flavor. Fine for margaritas, boring neat.',
    story: 'Mass-produced "artisanal" mezcal. The quotes are doing a lot of work.',
    whereToBuy: ['Total Wine', 'Spec\'s']
  },
  {
    id: 'skip-8',
    name: 'Blanco',
    brand: 'Zignum',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Industrial facility',
    method: 'industrial',
    abv: 40,
    price: 35,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 5, funk: 1, herbal: 1,
      fruit: 2, spice: 1, mineral: 1, complexity: 1
    },
    evi: 3.5, // Overpriced for industrial
    eei: 2.5, // Smooth but soulless
    tastingNotes: 'Smooth, sweet, simple. Designed for tequila drinkers.',
    story: 'Industrial mezcal trying to be approachable. Mission accomplished, soul lost.',
    whereToBuy: ['BevMo', 'Total Wine']
  },
  {
    id: 'skip-9',
    name: 'Joven',
    brand: 'Mezcal Union',
    agave: 'Espadín/Cirial blend',
    region: 'Oaxaca',
    producer: 'Large cooperative',
    method: 'artisanal',
    abv: 40,
    price: 32,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 6, funk: 1, herbal: 3,
      fruit: 3, spice: 1, mineral: 2, complexity: 1
    },
    evi: 4.5, // Decent value
    eei: 3.5, // Acceptable but uninspiring
    tastingNotes: 'Balanced, approachable, forgettable.',
    story: 'Claims to support communities but operates at industrial scale. Marketing > substance.',
    whereToBuy: ['Whole Foods', 'Total Wine']
  },
  {
    id: 'skip-10',
    name: 'Espadin',
    brand: 'Creyente',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 40,
    price: 40,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 4, sweetness: 2, funk: 2, herbal: 1,
      fruit: 2, spice: 2, mineral: 1, complexity: 2
    },
    evi: 4.0, // Fair price
    eei: 3.5, // Competent but boring
    tastingNotes: 'Smoke-forward, simple structure. Mixer mezcal.',
    story: 'Bacardi-owned. Corporate mezcal with artisanal marketing.',
    whereToBuy: ['Liquor stores everywhere']
  },
  {
    id: 'skip-11',
    name: 'Joven',
    brand: 'Xicaru',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Medium producer',
    method: 'artisanal',
    abv: 40,
    price: 30,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 5, sweetness: 1, funk: 1, herbal: 3,
      fruit: 1, spice: 1, mineral: 2, complexity: 1
    },
    evi: 4.5, // Good price point
    eei: 3.0, // Basic
    tastingNotes: 'Smoky, simple, serviceable. Nothing wrong, nothing special.',
    story: 'Reliable but unremarkable. The Honda Civic of mezcal.',
    whereToBuy: ['Total Wine', 'Spec\'s']
  },
  {
    id: 'skip-12',
    name: 'Blanco',
    brand: 'Marca Negra',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 49,
    price: 65,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 1, funk: 2, herbal: 2,
      fruit: 1, spice: 6, mineral: 1, complexity: 3
    },
    evi: 4.0, // Overpriced for what it is
    eei: 4.5, // Decent but not worth the premium
    tastingNotes: 'Higher proof, more character than most. Still overpriced.',
    story: 'Stylish bottle, average liquid. Paying for design, not mezcal.',
    whereToBuy: ['Upscale liquor stores']
  },
  {
    id: 'skip-13',
    name: 'Pechuga',
    brand: 'Ilegal',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 40,
    price: 90,
    priceRange: 'premium',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 6, funk: 3, herbal: 4,
      fruit: 7, spice: 2, mineral: 1, complexity: 2
    },
    evi: 3.0, // Expensive for pechuga quality
    eei: 4.5, // Decent but not transcendent
    tastingNotes: 'Fruity, mild smoke, chicken breast distillation. Entry-level pechuga.',
    story: 'Started as bootleg mezcal, now corporate. The rebel became the establishment.',
    whereToBuy: ['Total Wine', 'K&L Wine']
  },
  {
    id: 'skip-14',
    name: 'Reposado',
    brand: 'Ilegal',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 40,
    price: 45,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 5, funk: 1, herbal: 2,
      fruit: 5, spice: 1, mineral: 1, complexity: 1
    },
    evi: 4.0, // Fair price
    eei: 3.5, // Oak masks the mezcal
    tastingNotes: 'Oak-aged, vanilla notes, less smoke. Why age mezcal?',
    story: 'Aging mezcal is controversial. Many say it hides the agave\'s character.',
    whereToBuy: ['Most liquor stores']
  },
  {
    id: 'skip-15',
    name: 'Joven',
    brand: 'Ilegal',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 40,
    price: 38,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 3, sweetness: 6, funk: 2, herbal: 3,
      fruit: 2, spice: 1, mineral: 1, complexity: 1
    },
    evi: 4.5, // Decent value
    eei: 3.5, // Serviceable
    tastingNotes: 'Balanced, approachable, unremarkable. Good for cocktails.',
    story: 'The most accessible Ilegal. Fine, but nothing to write home about.',
    whereToBuy: ['Everywhere']
  },
  {
    id: 'skip-16',
    name: 'Espadin',
    brand: 'Banhez',
    agave: 'Espadín/Barril blend',
    region: 'Oaxaca',
    producer: 'Cooperative',
    method: 'artisanal',
    abv: 42,
    price: 30,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 3, funk: 1, herbal: 1,
      fruit: 2, spice: 1, mineral: 1, complexity: 3
    },
    evi: 5.0, // Good value
    eei: 3.5, // Decent
    tastingNotes: 'Blend of espadín and barril. Pleasant but simple.',
    story: 'Community-owned cooperative. Good intentions, average execution.',
    whereToBuy: ['Total Wine', 'Whole Foods']
  },
  {
    id: 'skip-17',
    name: 'Joven',
    brand: 'Ojo de Tigre',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Medium producer',
    method: 'artisanal',
    abv: 42,
    price: 35,
    priceRange: 'budget',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 4, sweetness: 2, funk: 2, herbal: 5,
      fruit: 1, spice: 1, mineral: 1, complexity: 2
    },
    evi: 4.5, // Fair
    eei: 3.5, // Average
    tastingNotes: 'Smoky, herbal, straightforward. Mixer quality.',
    story: 'Eye of the Tiger. The name is more exciting than the mezcal.',
    whereToBuy: ['Select liquor stores']
  },
  {
    id: 'skip-18',
    name: 'Blanco',
    brand: 'Wahaka',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Family producer',
    method: 'artisanal',
    abv: 40,
    price: 35,
    priceRange: 'budget',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 4, sweetness: 5, funk: 1, herbal: 1,
      fruit: 3, spice: 1, mineral: 1, complexity: 1
    },
    evi: 4.5, // Decent
    eei: 3.5, // Nothing special
    tastingNotes: 'Clean, balanced, unexciting. Good starter mezcal.',
    story: 'Family-owned but scaled up. Lost some soul in the process.',
    whereToBuy: ['Total Wine', 'BevMo']
  },
  {
    id: 'skip-19',
    name: 'Anejo',
    brand: 'Corte Vetusto',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Medium producer',
    method: 'artisanal',
    abv: 40,
    price: 85,
    priceRange: 'premium',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 2, sweetness: 4, funk: 1, herbal: 1,
      fruit: 6, spice: 1, mineral: 1, complexity: 3
    },
    evi: 3.0, // Overpriced
    eei: 3.0, // Oak dominates
    tastingNotes: 'Heavy oak, vanilla, caramel. Tastes like tequila.',
    story: 'Extended aging. If you wanted tequila, buy tequila.',
    whereToBuy: ['Upscale liquor stores']
  },
  {
    id: 'skip-20',
    name: 'Artesanal',
    brand: 'Meteoro',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 45,
    price: 40,
    priceRange: 'mid',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 2, funk: 2, herbal: 3,
      fruit: 2, spice: 3, mineral: 3, complexity: 3
    },
    evi: 4.5, // Fair
    eei: 4.0, // Slightly above average
    tastingNotes: 'Higher proof adds interest. Still generic.',
    story: 'Meteor-themed marketing. The liquid doesn\'t live up to the branding.',
    whereToBuy: ['Total Wine', 'Spec\'s']
  },
  {
    id: 'skip-21',
    name: 'Joven',
    brand: 'Gem & Bolt',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 42,
    price: 45,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 4, sweetness: 6, funk: 2, herbal: 5,
      fruit: 2, spice: 1, mineral: 1, complexity: 3
    },
    evi: 3.5, // Overpriced for quality
    eei: 3.5, // Average
    tastingNotes: 'Infused with damiana. Gimmick mezcal.',
    story: 'Damiana-infused mezcal. If you need herbs to make it interesting...',
    whereToBuy: ['Select retailers']
  },
  {
    id: 'skip-22',
    name: 'Espadin',
    brand: 'Derrumbes',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Regional producer',
    method: 'artisanal',
    abv: 43,
    price: 42,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 6, sweetness: 5, funk: 2, herbal: 5,
      fruit: 3, spice: 3, mineral: 1, complexity: 2
    },
    evi: 5.0, // Fair value
    eei: 4.5, // Decent
    tastingNotes: 'Regional expressions concept. Oaxaca version is the weakest.',
    story: 'Good concept (regional mezcals) but Oaxaca expression is generic.',
    whereToBuy: ['Total Wine', 'Astor Wines']
  },
  {
    id: 'skip-23',
    name: 'Joven',
    brand: 'Yuu Baal',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Medium producer',
    method: 'artisanal',
    abv: 40,
    price: 38,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 7, sweetness: 2, funk: 1, herbal: 3,
      fruit: 3, spice: 1, mineral: 1, complexity: 2
    },
    evi: 4.0, // Average
    eei: 3.5, // Nothing special
    tastingNotes: 'Balanced, mild, forgettable.',
    story: 'Zapotec name, corporate execution. Cultural appropriation lite.',
    whereToBuy: ['Select retailers']
  },
  {
    id: 'skip-24',
    name: 'Blanco',
    brand: 'Peloton de la Muerte',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Contract producer',
    method: 'artisanal',
    abv: 40,
    price: 35,
    priceRange: 'budget',
    availability: 'easy',
    market: 'us',
    flavor: {
      smoke: 1, sweetness: 6, funk: 2, herbal: 3,
      fruit: 2, spice: 2, mineral: 1, complexity: 1
    },
    evi: 4.5, // Fair price
    eei: 3.0, // Basic
    tastingNotes: 'Skull bottle, basic mezcal. All packaging, no substance.',
    story: 'Day of the Dead marketing. The bottle is more interesting than the contents.',
    whereToBuy: ['Total Wine', 'BevMo']
  },
  {
    id: 'skip-25',
    name: 'Espadin',
    brand: 'Gracias a Dios',
    agave: 'Espadín',
    region: 'Oaxaca',
    producer: 'Medium producer',
    method: 'artisanal',
    abv: 40,
    price: 40,
    priceRange: 'mid',
    availability: 'moderate',
    market: 'us',
    flavor: {
      smoke: 5, sweetness: 6, funk: 1, herbal: 2,
      fruit: 2, spice: 1, mineral: 1, complexity: 1
    },
    evi: 4.0, // Average
    eei: 3.5, // Unremarkable
    tastingNotes: 'Thank God it\'s over. Generic espadín.',
    story: 'Religious branding, secular execution. Nothing divine here.',
    whereToBuy: ['Select liquor stores']
  }
];

// Combine all mezcals
export const allMezcals = [...usMezcals, ...mexicoMezcals, ...skipTheseMezcals];

// Expert quotes for integration throughout the site
export const expertQuotes = {
  ronCooper: [
    "Take the tiniest sip you can. Let it coat your palate. Breathe. Wait. Listen.",
    "Each village has its own terroir, its own soul. That's what single village means.",
    "Mezcal is not a drink. It's a ceremony in a bottle.",
    "I didn't discover mezcal. It discovered me."
  ],
  steveOlson: [
    "The gateway drug to serious mezcal appreciation.",
    "Education is the only path to preservation.",
    "Every bottle tells a story of place, people, and process.",
    "Mezcal is the most complex spirit on Earth. Period."
  ],
  dougFrost: [
    "Apply the same rigor to mezcal that you would to Grand Cru Burgundy.",
    "Not for beginners. This is PhD-level mezcal.",
    "The complexity rivals the finest single malts.",
    "Terroir matters more in mezcal than almost any other spirit."
  ],
  alvinStarkman: [
    "The agave that separates the curious from the committed.",
    "Thirty years in Oaxaca and I'm still learning.",
    "Every palenque visit teaches me something new.",
    "The mezcaleros are the true masters. We're just students."
  ],
  louBank: [
    "Make life better for people who make better mezcal.",
    "The best value in mezcal. Period.",
    "Sustainability isn't optional. It's survival.",
    "SACRED exists because the industry needed ethics."
  ],
  marcoOchoa: [
    "Preservation through documentation.",
    "Every village, every producer, every batch is unique.",
    "Mezcaloteca is a library, not a bar.",
    "We're racing against time to capture what's being lost."
  ],
  gracielaAngeles: [
    "Porque sólo lo auténtico perdura. (Only the authentic endures)",
    "We withdrew from CRM to protect our ancestors' methods.",
    "Clay pots are not primitive. They are perfect.",
    "Four generations of women making mezcal. The tradition continues."
  ],
  susanCoss: [
    "Helped make mezcal popular, now has to keep it real.",
    "The feminine spirit of mezcal, passed through generations.",
    "Community is everything. Mezcalistas proves that.",
    "This is what happens when women lead. Balance, harmony, soul."
  ]
};

// Flavor dimension labels for UI
export const flavorDimensions = [
  { key: 'smoke', label: 'Smoke', low: 'None', high: 'Intense' },
  { key: 'sweetness', label: 'Sweetness', low: 'Bone Dry', high: 'Candied' },
  { key: 'funk', label: 'Funk', low: 'Clean', high: 'Wild/Barnyard' },
  { key: 'herbal', label: 'Herbal', low: 'Minimal', high: 'Intense Green' },
  { key: 'fruit', label: 'Fruit', low: 'None', high: 'Tropical' },
  { key: 'spice', label: 'Spice', low: 'Mild', high: 'Peppery' },
  { key: 'mineral', label: 'Mineral', low: 'Soft', high: 'Wet Stone' },
  { key: 'complexity', label: 'Complexity', low: 'Simple', high: 'Layered' }
];
