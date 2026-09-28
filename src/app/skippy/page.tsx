import type { Metadata } from "next";
import { SkippyMap } from "@/components/marketing/skippy-map";

// Ported from legacy client/src/pages/SkippyMap.tsx — Skippy's personal
// journey map ("Welcome, Skippy. You're pioneer #1 of 160"). noindex: it's a
// page for one named person, not public content, and legacy gave it no SEO
// tags at all. See `lib/content/skippy-map.ts` for the port notes.
export const metadata: Metadata = {
  title: "Skippy's Journey Map",
  description: "A personal map of every instrument, essay, and rabbit hole on tonygreenberg.com.",
  alternates: { canonical: "/skippy" },
  robots: { index: false, follow: true },
};

export default function SkippyPage() {
  return <SkippyMap />;
}
