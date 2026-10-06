import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Legacy BlogPost.tsx GemSparkCallout: an essay's "GemSpark" section shown as
// a warm amber card with a "What is this?" explainer (copy unchanged). The
// section title stays the anchor the Contents sidebar jumps to.
export function GemSparkCard({ anchorId, subtitle, children }: { anchorId?: string; subtitle?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={anchorId ? `${anchorId}-title` : undefined} id={anchorId} className="my-16 scroll-mt-28 sm:-mx-4">
      <div aria-hidden="true" className="flex items-center gap-4 px-4">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#C8860A]" />
        <Sparkle className="size-3 text-[#C8860A]" />
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#C8860A]" />
      </div>
      <div className="border border-t-[3px] border-[#C8860A]/22 border-t-[#C8860A] bg-linear-160 from-[#FFFDF5] via-[#FFF8E3] to-[#FFFBF0] px-5 pt-9 pb-8 shadow-[0_4px_32px_rgba(200,134,10,0.08)] sm:px-8 dark:from-[#1d1709] dark:via-[#1a1508] dark:to-[#16130a]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-[0.62rem] font-medium tracking-[0.22em] text-brand-gold uppercase dark:text-brand-gold-light">
              <Sparkle aria-hidden="true" className="size-3.5 text-[#C8860A]" />
              GemSpark of the Day
            </p>
            <h2 id={anchorId ? `${anchorId}-title` : undefined} className="font-heading text-xl leading-tight text-essay-ink italic">
              {subtitle || "GemSpark"}
            </h2>
          </div>
          <Popover>
            <PopoverTrigger className="min-h-11 rounded-xs border border-[#C8860A]/40 px-3 font-mono text-[0.6rem] tracking-[0.14em] text-brand-gold uppercase sm:min-h-8 dark:text-brand-gold-light">
              What is this?
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 border-[#C8860A]/25 border-t-2 border-t-[#C8860A] text-[0.8rem] leading-relaxed">
              <span className="mb-2 flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-brand-gold uppercase dark:text-brand-gold-light">
                <Sparkle aria-hidden="true" className="size-3" />
                GemSpark
              </span>
              A GemSpark lives at the intersection of serendipity and synchronicity. Serendipity is the lucky accident.
              Synchronicity is the meaningful coincidence that defies logic. When they meet, something wordless happens. A
              real encounter, a real place, a real person. Not a theory. The kind of moment that only makes sense after it has
              already changed you. Every Tony &quot;WhyNot&quot; Greenberg essay includes one.{" "}
              <Link
                href="/blog/the-molecule-as-mirror-from-substance-to-service"
                className="text-brand-gold underline underline-offset-2 dark:text-brand-gold-light"
              >
                Read more about serendipity and synchronicity.
              </Link>
            </PopoverContent>
          </Popover>
        </div>
        <div aria-hidden="true" className="mb-6 h-px bg-linear-to-r from-[#C8860A]/35 to-[#C8860A]/8" />
        <div>{children}</div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#C8860A]/18 pt-4">
          <span className="font-mono text-[0.6rem] tracking-[0.18em] text-brand-gold uppercase dark:text-brand-gold-light">
            A GemSpark appears in every Tony Greenberg essay
          </span>
          <span aria-hidden="true" className="text-xs tracking-[0.4em] text-[#C8860A]/50">
            · · ·
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="flex items-center gap-4 px-4">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#C8860A]/30" />
        <Sparkle className="size-2.5 text-[#C8860A]/35" />
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#C8860A]/30" />
      </div>
    </section>
  );
}
