// Sake for Sake's Sake menu, route list and search index, ported from the Sake Manus app's
// client/src/components/Navigation.tsx, BottomNav.tsx, GlobalSearch.tsx and App.tsx (exported
// 2026-11-26). The app lived at the root of its own Manus domain; here every page sits under /sake,
// so `sk()` adds the prefix. The app's sake detail route /sake/:id is /sake/bottle/[id] here, so a
// sake id can never collide with a page name (/sake/rice, /sake/water...).

import type { LucideIcon } from "lucide-react";
import { Heart, Home, Search, ShoppingCart, User } from "lucide-react";

export const SAKE_BASE = "/sake";

/** "/rice" -> "/sake/rice", "/" -> "/sake". Query strings and hashes are kept. */
export function sk(path: string) {
  if (path === "/" || path === "") return SAKE_BASE;
  if (path.startsWith("?") || path.startsWith("#")) return `${SAKE_BASE}${path}`;
  return `${SAKE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** A sake's detail page (the app's /sake/:id). */
export function sakeDetailPath(id: string) {
  return `${SAKE_BASE}/bottle/${encodeURIComponent(id)}`;
}

export type SakeNavLink = { href: string; en: string; ja: string };

/** Top-bar links (Navigation.tsx `mainLinks`), app paths. */
export const sakeMainLinks: SakeNavLink[] = [
  { href: "/", en: "Home", ja: "ホーム" },
  { href: "/collection", en: "Collection", ja: "コレクション" },
  { href: "/namazake", en: "Namazake", ja: "生酒" },
  { href: "/exv", en: "EXV System", ja: "EXVシステム" },
  { href: "/liquid-alchemy", en: "Liquid Alchemy", ja: "液体の錬金術" },
  { href: "/sake-quiz", en: "Your Profile", ja: "あなたの魂" },
  { href: "/producers", en: "Producers", ja: "蔵元" },
  { href: "/favorites", en: "Favorites", ja: "お気に入り" },
];

const toolsLinks: SakeNavLink[] = [
  { href: "/qpr", en: "QPR Rankings", ja: "QPRランキング" },
  { href: "/supply-chain", en: "Dollar Map", ja: "ドルマップ" },
  { href: "/ordering-guide", en: "Ordering Guide", ja: "注文ガイド" },
  { href: "/sake-scanner", en: "Sake Scanner", ja: "酒スキャナー" },
  { href: "/menu-analyzer", en: "Menu Analyzer", ja: "メニュー分析" },
  { href: "/sommelier-card", en: "Sommelier Card", ja: "ソムリエカード" },
  { href: "/retailer-finder", en: "Retailer Finder", ja: "販売店検索" },
  { href: "/deal-alerts", en: "Deal Alerts", ja: "セールアラート" },
  { href: "/my-reviews", en: "My Reviews", ja: "マイレビュー" },
  { href: "/compare", en: "Compare Sakes", ja: "日本酒比較" },
];

const knowledgeLinks: SakeNavLink[] = [
  { href: "/rice", en: "Rice Encyclopedia", ja: "米の百科事典" },
  { href: "/process", en: "Brewing Process", ja: "醸造工程" },
  { href: "/yeast", en: "Yeast Strains", ja: "酵母" },
  { href: "/kanji", en: "Kanji Decoder", ja: "漢字解読" },
  { href: "/defects", en: "Off-Flavors", ja: "欠陥" },
  { href: "/smv-matrix", en: "SMV Matrix", ja: "日本酒度マトリクス" },
  { href: "/wine-translation", en: "Sake ↔ Wine", ja: "日本酒↔ワイン" },
  { href: "/speaking", en: "Speaking Guide", ja: "酒の話し方" },
  { href: "/value-matrix", en: "Value Matrix", ja: "価値マトリクス" },
  { href: "/retailers", en: "Where to Buy", ja: "購入先" },
];

const sensoryLinks: SakeNavLink[] = [
  { href: "/aroma", en: "Aroma Finder", ja: "香り" },
  { href: "/temperature", en: "Temperature", ja: "温度帯" },
  { href: "/vessels", en: "Vessels", ja: "器と儀式" },
  { href: "/aging", en: "Aging & Time", ja: "熟成と時間" },
  { href: "/music", en: "Music Pairing", ja: "音楽ペアリング" },
  { href: "/ichigo-ichie", en: "Ichi-go Ichi-e", ja: "一期一会" },
  { href: "/exv-builder", en: "EXV Builder", ja: "EXVビルダー" },
  { href: "/food-pairing", en: "Food Pairing", ja: "料理ペアリング" },
  { href: "/taste-profile", en: "Taste Profile", ja: "味覚プロフィール" },
];

const cultureLinks: SakeNavLink[] = [
  { href: "/microseasons", en: "72 Seasons", ja: "七十二候" },
  { href: "/wabi-sabi", en: "Wabi-Sabi", ja: "侘寂" },
  { href: "/sacred", en: "Sacred Sake", ja: "神酒" },
  { href: "/toji", en: "Toji Lineage", ja: "杜氏の系譜" },
  { href: "/kurabito", en: "Kurabito Diaries", ja: "蔵人の日記" },
  { href: "/gift", en: "Gift Protocol", ja: "贈答の作法" },
  { href: "/manifesto", en: "Anti-Score", ja: "アンチスコア" },
];

const placeLinks: SakeNavLink[] = [
  { href: "/prefectures", en: "Prefectures", ja: "産地" },
  { href: "/kyoto", en: "Kyoto Backstreets", ja: "京都裏路地" },
  { href: "/fushimi", en: "Fushimi", ja: "伏見" },
  { href: "/village", en: "Village Breweries", ja: "里の蔵元" },
  { href: "/water", en: "Water Atlas", ja: "水の地図" },
  { href: "/pilgrimage", en: "Pilgrimage", ja: "巡礼" },
  { href: "/terroir", en: "Terroir", ja: "テロワール" },
];

const ritualLinks: SakeNavLink[] = [
  { href: "/ceremony", en: "Ceremony", ja: "儀式" },
  { href: "/spiritual", en: "Spiritual Realms", ja: "霊的領域" },
  { href: "/home-izakaya", en: "Home Izakaya", ja: "自宅居酒屋" },
  { href: "/journal", en: "Journal", ja: "酒の日記" },
  { href: "/longevity-recipes", en: "Longevity Recipes", ja: "長寿のレシピ" },
];

export type SakeDropdownKey = "tools" | "knowledge" | "sensory" | "culture" | "place" | "ritual";

/** The six menus (Navigation.tsx `dropdowns`), in the app's order. */
export const sakeDropdowns: { key: SakeDropdownKey; en: string; ja: string; links: SakeNavLink[] }[] = [
  { key: "tools", en: "QPR & Tools", ja: "QPR＆ツール", links: toolsLinks },
  { key: "knowledge", en: "Knowledge", ja: "知識", links: knowledgeLinks },
  { key: "sensory", en: "Sensory", ja: "感覚", links: sensoryLinks },
  { key: "culture", en: "Culture", ja: "文化", links: cultureLinks },
  { key: "place", en: "Place", ja: "場所", links: placeLinks },
  { key: "ritual", en: "Ritual", ja: "作法", links: ritualLinks },
];

/** Phone bottom bar (BottomNav.tsx `navItems`). */
export const sakeBottomLinks: (SakeNavLink & { icon: LucideIcon })[] = [
  { href: "/", icon: Home, en: "Home", ja: "ホーム" },
  { href: "/ordering-guide", icon: Search, en: "Discover", ja: "発見" },
  { href: "/qpr", icon: ShoppingCart, en: "Shop", ja: "購入" },
  { href: "/favorites", icon: Heart, en: "Saved", ja: "保存" },
  { href: "/sake-quiz", icon: User, en: "Profile", ja: "プロフィール" },
];

export type SakeSearchEntry = {
  type: "sake" | "page" | "feature";
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;
  subtitleJa: string;
  href: string;
};

/**
 * GlobalSearch.tsx `PAGE_INDEX`, app paths. Fixed: the app's "QPR Rankings" entry pointed at
 * /qpr-rankings, a route that didn't exist (404); it now opens /qpr like the menu does.
 */
export const sakePageIndex: SakeSearchEntry[] = [
  { type: "page", id: "home", title: "Home", titleJa: "ホーム", subtitle: "Main page", subtitleJa: "メインページ", href: "/" },
  { type: "page", id: "collection", title: "The Collection", titleJa: "コレクション", subtitle: "All curated sakes", subtitleJa: "全キュレーション酒", href: "/collection" },
  { type: "page", id: "aroma", title: "Aroma Finder", titleJa: "香りの探索", subtitle: "Find sake by aroma", subtitleJa: "香りで日本酒を探す", href: "/aroma" },
  { type: "page", id: "rice", title: "Rice Encyclopedia", titleJa: "米の百科事典", subtitle: "Sake rice varieties", subtitleJa: "酒米の品種", href: "/rice" },
  { type: "page", id: "process", title: "The Sacred Process", titleJa: "聖なる工程", subtitle: "How sake is made", subtitleJa: "酒の造り方", href: "/process" },
  { type: "page", id: "prefectures", title: "Prefecture Map", titleJa: "産地マップ", subtitle: "Sake regions of Japan", subtitleJa: "日本の酒の産地", href: "/prefectures" },
  { type: "page", id: "microseasons", title: "72 Microseasons", titleJa: "七十二候", subtitle: "Seasonal sake guide", subtitleJa: "季節の酒ガイド", href: "/microseasons" },
  { type: "page", id: "wabi-sabi", title: "Wabi-Sabi Tasting", titleJa: "侘寂の味わい", subtitle: "Taste the imperfection", subtitleJa: "不完全を味わえ", href: "/wabi-sabi" },
  { type: "page", id: "vessels", title: "Vessels & Ceremony", titleJa: "器と儀式", subtitle: "Drinking vessels", subtitleJa: "酒器", href: "/vessels" },
  { type: "page", id: "kanji", title: "Kanji Decoder", titleJa: "漢字解読", subtitle: "Read sake labels", subtitleJa: "ラベルを読む", href: "/kanji" },
  { type: "page", id: "kyoto", title: "Kyoto Backstreets", titleJa: "京都裏路地", subtitle: "Hidden sake bars", subtitleJa: "隠れた酒バー", href: "/kyoto" },
  { type: "page", id: "water", title: "Water Atlas", titleJa: "水の地図", subtitle: "Sacred springs", subtitleJa: "聖なる湧き水", href: "/water" },
  { type: "page", id: "sacred", title: "Sacred Sake", titleJa: "神酒", subtitle: "Shinto offerings", subtitleJa: "神道の供え物", href: "/sacred" },
  { type: "page", id: "toji", title: "Toji Lineage", titleJa: "杜氏の系譜", subtitle: "Master brewer guilds", subtitleJa: "杜氏流派", href: "/toji" },
  { type: "page", id: "temperature", title: "Temperature Guide", titleJa: "温度帯", subtitle: "Serving temperatures", subtitleJa: "提供温度", href: "/temperature" },
  { type: "page", id: "aging", title: "Aging & Time", titleJa: "熟成と時間", subtitle: "Koshu aged sake", subtitleJa: "古酒", href: "/aging" },
  { type: "page", id: "yeast", title: "Yeast Strains", titleJa: "酵母", subtitle: "The invisible artist", subtitleJa: "見えない芸術家", href: "/yeast" },
  { type: "page", id: "manifesto", title: "Anti-Score Manifesto", titleJa: "アンチスコア", subtitle: "Why we reject 100-point scoring", subtitleJa: "なぜ100点評価を拒否するのか", href: "/manifesto" },
  { type: "page", id: "namazake", title: "Namazake", titleJa: "生酒", subtitle: "Unpasteurized sake", subtitleJa: "無殺菌酒", href: "/namazake" },
  { type: "page", id: "terroir", title: "Terroir", titleJa: "テロワール", subtitle: "Same grade, different soul", subtitleJa: "同じ等級、異なる魂", href: "/terroir" },
  { type: "page", id: "food-pairing", title: "Food Pairing", titleJa: "フードペアリング", subtitle: "What to eat with sake", subtitleJa: "酒に合う料理", href: "/food-pairing" },
  { type: "page", id: "subscription", title: "Subscription Box", titleJa: "サブスクリプション", subtitle: "Monthly curated sake", subtitleJa: "月刊キュレーション酒", href: "/subscription" },
  { type: "feature", id: "qpr", title: "QPR Rankings", titleJa: "QPRランキング", subtitle: "Quality-Price Ratio rankings", subtitleJa: "品質対価格比ランキング", href: "/qpr" },
  { type: "feature", id: "scanner", title: "Sake Scanner", titleJa: "酒スキャナー", subtitle: "AI label scanner", subtitleJa: "AIラベルスキャナー", href: "/sake-scanner" },
  { type: "feature", id: "deals", title: "Deal Alerts", titleJa: "ディールアラート", subtitle: "Price drop notifications", subtitleJa: "値下げ通知", href: "/deal-alerts" },
  { type: "feature", id: "retailers", title: "Retailer Finder", titleJa: "小売店検索", subtitle: "Find sake near you", subtitleJa: "近くの酒店を探す", href: "/retailer-finder" },
  { type: "feature", id: "taste-profile", title: "Taste Profile", titleJa: "味覚プロフィール", subtitle: "Discover your palate", subtitleJa: "あなたの味覚を発見", href: "/taste-profile" },
  { type: "feature", id: "favorites", title: "Favorites", titleJa: "お気に入り", subtitle: "Your saved sakes", subtitleJa: "保存した酒", href: "/favorites" },
];

/** Every static page of the app's router (App.tsx), app paths. Sake detail pages are separate. */
export const sakeRoutes = [
  "/",
  "/collection",
  "/rice",
  "/process",
  "/aroma",
  "/prefectures",
  "/microseasons",
  "/wabi-sabi",
  "/vessels",
  "/kanji",
  "/kyoto",
  "/ichigo-ichie",
  "/water",
  "/sacred",
  "/toji",
  "/kurabito",
  "/temperature",
  "/music",
  "/aging",
  "/yeast",
  "/defects",
  "/village",
  "/fushimi",
  "/pilgrimage",
  "/terroir",
  "/home-izakaya",
  "/journal",
  "/gift",
  "/smv-matrix",
  "/wine-translation",
  "/manifesto",
  "/namazake",
  "/exv",
  "/liquid-alchemy",
  "/exv-builder",
  "/longevity-recipes",
  "/sake-quiz",
  "/ceremony",
  "/spiritual",
  "/speaking",
  "/taste-profile",
  "/food-pairing",
  "/retailers",
  "/value-matrix",
  "/qpr",
  "/sake-scanner",
  "/menu-analyzer",
  "/sommelier-card",
  "/retailer-finder",
  "/supply-chain",
  "/ordering-guide",
  "/deal-alerts",
  "/subscription",
  "/my-reviews",
  "/compare",
  "/terms",
  "/privacy",
  "/dmca",
  "/producers",
  "/favorites",
] as const;

/**
 * Pages kept out of the sitemap: a visitor's own saved list and reviews (noindex), and /privacy and
 * /dmca, which show the same Terms page as /terms (their canonical points there).
 */
export const sakeUnlistedRoutes = ["/favorites", "/my-reviews", "/privacy", "/dmca"] as const;
