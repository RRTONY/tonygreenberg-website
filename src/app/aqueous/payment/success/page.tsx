import { PaymentSuccess } from "@/components/aqueous/pages/payment-success";
import { AQUEOUS_SEO, aqueousMetadata } from "@/lib/content/aqueous/seo";

// Ported from the Aqueous app's client/src/pages/PaymentSuccess.tsx (2026-11-24). The Stripe
// return page: kept out of search (noindex).
const seo = { path: "/payment/success", ...AQUEOUS_SEO.paymentSuccess, noindex: true };

export const metadata = aqueousMetadata(seo);

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
