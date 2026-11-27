"use client";

import type { ReactNode } from "react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { SearchBar } from "./components/search-bar";
import { StepCityDetail } from "./components/step-city-detail";
import { StepSearch } from "./components/step-search";
import { StepSurvey } from "./components/step-survey";
import { StepSurveyResults } from "./components/step-survey-results";
import { tapWaterData } from "./data/tap-water.data";
import { STEP, useTapWater } from "./hook/use-tap-water";

// Ported from the Aqueous app's client/src/pages/TapWater.tsx (2026-11-24): ZIP/city lookup,
// geolocation, city detail and the 10-point Water Profile Survey. Built as a step registry
// (CONTRIBUTING rule 19): this parent holds the header chrome and the registry, the one shared state
// is useTapWater, each view is its own step file, copy is in data/. The app's Navigation, Footer and
// SEOHead come from the /aqueous layout and page metadata. The app didn't use a map on this page.
export type StepProps = { tap: ReturnType<typeof useTapWater> };

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  [STEP.search]: StepSearch,
  [STEP.detail]: StepCityDetail,
  [STEP.survey]: StepSurvey,
  [STEP.results]: StepSurveyResults,
};

// What the header shows under the intro, per step (the app showed the search only in its search view).
const HEADER_EXTRAS: Record<number, (props: StepProps) => ReactNode> = {
  [STEP.search]: SearchBar,
};

export function TapWater() {
  const tap = useTapWater();
  const Step = STEPS[tap.state.step] ?? StepSearch;
  const HeaderExtra = HEADER_EXTRAS[tap.state.step];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-muted/30 pt-24 pb-10">
        <div className="container">
          {/* framer initial {opacity 0, y 20} → animate, duration 0.5 */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className="font-aq-display mb-3 text-3xl font-bold md:text-4xl">{tapWaterData.title}</h1>
            <p className="mb-6 leading-relaxed text-muted-foreground">{tapWaterData.intro}</p>
            {HeaderExtra && <HeaderExtra tap={tap} />}
          </div>
        </div>
      </section>

      {/* Content Area (the app's AnimatePresence mode="wait": each view fades in; its exits were quick fades, dropped) */}
      <section className="flex-1 py-8">
        <div className="container">
          <Step tap={tap} />
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
