"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  ChevronDown,
  ChevronUp,
  CookingPot,
  Fish,
  Flame,
  FlaskConical,
  Leaf,
  Salad,
  Soup,
  Sparkles,
  Sunrise,
  TestTube,
  type LucideIcon,
} from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { ritualPalette } from "@/components/sake/page-palettes";
import { longevityRecipes, recipeCategories } from "@/lib/content/sake/experience-data";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/LongevityRecipes.tsx (2026-11-26): sake × nutrition
// recipes with category filters and expandable recipe cards. Same copy and colors (the app's inline
// hex styles are page-palettes.ts ritualPalette). Changed:
// - Recipe and category emoji (🌅 🥣 🐟 🛁 🥒 🫕, 🔥 🧫 ✨) are lucide icons (rule 18).
// - Every recipe's ingredients, method and benefits are in the server HTML (hidden until opened), and
//   the card header is a real button with aria-expanded (the app used a clickable <div>).

const RECIPE_ICONS: Record<string, LucideIcon> = {
  "Morning Amazake Elixir": Sunrise,
  "Sake Kasu Power Bowl": Soup,
  "Kasuzuke — Sake Lees Marinade": Fish,
  "Sake Bath — Nihonshu Buro": Bath,
  "Nukazuke with Sake Kasu": Salad,
  "Sake-Steamed Seasonal Fish": CookingPot,
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  morning: Sunrise,
  cooking: Flame,
  fermented: TestTube,
  beauty: Sparkles,
};

export function SakeLongevityRecipes() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const p = ritualPalette(isAustere);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const filteredRecipes = activeCategory ? longevityRecipes.filter((r) => r.category === activeCategory) : longevityRecipes;

  const filterButton = (active: boolean) =>
    active
      ? `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all border ${p.goldBorder} ${p.goldBg} ${p.onGold}`
      : `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all border bg-transparent ${p.goldBorder} ${p.gold}`;

  return (
    <div className={`min-h-screen pt-20 ${p.page}`}>
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf aria-hidden="true" size={20} className={p.gold} />
            <span className={`text-xs tracking-[0.3em] uppercase ${p.gold}`}>{t("Sake × Nutrition Synergy", "酒×栄養のシナジー")}</span>
          </div>
          <h1 className={isAustere ? "font-light text-4xl md:text-6xl mb-4" : "font-serif text-4xl md:text-6xl mb-4"}>
            {t("Longevity", "長寿の")} <span className={p.gold}>{t("Recipes", "レシピ")}</span>
          </h1>
          <p className={`max-w-2xl mx-auto ${p.muted}`}>
            {t(
              "Sake isn't just for drinking. The koji fermentation that creates sake also creates the most nutritionally dense ingredients in Japanese cuisine. These recipes harness that biochemistry for longevity, beauty, and vitality.",
              "酒は飲むだけのものではない。酒を生み出す麹発酵は、日本料理で最も栄養密度の高い食材も生み出す。これらのレシピは、その生化学を長寿、美容、活力のために活用する。",
            )}
          </p>
          <div className={`mt-6 flex items-center justify-center gap-2 text-xs ${p.gold}`}>
            <FlaskConical aria-hidden="true" size={14} />
            <span>{t("Every recipe is backed by fermentation science", "すべてのレシピは発酵科学に裏付けられている")}</span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className={`py-6 border-y ${p.goldDimBorder}`}>
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3" role="group" aria-label={t("Recipe category", "レシピの種類")}>
            <button type="button" onClick={() => setActiveCategory(null)} aria-pressed={!activeCategory} className={filterButton(!activeCategory)}>
              {t("All Recipes", "すべて")}
            </button>
            {recipeCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key] ?? Sparkles;
              return (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                  aria-pressed={activeCategory === cat.key}
                  className={filterButton(activeCategory === cat.key)}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {t(cat.name, cat.nameJa)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {filteredRecipes.map((recipe) => {
              const isExpanded = expandedRecipe === recipe.name;
              const Icon = RECIPE_ICONS[recipe.name] ?? Sparkles;
              const panelId = `recipe-${recipe.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
              return (
                <div
                  key={recipe.name}
                  className={`rounded-xl overflow-hidden transition-all duration-500 border ${p.panel} ${isExpanded ? p.goldMidBorder : p.panelBorder}`}
                >
                  <button
                    type="button"
                    className="block w-full text-left p-6"
                    onClick={() => setExpandedRecipe(isExpanded ? null : recipe.name)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    <span className="flex items-start justify-between">
                      <span className="flex items-start gap-4">
                        <Icon aria-hidden="true" className={`size-8 shrink-0 ${p.gold}`} />
                        <span className="block">
                          <span className="block font-serif text-xl mb-1">{t(recipe.name, recipe.nameJa)}</span>
                          <span className={`block text-sm ${p.muted}`}>{t(recipe.description, recipe.descriptionJa)}</span>
                          <span className="flex flex-wrap gap-2 mt-3">
                            {recipe.aminoAcidBoost.map((aa) => (
                              <span key={aa} className={`text-[10px] px-2 py-0.5 rounded ${p.goldDimBg} ${p.gold}`}>
                                {aa}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 ml-4">
                        {isExpanded ? (
                          <ChevronUp aria-hidden="true" size={18} className={p.gold} />
                        ) : (
                          <ChevronDown aria-hidden="true" size={18} className={p.gold} />
                        )}
                      </span>
                    </span>
                  </button>

                  <div id={panelId} hidden={!isExpanded} className="px-6 pb-6 space-y-6">
                    <div className={`border-t pt-6 ${p.goldDimBorder}`}>
                      <div className="mb-6">
                        <h3 className={`text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>{t("Ingredients", "材料")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {recipe.ingredients.map((ing) => (
                            <div key={ing.item} className={`flex justify-between gap-3 text-sm py-1 border-b ${p.goldDimBorder}`}>
                              <span>{t(ing.item, ing.itemJa)}</span>
                              <span className={p.gold}>{ing.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className={`text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>{t("Preparation", "作り方")}</h3>
                        <p className={`text-sm leading-relaxed ${p.softText}`}>{t(recipe.preparation, recipe.preparationJa)}</p>
                      </div>

                      <div className="mb-6">
                        <h3 className={`text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>{t("Benefits", "効能")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {recipe.benefits.map((b, j) => (
                            <div key={b} className="flex items-center gap-2 text-sm">
                              <Sparkles aria-hidden="true" size={12} className={`shrink-0 ${p.gold}`} />
                              <span>{t(b, recipe.benefitsJa[j] ?? b)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg mb-4 ${p.goldDimBg}`}>
                        <h3 className={`text-xs tracking-[0.2em] uppercase mb-2 ${p.gold}`}>{t("The Sake Connection", "酒とのつながり")}</h3>
                        <p className={`text-sm ${p.gold}`}>{t(recipe.sakeConnection, recipe.sakeConnectionJa)}</p>
                      </div>

                      {isConnoisseur && (
                        <div className={`p-4 rounded-lg ${p.noteBg}`}>
                          <h3 className={`text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2 ${p.gold}`}>
                            <FlaskConical aria-hidden="true" size={12} /> {t("Science Note", "科学ノート")}
                          </h3>
                          <p className={`text-xs leading-relaxed ${p.muted}`}>{t(recipe.scienceNote, recipe.scienceNoteJa)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 border-t ${p.goldDimBorder}`}>
        <div className="container text-center">
          <p className={`font-serif text-xl mb-6 ${isAustere ? "text-[#444]" : "text-[#c0b8a8]"}`}>
            {t(
              "The same fermentation that creates the world's most complex alcohol also creates the world's most nutritious ingredients. That's not a coincidence — that's koji.",
              "世界で最も複雑なアルコールを生み出す同じ発酵が、世界で最も栄養価の高い食材も生み出す。偶然ではない — それが麹。",
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={sk("/liquid-alchemy")} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm ${p.goldBg} ${p.onGold}`}>
              {t("The Full Science", "完全な科学")} <ArrowRight aria-hidden="true" size={14} />
            </Link>
            <Link href={sk("/namazake")} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border ${p.goldBorder} ${p.gold}`}>
              {t("Explore Namazake", "生酒を探求")} <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
