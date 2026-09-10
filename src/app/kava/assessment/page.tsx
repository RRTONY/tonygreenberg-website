import type { Metadata } from "next";
import { AssessmentQuiz } from "@/components/kava/assessment-quiz";

// Ported from legacy client/src/pages/kava/KavaAssessment.tsx — the real
// 5-domain PRI readiness assessment. Fully stateful (domain navigation,
// answers, results), so the whole thing lives in the client island in
// `components/kava/assessment-quiz.tsx`; this page is just metadata plus
// the mount point.
export const metadata: Metadata = {
  title: "PRI Assessment — Kava Ceremony Readiness",
  description:
    "A five-domain readiness assessment scoring somatic, psychological, relational, cultural, and integration factors for kava ceremony clearance.",
  alternates: { canonical: "/kava/assessment" },
};

export default function KavaAssessmentPage() {
  return <AssessmentQuiz />;
}
