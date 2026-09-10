import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ported from legacy client/src/components/WhatsNext.tsx — the "what's
// next" CTA block at the bottom of every assessment page, so no
// assessment is a dead end. Real links unchanged: `/find-my` is a real
// forward-reference to the not-yet-built assessment hub, same pattern
// already used elsewhere in this migration.
const LINKS = [
  { label: "Take Another Assessment", href: "/find-my" },
  { label: "Read Related Essays", href: "/blog" },
  { label: "Explore the Ecosystem", href: "/ecosystem" },
];

export function WhatsNext() {
  return (
    <div className="mt-[clamp(4rem,6vw,6rem)] border-t border-brand-gold/15 bg-brand-gold/4 px-8 py-[clamp(3rem,5vw,4rem)] text-center">
      <div className="mb-6 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        The Journey Continues
      </div>
      <h3 className="mb-8 font-heading text-xl font-normal text-brand-gold">What&apos;s Next?</h3>
      <div className="flex flex-col items-center gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="w-75 max-w-full rounded-none border border-brand-gold/25 bg-brand-gold/6 px-8 py-3 text-center font-mono text-[0.82rem] tracking-[0.1em] text-[#5A4510] uppercase transition-colors hover:bg-brand-gold/12"
          >
            <ArrowRight aria-hidden="true" className="mr-2 inline size-3.5" />
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
