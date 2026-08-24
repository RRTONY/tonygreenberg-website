/**
 * FIND YOUR SAKE
 * 
 * A standalone assessment matching users to their ideal sake style.
 * 20 questions across 5 dimensions: palate, ritual, terroir, philosophy, and season.
 * Results map to specific sake categories with tasting notes, pairings, and producers.
 * 
 * Design: Same dark contemplative glass-morphism as Find My ecosystem.
 * "Rice, water, koji, time. The most honest drink on earth."
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ── TYPES ── */

interface Choice {
  text: string;
  dimensions: Record<string, number>;
}

interface Question {
  id: number;
  stem: string;
  subtext: string;
  choices: Choice[];
}

interface SakeProfile {
  id: string;
  name: string;
  japaneseName: string;
  tagline: string;
  description: string;
  primaryDimension: string;
  tastingNotes: string;
  pairings: string[];
  servingTemp: string;
  producers: { name: string; region: string; note: string }[];
  resources: { title: string; url: string; type: string }[];
  relatedStyles: string[];
  shareText: string;
}

/* ── DIMENSION LABELS ── */

const DIMENSION_LABELS: Record<string, string> = {
  palate: "Palate",
  ritual: "Ritual",
  terroir: "Terroir",
  philosophy: "Philosophy",
  season: "Season",
};

/* ── QUESTIONS (20 total, 4 per dimension) ── */

const QUESTIONS: Question[] = [
  // ── PALATE DIMENSION (Q1-4) ──
  {
    id: 1,
    stem: "Close your eyes. What does comfort taste like?",
    subtext: "Not the food. The feeling in your mouth.",
    choices: [
      { text: "Clean and bright — like cold spring water after a long walk", dimensions: { palate: 3, season: 1 } },
      { text: "Rich and layered — like honey that remembers the flowers", dimensions: { palate: 3, terroir: 1 } },
      { text: "Dry and mineral — like licking a river stone in the best possible way", dimensions: { palate: 3, philosophy: 1 } },
      { text: "Soft and round — like a whisper that fills the whole room", dimensions: { palate: 2, ritual: 2 } },
    ],
  },
  {
    id: 2,
    stem: "You're handed a glass of something you've never tried. What do you notice first?",
    subtext: "The first thing that registers before thinking kicks in.",
    choices: [
      { text: "The aroma — I'm already reading the story before it touches my lips", dimensions: { palate: 3, philosophy: 1 } },
      { text: "The weight — how it sits in the glass, the viscosity, the promise of body", dimensions: { palate: 3, terroir: 1 } },
      { text: "The temperature — cold, warm, room temp tells me everything about intention", dimensions: { ritual: 3, palate: 1 } },
      { text: "The vessel — the cup or glass is the first chapter of the experience", dimensions: { ritual: 3, season: 1 } },
    ],
  },
  {
    id: 3,
    stem: "Which of these textures makes your nervous system exhale?",
    subtext: "Texture is the body's way of choosing before the mind catches up.",
    choices: [
      { text: "Silk — effortless, barely there, gone before you realize it arrived", dimensions: { palate: 3, season: 1 } },
      { text: "Cream — full, coating, the kind of presence that lingers", dimensions: { palate: 3, terroir: 1 } },
      { text: "Crisp — like biting into a cold apple at the exact right moment", dimensions: { palate: 3, philosophy: 1 } },
      { text: "Velvet — weight without heaviness, warmth without heat", dimensions: { palate: 2, ritual: 2 } },
    ],
  },
  {
    id: 4,
    stem: "When a drink is perfect, what happens in your body?",
    subtext: "Not what you think. What you feel.",
    choices: [
      { text: "My shoulders drop — it's relief, like the first breath after holding one too long", dimensions: { palate: 2, philosophy: 2 } },
      { text: "My eyes close — the taste demands my full attention, everything else disappears", dimensions: { palate: 2, ritual: 2 } },
      { text: "I smile involuntarily — surprise and recognition at the same time", dimensions: { palate: 2, season: 2 } },
      { text: "I go quiet — something sacred just happened and words would ruin it", dimensions: { palate: 1, ritual: 2, terroir: 1 } },
    ],
  },
  // ── RITUAL DIMENSION (Q5-8) ──
  {
    id: 5,
    stem: "How do you prefer to drink?",
    subtext: "The context is the content.",
    choices: [
      { text: "Alone, slowly, as a form of meditation — the drink is the companion", dimensions: { ritual: 3, philosophy: 1 } },
      { text: "With one other person, sharing the bottle like sharing a secret", dimensions: { ritual: 3, season: 1 } },
      { text: "At a table full of people, where the drink is the thread connecting the conversation", dimensions: { ritual: 3, terroir: 1 } },
      { text: "Standing at a counter, watching someone who loves their craft pour it for me", dimensions: { ritual: 2, terroir: 2 } },
    ],
  },
  {
    id: 6,
    stem: "What's the right amount of ceremony?",
    subtext: "Between carelessness and preciousness, where do you live?",
    choices: [
      { text: "Maximum — the ritual IS the experience. Every gesture matters.", dimensions: { ritual: 3, philosophy: 1 } },
      { text: "Some — a beautiful cup, a moment of pause, but not performance", dimensions: { ritual: 3, season: 1 } },
      { text: "Minimal — pour it, drink it, let the liquid speak for itself", dimensions: { ritual: 2, palate: 2 } },
      { text: "Contextual — sometimes a paper cup at a festival, sometimes a ceramic ochoko at midnight", dimensions: { ritual: 2, season: 2 } },
    ],
  },
  {
    id: 7,
    stem: "You're hosting someone you deeply respect. What do you pour?",
    subtext: "The drink you choose for others reveals what you worship.",
    choices: [
      { text: "Something rare that they've never tried — I want to give them a new experience", dimensions: { ritual: 3, terroir: 1 } },
      { text: "Something I love that I want to share — this is who I am in liquid form", dimensions: { ritual: 2, philosophy: 2 } },
      { text: "Something from where they're from — honoring their story, not mine", dimensions: { ritual: 2, terroir: 2 } },
      { text: "Whatever pairs best with the food — the meal is the main character tonight", dimensions: { ritual: 2, palate: 2 } },
    ],
  },
  {
    id: 8,
    stem: "The best drinking experiences you've had — what made them unforgettable?",
    subtext: "Not the drink. The everything else.",
    choices: [
      { text: "The setting — a specific place, a specific light, a specific temperature in the air", dimensions: { season: 3, ritual: 1 } },
      { text: "The company — the people elevated the liquid into something transcendent", dimensions: { ritual: 3, season: 1 } },
      { text: "The discovery — tasting something that rearranged my understanding of what was possible", dimensions: { palate: 2, terroir: 2 } },
      { text: "The silence — a moment of perfect stillness where the drink was the only thing happening", dimensions: { philosophy: 3, ritual: 1 } },
    ],
  },
  // ── TERROIR DIMENSION (Q9-12) ──
  {
    id: 9,
    stem: "Does it matter where something comes from?",
    subtext: "The question underneath every bottle.",
    choices: [
      { text: "Everything — place is flavor. Geography is biography. Terroir is truth.", dimensions: { terroir: 3, philosophy: 1 } },
      { text: "Mostly — I want to know the story, but the liquid has to stand on its own", dimensions: { terroir: 3, palate: 1 } },
      { text: "Somewhat — I appreciate provenance but I'm not a purist about it", dimensions: { terroir: 2, ritual: 2 } },
      { text: "The maker matters more than the place — craft transcends geography", dimensions: { philosophy: 3, terroir: 1 } },
    ],
  },
  {
    id: 10,
    stem: "Which landscape calls to you?",
    subtext: "The land that makes the rice that makes the sake that makes the moment.",
    choices: [
      { text: "Mountain streams and snow — purity distilled through altitude and cold", dimensions: { terroir: 3, palate: 1 } },
      { text: "Coastal plains — salt air, mineral soil, the ocean's invisible hand in every grain", dimensions: { terroir: 3, season: 1 } },
      { text: "Ancient rice paddies — generations of hands in the same soil, time as ingredient", dimensions: { terroir: 2, philosophy: 2 } },
      { text: "Urban craft breweries — tradition reimagined in concrete and steel", dimensions: { terroir: 1, philosophy: 3 } },
    ],
  },
  {
    id: 11,
    stem: "How important is the water?",
    subtext: "Sake is 80% water. This question is about more than sake.",
    choices: [
      { text: "It's everything — the water IS the sake. Everything else is just direction.", dimensions: { terroir: 3, philosophy: 1 } },
      { text: "Hard water for bold sake, soft water for gentle sake — I want to taste the source", dimensions: { terroir: 3, palate: 1 } },
      { text: "I trust the brewer to choose the right water — that's their art, not mine", dimensions: { philosophy: 2, ritual: 2 } },
      { text: "Water is the invisible partner — I don't need to analyze it to feel it", dimensions: { terroir: 2, season: 2 } },
    ],
  },
  {
    id: 12,
    stem: "A brewer invites you to visit. What do you want to see first?",
    subtext: "Where your attention goes reveals what you value.",
    choices: [
      { text: "The water source — show me where it begins", dimensions: { terroir: 3, philosophy: 1 } },
      { text: "The koji room — where the magic actually happens, where rice becomes something else", dimensions: { terroir: 2, ritual: 2 } },
      { text: "The aging cellar — time is the final ingredient and I want to see where it lives", dimensions: { philosophy: 3, terroir: 1 } },
      { text: "The tasting room — I came to drink, not to tour", dimensions: { palate: 3, ritual: 1 } },
    ],
  },
  // ── PHILOSOPHY DIMENSION (Q13-16) ──
  {
    id: 13,
    stem: "Tradition or innovation?",
    subtext: "The oldest argument in every craft. Where do you stand?",
    choices: [
      { text: "Tradition — 1,000 years of refinement isn't an accident. Honor the lineage.", dimensions: { philosophy: 3, terroir: 1 } },
      { text: "Innovation — the best way to honor tradition is to push it forward", dimensions: { philosophy: 3, palate: 1 } },
      { text: "Both — the tension between them is where the best work lives", dimensions: { philosophy: 2, ritual: 2 } },
      { text: "Neither — I just want what tastes good. Labels are for bottles, not for philosophy.", dimensions: { palate: 3, season: 1 } },
    ],
  },
  {
    id: 14,
    stem: "What's your relationship with simplicity?",
    subtext: "Four ingredients: rice, water, koji, yeast. That's it. That's everything.",
    choices: [
      { text: "Simplicity is the highest form of sophistication — constraint creates beauty", dimensions: { philosophy: 3, palate: 1 } },
      { text: "Simplicity is a starting point — what you do within the constraints is what matters", dimensions: { philosophy: 2, terroir: 2 } },
      { text: "I appreciate simplicity but I'm drawn to complexity — more layers, more to discover", dimensions: { palate: 3, philosophy: 1 } },
      { text: "Simplicity in ingredients, complexity in experience — that's the paradox I love", dimensions: { philosophy: 2, ritual: 2 } },
    ],
  },
  {
    id: 15,
    stem: "How do you feel about polishing?",
    subtext: "In sake, the more you polish the rice, the more you remove. What remains is essence.",
    choices: [
      { text: "Polish it down to the soul — I want essence, not noise", dimensions: { philosophy: 3, palate: 1 } },
      { text: "Leave some grain intact — character lives in the imperfections", dimensions: { terroir: 3, philosophy: 1 } },
      { text: "It depends on what the brewer is trying to say — polishing is vocabulary, not virtue", dimensions: { philosophy: 2, ritual: 2 } },
      { text: "I don't care about the number — I care about what's in the glass", dimensions: { palate: 3, season: 1 } },
    ],
  },
  {
    id: 16,
    stem: "What does 'craft' mean to you?",
    subtext: "The word everyone uses. The thing almost nobody means.",
    choices: [
      { text: "Obsession with process — doing the same thing 10,000 times until it's perfect", dimensions: { philosophy: 3, ritual: 1 } },
      { text: "Connection to place — craft without terroir is just manufacturing with better marketing", dimensions: { terroir: 3, philosophy: 1 } },
      { text: "Human scale — made by hands, not machines. Small enough to care.", dimensions: { philosophy: 2, terroir: 2 } },
      { text: "Intention — it doesn't matter how it's made if the maker doesn't mean it", dimensions: { philosophy: 2, ritual: 2 } },
    ],
  },
  // ── SEASON DIMENSION (Q17-20) ──
  {
    id: 17,
    stem: "What time of year are you most yourself?",
    subtext: "Sake has seasons. So do you.",
    choices: [
      { text: "Spring — everything beginning, the air full of possibility and pollen", dimensions: { season: 3, palate: 1 } },
      { text: "Summer — heat, abundance, long days that blur into long nights", dimensions: { season: 3, ritual: 1 } },
      { text: "Autumn — the harvest, the turning, the beautiful letting go", dimensions: { season: 3, terroir: 1 } },
      { text: "Winter — stillness, depth, the kind of cold that makes warmth sacred", dimensions: { season: 3, philosophy: 1 } },
    ],
  },
  {
    id: 18,
    stem: "It's 11pm. You've had a long day. What temperature is your drink?",
    subtext: "Temperature is mood made physical.",
    choices: [
      { text: "Ice cold — sharp, clarifying, a reset button for the nervous system", dimensions: { season: 3, palate: 1 } },
      { text: "Slightly chilled — cool enough to refresh, warm enough to taste everything", dimensions: { season: 2, palate: 2 } },
      { text: "Room temperature — no interference, just the liquid as it is", dimensions: { season: 2, philosophy: 2 } },
      { text: "Warm — heated gently, like a blanket for the inside of your body", dimensions: { season: 3, ritual: 1 } },
    ],
  },
  {
    id: 19,
    stem: "What's the right occasion for the best bottle?",
    subtext: "When do you open the thing you've been saving?",
    choices: [
      { text: "A Tuesday night, alone, for no reason — the best moments aren't planned", dimensions: { season: 2, philosophy: 2 } },
      { text: "A celebration — the milestone deserves the bottle and the bottle deserves the milestone", dimensions: { season: 3, ritual: 1 } },
      { text: "When the right person shows up — some bottles are waiting for specific people", dimensions: { ritual: 3, season: 1 } },
      { text: "When the season matches — first snow, cherry blossoms, the autumn equinox", dimensions: { season: 3, terroir: 1 } },
    ],
  },
  {
    id: 20,
    stem: "Last question. Why sake?",
    subtext: "Of all the things to drink. Why this one?",
    choices: [
      { text: "Honesty — four ingredients, no hiding. What you taste is what it is.", dimensions: { philosophy: 3, palate: 1 } },
      { text: "Mystery — 1,000 years of craft and I still can't fully explain what koji does to rice", dimensions: { terroir: 2, philosophy: 2 } },
      { text: "Connection — it's meant to be shared, poured for others, received with both hands", dimensions: { ritual: 3, season: 1 } },
      { text: "Beauty — the intersection of nature and human attention, in a cup", dimensions: { season: 2, terroir: 2 } },
    ],
  },
];

/* ── SAKE PROFILES ── */

const SAKE_PROFILES: SakeProfile[] = [
  {
    id: "palate",
    name: "The Daiginjo Devotee",
    japaneseName: "大吟醸",
    tagline: "You drink with your whole body. The liquid is the teacher.",
    description: "Your palate is your compass. You're drawn to Daiginjo and Junmai Daiginjo — the most polished expressions of sake, where rice is milled to 50% or less, stripping away everything that isn't essence. These are sakes of extraordinary delicacy: floral, fruity, ethereal. They demand attention and reward it with layers that unfold like origami in reverse.",
    primaryDimension: "palate",
    tastingNotes: "Melon, white peach, jasmine, lychee. A finish that disappears like morning fog. Delicate umami underneath, like the memory of rice rather than rice itself.",
    pairings: [
      "Sashimi — yellowtail, sea bream, or uni",
      "Steamed vegetables with a whisper of yuzu",
      "Fresh oysters with nothing on them",
      "Alone, chilled, in a thin-walled glass — sometimes the pairing is silence",
    ],
    servingTemp: "Well-chilled (5-10°C / 41-50°F). These sakes reveal their architecture in the cold.",
    producers: [
      { name: "Dassai", region: "Yamaguchi", note: "The 23 — polished to 23% remaining. Precision as philosophy." },
      { name: "Juyondai", region: "Yamagata", note: "Nearly impossible to find. Worth every hour of searching." },
      { name: "Born", region: "Fukui", note: "Gold label. Aged at -8°C. Time and cold as co-brewers." },
      { name: "Kubota Manju", region: "Niigata", note: "Clean enough to see through. Complex enough to get lost in." },
    ],
    resources: [
      { title: "The Sake Handbook by John Gauntner", url: "https://www.amazon.com/Sake-Handbook-John-Gauntner/dp/0804834253", type: "book" },
      { title: "Sake Today Magazine", url: "https://saketoday.com", type: "publication" },
      { title: "UrbanSake — Tasting Notes Database", url: "https://urbansake.com", type: "directory" },
    ],
    relatedStyles: ["terroir", "philosophy"],
    shareText: "I'm The Daiginjo Devotee — I drink with my whole body. Polished, ethereal, essential. Find your sake →",
  },
  {
    id: "ritual",
    name: "The Ochoko Ceremonialist",
    japaneseName: "儀式",
    tagline: "The cup matters as much as what's in it. Context is content.",
    description: "For you, sake isn't a beverage — it's a practice. You're drawn to the ritual dimension: the ochoko (small cup), the tokkuri (flask), the act of pouring for others and receiving with both hands. Your sake is Junmai — honest, full-bodied, versatile enough to serve warm or cold, traditional enough to honor the ceremony. The drink is the excuse. The connection is the point.",
    primaryDimension: "ritual",
    tastingNotes: "Rice-forward, umami-rich, with notes of steamed grain, chestnut, and a gentle earthiness. Warm, it opens into caramel and toasted sesame. A sake that tastes like the word 'home.'",
    pairings: [
      "Yakitori — the charcoal and the rice find each other",
      "Hot pot (nabe) — communal food for a communal drink",
      "Grilled miso-glazed eggplant",
      "Anything cooked slowly, shared generously, eaten with your hands",
    ],
    servingTemp: "Warm to hot (40-55°C / 104-131°F). Warming sake is an act of care — for the liquid and for the person you're pouring it for.",
    producers: [
      { name: "Tamagawa", region: "Kyoto", note: "Brewed by Philip Harper, the first non-Japanese toji. Tradition honored by an outsider." },
      { name: "Dewazakura", region: "Yamagata", note: "Oka Cherry Bouquet. The gateway sake that ruins you for everything else." },
      { name: "Suigei", region: "Kochi", note: "Drunken Whale. Dry, clean, built for the table. Named for the drinking culture of Kochi." },
      { name: "Hakkaisan", region: "Niigata", note: "Snow country sake. Clean as the water it comes from." },
    ],
    resources: [
      { title: "Sake Confidential by John Gauntner", url: "https://www.amazon.com/Sake-Confidential-Insiders-Guide-Drink/dp/1611720141", type: "book" },
      { title: "Tippsy Sake — Curated Sake Boxes", url: "https://www.tippsysake.com", type: "retailer" },
      { title: "The Joy of Sake Festival", url: "https://joyofsake.com", type: "event" },
    ],
    relatedStyles: ["season", "terroir"],
    shareText: "I'm The Ochoko Ceremonialist — the cup matters as much as what's in it. Junmai, warm, shared. Find your sake →",
  },
  {
    id: "terroir",
    name: "The Terroir Pilgrim",
    japaneseName: "風土",
    tagline: "You taste the place before you taste the drink. Geography is biography.",
    description: "You believe sake should taste like somewhere — not just something. You're drawn to Junmai Ginjo and regional expressions where the water source, the local rice variety, and the microclimate all leave their fingerprints in the glass. For you, the best sake is a postcard from a specific place, written in a language only your palate can read. Niigata's snow-melt clarity. Hiroshima's soft-water roundness. Akita's bold, structured depth.",
    primaryDimension: "terroir",
    tastingNotes: "Varies by region — Niigata: clean, dry, mineral. Hiroshima: soft, round, gentle. Akita: rich, structured, bold. The common thread is specificity. You can taste where it was made.",
    pairings: [
      "Local cuisine from the same region as the sake — the ultimate pairing",
      "Seasonal vegetables — what grows together, drinks together",
      "River fish — ayu, iwana — grilled simply with salt",
      "Aged cheese — terroir recognizes terroir",
    ],
    servingTemp: "Slightly chilled to room temperature (12-18°C / 54-64°F). Let the place speak without thermal interference.",
    producers: [
      { name: "Tedorigawa", region: "Ishikawa", note: "Mountain river water. You can taste the altitude." },
      { name: "Masumi", region: "Nagano", note: "Alpine sake from Japan's roof. The yeast they discovered (No. 7) changed everything." },
      { name: "Kamoizumi", region: "Hiroshima", note: "Soft water, rich sake. The paradox of Hiroshima brewing." },
      { name: "Aramasa", region: "Akita", note: "No. 6 yeast originators. Ancient techniques, modern vision. Wood-fermented." },
    ],
    resources: [
      { title: "The Year of Drinking Adventurously by Jeff Cioletti", url: "https://www.amazon.com/Year-Drinking-Adventurously-Worlds-Interesting/dp/1630762504", type: "book" },
      { title: "Sake World — Regional Guides", url: "https://sake-world.com", type: "education" },
      { title: "Japan Sake & Shochu Makers Association", url: "https://www.japansake.or.jp/sake/english/", type: "organization" },
    ],
    relatedStyles: ["palate", "season"],
    shareText: "I'm The Terroir Pilgrim — I taste the place before I taste the drink. Regional sake, specific water, honest geography. Find your sake →",
  },
  {
    id: "philosophy",
    name: "The Koji Contemplative",
    japaneseName: "哲学",
    tagline: "You don't just drink sake. You think about what sake means.",
    description: "For you, sake is a philosophical proposition: four ingredients, infinite expressions. You're drawn to Kimoto and Yamahai — the ancient brewing methods that use natural lactic fermentation instead of shortcuts. These sakes are wilder, funkier, more complex. They taste like patience. They taste like trusting the process. You appreciate that the best sake is made by getting out of nature's way.",
    primaryDimension: "philosophy",
    tastingNotes: "Gamey, earthy, with notes of mushroom, dark honey, and a lactic tang that conventional sake doesn't have. A longer finish — these sakes don't leave quietly. Complexity that rewards the second and third sip more than the first.",
    pairings: [
      "Rich, fatty dishes — braised pork belly, duck confit",
      "Aged or funky cheeses — blue cheese, washed rind",
      "Mushroom dishes — the earth meeting the earth",
      "Dark chocolate — bitterness recognizes bitterness",
    ],
    servingTemp: "Room temperature to warm (15-45°C / 59-113°F). These sakes transform across the temperature spectrum — try the same bottle at three different temps.",
    producers: [
      { name: "Daishichi", region: "Fukushima", note: "The kimoto masters. Every bottle is a lesson in patience." },
      { name: "Yamatoshizuku", region: "Akita", note: "Yamahai specialists. Wild yeast, controlled chaos." },
      { name: "Tengumai", region: "Ishikawa", note: "Yamahai Junmai. The gateway to understanding what natural fermentation tastes like." },
      { name: "Kidoizumi", region: "Chiba", note: "Hot yamahai method. Deliberately unconventional. Sake for people who think about sake." },
    ],
    resources: [
      { title: "Sake: The History, Stories and Craft by Elliot Faber", url: "https://www.amazon.com/Sake-History-Stories-Craft-Japans/dp/1787136590", type: "book" },
      { title: "Natsuki Kikuya — Sake Education", url: "https://www.sake-expert.com", type: "education" },
      { title: "Sake Scholar Certification", url: "https://sakescholar.com", type: "certification" },
    ],
    relatedStyles: ["terroir", "ritual"],
    shareText: "I'm The Koji Contemplative — I don't just drink sake, I think about what it means. Kimoto, yamahai, natural fermentation. Find your sake →",
  },
  {
    id: "season",
    name: "The Seasonal Drinker",
    japaneseName: "季節",
    tagline: "The right sake at the wrong time is the wrong sake.",
    description: "You understand that sake has seasons — and so do you. Shiboritate (fresh-pressed) in winter. Hiyaoroshi (autumn-released) when the leaves turn. Nama (unpasteurized) in spring when everything is raw and alive. Chilled nigori in summer heat. You don't have one sake — you have a sake for every version of yourself across the calendar. Your relationship with sake is a relationship with time.",
    primaryDimension: "season",
    tastingNotes: "Spring: bright, floral, effervescent. Summer: crisp, light, refreshing. Autumn: mellow, rounded, mature. Winter: bold, warming, celebratory. The flavor is the season made liquid.",
    pairings: [
      "Spring: cherry blossom viewing (hanami) with light appetizers",
      "Summer: chilled tofu, cucumber, and cold soba noodles",
      "Autumn: matsutake mushrooms, roasted sweet potato, grilled sanma",
      "Winter: hot pot, oden, anything that steams",
    ],
    servingTemp: "Follows the season — cold in summer, warm in winter, room temp in the transitions. Let the weather choose.",
    producers: [
      { name: "Gasanryu", region: "Yamagata", note: "Seasonal releases that track the mountain's moods. Each bottle is a timestamp." },
      { name: "Senkin", region: "Tochigi", note: "Modern seasonal brewing. The 'Snowman' winter release is legendary." },
      { name: "Hiraizumi", region: "Akita", note: "Nama specialist. Unpasteurized, alive, demanding to be drunk now." },
      { name: "Kokuryu", region: "Fukui", note: "Black Dragon. Seasonal expressions from one of Japan's most consistent breweries." },
    ],
    resources: [
      { title: "A Guide to Seasonal Sake", url: "https://www.japantimes.co.jp/life/sake-guide/", type: "guide" },
      { title: "Sake Discoveries — Seasonal Subscriptions", url: "https://sakediscoveries.com", type: "subscription" },
      { title: "True Sake — America's First Sake Store", url: "https://www.truesake.com", type: "retailer" },
    ],
    relatedStyles: ["ritual", "palate"],
    shareText: "I'm The Seasonal Drinker — the right sake at the wrong time is the wrong sake. Shiboritate, hiyaoroshi, nama. Find your sake →",
  },
];

/* ── SACRED GEOMETRY BG ── */

function SacredGeometryBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        {/* Ensō circle — the zen brushstroke */}
        <circle cx="500" cy="500" r="300" fill="none" stroke="#D4B96A" strokeWidth="2" strokeDasharray="8 4" />
        <circle cx="500" cy="500" r="200" fill="none" stroke="#D4B96A" strokeWidth="0.5" />
        <circle cx="500" cy="500" r="100" fill="none" stroke="#D4B96A" strokeWidth="0.3" />
        {/* Rice grain pattern — radiating lines */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 500 + 80 * Math.cos(angle);
          const y1 = 500 + 80 * Math.sin(angle);
          const x2 = 500 + 350 * Math.cos(angle);
          const y2 = 500 + 350 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4B96A" strokeWidth="0.15" />;
        })}
        {/* Five-point star for five dimensions */}
        {Array.from({ length: 5 }).map((_, i) => {
          const rad = (i * 72 - 90) * (Math.PI / 180);
          const x = 500 + 180 * Math.cos(rad);
          const y = 500 + 180 * Math.sin(rad);
          return <line key={`l${i}`} x1="500" y1="500" x2={x} y2={y} stroke="#D4B96A" strokeWidth="0.2" />;
        })}
      </svg>
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(212, 185, 106, ${0.1 + Math.random() * 0.2})`,
              animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── GLASS PANEL ── */

function GlassPanel({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(10, 10, 16, 0.6)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        border: "1px solid rgba(212, 185, 106, 0.12)",
        borderRadius: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── RADAR CHART ── */

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const dims = Object.keys(DIMENSION_LABELS);
  const size = 280;
  const center = size / 2;
  const maxR = 110;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / dims.length - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = dims.map((d, i) => getPoint(i, scores[d] || 0));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 280 }}>
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const points = dims.map((_, i) => getPoint(i, scale * 10));
        const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={scale} d={path} fill="none" stroke="rgba(212,185,106,0.15)" strokeWidth="0.5" />;
      })}
      {dims.map((_, i) => {
        const p = getPoint(i, 10);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(212,185,106,0.1)" strokeWidth="0.5" />;
      })}
      <path d={dataPath} fill="rgba(212,185,106,0.15)" stroke="#D4B96A" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, 12.5);
        return (
          <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(212,185,106,0.7)" fontSize="8" fontFamily="'DM Mono', monospace">
            {DIMENSION_LABELS[d]}
          </text>
        );
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ── */

export default function FindYourSake() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const { markComplete } = useJourneyProgress();

  /* ── SCORE CALCULATION ── */
  const scores = useMemo(() => {
    const raw: Record<string, number> = { palate: 0, ritual: 0, terroir: 0, philosophy: 0, season: 0 };
    Object.entries(answers).forEach(([qIdx, cIdx]) => {
      const q = QUESTIONS[parseInt(qIdx)];
      if (!q) return;
      const choice = q.choices[cIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, val]) => {
        raw[dim] = (raw[dim] || 0) + val;
      });
    });
    // Normalize to 0-10
    const maxPossible = 16; // ~4 questions × max 3 points + bonus points
    const normalized: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      normalized[k] = Math.min(10, Math.round((v / maxPossible) * 10 * 10) / 10);
    }
    return normalized;
  }, [answers]);

  const topProfile = useMemo(() => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topDim = sorted[0]?.[0] || "palate";
    return SAKE_PROFILES.find((p) => p.id === topDim) || SAKE_PROFILES[0];
  }, [scores]);

  /* ── HANDLERS ── */
  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      if (transitioning) return;
      setSelectedChoice(choiceIdx);
      setTransitioning(true);

      setTimeout(() => {
        setAnswers((prev) => ({ ...prev, [currentQ]: choiceIdx }));
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          setPhase("results");
        }
        setSelectedChoice(null);
        setTransitioning(false);
      }, 600);
    },
    [currentQ, transitioning]
  );

  // Auto-mark completion and store results when results are shown
  useEffect(() => {
    if (phase === "results") {
      markComplete("find-your-sake");
      try {
        localStorage.setItem("sake_results", JSON.stringify({ sakeStyle: topProfile.name, archetype: topProfile.name, scores, timestamp: Date.now() }));
      } catch {}
    }
  }, [phase, markComplete, topProfile, scores]);

  const progress = ((currentQ + (phase === "results" ? 1 : 0)) / QUESTIONS.length) * 100;

  /* ── RENDER ── */
  return (
    <>
      <ThemedBackground theme="sake" />
      <SEO
        title="Find Your Sake | Rice, Water, Koji, Time"
        description="20 questions across 5 dimensions. Discover the sake style that matches your palate, your philosophy, and your season. The most honest drink on earth, matched to you."
        indexable={true}
      />
      <div
        className="min-h-screen relative"
        style={{
          background: "transparent", position: "relative", zIndex: 1,
          color: "#2C1810",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <SacredGeometryBg />

        {/* Subtle grain */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        `}</style>

        {/* ── LANDING PHASE ── */}
        {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Sake"
          subtitle="Every cup holds a thousand years of intention."
          description="Sake is not just a drink — it's a philosophy of water, rice, craft, and time. This assessment maps your palate, your aesthetic sensibility, and your relationship with Japanese culture to find the sake that was made for someone exactly like you."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your sake archetype and flavor profile","A dimensional map of your palate preferences","Understanding of your aesthetic relationship with craft","Curated sake recommendations for your profile"]}
          accentColor="#8D6E63"
          onBegin={() => setPhase('quiz')}
        />
      )}

        {/* ── QUIZ PHASE ── */}
        {phase === "quiz" && (
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50" style={{ height: "3px", background: "rgba(212,185,106,0.1)" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            {/* Question counter */}
            <div
              className="fixed top-6 right-6"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                color: "rgba(212,185,106,0.4)",
              }}
            >
              {currentQ + 1} / {QUESTIONS.length}
            </div>

            <div className="max-w-2xl w-full" style={{ animation: "fadeUp 0.5s ease" }} key={currentQ}>
              <GlassPanel className="p-8 md:p-12">
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    marginBottom: "0.5rem",
                  }}
                >
                  {QUESTIONS[currentQ].stem}
                </h2>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    color: "rgba(212,185,106,0.5)",
                    letterSpacing: "0.05em",
                    marginBottom: "2rem",
                  }}
                >
                  {QUESTIONS[currentQ].subtext}
                </p>

                <div className="flex flex-col gap-3">
                  {QUESTIONS[currentQ].choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={transitioning}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        textAlign: "left",
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        border: selectedChoice === idx
                          ? "1px solid rgba(212,185,106,0.6)"
                          : "1px solid rgba(212,185,106,0.1)",
                        background: selectedChoice === idx
                          ? "rgba(212,185,106,0.12)"
                          : "rgba(10,10,16,0.4)",
                        color: "#2C1810",
                        cursor: transitioning ? "default" : "pointer",
                        transition: "all 0.3s ease",
                        animation: `slideIn 0.4s ease ${idx * 0.08}s both`,
                      }}
                      onMouseEnter={(e) => {
                        if (!transitioning && selectedChoice !== idx) {
                          e.currentTarget.style.border = "1px solid rgba(212,185,106,0.3)";
                          e.currentTarget.style.background = "rgba(212,185,106,0.06)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!transitioning && selectedChoice !== idx) {
                          e.currentTarget.style.border = "1px solid rgba(212,185,106,0.1)";
                          e.currentTarget.style.background = "rgba(10,10,16,0.4)";
                        }
                      }}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === "results" && !emailGated && (
            <EmailGate assessmentName="sake" onUnlock={() => setEmailGated(true)} />
          )}

          {phase === "results" && emailGated && (
          <div className="relative z-10 min-h-screen py-16 px-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12" style={{ animation: "fadeUp 0.6s ease" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.5)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Sake Profile
                </div>
                <div
                  style={{
                    fontFamily: "serif",
                    fontSize: "3rem",
                    color: "rgba(212,185,106,0.15)",
                    marginBottom: "-0.5rem",
                  }}
                >
                  {topProfile.japaneseName}
                </div>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    marginBottom: "0.5rem",
                  }}
                >
                  {topProfile.name}
                </h1>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.15rem",
                    color: "#8B6914",
                    fontStyle: "italic",
                  }}
                >
                  {topProfile.tagline}
                </p>
              </div>

              {/* Radar Chart + Description */}
              <div className="grid md:grid-cols-2 gap-8 mb-12" style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>
                <GlassPanel className="p-8 flex flex-col items-center justify-center">
                  <RadarChart scores={scores} />
                  <div className="mt-4 grid grid-cols-5 gap-2 w-full">
                    {Object.entries(scores).map(([dim, val]) => (
                      <div key={dim} className="text-center">
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(212,185,106,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {DIMENSION_LABELS[dim]}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#8B6914" }}>
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>

                <GlassPanel className="p-8">
                  <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(245,240,224,0.85)" }}>
                    {topProfile.description}
                  </p>
                </GlassPanel>
              </div>

              {/* Tasting Notes */}
              <GlassPanel className="p-8 mb-8" style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "0.75rem" }}>
                  Tasting Notes
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(245,240,224,0.8)", fontStyle: "italic" }}>
                  {topProfile.tastingNotes}
                </p>
                <div className="mt-4" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(212,185,106,0.6)" }}>
                  Serving Temperature: {topProfile.servingTemp}
                </div>
              </GlassPanel>

              {/* Pairings + Producers */}
              <div className="grid md:grid-cols-2 gap-8 mb-8" style={{ animation: "fadeUp 0.6s ease 0.4s both" }}>
                <GlassPanel className="p-8">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "1rem" }}>
                    What to Eat With It
                  </h3>
                  <div className="flex flex-col gap-3">
                    {topProfile.pairings.map((p, i) => (
                      <div key={i} className="flex gap-3" style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(245,240,224,0.8)" }}>
                        <span style={{ color: "#8B6914", flexShrink: 0 }}>◇</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>

                <GlassPanel className="p-8">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "1rem" }}>
                    Producers to Seek Out
                  </h3>
                  <div className="flex flex-col gap-4">
                    {topProfile.producers.map((p, i) => (
                      <div key={i}>
                        <div className="flex items-baseline gap-2">
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#8B6914" }}>{p.name}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(212,185,106,0.4)", letterSpacing: "0.05em" }}>{p.region}</span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "rgba(245,240,224,0.6)", lineHeight: 1.5, marginTop: "0.2rem" }}>{p.note}</p>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Resources */}
              <GlassPanel className="p-8 mb-8" style={{ animation: "fadeUp 0.6s ease 0.5s both" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "1rem" }}>
                  Go Deeper
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {topProfile.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                      style={{
                        display: "block",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: "1px solid rgba(212,185,106,0.1)",
                        background: "rgba(10,10,16,0.3)",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(212,185,106,0.3)";
                        e.currentTarget.style.background = "rgba(212,185,106,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(212,185,106,0.1)";
                        e.currentTarget.style.background = "rgba(10,10,16,0.3)";
                      }}
                    >
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(212,185,106,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                        {r.type}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#8B6914" }}>{r.title}</div>
                    </a>
                  ))}
                </div>
              </GlassPanel>

              {/* Journey Continues */}
              <GlassPanel className="p-8 mb-8" style={{ animation: "fadeUp 0.6s ease 0.6s both" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.5)",
                    marginBottom: "0.5rem",
                  }}
                >
                  The Journey Continues
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "1rem" }}>
                  Now that you've found your sake...
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { name: "Find Myzcal", url: "https://mezcalagave-ahru9fq8.manus.space", hook: "The agave that matches your soul." },
                    { name: "Find Your Tequila", url: "https://tequilaazul-fxqrr3js.manus.space", hook: "Highland or lowland. A love letter in liquid form." },
                    { name: "Find Your Therapy", url: "/find-your-therapy", hook: "CBT, IFS, somatic — matched to your wiring." },
                    { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", hook: "The element that teaches you to flow." },
                    { name: "Find Your Purpose", url: "/assessments/dharma-finder", hook: "What you can't stop doing — even when nobody's paying." },
                    { name: "Find My", url: "/find-my", hook: "The master assessment. Five questions. One reckoning." },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      className="no-underline"
                      style={{
                        display: "block",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: "1px solid rgba(212,185,106,0.1)",
                        background: "rgba(10,10,16,0.3)",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(212,185,106,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(212,185,106,0.1)";
                      }}
                    >
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#8B6914", marginBottom: "0.3rem" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(245,240,224,0.5)", lineHeight: 1.4 }}>
                        {item.hook}
                      </div>
                    </a>
                  ))}
                </div>
              </GlassPanel>

              {/* Journey Tracker */}
              <div className="mb-8" style={{ animation: "fadeUp 0.6s ease 0.7s both" }}>
                <JourneyTracker variant="light" />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animation: "fadeUp 0.6s ease 0.8s both" }}>
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="sake"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ style: topProfile?.name })}
              totalScore={null}
            />

                <button
                  onClick={() => {

                    setPhase("landing");
                    setCurrentQ(0);
                    setAnswers({});
                  }}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: "rgba(212,185,106,0.6)",
                    border: "1px solid rgba(139,105,20,0.2)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,185,106,0.5)";
                    e.currentTarget.style.color = "#D4B96A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,185,106,0.2)";
                    e.currentTarget.style.color = "rgba(212,185,106,0.6)";
                  }}
                >
          <WhatsNext />
                  Retake the Tasting
                </button>
                <Link
                  href="/find-my"
                  className="no-underline"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                    color: "#0A0A10",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 700,
                    display: "inline-block",
                  }}
                >
                  Back to Find My
                </Link>
              </div>

              {/* Footer */}
              <div
                className="text-center mt-16"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(245,240,224,0.2)",
                  textTransform: "uppercase",
                }}
              >
                Zero Algorithm · All Nerve · One Ecosystem
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
