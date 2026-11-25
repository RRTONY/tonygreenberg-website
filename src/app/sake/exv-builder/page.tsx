import { SakeExvBuilder } from "@/components/sake/pages/exv-builder";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/EXVBuilder.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/exv-builder", title: "EXV Builder", description: "Score any sake across 7 emotional dimensions. Watch your soul print emerge. No two are alike." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeExvBuilder />
    </>
  );
}
