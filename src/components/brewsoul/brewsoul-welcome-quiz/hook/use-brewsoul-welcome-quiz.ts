"use client";

import { useState } from "react";
import { IDENTITIES, PALATE_QUESTIONS, SCREENS, type Identity } from "../data/brewsoul-welcome-quiz.data";

// The welcome quiz's ONE shared state (FydoPartner sign-in pattern, see
// CONTRIBUTING rule 19): the step (1 questions, 2 identity), which screen,
// the answers, the in-progress palate / multi-select / slider values, the
// computed identity and the fade flag. Steps read it and call these actions.
export const IDENTITY_KEY = "brewsoul-identity";

export type WelcomeQuizState = {
  step: number;
  screen: number;
  answers: Record<number, string | string[]>;
  palate: Record<string, string>;
  multi: string[];
  weirdness: number;
  identity: Identity | null;
  visible: boolean;
};

const initialState: WelcomeQuizState = {
  step: 1,
  screen: 0,
  answers: {},
  palate: {},
  multi: [],
  weirdness: 5,
  identity: null,
  visible: true,
};
const FADE_MS = 300;

// Legacy's scoring, unchanged.
function computeIdentity(answers: Record<number, string | string[]>): Identity {
  const scores: Record<string, number> = {};
  for (const i of IDENTITIES) scores[i.id] = 0;

  const a0 = answers[0] as string;
  if (a0 === "consumer") {
    scores["ritual-architect"] += 2;
    scores["the-awakening"] += 2;
  }
  if (a0 === "b2b") scores["pressure-seeker"] += 2;
  if (a0 === "impact") scores["impact-alchemist"] += 3;
  if (a0 === "connoisseur") {
    scores["terroir-purist"] += 2;
    scores["fermentation-explorer"] += 2;
  }
  if (a0 === "discovery") {
    scores["fermentation-explorer"] += 1;
    scores["the-awakening"] += 2;
  }

  const a1 = answers[1] as string;
  if (a1 === "functional") scores["the-awakening"] += 2;
  if (a1 === "ritual") scores["ritual-architect"] += 3;
  if (a1 === "obsessed") {
    scores["terroir-purist"] += 2;
    scores["fermentation-explorer"] += 2;
  }
  if (a1 === "professional") scores["pressure-seeker"] += 2;
  if (a1 === "activist") scores["impact-alchemist"] += 3;

  const a7 = answers[7] as string;
  if (a7 === "purist") scores["terroir-purist"] += 2;
  if (a7 === "latte") scores["pressure-seeker"] += 2;
  if (a7 === "cold") scores["fermentation-explorer"] += 1;
  if (a7 === "flexible") scores["ritual-architect"] += 1;

  const w = parseInt(answers[6] as string) || 5;
  if (w >= 7) scores["fermentation-explorer"] += 3;
  else if (w >= 4) scores["terroir-purist"] += 1;
  else scores["the-awakening"] += 2;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return IDENTITIES.find((i) => i.id === best) || IDENTITIES[5];
}

export function useBrewSoulWelcomeQuiz() {
  const [state, setState] = useState<WelcomeQuizState>(initialState);

  const updateState = (data: Partial<WelcomeQuizState>) => setState((prev) => ({ ...prev, ...data }));

  // Record this screen's answer and move on: next screen, or (after the last
  // one) compute the identity, save it and go to step 2.
  const submit = (value: string | string[], extra: Partial<WelcomeQuizState> = {}) => {
    updateState({ visible: false });
    setTimeout(() => {
      setState((prev) => {
        const answers = { ...prev.answers, [prev.screen]: value };
        if (prev.screen < SCREENS.length - 1) {
          return { ...prev, ...extra, answers, screen: prev.screen + 1, visible: true };
        }
        const identity = computeIdentity(answers);
        localStorage.setItem(IDENTITY_KEY, identity.id);
        return { ...prev, ...extra, answers, identity, step: 2, visible: true };
      });
    }, FADE_MS);
  };

  const palateComplete = Object.keys(state.palate).length >= PALATE_QUESTIONS.length;

  return {
    state,
    palateComplete,
    choose: (tag: string) => submit(tag),
    toggleMulti: (tag: string) =>
      updateState({ multi: state.multi.includes(tag) ? state.multi.filter((t) => t !== tag) : [...state.multi, tag] }),
    continueMulti: () => submit(state.multi, { multi: [] }),
    setPalate: (dim: string, value: string) => updateState({ palate: { ...state.palate, [dim]: value } }),
    continuePalate: () => palateComplete && submit(JSON.stringify(state.palate)),
    setWeirdness: (weirdness: number) => updateState({ weirdness }),
    continueSlider: () => submit(String(state.weirdness)),
    retake: () => {
      localStorage.removeItem(IDENTITY_KEY);
      setState(initialState);
    },
    progress: state.identity ? 100 : (state.screen / SCREENS.length) * 100,
  };
}
