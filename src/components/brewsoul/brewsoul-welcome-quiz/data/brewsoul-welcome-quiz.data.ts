// Questions, identities and copy for the BrewSoul welcome quiz (/brewsoul).
// Ported from legacy client/src/pages/brewsoul/BrewSoulWelcome.tsx: 8 screens
// that compute a "coffee identity" and gate entry to /brewsoul/home. Real
// content, unchanged.

export const SCREENS = [
  {
    q: "Why are you here today?",
    multi: false,
    opts: [
      { emoji: "🔍", text: "I want better coffee at home", tag: "consumer" },
      { emoji: "💼", text: "I source, sell, or serve coffee professionally", tag: "b2b" },
      { emoji: "🌍", text: "I want to understand where my money goes", tag: "impact" },
      { emoji: "🧪", text: "I'm a coffee nerd and I want to go deeper", tag: "connoisseur" },
      { emoji: "🤷", text: "I'm curious — surprise me", tag: "discovery" },
    ],
  },
  {
    q: "Your current relationship with coffee — be honest:",
    multi: false,
    opts: [
      { emoji: "☕", text: "It's fuel. I need it to function. Don't romanticize it.", tag: "functional" },
      { emoji: "🎭", text: "It's a ritual. The making matters as much as the drinking.", tag: "ritual" },
      { emoji: "🔬", text: "It's a rabbit hole. I own a refractometer.", tag: "obsessed" },
      { emoji: "💰", text: "It's a business. I need intelligence, not inspiration.", tag: "professional" },
      { emoji: "🌱", text: "It's a vote. Every purchase is political.", tag: "activist" },
    ],
  },
  {
    q: "The hard questions — coffee's dark side:",
    sub: "Coffee isn't all good. We believe in full disclosure. Which concerns you most?",
    multi: false,
    opts: [
      { emoji: "😴", text: "Sleep disruption — caffeine has a 6-hour half-life", tag: "sleep" },
      { emoji: "💔", text: "Anxiety & cortisol — spikes stress hormones", tag: "anxiety" },
      { emoji: "🦴", text: "Bone density — interferes with calcium absorption", tag: "bone" },
      { emoji: "🌍", text: "Environmental cost — water, deforestation, carbon", tag: "environment" },
      { emoji: "👨‍🌾", text: "Human cost — poverty wages, child labor", tag: "human" },
      { emoji: "✅", text: "None — the benefits outweigh it for me", tag: "none" },
      { emoji: "📚", text: "All of them — show me everything", tag: "all" },
    ],
  },
  {
    q: "And the bright side — what do you love about it?",
    multi: false,
    opts: [
      { emoji: "🧠", text: "Cognitive enhancement — focus, memory, reaction time", tag: "cognitive" },
      { emoji: "🏃", text: "Physical performance — endurance improvement", tag: "physical" },
      { emoji: "❤️", text: "Longevity markers — lower all-cause mortality", tag: "longevity" },
      { emoji: "🛡️", text: "Antioxidant powerhouse — #1 source in Western diets", tag: "antioxidant" },
      { emoji: "🧬", text: "Disease risk reduction — Parkinson's, diabetes, cancer", tag: "disease" },
      { emoji: "🎨", text: "The experience — flavor complexity, ritual, community", tag: "experience" },
      { emoji: "😊", text: "It makes me happy — dopamine is underrated", tag: "happy" },
    ],
  },
  {
    q: "Quick palate check:",
    sub: "These map your flavor preferences to coffee origins and processing methods.",
    multi: false,
    type: "palate" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "What would make you pay MORE for coffee?",
    multi: true,
    opts: [
      { emoji: "🔍", text: "Verified farmer payment transparency", tag: "transparency" },
      { emoji: "🧫", text: "Third-party mold/mycotoxin testing", tag: "mold" },
      { emoji: "💎", text: "Rare variety (Gesha, Eugenioides, Laurina)", tag: "rare" },
      { emoji: "🧪", text: "Experimental processing (anaerobic, carbonic)", tag: "experimental" },
      { emoji: "🏆", text: "Competition winner or 90+ SCA score", tag: "competition" },
      { emoji: "💵", text: "I won't — price is price", tag: "price" },
    ],
  },
  {
    q: "The weirdness scale — how deep do you want to go?",
    multi: false,
    type: "slider" as const,
    opts: [] as { emoji: string; text: string; tag: string }[],
  },
  {
    q: "One last thing — how do you drink it?",
    multi: false,
    opts: [
      { emoji: "⚫", text: "Black, always", tag: "purist" },
      { emoji: "🥛", text: "With milk/oat milk", tag: "latte" },
      { emoji: "🧊", text: "Iced or cold brew", tag: "cold" },
      { emoji: "🎨", text: "It depends on the coffee", tag: "flexible" },
    ],
  },
];

export const PALATE_QUESTIONS = [
  { label: "Grapefruit:", options: ["Love it", "Tolerate it", "Hate it"], dim: "acid" },
  { label: "Dark chocolate:", options: ["55%", "72%", "85%+"], dim: "bitter" },
  { label: "Wine:", options: ["Clean whites", "Natural/funky", "Big reds", "Don't drink wine"], dim: "processing" },
  { label: "Toast:", options: ["Barely golden", "Golden brown", "Dark & crunchy"], dim: "roast" },
];

export const IDENTITIES = [
  {
    id: "terroir-purist",
    name: "The Terroir Purist",
    badge: "🌿",
    desc: "You want the bean to speak. Light roasts, washed processing, single origins. Your heroes are Tim Wendelboe and George Howell. You probably own a refractometer.",
    path: ["Varieties", "Farm Passports", "QPR Best Value"],
    gear: [
      { name: "Hario V60", price: "$9" },
      { name: "Fellow Stagg EKG", price: "$165" },
      { name: "Baratza Encore ESP", price: "$170" },
    ],
  },
  {
    id: "fermentation-explorer",
    name: "The Fermentation Explorer",
    badge: "🧪",
    desc: "You want coffee that makes you question what coffee IS. Anaerobic, carbonic maceration, thermal shock, koji. You're the natural wine person of the coffee world.",
    path: ["Processing Deep-Dive", "Experimental Lots", "Weirdest Coffees"],
    gear: [
      { name: "AeroPress Clear", price: "$40" },
      { name: "Timemore C3", price: "$70" },
      { name: "Acaia Pearl", price: "$150" },
    ],
  },
  {
    id: "ritual-architect",
    name: "The Ritual Architect",
    badge: "🎭",
    desc: "The making is the meditation. Pour-over is prayer with caffeine. Every variable is intentional. Your grinder cost more than your couch.",
    path: ["Brew Guide", "Gear Recs", "Daily Rotation Builder"],
    gear: [
      { name: "Origami Dripper", price: "$38" },
      { name: "Comandante C40", price: "$280" },
      { name: "Fellow Atmos", price: "$30" },
    ],
  },
  {
    id: "impact-alchemist",
    name: "The Impact Alchemist",
    badge: "🌍",
    desc: "Where the dollar goes matters as much as what's in the cup. You want transparency, farmer equity, proof. Every purchase is a vote.",
    path: ["Follow The Dollar", "Transparency Scoreboard", "Farm Passports"],
    gear: [
      { name: "Clever Dripper", price: "$25" },
      { name: "JavaPresse", price: "$40" },
      { name: "KeepCup", price: "$20" },
    ],
  },
  {
    id: "pressure-seeker",
    name: "The Pressure Seeker",
    badge: "☕",
    desc: "Espresso is your language. Crema is your metric. Intensity, body, speed. Dialing in a new single-origin espresso is your weekend project.",
    path: ["Espresso Catalog", "Gear", "Roaster Directory"],
    gear: [
      { name: "Flair Signature", price: "$179" },
      { name: "Normcore V4", price: "$40" },
      { name: "Eureka Mignon Notte", price: "$249" },
    ],
  },
  {
    id: "the-awakening",
    name: "The Awakening",
    badge: "✨",
    desc: "You know you want better than Starbucks but don't know where to start. Perfect. That's exactly why we built this.",
    path: ["Coffee 101", "Taste Quiz", "Top 10 QPR"],
    gear: [
      { name: "AeroPress Go", price: "$35" },
      { name: "Timemore C2", price: "$55" },
      { name: "Fellow Carter", price: "$30" },
    ],
  },
];

export type Identity = (typeof IDENTITIES)[number];

// The line under the weirdness slider, by value (1 and 2 share a line).
export const WEIRDNESS_LINES: Record<number, string> = {
  1: "Reliable, well-sourced, no surprises.",
  2: "Reliable, well-sourced, no surprises.",
  3: "Single-origin, well-sourced, traceable.",
  4: "You appreciate variety and processing differences.",
  5: "You want to understand what makes each coffee unique.",
  6: "Experimental processing? Yes please.",
  7: "Anaerobic fermentation, Sidra variety, thermal shock.",
  8: "You seek out the unusual and the boundary-pushing.",
  9: "Koji-fermented, single-tree lots, species experiments.",
  10: "You'll pay $150 for 100g of koji-fermented eugenioides from a single tree.",
};

export const welcomeQuizData = {
  intro: {
    eyebrow: "Before We Pour — Who Are You?",
    titleLine1: "The world's most complex legal drug.",
    titleLine2: "Let's find out who you are inside it.",
    body: "1,000+ flavor compounds. $200B industry. 125 million people depend on it for survival. Your relationship with coffee says more about you than you think. Eight questions. No wrong answers. A path built just for you.",
  },
  continue: "Continue",
  sliderMin: "1 — Just give me good coffee",
  sliderMax: "10 — Koji eugenioides",
  sliderLabel: "Weirdness, 1 to 10",
  skip: "Skip — take me straight to the coffee",
  identity: {
    eyebrow: "Your Coffee Identity",
    path: "Your Recommended Path",
    gear: "Starter Gear",
    enter: "Enter BrewSoul",
    tasteQuiz: "Or: Take the Taste Quiz",
    retake: "Retake assessment",
  },
};
