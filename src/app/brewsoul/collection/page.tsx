import type { Metadata } from "next";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CollectionExplorer } from "@/components/brewsoul/collection-explorer";

export const metadata: Metadata = {
  title: "My Collection — BrewSoul",
  description: "Coffees you've saved, tried, or want to remember. Your personal catalog.",
  alternates: { canonical: "/brewsoul/collection" },
};

export default function BrewSoulCollectionPage() {
  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Your Shelf</div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">My Collection</h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        Coffees you&apos;ve saved, tried, or want to remember. Your personal catalog.
      </p>

      <CollectionExplorer coffees={BREWSOUL_COFFEES} />
    </section>
  );
}
