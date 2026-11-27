"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRightLeft,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Compass,
  Droplets,
  Flame,
  FlaskConical,
  Gift,
  Heart,
  Home as HomeIcon,
  Languages,
  MapPin,
  Microscope,
  Mountain,
  Music2,
  Pen,
  Route,
  ScatterChart,
  Search,
  Sparkles,
  Timer,
  Users,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import { SakeImage } from "@/components/sake/sake-image";
import { SakeOfSeason } from "@/components/sake/sake-of-season";
import { SakeQuizHero } from "@/components/sake/sake-quiz-hero/sake-quiz-hero";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { sakeImages } from "@/lib/content/sake/images";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/Home.tsx (2026-11-26): full-screen hero, the 60-second
// quiz, Sake of the Season, the "Be the Glitch" manifesto, EVI/EEI, and the three card grids.
// Changed:
// - The colors the app picked per look were inline styles written with Tailwind's underscore syntax
//   (`oklch(0.78_0.12_85)`), which browsers reject, so on the live app most of them never showed
//   (cards had no fill, headings fell back to the page color). They're the intended colors here, as
//   classes that switch with the Austere look (rule 20).
// - The hero and brewing photos are gone from Manus; SakeImage shows the app's ink-wash stand-in
//   until they're in Sanity (src/lib/content/sake/images.ts).
// - The footer share row and copyright now come from the /sake layout (SakeFooter).
// - The app imported useAuth, SocialShare and CopyrightNotice here but never used them; dropped.
// - framer-motion: on-mount entrances are tw-animate classes, scroll entrances <Reveal>, and the
//   bobbing scroll line is Tailwind's bounce.

type Card = { href: string; icon: LucideIcon; en: string; ja: string; descEn: string; descJa: string };

export const adventureCards: Card[] = [
  { href: "/collection", icon: Sparkles, en: "The Collection", ja: "コレクション", descEn: "The most esoteric, mind-bending bottles that speak to the soul. Scored by EVI and EEI.", descJa: "魂に語りかける、最も難解で衝撃的な瓶の数々。EVIとEEIで評価。" },
  { href: "/aroma", icon: Search, en: "Aroma Finder", ja: "香りの探索", descEn: "Smell melon? Wet stone? Cherry blossom? Discover which sake speaks to your nose.", descJa: "メロン？濡れた石？桜？あなたの鼻に語りかける日本酒を発見。" },
  { href: "/rice", icon: BookOpen, en: "Rice Encyclopedia", ja: "米の百科事典", descEn: "8 legendary varieties. Centuries of cultivation. The living library of grains.", descJa: "8つの伝説的品種。何世紀もの栽培。穀物の生きた図書館。" },
  { href: "/process", icon: FlaskConical, en: "The Sacred Process", ja: "聖なる工程", descEn: "Eight stages. Centuries of wisdom. The alchemy of rice, water, and time.", descJa: "8つの段階。何世紀もの知恵。米と水と時間の錬金術。" },
  { href: "/prefectures", icon: MapPin, en: "Prefecture Map", ja: "産地マップ", descEn: "From Niigata's snow country to Saga's warmth. The terroir of sake.", descJa: "新潟の雪国から佐賀の温暖な地まで。日本酒のテロワール。" },
];

export const deepCards: Card[] = [
  { href: "/ichigo-ichie", icon: Timer, en: "Ichi-go Ichi-e", ja: "一期一会", descEn: "One moment, one meeting. Unrepeatable sake pairings.", descJa: "一期一会。再現不可能なペアリング。" },
  { href: "/water", icon: Droplets, en: "Water Atlas", ja: "水の地図", descEn: "Sake is 80% water. Map the sacred springs.", descJa: "酒は80%が水。聖なる湧き水の地図。" },
  { href: "/sacred", icon: Flame, en: "Sacred Sake", ja: "神酒", descEn: "Doburoku, Shinto offerings, the forbidden chapter.", descJa: "どぶろく、神道の供え物、禁じられた章。" },
  { href: "/toji", icon: Users, en: "Toji Lineage", ja: "杜氏の系譜", descEn: "Five master brewer guilds. The DNA of your glass.", descJa: "五つの杜氏流派。あなたの杯のDNA。" },
  { href: "/kurabito", icon: Clock, en: "Kurabito Diaries", ja: "蔵人の日記", descEn: "The monastic life. 4am silence. The monks of sake.", descJa: "修道生活。午前4時の静寂。酒の僧侶たち。" },
  { href: "/temperature", icon: Sparkles, en: "Temperature", ja: "温度帯", descEn: "10+ named temperature points.", descJa: "10以上の名前付き温度帯。" },
  { href: "/music", icon: Music2, en: "Music Pairing", ja: "音楽ペアリング", descEn: "Daiginjo with Sakamoto. Synesthesia in a glass.", descJa: "大吟醸に坂本龍一。杯の中の共感覚。" },
  { href: "/aging", icon: Clock, en: "Aging & Time", ja: "熟成と時間", descEn: "Koshu. What happens when time does the brewing.", descJa: "古酒。時間に醸造を任せると。" },
  { href: "/yeast", icon: Microscope, en: "Yeast Strains", ja: "酵母", descEn: "The invisible artist painting flavor universes.", descJa: "見えない芸術家。味わいの宇宙を描く。" },
  { href: "/defects", icon: AlertTriangle, en: "Off-Flavors", ja: "欠陥", descEn: "Know your flaws. When sake goes wrong.", descJa: "欠点を知れ。酒がおかしくなった時。" },
  { href: "/village", icon: Mountain, en: "Village Breweries", ja: "里の蔵元", descEn: "Tiny 1-3 person operations. The soul of craft.", descJa: "1～3人の小さな蔵。クラフトの魂。" },
  { href: "/fushimi", icon: Building2, en: "Fushimi", ja: "伏見", descEn: "Kyoto's hidden sake heart.", descJa: "京都の隠れた酒の心臓。" },
  { href: "/pilgrimage", icon: Route, en: "Pilgrimage", ja: "巡礼", descEn: "Multi-day journeys through sake country.", descJa: "酒の国を巡る数日間の旅。" },
  { href: "/terroir", icon: ArrowLeftRight, en: "Terroir", ja: "テロワール", descEn: "Same grade, different soul.", descJa: "同じ等級、異なる魂。" },
  { href: "/home-izakaya", icon: HomeIcon, en: "Home Izakaya", ja: "自宅居酒屋", descEn: "Transform your kitchen into a Kyoto bar.", descJa: "キッチンを京都のバーに。" },
  { href: "/journal", icon: Pen, en: "Sake Journal", ja: "酒の日記", descEn: "Remember moments, not scores.", descJa: "点数ではなく瞬間を記憶する。" },
  { href: "/gift", icon: Gift, en: "Gift Protocol", ja: "贈答の作法", descEn: "A bottle becomes a message.", descJa: "瓶がメッセージになる。" },
  { href: "/smv-matrix", icon: ScatterChart, en: "SMV Matrix", ja: "日本酒度マトリクス", descEn: "Hidden style families in the numbers.", descJa: "数字から隠れたスタイルが浮かぶ。" },
  { href: "/wine-translation", icon: ArrowRightLeft, en: "Sake ↔ Wine", ja: "日本酒↔ワイン", descEn: "A bridge between two worlds.", descJa: "二つの世界の架け橋。" },
  { href: "/manifesto", icon: Flame, en: "Anti-Score", ja: "アンチスコア", descEn: "Why we reject 100-point scoring.", descJa: "なぜ100点評価を拒否するのか。" },
];

export const cultureCards: Card[] = [
  { href: "/microseasons", icon: Calendar, en: "72 Microseasons", ja: "七十二候", descEn: "Japan has 72 seasons, not 4. What to drink right now.", descJa: "日本には七十二候がある。今何を飲むか。" },
  { href: "/wabi-sabi", icon: Heart, en: "Wabi-Sabi Tasting", ja: "侘寂の味わい", descEn: "Taste the imperfection. Seven principles for the soul.", descJa: "不完全を味わえ。魂のための七つの原則。" },
  { href: "/vessels", icon: Wine, en: "Vessels & Ceremony", ja: "器と儀式", descEn: "The cup shapes the soul. Each vessel changes everything.", descJa: "器が魂を形作る。各器がすべてを変える。" },
  { href: "/kanji", icon: Languages, en: "Kanji Decoder", ja: "漢字解読", descEn: "Your Rosetta Stone for sake labels.", descJa: "日本酒ラベルのロゼッタストーン。" },
  { href: "/kyoto", icon: Compass, en: "Kyoto Backstreets", ja: "京都裏路地", descEn: "The Kyoto they don't show you.", descJa: "観光客が知らない京都。" },
];

// The app's JS-picked colors (Kintsugi value first, Austere after the variant).
const FG = "text-[oklch(0.96_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_SOFT = "text-[oklch(0.75_0.01_85)] [.sake-austere_&]:text-[oklch(0.35_0.01_60)]";
const FG_MUTED = "text-[oklch(0.65_0.01_85)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";
const CARD =
  "bg-[oklch(0.16_0.03_270)] border-[oklch(0.28_0.04_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";
const CULTURE_CARD =
  "bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] [.sake-austere_&]:bg-[oklch(0.93_0.006_80)] [.sake-austere_&]:border-[oklch(0.85_0.008_80)]";
const DEEP_CARD =
  "bg-[oklch(0.13_0.02_270)] border-[oklch(0.2_0.03_270)] [.sake-austere_&]:bg-[oklch(0.93_0.006_80)] [.sake-austere_&]:border-[oklch(0.85_0.008_80)]";
const CRIMSON = "text-[oklch(0.45_0.18_25)] [.sake-austere_&]:text-[oklch(0.52_0.19_30)]";
const HEADING = `font-sk-display font-bold [.sake-austere_&]:font-light text-4xl sm:text-5xl lg:text-6xl ${FG}`;
const CARD_HEADING = `font-sk-display font-bold [.sake-austere_&]:font-light text-xl mb-3 tracking-wide ${FG}`;

const SECTION_TITLE_ENTER = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both";

export function SakeHome() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        {isAustere ? (
          <div className="absolute inset-0 bg-[oklch(0.95_0.008_80)]">
            <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.92_0.006_80)] to-[oklch(0.95_0.008_80)]" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <SakeImage image={sakeImages.hero} priority className="w-full h-full object-cover hero-image" />
            <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.10_0.03_270/0.6)] via-[oklch(0.10_0.03_270/0.4)] to-[oklch(0.12_0.025_270)]" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-[30px] duration-1200 fill-mode-both">
            <h1
              className={`font-sk-display leading-none font-bold tracking-[0.05em] [.sake-austere_&]:font-thin! [.sake-austere_&]:tracking-[0.4em]! ${FG}`}
            >
              <span className={isAustere ? "text-7xl sm:text-8xl md:text-9xl" : "text-6xl sm:text-7xl md:text-8xl lg:text-9xl"}>
                {t("SAKE", "酒")}
              </span>
            </h1>
            <div className="font-sk-display mt-2 tracking-[0.3em] font-normal text-(--sk-accent) [.sake-austere_&]:tracking-[0.5em] [.sake-austere_&]:font-light">
              <span className={isAustere ? "text-xs sm:text-sm" : "text-lg sm:text-xl md:text-2xl uppercase"}>
                {isAustere ? t("for sake's sake", "のためだけの酒") : t("for Sake's Sake", "のためだけの酒")}
              </span>
            </div>
          </div>

          <p className="font-sk-display mt-8 max-w-xl text-lg sm:text-xl italic leading-relaxed font-normal text-[oklch(0.85_0.01_85/0.9)] [.sake-austere_&]:font-light [.sake-austere_&]:text-[oklch(0.45_0.01_60)] animate-in fade-in duration-1000 delay-600 fill-mode-both">
            {t(
              "What enters the mouth must speak to the mind and stay with the heart.",
              "口に入るものは心に語りかけ、魂に留まらなければならない。",
            )}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-800 delay-1000 fill-mode-both">
            <Link
              href={sk("/aroma")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-500 border bg-(--sk-accent)/15 border-(--sk-accent)/40 ${FG}`}
            >
              <Search aria-hidden="true" size={16} className="text-(--sk-accent)" />
              {t("Find Your Sake by Aroma", "香りで日本酒を探す")}
            </Link>
            <Link
              href={sk("/collection")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-500 border border-(--sk-accent)/20 text-(--sk-accent)"
            >
              {t("Explore the Collection", "コレクションを探索")}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-500 delay-2000 fill-mode-both" aria-hidden="true">
          <div className="w-px h-12 bg-linear-to-b from-(--sk-accent)/50 to-transparent motion-safe:animate-bounce" />
        </div>
      </section>

      <div className="kintsugi-line" />

      <SakeQuizHero />

      <div className="kintsugi-line" />

      <section className="py-12 lg:py-16">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <SakeOfSeason />
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Manifesto */}
      <section className="relative py-24 lg:py-32 overflow-hidden grain-overlay">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={
              isAustere
                ? "grid lg:grid-cols-1 max-w-3xl mx-auto gap-12 lg:gap-20 items-center"
                : "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            }
          >
            <Reveal enter="animate-in fade-in slide-in-from-left-[30px] duration-800 fill-mode-both">
              <h2 className={`${HEADING} leading-tight`}>
                {t("Be the", "なれ、")} <span className="gold-shimmer">{t("Glitch", "異端")}</span>
              </h2>
              <div className={`mt-8 space-y-5 leading-relaxed text-base sm:text-lg ${FG_SOFT}`}>
                <p>
                  {t(
                    "This is not a guide to the 'Dom Pérignon of Sake.' We have zero interest in the ordinary, the predictable, or whatever your sommelier recommends.",
                    "これは「日本酒のドン・ペリニヨン」ガイドではない。平凡なもの、予測可能なもの、ソムリエが勧めるものには一切興味がない。",
                  )}
                </p>
                <p>
                  {t(
                    "We're here for the glitches — the wild rice varieties, the wooden tank fermentations, the toji who'd rather close their brewery than use a machine.",
                    "私たちは異端を求める — 野生の米品種、木桶仕込み、機械を使うくらいなら蔵を閉めるという杜氏。",
                  )}
                </p>
                <p>
                  {t(
                    "We're here for the bottles that give your palate an existential crisis, tell stories you wouldn't believe, and feel like a rupture in the matrix of mass-produced spirits.",
                    "私たちは、あなたの味覚に実存的危機を与え、信じられない物語を語り、大量生産の酒のマトリックスに亀裂を入れるような瓶を求めている。",
                  )}
                </p>
              </div>
            </Reveal>

            {!isAustere && (
              <Reveal enter="animate-in fade-in slide-in-from-right-[30px] duration-800 fill-mode-both" delay={0.2} className="relative">
                <div className="relative overflow-hidden rounded-sm">
                  <SakeImage image={sakeImages.brewing} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full aspect-4/3 object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.12_0.025_270/0.5)] to-transparent" />
                </div>
                <div className="absolute -top-2 -right-2 size-24 border-t-2 border-r-2 border-[oklch(0.78_0.12_85/0.3)]" />
                <div className="absolute -bottom-2 -left-2 size-24 border-b-2 border-l-2 border-[oklch(0.78_0.12_85/0.3)]" />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* EVI / EEI */}
      <section className="py-24 lg:py-32">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter={SECTION_TITLE_ENTER} className="text-center mb-16">
            <h2 className={HEADING}>
              {t("Two Ways to Measure", "二つの尺度で")} <span className="gold-shimmer">{t("Magic", "魔法を測る")}</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                code: "EVI",
                en: "Extraordinary Value Index",
                ja: "驚異的価値指数",
                circle: "bg-(--sk-accent)/15",
                text: "text-(--sk-accent)",
                descEn: "Maximum bang for your weirdness buck. Esoteric bottles that won't bankrupt you but punch way above their weight.",
                descJa: "あなたの冒険心に最大のリターン。破産せずに複雑さと魂で重量級のパンチを繰り出す難解な瓶。",
              },
              {
                code: "EEI",
                en: "Extraordinary Experience Index",
                ja: "驚異的体験指数",
                circle: "bg-[oklch(0.55_0.18_25/0.15)] [.sake-austere_&]:bg-[oklch(0.35_0.01_60/0.15)]",
                text: "text-[oklch(0.55_0.18_25)] [.sake-austere_&]:text-[oklch(0.35_0.01_60)]",
                descEn: "Pure intensity. The most mind-bending, heart-touching bottles, regardless of price.",
                descJa: "純粋な強度。価格に関係なく、最も衝撃的で心に触れる瓶。",
              },
            ].map((item, i) => (
              <Reveal
                key={item.code}
                enter={SECTION_TITLE_ENTER}
                delay={i * 0.1}
                className={`relative p-8 border transition-all duration-500 group ${CARD}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`size-14 shrink-0 rounded-full flex items-center justify-center ${item.circle}`}>
                    <span className={`font-mono text-lg font-bold ${item.text}`}>{item.code}</span>
                  </div>
                  <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-2xl ${FG}`}>{t(item.en, item.ja)}</h3>
                </div>
                <p className={`leading-relaxed ${FG_SOFT}`}>{t(item.descEn, item.descJa)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Choose Your Adventure */}
      <section className="py-24 lg:py-32">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter={SECTION_TITLE_ENTER} className="text-center mb-16">
            <h2 className={HEADING}>
              {t("Choose Your", "あなたの")} <span className="gold-shimmer">{t("Adventure", "冒険を選べ")}</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adventureCards.map((card, i) => (
              <Reveal key={card.href} enter={SECTION_TITLE_ENTER} delay={i * 0.1}>
                <Link href={sk(card.href)} className={`block group relative p-6 border transition-all duration-500 h-full ${CARD}`}>
                  <card.icon aria-hidden="true" size={28} className="mb-4 text-(--sk-accent) group-hover:scale-110 transition-transform duration-300" />
                  <h3 className={CARD_HEADING}>{t(card.en, card.ja)}</h3>
                  <p className={`text-sm leading-relaxed ${FG_MUTED}`}>{t(card.descEn, card.descJa)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* The Deep Culture */}
      <section className="py-24 lg:py-32">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter={SECTION_TITLE_ENTER} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-mono text-(--sk-accent)">{t("Beyond the Bottle", "瓶の向こう側")}</p>
            <h2 className={HEADING}>
              {t("The Deep", "深き")} <span className="gold-shimmer">{t("Culture", "文化")}</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cultureCards.map((card, i) => (
              <Reveal key={card.href} enter={SECTION_TITLE_ENTER} delay={i * 0.08}>
                <Link href={sk(card.href)} className={`block group relative p-6 border transition-all duration-500 h-full ${CULTURE_CARD}`}>
                  <card.icon aria-hidden="true" size={24} className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${CRIMSON}`} />
                  <h3 className={CARD_HEADING}>{t(card.en, card.ja)}</h3>
                  <p className="text-sm leading-relaxed text-[oklch(0.6_0.01_85)] [.sake-austere_&]:text-[oklch(0.50_0.008_60)]">
                    {t(card.descEn, card.descJa)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* The Deeper Layers */}
      <section className="py-24 lg:py-32">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter={SECTION_TITLE_ENTER} className="text-center mb-16">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${CRIMSON}`}>
              {t("Esoteric · Sensory · Place · Ritual · Knowledge", "神秘 · 感覚 · 場所 · 作法 · 知識")}
            </p>
            <h2 className={HEADING}>
              {t("The Deeper", "さらに深く")} <span className="gold-shimmer">{t("Layers", "層へ")}</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deepCards.map((card, i) => (
              <Reveal key={card.href} enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both" delay={i * 0.04}>
                <Link href={sk(card.href)} className={`block group relative p-5 border transition-all duration-500 h-full ${DEEP_CARD}`}>
                  <card.icon
                    aria-hidden="true"
                    size={20}
                    className="mb-3 text-(--sk-accent) opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                  <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-normal text-base mb-2 tracking-wide ${FG}`}>{t(card.en, card.ja)}</h3>
                  <p className={`text-xs leading-relaxed ${FG_MUTED}`}>{t(card.descEn, card.descJa)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
