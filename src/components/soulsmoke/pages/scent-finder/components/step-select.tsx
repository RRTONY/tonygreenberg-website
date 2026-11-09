"use client";

import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScentFinderStepProps } from "../scent-finder";
import { scentCategories, scentNotes } from "../data/scent-finder.data";

// Step 1: pick the aromas, grouped by category, then "Find My Agave".
export function StepSelect({ finder }: ScentFinderStepProps) {
  const { state, copy, toggleNote, findMatches, reset, isSelected } = finder;

  return (
    <section className="py-20">
      <div className="container max-w-6xl">
        <div className="space-y-12">
          {scentCategories.map((category) => (
            <div key={category}>
              <h3 className="mb-6 font-display text-2xl font-bold text-lime-500 capitalize">{category}</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {scentNotes
                  .filter((note) => note.category === category)
                  .map((note) => {
                    const selected = isSelected(note.name);
                    return (
                      <button
                        key={note.name}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleNote(note.name)}
                        className={
                          selected
                            ? `relative scale-105 rounded-lg border-2 border-lime-500 p-6 shadow-2xl shadow-lime-500/50 transition-all duration-300 ${note.color}`
                            : "relative rounded-lg border-2 border-gray-800 bg-card p-6 transition-all duration-300 hover:scale-102 hover:border-lime-500/50"
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className={selected ? "font-semibold text-black" : "font-semibold text-foreground"}>
                            {note.name}
                          </span>
                          {selected && <Sparkles aria-hidden="true" className="size-5 animate-pulse text-black" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={findMatches}
            disabled={state.selectedNotes.length === 0}
            className="gap-2 bg-lime-500 text-lg font-bold text-black hover:bg-lime-600"
          >
            <Sparkles aria-hidden="true" className="size-5" />
            {copy.find(state.selectedNotes.length)}
          </Button>
          {state.selectedNotes.length > 0 && (
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              className="gap-2 border-lime-500 text-lg text-lime-500 hover:bg-lime-500 hover:text-black"
            >
              <X aria-hidden="true" className="size-5" />
              {copy.clear}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
