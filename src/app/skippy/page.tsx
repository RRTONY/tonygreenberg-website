import type { Metadata } from "next";
import { SkippyMap } from "@/components/marketing/skippy-map";

export const metadata: Metadata = {
  title: "Skippy's Journey Map",
  description:
    "A personal map of active Tony Greenberg essays, tools, assessments, and public resources.",
  alternates: { canonical: "/skippy" },
};

export default function SkippyPage() {
  return <SkippyMap />;
}
