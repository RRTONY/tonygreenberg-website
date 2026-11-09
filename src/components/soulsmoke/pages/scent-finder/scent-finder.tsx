"use client";

import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { soulsmokeImages as img } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";
import { StepResults } from "./components/step-results";
import { StepSelect } from "./components/step-select";
import { useScentFinder } from "./hook/use-scent-finder";

// Ported from the SoulSmoke app's client/src/pages/ScentFinder.tsx (/scent-finder), 2026-11-10,
// as a step registry (CONTRIBUTING rule 19): this parent holds only the steps and the shared
// hero; the one shared state lives in useScentFinder; copy and data are in data/.
export type ScentFinderStepProps = { finder: ReturnType<typeof useScentFinder> };

const STEPS: Record<number, (props: ScentFinderStepProps) => React.ReactNode> = {
  1: StepSelect,
  2: StepResults,
};

export function ScentFinder() {
  const finder = useScentFinder();
  const { copy } = finder;
  const Step = STEPS[finder.state.step] ?? StepSelect;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
        <Image
          src={img.scentVisualization.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background"></div>

        <div className="relative z-10 container space-y-6 text-center">
          <h1 className="font-display text-6xl font-black text-white drop-shadow-2xl md:text-8xl">{copy.title}</h1>
          <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-lime-400 md:text-3xl">{copy.subtitle}</p>
        </div>

        <Button
          asChild
          variant="ghost"
          className="absolute top-24 left-4 sm:left-8 gap-2 text-white hover:bg-white/10 hover:text-lime-500"
        >
          <Link href={ss("/")}>
            <Home aria-hidden="true" className="size-5" />
            {copy.back}
          </Link>
        </Button>
      </section>

      <Step finder={finder} />
    </div>
  );
}
