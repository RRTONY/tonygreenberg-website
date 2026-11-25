"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Heart, Shield, Star, XCircle } from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import type { RestaurantIntegrityProfile } from "@/lib/content/sake/supply-chain-engine";
import { integrityClasses, orderingGuideData as copy, type GuideTone } from "../data/ordering-guide.data";

// One Restaurant Integrity card (the app's RestaurantCard in OrderingGuide.tsx): score ring,
// strategy icon, markup and strategy chip; tapping opens the green/red flags and examples.
// Changed: the card is a real button (the app's clickable <div> had no keyboard access) and the
// flags stay in the page while closed (hidden) so their text is in the server HTML.

const STRATEGY_ICON = { education: Star, experience: Heart, balanced: Shield, margin: AlertTriangle } as const;

export function RestaurantCard({
  profile,
  index,
  tone,
  t,
}: {
  profile: RestaurantIntegrityProfile;
  index: number;
  tone: GuideTone;
  t: (en: string, ja: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = integrityClasses(profile.integrityScore);
  const StrategyIcon = STRATEGY_ICON[profile.sakeStrategy] ?? AlertTriangle;
  const panelId = `restaurant-${profile.sakeStrategy}`;

  return (
    <Reveal
      delay={index * 0.08}
      enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both"
      className={`${tone.cardBg} border ${tone.cardBorder} overflow-hidden transition-all duration-300`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-5 text-left"
      >
        <span className="flex flex-wrap items-center gap-4">
          <span className={`size-14 rounded-full flex items-center justify-center border-2 ${colors.ring}`}>
            <span className="text-lg font-bold font-mono">{profile.integrityScore}</span>
          </span>

          <span className="flex-1 min-w-50">
            <span className="flex items-center gap-2">
              <StrategyIcon aria-hidden="true" size={14} className={colors.text} />
              <span className={`text-lg font-bold ${tone.textMain}`}>{t(profile.type, profile.typeJa)}</span>
            </span>
            <span className={`block text-xs mt-1 ${tone.textMuted}`}>{t(profile.description, profile.descriptionJa)}</span>
          </span>

          <span className="text-center">
            <span className={`block text-lg font-bold font-mono ${tone.textMain}`}>{profile.typicalMarkup}</span>
            <span className={`block text-[10px] ${tone.textMuted}`}>{t(...copy.integrity.markup)}</span>
          </span>

          <span className={`px-3 py-1 text-[10px] tracking-widest uppercase border ${colors.chip}`}>{profile.sakeStrategy}</span>
        </span>
      </button>

      <div id={panelId} hidden={!expanded} className="overflow-hidden animate-in fade-in duration-300">
        <div className={`px-5 pb-5 pt-0 border-t ${tone.cardBorder}`}>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {profile.greenFlags.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle2 aria-hidden="true" size={12} className="text-green-500" />
                  <span className={`text-[10px] tracking-[0.15em] uppercase ${tone.textMuted}`}>{t(...copy.integrity.greenFlags)}</span>
                </div>
                <ul className="space-y-1">
                  {profile.greenFlags.map((flag, i) => (
                    <li key={flag} className={`text-xs ${tone.textMuted} flex items-start gap-1.5`}>
                      <span aria-hidden="true" className="text-green-500 mt-0.5">
                        +
                      </span>
                      {t(flag, profile.greenFlagsJa[i] || flag)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.redFlags.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <XCircle aria-hidden="true" size={12} className="text-red-400" />
                  <span className={`text-[10px] tracking-[0.15em] uppercase ${tone.textMuted}`}>{t(...copy.integrity.redFlags)}</span>
                </div>
                <ul className="space-y-1">
                  {profile.redFlags.map((flag, i) => (
                    <li key={flag} className={`text-xs ${tone.textMuted} flex items-start gap-1.5`}>
                      <span aria-hidden="true" className="text-red-400 mt-0.5">
                        -
                      </span>
                      {t(flag, profile.redFlagsJa[i] || flag)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={`mt-4 text-xs ${tone.textMuted}`}>
            <span className={tone.gold}>{t(...copy.integrity.examples)}</span> {t(profile.examples, profile.examplesJa)}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
