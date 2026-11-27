import { Process } from "@/components/liquidsun/pages/process";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Process.tsx (2026-11-21).
const seo = {
  path: "/process",
  title: "The Process | LiquidSun",
  description: "Alchemy is not magic; it is a rigorous, inefficient, and beautiful conversation with nature.",
};

export const metadata = liquidsunMetadata(seo);

export default function ProcessPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Process />
    </>
  );
}
