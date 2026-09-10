import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CaseShareButtons } from "@/components/marketing/case-share-buttons";
import { DownloadProtocolButton } from "@/components/alex-azzi/download-protocol-button";
import {
  SUBJECT,
  IMG,
  TOC,
  RED_FLAGS,
  SOL_CARDS,
  EVIDENCE_TOTALS,
  TIMELINE,
  EVIDENCE_ROWS,
  SMOKING_GUN,
  PLAYBOOK_STEPS,
  PLAYBOOK_QUOTE,
  MAP_PINS,
  ESCALATION_SPECTRUM,
  VERIFICATION_STEPS,
  SCAM_RESOURCES,
  RETRIBUTION_LEDGER,
  FEATURED_Q,
  QUESTIONS_10,
  HEALING_FRAMEWORK,
  BYRON_KATIE_APPLIED,
  KEY_FACTS,
  FAQ,
  ECOSYSTEM_LINKS,
  LEGAL_NOTICES,
} from "@/lib/content/alex-azzi";

// Ported from legacy client/src/pages/CheshireGrin.tsx (2608 lines) — the
// "VerifiedTribe Community Protection Report" on Alex Azzi, CEO of
// XRWorkout. Same content class as /protecting-your-business (a
// documented, evidence-cited public case file about a named individual);
// this port follows that page's already-established conventions rather
// than inventing new ones — Tailwind classes instead of legacy's `S:
// Record<string, React.CSSProperties>` inline-style system, real
// generateMetadata, a plain "jump to section" TOC instead of the sticky
// scroll-spy nav + parallax + IntersectionObserver fade-ins legacy used
// throughout (same simplification protecting-your-business already made
// to ITS legacy source's floating TOC — same real navigation, less
// machinery). Every factual claim below — dollar figures, dates, quoted
// admissions — is copied verbatim from SUBJECT/DATA in the legacy file.
//
// Legacy registered this exact component at BOTH /alex-azzi and
// /cheshire-grin with no redirect between them (see App.tsx's
// StandaloneRouter). This migration picks /alex-azzi as canonical — it's
// the name people searching for this report are actually looking for,
// which matters more for a warning page than "cheshire-grin" ever did —
// and 308-redirects /cheshire-grin to it via next.config.ts, matching the
// /find-my-tribe-style duplicate-route redirect pattern already
// established there (avoids shipping duplicate-content pages at two URLs).
//
// Dropped, matching protecting-your-business's own precedent for backend-
// dependent legacy features:
// - The "RESTRICTED ACCESS" password gate (hardcoded client-side password
//   "alexscam"). This isn't a backend dependency, it's a plain judgment
//   call: it provided no real access control (a hardcoded string compare,
//   trivially bypassed) and directly contradicted the rest of the page —
//   which ships share buttons, Article+FAQPage schema, and
//   `indexable={true}` SEO metadata all built for public discovery. A
//   gate that blocks the exact audience the page is built to reach reads
//   as leftover test scaffolding, not an intended feature. Flagged for
//   Tony to confirm in the human-review notes.
// - The Byron Katie Verification Gate (modal) and the "Submission Form +
//   Community Collection" — both existed to gate/power a
//   `trpc.cheshire.submit` mutation this migration has no backend for.
//   Replaced with a real `mailto:` invitation, identical in spirit to
//   protecting-your-business's own "Share Your Story" mailto CTA.
// - The Endorsement/"Ring the Bell" system (`trpc.endorsement.count` /
//   `.submit`) — a live community-verification counter with no backend to
//   back it. Legacy's hero copy asserted "7 testimonials received" as
//   static fact alongside a counter that would render 0 with no backend;
//   porting that number as if it were a fixed historical fact (like the
//   $137K figure) would be inventing a claim this port can't verify, so
//   the whole endorsement UI and that claim are dropped rather than
//   faked. Flagged for Tony to confirm.
// - `SubmissionCounter` ("N community members have contributed") — tied
//   to the same dropped submission backend.
// - Sticky scroll-spy nav, scroll-progress bar, and per-section parallax
//   `transform: translateY(scrollY * n)` effects — replaced with the
//   plain TOC below; same real navigation, less machinery, and it lets
//   this page stay a Server Component per this repo's own rule.
//
// Kept as real, backend-free features: the SunlightProtocol .txt download
// (pure client-side blob download, no server call — see
// DownloadProtocolButton; legacy's email field in front of it was never
// actually submitted anywhere either, so the fake collection step is
// dropped and the real download stays).
//
// Legacy's SUBJECT.photo (`/api/img/cheshire-orig_9554dcb8.jpg`) is a
// Manus-hosted path, banned even temporarily per CONTRIBUTING's
// zero-Manus rule. Unlike protecting-your-business (whose subject photo
// was already on the allowlisted CloudFront host), no real photo of Alex
// Azzi is available to re-host — no image-generation tool is connected in
// this environment, and rescuing/uploading a real photo to Sanity is
// outside this task's scope. An initials avatar is used in its place;
// flagged for Tony to supply a real photo if he has one.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";

export const metadata: Metadata = {
  title: "Alex Azzi, CEO of XRWorkout — $137,000+ Documented in Unpaid Invoices",
  description:
    "Alex Azzi, CEO of XRWorkout and founder of Biohackers UAE, has $137,000+ in documented unpaid invoices and unfulfilled equity agreements spanning 6 years. Signed contracts, timestamped invoices, and a calculable path to resolution.",
  alternates: { canonical: "/alex-azzi" },
  keywords: [
    "Alex Azzi",
    "Alex Azzi XRWorkout",
    "Alex Azzi fraud",
    "Alex Azzi Biohackers UAE",
    "XRWorkout CEO",
    "Biohackers UAE",
    "VerifiedTribe community protection report",
    "startup unpaid invoices",
    "founder fraud red flags",
  ],
  openGraph: {
    title: "Alex Azzi — XRWorkout CEO & Biohackers UAE Founder",
    description:
      "A documented VerifiedTribe community protection report: $137,000+ in unpaid invoices and unfulfilled equity agreements over 6 years.",
    images: [IMG.ogImage],
    type: "article",
  },
};

const TAG_HIGHLIGHT = "Unpaid Invoices";

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mt-14 scroll-mt-20">
      <p className="mb-1.5 font-mono text-xs tracking-[0.2em] text-red-800 uppercase">
        Section {num}
      </p>
      <h2 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 max-w-prose leading-[1.85] text-foreground/80">{children}</p>;
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1 rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
      [{children}]
    </span>
  );
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-red-800/25 border-l-4 border-l-red-800 bg-red-800/5 p-6 leading-[1.8] text-red-950 dark:text-red-200">
      {children}
    </div>
  );
}

function OpinionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-amber-700/25 border-l-4 border-l-amber-700 bg-amber-700/5 p-6">
      <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-amber-800 uppercase">
        Author&apos;s Opinion
      </div>
      <div className="leading-[1.8] text-amber-950 dark:text-amber-200">{children}</div>
    </div>
  );
}

function HealBox({
  children,
  title = "The Path Back",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-6 rounded-md border border-green-700/25 border-l-4 border-l-green-700 bg-green-700/5 p-6">
      <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-green-800 uppercase">
        {title}
      </div>
      <div className="leading-[1.8] text-green-950 dark:text-green-200">{children}</div>
    </div>
  );
}

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div className="my-6 rounded-md border border-amber-700/25 border-l-4 border-l-amber-700 bg-amber-700/5 p-7">
      <div className="mb-3 text-lg leading-relaxed text-amber-950 italic dark:text-amber-200">
        &quot;{quote}&quot;
      </div>
      <div className="font-mono text-xs tracking-wide text-amber-800 uppercase">
        — {attribution}
      </div>
    </div>
  );
}

function NumberedItem({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex gap-4">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-800 font-mono text-xs font-bold text-white">
        {String(num).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground">{title}</h3>
        <div className="leading-[1.85] text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

function Badge({
  children,
  variant = "red",
}: {
  children: React.ReactNode;
  variant?: "red" | "amber" | "green";
}) {
  const cls =
    variant === "red" ? "bg-red-800" : variant === "amber" ? "bg-amber-700" : "bg-green-700";
  return (
    <span
      className={`rounded-sm px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-wide text-white uppercase ${cls}`}
    >
      {children}
    </span>
  );
}

const SOL_BORDER: Record<string, string> = {
  "red-800": "border-red-800",
  "amber-700": "border-amber-700",
  "green-700": "border-green-700",
};
const SOL_TEXT: Record<string, string> = {
  "red-800": "text-red-800",
  "amber-700": "text-amber-800",
  "green-700": "text-green-800",
};
const SOL_BAR: Record<string, string> = {
  "red-800": "bg-red-800",
  "amber-700": "bg-amber-700",
  "green-700": "bg-green-700",
};
const SOL_WIDTH: Record<number, string> = { 97: "w-[97%]", 63: "w-[63%]", 19: "w-[19%]" };

const STRENGTH_BADGE: Record<string, string> = {
  IRONCLAD: "bg-foreground text-background",
  STRONG: "bg-amber-700 text-white",
  DOCUMENTED: "bg-secondary text-foreground",
};

const SHARE_TEXT =
  "VerifiedTribe Community Protection Report: Alex Azzi, CEO of XRWorkout, has $137,000+ documented in unpaid invoices and unfulfilled equity agreements over 6 years. Signed contracts, timestamped invoices, full documentation:";

export default function AlexAzziPage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div className="mb-6 rounded-md bg-red-800/10 py-3 text-center font-mono text-xs font-bold tracking-[0.2em] text-red-800 uppercase">
          VerifiedTribe Community Protection Report — Case File {SUBJECT.caseNumber}
        </div>

        <h1 className="mx-auto mb-3 max-w-2xl text-center font-heading text-3xl leading-tight font-black text-foreground sm:text-4xl">
          Alex Azzi Owes {SUBJECT.totalDocumented}. He Hasn&apos;t Paid. This Is the Documentation.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-center text-foreground/70">
          Alex Azzi is the CEO of XRWorkout, a VR fitness startup, and the founder of Biohackers
          UAE. This is a documented case of unpaid invoices and unfulfilled equity agreements
          spanning {SUBJECT.yearsOfPattern} years — signed contracts, timestamped invoices, and a
          written admission of a shortfall. Built on the SunlightProtocol: verify, don&apos;t
          gossip; document, don&apos;t destroy; offer a path back.
        </p>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap">
            <div className="flex h-85 w-full shrink-0 flex-col items-center justify-center gap-3 bg-red-800/10 sm:w-75">
              <div className="flex size-32 items-center justify-center rounded-full border-4 border-red-800 bg-card font-heading text-4xl font-black text-red-800">
                AA
              </div>
              <div className="text-center">
                <div className="font-mono text-sm font-extrabold tracking-[0.2em] text-red-800 uppercase">
                  Community Protection Report
                </div>
                <div className="mt-0.5 font-mono text-[0.6rem] tracking-wide text-muted-foreground">
                  No verified photo on file
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center p-8">
              <h2 className="mb-1 font-heading text-3xl font-black text-foreground">
                {SUBJECT.name}
              </h2>
              <div className="mb-5 font-mono text-xs text-muted-foreground">
                {SUBJECT.title} &bull; {SUBJECT.aliases.join(" · ")}
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                {SUBJECT.tags.map((tag) => (
                  <Badge key={tag} variant={tag === TAG_HIGHLIGHT ? "red" : "amber"}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Documented", value: SUBJECT.totalDocumented, highlight: true },
                  { label: "Principal Owed", value: SUBJECT.principalOwed, highlight: true },
                  { label: "Total Paid, Ever", value: SUBJECT.totalPaid, highlight: false },
                  { label: "Equity Owed", value: SUBJECT.equityOwed, highlight: false },
                  {
                    label: "Years of Pattern",
                    value: String(SUBJECT.yearsOfPattern),
                    highlight: false,
                  },
                  { label: "Case File", value: SUBJECT.caseNumber, highlight: false },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">
                      {f.label}
                    </div>
                    <div
                      className={`font-heading text-lg font-bold ${f.highlight ? "text-red-800" : "text-foreground"}`}
                    >
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-red-800/20 bg-red-800/5 px-8 py-5 leading-[1.8] text-red-950 dark:text-red-200">
            A signed statement of work. Three unpaid invoices. A written admission of a $10,000
            shortfall. $200,000 in the bank while a $50,000 invoice sat unpaid. This is not an
            allegation. This is a paper trail.
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
            Share This — Before Their Next Handshake
          </p>
          <CaseShareButtons path="/alex-azzi" shareText={SHARE_TEXT} />
        </div>

        <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
          Documented by Tony Greenberg &bull; {SUBJECT.datePublished} &bull; Updated Continuously
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-6 sm:px-10">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-y border-border py-4 text-center">
          {TOC.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="font-mono text-xs text-brand-gold">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-16 sm:px-10">
        <div className="mb-10 rounded-md border border-amber-700/25 bg-amber-700/5 p-7">
          <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-amber-800 uppercase">
            VerifiedTribe Principles
          </div>
          <div className="text-lg leading-relaxed font-medium text-amber-950 dark:text-amber-200">
            We found them inside our community. We are the VerifiedTribe. Scammers. Cheats. Bad
            actors. We&apos;ve seen it all. Gossip is the most dangerous thing on earth — Reddit is
            a festering pool of anonymous stench, dating red-flag boards are echo chambers,
            underground revenge sites are cesspools. We are none of those things. We don&apos;t
            believe. We verify. We don&apos;t destroy. We document. We don&apos;t trap. We offer a
            path back. Standing idle is complicit. Recklessness is destructive. Verification is the
            middle way.
          </div>
          <p className="mt-4 text-sm leading-[1.8] text-amber-900/80 dark:text-amber-200/70">
            Inspired by Byron Katie&apos;s{" "}
            <a
              href="https://thework.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              The Work
            </a>{" "}
            and the ethical technology framework of Tristan Harris &amp; Aza Raskin at the{" "}
            <a
              href="https://www.humanetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Center for Humane Technology
            </a>
            . We are not interested in beliefs. We are interested in facts — time-tested and true.
          </p>
        </div>

        {/* ============ THE CASE ============ */}
        <Section id="case" num="01" title="The Case Against Alex Azzi">
          <P>
            <strong className="text-foreground">Alex Azzi</strong> signed RampRate&apos;s statement
            of work on January 21, 2022.<Cite>SOW, Jan 21, 2022</Cite> Terms: a $75,000 cash fee
            plus 3% + up to 2% equity in XRWorkout. Payment due within 10 days. Late payments accrue
            1.5% per month.
          </P>
          <P>
            The first invoice — <strong className="text-red-800">$25,000</strong>, submitted March
            2022 — was partially paid: <strong className="text-foreground">$15,000</strong>, once,
            ever.<Cite>Payment records</Cite> That $15,000 is the only money RampRate has ever
            received from Azzi against a $75,000 cash commitment, plus equity that was never
            transferred. Change Order 1, signed in May 2022, acknowledged the resulting $10,000
            shortfall in writing and promised payment within 10 business days.
            <Cite>Change Order 1, May 2022</Cite> It was never paid.
          </P>
          <P>
            Invoice #2 ($50,000, January 2023) and Invoice #3 ($50,000, December 2024) were both
            issued on net-10 terms and both went unpaid.<Cite>Collections notices</Cite> In July
            2023, an internal update recorded that XRWorkout had $200,000 in the bank and declined
            to pay the $50,000 owed — offering a $10,000/month re-engagement instead.
            <Cite>Internal CSO update, July 2023</Cite>
          </P>
          <OpinionBox>
            The pattern — a signed contract, a partial payment followed by a written admission of
            shortfall, capital available while invoices went unpaid, and a re-engagement offer in
            place of settling the original debt — suggests a deliberate, practiced methodology.
            Reasonable people can draw their own conclusions from the documented record.
          </OpinionBox>

          <h3 className="mt-10 mb-4 font-heading text-lg font-bold text-foreground">
            Statute-of-Limitations Status Per Invoice
          </h3>
          <P>
            California law gives written contract claims a 4-year window. This is public
            information, not legal advice.
          </P>
          <div className="my-6 grid gap-4 sm:grid-cols-3">
            {SOL_CARDS.map((c) => (
              <div
                key={c.invoice}
                className={`rounded-md border-2 ${SOL_BORDER[c.colorClass]} bg-card p-5`}
              >
                <div
                  className={`mb-2 font-mono text-xs font-bold tracking-wide uppercase ${SOL_TEXT[c.colorClass]}`}
                >
                  {c.status}
                </div>
                <div className="mb-1 font-heading text-sm font-bold text-foreground">
                  {c.invoice} &middot; {c.date} &middot; {c.amount}
                </div>
                {c.paid && (
                  <div className="mb-2 font-mono text-xs font-bold text-red-800">
                    Paid: {c.paid} — the only money ever received
                  </div>
                )}
                <div className="h-3 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className={`h-full rounded-full ${SOL_BAR[c.colorClass]} ${SOL_WIDTH[c.pct]}`}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-muted-foreground">
                  <span>Breach ~{c.breachDate}</span>
                  <span>SOL Closes ~{c.solClose}</span>
                </div>
                <div className="mt-3 text-sm text-foreground/80">{c.note}</div>
              </div>
            ))}
          </div>

          <div className="my-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {EVIDENCE_TOTALS.map((d) => (
              <div key={d.label} className="bg-card p-5 text-center">
                <div className="font-heading text-2xl font-black text-red-800">{d.val}</div>
                <div className="mt-1 font-mono text-[0.65rem] font-bold tracking-wide text-foreground uppercase">
                  {d.label}
                </div>
                <div className="mt-1 font-mono text-[0.6rem] text-muted-foreground">{d.sub}</div>
              </div>
            ))}
          </div>

          <div className="relative my-8 overflow-hidden rounded-md">
            <Image
              src={IMG.vault}
              alt="An empty vault, illustrating money owed but never paid"
              width={1200}
              height={700}
              className="w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 to-transparent p-6">
              <p className="max-w-md font-mono text-sm text-foreground italic">
                $200,000 in the bank. $50,000 owed. The vault was never empty — the intention was.
              </p>
            </div>
          </div>

          <QuoteBlock quote={SMOKING_GUN.quote} attribution={SMOKING_GUN.source} />

          <h3 className="mt-10 mb-4 font-heading text-lg font-bold text-foreground">
            What the Documents Prove
          </h3>
          <div className="my-6 overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-800/5">
                  {["Claim", "Source", "Strength"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-xs tracking-wide text-red-800 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVIDENCE_ROWS.map((r) => (
                  <tr key={r.claim} className="border-t border-border align-top">
                    <td className="px-4 py-2.5 font-semibold text-foreground">{r.claim}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {r.source}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-wide uppercase ${STRENGTH_BADGE[r.strength]}`}
                      >
                        {r.strength}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ============ SUNLIGHT PROTOCOL ============ */}
        <Section id="protocol" num="02" title="The SunlightProtocol — Before You Speak, Be Sure">
          <P>
            Gossip destroys lives. Unverified claims ruin innocent people. But silence enables
            predators. This 8-step protocol is the ethical middle ground this platform requires
            every report to pass through before publication. No exceptions.
          </P>

          <div className="my-6 rounded-md border border-border bg-card p-6">
            <div className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
              The Escalation Spectrum — Why Silence Is Not an Option
            </div>
            <div className="flex flex-col gap-3">
              {ESCALATION_SPECTRUM.map((level) => (
                <div
                  key={level.level}
                  className="border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="mb-1 font-mono text-xs font-bold tracking-wide text-foreground uppercase">
                    {level.level}
                  </div>
                  <div className="text-sm text-foreground/80">{level.description}</div>
                  <div className="mt-0.5 font-mono text-xs text-red-800">{level.risk}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-[1.8] text-foreground/70 italic">
              Bernie Madoff stole $65 billion over decades. Everyone suspected. Nobody verified.
              Nobody spoke. Romance scammers extracted $1.16 billion in just 9 months of 2025. The
              pattern is always the same: silence enables escalation. But the answer is never gossip
              — it&apos;s verified, documented, consequential truth.
            </p>
          </div>

          {VERIFICATION_STEPS.map((step) => (
            <NumberedItem key={step.num} num={step.num} title={step.title}>
              {step.text}
              <div className="mt-1 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                Gate: {step.gate}
              </div>
            </NumberedItem>
          ))}

          <div className="my-6 rounded-md border border-border bg-card p-6">
            <div className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
              Official Reporting Channels — Use These First
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SCAM_RESOURCES.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-border p-3 hover:border-red-800/40"
                >
                  <div className="font-semibold text-foreground">{r.name}</div>
                  <div className="mt-0.5 text-sm text-muted-foreground">{r.description}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <DownloadProtocolButton />
          </div>
        </Section>

        {/* ============ RED FLAGS ============ */}
        <Section id="red-flags" num="03" title="8 Red Flags Every Community Should Memorize">
          <P>
            These patterns repeat across industries, geographies, and deal sizes. If you recognize
            even three of these in a single relationship, stop. Get everything in writing. And
            consider walking away.
          </P>
          {RED_FLAGS.map((rf, i) => (
            <NumberedItem key={rf.flag} num={i + 1} title={rf.flag}>
              <strong className="text-red-800">The lesson:</strong> {rf.lesson}
            </NumberedItem>
          ))}
        </Section>

        {/* ============ PLAYBOOK ============ */}
        <Section
          id="playbook"
          num="04"
          title="The Playbook — This Is Not an Accident. It Is a Strategy."
        >
          <P>
            Across multiple engagements, the same six-step pattern emerges. This is not
            incompetence. It is a playbook. Learn it. Recognize it. Protect yourself.
          </P>
          <div className="relative my-8 overflow-hidden rounded-md">
            <Image
              src={IMG.vanish}
              alt="A vanishing act, illustrating the empty chair after an invoice is due"
              width={1200}
              height={700}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center bg-linear-to-r from-background/95 via-background/40 to-transparent p-6">
              <div className="max-w-sm">
                <div className="font-heading text-xl font-black text-foreground">
                  The Empty Chair. The Dissolving Card.
                </div>
                <p className="mt-2 text-sm text-foreground/70 italic">
                  He was here. The meeting happened. The handshake was real. But when the invoice
                  arrives, the chair is empty and the business card turns to smoke.
                </p>
              </div>
            </div>
          </div>
          {PLAYBOOK_STEPS.map((s) => (
            <NumberedItem key={s.num} num={s.num} title={s.title}>
              {s.text}
            </NumberedItem>
          ))}
          <QuoteBlock quote={PLAYBOOK_QUOTE.text} attribution={PLAYBOOK_QUOTE.attribution} />
        </Section>

        {/* ============ TIMELINE ============ */}
        <Section
          id="timeline"
          num="05"
          title={`A ${SUBJECT.yearsOfPattern}-Year Paper Trail of Broken Promises`}
        >
          <div className="relative border-l-2 border-red-800/30 pl-6">
            {TIMELINE.map((item) => (
              <div key={item.date + item.title} className="relative mb-7">
                <div className="absolute top-1 -left-[1.9rem] size-4 rounded-full border-2 border-red-800 bg-background" />
                <div className="mb-1.5 font-mono text-xs font-semibold tracking-wide text-amber-800 uppercase">
                  {item.date}
                </div>
                <h3 className="mb-1 font-heading text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="leading-[1.8] text-foreground/80">{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ WHERE IN THE WORLD ============ */}
        <Section id="where" num="06" title={`Where in the World Is ${SUBJECT.name}?`}>
          <P>
            He moves. He networks. He speaks at conferences. He shakes hands. If you see him at any
            of these events, now you know what questions to ask — and to get the answers in writing.
          </P>
          <div className="grid gap-4 sm:grid-cols-2">
            {MAP_PINS.map((p) => (
              <div
                key={p.city + p.event}
                className="rounded-md border-l-4 border-l-red-800 bg-card p-4"
              >
                <div className="font-heading text-sm font-bold text-foreground">{p.city}</div>
                <div className="mt-0.5 font-mono text-xs font-semibold tracking-wide text-red-800 uppercase">
                  {p.event}
                </div>
                <div className="mt-1 text-sm text-foreground/80">{p.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ PERSONAL NOTE ============ */}
        <Section id="note" num="07" title="A Personal Note from Tony Greenberg">
          <P>
            I don&apos;t do this. In 25 years building RampRate, I have never published a warning
            like this for a $75,000 debt. I&apos;ve eaten worse. I&apos;ve absorbed uglier
            situations quietly. I give 90% of what I earn away.
          </P>
          <P>
            But I took Alex on because a kind, trusted friend introduced us. He begged. He pleaded.
            He had genuine potential and a genuinely cool product. My team believed in him. We
            worked. We delivered. We made introductions that opened real doors.
          </P>
          <P>
            And then he decided that $200,000 in his bank account was more important than honoring a
            signed contract with the people who helped put him on the map.
          </P>
          <P>
            This isn&apos;t about the money anymore. This is about protecting the next person — the
            next kind friend, the next advisor, the next vendor — from the pattern. Because the
            smile never stops, even when he doesn&apos;t respond to your emails, even when he dodges
            your calls.
          </P>
          <OpinionBox>
            Shame on you, Alex. Not just to me — to your parents, to your community, to every person
            who invested their time, energy, and belief in you. Pay your bills. Say you&apos;re
            sorry. Figure it out.
          </OpinionBox>
        </Section>

        {/* ============ PATH BACK / LEDGER ============ */}
        <Section id="path-back" num="08" title={RETRIBUTION_LEDGER.title}>
          <P>
            {RETRIBUTION_LEDGER.subtitle} Every condition below is public. Complete them all —
            verified by an independent third party — and this report comes down. That&apos;s the
            deal. Apologies without action are worthless.{" "}
            <Link href="/blog/apologize" className="text-brand-gold underline">
              Read why.
            </Link>
          </P>
          {RETRIBUTION_LEDGER.categories.map((cat) => (
            <div key={cat.id} className="my-6 rounded-md border border-border bg-card p-6">
              <h3 className="mb-1 font-heading text-lg font-bold text-foreground">{cat.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{cat.description}</p>
              <div className="flex flex-col gap-3">
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-background/50 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm text-foreground">{item.label}</div>
                      <div className="mt-0.5 font-mono text-xs text-amber-800">{item.value}</div>
                    </div>
                    <span
                      className={`rounded-sm px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-wide uppercase ${
                        item.status === "partial"
                          ? "bg-amber-700/15 text-amber-800"
                          : "bg-red-800/15 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              {"blogLink" in cat && cat.blogLink && (
                <Link
                  href={cat.blogLink.href}
                  className="mt-4 inline-block text-sm text-brand-gold underline"
                >
                  {cat.blogLink.text}
                </Link>
              )}
            </div>
          ))}
          <HealBox>{RETRIBUTION_LEDGER.removalConditions}</HealBox>
        </Section>

        {/* ============ HAS THIS HAPPENED TO YOU ============ */}
        <Section id="evidence-collection" num="09" title="Has This Happened to You?">
          <P>
            We are not conducting a smear campaign. We are building a community evidence record. If
            you recognize this pattern from your own experience with {SUBJECT.name}, your story
            strengthens the record and protects the next person.
          </P>
          <div className="my-6 rounded-md border-2 border-red-800/25 bg-card p-6">
            <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-red-800 uppercase">
              Featured Question
            </div>
            <div className="font-heading text-lg font-semibold text-foreground">{FEATURED_Q}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUESTIONS_10.map((q, i) => (
              <div
                key={q}
                className="flex gap-3 rounded-md border-l-4 border-l-red-800 bg-card p-4"
              >
                <span className="shrink-0 font-heading text-lg font-black text-red-800/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-foreground/80">{q}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-md border border-red-800/20 bg-red-800/5 p-6 text-center">
            <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
              Add to the Record
            </h3>
            <p className="mx-auto mb-4 max-w-md text-foreground/70">
              Your identity is never published without explicit written consent. Every account
              strengthens the evidentiary record and protects the next person.
            </p>
            <a
              href="mailto:tony@ramprate.com?subject=Alex%20Azzi%20Report%20Submission"
              className="inline-block rounded-md bg-red-800 px-6 py-2.5 font-mono text-xs font-semibold tracking-wide text-white uppercase"
            >
              Share Your Story <ForwardIcon aria-hidden="true" />
            </a>
          </div>
        </Section>

        {/* ============ HEALING FRAMEWORK ============ */}
        <Section
          id="healing"
          num="10"
          title="Protect Others. Heal Our Community. Become Who We Want to Become."
        >
          <P>
            This is not just about one person or one debt. This is about the kind of community we
            choose to build in a time of massive transformation — when we don&apos;t know what the
            outcome of the human race is, but we know that integrity, accountability, and collective
            protection are non-negotiable foundations.
          </P>
          <div className="grid gap-4 sm:grid-cols-3">
            {HEALING_FRAMEWORK.map((p) => (
              <div
                key={p.title}
                className="rounded-md border border-green-700/20 bg-green-700/5 p-5"
              >
                <div className="mb-1 font-heading text-lg font-bold text-green-800">{p.title}</div>
                <div className="text-sm text-foreground/80">{p.text}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ DOING THE WORK ============ */}
        <Section id="the-work" num="11" title="Doing The Work on Alex Azzi">
          <P>
            Before anyone shares or endorses this report, they should do{" "}
            <a
              href="https://thework.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              The Work
            </a>{" "}
            — Byron Katie&apos;s four questions, applied directly to this case.
          </P>
          {BYRON_KATIE_APPLIED.map((item) => (
            <div
              key={item.num}
              className="my-4 rounded-md border-l-4 border-l-amber-700 bg-card p-6"
            >
              <div className="mb-2 font-heading text-lg font-bold text-foreground">{item.q}</div>
              <div className="leading-[1.8] text-foreground/80">{item.work}</div>
            </div>
          ))}
        </Section>

        {/* ============ ABOUT & FAQ ============ */}
        <Section id="about" num="12" title={`Who Is ${SUBJECT.name}?`}>
          <P>
            Alex Azzi is an entrepreneur based in the United Arab Emirates who operates at the
            intersection of VR fitness, biohacking, and the startup ecosystem. He is the CEO of
            XRWorkout and the founder of Biohackers UAE. He has appeared as a speaker at technology
            and startup conferences across the Middle East and Europe.
          </P>
          <div className="my-6 grid gap-3 rounded-md border border-border bg-card p-6 sm:grid-cols-2">
            {KEY_FACTS.map((fact) => (
              <div key={fact.label} className="border-l-2 border-l-brand-gold pl-3">
                <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {fact.label}
                </div>
                <div className="font-semibold text-foreground">{fact.value}</div>
              </div>
            ))}
          </div>
          <P>
            <strong className="text-foreground">XRWorkout</strong> is a VR fitness company led by
            Alex Azzi that develops immersive virtual reality workout experiences.{" "}
            <strong className="text-foreground">Biohackers UAE</strong> is a biohacking community
            and organization he founded, focused on health optimization, longevity, and biohacking
            practices in the United Arab Emirates, operating under the brand Biohack.ae.
          </P>
          <AlertBox>
            Alex Azzi is the subject of a VerifiedTribe community protection report documenting{" "}
            {SUBJECT.totalDocumented} in unpaid invoices and unfulfilled equity agreements spanning{" "}
            {SUBJECT.yearsOfPattern} years. The documentation includes signed contracts, timestamped
            invoices, and email correspondence.
          </AlertBox>

          <h3 className="mt-10 mb-4 font-heading text-lg font-bold text-foreground">
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-3">
            {FAQ.map((faq) => (
              <div key={faq.q} className="rounded-md border border-border bg-card p-5">
                <div className="mb-1.5 font-heading font-bold text-foreground">{faq.q}</div>
                <div className="text-sm leading-[1.7] text-foreground/80">{faq.a}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ ECOSYSTEM LINKS ============ */}
        <Section id="reading" num="13" title="This Is Part of a Larger Journey">
          <P>
            Community protection is one facet of finding your truth, your purpose, and your
            identity. These assessments and essays map to the same mission — helping you see
            clearly, act with integrity, and build something that matters.
          </P>
          <div className="grid gap-4 sm:grid-cols-2">
            {ECOSYSTEM_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md border border-border bg-card p-5 hover:border-red-800/30"
              >
                <div className="mb-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {link.tag}
                </div>
                <div className="mb-1 font-heading font-bold text-foreground">{link.title}</div>
                <div className="text-sm text-foreground/70">{link.desc}</div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ============ LEGAL FOOTER ============ */}
        <div className="mt-14 rounded-md border border-border bg-card p-7">
          <div className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
            Legal &amp; Ethical Standards
          </div>
          <div className="flex flex-col gap-4">
            {LEGAL_NOTICES.map((item) => (
              <div
                key={item.title}
                className="border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <div className="mb-1 font-heading font-bold text-foreground">{item.title}</div>
                <div className="text-sm leading-[1.8] text-muted-foreground">{item.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md border border-border bg-background/50 p-5 text-sm leading-[1.8] text-muted-foreground">
            <strong className="text-foreground/80">Disclaimer:</strong> This page constitutes
            protected opinion and commentary based on documented business interactions. It is not
            legal advice. Readers should conduct their own due diligence before entering into any
            business relationship. If you believe any factual claim on this page is inaccurate,
            please contact us with supporting documentation and we will review and correct the
            record.
          </div>
          <div className="mt-6 text-center font-mono text-xs text-muted-foreground">
            VerifiedTribe &middot; SunlightProtocol &middot; Case File {SUBJECT.caseNumber} &middot;
            Published {SUBJECT.datePublished}
            <br />
            Author: Tony Greenberg &middot;{" "}
            <a
              href="https://ramprate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold"
            >
              RampRate.com
            </a>
          </div>
        </div>

        <div className="mt-12 rounded-md border border-red-800/25 bg-red-800/5 p-8 text-center">
          <div className="mb-2 font-heading text-xl font-black text-red-800">
            Make Sure the Next Person Finds This First
          </div>
          <p className="mx-auto mb-5 max-w-md text-foreground/80">
            Every share makes it harder for this pattern to repeat in the dark. Ten seconds.
          </p>
          <CaseShareButtons filled path="/alex-azzi" shareText={SHARE_TEXT} />
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/" className="font-mono text-sm tracking-wide text-brand-gold">
          <BackIcon aria-hidden="true" /> Back to the Essays
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline:
                "Alex Azzi — CEO of XRWorkout, Founder of Biohackers UAE | Community Protection Report",
              description: `Who is Alex Azzi? CEO of XRWorkout (VR fitness), founder of Biohackers UAE, startup speaker. Community protection report documenting ${SUBJECT.totalDocumented} in unpaid invoices.`,
              author: { "@type": "Person", name: "Tony Greenberg", url: SITE_URL },
              publisher: { "@type": "Organization", name: "RampRate" },
              datePublished: "2026-03-15",
              mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/alex-azzi` },
              about: {
                "@type": "Person",
                name: "Alex Azzi",
                jobTitle: "CEO of XRWorkout",
                description:
                  "Alex Azzi is the CEO of XRWorkout, a VR fitness company, and the founder of Biohackers UAE.",
                worksFor: { "@type": "Organization", name: "XRWorkout" },
                memberOf: { "@type": "Organization", name: "Biohackers UAE" },
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]),
        }}
      />
    </div>
  );
}
