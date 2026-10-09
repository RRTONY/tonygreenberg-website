import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RELATED_PAGES } from "@/lib/content/related-pages";
import { cn } from "@/lib/utils";

// "Related": three topic-related pages near the end of a marketing page's own
// content (owner said yes 2026-10-10). Different from the site-wide
// "Keep going" strip (where-next.tsx) above the footer. Links and copy live in
// src/lib/content/related-pages.ts. `tone` matches the section it follows:
// "light" follows the site theme, "dark" is for pages ending on a dark band.
// Full literal class strings per tone, so Tailwind sees every class.
const TONES = {
  light: {
    section: "border-t border-border",
    heading: "text-brand-gold",
    rule: "bg-brand-gold",
    list: "divide-y divide-border",
    link: "hover:bg-brand-gold/5 focus-visible:bg-brand-gold/5",
    title: "text-foreground",
    blurb: "text-muted-foreground",
    arrow: "text-brand-gold",
  },
  dark: {
    section: "border-t border-[#F5F0E0]/10 bg-[#0A0A10]",
    heading: "text-brand-gold-light",
    rule: "bg-brand-gold-light",
    list: "divide-y divide-[#F5F0E0]/10",
    link: "hover:bg-[#F5F0E0]/5 focus-visible:bg-[#F5F0E0]/5",
    title: "text-[#F5F0E0]",
    blurb: "text-[#F5F0E0]/65",
    arrow: "text-brand-gold-light",
  },
} as const;

export function RelatedPages({
  path,
  tone = "light",
  className,
  innerClassName,
}: {
  /** Key in RELATED_PAGES: the page's own path (or CHARITY_PROFILE_PATH). */
  path: string;
  tone?: keyof typeof TONES;
  /** Outer spacing/background overrides for the page it sits in. */
  className?: string;
  /** Width override for the inner column (default: centered 39rem column). */
  innerClassName?: string;
}) {
  const items = RELATED_PAGES[path];
  if (!items) return null;
  const t = TONES[tone];
  const headingId = `related-${path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;

  return (
    <section aria-labelledby={headingId} className={cn("px-6 py-10 sm:px-10", t.section, className)}>
      <div className={cn("mx-auto max-w-[39rem]", innerClassName)}>
        <h2
          id={headingId}
          className={cn("mb-4 flex items-center gap-2 font-mono text-[0.72rem] tracking-[0.2em] uppercase", t.heading)}
        >
          <span aria-hidden="true" className={cn("block h-px w-4", t.rule)} />
          Related
        </h2>
        <ul className={t.list}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-4 px-1 py-4 no-underline transition-colors",
                  t.link,
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cn("mb-1 block font-heading text-[1.05rem]/snug font-semibold", t.title)}>
                    {item.title}
                  </span>
                  <span className={cn("block text-sm/relaxed", t.blurb)}>{item.blurb}</span>
                </span>
                <ArrowRight aria-hidden="true" className={cn("size-4 shrink-0", t.arrow)} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
