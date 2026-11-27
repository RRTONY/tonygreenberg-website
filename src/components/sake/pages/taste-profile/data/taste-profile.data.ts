// The Sake app's TasteProfile archetypes and page copy (client/src/pages/TasteProfile.tsx), word for
// word, each UI string as [English, Japanese] for useLanguage().t. The seven questions themselves are
// the app's `tasteQuestions` (src/lib/content/sake/education-data.ts).
// `sakeId` (new): the app linked every bottle to /sake/<slug of its name>, and only 4 of the 12 names
// matched a sake in the database (the rest went to a "not found" page). A bottle now links only when it
// has a real sake page: the 4 exact matches plus 2 obvious ones (Hakkaisan Tokubetsu, Aramasa No.6).

export type ArchetypeId = "purist" | "explorer" | "hedonist" | "philosopher";

export type Archetype = {
  archetype: string;
  archetypeJa: string;
  description: string;
  descriptionJa: string;
  styles: string[];
  bottles: { name: string; why: string; whyJa: string; sakeId?: string }[];
};

export const archetypes: Record<ArchetypeId, Archetype> = {
  purist: {
    archetype: "The Purist",
    archetypeJa: "純粋主義者",
    description:
      "You seek clarity, precision, and elegance. You appreciate the invisible hand of the brewer — sake where every imperfection has been polished away, leaving only light.",
    descriptionJa: "あなたは透明感、精密さ、優雅さを求める。蔵人の見えない手を評価する——すべての不完全さが磨き去られ、光だけが残る酒。",
    styles: ["Daiginjo", "Junmai Daiginjo", "Namazake (fresh)"],
    bottles: [
      { name: "Dassai 23", why: "The ultimate expression of polishing — 23% remaining", whyJa: "磨きの究極の表現——残存率23%", sakeId: "dassai-23" },
      { name: "Kubota Manju", why: "Crystalline purity from Niigata's snow country", whyJa: "新潟の雪国からの結晶のような純粋さ", sakeId: "kubota-manju" },
      { name: "Juyondai Ryusen", why: "Ethereal, almost impossible to find — worth the search", whyJa: "幽玄、ほぼ入手不可能——探す価値あり" },
    ],
  },
  explorer: {
    archetype: "The Explorer",
    archetypeJa: "探求者",
    description: "You crave complexity, surprise, and the unknown. You'd rather drink something strange and memorable than something perfect and forgettable.",
    descriptionJa: "複雑さ、驚き、未知を渇望する。完璧で忘れやすいものより、奇妙で記憶に残るものを飲みたい。",
    styles: ["Yamahai", "Kimoto", "Koshu (aged)", "Muroka"],
    bottles: [
      { name: "Daishichi Minowamon", why: "Kimoto complexity — layers upon layers of umami", whyJa: "生酛の複雑さ——旨味の層が幾重にも", sakeId: "daishichi-minowamon" },
      { name: "Daruma Masamune 3-Year Koshu", why: "Aged amber sake with sherry-like depth", whyJa: "3年熟成の琥珀色の酒、シェリーのような深み" },
      { name: 'Tamagawa "Time Machine" 1712', why: "Brewed with Edo-period methods — a time capsule", whyJa: "江戸時代の製法で醸造——タイムカプセル" },
    ],
  },
  hedonist: {
    archetype: "The Hedonist",
    archetypeJa: "快楽主義者",
    description: "You drink for pleasure, texture, and the feeling in your body. Rich, round, and generous — sake that fills the mouth and warms the soul.",
    descriptionJa: "快楽、テクスチャー、体の感覚のために飲む。豊かで丸みがあり寛大——口を満たし魂を温める酒。",
    styles: ["Junmai", "Nigori", "Sparkling", "Warm sake"],
    bottles: [
      { name: "Hakkaisan Tokubetsu Junmai", why: "Silky body, perfect warm or cold", whyJa: "絹のような口当たり、燗でも冷でも完璧", sakeId: "hakkaisan-tokubetsu" },
      { name: "Tozai Snow Maiden Nigori", why: "Creamy, sweet, dessert-like indulgence", whyJa: "クリーミーで甘い、デザートのような贅沢" },
      { name: "Mio Sparkling", why: "Effervescent joy — sake's answer to champagne", whyJa: "泡立つ喜び——酒のシャンパンへの答え" },
    ],
  },
  philosopher: {
    archetype: "The Philosopher",
    archetypeJa: "哲学者",
    description:
      "You drink to think. Every sip is a question. You want sake that tells a story — of place, of time, of the brewer's intention. The narrative matters as much as the liquid.",
    descriptionJa: "考えるために飲む。一口ごとが問い。場所、時間、蔵人の意図の物語を語る酒を求める。液体と同じくらい物語が重要。",
    styles: ["Terroir-driven Junmai", "Single-rice varieties", "Craft namazake"],
    bottles: [
      { name: "Tedorigawa Yoshidagura U", why: "Terroir-obsessed — you can taste the Hakusan water", whyJa: "テロワールへの執着——白山の水が味わえる" },
      { name: "Senkin Modern", why: "Domain-driven philosophy — Domaine Senkin", whyJa: "ドメーヌ哲学——仙禽モダン", sakeId: "senkin-modern" },
      { name: "Aramasa No.6", why: "Yeast archaeology — reviving the oldest yeast in Japan", whyJa: "酵母の考古学——日本最古の酵母を復活", sakeId: "aramasa-no6" },
    ],
  },
};

export const tasteProfileCopy = {
  eyebrow: ["Know Thyself", "汝自身を知れ"],
  titleA: ["Your Sake", "あなたの"],
  titleB: ["Taste Profile", "味覚プロフィール"],
  intro: [
    "Seven questions. No wrong answers. Discover which sake archetype you are and which bottles will change your life.",
    "七つの質問。間違いはない。あなたの酒の原型を発見し、人生を変える銘柄を見つけよう。",
  ],
  yourArchetype: ["Your Archetype", "あなたの原型"],
  yourStyles: ["Your Styles", "あなたのスタイル"],
  bottles: ["Bottles That Will Change Your Life", "人生を変える銘柄"],
  viewBuy: ["View & Buy", "詳細・購入"],
  retake: ["Retake the Test", "もう一度受ける"],
} as const;

export const questionCounter = (n: number, total: number) => [`Question ${n} of ${total}`, `質問 ${n} / ${total}`] as const;
