// SoulSmoke menu and "Your Journey" order, ported from the SoulSmoke app's
// client/src/components/Navigation.tsx and PageJourney.tsx (2026-11-10). The app lived at the
// root of its own Manus domain; here every page sits under /soul-smoke, so `ss()` adds the prefix.

export const SOULSMOKE_BASE = "/soul-smoke";

/** "/us-hunt" -> "/soul-smoke/us-hunt", "/" -> "/soul-smoke". */
export function ss(path: string) {
  if (path === "/" || path === "") return SOULSMOKE_BASE;
  return `${SOULSMOKE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type SoulsmokeNavItem = { path: string; label: string; labelEs: string };

export const soulsmokeMainNav: SoulsmokeNavItem[] = [
  { path: "/", label: "Home", labelEs: "Inicio" },
  { path: "/evolution", label: "The Evolution", labelEs: "La Evolución" },
  { path: "/agave-encyclopedia", label: "The Agaves", labelEs: "Los Agaves" },
  { path: "/ancestral-process", label: "The Process", labelEs: "El Proceso" },
];

export const soulsmokeExploreNav: SoulsmokeNavItem[] = [
  { path: "/discovery", label: "Discovery Engine", labelEs: "Motor de Descubrimiento" },
  { path: "/quadrant", label: "The Quadrant", labelEs: "El Cuadrante" },
  { path: "/scent-finder", label: "Find by Scent", labelEs: "Buscar por Aroma" },
  { path: "/us-hunt", label: "US Hunt", labelEs: "Cacería USA" },
  { path: "/mexico-source", label: "Mexico Source", labelEs: "Fuente México" },
  { path: "/oaxaca-map", label: "Oaxaca Map", labelEs: "Mapa de Oaxaca" },
  { path: "/fane-kantsini", label: "Fane Kantsini", labelEs: "Fane Kantsini" },
];

export const soulsmokeMoreNav: SoulsmokeNavItem[] = [
  { path: "/library", label: "The Library", labelEs: "La Biblioteca" },
  { path: "/sacred-kitchens", label: "Sacred Kitchens", labelEs: "Cocinas Sagradas" },
  { path: "/importers", label: "The Gatekeepers", labelEs: "Los Guardianes" },
  { path: "/squad-riders", label: "Squad Riders", labelEs: "Squad Riders" },
  { path: "/where-to-buy", label: "Where to Buy", labelEs: "Dónde Comprar" },
  { path: "/trade-board", label: "Trade Board", labelEs: "Tablero de Trueque" },
  { path: "/business", label: "For Business", labelEs: "Para Negocios" },
  { path: "/cocktails", label: "Cocktails", labelEs: "Cócteles" },
  { path: "/tasting-journal", label: "Tasting Journal", labelEs: "Diario de Cata" },
  { path: "/science-of-smoke", label: "Science of Smoke", labelEs: "Ciencia del Humo" },
  { path: "/agave-genetics", label: "Agave Genetics", labelEs: "Genética del Agave" },
  { path: "/price-tracker", label: "Price Tracker", labelEs: "Rastreador de Precios" },
  { path: "/bottle-scanner", label: "Bottle Scanner", labelEs: "Escáner de Botellas" },
  { path: "/calendar", label: "Events Calendar", labelEs: "Calendario" },
  { path: "/pilgrimage", label: "Pilgrimage Guide", labelEs: "Guía de Peregrinaje" },
  { path: "/assholes", label: "The Assholes", labelEs: "Los Cabrones" },
  { path: "/site-map", label: "Site Map", labelEs: "Mapa del Sitio" },
];

export const soulsmokeJourneyPages = [
  { path: "/", label: "Home", description: "Begin your journey" },
  { path: "/agave-encyclopedia", label: "The Agaves", description: "Discover the plants" },
  { path: "/ancestral-process", label: "The Process", description: "Witness the transformation" },
  { path: "/scent-finder", label: "Find by Scent", description: "Discover your agave" },
  { path: "/us-hunt", label: "US Hunt", description: "The extraordinary bottles" },
  { path: "/mexico-source", label: "Mexico Source", description: "The wild originals" },
];

/** Every SoulSmoke route (the app's App.tsx router, minus /404), for the sitemap and tests. */
export const soulsmokeRoutes = [
  "/",
  "/journey",
  "/taste-quiz",
  "/us-hunt",
  "/mexico-source",
  "/scent-finder",
  "/agave-encyclopedia",
  "/ancestral-process",
  "/library",
  "/fane-kantsini",
  "/sacred-kitchens",
  "/evolution",
  "/assholes",
  "/hall-of-fame",
  "/discovery",
  "/business",
  "/quadrant",
  "/my-hunt-list",
  "/producers",
  "/how-to-get-allocated",
  "/importers",
  "/oaxaca-map",
  "/bottle-scanner",
  "/calendar",
  "/pilgrimage",
  "/squad-riders",
  "/where-to-buy",
  "/cocktails",
  "/tasting-journal",
  "/science-of-smoke",
  "/price-tracker",
  "/agave-genetics",
  "/trade-board",
  "/site-map",
] as const;
