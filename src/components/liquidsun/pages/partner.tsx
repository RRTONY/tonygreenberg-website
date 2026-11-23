"use client";

import Link from "next/link";
import { useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { ArrowRight, BarChart3, CheckCircle, Crown, Flame, Loader2, Lock, Send, Shield, Sparkles, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { useLanguage, useMember } from "@/components/liquidsun/liquidsun-providers";
import { Button } from "@/components/liquidsun/ui";
import { submitPartnerInquiry } from "@/app/liquid-sun/actions";
import { partnerSchema, type PartnerTier, type PartnerValues } from "@/lib/content/liquidsun/forms";

// Ported from the LiquidSun app's client/src/pages/Partner.tsx (2026-11-21). Same tiers, stats,
// copy and layout. The inquiry used to go to the app's partner.submit (saved + notifyOwner); it is
// now the server action submitPartnerInquiry: saved to Supabase (liquidsun_partner_inquiries) and
// emailed to Tony. Owner (2026-11-21): like SoulSmoke's business form it needs a free sign-in, so a
// signed-out visitor sees a sign-in box where the form was. Formik + Yup (partnerSchema, the same
// rules the server action re-checks); errors show under each field in EN or ES. The framer-motion
// entrances are tw-animate classes at the app's timings (hero y30 0.8s, stats y20 0.6s + 0.3s,
// tiers y40 0.6s + 0.1s each, form y30 + 0.2s, thank-you scale 0.95).

const tiers = [
  {
    id: "featured" as const,
    name: "Featured",
    price: "$500–$2,000/mo",
    icon: Sparkles,
    benefits: [
      "Featured badge on your listing",
      "Priority placement in The Collection",
      "Enhanced card with larger image",
      "Highlighted buy link",
      "Monthly analytics report",
    ],
    selected:
      "relative cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 shadow-xl ring-2 shadow-amber-500/20 ring-amber-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 fill-mode-both",
    text: "text-amber-400",
    pill: "rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-amber-400 uppercase",
  },
  {
    id: "spotlight" as const,
    name: "Spotlight Partner",
    price: "$2,000–$5,000",
    icon: Crown,
    benefits: [
      "Everything in Featured",
      "Full editorial deep-dive page",
      "Master distiller interview",
      "Photo gallery and video embed",
      "Flavor Matrix priority placement",
      "Newsletter feature (10,000+ subscribers)",
    ],
    selected:
      "relative cursor-pointer rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8 shadow-xl ring-2 shadow-purple-500/20 ring-purple-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 fill-mode-both",
    text: "text-purple-400",
    pill: "rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-purple-400 uppercase",
  },
  {
    id: "altar" as const,
    name: "Altar Selection",
    price: "$5,000+/mo",
    icon: Flame,
    benefits: [
      "Everything in Spotlight",
      "Exclusive Altar page placement",
      "Limited to 2 brands at a time",
      "Custom tasting event promotion",
      "Dedicated social media campaign",
      "Direct audience engagement analytics",
      "First right of renewal",
    ],
    selected:
      "relative cursor-pointer rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 shadow-xl ring-2 shadow-rose-500/20 ring-rose-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 fill-mode-both",
    text: "text-rose-400",
    pill: "rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-rose-400 uppercase",
  },
];

const UNSELECTED =
  "relative cursor-pointer rounded-2xl border border-white/10 bg-white/2 p-8 transition-all duration-500 hover:border-white/20 hover:bg-white/4 animate-in fade-in slide-in-from-bottom-10 fill-mode-both";

const stats = [
  { icon: Users, value: "50K+", label: "Monthly Visitors" },
  { icon: Star, value: "91", label: "Avg. Panel Score" },
  { icon: Shield, value: "100%", label: "Additive-Free Only" },
  { icon: BarChart3, value: "8.2%", label: "Click-Through Rate" },
];

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-light text-white placeholder-slate-600 transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none aria-invalid:border-red-500/60";
const LABEL = "mb-2 block font-mono text-xs tracking-widest text-slate-500 uppercase";
const LOGIN_HREF = "/login?next=/liquid-sun/partner";

const empty: Omit<PartnerValues, "tierInterest"> = {
  brandName: "",
  contactName: "",
  contactEmail: "",
  nom: "",
  website: "",
  message: "",
};

function FieldError({ name }: { name: keyof PartnerValues }) {
  return (
    <ErrorMessage name={name}>
      {(message) => (
        <p id={`partner-${name}-error`} role="alert" className="mt-2 text-sm text-red-400">
          {message}
        </p>
      )}
    </ErrorMessage>
  );
}

export function Partner() {
  const [selectedTier, setSelectedTier] = useState<PartnerTier>("featured");
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const { signedIn, loaded } = useMember();

  async function handleSubmit(values: Omit<PartnerValues, "tierInterest">, helpers: FormikHelpers<Omit<PartnerValues, "tierInterest">>) {
    try {
      const result = await submitPartnerInquiry({ ...values, tierInterest: selectedTier });
      if (result.ok) {
        setSubmitted(true);
        toast.success("Inquiry submitted! We'll be in touch within 48 hours.");
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  }

  const errorProps = (name: keyof PartnerValues, touched: boolean | undefined, error: string | undefined) =>
    touched && error ? { "aria-invalid": true as const, "aria-describedby": `partner-${name}-error` } : {};

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      <AudioController />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-slate-950 to-black" />
        <div className="ls-stardust pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* HERO */}
      <section className="relative z-10 px-4 pt-32 pb-20">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="animate-in duration-800 fade-in fill-mode-both slide-in-from-bottom-[30px]">
            <p className="mb-6 font-mono text-xs tracking-[0.4em] text-amber-500 uppercase">For Brands That Pass the Test</p>
            <h1 className="mb-8 font-serif text-5xl leading-[1.05] text-amber-50 md:text-7xl">
              Become a{" "}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic">Partner</span>
            </h1>
            <p className="mx-auto max-w-3xl font-serif text-xl leading-relaxed font-light text-slate-400">
              LiquidSun reaches the most discerning tequila enthusiasts on the internet. If your brand is additive-free and
              traditionally made, we want to amplify your story to the audience that matters most.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl animate-in grid-cols-2 gap-6 delay-300 duration-600 fade-in fill-mode-both slide-in-from-bottom-5 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <stat.icon aria-hidden="true" className="mx-auto mb-3 size-5 text-amber-500" />
                <p className="font-serif text-2xl font-bold text-amber-100">{stat.value}</p>
                <p className="mt-1 font-mono text-[10px] tracking-widest text-slate-500 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIER SELECTION */}
      <section className="relative z-10 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 text-center font-serif text-3xl text-amber-50 md:text-5xl">Choose Your Tier</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center font-mono text-sm text-slate-500">
            Every tier requires editorial approval. We only partner with brands that meet our additive-free, traditional-production
            standards.
          </p>

          <div className="grid gap-6 md:grid-cols-3" role="radiogroup" aria-label="Partnership tier">
            {tiers.map((tier, i) => {
              const isSelected = selectedTier === tier.id;
              const Icon = tier.icon;
              return (
                <button
                  key={tier.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedTier(tier.id)}
                  // Runtime stagger (0.1s per card), as the app's transition delay.
                  style={{ animationDelay: `${0.1 * i}s` }}
                  className={`${isSelected ? tier.selected : UNSELECTED} text-left`}
                >
                  {isSelected && (
                    <span className="absolute -top-3 right-4">
                      <span className={tier.pill}>Selected</span>
                    </span>
                  )}
                  <Icon
                    aria-hidden="true"
                    className={isSelected ? `mb-4 size-8 transition-colors ${tier.text}` : "mb-4 size-8 text-slate-600 transition-colors"}
                  />
                  <h3 className="mb-1 font-serif text-xl text-amber-50">{tier.name}</h3>
                  <p className={isSelected ? `mb-6 font-mono text-sm ${tier.text}` : "mb-6 font-mono text-sm text-slate-500"}>{tier.price}</p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-slate-400">
                        <ArrowRight
                          aria-hidden="true"
                          className={isSelected ? `mt-1 size-3 shrink-0 ${tier.text}` : "mt-1 size-3 shrink-0 text-slate-600"}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="relative z-10 px-4 py-20">
        <div className="container mx-auto max-w-2xl">
          {submitted ? (
            <div className="animate-in rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-16 text-center fade-in zoom-in-95">
              <CheckCircle aria-hidden="true" className="mx-auto mb-6 size-16 text-emerald-400" />
              <h3 className="mb-4 font-serif text-3xl text-amber-50">Inquiry Received</h3>
              <p className="mx-auto max-w-md font-serif text-lg leading-relaxed font-light text-slate-400">
                Thank you for your interest in partnering with LiquidSun. Our editorial team will review your submission and respond
                within 48 hours.
              </p>
            </div>
          ) : (
            <div className="animate-in delay-200 fade-in fill-mode-both slide-in-from-bottom-[30px]">
              <h2 className="mb-3 text-center font-serif text-3xl text-amber-50 md:text-4xl">Tell Us About Your Brand</h2>
              <p className="mb-12 text-center font-mono text-sm text-slate-500">All fields marked with * are required</p>

              {loaded && !signedIn ? (
                <div className="rounded-2xl border border-amber-500/20 bg-white/2 p-10 text-center">
                  <Lock aria-hidden="true" className="mx-auto mb-4 size-8 text-amber-500" />
                  <p className="mb-6 font-serif text-lg text-slate-300">Sign in free to send a partnership inquiry.</p>
                  <Button asChild className="bg-amber-600 px-8 py-5 font-mono text-sm tracking-widest text-black uppercase hover:bg-amber-500">
                    <Link href={LOGIN_HREF}>Sign In</Link>
                  </Button>
                </div>
              ) : (
                <Formik initialValues={empty} validationSchema={partnerSchema(language).omit(["tierInterest"])} onSubmit={handleSubmit}>
                  {({ isSubmitting, touched, errors }) => (
                    <Form noValidate className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="partner-brandName" className={LABEL}>
                            Brand Name *
                          </label>
                          <Field
                            id="partner-brandName"
                            name="brandName"
                            type="text"
                            placeholder="e.g. Fortaleza"
                            className={INPUT}
                            {...errorProps("brandName", touched.brandName, errors.brandName)}
                          />
                          <FieldError name="brandName" />
                        </div>
                        <div>
                          <label htmlFor="partner-nom" className={LABEL}>
                            NOM Number
                          </label>
                          <Field id="partner-nom" name="nom" type="text" placeholder="e.g. 1493" className={INPUT} {...errorProps("nom", touched.nom, errors.nom)} />
                          <FieldError name="nom" />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="partner-contactName" className={LABEL}>
                            Contact Name *
                          </label>
                          <Field
                            id="partner-contactName"
                            name="contactName"
                            type="text"
                            placeholder="Your full name"
                            className={INPUT}
                            {...errorProps("contactName", touched.contactName, errors.contactName)}
                          />
                          <FieldError name="contactName" />
                        </div>
                        <div>
                          <label htmlFor="partner-contactEmail" className={LABEL}>
                            Email *
                          </label>
                          <Field
                            id="partner-contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="you@brand.com"
                            className={INPUT}
                            {...errorProps("contactEmail", touched.contactEmail, errors.contactEmail)}
                          />
                          <FieldError name="contactEmail" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="partner-website" className={LABEL}>
                          Brand Website
                        </label>
                        <Field
                          id="partner-website"
                          name="website"
                          type="url"
                          placeholder="https://yourbrand.com"
                          className={INPUT}
                          {...errorProps("website", touched.website, errors.website)}
                        />
                        <FieldError name="website" />
                      </div>

                      <div>
                        <label htmlFor="partner-message" className={LABEL}>
                          Why should LiquidSun feature your brand?
                        </label>
                        <Field
                          as="textarea"
                          id="partner-message"
                          name="message"
                          rows={5}
                          placeholder="Tell us about your production process, what makes your tequila special, and why you'd be a great fit for our audience..."
                          className={`${INPUT} resize-none`}
                          {...errorProps("message", touched.message, errors.message)}
                        />
                        <FieldError name="message" />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          className="w-full rounded-lg bg-amber-600 py-6 font-mono text-sm tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
                          ) : (
                            <Send aria-hidden="true" className="mr-2 size-4" />
                          )}
                          Submit Partnership Inquiry
                        </Button>
                      </div>

                      <p className="text-center font-mono text-[11px] leading-relaxed text-slate-600">
                        By submitting, you confirm your brand meets our additive-free standards. All inquiries are reviewed by our
                        editorial team. We respond within 48 hours.
                      </p>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
