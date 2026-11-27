import { SakeGift } from "@/components/sake/pages/gift";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Gift.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/gift",
  title: "Gift Protocol",
  description: "The art of giving sake in Japan. Which bottles for which occasions. The wrapping. The social choreography that turns a bottle into a message.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeGift />
    </>
  );
}
