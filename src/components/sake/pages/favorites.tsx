"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock, Heart, MapPin, Pen, Trash2, UtensilsCrossed, Wine, X, type LucideIcon } from "lucide-react";
import { useAesthetic, useFavorites, useLanguage, type FavoriteItem } from "@/components/sake/sake-providers";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/Favorites.tsx (2026-11-26): the saved bottles, pages and
// recipes (kept in the visitor's browser by the providers, the app's "sake-favorites-v1" key), with the
// type filter, notes, remove, clear-all confirmation and the per-type counts. The app's JS-picked
// colors per look are written out as full class strings (LOOK). framer-motion in CSS: header and rows
// fade + slide in (rows staggered 0.03s), the empty state and clear confirmation fade in.
// Changed (rule 20): a row's note/remove buttons were only visible on mouse hover; they now also show on
// keyboard focus and always on phones. Icon buttons have labels, and "View & Buy" ends in an icon
// instead of a typed arrow. Saved paths are resolved under /sake (the app stored root paths such as
// "/rice" and "/sake/<id>").

const typeIcons: Record<FavoriteItem["type"], LucideIcon> = {
  sake: Wine,
  page: BookOpen,
  recipe: UtensilsCrossed,
  vessel: Wine,
  prefecture: MapPin,
};

const typeLabels: Record<FavoriteItem["type"], { en: string; ja: string }> = {
  sake: { en: "Sake", ja: "日本酒" },
  page: { en: "Page", ja: "ページ" },
  recipe: { en: "Recipe", ja: "レシピ" },
  vessel: { en: "Vessel", ja: "器" },
  prefecture: { en: "Prefecture", ja: "都道府県" },
};

const LOOK = {
  kintsugi: {
    accentText: "text-[oklch(0.78_0.12_85)]",
    heart: "fill-[oklch(0.78_0.12_85)] stroke-[oklch(0.78_0.12_85)]",
    h1: "font-sk-display text-4xl sm:text-5xl lg:text-6xl mb-4 font-bold text-[oklch(0.96_0.01_85)]",
    intro: "font-sk-display text-lg max-w-2xl text-[oklch(0.75_0.01_85)]",
    emptyH2: "font-sk-display text-2xl mb-4 font-semibold text-[oklch(0.96_0.01_85)]",
    muted: "text-[oklch(0.55_0.02_270)]",
    fg: "text-[oklch(0.96_0.01_85)]",
    cta: "inline-flex items-center gap-2 px-6 py-3 text-sm tracking-[0.12em] uppercase border transition-all duration-300 hover:scale-105 border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]",
    filterOn:
      "px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase border transition-all duration-300 border-[oklch(0.78_0.12_85)] text-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.1)]",
    filterOff:
      "px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase border transition-all duration-300 border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.55_0.02_270)] bg-transparent",
    cancel: "px-4 py-1.5 text-[10px] tracking-widest uppercase border border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.55_0.02_270)]",
    card: "group border transition-all duration-300 bg-[oklch(0.14_0.025_270)] border-[oklch(0.78_0.12_85/0.15)] animate-in fade-in slide-in-from-bottom-2.5 duration-300 fill-mode-both",
    iconBox: "size-10 flex items-center justify-center shrink-0 mt-0.5 bg-[oklch(0.78_0.12_85/0.1)]",
    name: "font-sk-display text-base font-medium hover:underline transition-colors text-[oklch(0.96_0.01_85)]",
    buy: "inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all min-h-9 bg-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.78_0.12_85)]",
    input:
      "flex-1 px-3 py-1.5 text-xs border outline-none transition-colors bg-[oklch(0.12_0.02_270)] border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.96_0.01_85)]",
    statsTop: "mt-12 pt-8 border-t border-[oklch(0.78_0.12_85/0.15)]",
    stat: "text-center p-4 border border-[oklch(0.78_0.12_85/0.15)] bg-[oklch(0.14_0.025_270)]",
    statNum: "font-sk-display text-2xl font-light text-[oklch(0.96_0.01_85)]",
  },
  austere: {
    accentText: "text-[oklch(0.52_0.19_30)]",
    heart: "fill-[oklch(0.52_0.19_30)] stroke-[oklch(0.52_0.19_30)]",
    h1: "font-sk-display text-4xl sm:text-5xl lg:text-6xl mb-4 font-light text-[oklch(0.18_0.005_60)]",
    intro: "font-sk-display text-lg max-w-2xl text-[oklch(0.35_0.01_60)]",
    emptyH2: "font-sk-display text-2xl mb-4 font-light text-[oklch(0.18_0.005_60)]",
    muted: "text-[oklch(0.55_0.008_60)]",
    fg: "text-[oklch(0.18_0.005_60)]",
    cta: "inline-flex items-center gap-2 px-6 py-3 text-sm tracking-[0.12em] uppercase border transition-all duration-300 hover:scale-105 border-[oklch(0.52_0.19_30/0.3)] text-[oklch(0.52_0.19_30)]",
    filterOn:
      "px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase border transition-all duration-300 border-[oklch(0.52_0.19_30)] text-[oklch(0.52_0.19_30)] bg-[oklch(0.52_0.19_30/0.1)]",
    filterOff:
      "px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase border transition-all duration-300 border-[oklch(0.82_0.008_80)] text-[oklch(0.55_0.008_60)] bg-transparent",
    cancel: "px-4 py-1.5 text-[10px] tracking-widest uppercase border border-[oklch(0.82_0.008_80)] text-[oklch(0.55_0.008_60)]",
    card: "group border transition-all duration-300 bg-[oklch(0.93_0.006_80)] border-[oklch(0.82_0.008_80)] animate-in fade-in slide-in-from-bottom-2.5 duration-300 fill-mode-both",
    iconBox: "size-10 flex items-center justify-center shrink-0 mt-0.5 bg-[oklch(0.52_0.19_30/0.1)]",
    name: "font-sk-display text-base font-medium hover:underline transition-colors text-[oklch(0.18_0.005_60)]",
    buy: "inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all min-h-9 bg-[oklch(0.52_0.19_30/0.15)] text-[oklch(0.52_0.19_30)]",
    input:
      "flex-1 px-3 py-1.5 text-xs border outline-none transition-colors bg-[oklch(0.95_0.004_80)] border-[oklch(0.82_0.008_80)] text-[oklch(0.18_0.005_60)]",
    statsTop: "mt-12 pt-8 border-t border-[oklch(0.82_0.008_80)]",
    stat: "text-center p-4 border border-[oklch(0.82_0.008_80)] bg-[oklch(0.93_0.006_80)]",
    statNum: "font-sk-display text-2xl font-light text-[oklch(0.18_0.005_60)]",
  },
} as const;

const DANGER_TEXT = "text-[oklch(0.6_0.2_25)]";

/** A saved item's link: paths already under /sake are kept; the app's root paths get the /sake prefix. */
export function favoriteHref(path: string) {
  if (path === "/sake" || path.startsWith("/sake/")) return path;
  return sk(path);
}

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function SakeFavorites() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const look = isAustere ? LOOK.austere : LOOK.kintsugi;
  const { favorites, removeFavorite, updateNote, clearAll } = useFavorites();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [filter, setFilter] = useState<FavoriteItem["type"] | "all">("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = filter === "all" ? favorites : favorites.filter((f) => f.type === filter);
  const sorted = [...filtered].sort((a, b) => b.addedAt - a.addedAt);
  const types = Array.from(new Set(favorites.map((f) => f.type)));

  const startEdit = (item: FavoriteItem) => {
    setEditingId(item.id);
    setEditNote(item.note || "");
  };
  const saveEdit = () => {
    if (!editingId) return;
    updateNote(editingId, editNote);
    setEditingId(null);
    setEditNote("");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <div className="flex items-center gap-3 mb-4">
              <Heart aria-hidden="true" size={18} className={look.heart} />
              <span className={`text-[10px] tracking-[0.2em] uppercase ${look.accentText}`}>{t("Your Sake Journey", "あなたの酒の旅")}</span>
            </div>
            <h1 className={look.h1}>{t("Favorites", "お気に入り")}</h1>
            <p className={look.intro}>
              {t(
                "Every bottle remembered, every page bookmarked, every moment saved. Your personal map through the world of sake.",
                "記憶されたすべての瓶、ブックマークされたすべてのページ、保存されたすべての瞬間。日本酒の世界を巡るあなただけの地図。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      <section className="py-16">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          {favorites.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <Heart aria-hidden="true" size={48} className={`mx-auto mb-6 opacity-20 ${look.accentText}`} />
              <h2 className={look.emptyH2}>{t("Your journey begins here", "あなたの旅はここから始まる")}</h2>
              <p className={`text-sm max-w-md mx-auto mb-8 ${look.muted}`}>
                {t(
                  "Tap the heart icon on any sake, page, or recipe to save it here. Build your personal sake map over time.",
                  "ハートアイコンをタップして、日本酒、ページ、レシピを保存しましょう。時間をかけてあなただけの日本酒マップを作りましょう。",
                )}
              </p>
              <Link href={sk("/collection")} className={look.cta}>
                {t("Explore the Collection", "コレクションを探索")}
              </Link>
            </div>
          ) : (
            <>
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-pressed={filter === "all"}
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? look.filterOn : look.filterOff}
                  >
                    {t("All", "すべて")} ({favorites.length})
                  </button>
                  {types.map((type) => (
                    <button
                      type="button"
                      key={type}
                      aria-pressed={filter === type}
                      onClick={() => setFilter(type)}
                      className={filter === type ? look.filterOn : look.filterOff}
                    >
                      {t(typeLabels[type].en, typeLabels[type].ja)} ({favorites.filter((f) => f.type === type).length})
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all duration-300 hover:opacity-80 border-[oklch(0.6_0.2_25/0.3)] ${DANGER_TEXT}`}
                >
                  {t("Clear All", "すべて削除")}
                </button>
              </div>

              {showClearConfirm && (
                <div className="mb-6 p-4 border border-[oklch(0.6_0.2_25/0.3)] bg-[oklch(0.6_0.2_25/0.05)] animate-in fade-in duration-300">
                  <p className={`text-sm mb-3 ${look.fg}`}>
                    {t("Are you sure? This will remove all saved items.", "よろしいですか？保存されたすべてのアイテムが削除されます。")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        clearAll();
                        setShowClearConfirm(false);
                      }}
                      className={`px-4 py-1.5 text-[10px] tracking-widest uppercase border border-[oklch(0.6_0.2_25)] ${DANGER_TEXT}`}
                    >
                      {t("Yes, clear all", "はい、すべて削除")}
                    </button>
                    <button type="button" onClick={() => setShowClearConfirm(false)} className={look.cancel}>
                      {t("Cancel", "キャンセル")}
                    </button>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3">
                {sorted.map((item, i) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <div key={item.id} className={look.card} style={{ animationDelay: `${i * 0.03}s` }}>
                      <div className="p-4 sm:p-5 flex items-start gap-4">
                        <div className={look.iconBox}>
                          <Icon aria-hidden="true" size={16} className={look.accentText} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link href={favoriteHref(item.path)} className={look.name}>
                                {t(item.name, item.nameJa)}
                              </Link>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[9px] tracking-[0.15em] uppercase ${look.accentText}`}>
                                  {t(typeLabels[item.type].en, typeLabels[item.type].ja)}
                                </span>
                                <span className={`flex items-center gap-1 text-[9px] ${look.muted}`}>
                                  <Clock aria-hidden="true" size={9} />
                                  {formatDate(item.addedAt)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => startEdit(item)}
                                aria-label={t("Add note", "メモを追加")}
                                title={t("Add note", "メモを追加")}
                                className="flex items-center justify-center p-1.5 transition-colors hover:opacity-80"
                              >
                                <Pen aria-hidden="true" size={12} className={look.muted} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFavorite(item.id)}
                                aria-label={t("Remove", "削除")}
                                title={t("Remove", "削除")}
                                className="flex items-center justify-center p-1.5 transition-colors hover:opacity-80"
                              >
                                <Trash2 aria-hidden="true" size={12} className={DANGER_TEXT} />
                              </button>
                            </div>
                          </div>

                          {item.note && editingId !== item.id && <p className={`mt-2 text-xs italic ${look.muted}`}>&ldquo;{item.note}&rdquo;</p>}

                          {item.type === "sake" && (
                            <div className="mt-2">
                              <Link href={sakeDetailPath(item.id.replace("fav-", ""))} className={look.buy}>
                                {t("View & Buy", "詳細・購入")} <ArrowRight aria-hidden="true" className="size-3" />
                              </Link>
                            </div>
                          )}

                          {editingId === item.id && (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="text"
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                aria-label={t("Add a personal note...", "個人的なメモを追加...")}
                                placeholder={t("Add a personal note...", "個人的なメモを追加...")}
                                className={look.input}
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                              />
                              <button
                                type="button"
                                onClick={saveEdit}
                                aria-label={t("Save note", "メモを保存")}
                                className="flex items-center justify-center p-1.5"
                              >
                                <Check aria-hidden="true" size={14} className={look.accentText} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                aria-label={t("Cancel", "キャンセル")}
                                className="flex items-center justify-center p-1.5"
                              >
                                <X aria-hidden="true" size={14} className={look.muted} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className={look.statsTop}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(["sake", "page", "recipe", "vessel"] as const).map((type) => {
                    const count = favorites.filter((f) => f.type === type).length;
                    const Icon = typeIcons[type];
                    return (
                      <div key={type} className={look.stat}>
                        <Icon aria-hidden="true" size={16} className={`mx-auto mb-2 ${look.accentText}`} />
                        <div className={look.statNum}>{count}</div>
                        <div className={`text-[9px] tracking-[0.15em] uppercase mt-1 ${look.muted}`}>
                          {t(typeLabels[type].en, typeLabels[type].ja)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
