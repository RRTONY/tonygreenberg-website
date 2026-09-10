import type { Metadata } from "next";
import { EcosystemMap } from "@/components/assessments/ecosystem-map";

export const metadata: Metadata = {
  title: "The Ecosystem Map",
  description:
    "A guided map of Tony Greenberg's self-discovery experiences, organized into six connected phases.",
  alternates: { canonical: "/ecosystem-map" },
};

export default function EcosystemMapPage() {
  return <EcosystemMap />;
}
