// Small section-label heading, reused across several marketing pages
// (previously duplicated identically in each page file). A <div>, not a
// <p>: inside `.article-body` the drop-cap rule targets the first <p>, and
// it was landing on this label ("T HE PREMISE") instead of the paragraph.
export function EyebrowLabel({
  children,
  className = "mb-4 text-center font-mono text-xs tracking-[0.2em] text-brand-gold uppercase",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
