// Ported from legacy client/src/pages/kava/KavaLayout.tsx's shared UI
// primitives (KavaHero/KavaSection/KavaSectionTitle/KavaCard/KavaBadge/
// KavaDivider/KavaDisclaimer), reused across all 10 Kava pages. Real
// content/behavior unchanged; converted from inline `style={}` to
// Tailwind classes using the real `--kava-*` tokens (see globals.css).
export function KavaHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && <p className="mb-4 text-xs font-bold tracking-[0.25em] text-kava-saffron uppercase">{eyebrow}</p>}
        <h1 className="mb-4 font-heading text-[clamp(36px,8vw,88px)] leading-[1.1] font-bold text-kava-ink">{title}</h1>
        {subtitle && <p className="mx-auto max-w-2xl text-lg leading-[1.75] text-kava-ink/70 md:text-xl">{subtitle}</p>}
      </div>
    </section>
  );
}

export function KavaSection({ children, className = "", bg }: { children: React.ReactNode; className?: string; bg?: "sand" | "white" }) {
  return (
    <section className={`px-5 py-12 md:py-16 ${bg === "sand" ? "bg-kava-sand" : bg === "white" ? "bg-white" : ""} ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

export function KavaSectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 font-heading text-[clamp(24px,4vw,40px)] leading-[1.2] font-bold text-kava-ink">{children}</h2>;
}

export function KavaCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={`rounded-xl border border-kava-sand-muted bg-white p-6 transition-all duration-200 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

const BADGE_CLASS: Record<string, string> = {
  saffron: "bg-kava-saffron/12 text-kava-saffron",
  cobalt: "bg-kava-cobalt/12 text-kava-cobalt",
  terracotta: "bg-kava-terracotta/12 text-kava-terracotta",
  green: "bg-[#16a34a]/12 text-[#16a34a]",
  red: "bg-[#dc2626]/12 text-[#dc2626]",
  amber: "bg-[#d97706]/12 text-[#d97706]",
  purple: "bg-[#7c3aed]/12 text-[#7c3aed]",
  teal: "bg-[#0d9488]/12 text-[#0d9488]",
};

export function KavaBadge({ children, color = "saffron" }: { children: React.ReactNode; color?: keyof typeof BADGE_CLASS }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${BADGE_CLASS[color] ?? BADGE_CLASS.saffron}`}>{children}</span>;
}

export function KavaDivider() {
  return <div className="mx-auto my-8 h-0.5 max-w-30 bg-linear-to-r from-transparent via-kava-saffron to-transparent" />;
}

export function KavaDisclaimer() {
  return (
    <div className="mt-8 rounded-lg bg-kava-sand-muted p-4 text-sm leading-[1.75] text-kava-ink/80">
      <strong>Disclaimer:</strong> For educational and harm reduction purposes. Consult a licensed medical professional before making any changes to
      medications or health protocols.
    </div>
  );
}
