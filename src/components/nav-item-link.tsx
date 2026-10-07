import Link from "next/link";

// One link in the site header's dropdowns and the phone menu.
export function NavItemLink({
  href,
  label,
  active,
  onNavigate,
  compact,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block font-mono uppercase tracking-wide transition-colors hover:text-brand-gold ${
        compact ? "text-[0.68rem] py-1" : "text-xs py-1.5"
      } ${active ? "text-brand-gold dark:text-brand-gold-light" : "text-muted-foreground"}`}
    >
      {label}
    </Link>
  );
}
