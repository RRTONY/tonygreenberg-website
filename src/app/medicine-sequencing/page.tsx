import type { Metadata } from "next";
import { MedicineSequencing } from "@/components/pri/medicine-sequencing";

export const metadata: Metadata = {
  title: "Medicine Sequencing Ladder",
  description:
    "An educational map of the preparation, context, and safety considerations documented across the Psychedelic Readiness Index medicine spectrum.",
  alternates: { canonical: "/medicine-sequencing" },
};

export default function MedicineSequencingPage() {
  return <MedicineSequencing />;
}
