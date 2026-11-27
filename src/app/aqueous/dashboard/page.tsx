import { Dashboard } from "@/components/aqueous/pages/dashboard";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";

// Ported from the Aqueous app's client/src/pages/Dashboard.tsx (2026-11-24). A member's own page:
// kept out of search (noindex) and without structured data.
const seo = { path: "/dashboard", ...AQUEOUS_SEO.dashboard, noindex: true };

export const metadata = aqueousMetadata(seo);

export default function DashboardPage() {
  return <Dashboard />;
}
