"use client";

import { useState } from "react";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { matchAgaves, scentFinderData, type AgaveMatch } from "../data/scent-finder.data";

// The Scent Finder's ONE shared state (same shape as BrewSoul's quiz hook): which step is
// showing (1 = pick notes, 2 = matches), the selected notes and the matches. Steps read it and
// call these actions; nothing else holds flow state.
export type ScentFinderState = {
  step: number;
  selectedNotes: string[];
  matches: AgaveMatch[];
};

const initialState: ScentFinderState = { step: 1, selectedNotes: [], matches: [] };

export function useScentFinder() {
  const [state, setState] = useState<ScentFinderState>(initialState);
  const { language } = useLanguage();
  const copy = language === "es" ? scentFinderData.es : scentFinderData.en;

  const onNext = (specificStep?: number) =>
    setState((prev) => ({ ...prev, step: specificStep ?? prev.step + 1 }));

  const toggleNote = (noteName: string) =>
    setState((prev) => ({
      ...prev,
      selectedNotes: prev.selectedNotes.includes(noteName)
        ? prev.selectedNotes.filter((n) => n !== noteName)
        : [...prev.selectedNotes, noteName],
    }));

  const findMatches = () => {
    if (state.selectedNotes.length === 0) return;
    setState((prev) => ({ ...prev, matches: matchAgaves(prev.selectedNotes), step: 2 }));
  };

  const reset = () => setState(initialState);

  const isSelected = (noteName: string) => state.selectedNotes.includes(noteName);

  return { state, copy, onNext, toggleNote, findMatches, reset, isSelected };
}
