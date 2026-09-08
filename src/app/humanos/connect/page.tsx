import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";
import { CONNECT_CHANNELS } from "@/lib/content/humanos-content";

// Ported from legacy client/src/pages/humanos/HumanosConnect.tsx. Real
// copy and all 4 channel cards verbatim. Two real dead links fixed here
// (both documented in lib/content/humanos-content.ts): "Take the
// Diagnostic" no longer points at the never-built `/assessment` quiz, and
// "Read the Living Declaration" no longer points at `/manifesto`, which in
// legacy's own router is just a redirect to `/living-declaration` — linked
// directly to the real destination instead. "Pick Up the Phone" ->
// /pick-up-the-phone is real and already live in this app.
export const metadata: Metadata = {
  title: "Connect — HumanOS",
  description:
    "Join the HumanOS community. Take the diagnostic, read the Living Declaration, explore the ecosystem, or pick up the phone.",
  alternates: { canonical: "/humanos/connect" },
};

export default function HumanosConnect() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-8">
        <EyebrowLabel className="mb-3 font-mono text-xs tracking-[0.2em] text-violet-600 uppercase">
          Connect
        </EyebrowLabel>
        <h1 className="mb-4 font-heading text-5xl leading-tight font-bold text-neutral-900 sm:text-6xl">
          Connect
        </h1>
        <p className="text-xl leading-relaxed text-neutral-600">
          Human OS 2.0 is not a spectator sport. Choose your entry point.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-20">
        <div className="flex flex-col gap-5">
          {CONNECT_CHANNELS.map((ch) => (
            <Link
              key={ch.href}
              href={ch.href}
              className="block rounded-lg border border-neutral-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 font-heading text-xl font-semibold text-neutral-900">{ch.title}</h3>
              <p className="mb-3 text-base leading-relaxed text-neutral-600">{ch.desc}</p>
              <span className="font-mono text-[0.65rem] tracking-[0.1em] text-violet-600 uppercase">
                {ch.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
