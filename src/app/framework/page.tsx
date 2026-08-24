import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Layers, Zap, Lightbulb, Shield } from "lucide-react";
import { FrameworkStepCard, type FrameworkStep } from "@/components/marketing/framework-step-card";

// Ported from legacy client/src/pages/LeadMagnet.tsx ("How I'd Approach Your
// Problem"). The 5-step framework itself — steps, prompts, real-world
// examples — is real, unchanged content. The legacy email-gated "download
// the worksheet" form posted to a tRPC subscribe mutation and didn't
// actually attach or send a real PDF even in the source (it just showed a
// success message) — a backend/CRM feature with no real deliverable behind
// it, out of this migration's "no backend features" scope. Replaced with a
// direct, honest CTA to /pick-up-the-phone instead of reproducing a form
// that doesn't deliver anything.

export const metadata: Metadata = {
  title: "How I'd Approach Your Problem",
  description:
    "A 5-step framework for diagnosing complex business problems. Twenty-five years of pattern recognition distilled into questions worth asking.",
  alternates: { canonical: "/framework" },
};

const ICON_PROPS = { size: 22, className: "text-brand-gold" } as const;

const FRAMEWORK_STEPS: FrameworkStep[] = [
  {
    num: "01",
    title: "Name the Real Problem",
    subtitle: "Not the symptom. The structure.",
    icon: <Target {...ICON_PROPS} />,
    description:
      "Most people come to me with a symptom: costs are too high, a vendor is underperforming, the board is nervous. The first thing I do is refuse to solve that problem. Instead, I ask: what system produced this outcome? What incentive structure made this inevitable? You can't fix a leak by mopping the floor.",
    prompt: "What keeps happening despite your best efforts to stop it?",
    example:
      "A Fortune 500 company came to me saying their cloud costs were 40% over budget. The real problem wasn't cloud costs — it was that procurement, engineering, and finance had never been in the same room together. Three departments optimizing for three different metrics. The cloud bill was just the scoreboard.",
  },
  {
    num: "02",
    title: "Map the Stakeholders",
    subtitle: "Who benefits from the status quo?",
    icon: <Layers {...ICON_PROPS} />,
    description:
      "Every problem persists because someone is profiting from it. Not maliciously — structurally. The vendor who overcharges you has a quota. The consultant who extends the engagement has a mortgage. The internal champion who chose the failing platform has a reputation. Until you map who wins and who loses from change, you're negotiating in the dark.",
    prompt: "Who would be uncomfortable if this problem disappeared overnight?",
    example:
      "In a $200M infrastructure deal, I mapped 14 stakeholders across 3 organizations. Seven of them had financial incentives to maintain the current arrangement. We didn't fight them — we redesigned the incentive structure so alignment became more profitable than resistance.",
  },
  {
    num: "03",
    title: "Find the Leverage Point",
    subtitle: "Where does a small push create a large shift?",
    icon: <Zap {...ICON_PROPS} />,
    description:
      "Donella Meadows taught me that systems have leverage points — places where a small intervention produces disproportionate change. Most people push on the wrong part of the system. They negotiate harder on price when the real leverage is in contract structure. They hire more people when the real leverage is in process design. Find the fulcrum.",
    prompt: "If you could change only one thing, what would unlock everything else?",
    example:
      "A media company was spending $8M/year on content delivery and wanted to negotiate a 15% discount. Instead, I looked at their traffic patterns and found that 60% of their bandwidth was serving content nobody watched. We didn't negotiate the price down — we eliminated the waste. Saved $4.8M. The CDN vendor was happy to keep the contract.",
  },
  {
    num: "04",
    title: "Design the First Move",
    subtitle: "Bias toward reversible action.",
    icon: <Lightbulb {...ICON_PROPS} />,
    description:
      "Analysis paralysis kills more good ideas than bad execution. But recklessness kills more companies than caution. The resolution: design a first move that is bold enough to generate real data but reversible enough that failure is a lesson, not a catastrophe. Jeff Bezos calls these 'Type 2 decisions' — doors you can walk back through.",
    prompt: "What is the smallest experiment that would prove or disprove your thesis?",
    example:
      "A healthcare startup wanted to launch in 12 markets simultaneously. I suggested launching in 2 markets with deliberately different strategies — one premium, one value. Within 90 days, we had data that would have taken 18 months of planning to guess at. The premium market won by 3x. We killed the value strategy before it consumed capital.",
  },
  {
    num: "05",
    title: "Build the Feedback Loop",
    subtitle: "What you measure is what you become.",
    icon: <Shield {...ICON_PROPS} />,
    description:
      "The difference between a strategy and a wish is a feedback loop. Every move should generate information that makes the next move smarter. Most organizations measure outputs (revenue, headcount, deliverables) when they should be measuring learning velocity: how fast are we getting smarter about this problem?",
    prompt: "How will you know in 30 days whether this is working?",
    example:
      "After restructuring a $10B technology sourcing operation, we didn't just track cost savings. We tracked decision speed — how long from identifying a need to signing a contract. That metric dropped from 14 weeks to 3 weeks. The cost savings followed naturally, but the real value was in the velocity.",
  },
];

export default function FrameworkPage() {
  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 py-20 text-center sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
          A Framework for Thinking
        </p>
        <h1 className="mx-auto mb-5 max-w-2xl font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
          How I&apos;d Approach <span className="text-brand-gold">Your Problem</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-foreground/70">
          Twenty-five years of pattern recognition distilled into five questions worth asking
          before you spend a dollar, hire a consultant, or make a decision you can&apos;t reverse.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <p className="mb-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase">
          The Framework
        </p>
        <h2 className="mb-3 font-heading text-3xl font-normal text-foreground">
          Five Steps. Five Questions. One Diagnostic.
        </h2>
        <p className="mb-10 max-w-xl text-foreground/70">
          This isn&apos;t a business plan template. It&apos;s a thinking tool. Each step forces
          you to slow down at the exact moment most people speed up. The goal isn&apos;t to find
          the answer — it&apos;s to find the right question.
        </p>

        {FRAMEWORK_STEPS.map((step) => (
          <FrameworkStepCard key={step.num} step={step} />
        ))}
      </div>

      <div className="border-y border-brand-gold/10 px-6 py-16 text-center sm:px-10">
        <h2 className="mb-3 font-heading text-2xl font-normal text-foreground">
          Want to Apply This to Your Situation?
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-foreground/70">
          The five questions above are the same ones I ask before taking on any engagement. If
          you&apos;d rather talk it through than write it down, that&apos;s what this is for.
        </p>
        <Link
          href="/pick-up-the-phone"
          className="inline-flex items-center gap-2 rounded-md bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Pick Up the Phone
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="bg-linear-to-b from-background to-secondary px-6 py-12 text-center sm:px-10">
        <p className="mx-auto max-w-lg font-heading text-lg text-foreground/70">
          &quot;The problem is never the problem. The problem is that nobody asked the right
          question.&quot;
        </p>
        <p className="mt-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
          — Tony Greenberg
        </p>
      </div>

      <div className="px-6 py-12 text-center sm:px-10">
        <p className="mx-auto mb-4 max-w-lg text-foreground/70">
          Want to walk through this framework with your specific situation?
        </p>
        <Link
          href="/fauxtony"
          className="inline-flex items-center gap-2 rounded-md bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-sm tracking-wide text-white uppercase"
        >
          Ask FauxTony
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
