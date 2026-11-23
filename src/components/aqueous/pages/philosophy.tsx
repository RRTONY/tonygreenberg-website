import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Heart, Leaf, Lightbulb, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/aqueous/motion";
import { FloatingShare } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aqueousImages } from "@/lib/content/aqueous/images";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Philosophy.tsx (2026-11-24). Same copy, markup and
// classes. The app's dead Manus photos are aqueousImages.natureSpringSource (hero) and
// waterDropsMacro (principle 2). Its per-principle `color` was applied with inline styles
// (`${color}15` etc.); here each principle carries the same colors as full literal classes
// (8-digit hex keeps the app's exact alpha: 15 = icon tint, 08→15 = card gradient, 20 = circle).

type Principle = {
  icon: LucideIcon;
  title: string;
  description: string;
  quote: string;
  attribution: string;
  /** Icon tile: style={{ backgroundColor: `${color}15`, color }} */
  iconTile: string;
  /** Quote rule: style={{ borderColor: color }} */
  quoteBorder: string;
  /** Side card: style={{ background: linear-gradient(135deg, ${color}08, ${color}15) }} */
  card: string;
  /** Side card circle: style={{ backgroundColor: `${color}20`, color }} */
  circle: string;
  /** Side card heading: style={{ color }} */
  heading: string;
};

export const principles: Principle[] = [
  {
    icon: Leaf,
    title: "The Great Simplification",
    description:
      "Nate Hagens teaches us that our civilization is approaching a metabolic inflection point. The energy surplus that fueled exponential growth is contracting. In this context, every consumption choice becomes a vote for the world we want to inhabit. Aqueous helps you make that vote count — starting with the most fundamental substance of life.",
    quote: '"We are not going to grow our way out of our problems. We have to simplify our way through them."',
    attribution: "Nate Hagens, The Great Simplification",
    iconTile: "bg-[#0A875415] text-[#0A8754]",
    quoteBorder: "border-[#0A8754]",
    card: "bg-linear-135 from-[#0A875408] to-[#0A875415]",
    circle: "bg-[#0A875420] text-[#0A8754]",
    heading: "text-[#0A8754]",
  },
  {
    icon: Heart,
    title: "Cleanliness is Next to Godliness",
    description:
      "Water is not a commodity. It is the medium through which life expresses itself. The purity of what flows through your body is inseparable from the quality of your lived experience. When we treat water as sacred — when we demand transparency about what we consume — we reclaim agency over our own vitality.",
    quote: '"The quality of your water is the quality of your life."',
    attribution: "Aqueous Founding Principle",
    iconTile: "bg-[#4ECDC415] text-[#4ECDC4]",
    quoteBorder: "border-[#4ECDC4]",
    card: "bg-linear-135 from-[#4ECDC408] to-[#4ECDC415]",
    circle: "bg-[#4ECDC420] text-[#4ECDC4]",
    heading: "text-[#4ECDC4]",
  },
  {
    icon: Globe,
    title: "Doughnut Economics",
    description:
      "Kate Raworth envisions an economy that operates within the safe space between a social foundation and an ecological ceiling. Aqueous embodies this by scoring not just what water does for you, but what it costs the planet. The Resonance pillar measures environmental impact, ethical sourcing, and corporate transparency — because your health and the planet's health are one.",
    quote: '"The challenge of the 21st century is to meet the needs of all within the means of the planet."',
    attribution: "Kate Raworth, Doughnut Economics",
    iconTile: "bg-[#B8733315] text-[#B87333]",
    quoteBorder: "border-[#B87333]",
    card: "bg-linear-135 from-[#B8733308] to-[#B8733315]",
    circle: "bg-[#B8733320] text-[#B87333]",
    heading: "text-[#B87333]",
  },
  {
    icon: Lightbulb,
    title: "Small is Beautiful",
    description:
      "E.F. Schumacher understood that the most powerful solutions are often the simplest. A home filtration system that costs $0.08 per gallon can outperform a $15 imported bottled water on every dimension that matters. Aqueous reveals these truths — empowering you to live more abundantly with less, to find the extraordinary in the accessible.",
    quote:
      '"Any intelligent fool can make things bigger, more complex, and more violent. It takes a touch of genius — and a lot of courage — to move in the opposite direction."',
    attribution: "E.F. Schumacher, Small is Beautiful",
    iconTile: "bg-[#0A3D3D15] text-[#0A3D3D]",
    quoteBorder: "border-[#0A3D3D]",
    card: "bg-linear-135 from-[#0A3D3D08] to-[#0A3D3D15]",
    circle: "bg-[#0A3D3D20] text-[#0A3D3D]",
    heading: "text-[#0A3D3D]",
  },
];

/** The side card's heading and line for principles 0, 2 and 3 (principle 1 shows the photo). */
const sideCard: Record<number, { heading: string; text: string }> = {
  0: {
    heading: "Consume Less. Live More.",
    text: "Every dollar you redirect from overpriced water to genuine quality is a step toward the Great Simplification.",
  },
  2: { heading: "Within the Doughnut", text: "Operating within planetary boundaries while meeting human needs." },
  3: { heading: "Simplicity is Power", text: "The best solutions are often the most accessible." },
};

export function Philosophy() {
  const spring = aqueousImages.natureSpringSource;
  const drops = aqueousImages.waterDropsMacro;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={spring.src} alt={spring.alt} fill priority sizes="100vw" className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 container pt-24 pb-16">
          {/* was motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} */}
          <div className="max-w-2xl animate-in fill-mode-both fade-in slide-in-from-bottom-[30px] duration-700">
            <h1 className="mb-5 font-aq-display text-4xl leading-tight font-bold text-white md:text-5xl">
              Built for a
              <br />
              <span className="text-[#4ECDC4]">New Tomorrow</span>
            </h1>
            <p className="text-lg leading-relaxed text-white/75">
              Aqueous is more than a water rating tool. It is a lens for seeing the world as it truly is — and making
              choices that align with the abundant, simplified future we are building together.
            </p>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 60L60 52C120 44 240 28 360 22C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V60H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-20">
            {principles.map((p, i) => {
              const Icon = p.icon;
              const card = sideCard[i];
              return (
                // was motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                <Reveal
                  key={p.title}
                  enter="animate-in fade-in slide-in-from-bottom-[30px] duration-600 fill-mode-both"
                  className={
                    i % 2 === 1
                      ? "grid grid-cols-1 items-center gap-10 lg:flex-row-reverse lg:grid-cols-12"
                      : "grid grid-cols-1 items-center gap-10 lg:grid-cols-12"
                  }
                >
                  <div className={i % 2 === 1 ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${p.iconTile}`}>
                        <Icon aria-hidden="true" className="size-6" />
                      </div>
                      <h2 className="font-aq-display text-2xl font-bold md:text-3xl">{p.title}</h2>
                    </div>
                    <p className="mb-6 leading-relaxed text-muted-foreground">{p.description}</p>
                    <blockquote className={`border-l-3 py-2 pl-4 ${p.quoteBorder}`}>
                      <p className="text-sm leading-relaxed text-foreground/80 italic">{p.quote}</p>
                      <cite className="mt-1 block text-xs text-muted-foreground not-italic">— {p.attribution}</cite>
                    </blockquote>
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
                    {card ? (
                      <div className={`glass-card rounded-2xl p-8 text-center ${p.card}`}>
                        <div className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${p.circle}`}>
                          <Icon aria-hidden="true" className="size-6" />
                        </div>
                        <p className={`mb-2 font-aq-display text-lg font-bold ${p.heading}`}>{card.heading}</p>
                        <p className="text-sm text-muted-foreground">{card.text}</p>
                      </div>
                    ) : (
                      <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl shadow-lg">
                        <Image
                          src={drops.src}
                          alt={drops.alt}
                          fill
                          sizes="(min-width: 1024px) 28rem, 100vw"
                          className="size-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-16">
        <div className="container text-center">
          <h2 className="mb-4 font-aq-display text-3xl font-bold">Start Your Journey</h2>
          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-muted-foreground">
            The path to conscious consumption begins with a single question: What is actually in the water I drink
            every day?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link href={aq("/explore")}>
                Explore Waters <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href={aq("/tap-water")}>Check Your Tap Water</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
