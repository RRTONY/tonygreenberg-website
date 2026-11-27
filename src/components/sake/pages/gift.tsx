"use client";

import { Gift as GiftIcon } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { giftOccasions } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Gift.tsx (2026-11-26). Same copy and layout (the
// occasion shows both as the small label and as the card heading, as in the app); framer-motion
// entrances are tw-animate classes with the app's 0.08s stagger.
export function SakeGift() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("The Social Choreography", "社交の振り付け")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <GiftIcon aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Gift Protocol", "贈答の作法")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "The art of giving sake in Japan. Which bottles for which occasions. The wrapping. The social choreography that turns a bottle into a message.",
              "日本における酒の贈り方の作法。どの酒をどの場面に。包装。瓶をメッセージに変える社交の振り付け。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-5">
        {giftOccasions.map((protocol, i) => (
          <div
            key={protocol.id}
            className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-6 hover:border-[oklch(0.78_0.12_85/0.3)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[oklch(0.78_0.12_85)] text-[10px] tracking-[0.2em] uppercase">
                {t(protocol.occasion, protocol.occasionJa)}
              </span>
            </div>
            <h2 className="font-sk-serif text-xl font-bold text-foreground mb-3">{t(protocol.occasion, protocol.occasionJa)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t(protocol.description, protocol.descriptionJa)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.1)] p-3">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-1">
                  {t("Recommended Sake", "推薦する酒")}
                </p>
                <p className="text-sm text-foreground">{t(protocol.sakeType, protocol.sakeTypeJa)}</p>
              </div>
              <div className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.1)] p-3">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-1">{t("Wrapping", "包装")}</p>
                <p className="text-sm text-foreground">{t(protocol.wrapping, protocol.wrappingJa)}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-10 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"A bottle of sake is never just a bottle. It\'s a sentence."', "「一本の酒はただの瓶ではない。それは一つの文。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
