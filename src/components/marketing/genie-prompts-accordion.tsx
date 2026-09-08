"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type GeniePrompt = {
  id: number;
  door: string;
  domain: string;
  clientAsk: string;
  target: string;
  title: string;
  company: string;
  whyCare: string;
  outcome: string;
  link: string;
};

// Client island for the 10 "magic genie" prompts — the only part of
// /the-open-door that needs interactivity (expand/collapse). Built on the
// shadcn Accordion primitive rather than reproducing legacy's hand-rolled
// `expandedPrompt` state + button/div pair. `forceMount` on every
// `AccordionContent` keeps each prompt's target/why-care/outcome copy and
// its CTA link in the server-rendered HTML even while collapsed — same
// crawlability fix already applied to `journeys-accordion.tsx` elsewhere
// in this migration; without it Radix doesn't render closed-panel content
// into the DOM at all.
export function GeniePromptsAccordion({ prompts }: { prompts: GeniePrompt[] }) {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl">
      {prompts.map((prompt) => {
        const isExternal = prompt.link.startsWith("http");
        return (
          <AccordionItem
            key={prompt.id}
            value={String(prompt.id)}
            className="mb-4 rounded-md border border-border px-5"
          >
            <AccordionTrigger className="gap-4 py-5 hover:no-underline">
              <div className="flex items-start gap-4 text-left">
                <span className="mt-1 shrink-0 font-mono text-xs tracking-[0.1em] text-brand-gold">
                  {prompt.door}
                </span>
                <span>
                  <span className="mb-1.5 block font-heading text-[1.1rem] leading-snug font-semibold text-foreground">
                    &ldquo;{prompt.clientAsk}&rdquo;
                  </span>
                  <span className="block font-mono text-xs tracking-[0.08em] text-brand-gold uppercase">
                    {prompt.domain}
                  </span>
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="pl-8">
              <div className="mb-5 border-l-3 border-brand-gold bg-brand-gold/5 px-5 py-4">
                <div className="mb-2 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
                  The Target
                </div>
                <div className="font-heading text-lg font-bold text-foreground">
                  {prompt.target}
                </div>
                <div className="mt-1 text-foreground/70">
                  {prompt.title}, {prompt.company}
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
                  Why They&apos;ll Care
                </div>
                <p className="leading-relaxed text-foreground/80">{prompt.whyCare}</p>
              </div>

              <div className="mb-4">
                <div className="mb-2 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
                  What You Get
                </div>
                <p className="leading-relaxed text-foreground/80">{prompt.outcome}</p>
              </div>

              {isExternal ? (
                <a
                  href={prompt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-b border-brand-gold font-mono text-xs tracking-[0.08em] text-brand-gold uppercase"
                >
                  Learn more &rarr;
                </a>
              ) : (
                <Link
                  href={prompt.link}
                  className="inline-block border-b border-brand-gold font-mono text-xs tracking-[0.08em] text-brand-gold uppercase"
                >
                  Learn more &rarr;
                </Link>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
