"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type JourneyStop = { page: string; href: string; section: string; teaser: string };
export type Journey = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  mood: string;
  stops: JourneyStop[];
};

function StopLink({ stop, index }: { stop: JourneyStop; index: number }) {
  const isExternal = stop.href.startsWith("http");
  const className =
    "group block border-l-2 border-border py-4 pl-6 transition-colors hover:border-brand-gold";
  const inner = (
    <>
      <p className="mb-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        Stop {index + 1} &bull; {stop.page}
      </p>
      <p className="mb-1 font-heading font-bold text-foreground">{stop.section}</p>
      <p className="text-foreground/70">{stop.teaser}</p>
    </>
  );
  return isExternal ? (
    <a href={stop.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={stop.href} className={className}>
      {inner}
    </Link>
  );
}

export function JourneysAccordion({ journeys }: { journeys: Journey[] }) {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl">
      {journeys.map((journey) => (
        <AccordionItem key={journey.id} value={journey.id} className="mb-4 rounded-lg border border-border px-6">
          <AccordionTrigger className="py-6 hover:no-underline">
            <div className="flex gap-4 text-left">
              <span className="text-3xl leading-none">{journey.icon}</span>
              <span>
                <span className="mb-1 block font-heading text-xl font-bold text-foreground">
                  {journey.title}
                </span>
                <span className="mb-2 block font-mono text-xs tracking-wide text-brand-gold uppercase">
                  {journey.subtitle}
                </span>
                <span className="block text-sm text-foreground/70">{journey.description}</span>
                <span className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
                  <span>{journey.duration}</span>
                  <span>&bull;</span>
                  <span>{journey.stops.length} stops</span>
                  <span>&bull;</span>
                  <span>{journey.mood}</span>
                </span>
              </span>
            </div>
          </AccordionTrigger>
          {/* forceMount keeps every journey's stops (and their internal
              links) in the server-rendered HTML even while collapsed —
              without it, Radix doesn't render closed panel content into the
              DOM at all, which would make every link on this page invisible
              to crawlers until a user clicks to expand it. */}
          <AccordionContent forceMount>
            <p className="mb-2 border-t border-border pt-4 font-mono text-xs tracking-wide text-brand-gold uppercase">
              Your Route
            </p>
            {journey.stops.map((stop, i) => (
              <StopLink key={`${stop.href}-${stop.section}`} stop={stop} index={i} />
            ))}
            <div className="pt-6 pb-2 text-center">
              {journey.stops[0].href.startsWith("http") ? (
                <a
                  href={journey.stops[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-brand-gold px-6 py-2.5 font-mono text-xs tracking-wide text-white uppercase transition-transform hover:scale-105"
                >
                  Begin This Journey
                </a>
              ) : (
                <Link
                  href={journey.stops[0].href}
                  className="inline-block rounded-full bg-brand-gold px-6 py-2.5 font-mono text-xs tracking-wide text-white uppercase transition-transform hover:scale-105"
                >
                  Begin This Journey
                </Link>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
