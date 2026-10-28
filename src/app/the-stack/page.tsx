import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STACK_CATEGORIES, STACK_HERO, type StackSupplier } from "@/lib/content/the-stack";
import { pageFontVariables } from "@/lib/fonts/page-fonts";

// Ported from live tonygreenberg.com/the-stack on 2026-10-13 (owner: "both
// page we need to live"). Live's own words for it: "Private review draft",
// shared privately while the work is under review. So, like live: noindex
// (all of live's robots flags), left out of the sitemap, but listed in the
// site directory / The Index. Live's look: full-width photo hero with the
// title over it, a cream page, purple serif headings with a gold rule under
// each category, one card per supplier with a "Visit direct site" button and
// (for five of them) a QR code beside it, under it on phones.
export const metadata: Metadata = {
  title: { absolute: "Private review draft" },
  description: "This page is being shared privately while the work is under review.",
  alternates: { canonical: "/the-stack" },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
};

const NAV = [...STACK_CATEGORIES.map((c) => ({ id: c.id, title: c.title })), { id: "contact", title: "Contact" }];

function SupplierCard({ s }: { s: StackSupplier }) {
  const external = s.href.startsWith("http");
  const rel = s.referral ? "sponsored noopener noreferrer" : "noopener noreferrer";
  return (
    <article className="grid gap-6 border-b border-[#4A1D6B]/15 py-10 last:border-b-0 md:grid-cols-[1fr_13.75rem] md:gap-14">
      <div>
        <p className="font-mono text-xs font-bold text-[#1C1426]">{s.kicker}</p>
        <h3 className="mt-1.5 font-fraunces text-[1.75rem] leading-tight font-medium text-[#4A1D6B] sm:text-3xl">{s.name}</h3>
        <p className="mt-3 text-[1.05rem] leading-[1.85] text-[#1C1426]">{s.description}</p>
        <p className="text-[1.05rem] leading-[1.85] text-[#1C1426]">
          <strong className="text-[#4A1D6B]">Why it earns its place:</strong> {s.why}
        </p>
        {s.important && (
          <p className="mt-2 border-l-4 border-[#D9A92B] bg-[#EAE4D8] px-5 py-3 text-[0.95rem] leading-[1.7] text-[#1C1426]">
            <strong className="text-[#4A1D6B]">Important:</strong> {s.important}
          </p>
        )}
        {s.note && <p className="mt-2 text-sm leading-[1.75] text-[#1C1426]/85">{s.note}</p>}
        <a
          href={s.href}
          {...(external ? { target: "_blank", rel } : {})}
          className="mt-5 inline-flex min-h-11 items-center bg-[#4A1D6B] px-5 font-mono text-xs tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#3A1556]"
        >
          Visit direct site
        </a>
      </div>
      {s.qr && (
        <a
          href={s.href}
          target="_blank"
          rel={rel}
          className="block w-44 self-start md:w-full"
          aria-label={`Open ${s.name} on your phone (QR code)`}
        >
          <span className="block aspect-square overflow-hidden bg-white p-2 shadow-[0_6px_24px_rgba(28,20,38,0.12)]">
            <Image
              src={s.qr.src}
              alt={`QR code for ${s.name}`}
              width={s.qr.width}
              height={s.qr.height}
              sizes="(min-width: 768px) 220px, 176px"
              className="size-full object-contain"
            />
          </span>
          <span className="mt-3 block font-mono text-xs text-[#4A1D6B] md:text-center">Open on phone</span>
        </a>
      )}
    </article>
  );
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 font-fraunces text-[2rem] leading-tight font-medium text-[#4A1D6B] sm:text-[2.6rem]">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[1.05rem] leading-[1.85] text-[#1C1426]">{children}</p>;
}

export default function TheStackPage() {
  return (
    <div className={`${pageFontVariables} bg-[#F3EEE7]`}>
      <header className="relative flex min-h-[32rem] items-end overflow-hidden sm:min-h-[45rem]">
        <Image
          src={STACK_HERO.src}
          alt={STACK_HERO.alt}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-[4.75rem] sm:pb-20">
          <p className="font-mono text-xs tracking-[0.2em] text-white/90 uppercase">Private review draft</p>
          <h1 className="mt-4 font-fraunces text-[3.25rem] leading-none font-medium text-white sm:text-[4.75rem]">The Stack</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/95 sm:text-[1.35rem]">
            A short, working guide to the tests, suppliers, and decision tools I am using while building a more useful
            health, wellness, and longevity company.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <H2>What this is for</H2>
        <P>
          I am building a health, wellness, and longevity company around a basic idea: people deserve a more useful
          relationship with their own data. This is a small part of that work. It is not a storefront and it is not a
          claim that one test can explain a life.
        </P>
        <P>
          Each item here has a distinct job. Bloodwork shows a current signal. DNA can add context. Body composition can
          show what a scale hides. A supplier matters only when it helps turn a result into a better next question, a
          better clinical conversation, or a more accountable follow-through.
        </P>
        <P>
          I am genuinely pleased when a supplier makes useful information more reachable. That is not the same as
          telling you to buy something. Treat every link here as a claim that should survive comparison. If you find
          equivalent value for less, or more value for the same money, send it to me. I will take the evidence back to
          the supplier and ask them to do better.
        </P>
        <P>
          This is educational context, not medical advice. Do not start, stop, or change medication, treatment, or
          supplements based on this page. Bring meaningful results to a qualified clinician who knows your history.
        </P>

        <div className="mt-14">
          <H2>What to expect</H2>
          <P>
            First two weeks: decide what you are trying to understand and order only the tests that can answer that
            question. Following weeks: receive the reports, retain the originals, and download the raw files you are
            entitled to keep. Months one through three: organize dates, collection conditions, reference ranges,
            medications, supplements, and unanswered questions in one place before asking a practitioner to make sense
            of the whole picture.
          </P>
          <P>
            You can read your reports, notice patterns, and use a tool such as Claude to organize questions after
            deciding what you are comfortable sharing. But an AI tool is not a clinician, and a portal is not ownership.
            Keep copies of your own records in the browser, folder, and privacy system you control. The long-term aim is
            a consented Health Wallet that lets you organize and share data on your terms.
          </P>
          <P>
            Bring the clean record to a strong practitioner when the decisions carry real consequences, including
            medication, diagnosis, treatment, or significant intervention changes. I will publish the practitioners I
            would trust with that work when I have done enough homework to stand behind the list.
          </P>
        </div>

        <div className="mt-14">
          <H2>What I am researching next</H2>
          <P>
            Noninvasive vagus-nerve and autonomic-regulation devices are becoming part of the modern health-optimization
            toolkit. Their proposed uses include supporting relaxation, sleep, HRV, stress resilience, and recovery.
            Evidence varies substantially by device, delivery method, and intended use. I evaluate these tools as
            suppliers and emerging technologies, not as substitutes for medical care.
          </P>
          <P>
            I will report on this category in the next few weeks, alongside a tool for evaluating alternative
            interventions by evidence, risk, contraindications, cost, reversibility, data quality, and quality of
            oversight. The point is not to outsource judgment. It is to make it harder for anyone to sell you certainty
            they have not earned.
          </P>
        </div>
      </div>

      <nav aria-label="Sections" className="border-y border-[#4A1D6B]/15 bg-[#EDE6DA]">
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-1 px-4 py-3">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="inline-flex min-h-11 items-center font-mono text-xs tracking-[0.12em] text-[#4A1D6B] uppercase hover:underline"
              >
                {n.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {STACK_CATEGORIES.map((c) => (
          <section key={c.id} className="pt-16 sm:pt-20">
            <div className="max-w-3xl border-b-[3px] border-[#D9A92B] pb-6">
              <H2 id={c.id}>{c.title}</H2>
              <p className="mt-2 text-lg text-[#4A1D6B]">{c.intro}</p>
            </div>
            <div className="mt-4">
              {c.suppliers.map((s) => (
                <SupplierCard key={s.name} s={s} />
              ))}
            </div>
          </section>
        ))}

        <section className="max-w-3xl pt-16 sm:pt-20">
          <H2 id="contact">Questions and access</H2>
          <P>
            If you need help understanding how a supplier fits the stack, or you are facing a real financial barrier to
            appropriate testing, write to{" "}
            <a href="mailto:tony@impactsoul.is" className="text-[#4A1D6B] underline">
              tony@impactsoul.is
            </a>
            . Explain the question, the result you already have, and what you have tried. A person will respond.
          </P>
          <P>
            If something here does not square with reality, your experience, or a source I missed, write and take me to
            school. I may know a lot about systems, but I am still learning. Show me the better evidence and I will
            correct the work.
          </P>
          <P>
            The wider argument for this work is in{" "}
            <Link href="/blog/your-blood-lies-without-your-dna" className="text-[#4A1D6B] underline">
              Your Blood Lies Without Your DNA
            </Link>
            .
          </P>
          <p className="mt-8 border-t border-[#4A1D6B]/15 pt-6 text-sm leading-[1.75] text-[#1C1426]/80">
            Some links on this page are referral links. Some suppliers may compensate me when you sign up, activate, or
            purchase through them. Where received, referral proceeds support a free testing sponsorship fund. I am an
            investor in Arben Ventures, which owns Enov.one, and do not receive referral payments from Enov.one. Sponsor
            support does not determine the opinions on this page. No provider has reviewed or approved the editorial
            opinions on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
