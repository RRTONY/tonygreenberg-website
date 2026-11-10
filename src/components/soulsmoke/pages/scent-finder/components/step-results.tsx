"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScentFinderStepProps } from "../scent-finder";
import { scentFinderData } from "../data/scent-finder.data";

// Step 2: the agaves that share the selected notes, best match first.
export function StepResults({ finder }: ScentFinderStepProps) {
  const { state, copy, reset } = finder;
  const { selectedNotes, matches } = state;

  return (
    <section className="py-20">
      <div className="container max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">{copy.resultsTitle}</h2>
          <p className="text-xl text-muted-foreground">
            {scentFinderData.basedOn}{" "}
            <span className="font-semibold text-lime-500">{selectedNotes.join(", ")}</span>
          </p>
          <Button
            variant="outline"
            onClick={reset}
            className="mt-6 gap-2 border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-black"
          >
            <X aria-hidden="true" className="size-5" />
            {copy.tryAgain}
          </Button>
        </div>

        {matches.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((agave, index) => (
              <div
                key={agave.name}
                className="group animate-fade-in relative overflow-hidden rounded-lg border-2 border-lime-500 bg-card"
                // Staggered entrance (runtime value from the card's position).
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={agave.image.src}
                    alt={agave.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center brightness-[0.7] transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent"></div>

                  {/* Match Badge */}
                  <div className="absolute top-4 right-4 rounded-lg bg-lime-500 px-4 py-2 backdrop-blur-sm">
                    <div className="text-xs font-semibold text-black">{scentFinderData.matchBadge(index + 1)}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="font-display text-3xl font-bold text-lime-500">{agave.name}</h3>
                    <p className="text-sm text-muted-foreground italic">{agave.scientificName}</p>
                    <p className="text-sm text-muted-foreground">
                      {agave.region} • {agave.maturity}
                    </p>
                  </div>

                  <p className="leading-relaxed text-foreground">{agave.description}</p>

                  <div>
                    <div className="mb-2 text-xs font-semibold tracking-wider text-lime-500 uppercase">
                      {scentFinderData.tastingNotes}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {agave.notes.map((note) => (
                        <span
                          key={note}
                          className={
                            selectedNotes.includes(note)
                              ? "rounded-full bg-lime-500 px-3 py-1 text-xs font-semibold text-black"
                              : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                          }
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-2xl text-muted-foreground">{scentFinderData.noMatches}</p>
          </div>
        )}
      </div>
    </section>
  );
}
