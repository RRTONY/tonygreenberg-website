"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { soulsmokeTranslations, type SoulsmokeLanguage } from "@/lib/content/soulsmoke/translations";
import { soulsmokeFontVariables } from "@/lib/fonts/soulsmoke-fonts";

// The SoulSmoke app's LanguageContext, ViewModeContext and FavoritesContext in one client
// provider. Same storage keys as the Manus app, so a returning visitor keeps their choices.
// It also renders the section's wrapper: .soulsmoke-root scopes soulsmoke.css, and
// data-mode="aficionado" is what used to be the html.mode-aficionado class.

export type SoulsmokeViewMode = "soulsmoke" | "aficionado";

type LanguageContextValue = {
  language: SoulsmokeLanguage;
  setLanguage: (language: SoulsmokeLanguage) => void;
  t: (key: string) => string;
};

type ViewModeContextValue = {
  mode: SoulsmokeViewMode;
  setMode: (mode: SoulsmokeViewMode) => void;
  toggleMode: () => void;
  isSoulSmoke: boolean;
  isAficionado: boolean;
};

type FavoritesContextValue = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const NO_FAVORITES: string[] = [];

export function SoulsmokeProviders({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStore<SoulsmokeLanguage>("soulsmoke-language", "en");
  const [mode, setMode] = useLocalStore<SoulsmokeViewMode>("mezcal-view-mode", "soulsmoke");
  const [favorites, setFavorites] = useLocalStore<string[]>("mezcal-favorites", NO_FAVORITES);

  const t = useCallback(
    (key: string) => soulsmokeTranslations[language]?.[key] || soulsmokeTranslations.en[key] || key,
    [language],
  );

  const languageValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  const viewModeValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((prev) => (prev === "soulsmoke" ? "aficionado" : "soulsmoke")),
      isSoulSmoke: mode === "soulsmoke",
      isAficionado: mode === "aficionado",
    }),
    [mode, setMode],
  );

  const favoritesValue = useMemo(
    () => ({
      favorites,
      addFavorite: (id: string) => setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id])),
      removeFavorite: (id: string) => setFavorites((prev) => prev.filter((fav) => fav !== id)),
      toggleFavorite: (id: string) =>
        setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id])),
      isFavorite: (id: string) => favorites.includes(id),
      clearFavorites: () => setFavorites([]),
    }),
    [favorites, setFavorites],
  );

  return (
    <LanguageContext.Provider value={languageValue}>
      <ViewModeContext.Provider value={viewModeValue}>
        <FavoritesContext.Provider value={favoritesValue}>
          <div
            lang={language}
            data-mode={mode}
            className={`${soulsmokeFontVariables} soulsmoke-root min-h-screen bg-background text-foreground`}
          >
            {children}
          </div>
        </FavoritesContext.Provider>
      </ViewModeContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within SoulsmokeProviders");
  return context;
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) throw new Error("useViewMode must be used within SoulsmokeProviders");
  return context;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within SoulsmokeProviders");
  return context;
}
