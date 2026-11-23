import type { Metadata } from "next";
import { ReportViewer } from "@/components/aqueous/pages/report-viewer";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";

// Ported from the Aqueous app's client/src/pages/ReportViewer.tsx (2026-11-24). Reports are private
// to the member who made them, so there is no generateStaticParams and no notFound() here: the page
// is rendered per request and the client component loads the member's report (or says it can't).

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return aqueousMetadata({ path: `/report/${encodeURIComponent(id)}`, ...AQUEOUS_SEO.report, noindex: true });
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const reportId = /^\d{1,12}$/.test(id) ? Number(id) : 0;
  return <ReportViewer reportId={reportId} />;
}
