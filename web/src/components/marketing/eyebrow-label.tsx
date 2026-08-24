// Small section-label heading, reused across several marketing pages
// (previously duplicated identically in each page file).
export function EyebrowLabel({
  children,
  className = "mb-4 text-center font-mono text-xs tracking-[0.2em] text-brand-gold uppercase",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}
