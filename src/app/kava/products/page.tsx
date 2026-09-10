import type { Metadata } from "next";
import { KavaDisclaimer, KavaHero, KavaSection } from "@/components/kava/kava-ui";
import { ProductsExplorer } from "@/components/kava/products-explorer";

// Ported from legacy client/src/pages/kava/KavaProducts.tsx — real product
// index across 5 categories with real vendors, pricing, and PRI ratings.
// Category-tab interactivity in `components/kava/products-explorer.tsx`.
export const metadata: Metadata = {
  title: "Kava Product Index — Sourcing Guide",
  description:
    "Ceremonial powders, fresh frozen kava, RTD beverages, supplements, and kava bars, with PRI ratings, pricing, and buy links.",
  alternates: { canonical: "/kava/products" },
};

export default function KavaProductsPage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 9"
        title="Product Index"
        subtitle="Ceremonial powders, fresh frozen, RTD beverages, supplements, and kava bars — all with PRI ratings, USD pricing, and buy links."
      />

      <KavaSection>
        <ProductsExplorer />
      </KavaSection>

      <div className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <KavaDisclaimer />
        </div>
      </div>
    </>
  );
}
