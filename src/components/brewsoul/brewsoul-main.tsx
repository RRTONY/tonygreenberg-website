"use client";

import { usePathname } from "next/navigation";
import { CategoryBadge } from "@/components/brewsoul/category-badge";

// Legacy wrapped most BrewSoul pages in BrewSoulLayout a second time inside
// the route shell, so live shows them with the 52px nav offset twice plus the
// category badge. The landing, cities, directory and quiz pages were never
// wrapped: one offset, no badge. Measured on live, 2026-10-02.
const UNFRAMED = /^\/brewsoul(?:\/home|\/cities(?:\/[^/]+)?|\/directory|\/quiz)?\/?$/;

export function BrewSoulMain({ children }: { children: React.ReactNode }) {
  const framed = !UNFRAMED.test(usePathname());
  return (
    <main className={framed ? "pt-26" : "pt-13"}>
      {framed && <CategoryBadge />}
      {children}
    </main>
  );
}
