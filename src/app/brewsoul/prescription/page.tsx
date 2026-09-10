import type { Metadata } from "next";
import { PrescriptionWizard } from "@/components/brewsoul/prescription-wizard";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulPrescriptionFull.tsx
// — the file legacy's own router actually uses for this route
// (BrewSoulTools.tsx's same-named export is dead/unrouted code, same
// shadowed-file trap as /brewsoul/health). See prescription-wizard.tsx's
// port note for what changed.
export const metadata: Metadata = {
  title: "Coffee Prescription — BrewSoul",
  description:
    "Your personalized coffee prescription based on your health goals, taste preferences, and lifestyle.",
  alternates: { canonical: "/brewsoul/prescription" },
};

export default function BrewSoulPrescriptionPage() {
  return (
    <>
      <PrescriptionWizard />
      <section className="bg-[#ede4d0] px-7 py-14">
        <div className="mx-auto max-w-275">
          <NextSteps
            steps={[
              {
                label: "Biodynamic Census",
                path: "/brewsoul/biodynamic",
                description: "Every Demeter-certified farm and roaster",
              },
              {
                label: "Decaf Done Right",
                path: "/brewsoul/decaf",
                description: "Swiss Water vs. paint stripper",
              },
              {
                label: "Coffee & Health",
                path: "/brewsoul/health",
                description: "Peer-reviewed research on every claim",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
