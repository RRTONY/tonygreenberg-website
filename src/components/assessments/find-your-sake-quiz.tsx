"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourSake.tsx — a real
// 20-question assessment across 5 dimensions (palate/ritual/terroir/
// philosophy/season), mapping to 5 real sake styles each with real
// tasting notes, food pairings, serving temperature, named producers, and
// further-reading resources. Every question and every profile's content
// ported unchanged and verbatim. Legacy's own `AssessmentIntro` stats
// prop claimed "15 questions, 6 dimensions" — doesn't match the real
// 20/5 implementation; used the live counts instead. **Two real bugs
// found and fixed**: (1) legacy's "Journey Continues" list had "Find
// Myzcal" — a literal typo for "Find Your Mezcal" — corrected. (2)
// legacy's JSX rendered `<WhatsNext />` (a whole page section) *inside*
// the small "Retake the Tasting" `<button>` element — moved to a proper
// top-level section, same class of nested-interactive-content bug
// already fixed on `/find-your-religion`. The dark glass-panel treatment
// (`GlassPanel`, dark near-black cards with light cream text on the
// page's own light parchment background) is a real, intentional design
// choice here — unlike the light-text-directly-on-light-background bug
// found on other assessments, the text here sits inside its own
// correctly-contrasted dark card, so it's kept as-is rather than
// "fixed" to the site's usual light-card convention.
type Dimension = "palate" | "ritual" | "terroir" | "philosophy" | "season";
const DIMENSION_LABELS: Record<Dimension, string> = {
  palate: "Palate",
  ritual: "Ritual",
  terroir: "Terroir",
  philosophy: "Philosophy",
  season: "Season",
};
const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const ACCENT = "#8D6E63";

function c(text: string, dimensions: Partial<Record<Dimension, number>>) {
  return { text, dimensions };
}

const QUESTIONS: {
  stem: string;
  subtext: string;
  choices: { text: string; dimensions: Partial<Record<Dimension, number>> }[];
}[] = [
  {
    stem: "Close your eyes. What does comfort taste like?",
    subtext: "Not the food. The feeling in your mouth.",
    choices: [
      c("Clean and bright — like cold spring water after a long walk", { palate: 3, season: 1 }),
      c("Rich and layered — like honey that remembers the flowers", { palate: 3, terroir: 1 }),
      c("Dry and mineral — like licking a river stone in the best possible way", {
        palate: 3,
        philosophy: 1,
      }),
      c("Soft and round — like a whisper that fills the whole room", { palate: 2, ritual: 2 }),
    ],
  },
  {
    stem: "You're handed a glass of something you've never tried. What do you notice first?",
    subtext: "The first thing that registers before thinking kicks in.",
    choices: [
      c("The aroma — I'm already reading the story before it touches my lips", {
        palate: 3,
        philosophy: 1,
      }),
      c("The weight — how it sits in the glass, the viscosity, the promise of body", {
        palate: 3,
        terroir: 1,
      }),
      c("The temperature — cold, warm, room temp tells me everything about intention", {
        ritual: 3,
        palate: 1,
      }),
      c("The vessel — the cup or glass is the first chapter of the experience", {
        ritual: 3,
        season: 1,
      }),
    ],
  },
  {
    stem: "Which of these textures makes your nervous system exhale?",
    subtext: "Texture is the body's way of choosing before the mind catches up.",
    choices: [
      c("Silk — effortless, barely there, gone before you realize it arrived", {
        palate: 3,
        season: 1,
      }),
      c("Cream — full, coating, the kind of presence that lingers", { palate: 3, terroir: 1 }),
      c("Crisp — like biting into a cold apple at the exact right moment", {
        palate: 3,
        philosophy: 1,
      }),
      c("Velvet — weight without heaviness, warmth without heat", { palate: 2, ritual: 2 }),
    ],
  },
  {
    stem: "When a drink is perfect, what happens in your body?",
    subtext: "Not what you think. What you feel.",
    choices: [
      c("My shoulders drop — it's relief, like the first breath after holding one too long", {
        palate: 2,
        philosophy: 2,
      }),
      c("My eyes close — the taste demands my full attention, everything else disappears", {
        palate: 2,
        ritual: 2,
      }),
      c("I smile involuntarily — surprise and recognition at the same time", {
        palate: 2,
        season: 2,
      }),
      c("I go quiet — something sacred just happened and words would ruin it", {
        palate: 1,
        ritual: 2,
        terroir: 1,
      }),
    ],
  },
  {
    stem: "How do you prefer to drink?",
    subtext: "The context is the content.",
    choices: [
      c("Alone, slowly, as a form of meditation — the drink is the companion", {
        ritual: 3,
        philosophy: 1,
      }),
      c("With one other person, sharing the bottle like sharing a secret", {
        ritual: 3,
        season: 1,
      }),
      c("At a table full of people, where the drink is the thread connecting the conversation", {
        ritual: 3,
        terroir: 1,
      }),
      c("Standing at a counter, watching someone who loves their craft pour it for me", {
        ritual: 2,
        terroir: 2,
      }),
    ],
  },
  {
    stem: "What's the right amount of ceremony?",
    subtext: "Between carelessness and preciousness, where do you live?",
    choices: [
      c("Maximum — the ritual IS the experience. Every gesture matters.", {
        ritual: 3,
        philosophy: 1,
      }),
      c("Some — a beautiful cup, a moment of pause, but not performance", { ritual: 3, season: 1 }),
      c("Minimal — pour it, drink it, let the liquid speak for itself", { ritual: 2, palate: 2 }),
      c(
        "Contextual — sometimes a paper cup at a festival, sometimes a ceramic ochoko at midnight",
        { ritual: 2, season: 2 },
      ),
    ],
  },
  {
    stem: "You're hosting someone you deeply respect. What do you pour?",
    subtext: "The drink you choose for others reveals what you worship.",
    choices: [
      c("Something rare that they've never tried — I want to give them a new experience", {
        ritual: 3,
        terroir: 1,
      }),
      c("Something I love that I want to share — this is who I am in liquid form", {
        ritual: 2,
        philosophy: 2,
      }),
      c("Something from where they're from — honoring their story, not mine", {
        ritual: 2,
        terroir: 2,
      }),
      c("Whatever pairs best with the food — the meal is the main character tonight", {
        ritual: 2,
        palate: 2,
      }),
    ],
  },
  {
    stem: "The best drinking experiences you've had — what made them unforgettable?",
    subtext: "Not the drink. The everything else.",
    choices: [
      c("The setting — a specific place, a specific light, a specific temperature in the air", {
        season: 3,
        ritual: 1,
      }),
      c("The company — the people elevated the liquid into something transcendent", {
        ritual: 3,
        season: 1,
      }),
      c("The discovery — tasting something that rearranged my understanding of what was possible", {
        palate: 2,
        terroir: 2,
      }),
      c(
        "The silence — a moment of perfect stillness where the drink was the only thing happening",
        { philosophy: 3, ritual: 1 },
      ),
    ],
  },
  {
    stem: "Does it matter where something comes from?",
    subtext: "The question underneath every bottle.",
    choices: [
      c("Everything — place is flavor. Geography is biography. Terroir is truth.", {
        terroir: 3,
        philosophy: 1,
      }),
      c("Mostly — I want to know the story, but the liquid has to stand on its own", {
        terroir: 3,
        palate: 1,
      }),
      c("Somewhat — I appreciate provenance but I'm not a purist about it", {
        terroir: 2,
        ritual: 2,
      }),
      c("The maker matters more than the place — craft transcends geography", {
        philosophy: 3,
        terroir: 1,
      }),
    ],
  },
  {
    stem: "Which landscape calls to you?",
    subtext: "The land that makes the rice that makes the sake that makes the moment.",
    choices: [
      c("Mountain streams and snow — purity distilled through altitude and cold", {
        terroir: 3,
        palate: 1,
      }),
      c("Coastal plains — salt air, mineral soil, the ocean's invisible hand in every grain", {
        terroir: 3,
        season: 1,
      }),
      c("Ancient rice paddies — generations of hands in the same soil, time as ingredient", {
        terroir: 2,
        philosophy: 2,
      }),
      c("Urban craft breweries — tradition reimagined in concrete and steel", {
        terroir: 1,
        philosophy: 3,
      }),
    ],
  },
  {
    stem: "How important is the water?",
    subtext: "Sake is 80% water. This question is about more than sake.",
    choices: [
      c("It's everything — the water IS the sake. Everything else is just direction.", {
        terroir: 3,
        philosophy: 1,
      }),
      c("Hard water for bold sake, soft water for gentle sake — I want to taste the source", {
        terroir: 3,
        palate: 1,
      }),
      c("I trust the brewer to choose the right water — that's their art, not mine", {
        philosophy: 2,
        ritual: 2,
      }),
      c("Water is the invisible partner — I don't need to analyze it to feel it", {
        terroir: 2,
        season: 2,
      }),
    ],
  },
  {
    stem: "A brewer invites you to visit. What do you want to see first?",
    subtext: "Where your attention goes reveals what you value.",
    choices: [
      c("The water source — show me where it begins", { terroir: 3, philosophy: 1 }),
      c("The koji room — where the magic actually happens, where rice becomes something else", {
        terroir: 2,
        ritual: 2,
      }),
      c("The aging cellar — time is the final ingredient and I want to see where it lives", {
        philosophy: 3,
        terroir: 1,
      }),
      c("The tasting room — I came to drink, not to tour", { palate: 3, ritual: 1 }),
    ],
  },
  {
    stem: "Tradition or innovation?",
    subtext: "The oldest argument in every craft. Where do you stand?",
    choices: [
      c("Tradition — 1,000 years of refinement isn't an accident. Honor the lineage.", {
        philosophy: 3,
        terroir: 1,
      }),
      c("Innovation — the best way to honor tradition is to push it forward", {
        philosophy: 3,
        palate: 1,
      }),
      c("Both — the tension between them is where the best work lives", {
        philosophy: 2,
        ritual: 2,
      }),
      c("Neither — I just want what tastes good. Labels are for bottles, not for philosophy.", {
        palate: 3,
        season: 1,
      }),
    ],
  },
  {
    stem: "What's your relationship with simplicity?",
    subtext: "Four ingredients: rice, water, koji, yeast. That's it. That's everything.",
    choices: [
      c("Simplicity is the highest form of sophistication — constraint creates beauty", {
        philosophy: 3,
        palate: 1,
      }),
      c("Simplicity is a starting point — what you do within the constraints is what matters", {
        philosophy: 2,
        terroir: 2,
      }),
      c("I appreciate simplicity but I'm drawn to complexity — more layers, more to discover", {
        palate: 3,
        philosophy: 1,
      }),
      c("Simplicity in ingredients, complexity in experience — that's the paradox I love", {
        philosophy: 2,
        ritual: 2,
      }),
    ],
  },
  {
    stem: "How do you feel about polishing?",
    subtext: "In sake, the more you polish the rice, the more you remove. What remains is essence.",
    choices: [
      c("Polish it down to the soul — I want essence, not noise", { philosophy: 3, palate: 1 }),
      c("Leave some grain intact — character lives in the imperfections", {
        terroir: 3,
        philosophy: 1,
      }),
      c("It depends on what the brewer is trying to say — polishing is vocabulary, not virtue", {
        philosophy: 2,
        ritual: 2,
      }),
      c("I don't care about the number — I care about what's in the glass", {
        palate: 3,
        season: 1,
      }),
    ],
  },
  {
    stem: "What does 'craft' mean to you?",
    subtext: "The word everyone uses. The thing almost nobody means.",
    choices: [
      c("Obsession with process — doing the same thing 10,000 times until it's perfect", {
        philosophy: 3,
        ritual: 1,
      }),
      c("Connection to place — craft without terroir is just manufacturing with better marketing", {
        terroir: 3,
        philosophy: 1,
      }),
      c("Human scale — made by hands, not machines. Small enough to care.", {
        philosophy: 2,
        terroir: 2,
      }),
      c("Intention — it doesn't matter how it's made if the maker doesn't mean it", {
        philosophy: 2,
        ritual: 2,
      }),
    ],
  },
  {
    stem: "What time of year are you most yourself?",
    subtext: "Sake has seasons. So do you.",
    choices: [
      c("Spring — everything beginning, the air full of possibility and pollen", {
        season: 3,
        palate: 1,
      }),
      c("Summer — heat, abundance, long days that blur into long nights", { season: 3, ritual: 1 }),
      c("Autumn — the harvest, the turning, the beautiful letting go", { season: 3, terroir: 1 }),
      c("Winter — stillness, depth, the kind of cold that makes warmth sacred", {
        season: 3,
        philosophy: 1,
      }),
    ],
  },
  {
    stem: "It's 11pm. You've had a long day. What temperature is your drink?",
    subtext: "Temperature is mood made physical.",
    choices: [
      c("Ice cold — sharp, clarifying, a reset button for the nervous system", {
        season: 3,
        palate: 1,
      }),
      c("Slightly chilled — cool enough to refresh, warm enough to taste everything", {
        season: 2,
        palate: 2,
      }),
      c("Room temperature — no interference, just the liquid as it is", {
        season: 2,
        philosophy: 2,
      }),
      c("Warm — heated gently, like a blanket for the inside of your body", {
        season: 3,
        ritual: 1,
      }),
    ],
  },
  {
    stem: "What's the right occasion for the best bottle?",
    subtext: "When do you open the thing you've been saving?",
    choices: [
      c("A Tuesday night, alone, for no reason — the best moments aren't planned", {
        season: 2,
        philosophy: 2,
      }),
      c("A celebration — the milestone deserves the bottle and the bottle deserves the milestone", {
        season: 3,
        ritual: 1,
      }),
      c("When the right person shows up — some bottles are waiting for specific people", {
        ritual: 3,
        season: 1,
      }),
      c("When the season matches — first snow, cherry blossoms, the autumn equinox", {
        season: 3,
        terroir: 1,
      }),
    ],
  },
  {
    stem: "Last question. Why sake?",
    subtext: "Of all the things to drink. Why this one?",
    choices: [
      c("Honesty — four ingredients, no hiding. What you taste is what it is.", {
        philosophy: 3,
        palate: 1,
      }),
      c("Mystery — 1,000 years of craft and I still can't fully explain what koji does to rice", {
        terroir: 2,
        philosophy: 2,
      }),
      c("Connection — it's meant to be shared, poured for others, received with both hands", {
        ritual: 3,
        season: 1,
      }),
      c("Beauty — the intersection of nature and human attention, in a cup", {
        season: 2,
        terroir: 2,
      }),
    ],
  },
];

interface SakeProfile {
  id: Dimension;
  name: string;
  japaneseName: string;
  tagline: string;
  description: string;
  tastingNotes: string;
  pairings: string[];
  servingTemp: string;
  producers: { name: string; region: string; note: string }[];
  resources: { title: string; url: string; type: string }[];
}

const SAKE_PROFILES: SakeProfile[] = [
  {
    id: "palate",
    name: "The Daiginjo Devotee",
    japaneseName: "大吟醸",
    tagline: "You drink with your whole body. The liquid is the teacher.",
    description:
      "Your palate is your compass. You're drawn to Daiginjo and Junmai Daiginjo — the most polished expressions of sake, where rice is milled to 50% or less, stripping away everything that isn't essence. These are sakes of extraordinary delicacy: floral, fruity, ethereal. They demand attention and reward it with layers that unfold like origami in reverse.",
    tastingNotes:
      "Melon, white peach, jasmine, lychee. A finish that disappears like morning fog. Delicate umami underneath, like the memory of rice rather than rice itself.",
    pairings: [
      "Sashimi — yellowtail, sea bream, or uni",
      "Steamed vegetables with a whisper of yuzu",
      "Fresh oysters with nothing on them",
      "Alone, chilled, in a thin-walled glass — sometimes the pairing is silence",
    ],
    servingTemp:
      "Well-chilled (5-10°C / 41-50°F). These sakes reveal their architecture in the cold.",
    producers: [
      {
        name: "Dassai",
        region: "Yamaguchi",
        note: "The 23 — polished to 23% remaining. Precision as philosophy.",
      },
      {
        name: "Juyondai",
        region: "Yamagata",
        note: "Nearly impossible to find. Worth every hour of searching.",
      },
      {
        name: "Born",
        region: "Fukui",
        note: "Gold label. Aged at -8°C. Time and cold as co-brewers.",
      },
      {
        name: "Kubota Manju",
        region: "Niigata",
        note: "Clean enough to see through. Complex enough to get lost in.",
      },
    ],
    resources: [
      {
        title: "The Sake Handbook by John Gauntner",
        url: "https://www.amazon.com/Sake-Handbook-John-Gauntner/dp/0804834253",
        type: "book",
      },
      { title: "Sake Today Magazine", url: "https://saketoday.com", type: "publication" },
      {
        title: "UrbanSake — Tasting Notes Database",
        url: "https://urbansake.com",
        type: "directory",
      },
    ],
  },
  {
    id: "ritual",
    name: "The Ochoko Ceremonialist",
    japaneseName: "儀式",
    tagline: "The cup matters as much as what's in it. Context is content.",
    description:
      "For you, sake isn't a beverage — it's a practice. You're drawn to the ritual dimension: the ochoko (small cup), the tokkuri (flask), the act of pouring for others and receiving with both hands. Your sake is Junmai — honest, full-bodied, versatile enough to serve warm or cold, traditional enough to honor the ceremony. The drink is the excuse. The connection is the point.",
    tastingNotes:
      "Rice-forward, umami-rich, with notes of steamed grain, chestnut, and a gentle earthiness. Warm, it opens into caramel and toasted sesame. A sake that tastes like the word 'home.'",
    pairings: [
      "Yakitori — the charcoal and the rice find each other",
      "Hot pot (nabe) — communal food for a communal drink",
      "Grilled miso-glazed eggplant",
      "Anything cooked slowly, shared generously, eaten with your hands",
    ],
    servingTemp:
      "Warm to hot (40-55°C / 104-131°F). Warming sake is an act of care — for the liquid and for the person you're pouring it for.",
    producers: [
      {
        name: "Tamagawa",
        region: "Kyoto",
        note: "Brewed by Philip Harper, the first non-Japanese toji. Tradition honored by an outsider.",
      },
      {
        name: "Dewazakura",
        region: "Yamagata",
        note: "Oka Cherry Bouquet. The gateway sake that ruins you for everything else.",
      },
      {
        name: "Suigei",
        region: "Kochi",
        note: "Drunken Whale. Dry, clean, built for the table. Named for the drinking culture of Kochi.",
      },
      {
        name: "Hakkaisan",
        region: "Niigata",
        note: "Snow country sake. Clean as the water it comes from.",
      },
    ],
    resources: [
      {
        title: "Sake Confidential by John Gauntner",
        url: "https://www.amazon.com/Sake-Confidential-Insiders-Guide-Drink/dp/1611720141",
        type: "book",
      },
      {
        title: "Tippsy Sake — Curated Sake Boxes",
        url: "https://www.tippsysake.com",
        type: "retailer",
      },
      { title: "The Joy of Sake Festival", url: "https://joyofsake.com", type: "event" },
    ],
  },
  {
    id: "terroir",
    name: "The Terroir Pilgrim",
    japaneseName: "風土",
    tagline: "You taste the place before you taste the drink. Geography is biography.",
    description:
      "You believe sake should taste like somewhere — not just something. You're drawn to Junmai Ginjo and regional expressions where the water source, the local rice variety, and the microclimate all leave their fingerprints in the glass. For you, the best sake is a postcard from a specific place, written in a language only your palate can read. Niigata's snow-melt clarity. Hiroshima's soft-water roundness. Akita's bold, structured depth.",
    tastingNotes:
      "Varies by region — Niigata: clean, dry, mineral. Hiroshima: soft, round, gentle. Akita: rich, structured, bold. The common thread is specificity. You can taste where it was made.",
    pairings: [
      "Local cuisine from the same region as the sake — the ultimate pairing",
      "Seasonal vegetables — what grows together, drinks together",
      "River fish — ayu, iwana — grilled simply with salt",
      "Aged cheese — terroir recognizes terroir",
    ],
    servingTemp:
      "Slightly chilled to room temperature (12-18°C / 54-64°F). Let the place speak without thermal interference.",
    producers: [
      {
        name: "Tedorigawa",
        region: "Ishikawa",
        note: "Mountain river water. You can taste the altitude.",
      },
      {
        name: "Masumi",
        region: "Nagano",
        note: "Alpine sake from Japan's roof. The yeast they discovered (No. 7) changed everything.",
      },
      {
        name: "Kamoizumi",
        region: "Hiroshima",
        note: "Soft water, rich sake. The paradox of Hiroshima brewing.",
      },
      {
        name: "Aramasa",
        region: "Akita",
        note: "No. 6 yeast originators. Ancient techniques, modern vision. Wood-fermented.",
      },
    ],
    resources: [
      {
        title: "The Year of Drinking Adventurously by Jeff Cioletti",
        url: "https://www.amazon.com/Year-Drinking-Adventurously-Worlds-Interesting/dp/1630762504",
        type: "book",
      },
      { title: "Sake World — Regional Guides", url: "https://sake-world.com", type: "education" },
      {
        title: "Japan Sake & Shochu Makers Association",
        url: "https://www.japansake.or.jp/sake/english/",
        type: "organization",
      },
    ],
  },
  {
    id: "philosophy",
    name: "The Koji Contemplative",
    japaneseName: "哲学",
    tagline: "You don't just drink sake. You think about what sake means.",
    description:
      "For you, sake is a philosophical proposition: four ingredients, infinite expressions. You're drawn to Kimoto and Yamahai — the ancient brewing methods that use natural lactic fermentation instead of shortcuts. These sakes are wilder, funkier, more complex. They taste like patience. They taste like trusting the process. You appreciate that the best sake is made by getting out of nature's way.",
    tastingNotes:
      "Gamey, earthy, with notes of mushroom, dark honey, and a lactic tang that conventional sake doesn't have. A longer finish — these sakes don't leave quietly. Complexity that rewards the second and third sip more than the first.",
    pairings: [
      "Rich, fatty dishes — braised pork belly, duck confit",
      "Aged or funky cheeses — blue cheese, washed rind",
      "Mushroom dishes — the earth meeting the earth",
      "Dark chocolate — bitterness recognizes bitterness",
    ],
    servingTemp:
      "Room temperature to warm (15-45°C / 59-113°F). These sakes transform across the temperature spectrum — try the same bottle at three different temps.",
    producers: [
      {
        name: "Daishichi",
        region: "Fukushima",
        note: "The kimoto masters. Every bottle is a lesson in patience.",
      },
      {
        name: "Yamatoshizuku",
        region: "Akita",
        note: "Yamahai specialists. Wild yeast, controlled chaos.",
      },
      {
        name: "Tengumai",
        region: "Ishikawa",
        note: "Yamahai Junmai. The gateway to understanding what natural fermentation tastes like.",
      },
      {
        name: "Kidoizumi",
        region: "Chiba",
        note: "Hot yamahai method. Deliberately unconventional. Sake for people who think about sake.",
      },
    ],
    resources: [
      {
        title: "Sake: The History, Stories and Craft by Elliot Faber",
        url: "https://www.amazon.com/Sake-History-Stories-Craft-Japans/dp/1787136590",
        type: "book",
      },
      {
        title: "Natsuki Kikuya — Sake Education",
        url: "https://www.sake-expert.com",
        type: "education",
      },
      {
        title: "Sake Scholar Certification",
        url: "https://sakescholar.com",
        type: "certification",
      },
    ],
  },
  {
    id: "season",
    name: "The Seasonal Drinker",
    japaneseName: "季節",
    tagline: "The right sake at the wrong time is the wrong sake.",
    description:
      "You understand that sake has seasons — and so do you. Shiboritate (fresh-pressed) in winter. Hiyaoroshi (autumn-released) when the leaves turn. Nama (unpasteurized) in spring when everything is raw and alive. Chilled nigori in summer heat. You don't have one sake — you have a sake for every version of yourself across the calendar. Your relationship with sake is a relationship with time.",
    tastingNotes:
      "Spring: bright, floral, effervescent. Summer: crisp, light, refreshing. Autumn: mellow, rounded, mature. Winter: bold, warming, celebratory. The flavor is the season made liquid.",
    pairings: [
      "Spring: cherry blossom viewing (hanami) with light appetizers",
      "Summer: chilled tofu, cucumber, and cold soba noodles",
      "Autumn: matsutake mushrooms, roasted sweet potato, grilled sanma",
      "Winter: hot pot, oden, anything that steams",
    ],
    servingTemp:
      "Follows the season — cold in summer, warm in winter, room temp in the transitions. Let the weather choose.",
    producers: [
      {
        name: "Gasanryu",
        region: "Yamagata",
        note: "Seasonal releases that track the mountain's moods. Each bottle is a timestamp.",
      },
      {
        name: "Senkin",
        region: "Tochigi",
        note: "Modern seasonal brewing. The 'Snowman' winter release is legendary.",
      },
      {
        name: "Hiraizumi",
        region: "Akita",
        note: "Nama specialist. Unpasteurized, alive, demanding to be drunk now.",
      },
      {
        name: "Kokuryu",
        region: "Fukui",
        note: "Black Dragon. Seasonal expressions from one of Japan's most consistent breweries.",
      },
    ],
    resources: [
      {
        title: "A Guide to Seasonal Sake",
        url: "https://www.japantimes.co.jp/life/sake-guide/",
        type: "guide",
      },
      {
        title: "Sake Discoveries — Seasonal Subscriptions",
        url: "https://sakediscoveries.com",
        type: "subscription",
      },
      {
        title: "True Sake — America's First Sake Store",
        url: "https://www.truesake.com",
        type: "retailer",
      },
    ],
  },
];

const JOURNEY_CONTINUES = [
  {
    name: "Find Your Mezcal",
    url: "https://mezcalagave-ahru9fq8.manus.space",
    hook: "The agave that matches your soul.",
  },
  {
    name: "Find Your Tequila",
    url: "https://tequilaazul-fxqrr3js.manus.space",
    hook: "Highland or lowland. A love letter in liquid form.",
  },
  {
    name: "Find Your Therapy",
    url: "/find-your-therapy",
    hook: "CBT, IFS, somatic — matched to your wiring.",
  },
  {
    name: "Find Your Water",
    url: "https://aqwaterqpr-wvzsc3ph.manus.space",
    hook: "The element that teaches you to flow.",
  },
  {
    name: "Find Your Purpose",
    url: "/assessments/dharma-finder",
    hook: "What you can't stop doing — even when nobody's paying.",
  },
  {
    name: "Find My",
    url: "/find-my",
    hook: "The master assessment. Five questions. One reckoning.",
  },
];

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-brand-gold-light/12 bg-[#0A0A10]/85 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function FindYourSakeQuiz() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { markComplete } = useJourneyProgress();

  const scores = useMemo(() => {
    const raw = {} as Record<Dimension, number>;
    DIMENSIONS.forEach((d) => (raw[d] = 0));
    Object.entries(answers).forEach(([qIdx, cIdx]) => {
      const choice = QUESTIONS[Number(qIdx)]?.choices[cIdx];
      if (!choice) return;
      for (const dim in choice.dimensions) {
        const d = dim as Dimension;
        raw[d] = (raw[d] || 0) + (choice.dimensions[d] ?? 0);
      }
    });
    const maxPossible = 16;
    const normalized = {} as Record<Dimension, number>;
    DIMENSIONS.forEach((d) => {
      normalized[d] = Math.min(10, Math.round((raw[d] / maxPossible) * 10 * 10) / 10);
    });
    return normalized;
  }, [answers]);

  const topProfile = useMemo(() => {
    const sorted = (Object.entries(scores) as [Dimension, number][]).sort((a, b) => b[1] - a[1]);
    return SAKE_PROFILES.find((p) => p.id === sorted[0]?.[0]) ?? SAKE_PROFILES[0];
  }, [scores]);

  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const next = { ...answers, [currentQ]: choiceIdx };
      setAnswers(next);
      if (currentQ < QUESTIONS.length - 1) setCurrentQ((prev) => prev + 1);
      else setPhase("results");
    },
    [answers, currentQ],
  );

  useEffect(() => {
    if (phase === "results") markComplete("find-your-sake");
  }, [phase, markComplete]);

  const displayScores = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of DIMENSIONS) out[DIMENSION_LABELS[d]] = scores[d] ?? 0;
    return out;
  }, [scores]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="sake" />
        <AssessmentIntro
          title="Find Your Sake"
          subtitle="Every cup holds a thousand years of intention."
          description="Sake is not just a drink — it's a philosophy of water, rice, craft, and time. This assessment maps your palate, your aesthetic sensibility, and your relationship with Japanese culture to find the sake that was made for someone exactly like you."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 5 }}
          whatYouGet={[
            "Your sake archetype and flavor profile",
            "A dimensional map of your palate preferences",
            "Understanding of your aesthetic relationship with craft",
            "Curated sake recommendations for your profile",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("quiz")}
        />
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    return (
      <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-6 font-sans text-[#2C1810]">
        <ThemedBackground theme="sake" />
        <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-brand-gold/10">
          <div
            className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="fixed top-6 right-6 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold/60">
          {currentQ + 1} / {QUESTIONS.length}
        </div>

        <div className="w-full max-w-2xl">
          <GlassPanel className="p-8 md:p-12">
            <h2 className="mb-2 font-heading text-[clamp(1.4rem,3vw,2rem)] leading-[1.3] font-normal text-[#F5F0E0]">
              {q.stem}
            </h2>
            <p className="mb-8 font-mono text-[0.7rem] tracking-[0.05em] text-brand-gold-light/60">
              {q.subtext}
            </p>

            <div className="flex flex-col gap-3">
              {q.choices.map((choice, idx) => (
                <button
                  key={choice.text}
                  onClick={() => handleAnswer(idx)}
                  className="rounded-xl border border-brand-gold-light/10 bg-black/25 px-5 py-4 text-left text-[0.95rem] leading-relaxed text-[#F5F0E0] transition-all hover:border-brand-gold-light/30 hover:bg-brand-gold-light/6"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="sake" />
        <EmailGate assessmentSlug="sake" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="sake" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-2 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/60 uppercase">
            Your Sake Profile
          </div>
          <div className="-mb-2 font-serif text-5xl text-brand-gold-light/25">
            {topProfile.japaneseName}
          </div>
          <h1 className="mb-2 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] font-normal">
            {topProfile.name}
          </h1>
          <p className="font-sans text-[1.15rem] text-brand-gold italic">{topProfile.tagline}</p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <GlassPanel className="flex flex-col items-center justify-center p-8">
            <AssessmentRadarChart scores={displayScores} max={10} accentColor="#D4B96A" />
            <div className="mt-4 grid w-full grid-cols-5 gap-2">
              {DIMENSIONS.map((dim) => (
                <div key={dim} className="text-center">
                  <div className="font-mono text-[0.6rem] tracking-[0.05em] text-brand-gold-light/50 uppercase">
                    {DIMENSION_LABELS[dim]}
                  </div>
                  <div className="font-heading text-xl text-brand-gold">{scores[dim]}</div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-8">
            <p className="text-base leading-[1.8] text-[#F5F0E0]/85">{topProfile.description}</p>
          </GlassPanel>
        </div>

        <GlassPanel className="mb-8 p-8">
          <h3 className="mb-3 font-heading text-xl font-normal text-[#F5F0E0]">Tasting Notes</h3>
          <p className="text-base leading-[1.8] text-[#F5F0E0]/80 italic">
            {topProfile.tastingNotes}
          </p>
          <div className="mt-4 font-mono text-[0.7rem] text-brand-gold-light/60">
            Serving Temperature: {topProfile.servingTemp}
          </div>
        </GlassPanel>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <GlassPanel className="p-8">
            <h3 className="mb-4 font-heading text-xl font-normal text-[#F5F0E0]">
              What to Eat With It
            </h3>
            <div className="flex flex-col gap-3">
              {topProfile.pairings.map((p) => (
                <div
                  key={p}
                  className="flex gap-3 text-[0.95rem] leading-relaxed text-[#F5F0E0]/80"
                >
                  <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-gold" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-8">
            <h3 className="mb-4 font-heading text-xl font-normal text-[#F5F0E0]">
              Producers to Seek Out
            </h3>
            <div className="flex flex-col gap-4">
              {topProfile.producers.map((p) => (
                <div key={p.name}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-base text-brand-gold">{p.name}</span>
                    <span className="font-mono text-[0.6rem] tracking-[0.05em] text-brand-gold-light/40">
                      {p.region}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.85rem] leading-relaxed text-[#F5F0E0]/60">
                    {p.note}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="mb-8 p-8">
          <h3 className="mb-4 font-heading text-xl font-normal text-[#F5F0E0]">Go Deeper</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {topProfile.resources.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-brand-gold-light/10 bg-black/20 p-4 transition-all hover:border-brand-gold-light/30 hover:bg-brand-gold-light/5"
              >
                <div className="mb-1 font-mono text-[0.55rem] tracking-[0.1em] text-brand-gold-light/40 uppercase">
                  {r.type}
                </div>
                <div className="text-[0.9rem] text-brand-gold">{r.title}</div>
              </a>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="mb-8 p-8">
          <div className="mb-2 font-mono text-[0.65rem] tracking-[0.15em] text-brand-gold-light/50 uppercase">
            The Journey Continues
          </div>
          <h3 className="mb-4 font-heading text-2xl font-normal text-[#F5F0E0]">
            Now that you&apos;ve found your sake...
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {JOURNEY_CONTINUES.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="block rounded-lg border border-brand-gold-light/10 bg-black/20 p-4 transition-all hover:border-brand-gold-light/30"
              >
                <div className="mb-1 font-heading text-[0.95rem] text-brand-gold">{item.name}</div>
                <div className="text-[0.8rem] leading-snug text-[#F5F0E0]/50">{item.hook}</div>
              </a>
            ))}
          </div>
        </GlassPanel>

        <div className="mb-8">
          <JourneyTracker variant="light" currentAssessmentId="find-your-sake" />
        </div>

        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-sake" />
          <button
            onClick={() => {
              setPhase("landing");
              setCurrentQ(0);
              setAnswers({});
              setEmailGated(false);
            }}
            className="rounded-lg border border-brand-gold/20 px-6 py-3 font-mono text-[0.75rem] tracking-[0.1em] text-brand-gold-light/60 uppercase transition-colors hover:border-brand-gold-light/50 hover:text-brand-gold-light"
          >
            Retake the Tasting
          </button>
          <Link
            href="/find-my"
            className="rounded-lg bg-linear-to-br from-brand-gold to-brand-gold-light px-6 py-3 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-[#0A0A10] uppercase"
          >
            Back to Find My
          </Link>
        </div>

        <div className="mt-16 text-center font-mono text-[0.6rem] tracking-[0.15em] text-brand-gold-light/20 uppercase">
          Zero Algorithm · All Nerve · One Ecosystem
        </div>
      </div>

      <WhatsNext />
    </div>
  );
}
