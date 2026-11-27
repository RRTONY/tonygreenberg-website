"use client";

import { useState } from "react";
import { BookOpen, Volume2 } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { HEX } from "@/components/sake/hex-look";
import { sakeVocabulary } from "@/lib/content/sake/education-data";

// Ported from the Sake app's client/src/pages/SpeakingGuide.tsx (2026-11-26): the hero, the five
// category tabs and the word cards (kanji, term, pronunciation, meaning; open one for how to use it),
// same copy and classes. The app's per-look hex palette is src/components/sake/hex-look.ts.
// framer-motion entrances are tw-animate classes (0.05s stagger kept).
// Fixed (rule 20): the word cards were clickable <div>s a keyboard couldn't reach; the card header
// is a button now (aria-expanded), and each usage example stays in the page HTML, hidden until
// opened. The tabs' hover color was built from class fragments (`hover:${gold}`), which never
// worked; it's a real hover class now. Tabs say which one is selected (aria-pressed).

const categories = ["tasting", "brewing", "serving", "grade", "culture"] as const;
type Category = (typeof categories)[number];
const categoryLabels: Record<Category, { en: string; ja: string }> = {
  tasting: { en: "Tasting", ja: "味わい" },
  brewing: { en: "Brewing", ja: "醸造" },
  serving: { en: "Serving", ja: "提供" },
  grade: { en: "Grade", ja: "等級" },
  culture: { en: "Culture", ja: "文化" },
};

export function SakeSpeaking() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const [activeCategory, setActiveCategory] = useState<Category>("tasting");
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const filtered = sakeVocabulary.filter((w) => w.category === activeCategory);

  return (
    <div className={`min-h-screen ${HEX.pageBg} ${HEX.textMain}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0d1321]/95 to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`text-sm tracking-[0.4em] uppercase mb-4 ${HEX.gold}`}>
              <BookOpen aria-hidden="true" className="size-4 inline mr-2" />
              {t("The Language of Sake", "酒の言葉")}
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t("How to", "酒を")}
              <br />
              <span className={HEX.gold}>{t("Speak Sake", "語る方法")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${HEX.textMuted}`}>
              {t(
                "The words you use shape the sake you taste. Master these terms and you'll hear what the brewer is saying through the glass.",
                "使う言葉が味わう酒を形作る。これらの用語を習得すれば、杯を通して蔵人の声が聞こえる。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              aria-pressed={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedWord(null);
              }}
              className={
                activeCategory === cat
                  ? `px-5 py-2 text-xs tracking-[0.2em] uppercase border rounded-sm transition-all duration-300 ${HEX.goldBorder} ${HEX.gold} ${HEX.goldWash}`
                  : `px-5 py-2 text-xs tracking-[0.2em] uppercase border rounded-sm transition-all duration-300 border-transparent ${HEX.textMuted} ${HEX.goldHover}`
              }
            >
              {t(categoryLabels[cat].en, categoryLabels[cat].ja)}
            </button>
          ))}
        </div>
      </section>

      {/* Word cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div key={activeCategory} className="space-y-4 mt-8 animate-in fade-in duration-300">
          {filtered.map((word, i) => {
            const open = expandedWord === word.term;
            const panelId = `sake-word-${word.term.replace(/\W+/g, "-")}`;
            return (
              <div
                key={word.term}
                style={{ animationDelay: `${i * 0.05}s` }}
                className={`${HEX.cardBg} border ${HEX.goldBorder} rounded-sm overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 fill-mode-both`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setExpandedWord(open ? null : word.term)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-6">
                    <span aria-hidden="true" className={`text-3xl font-light opacity-40 w-16 text-center ${HEX.gold}`}>
                      {word.kanji}
                    </span>
                    <span className="block">
                      <span className={`block font-sk-serif text-xl font-light ${HEX.gold}`}>{word.term}</span>
                      <span className="flex items-center gap-2 mt-1">
                        <Volume2 aria-hidden="true" className={`size-3 ${HEX.textMuted}`} />
                        <span className={`text-xs italic ${HEX.textMuted}`}>{word.pronunciation}</span>
                      </span>
                    </span>
                  </span>
                  <span className={`text-sm max-w-md text-right hidden md:block ${HEX.textMuted}`}>{t(word.meaningEn, word.meaningJa)}</span>
                </button>

                <div id={panelId} hidden={!open} className="animate-in fade-in duration-300">
                  <div className={`px-6 pb-6 pt-2 border-t ${HEX.goldBorder}`}>
                    <p className={`text-sm mb-4 md:hidden ${HEX.textMain}`}>{t(word.meaningEn, word.meaningJa)}</p>
                    <div className={`${HEX.panelBg} rounded-sm p-4`}>
                      <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${HEX.gold}`}>{t("Use it like this", "こう使う")}</p>
                      <p className={`text-base italic leading-relaxed ${HEX.textMain}`}>{t(word.usageEn, word.usageJa)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
