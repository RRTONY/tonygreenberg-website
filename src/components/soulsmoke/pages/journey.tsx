import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, FlaskConical, Map, Sparkles, Star, Users, type LucideIcon } from "lucide-react";
import { soulsmokeImages as img, type SoulsmokeImage } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Journey.tsx. Same steps, copy and layout;
// images are next/image from Sanity instead of /agave-fields.webp etc.

type JourneyStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  link: string;
  icon: LucideIcon;
  image?: SoulsmokeImage;
};

export const journeySteps: JourneyStep[] = [
  {
    number: "01",
    title: "Discover",
    subtitle: "What is real mezcal?",
    description:
      "Most people's first mezcal is terrible. Celebrity brands, worms, industrial production. Forget all that. Real mezcal is handcrafted by families who've been doing this for generations.",
    cta: "Start with the Evolution",
    link: "/evolution",
    icon: Compass,
    image: img.agaveFields,
  },
  {
    number: "02",
    title: "Learn",
    subtitle: "The plants, the process, the people",
    description:
      "There are 50+ agave species. Each takes 7-35 years to mature. Each village has its own terroir. Understanding the plant is understanding the spirit.",
    cta: "Explore the Agaves",
    link: "/agave-encyclopedia",
    icon: BookOpen,
    image: img.agaveMountain,
  },
  {
    number: "03",
    title: "Taste",
    subtitle: "Find your flavor profile",
    description:
      "Smoke, funk, fruit, mineral — mezcal has eight dimensions of flavor. Take our quiz to discover which bottles will speak to your palate.",
    cta: "Take the Taste Quiz",
    link: "/taste-quiz",
    icon: FlaskConical,
    image: img.roastingPit,
  },
  {
    number: "04",
    title: "Hunt",
    subtitle: "Track down the bottles",
    description:
      "The best mezcals aren't in your local liquor store. Some require trips to Oaxaca. Others hide in specialty shops. We'll show you exactly where to find them.",
    cta: "Start Your Hunt",
    link: "/quadrant",
    icon: Map,
    image: img.palenqueHorse,
  },
  {
    number: "05",
    title: "Connect",
    subtitle: "Meet the mezcaleros",
    description:
      "The families behind the bottles. The cooperatives preserving tradition. The experts who've dedicated their lives to this spirit. Real relationships, not transactions.",
    cta: "Meet Fane Kantsini",
    link: "/fane-kantsini",
    icon: Users,
  },
  {
    number: "06",
    title: "Master",
    subtitle: "Become a connoisseur",
    description:
      "From curious beginner to informed advocate. You'll know the difference between ancestral and artisanal, between Tobalá and Tepeztate, between marketing and mastery.",
    cta: "Explore the Quadrant",
    link: "/quadrant",
    icon: Star,
  },
];

const quickLinks = [
  { label: "Evolution", link: "/evolution" },
  { label: "Agave Encyclopedia", link: "/agave-encyclopedia" },
  { label: "The Process", link: "/ancestral-process" },
  { label: "US Hunt", link: "/us-hunt" },
  { label: "Mexico Source", link: "/mexico-source" },
  { label: "The Quadrant", link: "/quadrant" },
];

export function SoulsmokeJourney() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section (pt-24 added: on live the "Your Journey Begins" line sat under the fixed menu) */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-24">
        <Image src={img.agaveFields.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#0a0a0a]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 text-amber-400">
            <Sparkles aria-hidden="true" className="size-5" />
            <span className="text-sm font-medium tracking-[0.3em] uppercase">Your Journey Begins</span>
          </div>

          <h1 className="mb-8 font-serif text-5xl leading-tight md:text-7xl lg:text-8xl">
            From Curious
            <br />
            <span className="text-amber-400">to Connoisseur</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-200 md:text-2xl">
            Six steps from &quot;I&apos;ve never had good mezcal&quot; to &quot;Let me tell you about the
            <span className="text-amber-400"> Tepeztate</span> I found in
            <span className="text-amber-400"> Santa María Ixcatlán</span>.&quot;
          </p>

          <Link
            href={ss("/evolution")}
            className="inline-flex items-center gap-3 rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-amber-400"
          >
            Begin the Journey
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-3 w-1 rounded-full bg-amber-400" />
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          {journeySteps.map((step, index) => (
            <div
              key={step.number}
              className={
                index % 2 === 0
                  ? "mb-32 flex flex-col gap-12 last:mb-0 lg:flex-row lg:gap-24"
                  : "mb-32 flex flex-col gap-12 last:mb-0 lg:flex-row-reverse lg:gap-24"
              }
            >
              {/* Image/Visual */}
              <div className="lg:w-1/2">
                {step.image ? (
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                    <Image
                      src={step.image.src}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <span className="font-serif text-8xl text-white/20">{step.number}</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-amber-900/30 to-black">
                    <step.icon aria-hidden="true" className="size-32 text-amber-400/30" />
                    <div className="absolute bottom-6 left-6">
                      <span className="font-serif text-8xl text-white/20">{step.number}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center lg:w-1/2">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/20">
                    <step.icon aria-hidden="true" className="size-6 text-amber-400" />
                  </div>
                  <span className="text-sm tracking-[0.2em] text-amber-400 uppercase">Step {step.number}</span>
                </div>

                <h2 className="mb-2 font-serif text-4xl md:text-5xl">{step.title}</h2>
                <p className="mb-6 text-xl text-amber-400">{step.subtitle}</p>

                <p className="mb-8 text-lg leading-relaxed text-gray-300">{step.description}</p>

                <Link
                  href={ss(step.link)}
                  className="group inline-flex items-center gap-2 text-lg font-medium text-white hover:text-amber-400"
                >
                  {step.cta}
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-linear-to-b from-[#0a0a0a] to-amber-950/20 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-serif text-4xl md:text-5xl">Ready to Begin?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Your journey into real mezcal starts with a single sip. But first, you need to know what you&apos;re
            looking for.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/taste-quiz")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:bg-amber-400"
            >
              <FlaskConical aria-hidden="true" className="size-5" />
              Take the Taste Quiz
            </Link>
            <Link
              href={ss("/quadrant")}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-500 px-8 py-4 text-lg font-bold text-amber-400 transition-all duration-300 hover:bg-amber-500 hover:text-black"
            >
              <Map aria-hidden="true" className="size-5" />
              Explore the Quadrant
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((item) => (
              <Link
                key={item.link}
                href={ss(item.link)}
                className="text-sm tracking-wider text-gray-400 uppercase transition-colors hover:text-amber-400"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
