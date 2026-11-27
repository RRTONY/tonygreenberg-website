"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { ArrowLeftRight, ArrowRight, ChevronRight, Droplets, Loader2, Mail, Scale, Search, Shield, Skull, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/aqueous/motion";
import { Button } from "@/components/aqueous/ui";
import { useAWIProfile } from "@/components/aqueous/aqueous-providers";
import { FloatingShare, ReferralBanner, ShareButton } from "@/components/aqueous/share-button";
import { WaterCard } from "@/components/aqueous/water-card";
import { QPRBadge } from "@/components/aqueous/qpr-badge";
import { getBestValueWaters, getTopRatedWaters } from "@/lib/content/aqueous/water-data";
import { aqueousImages } from "@/lib/content/aqueous/images";
import { claimSchema, type ClaimValues } from "@/lib/content/aqueous/forms";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Home.tsx (2026-11-24). Hero, the three QPR pillars,
// top-rated waters, value comparison, philosophy / Wall of Shame / filter guide teasers, CTA, email box.
// Changes from the app:
// - Nav, footer and SEOHead come from the /aqueous layout and page.tsx; the unused useAuth() is gone.
// - The 3 photos it used (hero, lab, spring; Manus links, dead) are aqueousImages via next/image.
// - Email capture: trpc.email.subscribe → POST /api/subscribe (source "aqueous-homepage", Kit tag
//   "Aqueous: Homepage"); the app's referralCode isn't sent (Kit has no field for it). Name + email
//   use Formik + Yup (claimSchema has exactly these two fields); Loader2 replaces "Joining...".
// - framer-motion: mount entrances are tw-animate classes; whileInView (viewport once) is <Reveal>.
//   Each block notes the props it replaces. Inline colors became literal classes.

const topWaters = getTopRatedWaters(4);
const bestValue = getBestValueWaters(3);

const pillars = [
  {
    icon: <Droplets aria-hidden="true" className="size-6" />,
    title: "Quality",
    iconClass: "bg-[#0A8754]/8 text-[#0A8754]",
    titleClass: "text-[#0A8754]",
    description:
      "Source integrity, mineral profile, pH balance, and bioavailability. Where does your water come from, and what life-giving properties does it carry?",
  },
  {
    icon: <Shield aria-hidden="true" className="size-6" />,
    title: "Purity",
    iconClass: "bg-[#4ECDC4]/8 text-[#4ECDC4]",
    titleClass: "text-[#4ECDC4]",
    description:
      "PFAS, microplastics, heavy metals, pesticides, and disinfection byproducts. What is hiding in your water that the label does not tell you?",
  },
  {
    icon: <Scale aria-hidden="true" className="size-6" />,
    title: "Resonance",
    iconClass: "bg-[#B87333]/8 text-[#B87333]",
    titleClass: "text-[#B87333]",
    description:
      "Environmental footprint, ethical sourcing, packaging sustainability, and corporate transparency. Does this water align with the world you want to build?",
  },
];

const inverseCorrelation = [
  { brand: "Aquafina (PepsiCo)", marketing: "$5.1B", qpr: 32, grade: "F" },
  { brand: "Dasani (Coca-Cola)", marketing: "$4.2B", qpr: 35, grade: "F" },
  { brand: "FIJI Water", marketing: "$100M+", qpr: 48, grade: "D" },
  { brand: "Home RO Filter", marketing: "$0", qpr: 89, grade: "A" },
];

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none";

export function EmailCaptureForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(values: ClaimValues, { setSubmitting }: FormikHelpers<ClaimValues>) {
    try {
      const firstName = values.name?.trim();
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim(), source: "aqueous-homepage", ...(firstName ? { firstName } : {}) }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success) {
        toast.success("Welcome! Check your inbox soon.");
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    // Was motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}.
    return (
      <div className="glass-card animate-in rounded-2xl p-8 text-center duration-500 fade-in zoom-in-95">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail aria-hidden="true" className="size-6 text-primary" />
        </div>
        <h3 className="font-aq-display mb-2 text-xl font-bold">You&apos;re In</h3>
        <p className="text-sm text-muted-foreground">Your free AWI preview is on its way. Share with a friend to earn $5 credit.</p>
        <div className="mt-4">
          <ShareButton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <Formik<ClaimValues> initialValues={{ name: "", email: "" }} validationSchema={claimSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form noValidate className="glass-card rounded-2xl p-6 text-left">
          <div className="space-y-3">
            <div>
              <label htmlFor="aqueous-home-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                Name (optional)
              </label>
              <Field id="aqueous-home-name" name="name" type="text" autoComplete="given-name" placeholder="Your name" className={fieldClass} />
              <ErrorMessage name="name">{(m) => <p className="mt-1 text-xs text-red-600">{m}</p>}</ErrorMessage>
            </div>
            <div>
              <label htmlFor="aqueous-home-email" className="mb-1 block text-xs font-medium text-muted-foreground">
                Email
              </label>
              <Field
                id="aqueous-home-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className={fieldClass}
              />
              <ErrorMessage name="email">
                {(m) => (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {m}
                  </p>
                )}
              </ErrorMessage>
            </div>
            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Mail aria-hidden="true" className="size-4" />}
              Get My Free AWI Preview
            </Button>
            <p className="text-center text-[10px] text-muted-foreground">No spam. Unsubscribe anytime. Your data stays yours.</p>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export function AqueousHome() {
  const { profile } = useAWIProfile();
  return (
    <div className="flex min-h-screen flex-col">
      <ReferralBanner />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* Background (filter: contrast(1.05) saturate(1.1)) */}
        <div className="absolute inset-0">
          <Image src={aqueousImages.heroWaterSacred.src} alt="" fill priority sizes="100vw" className="object-cover contrast-105 saturate-110" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Was initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} (then 0.35, 0.5, 0.65). */}
            <div className="animate-in delay-200 duration-700 fill-mode-both fade-in slide-in-from-bottom-[30px]">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
                <Droplets aria-hidden="true" className="size-3.5" />
                Powered by Open-Source Data
              </span>
            </div>

            <h1 className="font-aq-display mb-6 animate-in text-4xl leading-[1.1] font-bold text-white delay-350 duration-700 fill-mode-both fade-in slide-in-from-bottom-[30px] sm:text-5xl lg:text-6xl">
              Know What Flows
              <br />
              <span className="text-[#4ECDC4]">Through Your Life</span>
            </h1>

            <p className="mb-8 max-w-xl animate-in text-lg leading-relaxed text-white/75 delay-500 duration-700 fill-mode-both fade-in slide-in-from-bottom-[30px]">
              The AWI — Aqueous Water Index — is the world&apos;s first personalized water rating. Where 1 is perfection. Scored on Quality,
              Purity, and Resonance, weighted to YOUR priorities. Live abundantly. Consume wisely. Pay less for more.
            </p>

            <div className="flex animate-in flex-wrap gap-3 delay-650 duration-700 fill-mode-both fade-in slide-in-from-bottom-[30px]">
              <Button asChild size="lg" className="gap-2 bg-[#4ECDC4] font-semibold text-[#0A3D3D] hover:bg-[#3DBDB5]">
                <Link href={aq("/awi")}>
                  <Search aria-hidden="true" className="size-4" />
                  See Your AWI Rankings
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-white/30 font-medium text-white hover:bg-white/10">
                <Link href={aq("/tap-water")}>
                  Check Your Tap Water
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute right-0 bottom-0 left-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 38C840 44 960 56 1080 58C1200 60 1320 52 1380 48L1440 44V80H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="sacred-geo-bg py-20 md:py-28">
        <div className="container">
          {/* Was whileInView y:20→0, duration 0.6. */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-600 fill-mode-both" className="mb-16 text-center">
            <h2 className="font-aq-display mb-4 text-3xl font-bold md:text-4xl">The Three Pillars of QPR</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
              Every water is scored across three dimensions that matter — not just contaminants, but the full picture of what you are putting
              into your body and what it costs the world.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              // Was whileInView y:24→0, duration 0.5, delay i * 0.12.
              <Reveal
                key={pillar.title}
                enter="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                delay={i * 0.12}
                className="glass-card group rounded-xl p-7 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`mb-5 flex size-12 items-center justify-center rounded-xl ${pillar.iconClass}`}>{pillar.icon}</div>
                <h3 className={`font-aq-display mb-3 text-xl font-bold ${pillar.titleClass}`}>{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP RATED WATERS ─── */}
      <section className="grain-overlay bg-muted/30 py-16">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-aq-display mb-2 text-3xl font-bold">Top Rated Waters</h2>
              <p className="text-muted-foreground">Highest QPR scores across all dimensions</p>
            </div>
            <Link href={aq("/explore")} className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
              View all <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topWaters.map((water, i) => (
              <WaterCard key={water.id} water={water} index={i} profile={profile} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Button asChild variant="outline" className="gap-2">
              <Link href={aq("/explore")}>
                View All Waters <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── VALUE COMPARISON ─── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Was whileInView x:-30→0, duration 0.6. */}
            <Reveal enter="animate-in fade-in slide-in-from-left-[30px] duration-600 fill-mode-both">
              <h2 className="font-aq-display mb-5 text-3xl font-bold md:text-4xl">
                The Price-to-Value
                <br />
                <span className="text-[#B87333]">Revelation</span>
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                The bottled water industry thrives on a simple deception: expensive branding does not equal quality water. A $15-per-gallon
                imported water can score lower than an $0.08-per-gallon home filtration system. The QPR engine exposes this gap with radical
                transparency.
              </p>
              <div className="space-y-4">
                {bestValue.map((water) => (
                  <Link key={water.id} href={aq(`/water/${water.id}`)}>
                    <div className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
                      <QPRBadge score={water.qpr.overall} grade={water.qpr.grade} size="sm" animated={false} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold transition-colors group-hover:text-primary">{water.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${water.pricePerGallon.toFixed(2)}/gal — Value ratio: {water.qpr.valueRatio.toFixed(0)}
                        </p>
                      </div>
                      <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>

            {/* Was whileInView x:30→0, duration 0.6, delay 0.15. */}
            <Reveal enter="animate-in fade-in slide-in-from-right-[30px] duration-600 fill-mode-both" delay={0.15} className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={aqueousImages.waterTestingLab.src}
                  alt={aqueousImages.waterTestingLab.alt}
                  width={aqueousImages.waterTestingLab.width}
                  height={aqueousImages.waterTestingLab.height}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="h-auto w-full"
                />
              </div>
              {/* Fix-from-live: at 375px the app's -left-6 pushed this card past the screen edge
                  (horizontal scroll); it sits inside the image on phones and keeps -left-6 from sm up. */}
              <div className="glass-card absolute -bottom-6 left-2 max-w-[220px] rounded-xl p-4 shadow-lg sm:-left-6">
                <p className="mb-1 text-xs text-muted-foreground">Average Value Ratio</p>
                <p className="font-aq-display text-2xl font-bold text-[#0A8754]">1,112x</p>
                <p className="text-xs text-muted-foreground">Home filtration vs. premium bottled</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY TEASER ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image src={aqueousImages.natureSpringSource.src} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 container text-center">
          {/* Was whileInView y:20→0, duration 0.6. */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-600 fill-mode-both">
            <h2 className="font-aq-display mb-5 text-3xl font-bold text-white md:text-4xl">
              Built for the Era of
              <br />
              <span className="text-[#4ECDC4]">Conscious Consumption</span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-white/70">
              Inspired by Nate Hagens&apos; Great Simplification, Kate Raworth&apos;s Doughnut Economics, and the wisdom of those charting a
              path toward a more abundant future with less. Aqueous is a tool for navigating the world as it truly is.
            </p>
            <Button asChild size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
              <Link href={aq("/philosophy")}>
                Read Our Philosophy
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ─── WALL OF SHAME TEASER ─── */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Was whileInView x:-20→0, duration 0.6. */}
            <Reveal enter="animate-in fade-in slide-in-from-left-5 duration-600 fill-mode-both">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
                  <Skull aria-hidden="true" className="size-5 text-red-500" />
                </div>
                <span className="font-mono text-xs tracking-widest text-red-500/80 uppercase">Exposing the Truth</span>
              </div>
              <h2 className="font-aq-display mb-4 text-3xl font-bold md:text-4xl">The Wall of Shame</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                The bigger the brand, the bigger the marketing budget, the <strong className="text-foreground">worse the water</strong>.
                Coca-Cola spends $4.2B/year on marketing to sell you repackaged tap water at a 3,000% markup. PepsiCo was forced to add
                &quot;Public Water Source&quot; to Aquafina labels.
              </p>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                We expose the inverse correlation between corporate marketing spend and actual water quality — with data from EPA, EWG,
                Consumer Reports, and SEC filings.
              </p>
              <Button asChild size="lg" variant="outline" className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/5">
                <Link href={aq("/wall-of-shame")}>
                  See the Wall of Shame <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </Reveal>

            {/* Was whileInView x:20→0, duration 0.6, delay 0.15. */}
            <Reveal
              enter="animate-in fade-in slide-in-from-right-5 duration-600 fill-mode-both"
              delay={0.15}
              className="rounded-2xl border border-red-500/20 bg-[rgba(155,35,53,0.03)] p-6"
            >
              <h3 className="mb-4 text-lg font-bold">The Inverse Correlation</h3>
              <div className="space-y-3">
                {inverseCorrelation.map((item) => (
                  <div key={item.brand} className="flex items-center justify-between border-b border-border/30 py-2 last:border-0">
                    <div>
                      <span className="text-sm font-medium">{item.brand}</span>
                      <span className="ml-2 text-xs text-muted-foreground">Mktg: {item.marketing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          item.qpr >= 80
                            ? "bg-emerald-500/10 text-emerald-600"
                            : item.qpr >= 50
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        QPR {item.qpr}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          item.grade === "A" ? "text-emerald-600" : item.grade === "D" ? "text-amber-600" : "text-red-500"
                        }`}
                      >
                        {item.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FILTER GUIDE TEASER ─── */}
      <section className="bg-card py-16">
        <div className="container">
          {/* Was whileInView y:20→0 (no duration). */}
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="glass-card flex flex-col items-center gap-8 rounded-2xl border-[rgba(10,135,84,0.15)] bg-[rgba(10,135,84,0.04)] p-8 md:flex-row md:p-12"
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Zap aria-hidden="true" className="size-8 text-emerald-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-aq-display mb-2 text-2xl font-bold">Stop Paying for Plastic. Start Filtering.</h3>
              <p className="leading-relaxed text-muted-foreground">
                A $200 reverse osmosis system produces water scoring <strong className="text-foreground">89 QPR</strong> at{" "}
                <strong className="text-foreground">$0.06/gallon</strong> — that&apos;s 2,500% better value than Dasani and zero
                microplastics. See our tested and ranked recommendations.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
              <Link href={aq("/filter-guide")}>
                Filter Guide <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="sacred-geo-bg py-20">
        <div className="container">
          <div className="glass-card rounded-2xl bg-linear-135 from-[oklch(0.35_0.06_180/0.05)] to-[oklch(0.78_0.12_175/0.08)] p-10 text-center md:p-14">
            <h2 className="font-aq-display mb-4 text-3xl font-bold md:text-4xl">Every Drop Tells a Story</h2>
            <p className="mx-auto mb-8 max-w-xl leading-relaxed text-muted-foreground">
              Start exploring the waters that flow through your life. The QPR engine reveals what branding conceals — so you can choose with
              clarity, live with abundance, and pay only for true value.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                <Link href={aq("/explore")}>
                  <Search aria-hidden="true" className="size-4" />
                  Explore All Waters
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href={aq("/compare")}>
                  Compare Waters
                  <ArrowLeftRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href={aq("/tap-water")}>
                  Check Your Tap Water
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href={aq("/manifesto")}>
                  Read the Manifesto
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMAIL CAPTURE ─── */}
      <section className="bg-linear-to-b from-background to-primary/5 py-20">
        <div className="container">
          {/* Was whileInView y:20→0 (no duration). */}
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" className="mx-auto max-w-xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free AWI Preview</span>
            </div>
            <h2 className="font-aq-display mb-4 text-3xl font-bold md:text-4xl">Get Your Free Water Insight</h2>
            <p className="mb-8 text-muted-foreground">
              Enter your email to receive a free AWI preview report for your zip code&apos;s tap water — plus early access to personalized
              water rankings.
            </p>
            <EmailCaptureForm />
          </Reveal>
        </div>
      </section>

      <div className="mt-12" />
      <FloatingShare />
    </div>
  );
}
