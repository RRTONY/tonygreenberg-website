import type { Metadata } from "next";
import { SubmitForm } from "@/components/brewsoul/submit-form";

export const metadata: Metadata = {
  title: "Submit or Appeal — BrewSoul",
  description:
    "Know a coffee we're missing? Think we scored something wrong? Submit a coffee or appeal a score.",
  alternates: { canonical: "/brewsoul/submit" },
};

export default function BrewSoulSubmitPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#4A7C59] uppercase">
        Your Voice Matters
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Submit or Appeal
      </h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Know a coffee we&apos;re missing? Think we scored something wrong? This is your channel.
        Every submission gets reviewed. Every appeal gets a fair hearing.
      </p>

      <SubmitForm />
    </section>
  );
}
