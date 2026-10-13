import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

// New page (no legacy source; team review 2026-10-14 found no general
// contact page). Every detail here already appears in the site footer
// (email, city, booking link, RampRate intake, socials) or the nav
// (/pick-up-the-phone); this page just gathers them in one place.
export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Tony Greenberg: email, booking a call, the Engagement Audit and RampRate's supplier intake.",
  alternates: { canonical: "/contact" },
};

const CONTACT_EMAIL = "t@ramprate.com";

const cardClass =
  "group flex gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-brand-gold/50";
const iconClass = "mt-0.5 size-5 shrink-0 text-brand-gold dark:text-brand-gold-light";
const linkLabelClass =
  "mt-3 inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase dark:text-brand-gold-light";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-10 sm:py-20">
      <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold uppercase dark:text-brand-gold-light">
        Contact
      </p>
      <h1 className="font-heading text-[clamp(2rem,4.5vw,3rem)]/[1.15] font-normal text-foreground">
        Get in touch
      </h1>
      <p className="mt-5 max-w-xl text-base/[1.8] text-foreground/85 sm:text-[1.0625rem]/[1.8]">
        Questions, ideas, corrections or a project worth talking about. Pick whichever way suits you.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href={`mailto:${CONTACT_EMAIL}`} className={cardClass}>
          <Mail aria-hidden="true" className={iconClass} />
          <div>
            <h2 className="font-heading text-xl text-foreground">Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">The simplest way to reach Tony directly.</p>
            <p className={linkLabelClass}>{CONTACT_EMAIL}</p>
          </div>
        </a>

        <a href="https://linktr.ee/TonyG2" target="_blank" rel="noopener noreferrer" className={cardClass}>
          <CalendarDays aria-hidden="true" className={iconClass} />
          <div>
            <h2 className="font-heading text-xl text-foreground">Book time</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick a slot for a conversation.</p>
            <p className={linkLabelClass}>
              Book time with Tony <ArrowRight aria-hidden="true" className="size-3.5" />
            </p>
          </div>
        </a>

        <Link href="/pick-up-the-phone" className={cardClass}>
          <Phone aria-hidden="true" className={iconClass} />
          <div>
            <h2 className="font-heading text-xl text-foreground">Work together</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with the Engagement Audit to see whether there&apos;s a fit.
            </p>
            <p className={linkLabelClass}>
              Enter the gate <ArrowRight aria-hidden="true" className="size-3.5" />
            </p>
          </div>
        </Link>

        <a href="https://ramprate.com/biochain" target="_blank" rel="noopener noreferrer" className={cardClass}>
          <Briefcase aria-hidden="true" className={iconClass} />
          <div>
            <h2 className="font-heading text-xl text-foreground">Suppliers &amp; buyers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Supplier and buyer intake is handled by RampRate.</p>
            <p className={linkLabelClass}>
              ramprate.com/biochain <ArrowRight aria-hidden="true" className="size-3.5" />
            </p>
          </div>
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <MapPin aria-hidden="true" className="size-4 text-brand-gold dark:text-brand-gold-light" />
          Santa Monica, CA
        </p>
        <a
          href="https://x.com/ThinkTony"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 hover:text-foreground"
        >
          <FaXTwitter aria-hidden="true" className="size-4 text-brand-gold dark:text-brand-gold-light" />
          @ThinkTony
        </a>
        <a
          href="https://linkedin.com/in/tonygreenberg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 hover:text-foreground"
        >
          <FaLinkedin aria-hidden="true" className="size-4 text-brand-gold dark:text-brand-gold-light" />
          LinkedIn
        </a>
      </div>
    </div>
  );
}
