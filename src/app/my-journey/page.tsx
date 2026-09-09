import type { Metadata } from "next";
import { MyJourneyDashboard } from "@/components/assessments/my-journey-dashboard";

// Ported from legacy client/src/pages/MyJourney.tsx — "My Journey
// Dashboard," a real-time control center over every "Find Your X"
// assessment's completion state. `MyJourneyDashboard` (this migration's
// port of legacy's real behavior — grid/timeline views, category/status
// filters, phase progress, recommended-next) already existed as a
// standalone component; this route was the missing wiring, tracked in
// NEXTJS-MIGRATION-TODO.md Phase 12 as a real content gap found during the
// legacy-route audit. See the component's own port note for what changed
// vs. legacy (dropped per-quiz result caching that no other assessment in
// this migration writes to either).
export const metadata: Metadata = {
  title: "My Journey",
  description: "Your personal map across every Find Your ___ assessment — what you've completed, what's next, and how far you've come.",
  alternates: { canonical: "/my-journey" },
};

export default function MyJourneyPage() {
  return <MyJourneyDashboard />;
}
