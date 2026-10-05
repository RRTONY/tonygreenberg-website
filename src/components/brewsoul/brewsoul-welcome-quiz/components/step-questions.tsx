"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PALATE_QUESTIONS, SCREENS, WEIRDNESS_LINES, welcomeQuizData } from "../data/brewsoul-welcome-quiz.data";
import { IDENTITY_KEY } from "../hook/use-brewsoul-welcome-quiz";
import type { StepProps } from "../brewsoul-welcome-quiz";

const CONTINUE_ON =
  "bg-linear-to-br from-[#C5A23C] to-[#836311] font-bold text-[#FAFAF7] shadow-[0_4px_20px_rgba(139,105,20,0.3)]";
const CONTINUE_OFF = "bg-[#836311]/6 text-[#836311]/30";

function ContinueButton({ enabled, onClick, className }: { enabled: boolean; onClick: () => void; className: string }) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={`inline-flex items-center gap-2 rounded-md px-8 py-3.5 font-mono text-xs tracking-wide uppercase ${className} ${enabled ? CONTINUE_ON : CONTINUE_OFF}`}
    >
      {welcomeQuizData.continue}
      <ArrowRight aria-hidden="true" className="size-3.5" />
    </button>
  );
}

function GlassOption({
  emoji,
  text,
  selected,
  onClick,
}: {
  emoji: string;
  text: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#836311]/50 hover:bg-white/85 hover:shadow-lg ${
        selected ? "-translate-y-0.5 border-[#836311]/50 bg-white/85 shadow-lg" : "border-[#836311]/15 bg-white/60"
      }`}
    >
      <span className="text-xl [filter:drop-shadow(0_2px_6px_rgba(139,105,20,0.2))]">{emoji}</span>
      <span className={`font-sans text-sm ${selected ? "font-semibold text-[#836311]" : "text-[#2A2A2A]"}`}>{text}</span>
    </button>
  );
}

// Step 1: the eight screens. Most are one-tap choices; screen 5 is a palate
// check, 6 is multi-select and 7 is a slider, each with its own Continue.
export function StepQuestions({ quiz }: StepProps) {
  const router = useRouter();
  const { screen, visible, palate, multi, weirdness } = quiz.state;
  const cur = SCREENS[screen];
  const isFirst = screen === 0;

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {isFirst && (
        <div className="mx-auto max-w-160 px-6 pt-24 pb-6 text-center">
          <div className="mb-5 font-mono text-[0.65rem] tracking-[0.35em] text-[#836311] uppercase">
            {welcomeQuizData.intro.eyebrow}
          </div>
          <h1 className="mb-5 font-heading text-[clamp(1.6rem,5vw,2.4rem)]/[1.3] font-bold text-[#1A1A1A]">
            {welcomeQuizData.intro.titleLine1}
            <br />
            <span className="text-[#836311]">{welcomeQuizData.intro.titleLine2}</span>
          </h1>
          <p className="mx-auto max-w-130 rounded-xl bg-[#FAFAF7]/70 px-5 py-4 text-[0.92rem]/[1.8] text-[#4A4A4A] backdrop-blur-md">
            {welcomeQuizData.intro.body}
          </p>
        </div>
      )}

      <div
        className={`flex flex-1 flex-col items-center justify-center px-6 pb-8 transition-opacity duration-300 ${isFirst ? "pt-4" : "pt-[52vh]"} ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-full max-w-xl text-center">
          <div className="mb-6 font-mono text-[0.62rem] tracking-[0.25em] text-[#836311]/50 uppercase">
            {screen + 1} / {SCREENS.length}
          </div>

          <h2 className="mb-3 font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">{cur.q}</h2>

          {"sub" in cur && cur.sub && <p className="mb-6 text-sm text-[#6A6A6A] italic">{cur.sub}</p>}

          {cur.type === "palate" && (
            <div className="mt-4 text-left">
              {PALATE_QUESTIONS.map((pq) => (
                <div key={pq.dim} className="mb-5">
                  <div className="mb-2 text-sm font-semibold text-[#2A2A2A]">{pq.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {pq.options.map((o) => (
                      <button
                        key={o}
                        onClick={() => quiz.setPalate(pq.dim, o)}
                        aria-pressed={palate[pq.dim] === o}
                        className={`rounded-full border px-4 py-2 text-sm backdrop-blur-sm transition-all ${
                          palate[pq.dim] === o
                            ? "border-2 border-[#836311] bg-[#836311]/10 text-[#836311]"
                            : "border border-[#836311]/15 bg-white/60 text-[#4A4A4A]"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <ContinueButton enabled={quiz.palateComplete} onClick={quiz.continuePalate} className="mt-4" />
            </div>
          )}

          {cur.type === "slider" && (
            <div className="mt-6">
              <input
                type="range"
                min={1}
                max={10}
                value={weirdness}
                aria-label={welcomeQuizData.sliderLabel}
                onChange={(e) => quiz.setWeirdness(Number(e.target.value))}
                className="w-full accent-[#836311]"
              />
              <div className="mt-2 flex justify-between font-mono text-[0.6rem] text-[#5A4A20]/45">
                <span>{welcomeQuizData.sliderMin}</span>
                <span>{welcomeQuizData.sliderMax}</span>
              </div>
              <div className="my-6 font-heading text-5xl font-bold text-[#836311]">{weirdness}</div>
              <div className="mb-6 text-sm text-[#6A6A6A] italic">{WEIRDNESS_LINES[weirdness]}</div>
              <ContinueButton enabled onClick={quiz.continueSlider} className="" />
            </div>
          )}

          {cur.multi && !cur.type && (
            <div className="mt-4">
              <div className="flex flex-col gap-2.5">
                {cur.opts.map((o) => (
                  <GlassOption
                    key={o.tag}
                    emoji={o.emoji}
                    text={o.text}
                    selected={multi.includes(o.tag)}
                    onClick={() => quiz.toggleMulti(o.tag)}
                  />
                ))}
              </div>
              <ContinueButton enabled={multi.length > 0} onClick={quiz.continueMulti} className="mt-5" />
            </div>
          )}

          {!cur.multi && !cur.type && (
            <div className="mt-4 flex flex-col gap-2.5">
              {cur.opts.map((o) => (
                <GlassOption key={o.tag} emoji={o.emoji} text={o.text} onClick={() => quiz.choose(o.tag)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-10 text-center">
        <button
          onClick={() => {
            localStorage.setItem(IDENTITY_KEY, "the-awakening");
            router.push("/brewsoul/home");
          }}
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-[#5A4A20]/25 md:min-h-6"
        >
          {welcomeQuizData.skip}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
