"use client";

import { usePathname } from "next/navigation";
import { CategoryBadge } from "@/components/brewsoul/category-badge";

// Legacy wrapped most BrewSoul pages in BrewSoulLayout a second time inside
// the route shell, so live shows them with the 52px nav offset twice plus the
// category badge. The landing, cities, directory and quiz pages were never
// wrapped: no badge. We keep a single offset everywhere: live's double one
// left an empty strip with the badge squeezed against the hero (owner found
// it looked broken, 2026-10-08), so the badge now floats over the page's top
// corner instead (see CategoryBadge).
const UNFRAMED = /^\/brewsoul(?:\/home|\/cities(?:\/[^/]+)?|\/directory|\/quiz)?\/?$/;

export function BrewSoulMain({ children }: { children: React.ReactNode }) {
  const framed = !UNFRAMED.test(usePathname());
  return (
    <main className="relative pt-13">
      {framed && <CategoryBadge />}
      {children}
    </main>
  );
}
