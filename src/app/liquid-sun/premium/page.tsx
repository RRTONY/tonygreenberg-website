import { Premium } from "@/components/liquidsun/pages/premium";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";
import { isStripeTestMode } from "@/lib/stripe";

// Ported from the LiquidSun app's client/src/pages/Premium.tsx (2026-11-21). Checkout: Stripe over
// REST (src/lib/stripe.ts, server actions in ../actions.ts).
const seo = {
  path: "/premium",
  title: "Unlock the Full Experience | LiquidSun Premium",
  description:
    "Buy links, panel scores, the complete Flavor Matrix, price alerts, and community ratings. Support the mission to keep tequila honest.",
};

export const metadata = liquidsunMetadata(seo);

export default function PremiumPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Premium testMode={isStripeTestMode()} />
    </>
  );
}
