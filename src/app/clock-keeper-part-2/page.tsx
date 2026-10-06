import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ClockKeeperForm } from "@/components/clock-keeper/clock-keeper-form";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";

// The Clock Keeper Chronicles, Part II: a response form for the five
// questions in Part I. Ported from legacy client/src/pages/ClockKeeperPartII.tsx
// (live shows the same copy, checked 2026-10-06). Responses are saved in
// Supabase (`clock_keeper_responses`), anonymous allowed. The hero's
// response count is re-read every 10 minutes.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "The Clock Keeper Chronicles: Part II — Your Response",
  description:
    "Five questions. Not an intellectual challenge — a container for what already exists. A form for the offering, in whatever shape it takes.",
  alternates: { canonical: "/clock-keeper-part-2" },
};

async function responseCount(): Promise<number> {
  if (!isServiceRoleConfigured()) return 0;
  const { count, error } = await createServiceRoleClient()
    .from("clock_keeper_responses")
    .select("id", { count: "exact", head: true });
  return error ? 0 : (count ?? 0);
}

export default async function ClockKeeperPartTwoPage() {
  const count = await responseCount();

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0E0D12] px-6 py-24 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,transparent,transparent_80px,rgba(212,185,106,0.3)_80px,rgba(212,185,106,0.3)_81px),repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(212,185,106,0.3)_80px,rgba(212,185,106,0.3)_81px)]"
        />
        <div className="relative max-w-170">
          <p className="mb-6 font-mono text-[0.75rem] tracking-[0.25em] text-brand-gold-light uppercase">The Clock Keeper Chronicles</p>
          <h1 className="mb-6 font-heading text-[clamp(2.5rem,6vw,4.25rem)]/[1.1] font-bold text-[#F5F0E6]">
            Part II: <em className="text-brand-gold-light">The Offering</em>
          </h1>
          <p className="mx-auto mb-10 max-w-140 text-lg/[1.9] text-[#F5F0E6]/70">
            Not an intellectual challenge. Not an interview. A container for what already exists — in whatever shape it chooses to take.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#response"
              className="inline-flex min-h-13 items-center rounded-sm bg-brand-gold-light px-9 font-mono text-[0.8rem] tracking-[0.15em] text-[#0A0A10] uppercase transition-colors hover:bg-[#E8D08A]"
            >
              Begin Your Response
            </a>
            <Link
              href="/blog/the-clock-keeper-chronicles-part-1"
              className="inline-flex min-h-13 items-center rounded-sm border border-[#F5F0E6]/25 px-9 font-mono text-[0.8rem] tracking-[0.15em] text-[#F5F0E6]/70 uppercase transition-colors hover:border-[#F5F0E6]/50"
            >
              Read Part I First
            </Link>
          </div>
          {count > 0 && (
            <p className="mt-8 font-mono text-xs tracking-wide text-[#F5F0E6]/60">
              {count} {count === 1 ? "response" : "responses"} received
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-170 px-6 pt-16 text-center">
        <p className="mb-4 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">The Form for the Offering</p>
        <blockquote className="mb-6 font-heading text-[clamp(1.5rem,3vw,2rem)] text-[#1A1A1A] italic">&ldquo;The form doesn&apos;t matter. The trace does.&rdquo;</blockquote>
        <p className="text-lg/[1.8] text-[#555]">
          Answer all 5. Answer 1. Reframe them entirely. Record a voice memo while stretching. Write it longhand. Dictate it to your phone
          between yoga and cardio. The container adapts to whatever shape the offering takes.
        </p>
      </section>

      <div aria-hidden="true" className="mx-auto my-12 h-px w-32 bg-linear-to-r from-transparent via-brand-gold-light to-transparent" />

      <ClockKeeperForm />

      <nav aria-label="Clock Keeper" className="mx-auto flex max-w-170 justify-between gap-4 border-t border-[#E8E4DC] px-6 py-10">
        <Link href="/blog/the-clock-keeper-chronicles-part-1" className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to Part I
        </Link>
        <Link href="/humanos" className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-brand-gold uppercase">
          Human OS
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </nav>
    </div>
  );
}
