import type { Metadata } from "next";
import { BrowseExplorer } from "@/components/brewsoul/browse-explorer";
import { JourneyBar } from "@/components/brewsoul/journey-bar";

export const metadata: Metadata = {
  title: "Browse Coffee — BrewSoul",
  description: "Browse specialty coffees by origin, process, roast level, and flavor profile.",
  alternates: { canonical: "/brewsoul/browse" },
};

export default function BrewSoulBrowsePage() {
  return (
    <>
      <BrowseExplorer />
      <JourneyBar />
      <div className="h-20" />
    </>
  );
}
