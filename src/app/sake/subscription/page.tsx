import { SakeSubscription } from "@/components/sake/pages/subscription";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";
import { isSakeCheckoutEnabled } from "@/lib/content/sake/sake-stripe";
import { isStripeTestMode } from "@/lib/stripe";

// Ported from the Sake app's client/src/pages/Subscription.tsx (2026-11-26). Stripe sends buyers back
// here with ?success=true or ?cancelled=true (read in the browser).
// Whether ordering is open is read when the page is built (SAKE_CHECKOUT_ENABLED), so turning it on
// needs a new deploy, like any env var change.
const seo = {
  path: "/subscription",
  title: "Subscription Box",
  description:
    "Three bottles. Every month. Curated by obsessives who taste 500+ sakes a year. No supermarket sake. No compromises.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSubscription checkoutOpen={isSakeCheckoutEnabled()} testMode={isStripeTestMode()} />
    </>
  );
}
