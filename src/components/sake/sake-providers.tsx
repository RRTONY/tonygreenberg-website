"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { sakeFontVariables } from "@/lib/fonts/sake-fonts";
import { getSakeMember, type SakeMember } from "@/app/sake/actions";

// The Sake Manus app's contexts in one provider, plus the section wrapper (.sake-root scopes
// sake.css and sets the fonts):
// - AestheticContext: Kintsugi Noir or Austere (枯山水). The app toggled `austere` on <html>; here
//   the wrapper gets `.sake-austere`. Not remembered between visits, as in the app.
// - LanguageContext: English or Japanese, with the app's `t(en, ja)` helper. Not remembered, as in the app.
// - ModeContext: Beginner or Connoisseur. Not remembered, as in the app.
// - FavoritesContext: saved sakes and pages, kept in the visitor's browser under the app's own key
//   ("sake-favorites-v1"), so nothing about it reaches the server.
// - useAuth(): signed in or not (Supabase Auth instead of Manus OAuth), from src/app/sake/actions.ts.
// The app's ThemeProvider was fixed to dark, so there is no theme switch (sake.css keeps it dark).

// ─── Aesthetic ───

type Aesthetic = "kintsugi" | "austere";

type AestheticContextType = {
  aesthetic: Aesthetic;
  toggleAesthetic: () => void;
  isKintsugi: boolean;
  isAustere: boolean;
};

// ─── Language ───

type Language = "en" | "ja";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
  /** The app's t(): the English or the Japanese string for the current language. */
  t: (en: string, ja: string) => string;
};

// ─── Mode ───

type Mode = "beginner" | "connoisseur";

type ModeContextType = {
  mode: Mode;
  toggleMode: () => void;
  isBeginner: boolean;
  isConnoisseur: boolean;
};

// ─── Favorites ───

export type FavoriteItem = {
  id: string;
  type: "sake" | "page" | "recipe" | "vessel" | "prefecture";
  name: string;
  nameJa: string;
  /** App path ("/sake/born-gold" in the app, sakeDetailPath() here); pages link it through sk(). */
  path: string;
  note?: string;
  addedAt: number;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  updateNote: (id: string, note: string) => void;
  clearAll: () => void;
  count: number;
};

const FAVORITES_KEY = "sake-favorites-v1";
const NO_FAVORITES: FavoriteItem[] = [];

// ─── Member ───

export type MemberState = SakeMember & {
  /** False until the first check comes back. */
  loaded: boolean;
  refresh: () => void;
};

const SIGNED_OUT: SakeMember = { signedIn: false, id: null, email: null, name: null, isAdmin: false };

const AestheticContext = createContext<AestheticContextType | null>(null);
const LanguageContext = createContext<LanguageContextType | null>(null);
const ModeContext = createContext<ModeContextType | null>(null);
const FavoritesContext = createContext<FavoritesContextType | null>(null);
const MemberContext = createContext<MemberState | null>(null);

export function SakeProviders({ children }: { children: ReactNode }) {
  // Aesthetic
  const [aesthetic, setAesthetic] = useState<Aesthetic>("kintsugi");
  const toggleAesthetic = useCallback(() => setAesthetic((prev) => (prev === "kintsugi" ? "austere" : "kintsugi")), []);
  const aestheticValue = useMemo(
    () => ({ aesthetic, toggleAesthetic, isKintsugi: aesthetic === "kintsugi", isAustere: aesthetic === "austere" }),
    [aesthetic, toggleAesthetic],
  );

  // Language
  const [lang, setLang] = useState<Language>("en");
  const toggleLang = useCallback(() => setLang((prev) => (prev === "en" ? "ja" : "en")), []);
  const t = useCallback((en: string, ja: string) => (lang === "en" ? en : ja), [lang]);
  const languageValue = useMemo(() => ({ lang, toggleLang, t }), [lang, toggleLang, t]);

  // Mode
  const [mode, setMode] = useState<Mode>("beginner");
  const toggleMode = useCallback(() => setMode((prev) => (prev === "beginner" ? "connoisseur" : "beginner")), []);
  const modeValue = useMemo(
    () => ({ mode, toggleMode, isBeginner: mode === "beginner", isConnoisseur: mode === "connoisseur" }),
    [mode, toggleMode],
  );

  // Favorites
  const [stored, setStored] = useLocalStore<FavoriteItem[]>(FAVORITES_KEY, NO_FAVORITES);
  const favorites = Array.isArray(stored) ? stored : NO_FAVORITES;
  const favoritesValue = useMemo<FavoritesContextType>(() => {
    const list = (prev: FavoriteItem[]) => (Array.isArray(prev) ? prev : NO_FAVORITES);
    return {
      favorites,
      addFavorite: (item) =>
        setStored((prev) =>
          list(prev).some((f) => f.id === item.id) ? list(prev) : [...list(prev), { ...item, addedAt: Date.now() }],
        ),
      removeFavorite: (id) => setStored((prev) => list(prev).filter((f) => f.id !== id)),
      isFavorite: (id) => favorites.some((f) => f.id === id),
      toggleFavorite: (item) =>
        setStored((prev) =>
          list(prev).some((f) => f.id === item.id)
            ? list(prev).filter((f) => f.id !== item.id)
            : [...list(prev), { ...item, addedAt: Date.now() }],
        ),
      updateNote: (id, note) => setStored((prev) => list(prev).map((f) => (f.id === id ? { ...f, note } : f))),
      clearAll: () => setStored(NO_FAVORITES),
      count: favorites.length,
    };
  }, [favorites, setStored]);

  // Member
  const [member, setMember] = useState<SakeMember>(SIGNED_OUT);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let live = true;
    getSakeMember()
      .then((m) => live && setMember(m))
      .catch(() => live && setMember(SIGNED_OUT))
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, [version]);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const memberValue = useMemo(() => ({ ...member, loaded, refresh }), [member, loaded, refresh]);

  return (
    <AestheticContext.Provider value={aestheticValue}>
      <LanguageContext.Provider value={languageValue}>
        <ModeContext.Provider value={modeValue}>
          <FavoritesContext.Provider value={favoritesValue}>
            <MemberContext.Provider value={memberValue}>
              <div
                lang={lang}
                className={
                  aesthetic === "austere"
                    ? `${sakeFontVariables} sake-root sake-austere min-h-screen bg-background text-foreground antialiased`
                    : `${sakeFontVariables} sake-root min-h-screen bg-background text-foreground antialiased`
                }
              >
                {children}
              </div>
            </MemberContext.Provider>
          </FavoritesContext.Provider>
        </ModeContext.Provider>
      </LanguageContext.Provider>
    </AestheticContext.Provider>
  );
}

export function useAesthetic() {
  const ctx = useContext(AestheticContext);
  if (!ctx) throw new Error("useAesthetic must be used within SakeProviders");
  return ctx;
}

/**
 * Classes for content portaled out of the section (shadcn Dialog/Sheet/Popover content), so it keeps
 * the Sake palette, fonts and current look: `<DialogContent className={cn(portalClass, "...")}>`.
 */
export function useSakePortalClass() {
  const { isAustere } = useAesthetic();
  return isAustere ? `${sakeFontVariables} sake-root sake-portal sake-austere` : `${sakeFontVariables} sake-root sake-portal`;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within SakeProviders");
  return ctx;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within SakeProviders");
  return ctx;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within SakeProviders");
  return ctx;
}

/** The app's useAuth(): `signedIn` is its `isAuthenticated`, `loaded` the inverse of its `loading`. */
export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMember must be used within SakeProviders");
  return ctx;
}
