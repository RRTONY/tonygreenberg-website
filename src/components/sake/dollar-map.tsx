"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Eye,
  Factory,
  Leaf,
  Ship,
  Store,
  Tag,
  User,
  UtensilsCrossed,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { tierClasses } from "@/components/sake/carbon-tier-classes";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { getCarbonTier, type SupplyChainMap } from "@/lib/content/sake/supply-chain-engine";

// Ported from the Sake Manus app's client/src/components/DollarMap.tsx (2026-11-26): the supply
// chain flow (one card per step from producer to consumer, dollars or carbon), "Where Your Dollar
// Goes" bar with its legend, and the restaurant path. Role and tier colors are precomposed class
// sets instead of inline colors. framer-motion: cards fade up 0.1s apart; the bars now ease to their
// width with a CSS transition (the app grew them from 0, which needs a per-value keyframe). Changed:
// the node cards are buttons (keyboard access, they say if they're open); the bar's hover tooltip is
// also each segment's accessible name.

type RoleClasses = { icon: string; text: string; bar: string };

const ROLE_ICONS: Record<string, LucideIcon> = {
  producer: Factory,
  brand: Tag,
  importer: Ship,
  distributor: Warehouse,
  retailer: Store,
  restaurant: UtensilsCrossed,
  consumer: User,
};

/** The app's roleColors (#22c55e, #84cc16, #3b82f6, #a855f7, #f97316, #ef4444, #e8e2d6) as classes. */
const ROLE: Record<string, RoleClasses> = {
  producer: { icon: "bg-[#22c55e]/12.5", text: "text-[#22c55e]", bar: "bg-[#22c55e]" },
  brand: { icon: "bg-[#84cc16]/12.5", text: "text-[#84cc16]", bar: "bg-[#84cc16]" },
  importer: { icon: "bg-[#3b82f6]/12.5", text: "text-[#3b82f6]", bar: "bg-[#3b82f6]" },
  distributor: { icon: "bg-[#a855f7]/12.5", text: "text-[#a855f7]", bar: "bg-[#a855f7]" },
  retailer: { icon: "bg-[#f97316]/12.5", text: "text-[#f97316]", bar: "bg-[#f97316]" },
  restaurant: { icon: "bg-[#ef4444]/12.5", text: "text-[#ef4444]", bar: "bg-[#ef4444]" },
  consumer: { icon: "bg-[#e8e2d6]/12.5", text: "text-[#e8e2d6]", bar: "bg-[#e8e2d6]" },
};
const TAX_BAR = "bg-[#6b7280]";

const TONES = {
  kintsugi: {
    cardBg: "bg-[#0d1321]/80",
    cardBorder: "border-[#1a2035]",
    textMain: "text-[#e8e2d6]",
    textMuted: "text-[#e8e2d6]/50",
    detailMain: "text-[#e8e2d6]/90",
    track: "bg-white/5",
    dollarOn: "bg-[#c9a227]/10 border-[#c9a227]/30 text-[#c9a227]",
    line: "bg-linear-to-r from-[oklch(0.78_0.12_85/0.3)] to-[oklch(0.78_0.12_85/0.1)]",
  },
  austere: {
    cardBg: "bg-stone-100",
    cardBorder: "border-stone-300",
    textMain: "text-stone-900",
    textMuted: "text-stone-500",
    detailMain: "text-stone-800",
    track: "bg-black/10",
    dollarOn: "bg-red-900/10 border-red-900/30 text-red-900",
    line: "bg-linear-to-r from-[oklch(0.52_0.19_30/0.3)] to-[oklch(0.52_0.19_30/0.1)]",
  },
};

type Tone = (typeof TONES)["kintsugi"];

export function DollarMap({
  supplyChain,
  showRestaurant = true,
  compact = false,
}: {
  supplyChain: SupplyChainMap;
  showRestaurant?: boolean;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const c: Tone = TONES[isAustere ? "austere" : "kintsugi"];
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [showCarbon, setShowCarbon] = useState(false);

  const displayNodes = useMemo(
    () => supplyChain.nodes.filter((n) => !(n.role === "restaurant" && !showRestaurant)),
    [supplyChain.nodes, showRestaurant],
  );

  const totalCarbon = getCarbonTier(supplyChain.totalCarbonKg);
  const transparency = displayNodes.length
    ? Math.round(displayNodes.reduce((s, n) => s + n.transparencyScore, 0) / displayNodes.length)
    : 0;

  const segments = [
    { label: t("Producer", "生産者"), pct: supplyChain.producerShare, bar: ROLE.producer.bar },
    { label: t("Brand", "ブランド"), pct: supplyChain.brandShare, bar: ROLE.brand.bar },
    { label: t("Tax/Duty", "税/関税"), pct: supplyChain.taxAndDuty, bar: TAX_BAR },
    { label: t("Importer", "輸入業者"), pct: supplyChain.importerShare, bar: ROLE.importer.bar },
    { label: t("Distributor", "卸売"), pct: supplyChain.distributorShare, bar: ROLE.distributor.bar },
    { label: t("Retailer", "小売"), pct: supplyChain.retailerShare, bar: ROLE.retailer.bar },
  ];

  return (
    <div className="w-full">
      {!compact && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            c={c}
            icon={<DollarSign aria-hidden="true" size={16} />}
            label={t("Retail Price", "小売価格")}
            value={`$${supplyChain.totalRetailPrice}`}
            sublabel={t(`Producer gets ${supplyChain.producerShare}%`, `生産者に${supplyChain.producerShare}%`)}
          />
          <StatCard
            c={c}
            icon={<Leaf aria-hidden="true" size={16} />}
            label={t("Carbon Footprint", "カーボンフットプリント")}
            value={`${supplyChain.totalCarbonKg} kg`}
            sublabel={t(totalCarbon.tier, totalCarbon.tierJa)}
            valueClass={tierClasses(totalCarbon.color).text}
          />
          <StatCard
            c={c}
            icon={<Clock aria-hidden="true" size={16} />}
            label={t("Days in Chain", "チェーン日数")}
            value={`${supplyChain.totalDaysFromOrigin}`}
            sublabel={t("Origin to glass", "産地からグラスまで")}
          />
          <StatCard
            c={c}
            icon={<Eye aria-hidden="true" size={16} />}
            label={t("Transparency", "透明性")}
            value={`${transparency}%`}
            sublabel={t("Avg across chain", "チェーン平均")}
          />
        </div>
      )}

      {/* Dollar View vs Carbon View */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          aria-pressed={!showCarbon}
          onClick={() => setShowCarbon(false)}
          className={`inline-flex items-center px-3 py-1.5 text-xs tracking-widest uppercase border transition-all duration-300 ${
            !showCarbon ? c.dollarOn : `${c.cardBg} ${c.cardBorder} ${c.textMuted}`
          }`}
        >
          <DollarSign aria-hidden="true" size={12} className="mr-1" />
          {t("Dollar Flow", "ドルフロー")}
        </button>
        <button
          type="button"
          aria-pressed={showCarbon}
          onClick={() => setShowCarbon(true)}
          className={`inline-flex items-center px-3 py-1.5 text-xs tracking-widest uppercase border transition-all duration-300 ${
            showCarbon ? "bg-green-500/10 border-green-500/30 text-green-500" : `${c.cardBg} ${c.cardBorder} ${c.textMuted}`
          }`}
        >
          <Leaf aria-hidden="true" size={12} className="mr-1" />
          {t("Carbon Journey", "カーボンの旅")}
        </button>
      </div>

      {/* Flow */}
      <div className="relative">
        <div className={`hidden md:block absolute top-1/2 left-0 right-0 h-px ${c.line}`} />
        <div className={compact ? "grid gap-3 grid-cols-3 md:grid-cols-6" : "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"}>
          {displayNodes.map((node, i) => {
            const Icon = ROLE_ICONS[node.role] || Factory;
            const role = ROLE[node.role] ?? ROLE.producer;
            const isExpanded = expandedNode === node.id;
            const dollarWidth = Math.max(20, (node.marginDollars / supplyChain.totalRetailPrice) * 100);
            const carbonWidth = supplyChain.totalCarbonKg > 0 ? Math.max(20, (node.carbonKg / supplyChain.totalCarbonKg) * 100) : 20;
            const nodeTier = tierClasses(getCarbonTier(node.carbonKg).color);
            return (
              <button
                type="button"
                key={node.id}
                aria-expanded={isExpanded}
                onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                style={{ animationDelay: `${i * 0.1}s` }}
                className={`relative block w-full text-left ${c.cardBg} border ${c.cardBorder} p-3 transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
              >
                <span className="flex items-center gap-2 mb-2">
                  <span className={`size-8 rounded-full flex items-center justify-center shrink-0 ${role.icon}`}>
                    <Icon aria-hidden="true" size={14} className={role.text} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[10px] tracking-widest uppercase ${c.textMuted}`}>{t(node.label, node.labelJa || node.label)}</span>
                    {node.entity && (
                      <span className={`block text-xs font-medium truncate ${c.textMain}`}>{t(node.entity, node.entityJa || node.entity)}</span>
                    )}
                  </span>
                </span>

                {!showCarbon ? (
                  <span className="block mb-2">
                    <span className={`block text-lg font-bold ${c.textMain}`}>${node.dollarOut.toFixed(2)}</span>
                    <span className="flex items-center gap-1">
                      <span className={`flex-1 h-1.5 rounded-full overflow-hidden ${c.track}`}>
                        <span
                          className={`block h-full rounded-full transition-[width] duration-600 ${role.bar}`}
                          style={{ width: `${dollarWidth}%` }}
                        />
                      </span>
                      <span className={`text-[10px] font-mono ${role.text}`}>{node.margin}%</span>
                    </span>
                    <span className={`block text-[10px] mt-1 ${c.textMuted}`}>
                      +${node.marginDollars.toFixed(2)} {t("margin", "マージン")}
                    </span>
                  </span>
                ) : (
                  <span className="block mb-2">
                    <span className={`block text-lg font-bold ${nodeTier.text}`}>{node.carbonKg.toFixed(2)} kg</span>
                    <span className="flex items-center gap-1">
                      <span className={`flex-1 h-1.5 rounded-full overflow-hidden ${c.track}`}>
                        <span
                          className={`block h-full rounded-full transition-[width] duration-600 ${nodeTier.bar}`}
                          style={{ width: `${carbonWidth}%` }}
                        />
                      </span>
                    </span>
                    <span className={`block text-[10px] mt-1 ${c.textMuted}`}>{node.carbonSource.split(",")[0]}</span>
                  </span>
                )}

                <span className={`flex items-center justify-center ${c.textMuted}`}>
                  {isExpanded ? <ChevronUp aria-hidden="true" size={12} /> : <ChevronDown aria-hidden="true" size={12} />}
                </span>

                {isExpanded && (
                  <span className={`block mt-3 pt-3 border-t ${c.cardBorder} space-y-2 animate-in fade-in duration-300`}>
                    {node.location && <DetailRow c={c} label={t("Location", "場所")} value={t(node.location, node.locationJa || node.location)} />}
                    <DetailRow c={c} label={t("Cost In", "仕入れ")} value={`$${node.dollarIn.toFixed(2)}`} />
                    <DetailRow c={c} label={t("Price Out", "販売価格")} value={`$${node.dollarOut.toFixed(2)}`} />
                    <DetailRow c={c} label={t("Margin", "マージン")} value={`${node.margin}% ($${node.marginDollars.toFixed(2)})`} />
                    <DetailRow c={c} label={t("Carbon", "炭素")} value={`${node.carbonKg.toFixed(2)} kg CO₂`} />
                    <DetailRow c={c} label={t("Days", "日数")} value={`${node.daysInChain}`} />
                    <DetailRow c={c} label={t("Transparency", "透明性")} value={`${node.transparencyScore}/100`} />
                    <span className={`block text-[10px] leading-relaxed mt-2 ${c.textMuted}`}>{t(node.notes, node.notesJa || node.notes)}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dollar Allocation Bar */}
      <div className="mt-6">
        <div className={`text-[10px] tracking-[0.15em] uppercase mb-2 ${c.textMuted}`}>{t("Where Your Dollar Goes", "あなたの1ドルの行き先")}</div>
        <div className="flex h-8 rounded-sm overflow-hidden">
          {segments.map((seg) => {
            const tip = `${seg.label}: ${seg.pct}% ($${((seg.pct / 100) * supplyChain.totalRetailPrice).toFixed(2)})`;
            return (
              <div
                key={seg.bar + seg.label}
                role="img"
                aria-label={tip}
                title={`${seg.label}: ${seg.pct}%`}
                className={`relative group flex items-center justify-center overflow-hidden transition-[width] duration-600 ${seg.bar}`}
                style={{ width: `${Math.max(seg.pct, 2)}%` }}
              >
                {seg.pct > 8 && <span className="text-[9px] font-mono text-white/90 truncate px-1">{seg.pct}%</span>}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {segments.map((item) => (
            <div key={item.bar + item.label} className="flex items-center gap-1">
              <span className={`size-2 rounded-full ${item.bar}`} />
              <span className={`text-[10px] ${c.textMuted}`}>
                {item.label} {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant path */}
      {showRestaurant && supplyChain.restaurantMarkup && (
        <div className={`mt-4 p-3 border ${c.cardBorder} ${c.cardBg}`}>
          <div className={`flex items-center text-[10px] tracking-[0.15em] uppercase mb-2 ${c.textMuted}`}>
            <UtensilsCrossed aria-hidden="true" size={12} className="mr-1" />
            {t("Restaurant Path", "レストランルート")}
          </div>
          <div className="flex items-center gap-3">
            <div>
              <div className={`text-xs ${c.textMuted}`}>{t("Restaurant markup", "レストランマークアップ")}</div>
              <div className={`text-xl font-bold ${ROLE.restaurant.text}`}>{supplyChain.restaurantMarkup}x</div>
            </div>
            <div className="flex-1 h-6 rounded-sm overflow-hidden flex">
              <div
                className={`flex items-center justify-center text-[9px] font-mono text-white/90 ${ROLE.distributor.bar}`}
                style={{ width: `${100 - (supplyChain.restaurantShare || 0)}%` }}
              >
                {t("Cost", "原価")}
              </div>
              <div
                className={`flex items-center justify-center text-[9px] font-mono text-white/90 ${ROLE.restaurant.bar}`}
                style={{ width: `${supplyChain.restaurantShare || 0}%` }}
              >
                {t("Margin", "マージン")} {supplyChain.restaurantShare}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  c,
  icon,
  label,
  value,
  sublabel,
  valueClass,
}: {
  c: Tone;
  icon: ReactNode;
  label: string;
  value: string;
  sublabel: string;
  valueClass?: string;
}) {
  return (
    <div className={`${c.cardBg} border ${c.cardBorder} p-3`}>
      <div className={`flex items-center gap-1.5 mb-1 ${c.textMuted}`}>
        {icon}
        <span className="text-[10px] tracking-widest uppercase">{label}</span>
      </div>
      <div className={`text-xl font-bold ${valueClass ?? c.textMain}`}>{value}</div>
      <div className={`text-[10px] ${c.textMuted}`}>{sublabel}</div>
    </div>
  );
}

function DetailRow({ c, label, value }: { c: Tone; label: string; value: string }) {
  return (
    <span className="flex justify-between items-center gap-2">
      <span className={`text-[10px] ${c.textMuted}`}>{label}</span>
      <span className={`text-[10px] font-mono text-right ${c.detailMain}`}>{value}</span>
    </span>
  );
}
