"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Droplets, Info, ShoppingBag, Star, Thermometer, Wine } from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { pairingMatrix, vesselGuides } from "@/lib/content/sake/vessels-data";

// Ported from the Sake Manus app's client/src/pages/Vessels.tsx (2026-11-26): the six-vessel
// guidebook, the accordion of sections per vessel, the connoisseur note and the pairing matrix.
// The data moved to src/lib/content/sake/vessels-data.ts unchanged. framer-motion in CSS: the
// vessel detail re-enters with a fade + 15px rise when a vessel is picked (the app's
// AnimatePresence swap), sections reveal on scroll. Changed: the accordion keeps every section's
// text in the page (hidden while closed) so the copy is in the server HTML, and the buttons say
// whether they're open; the app's page-end "酒" footer stays above the shared footer as it was.

export function SakeVessels() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const [activeVessel, setActiveVessel] = useState<string>("ochoko");
  const [expandedSection, setExpandedSection] = useState<string>("description");

  const active = vesselGuides.find((v) => v.id === activeVessel) || vesselGuides[0];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-12 sm:py-20">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className="text-xs tracking-[0.3em] uppercase text-[oklch(0.78_0.12_85)] mb-4 font-mono">
              {t("器の手引書 — The Vessel Guidebook", "器の手引書")}
            </p>
            <h1 className="font-sk-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              {t("The Cup Shapes", "器が形作る")} <span className="gold-shimmer">{t("the Soul", "魂を")}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-muted-foreground text-base sm:text-lg leading-relaxed">
              {t(
                "The same sake in a different vessel is a different sake. Each cup changes the aroma, the temperature, the ritual, and the meaning. This guidebook covers six essential vessels — their science, their soul, the specific bottles that sing in each, and the artisans who craft them.",
                "異なる器の同じ日本酒は異なる日本酒。各杯が香り、温度、儀式、そして意味を変える。この手引書は六つの本質的な器を網羅する — その科学、その魂、各器で歌う特定の瓶、そしてそれらを作る職人たち。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Vessel Selector */}
      <section className="py-10 sm:py-16">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {vesselGuides.map((v) => (
              <button
                type="button"
                key={v.id}
                aria-pressed={activeVessel === v.id}
                onClick={() => {
                  setActiveVessel(v.id);
                  setExpandedSection("description");
                }}
                className={
                  activeVessel === v.id
                    ? "group relative p-3 sm:p-4 border transition-all duration-500 text-center bg-[oklch(0.78_0.12_85/0.1)] border-[oklch(0.78_0.12_85/0.5)]"
                    : "group relative p-3 sm:p-4 border transition-all duration-500 text-center bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.25)]"
                }
              >
                <span className="block font-sk-serif text-3xl sm:text-4xl font-bold text-[oklch(0.78_0.12_85)] mb-1">{v.kanji}</span>
                <span className="block text-[9px] sm:text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
                  {t(v.name, v.nameJa)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Vessel Detail */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div key={active.id} className="animate-in fade-in slide-in-from-bottom-[15px] duration-400 fill-mode-both">
            {/* Title + Tagline */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <span className="font-sk-serif text-6xl sm:text-7xl font-bold text-[oklch(0.78_0.12_85/0.4)]">{active.kanji}</span>
                <div>
                  <h2 className="font-sk-serif text-3xl sm:text-4xl font-bold text-foreground">{t(active.name, active.nameJa)}</h2>
                  <p className="text-sm text-[oklch(0.78_0.12_85)] italic font-sk-serif">{t(active.tagline, active.taglineJa)}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <Stat label={t("Capacity", "容量")} value={active.capacity} />
              <Stat label={t("Temperature", "温度帯")} value={t(active.tempRange, active.tempRangeJa)} />
              <Stat label={t("Material", "素材")} value={t(active.material, active.materialJa)} />
              <Stat label={t("Shape", "形状")} value={t(active.shape, active.shapeJa)} />
            </div>

            {/* Expandable Sections */}
            <div className="space-y-2">
              <SectionAccordion
                id="description"
                title={t("About This Vessel", "この器について")}
                icon={<Wine aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <p className="text-muted-foreground leading-relaxed">{t(active.description, active.descriptionJa)}</p>
              </SectionAccordion>

              <SectionAccordion
                id="science"
                title={t("Material Science & Aroma Effect", "素材科学と香りの効果")}
                icon={<Droplets aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-2">
                      {t("Material Science", "素材科学")}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{t(active.materialScience, active.materialScienceJa)}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-2">
                      {t("Aroma Effect", "香りの効果")}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{t(active.aromaEffect, active.aromaEffectJa)}</p>
                  </div>
                </div>
              </SectionAccordion>

              <SectionAccordion
                id="styles"
                title={t("Best & Worst Sake Styles", "最適・不適な酒のスタイル")}
                icon={<Star aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.65_0.18_150)] mb-3">
                      {t("✦ Best Styles", "✦ 最適なスタイル")}
                    </h4>
                    <div className="space-y-1.5">
                      {active.bestStyles.map((s, i) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-foreground">
                          <span className="size-1.5 rounded-full bg-[oklch(0.65_0.18_150)]" />
                          {t(s, active.bestStylesJa[i])}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.55_0.22_25)] mb-3">
                      {t("✕ Avoid", "✕ 避けるべき")}
                    </h4>
                    <div className="space-y-1.5">
                      {active.avoidStyles.map((s, i) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_25)]" />
                          {t(s, active.avoidStylesJa[i])}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionAccordion>

              <SectionAccordion
                id="bottles"
                title={t("Recommended Bottles", "おすすめの銘柄")}
                icon={<Thermometer aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  {active.sakeRecs.map((rec) => (
                    <div key={rec.name} className="p-4 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.78_0.12_85/0.08)]">
                      <h4 className="font-sk-serif text-lg font-bold text-foreground mb-1">{t(rec.name, rec.nameJa)}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(rec.why, rec.whyJa)}</p>
                    </div>
                  ))}
                </div>
              </SectionAccordion>

              <SectionAccordion
                id="ritual"
                title={t("The Ritual", "儀式")}
                icon={<Info aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <p className="text-muted-foreground leading-relaxed italic">{t(active.ritual, active.ritualJa)}</p>
              </SectionAccordion>

              <SectionAccordion
                id="artisans"
                title={t("Artisans & Where to Buy", "職人と購入先")}
                icon={<ShoppingBag aria-hidden="true" size={16} />}
                expanded={expandedSection}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  {active.artisans.map((a) => (
                    <div key={a.name} className="p-4 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.45_0.18_25/0.1)]">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h4 className="font-sk-serif text-lg font-bold text-foreground">{t(a.name, a.nameJa)}</h4>
                          <p className="text-xs text-[oklch(0.78_0.12_85)] font-mono tracking-wider mt-0.5">{t(a.location, a.locationJa)}</p>
                        </div>
                        <span className="font-mono text-xs text-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.08)] px-2 py-1">
                          {a.priceRange}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(a.specialty, a.specialtyJa)}</p>
                    </div>
                  ))}
                </div>
              </SectionAccordion>

              {/* Connoisseur Note */}
              {isConnoisseur && (
                <div className="p-5 border-l-2 border-[oklch(0.78_0.12_85/0.4)] bg-[oklch(0.78_0.12_85/0.04)] animate-in fade-in duration-500">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-3">
                    {t("Connoisseur's Deep Note", "通の深い心得")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(active.connoisseurNote, active.connoisseurNoteJa)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Pairing Matrix */}
      <section className="py-16 sm:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h2 className="font-sk-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t("The Pairing Matrix", "ペアリングマトリクス")}
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
              {t(
                "Which vessel for which style? This matrix maps every major sake category to its ideal vessels. Gold dots indicate primary recommendations.",
                "どのスタイルにどの器？このマトリクスは主要な日本酒カテゴリーを理想的な器にマッピングする。金のドットは主要な推奨を示す。",
              )}
            </p>
          </Reveal>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150 border-collapse">
              <thead>
                <tr className="border-b border-[oklch(0.78_0.12_85/0.15)]">
                  <th className="text-left py-3 px-3 font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                    {t("Sake Style", "酒のスタイル")}
                  </th>
                  {vesselGuides.map((v) => (
                    <th key={v.id} className="py-3 px-2 text-center">
                      <span className="block font-sk-serif text-lg text-[oklch(0.78_0.12_85)]">{v.kanji}</span>
                      <span className="block font-mono text-[8px] tracking-wider text-muted-foreground uppercase">{v.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pairingMatrix.map((row) => (
                  <tr key={row.style} className="border-b border-[oklch(0.78_0.12_85/0.05)] hover:bg-[oklch(0.78_0.12_85/0.03)] transition-colors">
                    <td className="py-3 px-3 text-sm text-foreground font-medium">{t(row.style, row.styleJa)}</td>
                    {vesselGuides.map((v) => (
                      <td key={v.id} className="py-3 px-2 text-center">
                        {row.vessels.includes(v.id) ? (
                          <span
                            role="img"
                            aria-label={row.vessels[0] === v.id ? t("Primary", "主要") : t("Also good", "推奨")}
                            className={
                              row.vessels[0] === v.id
                                ? "inline-block size-3 rounded-full bg-[oklch(0.78_0.12_85)]"
                                : "inline-block size-3 rounded-full bg-[oklch(0.78_0.12_85/0.35)]"
                            }
                          />
                        ) : (
                          <span className="inline-block w-1.5 h-px bg-[oklch(0.3_0.02_270)]" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-16 sm:py-20 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-200 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal enter="animate-in fade-in duration-1000 fill-mode-both">
            <p className="font-sk-serif text-2xl sm:text-3xl italic text-[oklch(0.78_0.12_85)] leading-relaxed">
              {t(
                '"Pour for others. Never for yourself. The vessel teaches generosity before the first sip."',
                "「他者に注げ。自分には決して。器は最初の一口の前に寛大さを教える。」",
              )}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="py-12 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sk-serif text-lg text-[oklch(0.78_0.12_85)] tracking-wider">酒</p>
          <p className="mt-2 text-xs text-[oklch(0.45_0.02_270)] tracking-[0.15em] uppercase">
            {t("Sake for Sake's Sake — A guide for the gloriously obsessed", "酒のためだけの酒 — 栄光ある執着者のためのガイド")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-[oklch(0.14_0.025_270)] border border-[oklch(0.22_0.04_270)]">
      <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-1">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

/* The app's SectionAccordion. Closed panels stay in the page (hidden), so their text is crawlable. */
function SectionAccordion({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  expanded: string;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  const isOpen = expanded === id;
  const panelId = `vessel-section-${id}`;
  return (
    <div className="border border-[oklch(0.22_0.04_270)] bg-[oklch(0.14_0.025_270)]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[oklch(0.78_0.12_85/0.03)] transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="text-[oklch(0.78_0.12_85)]">{icon}</span>
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-foreground">{title}</span>
        </span>
        {isOpen ? (
          <ChevronUp aria-hidden="true" size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown aria-hidden="true" size={14} className="text-muted-foreground" />
        )}
      </button>
      <div id={panelId} hidden={!isOpen} className="overflow-hidden animate-in fade-in duration-300">
        <div className="px-5 pb-5 pt-1">{children}</div>
      </div>
    </div>
  );
}
