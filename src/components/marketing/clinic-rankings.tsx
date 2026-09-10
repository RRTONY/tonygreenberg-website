"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { CRITERIA } from "@/lib/content/peptide-criteria";

export type Clinic = {
  name: string;
  url: string;
  questions: number;
  score: number;
  type: string;
  contraindications: boolean;
  goals: boolean;
  personalized: boolean;
  evidence: boolean;
  medicalHistory: boolean;
  disclaimer: boolean;
  weaknesses: string;
  strengths: string;
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score <= 20
      ? "bg-[#2E8B57]"
      : score <= 50
        ? "bg-[#D4B96A]"
        : score <= 80
          ? "bg-[#CD853F]"
          : "bg-[#B22222]";
  const label =
    score <= 20 ? "Excellent" : score <= 50 ? "Adequate" : score <= 80 ? "Poor" : "Failing";
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-white ${color}`}
    >
      {score}/100 · {label}
    </span>
  );
}

function CriteriaCheck({ met }: { met: boolean }) {
  return (
    <span
      className={`inline-flex size-5 items-center justify-center rounded-full ${
        met ? "bg-[#2E8B57]/15 text-[#2E8B57]" : "bg-[#B22222]/10 text-[#B22222]"
      }`}
    >
      {met ? (
        <Check className="size-3" strokeWidth={3} />
      ) : (
        <X className="size-3" strokeWidth={3} />
      )}
    </span>
  );
}

export function ClinicRankings({ clinics }: { clinics: Clinic[] }) {
  const [sortBy, setSortBy] = useState<"score" | "questions" | "name">("score");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...clinics];
    if (sortBy === "score") arr.sort((a, b) => a.score - b.score);
    else if (sortBy === "questions") arr.sort((a, b) => b.questions - a.questions);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [clinics, sortBy]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">The Rankings</h2>
        <div className="flex gap-2">
          {(["score", "questions", "name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded border px-3 py-1.5 font-mono text-xs tracking-wide uppercase ${
                sortBy === s
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border text-muted-foreground"
              }`}
            >
              {s === "score" ? "By Score" : s === "questions" ? "By Questions" : "By Name"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((clinic, i) => {
          const isExpanded = expanded === clinic.name;
          const rank = sortBy === "score" ? i + 1 : undefined;
          return (
            <div
              key={clinic.name}
              className={`overflow-hidden rounded-lg border bg-card ${isExpanded ? "border-brand-gold/30" : "border-border"}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : clinic.name)}
                className="flex w-full flex-wrap items-center gap-4 p-5 text-left"
              >
                {rank && (
                  <span
                    className={`min-w-7 font-mono text-sm font-bold ${rank <= 3 ? "text-brand-gold" : "text-muted-foreground"}`}
                  >
                    #{rank}
                  </span>
                )}
                <div className="min-w-37.5 flex-1">
                  <div className="font-medium text-foreground">{clinic.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {clinic.type} ·{" "}
                    {clinic.questions > 0 ? `${clinic.questions} questions` : "No assessment"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <CriteriaCheck met={clinic.contraindications} />
                  <CriteriaCheck met={clinic.medicalHistory} />
                  <CriteriaCheck met={clinic.personalized} />
                  <CriteriaCheck met={clinic.evidence} />
                  <CriteriaCheck met={clinic.goals} />
                  <CriteriaCheck met={clinic.disclaimer} />
                </div>
                <ScoreBadge score={clinic.score} />
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border p-5 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-mono text-xs tracking-wide text-[#B22222] uppercase">
                        Weaknesses
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {clinic.weaknesses}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-mono text-xs tracking-wide text-[#2E8B57] uppercase">
                        Strengths
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {clinic.strengths || "None identified."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <a
                      href={clinic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-brand-gold underline"
                    >
                      Visit Site <ForwardIcon aria-hidden="true" />
                    </a>
                    <div className="flex flex-wrap gap-1.5">
                      {CRITERIA.map((c) => {
                        const met = clinic[c.key as keyof Clinic] as boolean;
                        return (
                          <span
                            key={c.key}
                            className={`rounded px-1.5 py-0.5 font-mono text-[0.6rem] ${
                              met
                                ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                                : "bg-[#B22222]/10 text-[#B22222]"
                            }`}
                          >
                            {met ? "✓" : "✗"} {c.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
