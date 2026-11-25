import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SakeDetail } from "@/components/sake/pages/sake-detail";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath } from "@/lib/content/sake/nav";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { isSakeCheckoutEnabled } from "@/lib/content/sake/sake-stripe";

// Ported from the Sake app's client/src/pages/SakeDetail.tsx (2026-11-26), the app's /sake/:id. Here it's
// /sake/bottle/[id] so a sake id can never collide with a page name (/sake/rice...). Every sake in the
// QPR database is built ahead (generateStaticParams); an unknown id is a real 404 (the app showed a
// "Sake Not Found" page with a 200). The app had no per-sake title or description; the title is the
// sake's name and the description its own description text. Whether ordering is open is read at build
// time (SAKE_CHECKOUT_ENABLED), like /sake/subscription.

type Props = { params: Promise<{ id: string }> };

function findSake(id: string) {
  return qprSakeDatabase.find((s) => s.id === id);
}

function sakeSeo(sake: { id: string; name: string; description: string }) {
  return { path: `/sake/${sake.id}`, href: sakeDetailPath(sake.id), title: sake.name, description: sake.description };
}

export function generateStaticParams() {
  return qprSakeDatabase.map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sake = findSake(id);
  if (!sake) return {};
  return sakeMetadata(sakeSeo(sake));
}

export default async function SakeBottlePage({ params }: Props) {
  const { id } = await params;
  const sake = findSake(id);
  if (!sake) notFound();
  return (
    <>
      <SakeJsonLd {...sakeSeo(sake)} />
      <SakeDetail sake={sake} checkoutOpen={isSakeCheckoutEnabled()} />
    </>
  );
}
