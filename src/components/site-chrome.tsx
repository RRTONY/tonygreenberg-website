"use client";

import { usePathname } from "next/navigation";

// BrewSoul (app/brewsoul/*) and /attention-theft are self-contained
// sub-sites/one-off pages with their own nav and footer (see
// components/brewsoul/brewsoul-nav.tsx and components/manifesto/
// manifesto-nav.tsx) — same pattern as legacy's standalone
// BrewSoulLayout/ManifestoLayout, neither of which ever rendered inside
// the main site's chrome. This app has one flat root layout (no route
// groups), so the simplest way to opt a subtree out of the main
// SiteHeader/SiteFooter without restructuring every existing route into a
// route group is to gate them here on the client, passing the actual
// (still-Server-Component) header/footer through as `children` — Server
// Components can be rendered as children of a Client Component like this
// without themselves becoming client components.
const SUPPRESSED_PREFIXES = ["/brewsoul", "/attention-theft"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
