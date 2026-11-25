"use client";

import { BookOpen, Pen } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { journalFields } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Journal.tsx (2026-11-26): the printable "Sake Moment"
// template (lines, option chips and an empty scale to fill in by hand). Same copy and layout;
// framer-motion entrances are tw-animate classes with the app's 0.06s stagger. The app marked each
// field name up as a <label> with no input behind it; here it's plain text (nothing to label).
export function SakeJournal() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("Beyond Tasting Notes", "テイスティングノートを超えて")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <BookOpen aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Sake Journal", "酒の日記")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Not just what you tasted. Who you were with, what you felt, the weather, the music. Print this framework and fill it by hand — the pen remembers what the phone forgets.",
              "味わったものだけではない。誰と一緒だったか、何を感じたか、天気、音楽。このフレームワークを印刷して手書きで記入 — ペンは携帯が忘れたことを覚えている。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.2)] p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="font-sk-serif text-2xl font-bold text-[oklch(0.78_0.12_85)]">{t("Sake Moment", "酒の瞬間")}</h2>
            <div className="kintsugi-line mt-4" />
          </div>

          <div className="space-y-6">
            {journalFields.map((field, i) => (
              <div
                key={field.id}
                className="animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <Pen aria-hidden="true" size={12} className="text-[oklch(0.78_0.12_85)] mt-1 shrink-0" />
                  <p className="font-sk-serif text-lg font-semibold text-foreground">{t(field.label, field.labelJa)}</p>
                </div>
                {field.type === "textarea" ? (
                  <div className="ml-6 border-b border-dashed border-[oklch(0.78_0.12_85/0.2)] pb-4 min-h-15">
                    <p className="text-xs text-muted-foreground italic">{t(field.placeholder, field.placeholderJa)}</p>
                  </div>
                ) : field.type === "select" && field.options ? (
                  <div className="ml-6 flex flex-wrap gap-2">
                    {field.options.map((opt) => (
                      <span
                        key={opt.en}
                        className="px-3 py-1 text-xs border border-[oklch(0.28_0.04_270)] text-muted-foreground hover:border-[oklch(0.78_0.12_85/0.4)] hover:text-foreground transition-colors cursor-default"
                      >
                        {t(opt.en, opt.ja)}
                      </span>
                    ))}
                  </div>
                ) : field.type === "range" ? (
                  <div className="ml-6">
                    <div className="h-2 bg-[oklch(0.20_0.03_270)] rounded-full">
                      <div className="h-full w-0 bg-linear-to-r from-[oklch(0.78_0.12_85/0.3)] to-[oklch(0.78_0.12_85)] rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-1">{t(field.placeholder, field.placeholderJa)}</p>
                  </div>
                ) : (
                  <div className="ml-6 border-b border-dashed border-[oklch(0.78_0.12_85/0.2)] pb-2">
                    <p className="text-xs text-muted-foreground italic">{t(field.placeholder, field.placeholderJa)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The journal remembers what the tongue forgets."', "「日記は舌が忘れたことを覚えている。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
