import { SakeHome } from "@/components/sake/pages/home";
import { SAKE_HOME_DESCRIPTION, sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Home.tsx (2026-11-26). Title and description are the
// app's own site-wide ones (client/index.html).
const seo = { path: "/", title: "Home", description: SAKE_HOME_DESCRIPTION };

export const metadata = sakeMetadata(seo);

export default function SakeHomePage() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeHome />
    </>
  );
}
