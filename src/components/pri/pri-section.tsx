// Shared light/dark section wrapper used across the PRI deep-dive modules
// (mescaline, iboga, ...) — ported from each legacy module's own local
// `Section` helper, unified here since they were all identical.
export function PriSection({
  id,
  dark,
  children,
}: {
  id: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`px-5 py-16 ${dark ? "bg-pri-ink text-pri-cream" : "bg-pri-cream text-pri-ink"}`}
    >
      <div className="mx-auto max-w-275">{children}</div>
    </section>
  );
}

export function PriEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-pri-purple uppercase">
      <span className="block h-0.5 w-6 bg-pri-purple" />
      {children}
    </div>
  );
}
