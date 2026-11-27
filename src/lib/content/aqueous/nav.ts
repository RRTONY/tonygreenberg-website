// Aqueous menu and route list, ported from the Aqueous Manus app's client/src/components/Navigation.tsx
// and client/src/App.tsx (exported 2026-11-24). The app lived at the root of its own Manus domain
// (aqwaterqpr-wvzsc3ph.manus.space); here every page sits under /aqueous, so `aq()` adds the prefix.

export const AQUEOUS_BASE = "/aqueous";

/** "/explore" -> "/aqueous/explore", "/" -> "/aqueous". Query strings and hashes are kept. */
export function aq(path: string) {
  if (path === "/" || path === "") return AQUEOUS_BASE;
  if (path.startsWith("?") || path.startsWith("#")) return `${AQUEOUS_BASE}${path}`;
  return `${AQUEOUS_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type AqueousNavLink = { href: string; label: string };

/** The app's top-bar links (Navigation.tsx `mainLinks`), app paths. */
export const aqueousMainLinks: AqueousNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/awi", label: "AWI Index" },
  { href: "/explore", label: "Explorer" },
  { href: "/tap-water", label: "Tap Water" },
  { href: "/compare", label: "Compare" },
  { href: "/wall-of-shame", label: "Wall of Shame" },
  { href: "/gem-spark", label: "Gem Spark" },
  { href: "/about", label: "About" },
];

/** The app's "More" dropdown (Navigation.tsx `moreLinks`), app paths. */
export const aqueousMoreLinks: AqueousNavLink[] = [
  { href: "/landscape", label: "Collective Map" },
  { href: "/pricing", label: "Pricing" },
  { href: "/filter-guide", label: "Filter Guide" },
  { href: "/methodology", label: "QPR Engine" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/integrity", label: "Integrity Protocol" },
  { href: "/directory", label: "Site Directory" },
  { href: "/dashboard", label: "My Dashboard" },
];

/** Every static Aqueous route (App.tsx router, minus /404 and the two dynamic ones), for the sitemap and tests. */
export const aqueousRoutes = [
  "/",
  "/explore",
  "/tap-water",
  "/philosophy",
  "/methodology",
  "/compare",
  "/wall-of-shame",
  "/filter-guide",
  "/manifesto",
  "/landscape",
  "/integrity",
  "/awi",
  "/gem-spark",
  "/pricing",
  "/directory",
  "/about",
  "/payment/success",
  "/dashboard",
] as const;

/** Routes left out of the sitemap: the checkout return page and the signed-in dashboard. */
export const aqueousUnlistedRoutes = ["/payment/success", "/dashboard"] as const;
