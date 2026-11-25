"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Copy, Heart, RotateCcw, Thermometer, Wine, X } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { qprSakeDatabase, sommelierProfiles } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath } from "@/lib/content/sake/nav";
import { profileIcons, sommelierCardData } from "@/components/sake/pages/sommelier-card/data/sommelier-card.data";
import type { SommelierCardState } from "@/components/sake/pages/sommelier-card/hook/use-sommelier-card";
import type { SommelierLook } from "@/components/sake/pages/sommelier-card/look";

// Step 2: the card (profile, the phrase to say with Copy, preferences, top bottles), the optional
// name on the card, Retake, and all four personalities with "You" on the match.
// Changed (rule 20): bottle links end in an icon, "You" has an icon instead of a typed arrow, and the
// profile emoji are lucide icons (sommelier-card.data.ts).

const c = sommelierCardData.copy;

export function StepResult({ card, look }: { card: SommelierCardState; look: SommelierLook }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const profile = card.profile;
  if (!profile) return null;

  const Icon = profileIcons[profile.id] ?? Wine;
  const recommendations = profile.topRecommendations.map((id) => qprSakeDatabase.find((s) => s.id === id)).filter((s) => s != null);

  const copyPhrase = () => {
    navigator.clipboard
      ?.writeText(profile.sommelierPhrase.replace(/"/g, ""))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className={look.card}>
        <div aria-hidden="true" className={`absolute top-0 left-0 size-16 border-t-2 border-l-2 ${look.goldCorner}`} />
        <div aria-hidden="true" className={`absolute top-0 right-0 size-16 border-t-2 border-r-2 ${look.goldCorner}`} />
        <div aria-hidden="true" className={`absolute bottom-0 left-0 size-16 border-b-2 border-l-2 ${look.goldCorner}`} />
        <div aria-hidden="true" className={`absolute bottom-0 right-0 size-16 border-b-2 border-r-2 ${look.goldCorner}`} />

        <div className="p-8 sm:p-12">
          <div className="text-center mb-8">
            <Icon aria-hidden="true" className={`mx-auto mb-3 size-9 ${look.gold}`} />
            <div className={`text-xs font-mono tracking-[0.3em] uppercase mb-2 ${look.gold}`}>
              {t(...c.brand)} · {t(...c.cardLabel)}
            </div>
            <h2 className={`font-sk-display text-3xl sm:text-4xl font-bold ${look.gold}`}>{t(profile.name, profile.nameJa)}</h2>
            {card.userName && <div className={`mt-2 text-sm font-mono ${look.textMuted}`}>{card.userName}</div>}
          </div>

          <p className={`text-center text-sm leading-relaxed max-w-lg mx-auto mb-8 ${look.textMuted}`}>
            {t(profile.description, profile.descriptionJa)}
          </p>

          <div className={`p-6 border mb-8 ${look.goldBorder} ${look.goldBg}`}>
            <div className={`text-xs font-mono tracking-wider mb-3 flex items-center justify-between ${look.gold}`}>
              <span>{t(...c.sayThis)}</span>
              <button type="button" onClick={copyPhrase} className={`flex items-center gap-1 opacity-60 hover:opacity-100 ${look.gold}`}>
                {copied ? <Check aria-hidden="true" size={12} /> : <Copy aria-hidden="true" size={12} />}
                <span className="text-[10px]">{copied ? t(...c.copied) : t(...c.copy)}</span>
              </button>
            </div>
            <p className={`italic text-sm leading-relaxed ${look.textMain}`}>{t(profile.sommelierPhrase, profile.sommelierPhraseJa)}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <Wine aria-hidden="true" size={16} className={`mx-auto mb-2 ${look.gold}`} />
              <div className={`text-[10px] font-mono mb-1 ${look.textMuted}`}>{t(...c.preferred)}</div>
              <div className="space-y-1">
                {profile.preferredTypes.slice(0, 2).map((type) => (
                  <div key={type} className={`text-xs ${look.gold}`}>
                    {type}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Heart aria-hidden="true" size={16} className={`mx-auto mb-2 ${look.gold}`} />
              <div className={`text-[10px] font-mono mb-1 ${look.textMuted}`}>{t(...c.flavors)}</div>
              <div className="space-y-1">
                {profile.preferredFlavors.slice(0, 3).map((f) => (
                  <div key={f} className="text-xs">
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <X aria-hidden="true" size={16} className="mx-auto mb-2 text-red-400" />
              <div className={`text-[10px] font-mono mb-1 ${look.textMuted}`}>{t(...c.avoid)}</div>
              <div className="space-y-1">
                {profile.avoidFlavors.map((f) => (
                  <div key={f} className="text-xs text-red-400">
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Thermometer aria-hidden="true" size={16} className={`mx-auto mb-2 ${look.gold}`} />
              <div className={`text-[10px] font-mono mb-1 ${look.textMuted}`}>{t(...c.temp)}</div>
              <div className="text-xs">{profile.tempPreference}</div>
            </div>
          </div>

          <div>
            <div className={`text-xs font-mono tracking-wider mb-3 ${look.gold}`}>{t(...c.topBottles)}</div>
            <div className="space-y-2">
              {recommendations.map((sake) => (
                <Link
                  key={sake.id}
                  href={sakeDetailPath(sake.id)}
                  className={`flex items-center justify-between gap-3 p-3 border text-sm hover:bg-[oklch(0.78_0.12_85/0.05)] transition-colors rounded group ${look.cardBorder}`}
                >
                  <span>
                    <span className="font-medium">{t(sake.name, sake.nameJa)}</span>
                    <span className={`ml-2 text-xs ${look.textMuted}`}>{sake.type}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono text-xs ${look.gold}`}>QPR {sake.qprUS}</span>
                    <ArrowRight aria-hidden="true" className={`size-3 opacity-0 group-hover:opacity-100 transition-opacity ${look.gold}`} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <input
          type="text"
          value={card.userName}
          onChange={(e) => card.setUserName(e.target.value)}
          aria-label={t(...c.namePlaceholder)}
          placeholder={t(...c.namePlaceholder)}
          className={`px-4 py-2.5 text-sm border focus:outline-none w-64 max-w-full ${look.input} ${look.textMain}`}
        />
        <button type="button" onClick={card.reset} className={`flex items-center gap-2 px-4 py-2.5 text-xs border ${look.cardBorder} ${look.textMuted}`}>
          <RotateCcw aria-hidden="true" size={14} />
          {t(...c.retake)}
        </button>
      </div>

      <div className="mt-16">
        <h3 className={`font-sk-display text-xl font-bold mb-6 text-center ${look.gold}`}>{t(...c.allProfiles)}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {sommelierProfiles.map((p) => {
            const mine = p.id === profile.id;
            const PIcon = profileIcons[p.id] ?? Wine;
            return (
              <div key={p.id} className={mine ? `p-5 border-2 ${look.goldBorder} ${look.cardBg}` : `p-5 border ${look.cardBorder} ${look.cardBg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <PIcon aria-hidden="true" className={`size-6 shrink-0 ${look.gold}`} />
                  <div>
                    <h4 className={mine ? `font-bold ${look.gold}` : "font-bold"}>{t(p.name, p.nameJa)}</h4>
                    {mine && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono ${look.gold}`}>
                        <ArrowLeft aria-hidden="true" className="size-2.5" />
                        {t(...c.you)}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${look.textMuted}`}>{t(p.description, p.descriptionJa)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
