import Link from "next/link";

// Ported from legacy client/src/pages/humanos/HumanosLayout.tsx's footer.
// Real content/link structure unchanged, with two real dead links fixed:
// "Investment Portfolio" pointed to `/portfolio`, a route that never
// existed anywhere in legacy's own router (only `/invest` — "Invest in
// the Thesis" — does, and is already ported to this app); corrected to
// `/invest`. The copyright line's legacy range ("2000–2026") is kept as
// literal ported copy.
export function HumanosFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-white/30 uppercase">
          Human Operating System
        </p>
        <p className="max-w-md text-sm leading-relaxed text-white/50">
          The machine is perfect. Be the glitch. A framework for agency in the age of algorithmic
          control.
        </p>
        <p className="mt-2 text-xs text-white/20">
          Supported by{" "}
          <a
            href="https://impactsoul.com"
            target="_blank"
            rel="noopener"
            className="text-white/35 hover:text-white/60"
          >
            ImpactSoul
          </a>
        </p>

        <div className="mt-8 flex flex-wrap gap-8 border-t border-white/5 pt-6">
          <div>
            <p className="mb-2 font-mono text-[0.65rem] tracking-[0.12em] text-white/30 uppercase">
              System
            </p>
            <Link
              href="/humanos/philosophy"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              The Philosophy
            </Link>
            <Link
              href="/humanos/ecosystem"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              The Ecosystem
            </Link>
            <Link
              href="/humanos/resources"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              Resources
            </Link>
            <Link
              href="/living-declaration"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              Living Declaration
            </Link>
            <Link
              href="/humanos/path-to-here"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              Path to Here
            </Link>
          </div>
          <div>
            <p className="mb-2 font-mono text-[0.65rem] tracking-[0.12em] text-white/30 uppercase">
              Connect
            </p>
            <Link href="/invest" className="mb-1 block text-sm text-white/50 hover:text-white/80">
              Investment Portfolio
            </Link>
            <a
              href="https://www.linkedin.com/in/tonygreenberg"
              target="_blank"
              rel="noopener"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              LinkedIn
            </a>
            <Link
              href="/humanos/connect"
              className="mb-1 block text-sm text-white/50 hover:text-white/80"
            >
              Contact
            </Link>
          </div>
        </div>

        <p className="mt-8 text-[0.65rem] text-white/15">
          &copy; 2000&ndash;2026 ImpactSoul and RampRate. All Rights Reserved. Architected by Tony
          Greenberg.
        </p>
      </div>
    </footer>
  );
}
