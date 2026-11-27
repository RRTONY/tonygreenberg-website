"use client";

import { Droplets, Hourglass, House, Landmark, Link2, Sparkles, Waves, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { Reveal } from "@/components/sake/motion";
import { HEX } from "@/components/sake/hex-look";
import { spiritualRealms } from "@/lib/content/sake/spiritual-data";

// Ported from the Sake app's client/src/pages/SpiritualRealms.tsx (2026-11-26): the hero, the seven
// realms (a selector, the realm's card with its practice, the sake connection in Connoisseur mode,
// and a progress bar) and the closing quote, same copy and classes. The app's per-look hex palette
// is src/components/sake/hex-look.ts; each realm's glow (an inline box-shadow from its data color)
// is a precomposed class per realm. framer-motion's AnimatePresence swap is the card re-entering
// (fade + 30px rise, 0.5s) on each pick.
// Changed: the realm buttons showed emoji (💧 ⏳ 🔗 ⛩️ 🌊 ✨ 🏠, rule 18); they are lucide icons now, with
// the realm's name as the button label and aria-pressed for the selected one.

const REALM_ICONS: Record<number, LucideIcon> = {
  1: Droplets,
  2: Hourglass,
  3: Link2,
  4: Landmark,
  5: Waves,
  6: Sparkles,
  7: House,
};

/** The app's `boxShadow: 0 0 20px <realm color>` on the selected realm (Kintsugi only; Austere kept shadow-lg). */
const REALM_GLOW: Record<number, string> = {
  1: "shadow-[0_0_20px_oklch(0.85_0.05_200)] [.sake-austere_&]:shadow-lg",
  2: "shadow-[0_0_20px_oklch(0.78_0.12_85)] [.sake-austere_&]:shadow-lg",
  3: "shadow-[0_0_20px_oklch(0.72_0.15_50)] [.sake-austere_&]:shadow-lg",
  4: "shadow-[0_0_20px_oklch(0.65_0.2_300)] [.sake-austere_&]:shadow-lg",
  5: "shadow-[0_0_20px_oklch(0.55_0.08_270)] [.sake-austere_&]:shadow-lg",
  6: "shadow-[0_0_20px_oklch(0.45_0.12_300)] [.sake-austere_&]:shadow-lg",
  7: "shadow-[0_0_20px_oklch(0.7_0.1_120)] [.sake-austere_&]:shadow-lg",
};

export function SakeSpiritual() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const [activeRealm, setActiveRealm] = useState(0);
  const realm = spiritualRealms[activeRealm];

  return (
    <div className={`min-h-screen ${HEX.pageBg} ${HEX.textMain}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#1a0a2e] via-[#0d1321] to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`text-sm tracking-[0.4em] uppercase mb-4 ${HEX.gold}`}>{t("Beyond the Glass", "杯の向こう側")}</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t("The Seven", "七つの")}
              <br />
              <span className={HEX.gold}>{t("Spiritual Realms", "精神の境地")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${HEX.textMuted}`}>
              {t(
                "Sake is not a beverage. It is a vehicle. These are the seven territories of consciousness accessible through sincere, attentive drinking — documented by monks, priests, and brewers across a thousand years.",
                "酒は飲み物ではない。乗り物である。誠実で注意深い飲酒を通じて到達可能な意識の七つの領域——千年にわたり僧侶、神官、蔵人が記録してきた。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Realm journey */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Realm navigation */}
          <div className="md:w-16 flex md:flex-col items-center gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:pt-4">
            {spiritualRealms.map((r, i) => {
              const Icon = REALM_ICONS[r.id] ?? Sparkles;
              const active = i === activeRealm;
              return (
                <button
                  type="button"
                  key={r.id}
                  aria-pressed={active}
                  aria-label={t(r.nameEn, r.nameJa)}
                  title={t(r.nameEn, r.nameJa)}
                  onClick={() => setActiveRealm(i)}
                  className={
                    active
                      ? `shrink-0 size-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 border scale-110 shadow-lg opacity-100 ${HEX.goldBorder} ${HEX.gold} ${REALM_GLOW[r.id] ?? ""}`
                      : i < activeRealm
                        ? `shrink-0 size-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 border border-transparent hover:scale-105 opacity-100 ${HEX.textMuted}`
                        : `shrink-0 size-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 border border-transparent hover:scale-105 opacity-40 ${HEX.textMuted}`
                  }
                >
                  <Icon aria-hidden="true" className="size-5" />
                </button>
              );
            })}
          </div>

          {/* Active realm */}
          <div className="flex-1">
            <div key={activeRealm} className="animate-in fade-in slide-in-from-bottom-[30px] duration-500">
              <div className={`${HEX.cardBg} border ${HEX.goldBorder} rounded-sm p-8 md:p-12 mb-6`}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className={`text-xs tracking-[0.3em] uppercase mb-2 ${HEX.textMuted}`}>
                      {t(`Realm ${realm.id} of 7`, `第${realm.id}境地 / 全七境地`)}
                    </div>
                    <h2 className={`text-3xl md:text-4xl font-light mb-2 ${HEX.gold}`}>{t(realm.nameEn, realm.nameJa)}</h2>
                    <p className={`text-sm italic ${HEX.textMuted}`}>{t(realm.subtitleEn, realm.subtitleJa)}</p>
                  </div>
                  <div aria-hidden="true" className={`text-7xl opacity-15 ${HEX.gold}`}>
                    {realm.kanji}
                  </div>
                </div>

                <p className={`text-lg leading-relaxed mb-8 ${HEX.textMain}`}>{t(realm.descriptionEn, realm.descriptionJa)}</p>

                <div className={`${HEX.panelBg} rounded-sm p-6 mb-6`}>
                  <p className={`text-xs tracking-[0.2em] uppercase mb-3 ${HEX.gold}`}>{t("Practice", "実践")}</p>
                  <p className={`text-base leading-relaxed ${HEX.textMain}`}>{t(realm.practiceEn, realm.practiceJa)}</p>
                </div>

                {isConnoisseur && (
                  <div className={`border-l-2 ${HEX.goldBorder} pl-6 animate-in fade-in duration-500`}>
                    <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${HEX.gold}`}>{t("The Sake Connection", "酒との繋がり")}</p>
                    <p className={`text-sm leading-relaxed ${HEX.textMuted}`}>{t(realm.sakeConnectionEn, realm.sakeConnectionJa)}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2" aria-hidden="true">
                {spiritualRealms.map((r, i) => (
                  <div
                    key={r.id}
                    className={
                      i <= activeRealm
                        ? "h-1 flex-1 rounded-full transition-all duration-500 bg-[#c9a227]/60 [.sake-austere_&]:bg-red-800/60"
                        : "h-1 flex-1 rounded-full transition-all duration-500 bg-white/10 [.sake-austere_&]:bg-stone-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing meditation */}
      <section className="py-20 px-4 bg-[#0d1321]/50 [.sake-austere_&]:bg-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal enter="animate-in fade-in duration-1000 fill-mode-both">
            <p aria-hidden="true" className={`text-6xl mb-8 opacity-30 ${HEX.gold}`}>
              道
            </p>
            <blockquote className={`text-xl md:text-2xl font-light leading-relaxed mb-6 ${HEX.textMain}`}>
              {t(
                '"The light inebriation we feel when we drink sake is a special feeling that can be likened to being transported to another world."',
                "「酒を飲んで感じるほのかな酔いは、別世界に運ばれるような特別な感覚です。」",
              )}
            </blockquote>
            <p className={`text-sm ${HEX.textMuted}`}>{t("— Daimon Yasutaka, 6th generation brewer", "——大門康隆、六代目蔵元")}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
