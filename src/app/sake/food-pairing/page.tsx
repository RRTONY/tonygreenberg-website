import { SakeFoodPairing } from "@/components/sake/pages/food-pairing";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/FoodPairing.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/food-pairing",
  title: "Food Pairing",
  description: "In Japan, sake and food are not paired — they are married. The concept is \"washoku\" — harmony of food. Here is how to create that harmony.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeFoodPairing />
    </>
  );
}
