"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { FileText, Heart, Loader2, Quote, Send, Skull, TriangleAlert } from "lucide-react";
import { Button, inputClasses, textareaClasses } from "@/components/liquidsun/ui";
import { Reveal, usePresenceSwap } from "@/components/liquidsun/motion";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { liquidsunImages } from "@/lib/content/liquidsun/images";
import { SINNER_CRIMES, sinnerSchema, type SinnerValues } from "@/lib/content/liquidsun/forms";
import { cn } from "@/lib/utils";

// Ported from the LiquidSun app's client/src/pages/TheAssholes.tsx (2026-11-21). Same copy, classes
// and layout. framer-motion became CSS: the skull scales in (0.8 -> 1, 1s), the title and quote rise
// in (y 20, 0.8s, delays 0.2s / 0.4s), the receipt cards and roasts fade in as they scroll into
// view (y 20 / x -20, delay index * 0.1), the receipt cards grow on hover (scale 1.02), and the
// "Submit a Sinner" form and its thank-you swap with a fade/scale (AnimatePresence, mode wait).
// The form is Formik + Yup (sinnerSchema: brand name required, crimes from the four boxes,
// evidence optional up to 2,000 characters), messages in English or Spanish.
// OWNER: as on the app, "Report Brand" only shows "Submission Received" for 3 seconds; nothing is
// stored or sent anywhere. Decide whether reports should be emailed to Tony or saved.

export const receipts = [
  {
    name: "Casamigos",
    crime: "Additive Bomb",
    desc: "Lab tests confirm: 0% agave complexity, 100% vanilla syrup. Sold for $1B, worth $0 in soul.",
    receipt: "TMM Additive Free: ❌ NO",
  },
  {
    name: "818 Tequila",
    crime: "Cultural Theft",
    desc: "Kendall's 'hand-crafted' juice comes from a mega-factory (NOM 1137) that makes 60+ other brands.",
    receipt: "NOM 1137: Industrial Contract",
  },
  {
    name: "Teremana",
    crime: "Mediocrity",
    desc: "The Rock says 'Mana'. We say 'Marketing'. Diffuser-adjacent production for mass scale.",
    receipt: "Autoclave / Roller Mill",
  },
  {
    name: "Jose Cuervo Especial",
    crime: "The Hangover",
    desc: "51% Agave, 49% Cane Sugar, 100% Regret. The reason you hate tequila.",
    receipt: "Mixto (Not 100% Agave)",
  },
];

export const roasts = [
  { quote: "It tastes like a vanilla candle melted into vodka.", author: "Lucas Assis", role: "Tequila Expert", target: "Casamigos" },
  {
    quote: "If you have to put 'smooth' on the bottle, it's because you stripped out all the flavor.",
    author: "Grover Sanschagrin",
    role: "Tequila Matchmaker",
    target: "Additives",
  },
  {
    quote: "Celebrity tequila is the fast fashion of the spirits world. Cheaply made, expensive to buy, and destined for the landfill.",
    author: "The Tequila Wanderer",
    role: "Industry Critic",
    target: "818 / Teremana",
  },
];

const INITIAL: SinnerValues = { brandName: "", crimes: [], evidence: "" };
/** How long the thank-you stays before the form comes back (the app's setTimeout). */
export const SUBMITTED_MS = 3000;

const fieldError = (message: string) => (
  <p role="alert" className="text-xs text-red-400">
    {message}
  </p>
);

function SinnerForm() {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swap = usePresenceSwap(submitted, 300);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleSubmit = (_values: SinnerValues, { resetForm }: FormikHelpers<SinnerValues>) => {
    resetForm();
    setSubmitted(true);
    timer.current = setTimeout(() => setSubmitted(false), SUBMITTED_MS);
  };

  if (swap.shown) {
    return (
      <div
        className={cn(
          "space-y-4 rounded border border-green-500/30 bg-green-900/20 p-8 text-center duration-300",
          swap.leaving ? "animate-out fade-out zoom-out-90 fill-mode-forwards" : "animate-in fade-in zoom-in-90",
        )}
      >
        <div role="status" className="font-display text-2xl text-green-400">
          Submission Received
        </div>
        <p className="font-serif text-sm text-slate-400 italic">We will investigate their crimes against agave.</p>
      </div>
    );
  }

  return (
    <Formik<SinnerValues> initialValues={INITIAL} validationSchema={sinnerSchema(language)} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <Form
          noValidate
          className={cn(
            "space-y-6 duration-300",
            swap.leaving ? "animate-out fade-out fill-mode-forwards" : "animate-in fade-in",
          )}
        >
          <div className="space-y-2">
            <label htmlFor="sinner-brand" className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
              Brand Name
            </label>
            <Field
              id="sinner-brand"
              name="brandName"
              placeholder="e.g. Fake Juice Reposado"
              aria-invalid={touched.brandName && errors.brandName ? true : undefined}
              className={cn(inputClasses, "h-12 border-white/10 bg-slate-900/50 font-serif text-slate-200 focus:border-red-500/50")}
            />
            <ErrorMessage name="brandName">{fieldError}</ErrorMessage>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 font-mono text-[10px] tracking-widest text-slate-400 uppercase">The Crime</legend>
            <div className="grid grid-cols-2 gap-3">
              {SINNER_CRIMES.map((crime) => (
                <label
                  key={crime}
                  className="flex cursor-pointer items-center gap-3 rounded border border-white/5 p-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-red-400"
                >
                  <Field type="checkbox" name="crimes" value={crime} className="size-4 rounded border-slate-800 bg-slate-950 accent-red-500" />
                  <span className="font-serif">{crime}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="sinner-evidence" className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
              Evidence (Optional)
            </label>
            <Field
              as="textarea"
              id="sinner-evidence"
              name="evidence"
              placeholder="Tastes like vanilla syrup..."
              className={cn(textareaClasses, "min-h-[120px] border-white/10 bg-slate-900/50 font-serif text-slate-200 focus:border-red-500/50")}
            />
            <ErrorMessage name="evidence">{fieldError}</ErrorMessage>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-14 w-full bg-red-600 font-mono text-sm tracking-widest text-white uppercase shadow-lg shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] hover:bg-red-500"
          >
            {isSubmitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="mr-2 size-4" />}
            Report Brand
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export function TheAssholes() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 font-sans text-amber-50 selection:bg-red-500/30">
      <div className="fixed inset-0 z-0">
        <Image
          src={liquidsunImages.industrialDistillery.src}
          alt={liquidsunImages.industrialDistillery.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 contrast-125 grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-red-950/20 to-slate-950 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950" />
        <div className="ls-stardust pointer-events-none absolute inset-0 animate-pulse opacity-[0.08] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 py-32">
          <header className="relative mb-20 space-y-6 text-center">
            <div className="mb-6 flex animate-in justify-center duration-1000 fade-in fill-mode-both zoom-in-80">
              <div className="relative">
                <Skull aria-hidden="true" className="size-24 text-red-600/80" strokeWidth={1} />
                <div className="absolute inset-0 animate-pulse bg-red-600/20 blur-[40px]" />
              </div>
            </div>

            <h1 className="animate-in bg-linear-to-b from-red-500 to-red-900 bg-clip-text font-display text-6xl font-bold tracking-tighter text-transparent drop-shadow-2xl delay-200 duration-800 fade-in fill-mode-both slide-in-from-bottom-5 md:text-9xl">
              THE ASSHOLES
            </h1>

            <p className="mx-auto max-w-3xl animate-in font-serif text-xl leading-relaxed tracking-wide text-red-200/60 italic delay-400 duration-800 fade-in fill-mode-both slide-in-from-bottom-5 md:text-3xl">
              &quot;The Wall of Shame. The Diffuser Den. The Additive Army.&quot;
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-20 lg:col-span-8">
              <section className="space-y-8">
                <div className="flex items-center gap-4 border-b border-red-500/20 pb-6">
                  <FileText aria-hidden="true" className="size-8 text-red-500" strokeWidth={1.5} />
                  <h2 className="font-display text-4xl text-red-100">The Receipts</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {receipts.map((brand, index) => (
                    <Reveal
                      key={brand.name}
                      margin="0px"
                      delay={index * 0.1}
                      enter="animate-in fade-in fill-mode-both slide-in-from-bottom-5"
                      className="group relative overflow-hidden rounded-sm border border-red-900/30 bg-slate-950/40 p-8 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:bg-red-950/10"
                    >
                      <div className="absolute top-0 right-0 border-b border-l border-red-900/30 bg-red-950/50 px-3 py-1 font-mono text-[10px] tracking-widest text-red-400 uppercase">
                        {brand.crime}
                      </div>
                      <h3 className="mb-3 font-display text-3xl text-red-200 transition-colors group-hover:text-red-400">{brand.name}</h3>
                      <p className="mb-6 font-serif text-sm leading-relaxed text-slate-400 italic group-hover:text-slate-300">{brand.desc}</p>
                      <div className="flex items-center gap-2 border-t border-red-900/20 pt-3 font-mono text-xs text-red-500/80">
                        <TriangleAlert aria-hidden="true" className="size-3" /> EVIDENCE: {brand.receipt}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4 border-b border-amber-500/20 pb-6">
                  <Quote aria-hidden="true" className="size-8 text-amber-500" strokeWidth={1.5} />
                  <h2 className="font-display text-4xl text-amber-100">The Roast</h2>
                </div>
                <div className="grid gap-6">
                  {roasts.map((roast, i) => (
                    <Reveal
                      key={roast.author}
                      margin="0px"
                      delay={i * 0.1}
                      enter="animate-in fade-in fill-mode-both slide-in-from-left-5"
                      className="rounded-sm border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm transition-colors hover:border-amber-500/20"
                    >
                      <p className="mb-6 font-serif text-2xl leading-relaxed text-slate-300 italic">&quot;{roast.quote}&quot;</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="font-display text-lg text-amber-500">{roast.author}</div>
                          <div className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">{roast.role}</div>
                        </div>
                        <div className="rounded-full border border-red-900/30 bg-red-950/20 px-3 py-1 font-mono text-[10px] tracking-widest text-red-400 uppercase">
                          Target: {roast.target}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-500/20 pb-6">
                  <Heart aria-hidden="true" className="size-8 text-slate-400" strokeWidth={1.5} />
                  <h2 className="font-display text-4xl text-slate-200">The Purgatory: Patron</h2>
                </div>
                <div className="rounded-sm border border-white/5 bg-slate-900/20 p-8 backdrop-blur-sm">
                  <div className="flex flex-col gap-10 md:flex-row">
                    <div className="flex-1">
                      <h3 className="mb-4 font-display text-2xl text-slate-200">The Good</h3>
                      <p className="font-serif text-base leading-relaxed text-slate-400">
                        Credit where it&apos;s due: Patron is <span className="font-bold text-green-400">additive-free</span>. They use tahonas
                        (stone wheels) for a portion of their juice. They treat their workers well and invest heavily in Jalisco
                        infrastructure. They are not &quot;evil.&quot;
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-4 font-display text-2xl text-slate-200">The Bad</h3>
                      <p className="font-serif text-base leading-relaxed text-slate-400">
                        They are the definition of <span className="font-bold text-amber-400">&quot;Mid&quot;</span>. To scale to millions of
                        cases, they blend their tahona juice with roller-mill juice, diluting the soul. It&apos;s safe, consistent, and boring.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-white/5 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">Verdict</span>
                      <span className="font-display text-xl text-slate-300">Respectable, but Poor Value (Low EVI)</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <div className="rounded-sm border border-red-500/20 bg-slate-950/60 p-8 shadow-2xl shadow-red-900/10 backdrop-blur-xl">
                  <div className="mb-6">
                    <h2 className="mb-2 font-display text-3xl text-slate-200">Submit a Sinner</h2>
                    <p className="font-mono text-xs tracking-widest text-slate-500 uppercase">Know a fake? Report it.</p>
                  </div>
                  <SinnerForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
