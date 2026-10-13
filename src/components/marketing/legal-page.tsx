import type { ReactNode } from "react";

// Shared layout for /privacy and /terms: a plain reading column, the same
// width and type scale as /about's body. New pages (no legacy source; the
// team review of 2026-10-14 asked for them). Wording drafted from what the
// site really does, for Josh (legal) to review before launch.
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[39rem] px-5 py-16 sm:px-10 sm:py-20">
      <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase dark:text-brand-gold-light">
        {eyebrow}
      </p>
      <h1 className="font-heading text-[clamp(2rem,4.5vw,3rem)]/[1.15] font-normal text-foreground">{title}</h1>
      <p className="mt-3 font-mono text-xs tracking-wide text-muted-foreground">Last updated {updated}</p>
      <div className="mt-8 text-base/[1.8] text-foreground/85 sm:text-[1.0625rem]/[1.8]">{intro}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 text-base/[1.8] text-foreground/85 sm:text-[1.0625rem]/[1.8] [&_a]:text-brand-gold [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-brand-gold-light [&_li]:mt-2 [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
      <h2 className="mb-3 font-heading text-2xl font-normal text-foreground">{title}</h2>
      {children}
    </section>
  );
}
