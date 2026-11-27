import { Beaker, Eye, MapPin, Shield, Star } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/components/TrustSection.tsx (2026-11-21). Same copy.
// whileInView reveals: the panel rises 50px over 0.8s (-100px margin), each credential 20px over
// 0.5s, 0.1s apart.

const credentials = [
  {
    icon: Beaker,
    title: "CRT-Certified Panel",
    description:
      "Our tasting panel includes members certified by the Consejo Regulador del Tequila, the governing body of the denomination of origin.",
  },
  {
    icon: MapPin,
    title: "Jalisco-Based Research",
    description: "We visit distilleries in person. Every NOM on this site has been walked, smelled, and tasted at the source.",
  },
  {
    icon: Eye,
    title: "Additive-Free Only",
    description:
      "Every bottle on LiquidSun is verified additive-free. We cross-reference with Tequila Matchmaker's database and independent lab results.",
  },
  {
    icon: Star,
    title: "Panel-Scored",
    description: "We display real Tequila Matchmaker expert panel scores alongside our editorial picks. No hidden agendas.",
  },
];

const stats = [
  { value: "30+", label: "Curated Bottles" },
  { value: "91", label: "Highest Panel Score" },
  { value: "100%", label: "Additive-Free" },
  { value: "15+", label: "Distilleries Visited" },
];

export function TrustSection() {
  return (
    <section className="relative z-10 px-4 py-32">
      <div className="container mx-auto max-w-6xl">
        <Reveal
          enter="animate-in fade-in slide-in-from-bottom-[50px] duration-800 fill-mode-both"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-12 backdrop-blur-xl md:p-16"
        >
          <div className="absolute -top-20 -left-20 size-80 rounded-full bg-emerald-900/10 blur-[100px]" />
          <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-amber-900/10 blur-[100px]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Shield aria-hidden="true" className="size-5 text-emerald-400" />
              <h2 className="font-mono text-xs tracking-[0.4em] text-emerald-400 uppercase">Why Trust Us</h2>
            </div>

            <h3 className="mb-6 font-serif text-3xl leading-tight text-amber-50 md:text-5xl">
              We don&apos;t sell tequila.
              <br />
              <span className="bg-linear-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent italic">
                We protect you from bad tequila.
              </span>
            </h3>

            <p className="mb-12 max-w-3xl font-serif text-lg font-light text-slate-400">
              LiquidSun is an independent editorial platform. We are not owned by, affiliated with, or paid by any tequila brand. Our
              recommendations are based on blind tastings, distillery visits, and cross-referenced data from the industry&apos;s most
              trusted sources.
            </p>

            <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-1 font-serif text-3xl font-bold text-amber-400 md:text-4xl">{stat.value}</div>
                  <div className="font-mono text-xs tracking-wider text-slate-500 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {credentials.map((cred, i) => (
                <Reveal
                  key={cred.title}
                  margin="0px"
                  delay={i * 0.1}
                  enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  className="group flex gap-4 rounded-xl border border-white/5 bg-white/2 p-5 transition-colors hover:border-emerald-500/20"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                    <cred.icon aria-hidden="true" className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-serif text-lg text-amber-100">{cred.title}</h4>
                    <p className="text-sm leading-relaxed font-light text-slate-400">{cred.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/5 pt-6 font-mono text-xs text-slate-600">
              <span className="tracking-wider uppercase">Data Sources:</span>
              <a
                href="https://www.agavematchmaker.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-amber-400"
              >
                Tequila Matchmaker
              </a>
              <a
                href="https://tastetequila.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-amber-400"
              >
                Taste Tequila
              </a>
              <span className="text-slate-600">CRT Official Registry</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
