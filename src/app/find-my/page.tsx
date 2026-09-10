import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Phone } from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import {
  CATEGORIES,
  FEATURED,
  FIND_MY_COMING,
  FIND_MY_LIVE,
  FIND_MY_TOTAL,
  type FindMyLink,
} from "@/lib/content/find-my-directory";

// Ported from legacy client/src/pages/FindMyHub.tsx — "Find What's Yours,"
// the real destination of the homepage's "Diagnose" door (see
// `lib/content/home-doors.ts`'s `/find-my` entry) and of `whats-next.tsx`'s
// "Take Another Assessment" link used across every assessment result page
// in this migration. See `lib/content/find-my-directory.ts` for the full
// port note on real content/status corrections. Structural changes made
// here on top of that data fix:
//
// Legacy's hero used a dead Manus image (`/api/img/findme-orig_c4cf916c.jpg`,
// banned per this repo's zero-Manus rule) — dropped for the plain
// `ThemedBackground` (theme="ecosystem") this page renders behind
// everything anyway, same call already made on `/find-your-me`.
// `AssessmentProgressBar` (a legacy component never ported to this repo)
// is replaced with the real `JourneyTracker` (compact) — same universal
// per-browser progress data, already used everywhere else in this
// migration.
//
// Legacy's `LinkButton` tracked hover state in a `useState` purely to
// swap border/background color per item — the lift/shadow part of that
// interaction is kept as a plain Tailwind `hover:` class (no JS needed);
// the per-item hover *color* intensification was dropped as a decorative
// flourish not worth forcing this page into a Client Component for (same
// "not worth the cost" judgment made repeatedly throughout this
// migration). The whole page ships as a Server Component as a result.
//
// The "Self-Portrait" CTA now links to the real `/self-portrait` (built in
// this same pass — a real completed-assessments log read from the
// `tg_assessment_results` cookie, not legacy's composite radar chart; see
// that page's own port note for why). "Ask FauxTony" (`/fauxtony`) still
// points at a page that doesn't exist yet (Phase 10's FauxTony chatbot,
// not started) — kept as a real, honest "Coming Soon" state instead of a
// live link that would 404, same pattern used on `/impact-dashboard` and
// `/the-philosophy`.
export const metadata: Metadata = {
  title: "Find What's Yours — All Assessments",
  description: `${FIND_MY_TOTAL} decision frameworks that reduce friction and create clarity. No sales pitch. Just tools.`,
  alternates: { canonical: "/find-my" },
};

function StatusBadge({ status }: { status: "live" | "coming" }) {
  if (status === "live") return null;
  return (
    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground uppercase">
      Coming Soon
    </span>
  );
}

function LinkCard({ item }: { item: FindMyLink }) {
  const isLive = item.status === "live";
  const isExternal = item.href.startsWith("http");

  const card = (
    <div
      className={`flex w-full max-w-120 items-center gap-4 rounded-full border border-l-[3px] bg-background/85 px-6 py-4 backdrop-blur-sm transition-all ${
        isLive
          ? "border-border shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          : "cursor-default border-border/50 opacity-60"
      }`}
      style={{ borderLeftColor: item.color }}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-xl"
        style={{ backgroundColor: `${item.color}15` }}
      >
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-heading text-[1.05rem] leading-tight font-medium text-foreground">
          {item.title}
        </div>
        <div className="mt-0.5 text-[0.85rem] leading-snug text-muted-foreground">
          {item.tagline}
        </div>
      </div>
      {isLive ? (
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          <ForwardIcon aria-hidden="true" />
        </span>
      ) : (
        <StatusBadge status={item.status} />
      )}
    </div>
  );

  if (!isLive) return <div className="mx-auto">{card}</div>;

  if (isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="mx-auto block">
        {card}
      </a>
    );
  }

  return (
    <Link href={item.href} className="mx-auto block">
      {card}
    </Link>
  );
}

export default function FindMyPage() {
  return (
    <div className="relative z-1 min-h-screen">
      <ThemedBackground theme="ecosystem" />

      <div className="relative z-1 mx-auto max-w-135 px-6 pt-[clamp(6rem,10vw,8rem)] pb-24 text-center">
        <div className="mx-auto flex size-25 items-center justify-center rounded-full border-4 border-background bg-linear-to-br from-brand-gold to-brand-gold-light shadow-lg">
          <span className="font-heading text-4xl font-bold text-white">T</span>
        </div>

        <h1 className="mt-5 mb-2 font-heading text-[clamp(1.8rem,4vw,2.4rem)] leading-tight font-normal text-foreground">
          Find What&apos;s Yours
        </h1>
        <p className="mx-auto max-w-105 text-base leading-relaxed text-muted-foreground">
          {FIND_MY_TOTAL} decision frameworks that reduce friction and create clarity. No sales
          pitch. Just tools.
        </p>

        <div className="mx-auto mt-5 max-w-120 rounded-xl border border-brand-gold/12 bg-brand-gold/4 p-6 text-left">
          <p className="mb-2.5 text-[0.85rem] leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What you&apos;re looking at:</strong> Every
            assessment Tony has built — from identity and relationships to health, consciousness,
            and impact — organized in one place. Each one takes 5–10 minutes and gives you an
            immediate, personalized result.
          </p>
          <p className="mb-2.5 text-[0.85rem] leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">Why it matters:</strong> Most people make major life
            decisions — what to eat, who to trust, how to heal — with borrowed frameworks or no
            framework at all. These tools give you your own data about yourself.
          </p>
          <p className="text-[0.85rem] leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What to do:</strong> Start with a Featured
            assessment, or scroll by category. Your progress bar tracks which ones you&apos;ve
            completed. No login required.
          </p>
        </div>

        <div className="mt-3 font-mono text-[0.68rem] tracking-[0.15em] text-muted-foreground uppercase">
          5–10 min each · Free · Instant results
        </div>
      </div>

      <div className="relative z-1 mx-auto max-w-130 px-6">
        <JourneyTracker compact />
      </div>

      <section className="relative z-1 mx-auto mt-12 max-w-130 px-6">
        <div className="mb-4 text-center font-mono text-[0.68rem] tracking-[0.18em] text-brand-gold uppercase">
          Featured
        </div>
        <div className="flex flex-col gap-3">
          {FEATURED.map((item) => (
            <LinkCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {CATEGORIES.map((category) => (
        <section key={category.key} className="relative z-1 mx-auto mt-10 max-w-130 px-6">
          <div className="mb-4 flex items-center gap-4 text-center font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
            <span className="h-px flex-1 bg-brand-gold/12" />
            {category.label}
            <span className="h-px flex-1 bg-brand-gold/12" />
          </div>
          <div className="flex flex-col gap-2.5">
            {category.items.map((item) => (
              <LinkCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      ))}

      <section className="relative z-1 mx-auto mt-12 max-w-130 px-6 text-center">
        <div className="rounded-2xl border border-brand-gold-light/20 bg-[#0A0A10] p-8">
          <div className="mb-3 font-mono text-[0.68rem] tracking-[0.18em] text-brand-gold-light uppercase">
            Your Running Record
          </div>
          <h2 className="mb-2 font-heading text-[1.4rem] font-normal text-background">
            Self-Portrait
          </h2>
          <p className="mb-5 text-[0.9rem] leading-relaxed text-[#999]">
            Every assessment you&apos;ve completed, in one place — tracked automatically in this
            browser, no login required.
          </p>
          <Link
            href="/self-portrait"
            className="inline-flex items-center gap-2 rounded-full border border-brand-gold-light/40 px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.12em] text-brand-gold-light uppercase"
          >
            <span>View Self-Portrait</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="relative z-1 mx-auto mt-12 max-w-130 px-6 pb-4 text-center">
        <p className="mb-3 text-[0.9rem] text-muted-foreground">Connect with Tony</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/pick-up-the-phone"
            className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] tracking-[0.1em] text-brand-gold"
          >
            <Phone aria-hidden="true" className="size-3.5" />
            Pick Up the Phone
          </Link>
          <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] tracking-[0.1em] text-muted-foreground">
            <Bot aria-hidden="true" className="size-3.5" />
            Ask FauxTony
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.55rem] uppercase">
              Coming Soon
            </span>
          </span>
        </div>
      </section>

      <section className="relative z-1 px-6 pb-16 text-center">
        <p className="font-mono text-[0.65rem] tracking-[0.08em] text-muted-foreground/70">
          All assessments are free · Your data is never sold · Results delivered immediately ·{" "}
          {FIND_MY_LIVE} live now, {FIND_MY_COMING} coming soon
        </p>
      </section>
    </div>
  );
}
