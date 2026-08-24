import { Link } from "wouter";
import SEO from "@/components/SEO";
import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";
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

const MODULES = [
  { icon: Globe, path: "/kava/origins", title: "Island Origins", desc: "3,000 years across the Pacific — Vanuatu to Hawaii" },
  { icon: AlertTriangle, path: "/kava/interactions", title: "Drug Interactions", desc: "24 substances screened with CYP450 severity matrix" },
  { icon: FlaskConical, path: "/kava/science", title: "Kavalactone Science", desc: "6 major compounds, chemotype decoder, cultivar data" },
  { icon: ClipboardCheck, path: "/kava/assessment", title: "PRI Assessment", desc: "5-domain readiness scoring — 0 to 100" },
  { icon: Palmtree, path: "/kava/hawaii", title: "Hawaii ICE Crisis", desc: "The 'awa bowl as a way home from meth devastation" },
  { icon: ShieldQuestion, path: "/kava/myths", title: "Myths Debunked", desc: "7 myths examined with evidence and verdicts" },
  { icon: Coffee, path: "/kava/caffeine", title: "Caffeine Interactions", desc: "CYP1A2 inhibition — why coffee hits different with kava" },
  { icon: ShoppingBag, path: "/kava/products", title: "Product Index", desc: "Ceremonial powders, RTDs, supplements, kava bars" },
  { icon: GraduationCap, path: "/kava/certification", title: "Facilitator Certification", desc: "12-module course for PRI threshold facilitators" },
];

const STATS = [
  { value: "$2.0B", label: "Global kava market 2025" },
  { value: "400+", label: "US kava bars" },
  { value: "3,000+", label: "Years of continuous use" },
  { value: "96%", label: "Activity from 6 kavalactones" },
];

export default function KavaHome() {
  return (
    <>
    <SEO
        title="Kava — The Complete Guide"
        description="Everything you need to know about kava: origins, science, safety, and sourcing. By Tony Greenberg."
        path="/kava"
        keywords="Tony Greenberg, kava, kava guide, kava science, kava safety"
        indexable={true}
      />
      <KavaLayout>
      {/* ── Hero ── */}
      <KavaHero
        eyebrow="Psychedelic Readiness Index"
        title="Kava: The Threshold Essence"
        subtitle="The definitive framework for kava as the preparation medicine — positioned between ordinary consciousness and psychedelic engagement. Science-grounded. Culturally respectful. Board-level credibility."
      />

      {/* ── Module Cards ── */}
      <KavaSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Link key={m.path} href={m.path}>
              <KavaCard className="h-full hover:border-transparent">
                <m.icon size={28} style={{ color: KAVA.saffron }} className="mb-3" />
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}
                >
                  {m.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: KAVA.ink, opacity: 0.6 }}>
                  {m.desc}
                </p>
              </KavaCard>
            </Link>
          ))}
        </div>
      </KavaSection>

      {/* ── Threshold Doctrine ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
            style={{ color: KAVA.saffron }}
          >
            The Threshold Doctrine
          </p>
          <blockquote
            className="text-xl md:text-2xl leading-relaxed font-medium"
            style={{
              fontFamily: "'Fraunces', serif",
              color: KAVA.ink,
              lineHeight: 1.6,
            }}
          >
            Kava is not a psychedelic. That is precisely its power. It dissolves anxiety,
            softens ego armor, elevates prosocial bonding, and prepares the nervous system
            to receive what comes next. It is the ultimate preparation medicine for
            collective consciousness work.
          </blockquote>
        </div>
      </KavaSection>

      {/* ── Sacred Triad ── */}
      <KavaSection>
        <KavaSectionTitle>The Sacred Masculine Triad</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Mezcal",
              role: "Earth Anchor",
              note: "Agave terpenes, 2,500 years Mesoamerican ceremony",
              color: KAVA.terracotta,
              step: "1",
            },
            {
              name: "Kava",
              role: "Threshold Essence",
              note: "GABA + MAO-B prime, anxiolysis without sedation",
              color: KAVA.saffron,
              step: "2",
            },
            {
              name: "Peyote",
              role: "The Journey",
              note: "5-HT2A activation, 5,500 years indigenous use",
              color: KAVA.cobalt,
              step: "3",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-6 text-center"
              style={{ border: `2px solid ${t.color}20` }}
            >
              <div
                className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: t.color }}
              >
                {t.step}
              </div>
              <h3
                className="font-bold text-xl mb-1"
                style={{ fontFamily: "'Fraunces', serif", color: t.color }}
              >
                {t.name}
              </h3>
              <p className="font-semibold text-sm mb-2" style={{ color: KAVA.ink }}>
                {t.role}
              </p>
              <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6, lineHeight: 1.75 }}>
                {t.note}
              </p>
            </div>
          ))}
        </div>
        {/* Arrow connectors on desktop */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-4">
          <span className="text-2xl" style={{ color: KAVA.terracotta }}>
            Mezcal
          </span>
          <span className="text-xl" style={{ color: KAVA.sandMuted }}>
            →
          </span>
          <span className="text-2xl font-bold" style={{ color: KAVA.saffron }}>
            Kava
          </span>
          <span className="text-xl" style={{ color: KAVA.sandMuted }}>
            →
          </span>
          <span className="text-2xl" style={{ color: KAVA.cobalt }}>
            Peyote
          </span>
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Market Data ── */}
      <KavaSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center py-4">
              <p
                className="font-bold text-3xl md:text-4xl mb-1"
                style={{ fontFamily: "'Fraunces', serif", color: KAVA.saffron }}
              >
                {s.value}
              </p>
              <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </KavaSection>

      {/* ── Cross-links to main site ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <div className="text-center">
          <p className="text-sm font-medium mb-3" style={{ color: KAVA.ink, opacity: 0.6 }}>
            Part of the TonyGreenberg.com ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pri"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: KAVA.saffron, color: "#fff" }}
            >
              Full PRI Assessment
            </Link>
            <Link
              href="/find-my"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#fff", color: KAVA.ink, border: `1px solid ${KAVA.sandMuted}` }}
            >
              Find My ___ Hub
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#fff", color: KAVA.ink, border: `1px solid ${KAVA.sandMuted}` }}
            >
              Essays
            </Link>
          </div>
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
