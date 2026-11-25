"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, Handshake, Store } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { guidePalette } from "@/components/sake/page-palettes";
import { sakeRetailers } from "@/lib/content/sake/education-data";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/Retailers.tsx (2026-11-26): "Where to Buy Sake", the
// partner offer, region and type filters, the retailer cards with their store links, and the
// affiliate disclosure. Same copy and colors (page-palettes.ts guidePalette). Changed:
// - "Apply for Partnership →" ends in a lucide arrow instead of the typed one (rule 18), and links to
//   /sake/producers inside the guide (the app's plain <a href="/producers">).
// - framer-motion: the hero fades up; the grid re-fades and cards stagger in on each filter change.
// - The app's `hover:${goldBg}` on the partner link was built from fragments and never applied; it's
//   a real hover wash now.
// - The filter rows wrap on phones and are labelled groups with pressed states.

const regions = ["all", "US West", "US East", "US Midwest", "US South", "Japan", "Europe", "Asia", "Online"] as const;
const types = ["all", "online", "physical", "both"] as const;

export function SakeRetailers() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [activeType, setActiveType] = useState<string>("all");
  const p = guidePalette(isAustere);

  const filtered = useMemo(
    () =>
      sakeRetailers.filter((r) => {
        if (activeRegion !== "all" && r.region !== activeRegion) return false;
        if (activeType !== "all" && r.type !== activeType) return false;
        return true;
      }),
    [activeRegion, activeType],
  );

  const typeLabel = (type: string) => {
    switch (type) {
      case "online":
        return t("Online", "オンライン");
      case "physical":
        return t("Physical", "実店舗");
      case "both":
        return t("Both", "両方");
      default:
        return type;
    }
  };

  const pill = (active: boolean) =>
    active
      ? `px-3 py-1.5 text-xs tracking-widest border rounded-sm transition-all ${p.activePill}`
      : `px-3 py-1.5 text-xs tracking-widest border rounded-sm transition-all ${p.idlePill}`;

  return (
    <div className={`min-h-screen ${p.page}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0d1321]/95 to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`flex items-center justify-center text-sm tracking-[0.4em] uppercase mb-4 ${p.gold}`}>
              <Store aria-hidden="true" className="size-4 inline mr-2" />
              {t("Curated Sources", "厳選された販売店")}
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t("Where to", "酒を")}
              <br />
              <span className={p.gold}>{t("Buy Sake", "買う場所")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${p.textMuted}`}>
              {t(
                "The best sake retailers in the world — vetted, ranked, and organized by region. Every link supports this guide through our partnership program.",
                "世界最高の酒販売店——審査、ランク付け、地域別に整理。すべてのリンクがパートナーシッププログラムを通じてこのガイドを支援します。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Partner offer */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className={`${p.card} border-2 ${p.goldBorder} rounded-sm p-8 text-center`}>
          <Handshake aria-hidden="true" className={`size-8 mx-auto mb-4 ${p.gold}`} />
          <h2 className={`text-xl font-light mb-2 ${p.gold}`}>{t("Become a Partner Retailer", "パートナー小売店になる")}</h2>
          <p className={`text-sm max-w-xl mx-auto mb-4 ${p.textMuted}`}>
            {t(
              "We drive passionate, educated sake buyers directly to your store. Our audience doesn't browse — they buy. Join our affiliate program and get featured in this directory with priority placement.",
              "情熱的で教育された酒の購入者を直接あなたの店に送ります。私たちのオーディエンスは閲覧しません——購入します。アフィリエイトプログラムに参加して、優先配置でこのディレクトリに掲載されましょう。",
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span className={`px-3 py-1 border rounded-sm ${p.goldBorder} ${p.gold}`}>{t("Featured Listing", "特集掲載")}</span>
            <span className={`px-3 py-1 border rounded-sm ${p.goldBorder} ${p.gold}`}>{t("Referral Tracking", "リファラル追跡")}</span>
            <span className={`px-3 py-1 border rounded-sm ${p.goldBorder} ${p.gold}`}>{t("Co-branded Content", "共同ブランドコンテンツ")}</span>
            <span className={`px-3 py-1 border rounded-sm ${p.goldBorder} ${p.gold}`}>{t("Priority Support", "優先サポート")}</span>
          </div>
          <Link
            href={sk("/producers")}
            className={
              isAustere
                ? "inline-flex items-center gap-1.5 mt-6 px-6 py-3 text-xs tracking-[0.2em] uppercase border rounded-sm transition-all border-red-800/30 text-red-800 hover:bg-red-800/10"
                : "inline-flex items-center gap-1.5 mt-6 px-6 py-3 text-xs tracking-[0.2em] uppercase border rounded-sm transition-all border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227]/10"
            }
          >
            {t("Apply for Partnership", "パートナーシップに申し込む")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t("Region", "地域")}>
            {regions.map((r) => (
              <button type="button" key={r} onClick={() => setActiveRegion(r)} aria-pressed={activeRegion === r} className={pill(activeRegion === r)}>
                {r === "all" ? t("All Regions", "全地域") : r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t("Store type", "店舗タイプ")}>
            {types.map((tp) => (
              <button type="button" key={tp} onClick={() => setActiveType(tp)} aria-pressed={activeType === tp} className={pill(activeType === tp)}>
                {tp === "all" ? t("All Types", "全タイプ") : typeLabel(tp)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Retailer grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className={`text-xs text-center mb-6 ${p.textMuted}`} aria-live="polite">
          {filtered.length} {t("retailers found", "件の販売店が見つかりました")}
        </div>

        <div key={`${activeRegion}-${activeType}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {filtered.map((retailer, i) => (
            <div
              key={retailer.name}
              className={`${p.card} border ${p.goldBorder} rounded-sm p-6 group transition-all animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className={`text-lg font-light group-hover:opacity-80 transition-opacity ${p.gold}`}>{retailer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe aria-hidden="true" className={`size-3 ${p.textMuted}`} />
                    <span className={`text-xs ${p.textMuted}`}>{retailer.location}</span>
                  </div>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 border rounded-sm ${p.goldBorder} ${p.gold}`}>{typeLabel(retailer.type)}</span>
              </div>

              <p className={`text-sm leading-relaxed mb-4 ${p.textMuted}`}>{t(retailer.specialtyEn, retailer.specialtyJa)}</p>

              {retailer.url && (
                <a
                  href={retailer.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`inline-flex items-center gap-2 text-xs hover:opacity-80 transition-opacity ${p.gold}`}
                  data-affiliate="sake-for-sakes-sake"
                  data-retailer={retailer.name}
                >
                  <ExternalLink aria-hidden="true" className="size-3" />
                  {t("Visit Store", "ストアを訪問")}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate disclosure */}
      <section className={isAustere ? "py-8 px-4 bg-stone-100" : "py-8 px-4 bg-[#0d1321]/50"}>
        <div className="max-w-3xl mx-auto text-center">
          <p className={`text-xs leading-relaxed ${p.textMuted}`}>
            {t(
              "Disclosure: Some links on this page are affiliate links. When you purchase through these links, Sake for Sake's Sake™ receives a small commission at no additional cost to you. This helps us maintain this free resource and continue creating the world's deepest sake guide. We only recommend retailers we genuinely trust.",
              "開示：このページの一部のリンクはアフィリエイトリンクです。これらのリンクを通じて購入すると、Sake for Sake's Sake™は追加費用なしで少額のコミッションを受け取ります。これにより、この無料リソースを維持し、世界で最も深い酒ガイドを作り続けることができます。私たちは本当に信頼できる販売店のみを推薦します。",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
