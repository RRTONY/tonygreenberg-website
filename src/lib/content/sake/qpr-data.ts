import { qprExpansion1 } from "@/lib/content/sake/qpr-expansion1";
import { qprExpansion2 } from "@/lib/content/sake/qpr-expansion2";
import { qprExpansion3 } from "@/lib/content/sake/qpr-expansion3";
import { qprExpansion4 } from "@/lib/content/sake/qpr-expansion4";

/**
 * QPR (Quality-Price Ratio) Data Module
 * Sake Scanner, Restaurant Menu Analyzer, Sommelier Card
 * Comprehensive US-available sake database with pricing, retailers, and ZIP codes
 */

// ============================================================
// QPR SCORING SYSTEM
// ============================================================

export interface QPRSake {
  id: string;
  name: string;
  nameJa: string;
  brewery: string;
  breweryJa: string;
  prefecture: string;
  prefectureJa: string;
  type: string; // Junmai Daiginjo, Junmai Ginjo, etc.
  typeJa: string;
  ricePolishRatio: number; // percentage
  smv: number; // Sake Meter Value
  acidity: number;
  aminoAcid?: number;
  abv: number;
  riceVariety: string;
  riceVarietyJa: string;
  flavorProfile: string[];
  flavorProfileJa: string[];
  aromaProfile: string[];
  aromaProfileJa: string[];
  // QPR Scoring (0-100)
  qualityScore: number;     // Blind tasting quality (0-100)
  experienceScore: number;  // EXV-derived experience value (0-100)
  priceUS: number;          // Typical US retail price (720ml)
  priceJapan: number;       // Typical Japan retail price (720ml) in USD
  qprUS: number;            // Quality-Price Ratio for US market
  qprJapan: number;         // Quality-Price Ratio for Japan market
  qprTier: 'legendary' | 'exceptional' | 'excellent' | 'good' | 'fair' | 'overpriced';
  // Availability
  usAvailability: 'widely' | 'moderate' | 'limited' | 'rare';
  onlineRetailers: string[];
  servingTemp: string;
  servingTempJa: string;
  pairingEn: string[];
  pairingJa: string[];
  description: string;
  descriptionJa: string;
  // Kanji for label identification
  labelKanji: string;
}

export interface USRetailer {
  id: string;
  name: string;
  type: 'online' | 'physical' | 'both';
  url?: string;
  states: string[]; // US states served
  zipRanges?: string[]; // ZIP code prefixes
  specialties: string[];
  affiliateReady: boolean;
  rating: number; // 1-5
  priceLevel: 'budget' | 'mid' | 'premium' | 'luxury';
  description: string;
  descriptionJa: string;
  city?: string;
  state?: string;
}

export interface SommelierProfile {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  preferredTypes: string[];
  preferredFlavors: string[];
  preferredAromas: string[];
  avoidFlavors: string[];
  tempPreference: string;
  sommelierPhrase: string;
  sommelierPhraseJa: string;
  topRecommendations: string[]; // QPRSake ids
  icon: string; // emoji
}

// ============================================================
// QPR FORMULA EXPLANATION
// ============================================================

export const qprFormula = {
  en: {
    title: 'QPR — Quality-Price Ratio',
    subtitle: 'The only number that matters when buying sake',
    formula: 'QPR = (Quality Score × Experience Multiplier) ÷ Price × 100',
    explanation: 'Quality Score comes from blind tasting panels rating aroma complexity, flavor depth, balance, finish length, and uniqueness. Experience Multiplier adds weight for emotional impact, story, and terroir authenticity. Price is the actual retail price in your market. A QPR above 150 means you\'re getting significantly more quality than you\'re paying for.',
    tiers: [
      { tier: 'Legendary', range: '200+', color: '#FFD700', description: 'Absurd value. These bottles punch 3-4x above their price class.' },
      { tier: 'Exceptional', range: '150-199', color: '#C9A227', description: 'Outstanding value. Quality far exceeds what the price suggests.' },
      { tier: 'Excellent', range: '120-149', color: '#8B7355', description: 'Great value. You\'re getting more than you\'re paying for.' },
      { tier: 'Good', range: '90-119', color: '#6B8E6B', description: 'Fair value. Quality matches the price point.' },
      { tier: 'Fair', range: '60-89', color: '#8B8B8B', description: 'Below average value. You\'re paying a premium for the name.' },
      { tier: 'Overpriced', range: 'Below 60', color: '#8B4513', description: 'Poor value. Marketing exceeds substance.' },
    ],
  },
  ja: {
    title: 'QPR — 品質価格比',
    subtitle: '日本酒を買う時に唯一重要な数字',
    formula: 'QPR = (品質スコア × 体験乗数) ÷ 価格 × 100',
    explanation: '品質スコアはブラインドテイスティングパネルが香りの複雑さ、味わいの深さ、バランス、余韻の長さ、独自性を評価。体験乗数は感動、物語性、テロワールの真正性に重みを加える。価格はあなたの市場での実際の小売価格。QPRが150を超えると、支払い以上の品質を得ていることを意味する。',
    tiers: [
      { tier: '伝説級', range: '200以上', color: '#FFD700', description: '驚異的な価値。価格帯の3-4倍のパンチ力。' },
      { tier: '卓越', range: '150-199', color: '#C9A227', description: '傑出した価値。品質が価格の示す以上。' },
      { tier: '優秀', range: '120-149', color: '#8B7355', description: '素晴らしい価値。支払い以上のものを得ている。' },
      { tier: '良好', range: '90-119', color: '#6B8E6B', description: '適正な価値。品質が価格帯に見合う。' },
      { tier: '普通', range: '60-89', color: '#8B8B8B', description: '平均以下の価値。名前にプレミアムを払っている。' },
      { tier: '割高', range: '60未満', color: '#8B4513', description: '低い価値。マーケティングが中身を超えている。' },
    ],
  },
};

// ============================================================
// US-AVAILABLE SAKE DATABASE WITH QPR SCORES
// ============================================================

const qprSakeBase: QPRSake[] = [
  {
    id: 'masumi-okuden',
    name: 'Masumi Okuden Kantsukuri',
    nameJa: '真澄 奥伝寒造り',
    brewery: 'Miyasaka Brewing',
    breweryJa: '宮坂醸造',
    prefecture: 'Nagano',
    prefectureJa: '長野',
    type: 'Junmai',
    typeJa: '純米',
    ricePolishRatio: 70,
    smv: -1,
    acidity: 1.7,
    abv: 15,
    riceVariety: 'Miyama Nishiki',
    riceVarietyJa: '美山錦',
    flavorProfile: ['umami', 'rice', 'cream', 'chestnut'],
    flavorProfileJa: ['旨味', '米', 'クリーム', '栗'],
    aromaProfile: ['steamed rice', 'mushroom', 'earth'],
    aromaProfileJa: ['蒸し米', 'きのこ', '土'],
    qualityScore: 88,
    experienceScore: 85,
    priceUS: 22,
    priceJapan: 12,
    qprUS: 210,
    qprJapan: 385,
    qprTier: 'legendary',
    usAvailability: 'widely',
    onlineRetailers: ['Tippsy', 'Drizly', 'Total Wine'],
    servingTemp: 'Room to warm (40-45°C)',
    servingTempJa: '常温〜ぬる燗（40-45°C）',
    pairingEn: ['Grilled chicken yakitori', 'Mushroom risotto', 'Aged cheese'],
    pairingJa: ['焼き鳥', 'きのこリゾット', '熟成チーズ'],
    description: 'The gold standard of everyday junmai. Masumi\'s Okuden is what every sake should aspire to be at this price point — rich, balanced, and deeply satisfying. The Yeast No. 7, which Miyasaka Brewing literally invented, gives it that signature soft, round character.',
    descriptionJa: '日常の純米酒の金字塔。真澄の奥伝は、この価格帯で全ての日本酒が目指すべき姿 — 豊かで、バランスが取れ、深く満足できる。宮坂醸造が文字通り発明した7号酵母が、あの柔らかく丸い特徴を与えている。',
    labelKanji: '真澄',
  },
  {
    id: 'hakkaisan-tokubetsu',
    name: 'Hakkaisan Tokubetsu Junmai',
    nameJa: '八海山 特別純米',
    brewery: 'Hakkaisan Brewery',
    breweryJa: '八海醸造',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    type: 'Tokubetsu Junmai',
    typeJa: '特別純米',
    ricePolishRatio: 60,
    smv: +1,
    acidity: 1.0,
    abv: 15.5,
    riceVariety: 'Gohyakumangoku',
    riceVarietyJa: '五百万石',
    flavorProfile: ['clean', 'mineral', 'pear', 'light umami'],
    flavorProfileJa: ['クリーン', 'ミネラル', '梨', '軽い旨味'],
    aromaProfile: ['melon', 'white flower', 'fresh snow'],
    aromaProfileJa: ['メロン', '白い花', '新雪'],
    qualityScore: 90,
    experienceScore: 82,
    priceUS: 28,
    priceJapan: 14,
    qprUS: 172,
    qprJapan: 344,
    qprTier: 'exceptional',
    usAvailability: 'widely',
    onlineRetailers: ['Tippsy', 'Drizly', 'Total Wine', 'Wine.com'],
    servingTemp: 'Chilled to room (5-20°C)',
    servingTempJa: '冷酒〜常温（5-20°C）',
    pairingEn: ['Sashimi', 'Steamed vegetables', 'Light pasta'],
    pairingJa: ['刺身', '蒸し野菜', '軽いパスタ'],
    description: 'Niigata\'s snow-country elegance in a bottle. Hakkaisan is the sake that converts wine drinkers — crystalline clarity, laser-precise balance, and a finish that disappears like fresh powder. The QPR is exceptional because this level of polish usually costs twice as much.',
    descriptionJa: '新潟の雪国の優雅さを瓶に。八海山はワイン愛好家を改宗させる酒 — 水晶のような透明感、レーザーのような精密なバランス、新雪のように消える余韻。この洗練度は通常2倍の価格がする。',
    labelKanji: '八海山',
  },
  {
    id: 'tedorigawa-silver',
    name: 'Tedorigawa Silver Mountain',
    nameJa: '手取川 銀嶺',
    brewery: 'Yoshida Brewery',
    breweryJa: '吉田酒造店',
    prefecture: 'Ishikawa',
    prefectureJa: '石川',
    type: 'Junmai Daiginjo',
    typeJa: '純米大吟醸',
    ricePolishRatio: 45,
    smv: +3,
    acidity: 1.3,
    abv: 15,
    riceVariety: 'Yamada Nishiki',
    riceVarietyJa: '山田錦',
    flavorProfile: ['elegant', 'peach', 'silk', 'mineral'],
    flavorProfileJa: ['上品', '桃', 'シルク', 'ミネラル'],
    aromaProfile: ['white peach', 'lily', 'anise'],
    aromaProfileJa: ['白桃', '百合', 'アニス'],
    qualityScore: 94,
    experienceScore: 91,
    priceUS: 45,
    priceJapan: 22,
    qprUS: 155,
    qprJapan: 318,
    qprTier: 'exceptional',
    usAvailability: 'moderate',
    onlineRetailers: ['Tippsy', 'True Sake'],
    servingTemp: 'Chilled (8-12°C)',
    servingTempJa: '冷酒（8-12°C）',
    pairingEn: ['Uni sushi', 'Lobster', 'Truffle risotto'],
    pairingJa: ['ウニ寿司', 'ロブスター', 'トリュフリゾット'],
    description: 'Tedorigawa is the insider\'s sake — beloved by sommeliers, virtually unknown to casual drinkers. Silver Mountain is a junmai daiginjo that rivals bottles costing $100+. The Noto toji tradition gives it a depth that modern automated breweries simply cannot replicate.',
    descriptionJa: '手取川は通の酒 — ソムリエに愛され、カジュアルな飲み手にはほぼ無名。銀嶺は100ドル以上の瓶に匹敵する純米大吟醸。能登杜氏の伝統が、現代の自動化された蔵では再現できない深みを与える。',
    labelKanji: '手取川',
  },
  {
    id: 'born-gold',
    name: 'Born Gold Junmai Daiginjo',
    nameJa: '梵 ゴールド 純米大吟醸',
    brewery: 'Katoukichibee Shouten',
    breweryJa: '加藤吉平商店',
    prefecture: 'Fukui',
    prefectureJa: '福井',
    type: 'Junmai Daiginjo',
    typeJa: '純米大吟醸',
    ricePolishRatio: 50,
    smv: +3,
    acidity: 1.3,
    abv: 15.5,
    riceVariety: 'Yamada Nishiki',
    riceVarietyJa: '山田錦',
    flavorProfile: ['melon', 'banana', 'honey', 'vanilla'],
    flavorProfileJa: ['メロン', 'バナナ', '蜂蜜', 'バニラ'],
    aromaProfile: ['tropical fruit', 'white flower', 'pear'],
    aromaProfileJa: ['トロピカルフルーツ', '白い花', '梨'],
    qualityScore: 92,
    experienceScore: 90,
    priceUS: 38,
    priceJapan: 18,
    qprUS: 178,
    qprJapan: 376,
    qprTier: 'exceptional',
    usAvailability: 'moderate',
    onlineRetailers: ['Tippsy', 'Sake Social'],
    servingTemp: 'Chilled (5-10°C)',
    servingTempJa: '冷酒（5-10°C）',
    pairingEn: ['Foie gras', 'Fruit tart', 'Aged gouda'],
    pairingJa: ['フォアグラ', 'フルーツタルト', '熟成ゴーダ'],
    description: 'Born Gold is the gateway drug to premium sake. Aged at -8°C for two years before release, it develops a honeyed richness that makes wine lovers weep. The QPR is absurd — this is a $80 experience for $38.',
    descriptionJa: '梵ゴールドはプレミアム酒への入門。出荷前に-8°Cで2年熟成し、ワイン愛好家を泣かせる蜂蜜のような豊かさを発展させる。QPRは驚異的 — 38ドルで80ドルの体験。',
    labelKanji: '梵',
  },
  {
    id: 'kubota-manju',
    name: 'Kubota Manju Junmai Daiginjo',
    nameJa: '久保田 萬寿 純米大吟醸',
    brewery: 'Asahi Shuzo',
    breweryJa: '朝日酒造',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    type: 'Junmai Daiginjo',
    typeJa: '純米大吟醸',
    ricePolishRatio: 50,
    smv: +2,
    acidity: 1.2,
    abv: 15.5,
    riceVariety: 'Gohyakumangoku',
    riceVarietyJa: '五百万石',
    flavorProfile: ['elegant', 'silk', 'vanilla', 'mineral'],
    flavorProfileJa: ['上品', 'シルク', 'バニラ', 'ミネラル'],
    aromaProfile: ['pear', 'white peach', 'floral'],
    aromaProfileJa: ['梨', '白桃', '花'],
    qualityScore: 91,
    experienceScore: 88,
    priceUS: 65,
    priceJapan: 32,
    qprUS: 95,
    qprJapan: 193,
    qprTier: 'good',
    usAvailability: 'widely',
    onlineRetailers: ['Tippsy', 'Drizly', 'Total Wine', 'Wine.com'],
    servingTemp: 'Chilled (8-12°C)',
    servingTempJa: '冷酒（8-12°C）',
    pairingEn: ['Kaiseki cuisine', 'White fish sashimi', 'Tempura'],
    pairingJa: ['懐石料理', '白身魚の刺身', '天ぷら'],
    description: 'The most famous premium sake in Japan. Kubota Manju is beautiful but the US markup hurts the QPR. At $65 it\'s good but not exceptional value — in Japan at $32 it\'s a different story entirely. Still, the silky texture and perfect balance make it a benchmark.',
    descriptionJa: '日本で最も有名なプレミアム酒。久保田萬寿は美しいが、米国のマークアップがQPRを傷つける。65ドルでは良いが卓越した価値ではない — 日本の32ドルでは全く別の話。それでも、絹のような質感と完璧なバランスは基準点。',
    labelKanji: '久保田',
  },
  {
    id: 'dassai-23',
    name: 'Dassai 23 Junmai Daiginjo',
    nameJa: '獺祭 二割三分 純米大吟醸',
    brewery: 'Asahi Shuzo (Yamaguchi)',
    breweryJa: '旭酒造',
    prefecture: 'Yamaguchi',
    prefectureJa: '山口',
    type: 'Junmai Daiginjo',
    typeJa: '純米大吟醸',
    ricePolishRatio: 23,
    smv: +4,
    acidity: 1.1,
    abv: 16,
    riceVariety: 'Yamada Nishiki',
    riceVarietyJa: '山田錦',
    flavorProfile: ['floral', 'honey', 'melon', 'silk'],
    flavorProfileJa: ['花', '蜂蜜', 'メロン', 'シルク'],
    aromaProfile: ['white flower', 'pear', 'lychee'],
    aromaProfileJa: ['白い花', '梨', 'ライチ'],
    qualityScore: 93,
    experienceScore: 86,
    priceUS: 85,
    priceJapan: 38,
    qprUS: 72,
    qprJapan: 161,
    qprTier: 'fair',
    usAvailability: 'widely',
    onlineRetailers: ['Tippsy', 'Drizly', 'Total Wine', 'Wine.com', 'Costco'],
    servingTemp: 'Chilled (5-10°C)',
    servingTempJa: '冷酒（5-10°C）',
    pairingEn: ['Otoro tuna', 'Caviar', 'French cuisine'],
    pairingJa: ['大トロ', 'キャビア', 'フランス料理'],
    description: 'The most polarizing sake in the world. Dassai 23 is technically brilliant — 23% rice polishing is insane engineering. But the US price of $85 makes the QPR mediocre. The same bottle in Japan at $38 is a different proposition. Beautiful sake, but you\'re paying for the brand.',
    descriptionJa: '世界で最も賛否両論の酒。獺祭23は技術的に素晴らしい — 23%の精米歩合は驚異的な技術。しかし米国の85ドルではQPRは凡庸。日本の38ドルでは全く別の提案。美しい酒だが、ブランドに払っている。',
    labelKanji: '獺祭',
  },
  {
    id: 'suigei-tokubetsu',
    name: 'Suigei Tokubetsu Junmai',
    nameJa: '酔鯨 特別純米',
    brewery: 'Suigei Brewing',
    breweryJa: '酔鯨酒造',
    prefecture: 'Kochi',
    prefectureJa: '高知',
    type: 'Tokubetsu Junmai',
    typeJa: '特別純米',
    ricePolishRatio: 55,
    smv: +7,
    acidity: 1.7,
    abv: 15,
    riceVariety: 'Matsuyama Mii',
    riceVarietyJa: '松山三井',
    flavorProfile: ['dry', 'crisp', 'citrus', 'mineral'],
    flavorProfileJa: ['辛口', 'キレ', '柑橘', 'ミネラル'],
    aromaProfile: ['green apple', 'lime', 'stone'],
    aromaProfileJa: ['青りんご', 'ライム', '石'],
    qualityScore: 87,
    experienceScore: 84,
    priceUS: 20,
    priceJapan: 10,
    qprUS: 228,
    qprJapan: 456,
    qprTier: 'legendary',
    usAvailability: 'moderate',
    onlineRetailers: ['Tippsy', 'True Sake'],
    servingTemp: 'Chilled to room (5-20°C)',
    servingTempJa: '冷酒〜常温（5-20°C）',
    pairingEn: ['Grilled fish', 'Oysters', 'Ceviche'],
    pairingJa: ['焼き魚', '牡蠣', 'セビーチェ'],
    description: 'The drunken whale from Kochi — Japan\'s hardest-drinking prefecture. Suigei is bone-dry, razor-sharp, and absurdly cheap. At $20 this is the single best QPR sake available in the US. Period. If you only buy one bottle from this list, make it this one.',
    descriptionJa: '高知の酔鯨 — 日本で最も酒を飲む県から。酔鯨は超辛口、剃刀のようにシャープ、そして驚くほど安い。20ドルで、米国で入手可能な最高QPRの酒。この一本だけ買うなら、これを選べ。',
    labelKanji: '酔鯨',
  },
  {
    id: 'dewazakura-oka',
    name: 'Dewazakura Oka Ginjo',
    nameJa: '出羽桜 桜花 吟醸',
    brewery: 'Dewazakura Brewery',
    breweryJa: '出羽桜酒造',
    prefecture: 'Yamagata',
    prefectureJa: '山形',
    type: 'Ginjo',
    typeJa: '吟醸',
    ricePolishRatio: 50,
    smv: +5,
    acidity: 1.2,
    abv: 15.5,
    riceVariety: 'Dewasansan',
    riceVarietyJa: '出羽燦々',
    flavorProfile: ['cherry blossom', 'apple', 'clean', 'light'],
    flavorProfileJa: ['桜', 'りんご', 'クリーン', '軽い'],
    aromaProfile: ['cherry blossom', 'banana', 'fresh'],
    aromaProfileJa: ['桜', 'バナナ', 'フレッシュ'],
    qualityScore: 89,
    experienceScore: 87,
    priceUS: 25,
    priceJapan: 11,
    qprUS: 198,
    qprJapan: 450,
    qprTier: 'exceptional',
    usAvailability: 'widely',
    onlineRetailers: ['Tippsy', 'Drizly', 'Total Wine'],
    servingTemp: 'Chilled (5-10°C)',
    servingTempJa: '冷酒（5-10°C）',
    pairingEn: ['Spring salad', 'Shrimp tempura', 'Fruit dessert'],
    pairingJa: ['春のサラダ', '海老天ぷら', 'フルーツデザート'],
    description: 'The sake that started the ginjo revolution in the 1980s. Dewazakura Oka literally changed how Japan drinks. Cherry blossom elegance at a price that makes no sense — $25 for a sake this refined is practically charity.',
    descriptionJa: '1980年代に吟醸革命を起こした酒。出羽桜桜花は文字通り日本の飲み方を変えた。桜の優雅さがこの価格 — この洗練度で25ドルはほぼ慈善事業。',
    labelKanji: '出羽桜',
  },
  {
    id: 'kokuryu-junmai',
    name: 'Kokuryu Junmai Ginjo',
    nameJa: '黒龍 純米吟醸',
    brewery: 'Kokuryu Brewery',
    breweryJa: '黒龍酒造',
    prefecture: 'Fukui',
    prefectureJa: '福井',
    type: 'Junmai Ginjo',
    typeJa: '純米吟醸',
    ricePolishRatio: 55,
    smv: +3.5,
    acidity: 1.3,
    abv: 15.5,
    riceVariety: 'Gohyakumangoku',
    riceVarietyJa: '五百万石',
    flavorProfile: ['melon', 'cream', 'mineral', 'umami'],
    flavorProfileJa: ['メロン', 'クリーム', 'ミネラル', '旨味'],
    aromaProfile: ['cantaloupe', 'white flower', 'rice'],
    aromaProfileJa: ['マスクメロン', '白い花', '米'],
    qualityScore: 91,
    experienceScore: 89,
    priceUS: 35,
    priceJapan: 16,
    qprUS: 168,
    qprJapan: 367,
    qprTier: 'exceptional',
    usAvailability: 'moderate',
    onlineRetailers: ['Tippsy', 'True Sake', 'Sake Social'],
    servingTemp: 'Chilled (8-12°C)',
    servingTempJa: '冷酒（8-12°C）',
    pairingEn: ['Sushi omakase', 'Grilled wagyu', 'Mushroom soup'],
    pairingJa: ['寿司おまかせ', '和牛グリル', 'きのこスープ'],
    description: 'Black Dragon from Fukui — the brewery that introduced Burgundy-style aging to sake. Their junmai ginjo is the entry point to one of Japan\'s most prestigious houses. Melon-cream richness with mineral backbone. At $35, this is what $60+ sake wishes it could be.',
    descriptionJa: '福井の黒龍 — ブルゴーニュスタイルの熟成を日本酒に導入した蔵。純米吟醸は日本で最も名高い蔵の入門点。メロンクリームの豊かさとミネラルの骨格。35ドルで、60ドル以上の酒が目指す姿。',
    labelKanji: '黒龍',
  },
  {
    id: 'nanbu-bijin-tokubetsu',
    name: 'Nanbu Bijin Tokubetsu Junmai',
    nameJa: '南部美人 特別純米',
    brewery: 'Nanbu Bijin',
    breweryJa: '南部美人',
    prefecture: 'Iwate',
    prefectureJa: '岩手',
    type: 'Tokubetsu Junmai',
    typeJa: '特別純米',
    ricePolishRatio: 55,
    smv: +4,
    acidity: 1.5,
    abv: 15.5,
    riceVariety: 'Gin Otome',
    riceVarietyJa: 'ぎんおとめ',
    flavorProfile: ['apple', 'rice', 'clean', 'balanced'],
    flavorProfileJa: ['りんご', '米', 'クリーン', 'バランス'],
    aromaProfile: ['green apple', 'pear', 'fresh'],
    aromaProfileJa: ['青りんご', '梨', 'フレッシュ'],
    qualityScore: 88,
    experienceScore: 86,
    priceUS: 24,
    priceJapan: 11,
    qprUS: 196,
    qprJapan: 427,
    qprTier: 'exceptional',
    usAvailability: 'moderate',
    onlineRetailers: ['Tippsy', 'True Sake'],
    servingTemp: 'Chilled to warm (5-40°C)',
    servingTempJa: '冷酒〜ぬる燗（5-40°C）',
    pairingEn: ['Grilled vegetables', 'Tofu dishes', 'Chicken teriyaki'],
    pairingJa: ['焼き野菜', '豆腐料理', 'チキン照り焼き'],
    description: 'Southern Beauty from Iwate — the first Japanese sake to receive kosher certification. Clean, honest, and versatile across every temperature. At $24, this is the sake you keep in your fridge at all times. The definition of reliable excellence.',
    descriptionJa: '岩手の南部美人 — コーシャ認証を受けた最初の日本酒。クリーンで正直、あらゆる温度で万能。24ドルで、常に冷蔵庫に入れておくべき酒。信頼できる卓越の定義。',
    labelKanji: '南部美人',
  },
  {
    id: 'isojiman-junmai',
    name: 'Isojiman Junmai Ginjo',
    nameJa: '磯自慢 純米吟醸',
    brewery: 'Isojiman Shuzo',
    breweryJa: '磯自慢酒造',
    prefecture: 'Shizuoka',
    prefectureJa: '静岡',
    type: 'Junmai Ginjo',
    typeJa: '純米吟醸',
    ricePolishRatio: 55,
    smv: +5,
    acidity: 1.2,
    abv: 15.5,
    riceVariety: 'Yamada Nishiki',
    riceVarietyJa: '山田錦',
    flavorProfile: ['melon', 'citrus', 'mineral', 'clean'],
    flavorProfileJa: ['メロン', '柑橘', 'ミネラル', 'クリーン'],
    aromaProfile: ['cantaloupe', 'lime zest', 'ocean breeze'],
    aromaProfileJa: ['マスクメロン', 'ライムの皮', '海風'],
    qualityScore: 93,
    experienceScore: 92,
    priceUS: 42,
    priceJapan: 18,
    qprUS: 162,
    qprJapan: 378,
    qprTier: 'exceptional',
    usAvailability: 'limited',
    onlineRetailers: ['True Sake', 'Sake Social'],
    servingTemp: 'Chilled (8-12°C)',
    servingTempJa: '冷酒（8-12°C）',
    pairingEn: ['Fresh oysters', 'Sashimi platter', 'Grilled sea bass'],
    pairingJa: ['生牡蠣', '刺身盛り合わせ', 'スズキのグリル'],
    description: 'Isojiman is the sommelier\'s secret — the sake that professionals drink when nobody\'s watching. Ocean-influenced Shizuoka terroir gives it a saline minerality that pairs with seafood like nothing else. Limited US availability makes it a treasure hunt.',
    descriptionJa: '磯自慢はソムリエの秘密 — プロが誰も見ていない時に飲む酒。海の影響を受けた静岡のテロワールが、他に類を見ない塩味のミネラル感を与え、シーフードとの相性は唯一無二。米国での限定入手が宝探しにする。',
    labelKanji: '磯自慢',
  },
  {
    id: 'juyondai-honmaru',
    name: 'Juyondai Honmaru',
    nameJa: '十四代 本丸',
    brewery: 'Takagi Shuzo',
    breweryJa: '高木酒造',
    prefecture: 'Yamagata',
    prefectureJa: '山形',
    type: 'Honjozo',
    typeJa: '本醸造',
    ricePolishRatio: 55,
    smv: +2,
    acidity: 1.2,
    abv: 15,
    riceVariety: 'Gohyakumangoku',
    riceVarietyJa: '五百万石',
    flavorProfile: ['pineapple', 'honey', 'silk', 'umami'],
    flavorProfileJa: ['パイナップル', '蜂蜜', 'シルク', '旨味'],
    aromaProfile: ['tropical fruit', 'muscat', 'vanilla'],
    aromaProfileJa: ['トロピカルフルーツ', 'マスカット', 'バニラ'],
    qualityScore: 97,
    experienceScore: 98,
    priceUS: 250,
    priceJapan: 15,
    qprUS: 28,
    qprJapan: 470,
    qprTier: 'overpriced',
    usAvailability: 'rare',
    onlineRetailers: ['Specialty importers only'],
    servingTemp: 'Chilled (8-12°C)',
    servingTempJa: '冷酒（8-12°C）',
    pairingEn: ['Kaiseki course', 'Premium sushi', 'Alone in silence'],
    pairingJa: ['懐石コース', 'プレミアム寿司', '静寂の中で一人で'],
    description: 'The most sought-after sake in the world. In Japan, Juyondai Honmaru retails for $15 — making it the greatest QPR in existence. In the US, speculators charge $250+, making it the worst QPR. This is the ultimate example of why you need to understand the market. The sake itself? Transcendent.',
    descriptionJa: '世界で最も求められる酒。日本では十四代本丸は15ドルで販売 — 史上最高のQPR。米国では投機家が250ドル以上を請求し、最悪のQPRに。市場を理解する必要がある究極の例。酒自体は？超越的。',
    labelKanji: '十四代',
  },
];

export const qprSakeDatabase: QPRSake[] = [
  ...qprSakeBase,
  ...qprExpansion1,
  ...qprExpansion2,
  ...qprExpansion3,
  ...qprExpansion4,
];

// ============================================================
// US RETAILER DATABASE WITH ZIP CODE COVERAGE
// ============================================================

export const usRetailers: USRetailer[] = [
  // Online Nationwide
  { id: 'tippsy', name: 'Tippsy Sake', type: 'online', url: 'https://www.tippsysake.com', states: ['ALL'], specialties: ['Curated selections', 'Sake education', 'Subscription boxes'], affiliateReady: true, rating: 5, priceLevel: 'mid', description: 'The best online sake retailer in the US. Curated selections, excellent education content, and reliable shipping. Their subscription box is the gateway drug.', descriptionJa: '米国最高のオンライン日本酒小売店。厳選されたセレクション、優れた教育コンテンツ、信頼性の高い配送。' },
  { id: 'drizly', name: 'Drizly', type: 'online', url: 'https://www.drizly.com', states: ['ALL'], specialties: ['Same-day delivery', 'Wide selection', 'Price comparison'], affiliateReady: true, rating: 4, priceLevel: 'mid', description: 'Same-day delivery in most major cities. Selection varies by location but the convenience factor is unbeatable for impulse buys.', descriptionJa: 'ほとんどの主要都市で当日配達。品揃えは場所により異なるが、衝動買いの利便性は無敵。' },
  { id: 'total-wine', name: 'Total Wine & More', type: 'both', url: 'https://www.totalwine.com', states: ['ALL'], zipRanges: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], specialties: ['Largest selection', 'Competitive pricing', 'In-store tastings'], affiliateReady: true, rating: 4, priceLevel: 'budget', description: 'The Costco of alcohol. Massive selection, competitive prices, and physical stores across the country. Their sake section has grown dramatically.', descriptionJa: '酒のコストコ。膨大な品揃え、競争力のある価格、全国の実店舗。日本酒セクションは劇的に成長。' },
  { id: 'wine-com', name: 'Wine.com', type: 'online', url: 'https://www.wine.com', states: ['ALL'], specialties: ['Premium selections', 'Expert reviews', 'Gift options'], affiliateReady: true, rating: 3, priceLevel: 'premium', description: 'Premium-focused with expert reviews. Sake selection is smaller but well-curated. Good for gifts with their presentation options.', descriptionJa: 'プレミアム重視で専門家レビュー付き。日本酒のセレクションは小さいが厳選されている。' },
  { id: 'sake-social', name: 'Sake Social', type: 'online', url: 'https://www.sakesocial.com', states: ['ALL'], specialties: ['Rare bottles', 'Monthly clubs', 'Education'], affiliateReady: true, rating: 5, priceLevel: 'premium', description: 'For the serious collector. Rare and allocated bottles you won\'t find elsewhere. Their monthly club is how you discover the esoteric.', descriptionJa: '真剣なコレクター向け。他では見つからない希少・限定ボトル。月額クラブで難解な酒を発見。' },
  // Regional Physical Stores
  { id: 'true-sake', name: 'True Sake', type: 'both', url: 'https://www.truesake.com', states: ['CA'], city: 'San Francisco', state: 'CA', zipRanges: ['94'], specialties: ['America\'s first sake store', 'Expert staff', 'Tastings'], affiliateReady: true, rating: 5, priceLevel: 'premium', description: 'America\'s first dedicated sake store, founded by Beau Timken in 2003. The staff knowledge is unmatched. Worth a pilgrimage if you\'re in SF.', descriptionJa: 'アメリカ初の専門日本酒店。2003年にBeau Timkenが設立。スタッフの知識は比類なし。SFにいるなら巡礼の価値あり。' },
  { id: 'sakaya', name: 'Sakaya', type: 'physical', states: ['NY'], city: 'New York', state: 'NY', zipRanges: ['100', '101', '102', '103', '104', '110', '111', '112', '113', '114'], specialties: ['NYC\'s premier sake shop', 'Japanese imports', 'Tastings'], affiliateReady: false, rating: 5, priceLevel: 'premium', description: 'New York\'s premier sake shop in the East Village. Rick and Hiroko Smith curate one of the best selections on the East Coast. Intimate tastings every weekend.', descriptionJa: 'ニューヨークのプレミア日本酒店。Rick and Hiroko Smithが東海岸最高のセレクションをキュレーション。' },
  { id: 'mutual-trading', name: 'Mutual Trading Co.', type: 'both', url: 'https://www.mutualtrading.com', states: ['CA', 'NY', 'TX', 'IL', 'FL', 'WA', 'HI'], specialties: ['Largest US importer', 'Restaurant supply', 'Retail'], affiliateReady: false, rating: 4, priceLevel: 'mid', description: 'The largest sake importer in the US. They supply most Japanese restaurants. Their retail arm has competitive prices on mainstream brands.', descriptionJa: '米国最大の日本酒輸入業者。ほとんどの日本食レストランに供給。小売部門は主流ブランドで競争力のある価格。' },
  { id: 'joto-sake', name: 'Joto Sake', type: 'online', url: 'https://www.jotosake.com', states: ['ALL'], specialties: ['Artisanal imports', 'Small brewery focus', 'Education'], affiliateReady: true, rating: 5, priceLevel: 'premium', description: 'Joto imports from small, family-owned breweries that nobody else brings to the US. If you want the village brewery experience without the plane ticket, start here.', descriptionJa: '他の誰も米国に持ち込まない小さな家族経営の蔵から輸入。飛行機のチケットなしで里の蔵元体験をしたいなら、ここから。' },
  { id: 'mitsuwa', name: 'Mitsuwa Marketplace', type: 'physical', states: ['CA', 'NJ', 'IL', 'TX', 'HI'], specialties: ['Japanese grocery', 'Competitive prices', 'Fresh imports'], affiliateReady: false, rating: 4, priceLevel: 'budget', description: 'Japanese supermarket chain with surprisingly good sake sections. Prices are often 20-30% below specialty stores. The Torrance, CA location has the best selection.', descriptionJa: '驚くほど良い日本酒セクションを持つ日本のスーパーマーケットチェーン。価格は専門店より20-30%安いことが多い。' },
  { id: 'marukai', name: 'Marukai / Tokyo Central', type: 'physical', states: ['CA'], city: 'Los Angeles area', state: 'CA', zipRanges: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911', '912', '913', '914', '917', '918'], specialties: ['Japanese grocery', 'Budget prices', 'Wide selection'], affiliateReady: false, rating: 4, priceLevel: 'budget', description: 'LA\'s best-kept sake secret. Tokyo Central (formerly Marukai) has prices that rival Japan. Their Gardena and Costa Mesa locations are treasure troves.', descriptionJa: 'LAの最もよく守られた日本酒の秘密。東京セントラル（旧マルカイ）は日本に匹敵する価格。' },
  { id: 'uwajimaya', name: 'Uwajimaya', type: 'physical', states: ['WA', 'OR'], specialties: ['Pacific NW\'s largest Asian market', 'Good sake selection'], affiliateReady: false, rating: 4, priceLevel: 'mid', description: 'The Pacific Northwest\'s largest Asian market. Their Seattle flagship has an excellent sake section with knowledgeable staff.', descriptionJa: '太平洋岸北西部最大のアジアンマーケット。シアトル旗艦店は知識豊富なスタッフと優れた日本酒セクション。' },
  { id: 'h-mart', name: 'H Mart', type: 'physical', states: ['CA', 'NY', 'NJ', 'TX', 'VA', 'MD', 'GA', 'PA', 'IL', 'WA', 'CO', 'AZ'], specialties: ['Korean-Japanese grocery', 'Competitive prices', 'Nationwide'], affiliateReady: false, rating: 3, priceLevel: 'budget', description: 'Korean grocery chain with growing sake sections. Not specialized but the prices are good and they\'re everywhere. Check the Japanese aisle.', descriptionJa: '日本酒セクションが成長中の韓国食料品チェーン。専門ではないが価格が良く、どこにでもある。' },
];

// ============================================================
// SOMMELIER PROFILES
// ============================================================

export const sommelierProfiles: SommelierProfile[] = [
  {
    id: 'purist',
    name: 'The Purist',
    nameJa: '純粋主義者',
    description: 'You seek clarity, precision, and restraint. Your sake should whisper, not shout. You appreciate the space between flavors as much as the flavors themselves.',
    descriptionJa: '透明感、精密さ、抑制を求める。酒は叫ぶのではなく囁くべき。味わいの間の空間を、味わいそのものと同じくらい大切にする。',
    preferredTypes: ['Junmai Daiginjo', 'Daiginjo', 'Junmai Ginjo'],
    preferredFlavors: ['clean', 'mineral', 'elegant', 'silk'],
    preferredAromas: ['white flower', 'pear', 'melon'],
    avoidFlavors: ['heavy', 'funky', 'sweet'],
    tempPreference: 'Chilled (8-12°C)',
    sommelierPhrase: '"I prefer something clean and elegant, with good acidity and a long, mineral finish. Think Chablis rather than Burgundy. Nothing too sweet or heavy."',
    sommelierPhraseJa: '「クリーンで上品なもの、良い酸味と長いミネラルの余韻があるものが好みです。ブルゴーニュよりシャブリ。甘すぎず重すぎないもの。」',
    topRecommendations: ['hakkaisan-tokubetsu', 'tedorigawa-silver', 'isojiman-junmai'],
    icon: '🏔️',
  },
  {
    id: 'adventurer',
    name: 'The Adventurer',
    nameJa: '冒険者',
    description: 'You want to be surprised. Funky, wild, unpredictable — the weirder the better. You\'d rather drink something flawed but fascinating than something perfect but boring.',
    descriptionJa: '驚きを求める。ファンキー、ワイルド、予測不可能 — 変わっていればいるほど良い。完璧だが退屈なものより、欠点があっても魅力的なものを飲みたい。',
    preferredTypes: ['Yamahai', 'Kimoto', 'Muroka', 'Nama'],
    preferredFlavors: ['funky', 'umami', 'complex', 'earthy'],
    preferredAromas: ['mushroom', 'earth', 'cheese', 'tropical'],
    avoidFlavors: ['generic', 'simple', 'predictable'],
    tempPreference: 'Room to warm (15-45°C)',
    sommelierPhrase: '"Give me something weird. Yamahai, kimoto, unpasteurized — I want to taste the brewery, the water, the rice field. Surprise me. I don\'t want safe."',
    sommelierPhraseJa: '「変わったものをください。山廃、生酛、無濾過 — 蔵、水、田んぼの味がしたい。驚かせてください。安全なものは要りません。」',
    topRecommendations: ['masumi-okuden', 'suigei-tokubetsu', 'nanbu-bijin-tokubetsu'],
    icon: '🌋',
  },
  {
    id: 'hedonist',
    name: 'The Hedonist',
    nameJa: '快楽主義者',
    description: 'You want maximum pleasure. Rich, fruity, aromatic — sake that makes you close your eyes and smile. Life is short; drink the beautiful stuff.',
    descriptionJa: '最大の快楽を求める。豊か、フルーティー、芳醇 — 目を閉じて微笑む酒。人生は短い。美しいものを飲め。',
    preferredTypes: ['Junmai Daiginjo', 'Daiginjo', 'Nama'],
    preferredFlavors: ['fruity', 'honey', 'melon', 'tropical'],
    preferredAromas: ['tropical fruit', 'muscat', 'banana', 'lychee'],
    avoidFlavors: ['austere', 'dry', 'bitter'],
    tempPreference: 'Chilled (5-10°C)',
    sommelierPhrase: '"I want something gorgeous and aromatic. Lots of fruit — melon, tropical, stone fruit. Think the sake equivalent of a great Riesling Spätlese. Make me smile."',
    sommelierPhraseJa: '「華やかで芳醇なものが欲しい。フルーツたっぷり — メロン、トロピカル、核果。リースリング・シュペートレーゼの日本酒版。笑顔にさせて。」',
    topRecommendations: ['born-gold', 'dewazakura-oka', 'juyondai-honmaru'],
    icon: '🍑',
  },
  {
    id: 'scholar',
    name: 'The Scholar',
    nameJa: '学者',
    description: 'You drink to understand. Every sip is a lesson in terroir, technique, and tradition. You want to taste the prefecture, the water, the toji\'s philosophy.',
    descriptionJa: '理解するために飲む。一口ごとがテロワール、技術、伝統の授業。県、水、杜氏の哲学を味わいたい。',
    preferredTypes: ['Junmai', 'Tokubetsu Junmai', 'Junmai Ginjo'],
    preferredFlavors: ['umami', 'rice', 'mineral', 'balanced'],
    preferredAromas: ['steamed rice', 'earth', 'stone', 'herb'],
    avoidFlavors: ['artificial', 'one-dimensional'],
    tempPreference: 'Full range (5-55°C)',
    sommelierPhrase: '"I\'m interested in terroir. What do you have that really expresses its prefecture? I want to taste the water source and the rice variety. Junmai preferred — I want to taste the rice."',
    sommelierPhraseJa: '「テロワールに興味があります。本当にその県を表現しているものは？水源と米品種を味わいたい。純米が好み — 米の味を感じたい。」',
    topRecommendations: ['masumi-okuden', 'kokuryu-junmai', 'nanbu-bijin-tokubetsu'],
    icon: '📚',
  },
];

// ============================================================
// RESTAURANT MARKUP DATA
// ============================================================

export const restaurantMarkupGuide = {
  en: {
    title: 'Restaurant Markup Decoder',
    subtitle: 'Know what you\'re really paying for',
    explanation: 'Restaurants typically mark up sake 2.5-4x retail price. A $25 retail bottle becomes $60-100 on a restaurant menu. This is normal — they have overhead, staff, glassware, and ambiance. But knowing the retail price helps you find the best value on ANY menu.',
    tiers: [
      { markup: '2x or less', verdict: 'Incredible deal', color: '#FFD700', description: 'The restaurant is practically giving it away. Order immediately.' },
      { markup: '2-2.5x', verdict: 'Great value', color: '#C9A227', description: 'Below industry standard. This restaurant respects sake drinkers.' },
      { markup: '2.5-3x', verdict: 'Standard', color: '#6B8E6B', description: 'Industry norm. Fair for a good restaurant experience.' },
      { markup: '3-4x', verdict: 'Premium markup', color: '#8B8B8B', description: 'High but acceptable at upscale venues. Expect excellent service.' },
      { markup: '4x+', verdict: 'Tourist trap', color: '#8B4513', description: 'Excessive. Unless the ambiance is extraordinary, you\'re being overcharged.' },
    ],
  },
  ja: {
    title: 'レストランマークアップ解読',
    subtitle: '本当に何に払っているか知る',
    explanation: 'レストランは通常、小売価格の2.5〜4倍のマークアップをかける。25ドルの小売ボトルがメニューでは60〜100ドルになる。これは正常 — 経費、スタッフ、グラス、雰囲気がある。しかし小売価格を知ることで、どのメニューでも最高の価値を見つけられる。',
    tiers: [
      { markup: '2倍以下', verdict: '信じられないお得', color: '#FFD700', description: 'レストランがほぼ無料で提供。即座に注文。' },
      { markup: '2〜2.5倍', verdict: '素晴らしい価値', color: '#C9A227', description: '業界標準以下。日本酒愛好家を尊重するレストラン。' },
      { markup: '2.5〜3倍', verdict: '標準', color: '#6B8E6B', description: '業界の標準。良いレストラン体験には公正。' },
      { markup: '3〜4倍', verdict: 'プレミアムマークアップ', color: '#8B8B8B', description: '高いが高級店では許容範囲。優れたサービスを期待。' },
      { markup: '4倍以上', verdict: '観光客罠', color: '#8B4513', description: '過剰。雰囲気が特別でない限り、過剰請求されている。' },
    ],
  },
};

// ============================================================
// SAKE SCANNER SYSTEM PROMPT
// ============================================================

export const sakeScannerPrompt = `You are a sake identification expert. Analyze the image of a sake bottle label and return structured JSON with the following fields:
- name: The sake name in English
- nameJa: The sake name in Japanese
- brewery: The brewery name in English
- breweryJa: The brewery name in Japanese
- prefecture: The prefecture of origin
- type: The sake classification (Junmai Daiginjo, Junmai Ginjo, Junmai, Honjozo, etc.)
- ricePolishRatio: The seimaibuai (rice polishing ratio) as a number
- abv: Alcohol by volume as a number
- estimatedRetailUS: Estimated US retail price in dollars
- estimatedRetailJapan: Estimated Japan retail price in dollars
- flavorNotes: Array of 3-5 expected flavor notes
- servingTemp: Recommended serving temperature
- pairings: Array of 3-4 food pairings
- description: A 2-3 sentence description of this sake
- confidence: How confident you are in the identification (high/medium/low)

If you cannot identify the specific sake, provide your best guess based on visible kanji, label design, and any other clues. Always return valid JSON.`;
