"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { welcomeQuizData } from "../data/brewsoul-welcome-quiz.data";
import type { StepProps } from "../brewsoul-welcome-quiz";

// Step 2: the computed coffee identity, its reading path and starter gear.
export function StepIdentity({ quiz }: StepProps) {
  const router = useRouter();
  const { identity, visible } = quiz.state;
  if (!identity) return null;
  const copy = welcomeQuizData.identity;

  return (
    <div
      className={`relative z-10 flex min-h-screen flex-col items-center px-6 pt-[45vh] pb-12 text-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-md">
        <identity.icon aria-hidden="true" className="mx-auto mb-4 size-14 text-[#836311] drop-shadow-[0_4px_12px_rgba(139,105,20,0.3)]" strokeWidth={1.5} />
        <div className="mb-3 font-mono text-[0.68rem] tracking-[0.3em] text-[#836311] uppercase">{copy.eyebrow}</div>
        <h1 className="mb-4 font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">{identity.name}</h1>
        <p className="mb-8 text-base leading-relaxed text-[#4A4A4A]">{identity.desc}</p>

        <div className="mb-5 rounded-2xl border border-[#836311]/15 bg-white/60 p-5 backdrop-blur-xl">
          <div className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-[#836311] uppercase">{copy.path}</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {identity.path.map((p, i) => (
              <span key={p} className="inline-flex items-center gap-2">
                {i > 0 && <ArrowRight aria-hidden="true" className="size-3.5 text-[#836311]/60" />}
                <span className="rounded-full border border-[#836311]/15 bg-[#836311]/8 px-3 py-1.5 text-sm text-[#5A4A20]">
                  {p}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#836311]/15 bg-white/60 p-5 backdrop-blur-xl">
          <div className="mb-3 font-mono text-[0.65rem] tracking-[0.2em] text-[#836311] uppercase">{copy.gear}</div>
          {identity.gear.map((g, i) => (
            <div
              key={g.name}
              className={`flex justify-between py-1.5 ${i < identity.gear.length - 1 ? "border-b border-[#836311]/8" : ""}`}
            >
              <span className="text-sm text-[#2A2A2A]">{g.name}</span>
              <span className="font-mono text-[0.82rem] text-[#836311]">{g.price}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/brewsoul/home")}
          className="inline-flex items-center gap-2 rounded-md bg-linear-to-br from-[#C5A23C] to-[#836311] px-10 py-4 font-mono text-[0.82rem] font-bold tracking-wide text-[#FAFAF7] uppercase shadow-[0_6px_24px_rgba(139,105,20,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,105,20,0.45)]"
        >
          {copy.enter}
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>

        <button
          onClick={() => router.push("/brewsoul/quiz")}
          className="mx-auto mt-2 flex items-center gap-2 rounded-md border border-[#C5A23C]/30 bg-[#C5A23C]/10 px-8 py-3 font-mono text-xs tracking-wide text-[#836311] uppercase transition-colors hover:bg-[#C5A23C]/20"
        >
          {copy.tasteQuiz}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>

        <button
          onClick={quiz.retake}
          className="mx-auto mt-4 block font-mono text-[0.7rem] tracking-wide text-[#5A4A20]/40"
        >
          {copy.retake}
        </button>
      </div>
    </div>
  );
}
