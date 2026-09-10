"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export type CheckItem = {
  id: number;
  title: string;
  description: string;
  passLabel: string;
};

function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score === 7)
    return {
      label: "Clean",
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
      description: "This vendor is doing it right.",
    };
  if (score >= 5)
    return {
      label: "Questionable",
      color: "border-amber-200 bg-amber-50 text-amber-700",
      description: "Ask for the missing items before ordering.",
    };
  if (score >= 3)
    return {
      label: "Red Flag",
      color: "border-orange-200 bg-orange-50 text-orange-700",
      description: "Don't order until gaps are resolved.",
    };
  return {
    label: "Walk Away",
    color: "border-red-200 bg-red-50 text-red-700",
    description: "This is not a vendor to trust with anything that ends up in your body.",
  };
}

export function CoaChecklist({ items }: { items: CheckItem[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const scoreInfo = getScoreLabel(score);

  return (
    <div>
      <div className="mb-12 space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            className={`w-full rounded-lg border p-5 text-left transition-colors ${
              checked[item.id] ? "border-emerald-400 bg-emerald-50/50" : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                  checked[item.id] ? "border-emerald-600 bg-emerald-600" : "border-border"
                }`}
              >
                {checked[item.id] && <Check className="size-4 text-white" strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-base font-bold text-foreground">
                  {item.id}. {item.title}
                </h3>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs font-medium text-emerald-700">Pass = {item.passLabel}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={`rounded-lg border-2 p-6 text-center ${scoreInfo.color}`}>
        <p className="mb-1 text-4xl font-bold">{score}/7</p>
        <p className="mb-2 text-xl font-bold">{scoreInfo.label}</p>
        <p className="text-sm">{scoreInfo.description}</p>
      </div>
    </div>
  );
}
