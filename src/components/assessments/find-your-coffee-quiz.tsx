"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourCoffee.tsx — the real 15
// questions, 6 dimensions (Roast Preference/Origin Curiosity/Brewing
// Ritual/Social Context/Caffeine Sensitivity/Flavor Complexity), 6 real
// archetypes (each with a real description and 5 real named coffee
// recommendations — roaster, origin, roast level, tasting notes, and a
// real "why" rationale), and the real archetype-matching logic (sum of
// each archetype's 2 primary dimension scores, highest wins) all ported
// unchanged and verbatim. This legacy file predates the shared
// `ThemedBackground`/`AssessmentIntro` component system the rest of
// Phase 9 is built on — it hand-rolled its own full-bleed hero-image +
// dark-overlay page shell — so it needed more normalization than most:
// **the hero image was `/api/img/coffee-orig_a935f111.jpg`, a dead Manus
// asset** (confirmed 404, same as every other `/api/img/` reference found
// during this migration) — dropped for the standard `ThemedBackground`
// light theme every sibling assessment uses (a new "coffee" warm-cream
// entry added to `themed-background.tsx`), rather than reproducing a
// broken background. `CoffeeParticles` (canvas bean particle field),
// `SteamEffect` (floating steam-wisp divs), and `SacredGeometry` (SVG
// overlay) all dropped — same decoration-not-worth-the-JS-cost call made
// repeatedly elsewhere. **Real bug fixed**: legacy read `window.innerWidth`
// directly during render twice (to pick grid columns and flex direction)
// — unsafe during SSR and a real hydration-mismatch source, same class of
// bug fixed in `journey-bar.tsx` — replaced with responsive Tailwind
// classes. `EmailGate`'s prop was `assessmentName` in legacy; this repo's
// port uses `assessmentSlug="coffee"` to match `find-your-coffee` in
// `lib/content/kit-source-tags.ts`'s `KIT_TAG_MAP`. Legacy imported
// `useJourneyProgress` for `markComplete` but never rendered a visible
// `<JourneyTracker />`, and never rendered `<AssessmentResultActions>` at
// all (that component didn't exist yet when this legacy page was
// written) — both added here for consistency with every other assessment
// in this migration, not presented as bugs, just brought current with
// the shared component library. The 3 real "Journey Continues" links
// (Diet/Movement/Sake — genuinely distinct destinations, not a
// duplicate-link bug) are kept.
type Dimension =
  | "Roast Preference"
  | "Origin Curiosity"
  | "Brewing Ritual"
  | "Social Context"
  | "Caffeine Sensitivity"
  | "Flavor Complexity";
const DIMENSIONS: Dimension[] = [
  "Roast Preference",
  "Origin Curiosity",
  "Brewing Ritual",
  "Social Context",
  "Caffeine Sensitivity",
  "Flavor Complexity",
];
const INITIAL_SCORES: Record<Dimension, number> = {
  "Roast Preference": 0,
  "Origin Curiosity": 0,
  "Brewing Ritual": 0,
  "Social Context": 0,
  "Caffeine Sensitivity": 0,
  "Flavor Complexity": 0,
};
const ACCENT = "#8B6914";

const QUESTIONS: {
  text: string;
  options: { text: string; scores: Partial<Record<Dimension, number>> }[];
}[] = [
  {
    text: "When you think of your ideal coffee, what first comes to mind?",
    options: [
      { text: "A deep, dark, and intense flavor", scores: { "Roast Preference": 2 } },
      { text: "A rare bean from a specific farm in Ethiopia", scores: { "Origin Curiosity": 2 } },
      { text: "The calming process of grinding and brewing", scores: { "Brewing Ritual": 2 } },
      { text: "A complex, multi-layered taste experience", scores: { "Flavor Complexity": 2 } },
    ],
  },
  {
    text: "How do you typically enjoy your coffee?",
    options: [
      { text: "Alone, as a moment of quiet contemplation", scores: { "Social Context": -1 } },
      { text: "With friends at a bustling cafe", scores: { "Social Context": 1 } },
      { text: "As a quick fuel-up during a busy day", scores: { "Caffeine Sensitivity": 1 } },
      { text: "As a post-dinner treat", scores: { "Caffeine Sensitivity": -1 } },
    ],
  },
  {
    text: "Which brewing method are you most drawn to?",
    options: [
      {
        text: "A classic espresso machine",
        scores: { "Brewing Ritual": 1, "Flavor Complexity": 1 },
      },
      {
        text: "A meticulous pour-over setup",
        scores: { "Brewing Ritual": 2, "Origin Curiosity": 1 },
      },
      { text: "A simple, reliable drip coffee maker", scores: { "Brewing Ritual": -1 } },
      {
        text: "An ancient, traditional method like a cezve",
        scores: { "Origin Curiosity": 1, "Brewing Ritual": 1 },
      },
    ],
  },
  {
    text: "How much caffeine do you prefer in your coffee?",
    options: [
      { text: "As much as possible!", scores: { "Caffeine Sensitivity": 2 } },
      { text: "A moderate amount to get me going", scores: { "Caffeine Sensitivity": 0 } },
      { text: "I prefer decaf or low-caffeine options", scores: { "Caffeine Sensitivity": -2 } },
      { text: "It depends on the time of day", scores: { "Caffeine Sensitivity": 0 } },
    ],
  },
  {
    text: "What kind of flavors do you seek in a coffee?",
    options: [
      {
        text: "Earthy, chocolatey, and nutty notes",
        scores: { "Flavor Complexity": -1, "Roast Preference": 1 },
      },
      {
        text: "Bright, fruity, and floral notes",
        scores: { "Flavor Complexity": 1, "Origin Curiosity": 1 },
      },
      { text: "A balanced, clean, and simple cup", scores: { "Flavor Complexity": -2 } },
      { text: "Spicy, exotic, and unconventional flavors", scores: { "Flavor Complexity": 2 } },
    ],
  },
  {
    text: "How important is the origin of your coffee beans to you?",
    options: [
      {
        text: "Extremely important; I want to know the farm and varietal",
        scores: { "Origin Curiosity": 2 },
      },
      {
        text: "Somewhat important; I like to know the country or region",
        scores: { "Origin Curiosity": 1 },
      },
      {
        text: "Not very important; I just want it to taste good",
        scores: { "Origin Curiosity": -1 },
      },
      { text: "I'm curious to learn more about it", scores: { "Origin Curiosity": 0 } },
    ],
  },
  {
    text: "Describe your ideal coffee-making process.",
    options: [
      { text: "Quick and efficient, under 5 minutes", scores: { "Brewing Ritual": -2 } },
      { text: "A precise, multi-step process I can perfect", scores: { "Brewing Ritual": 2 } },
      {
        text: "A social activity to do with others",
        scores: { "Social Context": 1, "Brewing Ritual": 0 },
      },
      { text: "An automated process I can set and forget", scores: { "Brewing Ritual": -1 } },
    ],
  },
  {
    text: "Where is your favorite place to drink coffee?",
    options: [
      { text: "A cozy corner in my home", scores: { "Social Context": -2 } },
      {
        text: "A trendy, third-wave coffee shop",
        scores: { "Social Context": 1, "Origin Curiosity": 1 },
      },
      { text: "Outdoors, in nature", scores: { "Social Context": 0 } },
      { text: "At my desk while I work", scores: { "Social Context": -1 } },
    ],
  },
  {
    text: "How do you feel about adding milk or sugar to your coffee?",
    options: [
      {
        text: "Never! I drink it black to appreciate the pure flavor.",
        scores: { "Flavor Complexity": 1, "Roast Preference": 1 },
      },
      {
        text: "I enjoy a little milk to balance the acidity.",
        scores: { "Flavor Complexity": -1 },
      },
      {
        text: "I love a sweet, creamy latte or cappuccino.",
        scores: { "Flavor Complexity": -2, "Social Context": 1 },
      },
      { text: "It depends on the coffee and my mood.", scores: { "Flavor Complexity": 0 } },
    ],
  },
  {
    text: "What roast level do you gravitate towards?",
    options: [
      {
        text: "Light roast, to preserve the bean's delicate nuances.",
        scores: { "Roast Preference": -2, "Origin Curiosity": 1 },
      },
      {
        text: "Medium roast, for a balanced and versatile cup.",
        scores: { "Roast Preference": 0 },
      },
      { text: "Dark roast, for a bold and smoky flavor.", scores: { "Roast Preference": 2 } },
      { text: "I'm not sure, I'm open to all roast levels.", scores: { "Roast Preference": 0 } },
    ],
  },
  {
    text: "How willing are you to experiment with your coffee routine?",
    options: [
      { text: "I have my go-to method and I stick with it.", scores: { "Brewing Ritual": -1 } },
      {
        text: "I'm always trying new beans, methods, and recipes.",
        scores: { "Brewing Ritual": 1, "Origin Curiosity": 1, "Flavor Complexity": 1 },
      },
      {
        text: "I'll try something new if a friend recommends it.",
        scores: { "Social Context": 1 },
      },
      {
        text: "I like to experiment, but I have a few trusted favorites.",
        scores: { "Brewing Ritual": 0 },
      },
    ],
  },
  {
    text: "What role does coffee play in your social life?",
    options: [
      { text: "It's the centerpiece of my social gatherings.", scores: { "Social Context": 2 } },
      { text: "It's a good excuse to catch up with a friend.", scores: { "Social Context": 1 } },
      { text: "I prefer to drink coffee alone.", scores: { "Social Context": -2 } },
      { text: "It doesn't play a significant role.", scores: { "Social Context": -1 } },
    ],
  },
  {
    text: "How does coffee affect your energy levels?",
    options: [
      { text: "It gives me a powerful, immediate boost.", scores: { "Caffeine Sensitivity": 2 } },
      { text: "It provides a gentle, sustained lift.", scores: { "Caffeine Sensitivity": 1 } },
      {
        text: "I'm very sensitive; a little goes a long way.",
        scores: { "Caffeine Sensitivity": -1 },
      },
      {
        text: "I can drink it right before bed and still sleep soundly.",
        scores: { "Caffeine Sensitivity": -2 },
      },
    ],
  },
  {
    text: "You're at a cafe with a huge menu. What do you order?",
    options: [
      {
        text: "The single-origin pour-over of the day.",
        scores: { "Origin Curiosity": 2, "Flavor Complexity": 1 },
      },
      {
        text: "A perfectly pulled shot of their house espresso.",
        scores: { "Roast Preference": 1, "Flavor Complexity": 1 },
      },
      {
        text: "An iced cold brew, even if it's cold outside.",
        scores: { "Brewing Ritual": 1, "Caffeine Sensitivity": 1 },
      },
      {
        text: "A beautifully crafted latte with intricate art.",
        scores: { "Social Context": 1, "Flavor Complexity": -1 },
      },
    ],
  },
  {
    text: "The story behind the bean is...",
    options: [
      { text: "...as important as the taste itself.", scores: { "Origin Curiosity": 2 } },
      { text: "...a nice bonus, but not essential.", scores: { "Origin Curiosity": 1 } },
      { text: "...something I've never really thought about.", scores: { "Origin Curiosity": -1 } },
      { text: "...less important than the brewing technique.", scores: { "Brewing Ritual": 1 } },
    ],
  },
];

interface CoffeeRec {
  name: string;
  origin: string;
  roast: string;
  notes: string;
  why: string;
}

interface CoffeeArchetype {
  description: string;
  dimensions: [Dimension, Dimension];
  recommendations: CoffeeRec[];
}

const ARCHETYPES: Record<string, CoffeeArchetype> = {
  "The Single Origin Purist": {
    description:
      "You are a connoisseur, a seeker of authenticity. For you, coffee is about terroir and transparency. You want to taste the place in your cup—the soil, the altitude, the climate. Each brew is a celebration of a single, exceptional bean.",
    dimensions: ["Origin Curiosity", "Flavor Complexity"],
    recommendations: [
      {
        name: "Ethiopian Yirgacheffe Kochere",
        origin: "Kochere, Gedeo Zone, Ethiopia",
        roast: "Light",
        notes: "Jasmine, bergamot, lemon zest, raw honey",
        why: "The gold standard for single-origin transparency. Heirloom varietals grown at 1,800–2,200m with traceable lot numbers. Each sip is a postcard from the birthplace of coffee.",
      },
      {
        name: "Gesha Village Estate Lot",
        origin: "Bench Maji, Ethiopia",
        roast: "Light",
        notes: "Tropical fruit, champagne effervescence, rose water",
        why: "The rarest cultivar on earth, grown at its genetic origin. Competition-grade lots with full traceability from seed to cup. This is terroir at its most profound.",
      },
      {
        name: "Kenya AA Nyeri Peaberry",
        origin: "Nyeri County, Kenya",
        roast: "Light–Medium",
        notes: "Blackcurrant, grapefruit, brown sugar, tomato-like acidity",
        why: "Peaberry beans develop as a single round seed, concentrating flavor. Kenyan AA grading ensures the largest, most complex beans. The SL-28 varietal delivers unmistakable origin character.",
      },
      {
        name: "Panama Hacienda La Esmeralda",
        origin: "Boquete, Chiriquí, Panama",
        roast: "Light",
        notes: "Mandarin orange, jasmine, papaya, silky body",
        why: "The farm that launched the Gesha revolution. Micro-lot auctions regularly exceed $1,000/lb. Each harvest is a vintage, and the terroir of Volcán Barú is unmistakable.",
      },
      {
        name: "Colombian Huila Supremo",
        origin: "Huila Department, Colombia",
        roast: "Medium",
        notes: "Caramel, red apple, milk chocolate, walnut",
        why: "Huila's volcanic soil and ideal altitude produce Colombia's most celebrated single-origin. Supremo grade ensures bean size and consistency. A purist's everyday luxury.",
      },
    ],
  },
  "The Espresso Architect": {
    description:
      "Precision, intensity, and structure define your coffee philosophy. You appreciate the science and art of a perfectly extracted espresso—the rich crema, the syrupy body, the powerful, concentrated flavor. You see coffee as a craft to be mastered.",
    dimensions: ["Roast Preference", "Flavor Complexity"],
    recommendations: [
      {
        name: "Lavazza Super Crema",
        origin: "Brazil, Colombia, India, Indonesia (Blend)",
        roast: "Medium",
        notes: "Hazelnut, brown sugar, mild dried fruit, velvety crema",
        why: "The Italian bar standard. Engineered for espresso extraction with a blend ratio that produces thick, persistent crema and a balanced, never-bitter shot every time.",
      },
      {
        name: "Illy Classico Espresso",
        origin: "Brazil, Ethiopia, India, Guatemala (Blend)",
        roast: "Medium",
        notes: "Caramel, orange blossom, toasted bread, chocolate",
        why: "Nine origins, one perfect balance. Illy's proprietary blend is pressure-packed in nitrogen to preserve freshness. The definition of architectural precision in a cup.",
      },
      {
        name: "Intelligentsia Black Cat Espresso",
        origin: "Brazil, Colombia (Seasonal Blend)",
        roast: "Medium",
        notes: "Dark chocolate, molasses, cherry, syrupy body",
        why: "A third-wave classic designed for the 25-second pull. The blend shifts seasonally but the profile stays locked: thick body, sweet finish, zero bitterness.",
      },
      {
        name: "Blue Bottle Giant Steps",
        origin: "Ethiopia, Uganda, Sumatra (Blend)",
        roast: "Medium–Dark",
        notes: "Fudge, stone fruit, smoky undertone, heavy body",
        why: "Named after Coltrane's masterpiece. Designed to shine as espresso with or without milk. The kind of shot that makes you close your eyes.",
      },
      {
        name: "Stumptown Hair Bender",
        origin: "Latin America, East Africa, Indonesia (Blend)",
        roast: "Medium",
        notes: "Citrus, dark chocolate, toffee, sweet smoke",
        why: "Portland's most iconic espresso blend. Complex enough to drink straight, structured enough to cut through milk. A masterclass in blend architecture.",
      },
    ],
  },
  "The Pour-Over Monk": {
    description:
      "For you, coffee is a meditation. The slow, deliberate ritual of the pour-over is as important as the final cup. You find beauty in the process, the control, and the clarity of flavor that this mindful method produces.",
    dimensions: ["Brewing Ritual", "Origin Curiosity"],
    recommendations: [
      {
        name: "Counter Culture Hologram",
        origin: "Ethiopia, Colombia (Seasonal Blend)",
        roast: "Light",
        notes: "Stone fruit, floral, citrus, clean finish",
        why: "Designed specifically for pour-over clarity. The light roast preserves delicate aromatics that bloom during a slow, controlled pour. Each cup rewards patience.",
      },
      {
        name: "Onyx Coffee Lab Monarch",
        origin: "Ethiopia (Single Origin)",
        roast: "Light",
        notes: "Blueberry, dark chocolate, lavender, wine-like body",
        why: "A competition-winning natural process Ethiopian that transforms during a V60 pour-over. The 4-minute brew time unlocks layers that faster methods miss entirely.",
      },
      {
        name: "George Howell Mamuto AA",
        origin: "Nyeri, Kenya",
        roast: "Light",
        notes: "Raspberry, grapefruit, brown sugar, silky mouthfeel",
        why: "George Howell pioneered specialty coffee in America. This Kenyan lot is selected specifically for filter brewing. The clarity in a Chemex is transcendent.",
      },
      {
        name: "Verve Sermon",
        origin: "Latin America (Seasonal Blend)",
        roast: "Light–Medium",
        notes: "Milk chocolate, nougat, orange, round sweetness",
        why: "A pour-over-friendly blend that forgives minor technique variations while still rewarding precision. The monk's daily practice bean.",
      },
      {
        name: "Tim Wendelboe Finca Tamana",
        origin: "Huila, Colombia",
        roast: "Light",
        notes: "Caramel, red grape, jasmine, buttery body",
        why: "From the World Barista Champion's own roastery in Oslo. Roasted specifically for filter methods. The kind of bean that makes a pour-over feel like a ceremony.",
      },
    ],
  },
  "The Cold Brew Rebel": {
    description:
      "You walk your own path, unbound by tradition. You prefer the smooth, low-acid, and highly caffeinated kick of cold brew. Your approach is patient, unconventional, and yields a result that is both potent and refreshing.",
    dimensions: ["Caffeine Sensitivity", "Brewing Ritual"],
    recommendations: [
      {
        name: "Bizzy Organic Cold Brew Blend",
        origin: "Central & South America (Blend)",
        roast: "Medium–Dark",
        notes: "Smooth chocolate, caramel, low acidity, clean finish",
        why: "Purpose-built for cold extraction. Coarse-ground and optimized for 12–24 hour steeping. The result is impossibly smooth with zero bitterness and maximum caffeine.",
      },
      {
        name: "Stone Street Cold Brew Reserve",
        origin: "Colombia (Single Origin)",
        roast: "Dark",
        notes: "Dark chocolate, cherry, smoky, full body",
        why: "Colombian supremo beans dark-roasted specifically for cold water extraction. The 100% Arabica beans deliver a concentrate that's bold enough to stand up to ice and milk.",
      },
      {
        name: "Chameleon Cold Brew Whole Bean",
        origin: "Peru, Mexico, Guatemala (Blend)",
        roast: "Medium–Dark",
        notes: "Cocoa, brown sugar, nutty, mellow acidity",
        why: "Organic, fair-trade, and engineered for the rebel's 24-hour steep. Makes a concentrate so smooth you can drink it straight from the jar.",
      },
      {
        name: "Death Wish Coffee",
        origin: "India, Peru (Blend)",
        roast: "Dark",
        notes: "Cherry, chocolate, bold, extremely high caffeine",
        why: "The world's strongest coffee, cold-brewed. For the rebel who wants maximum potency. A single concentrate serving packs roughly 300mg of caffeine.",
      },
      {
        name: "Stumptown Cold Brew Blend",
        origin: "Latin America, Africa (Blend)",
        roast: "Medium",
        notes: "Citrus, chocolate, sweet, clean",
        why: "The blend that helped launch the cold brew revolution. Stumptown's roast profile is calibrated for cold extraction's slower chemistry. Rebellion tastes this good.",
      },
    ],
  },
  "The Turkish Traditionalist": {
    description:
      "You are drawn to the ancient, communal roots of coffee. You appreciate the thick, potent, and unfiltered brew of the cezve, a method steeped in history and ceremony. For you, coffee is a shared experience that connects generations.",
    dimensions: ["Social Context", "Brewing Ritual"],
    recommendations: [
      {
        name: "Kurukahveci Mehmet Efendi",
        origin: "Brazil, Central America (Blend)",
        roast: "Medium",
        notes: "Earthy, cardamom-friendly, thick body, lingering finish",
        why: "The definitive Turkish coffee since 1871. Pre-ground to the powder-fine consistency that cezve brewing demands. This is the brand served in Istanbul's grand bazaar.",
      },
      {
        name: "Nuri Toplar Türk Kahvesi",
        origin: "Brazil, Ethiopia (Blend)",
        roast: "Medium–Dark",
        notes: "Smoky, spiced, full body, bittersweet chocolate",
        why: "From Istanbul's oldest coffee roaster (est. 1890). Stone-ground to the exact fineness required for proper foam formation. The taste of Ottoman tradition.",
      },
      {
        name: "Al Ameed Turkish Coffee with Cardamom",
        origin: "Brazil, Colombia (Blend)",
        roast: "Medium",
        notes: "Cardamom, sweet spice, creamy, aromatic",
        why: "Pre-blended with cardamom in the Gulf tradition. The spice is integrated during roasting, not after. Perfect for the traditionalist who honors the communal ritual.",
      },
      {
        name: "Najjar Selection Turkish Coffee",
        origin: "Brazil (Single Origin)",
        roast: "Dark",
        notes: "Intense, earthy, thick sediment, bold",
        why: "A Lebanese institution since 1957. The extra-fine grind produces the thick, fortune-telling sediment that makes Turkish coffee a ceremony, not just a drink.",
      },
      {
        name: "Kocatepe Dibek Coffee",
        origin: "Turkey (Traditional Blend)",
        roast: "Medium",
        notes: "Mastic, salep, chocolate, creamy, aromatic",
        why: "Dibek is the ancient stone-mortar grinding method. This blend includes traditional Turkish additions like mastic and salep root. Coffee as your great-grandmother made it.",
      },
    ],
  },
  "The Latte Artist": {
    description:
      "You see coffee as a canvas for creativity and connection. The social atmosphere of a cafe and the aesthetic beauty of a well-made latte are what you cherish. For you, coffee is a comforting, beautiful, and shared pleasure.",
    dimensions: ["Social Context", "Flavor Complexity"],
    recommendations: [
      {
        name: "La Colombe Corsica",
        origin: "Brazil, Colombia, Honduras (Blend)",
        roast: "Medium–Dark",
        notes: "Bittersweet chocolate, caramel, bold, creamy",
        why: "Designed to shine through milk. The dark chocolate and caramel notes become even more pronounced when steamed milk is added. The latte artist's workhorse.",
      },
      {
        name: "Oatly x Intelligentsia Collab Blend",
        origin: "Seasonal (Blend)",
        roast: "Medium",
        notes: "Vanilla, toffee, round sweetness, milk-friendly",
        why: "Co-developed with oat milk in mind. The roast profile is calibrated so the coffee's sweetness harmonizes with plant milk rather than fighting it. Modern latte perfection.",
      },
      {
        name: "Stumptown Holler Mountain",
        origin: "Latin America, East Africa (Blend)",
        roast: "Medium",
        notes: "Caramel, citrus, creamy body, sweet finish",
        why: "A crowd-pleasing blend that makes beautiful latte art thanks to its compatibility with properly textured milk. Sweet enough to skip the syrup.",
      },
      {
        name: "Blue Bottle Bella Donovan",
        origin: "Ethiopia, Sumatra (Blend)",
        roast: "Medium",
        notes: "Jammy fruit, chocolate, heavy body, sweet",
        why: "Named after a beloved regular. The fruit-forward Ethiopian component creates stunning contrast when poured into a rosetta. Coffee as visual art.",
      },
      {
        name: "Ceremony Coffee Thesis",
        origin: "Seasonal (Blend)",
        roast: "Medium",
        notes: "Chocolate, stone fruit, balanced, versatile",
        why: "A thesis on what espresso-based drinks should taste like. Pulls a beautiful shot with golden crema that holds latte art for minutes. The social media darling.",
      },
    ],
  },
};

const JOURNEY_CONTINUES = [
  { label: "Find Your Diet", href: "/find-your-diet" },
  { label: "Find Your Movement", href: "/find-your-movement" },
  { label: "Find Your Sake", href: "/find-your-sake" },
];

function getArchetype(scores: Record<Dimension, number>): string {
  let maxScore = -Infinity;
  let best = Object.keys(ARCHETYPES)[0];
  for (const name of Object.keys(ARCHETYPES)) {
    const [a, b] = ARCHETYPES[name].dimensions;
    const score = scores[a] + scores[b];
    if (score > maxScore) {
      maxScore = score;
      best = name;
    }
  }
  return best;
}

export function FindYourCoffeeQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (optionScores: Partial<Record<Dimension, number>>, idx: number) => {
    setSelectedOption(idx);
    setTimeout(() => {
      const next = { ...scores };
      for (const dim in optionScores) next[dim as Dimension] += optionScores[dim as Dimension] ?? 0;
      setScores(next);
      setSelectedOption(null);
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else setPhase("results");
    }, 300);
  };

  const archetype = getArchetype(scores);
  const archetypeInfo = ARCHETYPES[archetype];

  useEffect(() => {
    if (phase === "results") markComplete("find-your-coffee");
  }, [phase, markComplete]);

  const chartScores = useMemo(() => {
    const maxPossible = 10;
    const normalized: Record<string, number> = {};
    for (const dim of DIMENSIONS)
      normalized[dim] = Math.min(10, (Math.abs(scores[dim]) / maxPossible) * 10);
    return normalized;
  }, [scores]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="coffee" />
        <AssessmentIntro
          title="Find Your Coffee"
          subtitle="Every cup is a conversation between the bean and the drinker."
          description="From single-origin purity to espresso precision to the communal ritual of the cezve — this assessment maps your roast preference, brewing ritual, and flavor instincts to find the coffee philosophy that's really yours."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 5 }}
          whatYouGet={[
            "Your coffee archetype (one of six)",
            "A dimensional map of your brewing and flavor preferences",
            "Five real, named coffee recommendations matched to your profile",
            "Understanding of why you drink coffee the way you do",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      </div>
    );
  }

  if (phase === "questions") {
    const question = QUESTIONS[step];
    const progress = (step / QUESTIONS.length) * 100;

    return (
      <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-6 font-sans text-[#2C1810]">
        <ThemedBackground theme="coffee" />
        <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-brand-gold/10">
          <div
            className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="fixed top-6 right-6 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold/60">
          {step + 1} / {QUESTIONS.length}
        </div>

        <div className="w-full max-w-2xl py-16">
          <h2 className="mb-10 text-center font-heading text-[clamp(1.4rem,3vw,1.8rem)] leading-[1.4] font-normal text-brand-gold">
            {question.text}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, idx) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.scores, idx)}
                className={`rounded-xl border px-5 py-4 text-left text-[0.95rem] leading-relaxed transition-all ${
                  selectedOption === idx
                    ? "border-brand-gold-light/60 bg-brand-gold-light/20"
                    : "border-brand-gold/15 bg-white/40 hover:border-brand-gold/35 hover:bg-white/60"
                }`}
              >
                <span className="mb-1 block font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="coffee" />
        <EmailGate assessmentSlug="coffee" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="coffee" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mb-2 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/60 uppercase">
          Your Coffee Archetype
        </div>
        <h1 className="mb-6 font-heading text-[clamp(2rem,5vw,3rem)] leading-[1.2] font-normal text-brand-gold">
          {archetype}
        </h1>
        <p className="mx-auto mb-10 max-w-160 text-base leading-[1.8] text-[#5C4A3A]">
          {archetypeInfo.description}
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-8 sm:flex-row">
          <AssessmentRadarChart scores={chartScores} max={10} accentColor={ACCENT} />
          <div className="w-full max-w-70 text-left">
            <h3 className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/70 uppercase">
              Dimension Scores
            </h3>
            <div className="flex flex-col gap-1.5">
              {DIMENSIONS.map((dim) => (
                <div
                  key={dim}
                  className="flex justify-between border-b border-black/5 py-1.5 font-mono text-sm"
                >
                  <span className="text-[#5C4A3A]">{dim}</span>
                  <span className="text-brand-gold">
                    {scores[dim] > 0 ? "+" : ""}
                    {scores[dim]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12 text-left">
          <div className="mb-1 text-center font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/60 uppercase">
            Curated For You
          </div>
          <h2 className="mb-8 text-center font-heading text-2xl font-normal text-brand-gold italic">
            Your Coffees
          </h2>
          <div className="flex flex-col gap-5">
            {archetypeInfo.recommendations.map((rec) => (
              <div
                key={rec.name}
                className="rounded-xl border border-brand-gold/15 bg-white/40 p-6"
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-heading text-lg font-semibold text-[#2C1810]">{rec.name}</h3>
                  <span className="rounded-sm border border-brand-gold/20 bg-brand-gold/8 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.1em] text-brand-gold whitespace-nowrap">
                    {rec.roast} Roast
                  </span>
                </div>
                <div className="mb-1.5 font-mono text-[0.7rem] tracking-[0.03em] text-brand-gold/70">
                  {rec.origin}
                </div>
                <div className="mb-2.5 text-sm text-brand-gold italic">{rec.notes}</div>
                <p className="text-[0.92rem] leading-relaxed text-[#5C4A3A]">{rec.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-heading text-xl font-normal text-brand-gold">
            The Journey Continues
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {JOURNEY_CONTINUES.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm border border-brand-gold/20 px-4 py-2 font-mono text-[0.75rem] tracking-[0.1em] text-brand-gold uppercase transition-colors hover:border-brand-gold/50 hover:bg-brand-gold/6"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <JourneyTracker variant="light" currentAssessmentId="find-your-coffee" />
        </div>

        <div className="mb-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-coffee" />
          <button
            onClick={() => {
              setPhase("landing");
              setStep(0);
              setScores(INITIAL_SCORES);
              setEmailGated(false);
            }}
            className="rounded-lg border border-brand-gold/20 px-6 py-3 font-mono text-[0.75rem] tracking-[0.1em] text-brand-gold/70 uppercase transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
          >
            Retake the Assessment
          </button>
        </div>
      </div>

      <WhatsNext />
    </div>
  );
}
