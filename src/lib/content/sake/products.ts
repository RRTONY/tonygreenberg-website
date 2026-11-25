// Sake subscription plans (the monthly boxes), ported word for word from the Sake Manus app's
// server/stripe/products.ts (SUBSCRIPTION_PLANS, 2026-11-26). The bottle catalog for one-off orders is
// NOT here: the app kept two lists that disagreed (this server file had 32 bottles with their own ids and
// prices, the pages showed qpr-data prices), so a bottle bought from a sake page could fail at checkout
// or be charged a different price. One source now: src/lib/content/sake/shop-data.ts, built from the
// sake database the pages show, and the server prices every order from it.

/**
 * Subscription Plans — Monthly curated sake boxes
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  priceCentsMonthly: number;
  bottleCount: number;
  features: string[];
  featuresJa: string[];
  tier: "explorer" | "connoisseur" | "omakase";
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "sub-explorer",
    name: "Explorer Box",
    nameJa: "探検家ボックス",
    description: "Three curated bottles from different regions. Perfect for beginners and the endlessly curious.",
    descriptionJa: "異なる地域から厳選された3本。初心者と好奇心旺盛な方に最適。",
    priceCentsMonthly: 5900,
    bottleCount: 3,
    tier: "explorer",
    features: [
      "3 bottles (720ml each)",
      "Different region every month",
      "Tasting guide & pairing cards",
      "Access to member-only reviews",
      "Free shipping",
    ],
    featuresJa: [
      "3本（各720ml）",
      "毎月異なる地域",
      "テイスティングガイド＆ペアリングカード",
      "会員限定レビューへのアクセス",
      "送料無料",
    ],
  },
  {
    id: "sub-connoisseur",
    name: "Connoisseur Box",
    nameJa: "鑑定家ボックス",
    description: "Three premium bottles including at least one Junmai Daiginjo. For those who know what they want.",
    descriptionJa: "少なくとも1本の純米大吟醸を含むプレミアム3本。自分の好みを知る方に。",
    priceCentsMonthly: 9900,
    bottleCount: 3,
    tier: "connoisseur",
    features: [
      "3 premium bottles (720ml each)",
      "At least 1 Junmai Daiginjo",
      "Detailed brewer profiles",
      "Tasting guide & pairing cards",
      "Priority access to limited releases",
      "Free shipping",
    ],
    featuresJa: [
      "プレミアム3本（各720ml）",
      "少なくとも1本の純米大吟醸",
      "蔵元の詳細プロフィール",
      "テイスティングガイド＆ペアリングカード",
      "限定リリースへの優先アクセス",
      "送料無料",
    ],
  },
  {
    id: "sub-omakase",
    name: "Omakase Box",
    nameJa: "おまかせボックス",
    description: "Three rare, allocated bottles chosen by our sommelier. The bottles you can't find anywhere else.",
    descriptionJa: "ソムリエが選ぶ希少な限定3本。他では手に入らない瓶。",
    priceCentsMonthly: 19900,
    bottleCount: 3,
    tier: "omakase",
    features: [
      "3 rare/allocated bottles (720ml each)",
      "Sommelier-curated selection",
      "Handwritten tasting notes",
      "Direct brewer connection",
      "Exclusive member events",
      "White-glove shipping",
    ],
    featuresJa: [
      "希少/限定3本（各720ml）",
      "ソムリエ厳選セレクション",
      "手書きテイスティングノート",
      "蔵元との直接コネクション",
      "会員限定イベント",
      "特別配送",
    ],
  },
];

export function getSubscriptionPlan(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(p => p.id === id);
}
