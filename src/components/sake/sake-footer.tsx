"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { CopyrightNotice } from "@/components/sake/content-protection";
import { SocialShare } from "@/components/sake/social-share";
import { useFavorites, useLanguage } from "@/components/sake/sake-providers";
import { sk } from "@/lib/content/sake/nav";

// The Sake app's GlobalFooter (client/src/components/GlobalFooter.tsx): the share row, the "N saved"
// link once anything is saved, and the copyright notice. Every app page rendered it at its end; here
// the /sake layout renders it once. The seven pages that passed their own share title and line keep
// them (SHARE_COPY); the rest share the app's default.

const SITE = "https://tonygreenberg.com";

const SHARE_COPY: Record<string, { title: [string, string]; description?: [string, string] }> = {
  "/compare": { title: ["Compare Sakes", "日本酒比較"] },
  "/collection": { title: ["The Collection", "コレクション"] },
  "/deal-alerts": {
    title: ["Deal Alerts", "セールアラート"],
    description: ["Sake price drop notifications and favorites tracking", "日本酒値下げ通知とお気に入り追跡"],
  },
  "/food-pairing": { title: ["Sake × Food Pairing Guide", "酒×料理ペアリングガイド"] },
  "/favorites": {
    title: ["My Favorites", "お気に入り"],
    description: ["My personal sake journey collection", "私の日本酒の旅コレクション"],
  },
  "/menu-analyzer": {
    title: ["Menu Analyzer", "メニューアナライザー"],
    description: ["Calculate restaurant sake markup vs retail pricing", "レストランの日本酒マークアップと小売価格を比較"],
  },
  "/retailer-finder": {
    title: ["Retailer Finder", "販売店ファインダー"],
    description: ["Find sake retailers near you by ZIP code", "ZIPコードで近くの日本酒販売店を見つける"],
  },
  "/retailers": { title: ["Where to Buy Sake", "酒を買う場所"] },
  "/speaking": { title: ["How to Speak Sake", "酒を語る方法"] },
  "/qpr": {
    title: ["QPR Rankings", "QPRランキング"],
    description: ["Quality-Price Ratio rankings for US-available sake", "米国で入手可能な日本酒の品質価格比ランキング"],
  },
  "/sake-scanner": {
    title: ["Sake Scanner", "酒スキャナー"],
    description: ["AI-powered sake bottle identification from photos", "AI搭載の写真からの日本酒ボトル識別"],
  },
  "/value-matrix": { title: ["Sake Value Matrix", "酒の価値マトリックス"] },
  "/taste-profile": { title: ["Your Sake Taste Profile", "あなたの味覚プロフィール"] },
  "/ordering-guide": {
    title: ["Sake Ordering Guide", "日本酒注文ガイド"],
    description: [
      "Five questions to your perfect sake. Restaurant integrity scoring. Carbon-conscious recommendations.",
      "完璧な酒への5つの質問。レストラン誠実度スコアリング。炭素意識の推薦。",
    ],
  },
  "/supply-chain": {
    title: ["Supply Chain Dollar Map", "サプライチェーン・ドルマップ"],
    description: [
      "Trace every dollar from rice paddy to glass. See the margins, measure the carbon, know the integrity.",
      "田んぼからグラスまですべてのドルを追跡。マージンを見て、炭素を測定し、誠実度を知る。",
    ],
  },
  "/sommelier-card": {
    title: ["Sommelier Card", "ソムリエカード"],
    description: [
      "Discover your sake personality and get a phrase for restaurant ordering",
      "酒の個性を発見し、レストランで注文するためのフレーズを取得",
    ],
  },
};

export function SakeFooter() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { count } = useFavorites();
  const appPath = pathname.replace(/^\/sake/, "") || "/";
  const copy = SHARE_COPY[appPath];

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SocialShare
            url={`${SITE}${pathname}`}
            title={copy ? t(...copy.title) : t("Sake for Sake's Sake", "酒のための酒")}
            description={
              copy?.description
                ? t(...copy.description)
                : t(
                    "The world's deepest sake guide. EXV™ scoring, 72 microseasons, namazake, and the soul of Japanese brewing.",
                    "世界で最も深い日本酒ガイド。EXV™スコアリング、七十二候、生酒、そして日本の醸造の魂。",
                  )
            }
          />

          {count > 0 && (
            <Link
              href={sk("/favorites")}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] tracking-[0.12em] uppercase transition-all duration-300 hover:scale-105 border-(--sk-accent-line) text-(--sk-fg-dim)"
            >
              <Heart aria-hidden="true" size={12} className="fill-(--sk-accent) stroke-(--sk-accent)" />
              <span>
                {count} {t("saved", "保存済み")}
              </span>
            </Link>
          )}
        </div>
      </div>

      <footer className="border-t transition-colors duration-500 border-(--sk-footer-border)">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <CopyrightNotice />
        </div>
      </footer>
    </>
  );
}
