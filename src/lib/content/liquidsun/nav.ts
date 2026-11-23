// LiquidSun menu and route list, ported from the LiquidSun Manus app's
// client/src/components/Navigation.tsx and client/src/App.tsx (exported 2026-11-21). The app lived at
// the root of its own Manus domain; here every page sits under /liquid-sun, so `ls()` adds the prefix.

export const LIQUIDSUN_BASE = "/liquid-sun";

/** "/altar" -> "/liquid-sun/altar", "/" -> "/liquid-sun". */
export function ls(path: string) {
  if (path === "/" || path === "") return LIQUIDSUN_BASE;
  return `${LIQUIDSUN_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type LiquidsunNavItem = { path: string; label: string; labelEs: string };
export type LiquidsunNavSection = { title: string; titleEs: string; items: LiquidsunNavItem[] };

export const liquidsunMenu: LiquidsunNavSection[] = [
  {
    title: "The Spirit",
    titleEs: "El Espíritu",
    items: [
      { path: "/evolution", label: "The Evolution", labelEs: "La Evolución" },
      { path: "/tequila-encyclopedia", label: "The Tequilas", labelEs: "Los Tequilas" },
      { path: "/process", label: "The Process", labelEs: "El Proceso" },
      { path: "/the-agaves", label: "The Agaves", labelEs: "Los Agaves" },
      { path: "/agave-genetics", label: "Agave Genetics", labelEs: "Genética Agave" },
      { path: "/science-of-spirit", label: "Science of Spirit", labelEs: "Ciencia del Espíritu" },
    ],
  },
  {
    title: "The Hunt",
    titleEs: "La Cacería",
    items: [
      { path: "/quadrant", label: "The Quadrant", labelEs: "El Cuadrante" },
      { path: "/altar", label: "The Altar", labelEs: "El Altar" },
      { path: "/flavor-finder", label: "Flavor Finder", labelEs: "Buscador de Sabor" },
      { path: "/price-tracker", label: "Price Tracker", labelEs: "Rastreador de Precios" },
      { path: "/bottle-scanner", label: "Bottle Scanner", labelEs: "Escáner de Botellas" },
      { path: "/us-hunt", label: "US Hunt", labelEs: "Cacería USA" },
      { path: "/jalisco-source", label: "Jalisco Source", labelEs: "Fuente Jalisco" },
    ],
  },
  {
    title: "The Culture",
    titleEs: "La Cultura",
    items: [
      { path: "/the-voices", label: "The Voices", labelEs: "Las Voces" },
      { path: "/the-masters", label: "The Masters", labelEs: "Los Maestros" },
      { path: "/sacred-kitchens", label: "Sacred Kitchens", labelEs: "Cocinas Sagradas" },
      { path: "/pilgrimage-guide", label: "Pilgrimage Guide", labelEs: "Guía de Peregrinaje" },
      { path: "/pilgrimage", label: "The Pilgrimage", labelEs: "El Peregrinaje" },
    ],
  },
  {
    title: "The Industry",
    titleEs: "La Industria",
    items: [
      { path: "/trade-board", label: "Trade Board", labelEs: "Tablero de Intercambio" },
      { path: "/the-gatekeepers", label: "The Gatekeepers", labelEs: "Los Guardianes" },
      { path: "/squad-riders", label: "Squad Riders", labelEs: "Jinetes del Escuadrón" },
      { path: "/the-assholes", label: "The Assholes", labelEs: "Los Idiotas" },
      { path: "/partner", label: "Become a Partner", labelEs: "Ser Socio" },
    ],
  },
];

/** Every LiquidSun route (the app's App.tsx router, minus /404), for the sitemap and tests. */
export const liquidsunRoutes = [
  "/",
  "/altar",
  "/pilgrimage",
  "/speakeasy",
  "/evolution",
  "/tequila-encyclopedia",
  "/process",
  "/the-agaves",
  "/agave-genetics",
  "/science-of-spirit",
  "/quadrant",
  "/flavor-finder",
  "/price-tracker",
  "/bottle-scanner",
  "/us-hunt",
  "/jalisco-source",
  "/the-voices",
  "/the-masters",
  "/sacred-kitchens",
  "/pilgrimage-guide",
  "/jalisco-map",
  "/trade-board",
  "/the-gatekeepers",
  "/squad-riders",
  "/the-assholes",
  "/partner",
  "/premium",
  "/premium/success",
  "/library",
  "/distilleries",
  "/cocktails",
  "/tasting-journal",
] as const;

/** Routes left out of the sitemap: the checkout return page and the hidden Speakeasy. */
export const liquidsunUnlistedRoutes = ["/premium/success", "/speakeasy"] as const;
