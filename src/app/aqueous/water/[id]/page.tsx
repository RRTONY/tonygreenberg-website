import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WaterDetail } from "@/components/aqueous/pages/water-detail";
import { aqueousMetadata } from "@/lib/content/aqueous/seo";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";
import { bottledWaters } from "@/lib/content/aqueous/water-data";

// Ported from the Aqueous app's client/src/pages/WaterDetail.tsx (2026-11-24). The app had no SEOHead
// on this page; the title is the water's name and the description its source description (the
// page's own intro paragraph).

type Props = { params: Promise<{ id: string }> };

function findWater(id: string) {
  return bottledWaters.find((w) => w.id === id);
}

function waterSeo(water: { id: string; name: string; sourceDescription: string }) {
  return { path: `/water/${water.id}`, title: water.name, description: water.sourceDescription };
}

export function generateStaticParams() {
  return bottledWaters.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const water = findWater(id);
  if (!water) return {};
  return aqueousMetadata(waterSeo(water));
}

export default async function WaterDetailPage({ params }: Props) {
  const { id } = await params;
  const water = findWater(id);
  if (!water) notFound();
  return (
    <>
      <AqueousJsonLd {...waterSeo(water)} />
      <WaterDetail water={water} />
    </>
  );
}
