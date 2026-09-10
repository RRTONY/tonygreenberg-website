// Ported from legacy client/src/data/cityData.ts — the "BrewSoul City
// Intelligence Module." Real 25-city leaderboard (name/state/grade/
// score/tagline/verdict/stats), unchanged. **Real data-completeness
// note, not a bug to fix**: legacy's own comment admits only Portland
// has full shop-by-shop data ("For brevity, adding abbreviated worst
// lists — the pattern continues for all 25 / In production, each city
// would have full 25 best + 25 worst") — the other 24 cities have real
// city-level stats but empty `bestShops`/`worstShops`/`chainScores`/
// `bridgeDrinks`/`nonCoffeeSpots` arrays. Legacy's own UI already
// handles this gracefully (a real "Full data coming soon" state on both
// the index card and the detail page) rather than pretending the data
// exists — that real behavior is preserved as-is, not papered over.
export interface ShopScores {
  beanQuality: number;
  preparation: number;
  valueQpr: number;
  transparency: number;
  experience: number;
  accessibility: number;
  health: number;
  total: number;
  grade: Grade;
}

export type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D+" | "D" | "D-" | "F";

export interface CoffeeShop {
  id: string;
  name: string;
  citySlug: string;
  neighborhood: string;
  address: string;
  mapsUrl: string;
  website?: string;
  instagram?: string;
  isChain: boolean;
  chainName?: string;
  roastsOwn: boolean;
  roasterSource?: string;
  scores: ShopScores;
  pricing: { avgLatte: number; avgPourover?: number; avgDrip?: number };
  bestFor: string[];
  tags: string[];
  orderThis: string;
  skipThis: string;
  nonCoffeePick?: string;
  bridgeDrink?: string;
  blurb: string;
  crime?: string;
  redemptionPath?: string;
  insteadGoTo?: string;
  hours?: string;
  wifi?: boolean;
  laptopFriendly?: boolean;
  parking?: string;
  listType: "best" | "worst";
  rankInCity: number;
  lastScored: string;
}

export interface BridgeDrink {
  persona: string;
  shop: string;
  neighborhood: string;
  drink: string;
  tastesLike: string;
}

export interface NonCoffeeSpot {
  name: string;
  neighborhood: string;
  category: "tea" | "matcha" | "hotChocolate" | "chai";
  why: string;
  priceRange: string;
  mapsUrl?: string;
}

export interface ChainScore {
  chainName: string;
  locationsInMetro: number;
  avgLatte: number;
  beanSource: string;
  grade: Grade;
  score: number;
  verdict: string;
}

export interface CityData {
  slug: string;
  name: string;
  state: string;
  grade: Grade;
  score: number;
  tagline: string;
  verdict: string;
  stats: {
    totalSpecialtyShops: number;
    bestShop: string;
    bestScore: number;
    worstShop: string;
    worstScore: number;
    avgLattePrice: number;
    roastersPer100k: number;
  };
  heroImage: string;
  rank: number;
  bestShops: CoffeeShop[];
  worstShops: CoffeeShop[];
  chainScores: ChainScore[];
  bridgeDrinks: BridgeDrink[];
  nonCoffeeSpots: NonCoffeeSpot[];
}

export function gradeFromScore(score: number): Grade {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 68) return "B";
  if (score >= 65) return "B-";
  if (score >= 58) return "C+";
  if (score >= 50) return "C";
  if (score >= 42) return "D+";
  if (score >= 35) return "D";
  if (score >= 30) return "D-";
  return "F";
}

export const SCORING_DIMENSIONS = [
  { key: "beanQuality", label: "Bean Quality", max: 25, icon: "🫘" },
  { key: "preparation", label: "Preparation", max: 20, icon: "☕" },
  { key: "valueQpr", label: "Value / QPR", max: 15, icon: "💰" },
  { key: "transparency", label: "Transparency", max: 15, icon: "🔍" },
  { key: "experience", label: "Experience", max: 10, icon: "✨" },
  { key: "accessibility", label: "Accessibility", max: 10, icon: "🤝" },
  { key: "health", label: "Mold & Health", max: 5, icon: "🛡️" },
] as const;

export const GRADE_SCALE = [
  { grade: "A+", range: "90-100", label: "Pilgrimage-worthy. Life-changing coffee." },
  { grade: "A", range: "80-89", label: "Excellent. Go here." },
  { grade: "B+", range: "75-79", label: "Very good. Solid daily driver." },
  { grade: "B", range: "65-74", label: "Good. Above average." },
  { grade: "C", range: "50-64", label: "Mediocre. You can do better." },
  { grade: "D", range: "35-49", label: "Poor. Active value destruction." },
  { grade: "F", range: "0-34", label: "Wall of Shame territory." },
];

export const UNIVERSAL_CHAINS: Omit<ChainScore, "locationsInMetro">[] = [
  {
    chainName: "Starbucks",
    avgLatte: 6.35,
    beanSource: 'Commodity arabica, roasted to char for "consistency"',
    grade: "D+",
    score: 42,
    verdict:
      "Charging specialty prices for commodity coffee. A grande latte buys a pour-over of 90-scored single-origin at most indie shops. Their dark roast is designed to mask bean quality, not showcase it.",
  },
  {
    chainName: "Dunkin'",
    avgLatte: 5.29,
    beanSource: "J.M. Smucker (same as Folgers)",
    grade: "D",
    score: 38,
    verdict:
      "Marketing as an affordable alternative while quietly raising prices to Starbucks levels, with Folgers-tier coffee. Medium cold brew $4.59 — within pennies of Starbucks.",
  },
  {
    chainName: "Dutch Bros",
    avgLatte: 5.99,
    beanSource: "Commodity, optimized for sugar delivery",
    grade: "D",
    score: 36,
    verdict:
      "A milkshake delivery system masquerading as a coffee company. Avg transaction $8.44. The staff is genuinely wonderful — give them better beans and they'd be dangerous.",
  },
  {
    chainName: "The Coffee Bean & Tea Leaf",
    avgLatte: 5.75,
    beanSource: "Commodity blends, some single-origin",
    grade: "D+",
    score: 40,
    verdict:
      "Legacy brand coasting on name recognition. Better than Starbucks on paper, indistinguishable in the cup. The tea program is actually decent.",
  },
  {
    chainName: "Tim Hortons",
    avgLatte: 4.49,
    beanSource: "Commodity, Mother Parker's supply",
    grade: "D-",
    score: 33,
    verdict:
      "Canadian nostalgia in a cup. The coffee is an afterthought to the donut operation. At least they're honest about the price.",
  },
  {
    chainName: "Scooter's",
    avgLatte: 5.29,
    beanSource: "In-house roasted commodity",
    grade: "D",
    score: 35,
    verdict:
      'Drive-thru speed over everything. The "Amazing" in their tagline is doing heavy lifting. Inoffensive but unremarkable.',
  },
  {
    chainName: "7 Brew",
    avgLatte: 5.49,
    beanSource: "Commodity blends",
    grade: "D",
    score: 37,
    verdict:
      'The newest entrant in the "sugar with caffeine" drive-thru wars. Fast, friendly, forgettable coffee.',
  },
  {
    chainName: "Black Rock",
    avgLatte: 5.99,
    beanSource: "Commodity, flavor-forward blends",
    grade: "D-",
    score: 32,
    verdict:
      "Dutch Bros energy with even less coffee identity. The flavored drinks are the point — the espresso is just a vehicle.",
  },
];

export const NUANCED_CHAINS: Omit<ChainScore, "locationsInMetro">[] = [
  {
    chainName: "Blue Bottle",
    avgLatte: 6.5,
    beanSource: "Quality sourcing, declining since Nestlé acquisition (2017)",
    grade: "C+",
    score: 66,
    verdict:
      "Was A-grade pre-2017. Nestlé acquisition introduced cost-cutting. Quality varies dramatically by location. Some Japanese-influenced shops still excellent. Grade each location separately.",
  },
  {
    chainName: "La Colombe",
    avgLatte: 5.75,
    beanSource: "Direct trade, quality blends",
    grade: "B",
    score: 73,
    verdict:
      "Fishtown HQ is genuinely great. Scaled locations are good-not-great. Draft lattes are innovative. The rare chain doing it mostly right.",
  },
  {
    chainName: "Intelligentsia",
    avgLatte: 5.95,
    beanSource: "Direct trade program, high-quality sourcing",
    grade: "B+",
    score: 80,
    verdict:
      "Chicago and LA locations remain strong. Quality still high despite Peet's ownership. Direct trade program is real. Best chain-scale coffee in America.",
  },
  {
    chainName: "Peet's",
    avgLatte: 5.65,
    beanSource: "Quality roasting heritage, scaled production",
    grade: "C+",
    score: 63,
    verdict:
      "Legitimate roasting heritage. Better than Starbucks. But scaled past craft. Berkeley original still deserves respect.",
  },
  {
    chainName: "Philz",
    avgLatte: 5.75,
    beanSource: "Custom blends, medium quality",
    grade: "C+",
    score: 60,
    verdict:
      'Once great, now scaled to inconsistency. The "handcrafted" pour-over is a drip machine with extra steps. Still has charm in original SF locations.',
  },
];

function makeShop(
  partial: Partial<CoffeeShop> &
    Pick<
      CoffeeShop,
      | "id"
      | "name"
      | "citySlug"
      | "neighborhood"
      | "scores"
      | "blurb"
      | "orderThis"
      | "skipThis"
      | "listType"
      | "rankInCity"
    >,
): CoffeeShop {
  return {
    address: "",
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(partial.name + " " + partial.neighborhood)}`,
    isChain: false,
    roastsOwn: partial.listType === "best",
    pricing: { avgLatte: 5.5 },
    bestFor: [],
    tags: [],
    lastScored: "2026-01",
    ...partial,
  };
}

const portlandBest: CoffeeShop[] = [
  makeShop({
    id: "pdx-heart",
    name: "Heart Coffee",
    citySlug: "portland",
    neighborhood: "Burnside",
    scores: {
      beanQuality: 24,
      preparation: 19,
      valueQpr: 13,
      transparency: 14,
      experience: 9,
      accessibility: 8,
      health: 5,
      total: 92,
      grade: "A+",
    },
    blurb:
      "Heart doesn't just roast light — they roast with a conviction that borders on religious. Every bean is a sermon on terroir. The Burnside location smells like someone figured out how to distill a Yirgacheffe hillside into a 900-square-foot room.",
    orderThis: "Ethiopian V60 pour-over",
    skipThis: "Nothing — even the drip is transcendent",
    nonCoffeePick: "Sparkling water with citrus",
    bridgeDrink: "Natural process Ethiopian cold brew — tastes like blueberry juice",
    pricing: { avgLatte: 5.5, avgPourover: 6.0, avgDrip: 3.5 },
    tags: ["Roasts Own", "Single Origin", "Pour-Over", "Light Roast"],
    bestFor: ["Pour-Over", "Coffee Nerds", "Window Seat Contemplation"],
    listType: "best",
    rankInCity: 1,
    wifi: true,
    laptopFriendly: true,
  }),
  makeShop({
    id: "pdx-coava",
    name: "Coava Coffee",
    citySlug: "portland",
    neighborhood: "Hawthorne",
    scores: {
      beanQuality: 23,
      preparation: 18,
      valueQpr: 12,
      transparency: 14,
      experience: 9,
      accessibility: 8,
      health: 5,
      total: 89,
      grade: "A",
    },
    blurb:
      "Coava's Hawthorne location is a cathedral of wood and light where the cold brew tastes like dark chocolate and cherry. The bamboo-filtered Chemex is their signature move — nobody else does it.",
    orderThis: "Kilenso cold brew — no milk, no sugar, just trust",
    skipThis: "The flavored seasonal — their beans don't need costumes",
    bridgeDrink: "Cold brew straight — tastes like dark chocolate and cherry, not coffee",
    pricing: { avgLatte: 5.75, avgPourover: 6.5 },
    tags: ["Roasts Own", "Cold Brew", "Chemex", "Laptop Friendly"],
    bestFor: ["Cold Brew", "Remote Work", "First Dates"],
    listType: "best",
    rankInCity: 2,
    wifi: true,
    laptopFriendly: true,
  }),
  makeShop({
    id: "pdx-proud-mary",
    name: "Proud Mary",
    citySlug: "portland",
    neighborhood: "Alberta",
    scores: {
      beanQuality: 24,
      preparation: 19,
      valueQpr: 11,
      transparency: 13,
      experience: 10,
      accessibility: 8,
      health: 4,
      total: 89,
      grade: "A",
    },
    blurb:
      "Melbourne's gift to Portland. The tasting flight is a graduate seminar in coffee — four origins, four preparations, one revelation. Expensive? Yes. Worth it? Every cent.",
    orderThis: "The OG tasting flight — four coffees, four methods",
    skipThis: "The basic latte — you came here for the experience, not the ordinary",
    pricing: { avgLatte: 6.5, avgPourover: 7.0 },
    tags: ["Roasts Own", "Tasting Flight", "Australian", "Brunch"],
    bestFor: ["Special Occasions", "Coffee Education", "Brunch"],
    listType: "best",
    rankInCity: 3,
  }),
  makeShop({
    id: "pdx-push-pull",
    name: "Push X Pull",
    citySlug: "portland",
    neighborhood: "Multiple",
    scores: {
      beanQuality: 22,
      preparation: 18,
      valueQpr: 13,
      transparency: 13,
      experience: 8,
      accessibility: 9,
      health: 4,
      total: 87,
      grade: "A",
    },
    blurb:
      "The people's champion. Quality that rivals Heart at prices that don't require a second mortgage. Multiple locations, zero quality variance — that's the real flex.",
    orderThis: "House espresso — clean, sweet, consistent",
    skipThis: "Nothing over $6 here, so skip nothing",
    pricing: { avgLatte: 5.0, avgPourover: 5.5 },
    tags: ["Roasts Own", "Value", "Multiple Locations", "Consistent"],
    bestFor: ["Daily Driver", "Value", "Quick Stop"],
    listType: "best",
    rankInCity: 4,
  }),
  makeShop({
    id: "pdx-good",
    name: "Good Coffee",
    citySlug: "portland",
    neighborhood: "Division",
    scores: {
      beanQuality: 22,
      preparation: 17,
      valueQpr: 12,
      transparency: 13,
      experience: 9,
      accessibility: 8,
      health: 4,
      total: 85,
      grade: "A",
    },
    blurb:
      "The name is an understatement. Rotating guest roasters mean every visit is a discovery. The Division location has the best people-watching window in Portland.",
    orderThis: "Whatever the guest roaster is this week",
    skipThis: "The drip if they have a guest pour-over available",
    pricing: { avgLatte: 5.5 },
    tags: ["Guest Roasters", "Rotating Menu", "Pour-Over"],
    bestFor: ["Discovery", "People Watching", "Rotating Menu"],
    listType: "best",
    rankInCity: 5,
  }),
  makeShop({
    id: "pdx-sterling",
    name: "Sterling Coffee",
    citySlug: "portland",
    neighborhood: "NW 21st",
    scores: {
      beanQuality: 22,
      preparation: 17,
      valueQpr: 12,
      transparency: 12,
      experience: 9,
      accessibility: 8,
      health: 4,
      total: 84,
      grade: "A",
    },
    blurb:
      "Precision in a cup. Sterling treats every extraction like a chemistry experiment — and the results are consistently brilliant. The NW location is a quiet refuge from the Pearl District chaos.",
    orderThis: "Single-origin espresso — whatever's on the board",
    skipThis: "Flavored anything — these beans speak for themselves",
    pricing: { avgLatte: 5.75 },
    tags: ["Roasts Own", "Precision", "Quiet"],
    bestFor: ["Espresso", "Quiet Work", "Precision Coffee"],
    listType: "best",
    rankInCity: 6,
  }),
  makeShop({
    id: "pdx-roseline",
    name: "Roseline Coffee",
    citySlug: "portland",
    neighborhood: "Central Eastside",
    scores: {
      beanQuality: 21,
      preparation: 17,
      valueQpr: 13,
      transparency: 12,
      experience: 8,
      accessibility: 8,
      health: 4,
      total: 83,
      grade: "A",
    },
    blurb:
      "The wholesale darling that also runs a killer cafe. Their blends are what half of Portland's restaurants serve — and for good reason. Approachable without dumbing anything down.",
    orderThis: "The Rambler blend espresso",
    skipThis: "The iced tea — you're at a coffee roaster",
    pricing: { avgLatte: 5.25 },
    tags: ["Roasts Own", "Wholesale", "Blends", "Approachable"],
    bestFor: ["Blend Lovers", "Approachable Quality"],
    listType: "best",
    rankInCity: 7,
  }),
  makeShop({
    id: "pdx-nossa",
    name: "Nossa Familia",
    citySlug: "portland",
    neighborhood: "Pearl District",
    scores: {
      beanQuality: 21,
      preparation: 16,
      valueQpr: 12,
      transparency: 14,
      experience: 8,
      accessibility: 8,
      health: 4,
      total: 83,
      grade: "A",
    },
    blurb:
      "Family-owned from bean to cup — literally. The Carneiro family farms in Brazil and roasts in Portland. You can trace every bean to the exact hillside it grew on. That's not marketing; that's a family tree.",
    orderThis: "The Teodoro single-origin — named after the patriarch",
    skipThis: "The cold brew — their hot coffee is the story",
    pricing: { avgLatte: 5.5, avgPourover: 6.0 },
    tags: ["Roasts Own", "Farm-to-Cup", "Brazilian", "Family-Owned"],
    bestFor: ["Transparency", "Brazilian Coffee", "Story"],
    listType: "best",
    rankInCity: 8,
  }),
  makeShop({
    id: "pdx-never",
    name: "Never Coffee",
    citySlug: "portland",
    neighborhood: "Alberta",
    scores: {
      beanQuality: 21,
      preparation: 17,
      valueQpr: 12,
      transparency: 11,
      experience: 9,
      accessibility: 7,
      health: 4,
      total: 81,
      grade: "A",
    },
    blurb:
      "Japanese-influenced precision meets Portland soul. The kissaten-style service is deliberate, meditative, almost ceremonial. If Heart is a sermon, Never is a haiku.",
    orderThis: "Hand-drip single origin — watch the ritual",
    skipThis: "Rushing — this place rewards patience",
    pricing: { avgLatte: 6.0, avgPourover: 7.0 },
    tags: ["Japanese-Influenced", "Pour-Over", "Kissaten", "Meditative"],
    bestFor: ["Contemplation", "Japanese Coffee Culture", "Slow Coffee"],
    listType: "best",
    rankInCity: 9,
  }),
  makeShop({
    id: "pdx-case-study",
    name: "Case Study Coffee",
    citySlug: "portland",
    neighborhood: "Alberta",
    scores: {
      beanQuality: 20,
      preparation: 17,
      valueQpr: 13,
      transparency: 12,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 81,
      grade: "A",
    },
    blurb:
      "The neighborhood anchor. Case Study does everything well and nothing flashy — which in Portland's scene of showboats is its own kind of statement. Great value, great vibes, great coffee.",
    orderThis: "Drip coffee — seriously, their drip is elite",
    skipThis: "The pastries — come for the coffee, eat elsewhere",
    pricing: { avgLatte: 5.0, avgDrip: 3.0 },
    tags: ["Roasts Own", "Value", "Neighborhood", "Drip"],
    bestFor: ["Daily Driver", "Neighborhood Hangout", "Value"],
    listType: "best",
    rankInCity: 10,
  }),
  makeShop({
    id: "pdx-deadstock",
    name: "Deadstock Coffee",
    citySlug: "portland",
    neighborhood: "Old Town",
    scores: {
      beanQuality: 19,
      preparation: 16,
      valueQpr: 12,
      transparency: 11,
      experience: 10,
      accessibility: 9,
      health: 3,
      total: 80,
      grade: "A-",
    },
    blurb:
      "Sneaker culture meets coffee culture — and somehow it works. Ian Williams built a space where Air Jordans and Ethiopian Yirgacheffe coexist in perfect harmony. The most Portland thing that ever Portlanded.",
    orderThis: "The Kobe — their signature espresso drink",
    skipThis: "Nothing — the menu is tight and intentional",
    pricing: { avgLatte: 5.5 },
    tags: ["Culture", "Sneakers", "Unique", "Community"],
    bestFor: ["Culture", "Unique Experience", "Instagram"],
    listType: "best",
    rankInCity: 11,
  }),
  makeShop({
    id: "pdx-upper-left",
    name: "Upper Left Roasters",
    citySlug: "portland",
    neighborhood: "Kerns",
    scores: {
      beanQuality: 20,
      preparation: 16,
      valueQpr: 12,
      transparency: 12,
      experience: 8,
      accessibility: 7,
      health: 4,
      total: 79,
      grade: "B+",
    },
    blurb:
      "Small-batch obsessives who treat every roast like it's their thesis defense. The Kerns location is tiny — four seats and a counter — but the coffee is enormous.",
    orderThis: "Whatever's freshest on the board",
    skipThis: "Expecting a big cafe — this is a roastery with a counter",
    pricing: { avgLatte: 5.5 },
    tags: ["Roasts Own", "Small Batch", "Micro"],
    bestFor: ["Coffee Nerds", "Small Batch", "Roastery Visit"],
    listType: "best",
    rankInCity: 12,
  }),
  makeShop({
    id: "pdx-courier",
    name: "Courier Coffee",
    citySlug: "portland",
    neighborhood: "Downtown",
    scores: {
      beanQuality: 20,
      preparation: 16,
      valueQpr: 12,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 78,
      grade: "B+",
    },
    blurb:
      "The tiniest roastery in Portland — and one of the best. Joel Domreis roasts on a machine the size of a toaster oven and produces coffee that embarrasses operations 100x his size.",
    orderThis: "Espresso — watch Joel pull it himself",
    skipThis: "Coming in a hurry — this is a one-man show",
    pricing: { avgLatte: 5.25 },
    tags: ["Roasts Own", "Micro Roaster", "One-Man Show"],
    bestFor: ["Espresso", "Artisan Experience", "Micro Roasting"],
    listType: "best",
    rankInCity: 13,
  }),
  makeShop({
    id: "pdx-extracto",
    name: "Extracto Coffee",
    citySlug: "portland",
    neighborhood: "NE 30th",
    scores: {
      beanQuality: 19,
      preparation: 16,
      valueQpr: 13,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 78,
      grade: "B+",
    },
    blurb:
      "The unpretentious workhorse. Extracto doesn't need a gimmick because the coffee is the gimmick. Great beans, fair prices, zero attitude. Portland's best-kept secret.",
    orderThis: "House blend drip — $3 for coffee this good is theft",
    skipThis: "The chai — stick to what they do best",
    pricing: { avgLatte: 4.75, avgDrip: 3.0 },
    tags: ["Roasts Own", "Value", "No Pretense", "Neighborhood"],
    bestFor: ["Value", "No Pretense", "Daily Driver"],
    listType: "best",
    rankInCity: 14,
  }),
  makeShop({
    id: "pdx-water-ave",
    name: "Water Avenue Coffee",
    citySlug: "portland",
    neighborhood: "Central Eastside",
    scores: {
      beanQuality: 20,
      preparation: 16,
      valueQpr: 11,
      transparency: 12,
      experience: 8,
      accessibility: 7,
      health: 3,
      total: 77,
      grade: "B+",
    },
    blurb:
      "The roastery that supplies half of Portland's best restaurants. Their cafe is an afterthought to the roasting operation — and that afterthought is better than most people's main event.",
    orderThis: "Single-origin pour-over — ask what just came off the roaster",
    skipThis: "The food — this is a roastery, not a restaurant",
    pricing: { avgLatte: 5.5, avgPourover: 6.0 },
    tags: ["Roasts Own", "Wholesale", "Roastery Cafe"],
    bestFor: ["Roastery Experience", "Fresh Roast", "Wholesale Quality"],
    listType: "best",
    rankInCity: 15,
  }),
  makeShop({
    id: "pdx-prince",
    name: "Prince Coffee",
    citySlug: "portland",
    neighborhood: "Division",
    scores: {
      beanQuality: 19,
      preparation: 16,
      valueQpr: 12,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 77,
      grade: "B+",
    },
    blurb:
      "The new kid with old-school values. Prince opened quietly and immediately became a neighborhood essential. No hype, no Instagram strategy — just really good coffee in a really nice room.",
    orderThis: "Cortado — their milk work is exceptional",
    skipThis: "The large sizes — their drinks are best concentrated",
    pricing: { avgLatte: 5.25 },
    tags: ["Roasts Own", "Neighborhood", "Cortado", "New"],
    bestFor: ["Cortado", "Neighborhood Discovery", "Quiet Morning"],
    listType: "best",
    rankInCity: 16,
  }),
  makeShop({
    id: "pdx-either-or",
    name: "Either/Or",
    citySlug: "portland",
    neighborhood: "SE Belmont",
    scores: {
      beanQuality: 18,
      preparation: 16,
      valueQpr: 12,
      transparency: 11,
      experience: 9,
      accessibility: 8,
      health: 3,
      total: 77,
      grade: "B+",
    },
    blurb:
      "Half cafe, half bar, fully committed to both. The coffee program sources from Portland's best roasters and the space transitions seamlessly from morning cortados to evening natural wine.",
    orderThis: "Morning cortado with whatever roaster they're featuring",
    skipThis: "The drip after 3pm — switch to wine",
    pricing: { avgLatte: 5.5 },
    tags: ["Multi-Roaster", "Wine Bar", "Dual Concept"],
    bestFor: ["Morning-to-Night", "Date Spot", "Wine + Coffee"],
    listType: "best",
    rankInCity: 17,
  }),
  makeShop({
    id: "pdx-cathedral",
    name: "Cathedral Coffee",
    citySlug: "portland",
    neighborhood: "St. Johns",
    scores: {
      beanQuality: 18,
      preparation: 15,
      valueQpr: 13,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 76,
      grade: "B+",
    },
    blurb:
      "St. Johns' living room. Cathedral is where the neighborhood comes to exist together — and the coffee is genuinely good, not just 'good for a neighborhood spot.' Fair prices, warm people, solid beans.",
    orderThis: "House drip — honest and well-made",
    skipThis: "Expecting Heart-level precision — this is comfort, not competition",
    pricing: { avgLatte: 4.75, avgDrip: 2.75 },
    tags: ["Neighborhood", "Community", "Value", "Welcoming"],
    bestFor: ["Community", "Value", "Neighborhood Hangout"],
    listType: "best",
    rankInCity: 18,
  }),
  makeShop({
    id: "pdx-barista",
    name: "Barista",
    citySlug: "portland",
    neighborhood: "NW 23rd",
    scores: {
      beanQuality: 18,
      preparation: 16,
      valueQpr: 11,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 75,
      grade: "B+",
    },
    blurb:
      "The original multi-roaster concept in Portland. Billy Wilson's idea was radical in 2009: serve the best roasters in the country, not just your own. The NW location is still the gold standard for the model.",
    orderThis: "Ask what roaster they're featuring — then get the espresso",
    skipThis: "The drip — you came for the guest roasters",
    pricing: { avgLatte: 5.75 },
    tags: ["Multi-Roaster", "Pioneer", "Espresso"],
    bestFor: ["Multi-Roaster Discovery", "Espresso Flights"],
    listType: "best",
    rankInCity: 19,
  }),
  makeShop({
    id: "pdx-public-domain",
    name: "Public Domain Coffee",
    citySlug: "portland",
    neighborhood: "Downtown",
    scores: {
      beanQuality: 18,
      preparation: 15,
      valueQpr: 12,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 75,
      grade: "B+",
    },
    blurb:
      "Downtown Portland's best-kept secret. While tourists line up at Stumptown, locals slip into Public Domain for equally good coffee without the mythology tax.",
    orderThis: "Americano — clean and balanced",
    skipThis: "The pastry case — functional, not destination",
    pricing: { avgLatte: 5.0 },
    tags: ["Downtown", "Hidden Gem", "Value"],
    bestFor: ["Downtown Quick Stop", "Hidden Gem"],
    listType: "best",
    rankInCity: 20,
  }),
  makeShop({
    id: "pdx-stumptown",
    name: "Stumptown Coffee",
    citySlug: "portland",
    neighborhood: "Division",
    scores: {
      beanQuality: 19,
      preparation: 15,
      valueQpr: 10,
      transparency: 12,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 75,
      grade: "B+",
    },
    blurb:
      "The OG that started it all. Duane Sorenson's vision created Portland's coffee identity. Now Peet's-owned and slightly diminished, but the Division location still has soul. Respect the history even if the present is complicated.",
    orderThis: "Hair Bender espresso — the blend that launched a thousand roasters",
    skipThis: "The merchandise — you're not a billboard",
    pricing: { avgLatte: 5.75, avgPourover: 6.0 },
    tags: ["Pioneer", "Historic", "Roasts Own"],
    bestFor: ["Coffee History", "The OG Experience"],
    listType: "best",
    rankInCity: 21,
  }),
  makeShop({
    id: "pdx-ristretto",
    name: "Ristretto Roasters",
    citySlug: "portland",
    neighborhood: "Beaumont",
    scores: {
      beanQuality: 18,
      preparation: 15,
      valueQpr: 12,
      transparency: 11,
      experience: 8,
      accessibility: 7,
      health: 3,
      total: 74,
      grade: "B",
    },
    blurb:
      "Beaumont's anchor. Ristretto has been quietly excellent for years — no hype cycle, no Instagram strategy, just consistent quality that rewards regulars.",
    orderThis: "Beaumont Blend — the namesake for a reason",
    skipThis: "The seasonal specials — stick to the classics",
    pricing: { avgLatte: 5.25 },
    tags: ["Roasts Own", "Neighborhood", "Consistent"],
    bestFor: ["Regulars", "Consistency", "Neighborhood"],
    listType: "best",
    rankInCity: 22,
  }),
  makeShop({
    id: "pdx-proud-mary-2",
    name: "Keeper Coffee",
    citySlug: "portland",
    neighborhood: "SE Hawthorne",
    scores: {
      beanQuality: 18,
      preparation: 15,
      valueQpr: 12,
      transparency: 11,
      experience: 7,
      accessibility: 8,
      health: 3,
      total: 74,
      grade: "B",
    },
    blurb:
      "Small, focused, and unapologetically nerdy. Keeper treats every cup like a science project — and the results are delicious data.",
    orderThis: "Whatever single-origin they're excited about",
    skipThis: "Being in a rush — Keeper rewards the curious",
    pricing: { avgLatte: 5.5 },
    tags: ["Roasts Own", "Nerdy", "Small", "Focused"],
    bestFor: ["Coffee Nerds", "Single Origin Discovery"],
    listType: "best",
    rankInCity: 23,
  }),
  makeShop({
    id: "pdx-sisters",
    name: "Sisters Coffee Company",
    citySlug: "portland",
    neighborhood: "Pearl District",
    scores: {
      beanQuality: 17,
      preparation: 15,
      valueQpr: 12,
      transparency: 12,
      experience: 8,
      accessibility: 7,
      health: 3,
      total: 74,
      grade: "B",
    },
    blurb:
      "From the mountain town of Sisters, OR to the Pearl District. Their commitment to sustainability is real — B Corp certified, carbon-neutral roasting, and the coffee backs up the mission.",
    orderThis: "The Cascadia Blend — Pacific Northwest in a cup",
    skipThis: "The decaf — life's too short",
    pricing: { avgLatte: 5.25 },
    tags: ["Roasts Own", "B Corp", "Sustainable", "Oregon"],
    bestFor: ["Sustainability", "Oregon Pride", "B Corp Coffee"],
    listType: "best",
    rankInCity: 24,
  }),
  makeShop({
    id: "pdx-ovation",
    name: "Ovation Coffee & Tea",
    citySlug: "portland",
    neighborhood: "SE Division",
    scores: {
      beanQuality: 17,
      preparation: 15,
      valueQpr: 12,
      transparency: 11,
      experience: 8,
      accessibility: 8,
      health: 3,
      total: 74,
      grade: "B",
    },
    blurb:
      "The tea-forward coffee shop. Ovation's tea program is legitimately one of Portland's best — and their coffee holds its own. The rare shop where non-coffee drinkers feel like the main character.",
    orderThis: "Genmaicha if you're a tea person, cortado if you're not",
    skipThis: "The flavored lattes — their straight coffee is better",
    nonCoffeePick: "Genmaicha — toasted rice tea that converts skeptics",
    pricing: { avgLatte: 5.0 },
    tags: ["Tea Program", "Inclusive", "Non-Coffee Friendly"],
    bestFor: ["Tea Lovers", "Non-Coffee Drinkers", "Inclusive"],
    listType: "best",
    rankInCity: 25,
  }),
];

const portlandWorst: CoffeeShop[] = [
  makeShop({
    id: "pdx-sbux-reserve",
    name: "Starbucks Reserve",
    citySlug: "portland",
    neighborhood: "Pearl District",
    isChain: true,
    chainName: "Starbucks",
    roastsOwn: false,
    scores: {
      beanQuality: 10,
      preparation: 10,
      valueQpr: 3,
      transparency: 5,
      experience: 8,
      accessibility: 7,
      health: 2,
      total: 45,
      grade: "D+",
    },
    blurb:
      "$8 for a 'Clover-brewed' coffee that tastes exactly like the $4 Pike Place three blocks away. The Reserve program was supposed to be Starbucks acknowledging that specialty coffee exists. Instead, it's specialty coffee cosplay.",
    orderThis: "Walk 6 minutes to Heart instead",
    skipThis: "Everything — you're paying for theater, not coffee",
    crime:
      "Charging specialty prices for commodity coffee in a city with 50+ better options within walking distance",
    redemptionPath:
      "Reduce prices 40% or source from local roasters. In Portland, there's no excuse.",
    insteadGoTo: "Heart Coffee (6 min walk)",
    pricing: { avgLatte: 7.5 },
    tags: ["Chain", "Overpriced", "Tourist Trap"],
    listType: "worst",
    rankInCity: 1,
  }),
  makeShop({
    id: "pdx-dutch-bros-1",
    name: "Dutch Bros",
    citySlug: "portland",
    neighborhood: "Multiple",
    isChain: true,
    chainName: "Dutch Bros",
    roastsOwn: false,
    scores: {
      beanQuality: 4,
      preparation: 5,
      valueQpr: 5,
      transparency: 2,
      experience: 8,
      accessibility: 7,
      health: 1,
      total: 32,
      grade: "F",
    },
    blurb:
      "A sugar delivery system with a cult following. The staff is genuinely wonderful — enthusiastic, kind, fast. Give them better beans and they'd be dangerous. But right now, you're paying $8.44 for liquid candy.",
    orderThis: "A job application — the culture is the product, not the coffee",
    skipThis: 'Anything with "Rebel" in the name — 100g+ sugar',
    crime:
      "Masquerading as a coffee company while serving commodity beans drowned in sugar. Average customer has no idea what coffee actually tastes like.",
    redemptionPath:
      'Offer a "Simple" menu — straight espresso, pour-over, cold brew — alongside the sugar menu.',
    insteadGoTo: "Push X Pull (better coffee, lower price)",
    pricing: { avgLatte: 5.99 },
    tags: ["Chain", "Sugar", "Drive-Thru"],
    listType: "worst",
    rankInCity: 2,
  }),
  makeShop({
    id: "pdx-sbux-downtown",
    name: "Starbucks (Downtown)",
    citySlug: "portland",
    neighborhood: "Downtown",
    isChain: true,
    chainName: "Starbucks",
    roastsOwn: false,
    scores: {
      beanQuality: 8,
      preparation: 10,
      valueQpr: 3,
      transparency: 4,
      experience: 7,
      accessibility: 7,
      health: 2,
      total: 41,
      grade: "D+",
    },
    blurb:
      "Charging $6.95 for a latte in a city where $5.50 gets you single-origin perfection. The Pike Place roast is designed to taste the same in Portland as it does in Peoria. That's not a feature — it's a confession.",
    orderThis: "Directions to Public Domain Coffee, one block away",
    skipThis: "The Pike Place roast — it's named after a market, not a quality standard",
    crime: "Commodity coffee at specialty prices in America's best coffee city",
    redemptionPath: "Source from Portland roasters. You're IN Portland.",
    insteadGoTo: "Public Domain Coffee (1 block)",
    pricing: { avgLatte: 6.95 },
    tags: ["Chain", "Overpriced", "Commodity"],
    listType: "worst",
    rankInCity: 3,
  }),
  makeShop({
    id: "pdx-human-bean",
    name: "Human Bean",
    citySlug: "portland",
    neighborhood: "Multiple",
    isChain: true,
    chainName: "Human Bean",
    roastsOwn: false,
    scores: {
      beanQuality: 6,
      preparation: 7,
      valueQpr: 6,
      transparency: 3,
      experience: 4,
      accessibility: 7,
      health: 2,
      total: 35,
      grade: "D",
    },
    blurb:
      "Drive-thru commodity coffee that exists because Americans would rather not leave their cars than drink good coffee. In Portland — a city built for walking to coffee shops — this is an act of cultural vandalism.",
    orderThis: "A bicycle — ride to a real coffee shop",
    skipThis: 'The "specialty" drinks — commodity beans in costume',
    crime: "Drive-thru commodity in a walkable coffee paradise",
    redemptionPath: "Source from any of Portland's 30+ local roasters",
    insteadGoTo: "Extracto Coffee (fair prices, real beans)",
    pricing: { avgLatte: 5.25 },
    tags: ["Chain", "Drive-Thru", "Commodity"],
    listType: "worst",
    rankInCity: 4,
  }),
  makeShop({
    id: "pdx-dunkin",
    name: "Dunkin'",
    citySlug: "portland",
    neighborhood: "Multiple",
    isChain: true,
    chainName: "Dunkin'",
    roastsOwn: false,
    scores: {
      beanQuality: 5,
      preparation: 6,
      valueQpr: 6,
      transparency: 2,
      experience: 5,
      accessibility: 8,
      health: 2,
      total: 34,
      grade: "F",
    },
    blurb:
      "Folgers in a cup with a donut on the side. In most cities, Dunkin' is a necessary evil. In Portland, it's an unnecessary one. There are 50+ better options within a mile of every Dunkin' location.",
    orderThis: "A donut — at least those are honest about what they are",
    skipThis: 'The "espresso" — it\'s a push-button insult to the craft',
    crime:
      "J.M. Smucker beans (same as Folgers) at prices approaching Starbucks, in a city with the highest roasters per capita in America",
    redemptionPath: "Lean into donuts. Nobody comes to Dunkin' for the coffee anyway.",
    insteadGoTo: "Case Study Coffee (better coffee, same price)",
    pricing: { avgLatte: 5.29 },
    tags: ["Chain", "Commodity", "Folgers-Tier"],
    listType: "worst",
    rankInCity: 5,
  }),
];

const portlandChains: ChainScore[] = [
  {
    chainName: "Starbucks",
    locationsInMetro: 187,
    avgLatte: 6.35,
    beanSource: "Commodity arabica",
    grade: "D+",
    score: 42,
    verdict: "In Portland, going to Starbucks is like eating at Olive Garden in Rome.",
  },
  {
    chainName: "Dunkin'",
    locationsInMetro: 12,
    avgLatte: 5.29,
    beanSource: "J.M. Smucker",
    grade: "D",
    score: 38,
    verdict: "Mercifully rare in Portland. The donuts are fine.",
  },
  {
    chainName: "Dutch Bros",
    locationsInMetro: 45,
    avgLatte: 5.99,
    beanSource: "Commodity",
    grade: "D",
    score: 36,
    verdict: "Portland's guilty pleasure. Great staff, terrible coffee.",
  },
  {
    chainName: "Peet's",
    locationsInMetro: 8,
    avgLatte: 5.65,
    beanSource: "Quality heritage, scaled",
    grade: "C+",
    score: 63,
    verdict: "Respectable but unnecessary in Portland.",
  },
  {
    chainName: "Blue Bottle",
    locationsInMetro: 2,
    avgLatte: 6.5,
    beanSource: "Declining post-Nestlé",
    grade: "C+",
    score: 66,
    verdict: "The Pearl District location is still good. But Heart is better and cheaper.",
  },
];

const portlandBridge: BridgeDrink[] = [
  {
    persona: "Hate bitter?",
    shop: "Heart Coffee",
    neighborhood: "Burnside",
    drink: "Natural process Ethiopian V60",
    tastesLike: "Blueberry juice with a hint of jasmine — not coffee",
  },
  {
    persona: "Only like sweet?",
    shop: "Proud Mary",
    neighborhood: "Alberta",
    drink: "Honey latte with oat milk",
    tastesLike: "Liquid caramel with a coffee whisper",
  },
  {
    persona: "Prefer tea?",
    shop: "Ovation Coffee & Tea",
    neighborhood: "SE Division",
    drink: "Cascara (coffee cherry tea)",
    tastesLike: "Hibiscus and dried cherry — technically coffee, tastes like tea",
  },
  {
    persona: "Hate hot drinks?",
    shop: "Coava Coffee",
    neighborhood: "Hawthorne",
    drink: "Nitro cold brew on tap",
    tastesLike: "Creamy dark chocolate — served cold like beer, no bitterness",
  },
  {
    persona: "Overwhelmed?",
    shop: "Push X Pull",
    neighborhood: "Any location",
    drink: "Tell the barista you don't usually drink coffee",
    tastesLike: "They'll guide you to something that changes your mind",
  },
];

const portlandNonCoffee: NonCoffeeSpot[] = [
  {
    name: "Ovation Coffee & Tea",
    neighborhood: "SE Division",
    category: "tea",
    why: "Portland's best loose-leaf program. Genmaicha that converts skeptics.",
    priceRange: "$4-7",
  },
  {
    name: "Jasmine Pearl Tea Company",
    neighborhood: "NW Industrial",
    category: "tea",
    why: "Dedicated tea house with 100+ varieties. The real deal.",
    priceRange: "$5-12",
  },
  {
    name: "Té Aro",
    neighborhood: "Buckman",
    category: "matcha",
    why: "Ceremonial-grade Uji matcha, whisked properly. Portland's best.",
    priceRange: "$5-8",
  },
  {
    name: "Cacao",
    neighborhood: "Downtown",
    category: "hotChocolate",
    why: "Drinking chocolate made from single-origin cacao. Life-changing.",
    priceRange: "$5-9",
  },
  {
    name: "The Jasmine Pearl",
    neighborhood: "NW",
    category: "chai",
    why: "House-made chai with real spices — not the syrup abomination.",
    priceRange: "$5-7",
  },
];

export const CITIES: CityData[] = [
  {
    slug: "portland",
    name: "Portland",
    state: "OR",
    grade: "A",
    score: 88,
    rank: 1,
    tagline: "The Holy Land",
    verdict: "Where even the gas stations have better coffee than your city's best shop.",
    stats: {
      totalSpecialtyShops: 247,
      bestShop: "Heart Coffee",
      bestScore: 92,
      worstShop: "Dutch Bros",
      worstScore: 32,
      avgLattePrice: 5.5,
      roastersPer100k: 12.4,
    },
    heroImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920",
    bestShops: portlandBest,
    worstShops: portlandWorst,
    chainScores: portlandChains,
    bridgeDrinks: portlandBridge,
    nonCoffeeSpots: portlandNonCoffee,
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "WA",
    grade: "A-",
    score: 85,
    rank: 2,
    tagline: "The Grandfather",
    verdict: "Starbucks was born here, then the city evolved past it.",
    stats: {
      totalSpecialtyShops: 312,
      bestShop: "Victrola Coffee",
      bestScore: 90,
      worstShop: "Starbucks Pike Place",
      worstScore: 38,
      avgLattePrice: 5.75,
      roastersPer100k: 9.8,
    },
    heroImage: "https://images.unsplash.com/photo-1502175353174-a7a70e73b4c3?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "san-francisco",
    name: "San Francisco / Bay Area",
    state: "CA",
    grade: "A",
    score: 87,
    rank: 3,
    tagline: "The Innovator",
    verdict: "Blue Bottle started here. Then Nestlé bought it. The indies kept going.",
    stats: {
      totalSpecialtyShops: 289,
      bestShop: "Sightglass",
      bestScore: 91,
      worstShop: "Starbucks FiDi",
      worstScore: 35,
      avgLattePrice: 6.0,
      roastersPer100k: 8.7,
    },
    heroImage: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "new-york-city",
    name: "New York City",
    state: "NY",
    grade: "A",
    score: 86,
    rank: 4,
    tagline: "The Global Stage",
    verdict:
      "SEY might be pulling the best espresso in America. The $1 bodega coffee is still undefeated for value.",
    stats: {
      totalSpecialtyShops: 478,
      bestShop: "SEY Coffee",
      bestScore: 93,
      worstShop: "Starbucks Times Square",
      worstScore: 30,
      avgLattePrice: 6.25,
      roastersPer100k: 5.6,
    },
    heroImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "CA",
    grade: "A-",
    score: 84,
    rank: 5,
    tagline: "The Sprawl of Quality",
    verdict: "Great coffee exists everywhere in LA. The problem is getting to it.",
    stats: {
      totalSpecialtyShops: 356,
      bestShop: "Go Get Em Tiger",
      bestScore: 90,
      worstShop: "Coffee Bean Hollywood",
      worstScore: 33,
      avgLattePrice: 6.0,
      roastersPer100k: 3.5,
    },
    heroImage: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    grade: "A-",
    score: 83,
    rank: 6,
    tagline: "The Birthplace of Third Wave",
    verdict: "Intelligentsia started here. The city never stopped pushing.",
    stats: {
      totalSpecialtyShops: 198,
      bestShop: "Intelligentsia",
      bestScore: 89,
      worstShop: "Dunkin' Loop",
      worstScore: 34,
      avgLattePrice: 5.5,
      roastersPer100k: 7.2,
    },
    heroImage: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "denver",
    name: "Denver",
    state: "CO",
    grade: "B+",
    score: 79,
    rank: 7,
    tagline: "Mile High Caffeine",
    verdict: "Sweet Bloom alone justifies the altitude.",
    stats: {
      totalSpecialtyShops: 134,
      bestShop: "Sweet Bloom",
      bestScore: 88,
      worstShop: "Starbucks 16th St",
      worstScore: 36,
      avgLattePrice: 5.5,
      roastersPer100k: 8.1,
    },
    heroImage: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "austin",
    name: "Austin",
    state: "TX",
    grade: "B+",
    score: 78,
    rank: 8,
    tagline: "Keep Austin Caffeinated",
    verdict: "The tech bros drink Cuvée. The musicians drink Fleet. Everyone wins.",
    stats: {
      totalSpecialtyShops: 112,
      bestShop: "Cuvée Coffee",
      bestScore: 87,
      worstShop: "Starbucks 6th St",
      worstScore: 35,
      avgLattePrice: 5.25,
      roastersPer100k: 7.3,
    },
    heroImage: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "nashville",
    name: "Nashville",
    state: "TN",
    grade: "B+",
    score: 77,
    rank: 9,
    tagline: "Music City Brews",
    verdict:
      "Barista Parlor is the honky-tonk of coffee — loud, proud, and unapologetically itself.",
    stats: {
      totalSpecialtyShops: 89,
      bestShop: "Barista Parlor",
      bestScore: 86,
      worstShop: "Starbucks Broadway",
      worstScore: 36,
      avgLattePrice: 5.25,
      roastersPer100k: 6.8,
    },
    heroImage: "https://images.unsplash.com/photo-1545419913-775e4b1b4a38?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "minneapolis",
    name: "Minneapolis / St. Paul",
    state: "MN",
    grade: "B+",
    score: 77,
    rank: 10,
    tagline: "The Frozen Frontier",
    verdict:
      "When it's -20°F, coffee isn't a luxury — it's survival. Spyhouse makes survival taste incredible.",
    stats: {
      totalSpecialtyShops: 78,
      bestShop: "Spyhouse Coffee",
      bestScore: 86,
      worstShop: "Caribou Coffee",
      worstScore: 40,
      avgLattePrice: 5.0,
      roastersPer100k: 7.9,
    },
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "washington-dc",
    name: "Washington, DC",
    state: "DC",
    grade: "B+",
    score: 76,
    rank: 11,
    tagline: "Power Brews",
    verdict: "The only city where your barista might have a security clearance.",
    stats: {
      totalSpecialtyShops: 98,
      bestShop: "Compass Coffee",
      bestScore: 85,
      worstShop: "Starbucks Capitol Hill",
      worstScore: 37,
      avgLattePrice: 5.75,
      roastersPer100k: 6.4,
    },
    heroImage: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "boston",
    name: "Boston",
    state: "MA",
    grade: "B+",
    score: 76,
    rank: 12,
    tagline: "The GOAT's Home",
    verdict: "George Howell invented specialty coffee grading. His cafe is still the standard.",
    stats: {
      totalSpecialtyShops: 87,
      bestShop: "George Howell Coffee",
      bestScore: 91,
      worstShop: "Dunkin' Faneuil Hall",
      worstScore: 33,
      avgLattePrice: 5.5,
      roastersPer100k: 5.8,
    },
    heroImage: "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "GA",
    grade: "B",
    score: 74,
    rank: 13,
    tagline: "The New South Brews",
    verdict:
      "Chrome Yellow is doing things with coffee that make you forget you're in a strip mall.",
    stats: {
      totalSpecialtyShops: 76,
      bestShop: "Chrome Yellow",
      bestScore: 85,
      worstShop: "Starbucks Peachtree",
      worstScore: 37,
      avgLattePrice: 5.25,
      roastersPer100k: 4.8,
    },
    heroImage: "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    state: "PA",
    grade: "B",
    score: 73,
    rank: 14,
    tagline: "Gritty Brews",
    verdict: "La Colombe was born here. Elixr stayed independent. Philly respects the hustle.",
    stats: {
      totalSpecialtyShops: 82,
      bestShop: "Elixr Coffee",
      bestScore: 86,
      worstShop: "Dunkin' Center City",
      worstScore: 34,
      avgLattePrice: 5.25,
      roastersPer100k: 5.1,
    },
    heroImage: "https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "FL",
    grade: "B",
    score: 72,
    rank: 15,
    tagline: "Cafecito Capital",
    verdict: "The ventanita colada culture is sacred. The specialty scene is catching up.",
    stats: {
      totalSpecialtyShops: 67,
      bestShop: "Vice City Bean",
      bestScore: 84,
      worstShop: "Starbucks South Beach",
      worstScore: 36,
      avgLattePrice: 5.75,
      roastersPer100k: 3.2,
    },
    heroImage: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "dallas",
    name: "Dallas / Fort Worth",
    state: "TX",
    grade: "B",
    score: 71,
    rank: 16,
    tagline: "Big D Brews",
    verdict: "Davis Street is proof that Texas can do delicate.",
    stats: {
      totalSpecialtyShops: 78,
      bestShop: "Davis Street Espresso",
      bestScore: 85,
      worstShop: "Starbucks NorthPark",
      worstScore: 37,
      avgLattePrice: 5.25,
      roastersPer100k: 4.1,
    },
    heroImage: "https://images.unsplash.com/photo-1545194445-dddb8f4487c6?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "houston",
    name: "Houston",
    state: "TX",
    grade: "B-",
    score: 69,
    rank: 17,
    tagline: "Space City Sips",
    verdict: "Boomtown is aptly named. Houston's coffee scene is exploding.",
    stats: {
      totalSpecialtyShops: 65,
      bestShop: "Boomtown Coffee",
      bestScore: 84,
      worstShop: "Starbucks Galleria",
      worstScore: 36,
      avgLattePrice: 5.0,
      roastersPer100k: 2.8,
    },
    heroImage: "https://images.unsplash.com/photo-1548519853-a7c05d085e24?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "san-diego",
    name: "San Diego",
    state: "CA",
    grade: "B",
    score: 72,
    rank: 18,
    tagline: "Surf & Sip",
    verdict: "Bird Rock alone makes San Diego a coffee destination.",
    stats: {
      totalSpecialtyShops: 72,
      bestShop: "Bird Rock Coffee",
      bestScore: 87,
      worstShop: "Coffee Bean La Jolla",
      worstScore: 38,
      avgLattePrice: 5.5,
      roastersPer100k: 5.3,
    },
    heroImage: "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "new-orleans",
    name: "New Orleans",
    state: "LA",
    grade: "B-",
    score: 68,
    rank: 19,
    tagline: "Chicory & Beyond",
    verdict: "French Truck proved NOLA can do more than chicory. The city is listening.",
    stats: {
      totalSpecialtyShops: 45,
      bestShop: "French Truck Coffee",
      bestScore: 84,
      worstShop: "Café Du Monde",
      worstScore: 42,
      avgLattePrice: 5.0,
      roastersPer100k: 5.7,
    },
    heroImage: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "detroit",
    name: "Detroit",
    state: "MI",
    grade: "B-",
    score: 67,
    rank: 20,
    tagline: "Motor City Roasts",
    verdict: "Anthology is building something special in a city that knows about reinvention.",
    stats: {
      totalSpecialtyShops: 42,
      bestShop: "Anthology Coffee",
      bestScore: 83,
      worstShop: "Biggby Coffee",
      worstScore: 35,
      avgLattePrice: 4.75,
      roastersPer100k: 4.2,
    },
    heroImage: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "salt-lake-city",
    name: "Salt Lake City",
    state: "UT",
    grade: "B-",
    score: 66,
    rank: 21,
    tagline: "The Unexpected Scene",
    verdict:
      "La Barba is proof that great coffee can thrive anywhere — even in a state that doesn't drink alcohol.",
    stats: {
      totalSpecialtyShops: 38,
      bestShop: "La Barba Coffee",
      bestScore: 84,
      worstShop: "Beans & Brews",
      worstScore: 36,
      avgLattePrice: 5.0,
      roastersPer100k: 6.1,
    },
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "raleigh-durham",
    name: "Raleigh-Durham",
    state: "NC",
    grade: "B",
    score: 70,
    rank: 22,
    tagline: "Counter Culture Country",
    verdict:
      "Counter Culture HQ is here. The entire Triangle benefits from the proximity to greatness.",
    stats: {
      totalSpecialtyShops: 56,
      bestShop: "Counter Culture Coffee",
      bestScore: 88,
      worstShop: "Starbucks RTP",
      worstScore: 37,
      avgLattePrice: 4.75,
      roastersPer100k: 6.8,
    },
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "pittsburgh",
    name: "Pittsburgh",
    state: "PA",
    grade: "B-",
    score: 65,
    rank: 23,
    tagline: "Steel City Brews",
    verdict: "De Fer is doing things with espresso that would make the old steel barons proud.",
    stats: {
      totalSpecialtyShops: 34,
      bestShop: "De Fer Coffee",
      bestScore: 83,
      worstShop: "Crazy Mocha",
      worstScore: 38,
      avgLattePrice: 4.75,
      roastersPer100k: 5.4,
    },
    heroImage: "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "phoenix",
    name: "Phoenix / Scottsdale",
    state: "AZ",
    grade: "C+",
    score: 62,
    rank: 24,
    tagline: "Desert Drip",
    verdict:
      "Cartel Coffee is an oasis — literally and figuratively — in a chain-dominated desert.",
    stats: {
      totalSpecialtyShops: 45,
      bestShop: "Cartel Coffee Lab",
      bestScore: 84,
      worstShop: "Dutch Bros Tempe",
      worstScore: 32,
      avgLattePrice: 5.25,
      roastersPer100k: 2.9,
    },
    heroImage: "https://images.unsplash.com/photo-1558645836-e44122a743ee?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    state: "NV",
    grade: "C+",
    score: 58,
    rank: 25,
    tagline: "The Long Shot",
    verdict: "Mothership is proof that even Vegas can have a soul — at least before 10am.",
    stats: {
      totalSpecialtyShops: 28,
      bestShop: "Mothership Coffee",
      bestScore: 82,
      worstShop: "Starbucks Strip",
      worstScore: 30,
      avgLattePrice: 5.5,
      roastersPer100k: 2.1,
    },
    heroImage: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1920",
    bestShops: [],
    worstShops: [],
    chainScores: [],
    bridgeDrinks: [],
    nonCoffeeSpots: [],
  },
];

export interface NationalStats {
  totalCities: number;
  totalShopsScored: number;
  avgNationalLattePrice: number;
  bestShopNational: string;
  bestScoreNational: number;
  worstShopNational: string;
  worstScoreNational: number;
  topCity: string;
  topCityScore: number;
}

export const NATIONAL_STATS: NationalStats = {
  totalCities: 25,
  totalShopsScored: 1250,
  avgNationalLattePrice: 5.47,
  bestShopNational: "SEY Coffee (NYC)",
  bestScoreNational: 93,
  worstShopNational: "Starbucks Times Square (NYC)",
  worstScoreNational: 30,
  topCity: "Portland, OR",
  topCityScore: 88,
};

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitiesSorted(): CityData[] {
  return [...CITIES].sort((a, b) => a.rank - b.rank);
}

export function getGradeColor(grade: Grade): string {
  if (grade.startsWith("A")) return "text-emerald-400";
  if (grade.startsWith("B")) return "text-amber-400";
  if (grade.startsWith("C")) return "text-orange-400";
  if (grade.startsWith("D")) return "text-red-400";
  return "text-red-600";
}

export function getGradeBg(grade: Grade): string {
  if (grade.startsWith("A")) return "bg-emerald-500/20 border-emerald-500/30";
  if (grade.startsWith("B")) return "bg-amber-500/20 border-amber-500/30";
  if (grade.startsWith("C")) return "bg-orange-500/20 border-orange-500/30";
  if (grade.startsWith("D")) return "bg-red-500/20 border-red-500/30";
  return "bg-red-700/20 border-red-700/30";
}
