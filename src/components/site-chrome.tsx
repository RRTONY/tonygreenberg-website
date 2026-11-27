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
// /oauth is the MCP sign-in page (src/app/oauth/authorize), a focused
// screen an AI app opens mid-connection, not part of the site.
// /soul-smoke is the SoulSmoke mezcal guide (app/soul-smoke/layout.tsx), its own sub-site.
// /gem-spark is The GemSpark story (app/gem-spark), a standalone page like it was on Manus.
// /liquid-sun is the LiquidSun tequila guide (app/liquid-sun/layout.tsx), its own sub-site (2026-11-21).
// /aqueous is the Aqueous water guide (app/aqueous/layout.tsx), its own sub-site (2026-11-24).
// /sake is Sake for Sake's Sake (app/sake/layout.tsx), its own sub-site (2026-11-26).
const SUPPRESSED_PREFIXES = ["/brewsoul", "/attention-theft", "/kava", "/humanos", "/oauth", "/soul-smoke", "/gem-spark", "/liquid-sun", "/aqueous", "/sake"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
