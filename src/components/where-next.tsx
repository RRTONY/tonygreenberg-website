"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WHERE_NEXT, WHERE_NEXT_DEFAULT, WHERE_NEXT_HIDDEN } from "@/lib/content/where-next";

// Legacy WhereNext.tsx: "Keep going", 2 to 3 contextual next pages, then Home,
// Site Index and All Assessments, above the footer on every page. A Client
// Component only for usePathname (it lives in the root layout); the pathname
// is known during server rendering, so the links are in the server HTML.
export function WhereNext() {
  const pathname = usePathname();
  if (WHERE_NEXT_HIDDEN.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null;

  const items = (WHERE_NEXT[pathname] ?? WHERE_NEXT_DEFAULT).filter((s) => s.href !== pathname).slice(0, 3);

  return (
    <nav aria-label="Keep going" className="border-t border-brand-gold/12 px-4 pt-8 pb-6 sm:px-12">
      <p className="mb-4 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.15em] text-brand-gold uppercase">
        <span aria-hidden="true" className="block h-px w-4 bg-brand-gold" />
        Keep going
      </p>
      <ul className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block h-full rounded-lg border border-brand-gold/12 bg-brand-gold/4 px-4 py-3 no-underline transition-colors hover:border-brand-gold hover:bg-brand-gold/8"
            >
              <span className="mb-0.5 block font-heading text-[0.9rem] font-semibold text-foreground">{item.label}</span>
              <span className="block text-xs leading-snug text-muted-foreground">{item.teaser}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[0.65rem] tracking-[0.08em] uppercase">
        <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 text-brand-gold no-underline hover:opacity-70">
          <ArrowLeft aria-hidden="true" className="size-3" />
          Home
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">
          ·
        </span>
        <Link href="/the-index" className="inline-flex min-h-11 items-center text-brand-gold no-underline hover:opacity-70">
          Site Index
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">
          ·
        </span>
        <Link href="/find-my" className="inline-flex min-h-11 items-center text-brand-gold no-underline hover:opacity-70">
          All Assessments
        </Link>
      </div>
    </nav>
  );
}
