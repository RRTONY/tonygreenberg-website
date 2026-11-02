import Link from "next/link";

// The two America, Unbundled articles are standalone pages, not Sanity posts,
// so the essay archives don't list them on their own. This block features
// both above the archive on /blog and /essays (added on /blog 2026-10-31,
// shared with /essays 2026-11-03).
const PARTS = [
  {
    href: "/america-unbundled",
    label: "Politics and AI · Part One",
    title: "AI Does Not Have a Candidate: Politics for the AI Age",
    summary: "An independent civic grid for accountability over AI, energy and political power.",
  },
  {
    href: "/america-unbundled-field-guide",
    label: "Civic Governance · Part Two",
    title: "America, Unbundled: The Field Guide",
    summary: "A practical guide to independent political infrastructure, accountability and civic action.",
  },
];

export function AmericaUnbundledSeries({ className }: { className?: string }) {
  return (
    <section aria-label="America, Unbundled series" className={className}>
      <h2 className="font-heading text-2xl font-semibold text-foreground">America, Unbundled: Two-Part Series</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {PARTS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block border border-border bg-card p-5 text-foreground no-underline hover:border-brand-gold"
          >
            <p className="text-sm font-semibold text-brand-gold uppercase">{p.label}</p>
            <h3 className="mt-2 font-serif text-2xl">{p.title}</h3>
            <p className="mt-3 text-lg leading-relaxed">{p.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
