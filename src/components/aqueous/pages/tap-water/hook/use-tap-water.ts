"use client";

import { useState } from "react";
import {
  searchTapWater,
  searchTapWaterByZip,
  tapWaterDatabase,
  type TapWaterData,
} from "@/lib/content/aqueous/water-data";
import { zipToCityMap } from "@/lib/content/aqueous/zip-data";
import { defaultSurvey, surveyQuestions, tapWaterData, type SurveyAnswers } from "../data/tap-water.data";

// The Tap Water page's ONE shared state (CONTRIBUTING rule 19): which step is showing (the app's
// `view`: 1 search, 2 city detail, 3 survey, 4 survey results), the search, the chosen city, the
// geolocation status and the survey answers. Same behaviour as the app's TapWater.tsx; the survey's
// question index, which the app kept inside WaterProfileSurvey (reset each time it mounted), lives
// here too and is reset by startSurvey().
export const STEP = { search: 1, detail: 2, survey: 3, results: 4 } as const;

export type TapWaterState = {
  step: number;
  query: string;
  selectedCity: TapWaterData | null;
  showAll: boolean;
  locating: boolean;
  locationError: string;
  survey: SurveyAnswers;
  questionIndex: number;
};

const initialState: TapWaterState = {
  step: STEP.search,
  query: "",
  selectedCity: null,
  showAll: false,
  locating: false,
  locationError: "",
  survey: defaultSurvey,
  questionIndex: 0,
};

const isZip = (value: string) => /^\d{5}$/.test(value);

/** ZIP mapping first, then the fuzzy city search (the app's getResults). */
export function tapWaterResults(query: string, showAll: boolean): TapWaterData[] {
  if (query.length === 0) return showAll ? tapWaterDatabase : [];
  const trimmed = query.trim();
  if (isZip(trimmed)) {
    const zipResult = searchTapWaterByZip(trimmed, zipToCityMap);
    if (zipResult) return [zipResult];
  }
  return searchTapWater(trimmed);
}

export function useTapWater() {
  const [state, setState] = useState<TapWaterState>(initialState);

  const updateState = (data: Partial<TapWaterState>) => setState((prev) => ({ ...prev, ...data }));

  const onNext = (specificStep?: number) => setState((prev) => ({ ...prev, step: specificStep ?? prev.step + 1 }));

  const results = tapWaterResults(state.query, state.showAll);
  const matchedViaZip = isZip(state.query.trim()) && results.length > 0;

  const setQuery = (query: string) => updateState({ query, selectedCity: null });

  const selectCity = (city: TapWaterData) => updateState({ selectedCity: city, step: STEP.detail });

  const back = () => updateState({ selectedCity: null, step: STEP.search });

  const startSurvey = () => updateState({ step: STEP.survey, questionIndex: 0 });

  const answer = (key: keyof SurveyAnswers, value: number) =>
    setState((prev) => ({ ...prev, survey: { ...prev.survey, [key]: value } }));

  const nextQuestion = () =>
    setState((prev) =>
      prev.questionIndex < surveyQuestions.length - 1
        ? { ...prev, questionIndex: prev.questionIndex + 1 }
        : { ...prev, step: STEP.results },
    );

  const previousQuestion = () => {
    if (state.questionIndex > 0) updateState({ questionIndex: state.questionIndex - 1 });
    else back();
  };

  const geolocate = () => {
    updateState({ locating: true, locationError: "" });
    if (!navigator.geolocation) {
      updateState({ locationError: tapWaterData.geo.unsupported, locating: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding through OpenStreetMap's public Nominatim API (same as the app).
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await resp.json();
          const city: string =
            data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
          const postcode: string = data.address?.postcode || "";

          // Try ZIP first, then city name.
          if (postcode) {
            const zipResult = searchTapWaterByZip(postcode, zipToCityMap);
            if (zipResult) {
              updateState({
                query: `${city} (${postcode})`,
                selectedCity: zipResult,
                step: STEP.detail,
                locating: false,
              });
              return;
            }
          }

          if (city) {
            const cityResults = searchTapWater(city);
            updateState(
              cityResults.length === 1
                ? { query: city, selectedCity: cityResults[0], step: STEP.detail }
                : { query: city },
            );
          } else {
            updateState({ locationError: tapWaterData.geo.noCity });
          }
        } catch {
          updateState({ locationError: tapWaterData.geo.failed });
        }
        updateState({ locating: false });
      },
      () => updateState({ locationError: tapWaterData.geo.denied, locating: false }),
      { timeout: 10000 },
    );
  };

  const progress = ((state.questionIndex + 1) / surveyQuestions.length) * 100;

  return {
    state,
    updateState,
    onNext,
    results,
    matchedViaZip,
    setQuery,
    selectCity,
    back,
    startSurvey,
    answer,
    nextQuestion,
    previousQuestion,
    geolocate,
    progress,
  };
}
