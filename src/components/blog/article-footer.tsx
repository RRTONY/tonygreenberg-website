import Link from "next/link";
import { ArrowRight, Diamond } from "lucide-react";
import { resolveInternalHref } from "@/lib/content/post-redirects";

export type ArticleFooterData = {
  tryThis?: { title?: string; description?: string; steps?: string[] };
  whereThisLeads?: { _key?: string; title: string; href: string; reason?: string }[];
  closingRiddle?: string;
  goDeeper?: { _key?: string; title: string; url?: string; description?: string }[];
};

// Ported from legacy client/src/pages/BlogPost.tsx's post-body footer —
// four per-post sections (Try this / Where this leads / riddle / Go deeper),
// from the Sanity post's "Essay extras" fields (moved from code 2026-10-07), plus the
// one hard-coded "TrueSelf Soul Print Assessment" CTA legacy rendered
// identically on every post regardless of that per-post data. That CTA
// linked to `/assessments`, a route that never existed in legacy either —
// repointed to `/find-my`, the same forward-referenced assessment-hub
// destination already used by every other "take an assessment" CTA
// shipped so far in this migration (home-hero.tsx, journey-finder.tsx,
// peptide-quiz.tsx) — tracked as a real upcoming page at this TODO's
// `/find-my` line, not a dead link unique to this component.
const RELATED_META: Record<string, { label: string; badge: string }> = {
  related: { label: "Related Idea", badge: "bg-purple-950 text-purple-100" },
  deeper: { label: "Go Deeper", badge: "bg-blue-950 text-blue-100" },
  do: { label: "Do Something", badge: "bg-green-950 text-green-100" },
  continue: { label: "Continue", badge: "bg-brand-gold text-white" },
};

function classifyReason(reason: string): keyof typeof RELATED_META {
  const r = reason.toLowerCase();
  if (r.startsWith("related")) return "related";
  if (r.startsWith("go deeper")) return "deeper";
  if (r.startsWith("do something")) return "do";
  return "continue";
}

function stripLabelPrefix(reason: string) {
  return reason.replace(/^(related idea|go deeper|do something):\s*/i, "");
}

function RelatedLinkRow({ link }: { link: NonNullable<ArticleFooterData["whereThisLeads"]>[number] }) {
  const reason = link.reason ?? "";
  const meta = RELATED_META[classifyReason(reason)];
  return (
    <Link href={resolveInternalHref(link.href)} className="block rounded-md border border-border p-4 transition-colors hover:bg-secondary">
      <div className="mb-1 flex items-center gap-2">
        <span className={`shrink-0 rounded-sm px-2 py-0.5 font-mono text-[0.6rem] tracking-wide uppercase ${meta.badge}`}>
          {meta.label}
        </span>
        <span className="flex-1 font-heading text-base font-semibold text-foreground">{link.title}</span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />
      </div>
      {reason && <p className="text-sm text-muted-foreground italic">{stripLabelPrefix(reason)}</p>}
    </Link>
  );
}

export function ArticleFooter({ data }: { data: ArticleFooterData }) {
  return (
    <div className="mt-14 space-y-6 border-t border-border pt-10">
      {data.tryThis?.title && (
        <div className="rounded-r-md border-l-4 border-green-700/50 bg-green-700/5 p-6">
          <div className="mb-2 font-mono text-xs font-semibold tracking-widest text-green-800 uppercase">Try This</div>
          <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{data.tryThis.title}</h3>
          <p className="leading-relaxed text-foreground/80">{data.tryThis.description}</p>
          {data.tryThis.steps && (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
              {data.tryThis.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {data.whereThisLeads && data.whereThisLeads.length > 0 && (
        <div>
          <div className="mb-3 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Where This Leads
          </div>
          <div className="grid gap-3">
            {data.whereThisLeads.map((link) => (
              <RelatedLinkRow key={link._key ?? link.href} link={link} />
            ))}
          </div>
        </div>
      )}

      {data.closingRiddle && (
        <div className="rounded-md border border-violet-500/20 bg-violet-500/5 p-6 text-center">
          <div className="mb-3 font-mono text-xs tracking-widest text-violet-600 uppercase">
            A Riddle To Carry With You
          </div>
          <p className="font-heading text-lg text-foreground/90 italic">{data.closingRiddle}</p>
        </div>
      )}

      {data.goDeeper && data.goDeeper.length > 0 && (
        <div>
          <div className="mb-2 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Go Deeper
          </div>
          <ul className="space-y-1.5">
            {data.goDeeper.map((item) => (
              <li key={item._key ?? item.title} className="relative pl-5 text-foreground/80">
                <Diamond aria-hidden="true" className="absolute top-1.5 left-0 size-2.5 text-brand-gold" />
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-brand-gold underline underline-offset-2">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
                {item.description && <span className="mt-0.5 block text-sm text-muted-foreground">{item.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-md border border-border bg-secondary p-6 text-center">
        <div className="mb-2 font-mono text-xs tracking-widest text-brand-gold uppercase">Discover Your Pattern</div>
        <h3 className="mb-2 font-heading text-xl text-foreground">Take the TrueSelf Soul Print Assessment</h3>
        <p className="mx-auto mb-4 max-w-md text-sm text-muted-foreground">
          A personalized map of your consciousness, values, and growth edges — built from the same frameworks that
          inform these essays.
        </p>
        <Link
          href="/find-my"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand-gold px-6 font-mono text-xs tracking-wide text-white uppercase"
        >
          Explore Assessments
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
