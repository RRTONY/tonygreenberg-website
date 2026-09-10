import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

// Real footer content ported from legacy client/src/components/Layout.tsx.
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-linear-to-b from-background to-secondary px-6 py-10 text-center">
      <p className="font-heading text-lg text-foreground">
        Only time buys trust. The gold is in the cracks.
        <br />
        <strong className="font-normal">— Tony &quot;WhyNot&quot; Greenberg</strong>
      </p>

      <p className="mt-4 font-mono text-sm text-muted-foreground">
        t@ramprate.com
        <br />
        Santa Monica, CA
      </p>

      <p className="mx-auto mt-6 inline-block rounded-sm border border-brand-gold/20 px-4 py-2.5 font-mono text-xs tracking-wide text-amber-700 dark:border-brand-gold-light/15 dark:text-brand-gold-light/70">
        Supplier &amp; buyer intake &rarr;{" "}
        <a
          href="https://ramprate.com/biochain"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ramprate.com/biochain
        </a>
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <a
          href="https://x.com/ThinkTony"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold transition-transform hover:scale-105"
          aria-label="X"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href="https://linkedin.com/in/tonygreenberg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold transition-transform hover:scale-105"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={20} />
        </a>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="https://linktr.ee/TonyG2"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-linear-to-br from-brand-gold to-[#6B3D99] px-6 py-3 font-mono text-xs uppercase tracking-wide text-white transition-transform hover:scale-105"
        >
          Book Time with Me
        </a>
        <a
          href="https://impactsoul.is"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-gold px-6 py-3 font-mono text-xs uppercase tracking-wide text-brand-gold transition-transform hover:scale-105"
        >
          Explore ImpactSoul
        </a>
        <a
          href="https://ramprate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-gold px-6 py-3 font-mono text-xs uppercase tracking-wide text-brand-gold transition-transform hover:scale-105"
        >
          RampRate
        </a>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        CEO,{" "}
        <a
          href="https://ramprate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          RampRate
        </a>{" "}
        &bull; Founder,{" "}
        <a
          href="https://impactsoul.is"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          ImpactSoul
        </a>{" "}
        &bull; Co-Founder, Menagerie
        <br />
        <a
          href="https://linkedin.com/in/tonygreenberg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          LinkedIn
        </a>{" "}
        &bull;{" "}
        <a
          href="https://x.com/ThinkTony"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          X
        </a>{" "}
        &bull;{" "}
        <a
          href="https://linkedin.com/company/ramprate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          RampRate LinkedIn
        </a>{" "}
        &bull;{" "}
        <a
          href="https://linkedin.com/company/impactsoul"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold"
        >
          ImpactSoul LinkedIn
        </a>{" "}
        &bull; Certified B Corporation
      </p>

      <div className="mx-auto mt-6 max-w-2xl border-t border-border pt-5 font-mono text-[0.68rem] leading-relaxed tracking-wide text-muted-foreground">
        &copy; {new Date().getFullYear()} Tony Greenberg. All rights reserved.
        <br />
        All content, essays, frameworks, assessments, and intellectual property on this site are the
        exclusive property of Tony Greenberg and/or RampRate, Inc.
        <br />
        Unauthorized reproduction, scraping, mirroring, or redistribution is strictly prohibited and
        subject to legal action under the DMCA and applicable law.
        <br />
        <span className="mt-1 inline-block text-muted-foreground/70">
          Protected by automated content monitoring. Violations are logged and reported.
        </span>
      </div>
    </footer>
  );
}
