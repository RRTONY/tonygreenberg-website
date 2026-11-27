import { PremiumSuccess } from "@/components/liquidsun/pages/premium-success";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";

// Ported from the LiquidSun app's client/src/pages/PremiumSuccess.tsx (2026-11-21). Stripe's return
// page after checkout: kept out of search and the sitemap.
export const metadata = liquidsunMetadata({
  path: "/premium/success",
  title: "Welcome to the Inner Circle | LiquidSun",
  description: "Your premium membership is now active. Every buy link, panel score, and Flavor Matrix insight is unlocked.",
  noindex: true,
});

export default function PremiumSuccessPage() {
  return <PremiumSuccess />;
}
