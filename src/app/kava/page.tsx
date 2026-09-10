import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  AlertTriangle,
  FlaskConical,
  ClipboardCheck,
  Palmtree,
  ShieldQuestion,
  Coffee,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";
import {
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaDivider,
  KavaDisclaimer,
} from "@/components/kava/kava-ui";

// Ported from legacy client/src/pages/kava/KavaHome.tsx — real 9 module
// cards, the "Threshold Doctrine" statement, the "Sacred Masculine
// Triad" (Mezcal/Kava/Peyote), 4 real market stats, and cross-links, all
// ported unchanged and verbatim. Legacy's own "Full PRI Assessment" link
// pointed to `/pri`, a route that never existed anywhere in legacy's
// routing (only `/psychedelic-readiness-index` does) — a real dead link,
// fixed here and in `KavaFooter`. Zero client-side state anywhere in
// this page — ships entirely as a Server Component.
export const metadata: Metadata = {
  title: "Kava — The Complete Guide",
  description:
    "Everything you need to know about kava: origins, science, safety, and sourcing. By Tony Greenberg.",
  alternates: { canonical: "/kava" },
};

const MODULES = [
  {
    icon: Globe,
    path: "/kava/origins",
    title: "Island Origins",
    desc: "3,000 years across the Pacific — Vanuatu to Hawaii",
  },
  {
    icon: AlertTriangle,
    path: "/kava/interactions",
    title: "Drug Interactions",
    desc: "24 substances screened with CYP450 severity matrix",
  },
  {
    icon: FlaskConical,
    path: "/kava/science",
    title: "Kavalactone Science",
    desc: "6 major compounds, chemotype decoder, cultivar data",
  },
  {
    icon: ClipboardCheck,
    path: "/kava/assessment",
    title: "PRI Assessment",
    desc: "5-domain readiness scoring — 0 to 100",
  },
  {
    icon: Palmtree,
    path: "/kava/hawaii",
    title: "Hawaii ICE Crisis",
    desc: "The 'awa bowl as a way home from meth devastation",
  },
  {
    icon: ShieldQuestion,
    path: "/kava/myths",
    title: "Myths Debunked",
    desc: "7 myths examined with evidence and verdicts",
  },
  {
    icon: Coffee,
    path: "/kava/caffeine",
    title: "Caffeine Interactions",
    desc: "CYP1A2 inhibition — why coffee hits different with kava",
  },
  {
    icon: ShoppingBag,
    path: "/kava/products",
    title: "Product Index",
    desc: "Ceremonial powders, RTDs, supplements, kava bars",
  },
  {
    icon: GraduationCap,
    path: "/kava/certification",
    title: "Facilitator Certification",
    desc: "12-module course for PRI threshold facilitators",
  },
];

const STATS = [
  { value: "$2.0B", label: "Global kava market 2025" },
  { value: "400+", label: "US kava bars" },
  { value: "3,000+", label: "Years of continuous use" },
  { value: "96%", label: "Activity from 6 kavalactones" },
];

const TRIAD = [
  {
    name: "Mezcal",
    role: "Earth Anchor",
    note: "Agave terpenes, 2,500 years Mesoamerican ceremony",
    colorClass: "border-kava-terracotta/20 text-kava-terracotta",
    bgClass: "bg-kava-terracotta",
    step: "1",
  },
  {
    name: "Kava",
    role: "Threshold Essence",
    note: "GABA + MAO-B prime, anxiolysis without sedation",
    colorClass: "border-kava-saffron/20 text-kava-saffron",
    bgClass: "bg-kava-saffron",
    step: "2",
  },
  {
    name: "Peyote",
    role: "The Journey",
    note: "5-HT2A activation, 5,500 years indigenous use",
    colorClass: "border-kava-cobalt/20 text-kava-cobalt",
    bgClass: "bg-kava-cobalt",
    step: "3",
  },
];

export default function KavaHomePage() {
  return (
    <>
      <KavaHero
        eyebrow="Psychedelic Readiness Index"
        title="Kava: The Threshold Essence"
        subtitle="The definitive framework for kava as the preparation medicine — positioned between ordinary consciousness and psychedelic engagement. Science-grounded. Culturally respectful. Board-level credibility."
      />

      <KavaSection>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link key={m.path} href={m.path}>
              <KavaCard className="h-full hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg">
                <m.icon size={28} className="mb-3 text-kava-saffron" />
                <h3 className="mb-1 font-heading text-lg font-bold text-kava-ink">{m.title}</h3>
                <p className="text-sm leading-relaxed text-kava-ink/60">{m.desc}</p>
              </KavaCard>
            </Link>
          ))}
        </div>
      </KavaSection>

      <KavaSection bg="sand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-kava-saffron uppercase">
            The Threshold Doctrine
          </p>
          <blockquote className="font-heading text-xl leading-[1.6] font-medium text-kava-ink md:text-2xl">
            Kava is not a psychedelic. That is precisely its power. It dissolves anxiety, softens
            ego armor, elevates prosocial bonding, and prepares the nervous system to receive what
            comes next. It is the ultimate preparation medicine for collective consciousness work.
          </blockquote>
        </div>
      </KavaSection>

      <KavaSection>
        <KavaSectionTitle>The Sacred Masculine Triad</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRIAD.map((t) => (
            <div key={t.name} className={`rounded-xl border-2 p-6 text-center ${t.colorClass}`}>
              <div
                className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.bgClass}`}
              >
                {t.step}
              </div>
              <h3 className={`mb-1 font-heading text-xl font-bold ${t.colorClass}`}>{t.name}</h3>
              <p className="mb-2 text-sm font-semibold text-kava-ink">{t.role}</p>
              <p className="text-sm leading-[1.75] text-kava-ink/60">{t.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 hidden items-center justify-center gap-2 md:flex">
          <span className="text-2xl text-kava-terracotta">Mezcal</span>
          <span className="text-xl text-kava-sand-muted">
            <ForwardIcon aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-kava-saffron">Kava</span>
          <span className="text-xl text-kava-sand-muted">
            <ForwardIcon aria-hidden="true" />
          </span>
          <span className="text-2xl text-kava-cobalt">Peyote</span>
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="py-4 text-center">
              <p className="mb-1 font-heading text-3xl font-bold text-kava-saffron md:text-4xl">
                {s.value}
              </p>
              <p className="text-sm text-kava-ink/60">{s.label}</p>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaSection bg="sand">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium text-kava-ink/60">
            Part of the TonyGreenberg.com ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/psychedelic-readiness-index"
              className="rounded-lg bg-kava-saffron px-4 py-2 text-sm font-semibold text-white"
            >
              Full PRI Assessment
            </Link>
            <Link
              href="/find-my"
              className="rounded-lg border border-kava-sand-muted bg-white px-4 py-2 text-sm font-semibold text-kava-ink"
            >
              Find My ___ Hub
            </Link>
            <Link
              href="/blog"
              className="rounded-lg border border-kava-sand-muted bg-white px-4 py-2 text-sm font-semibold text-kava-ink"
            >
              Essays
            </Link>
          </div>
        </div>
      </KavaSection>

      <div className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <KavaDisclaimer />
        </div>
      </div>
    </>
  );
}
