import Link from "next/link";
import { CheckCircle, ArrowRight, Droplets, Share2 } from "lucide-react";
import { ShareButton, FloatingShare } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/PaymentSuccess.tsx (2026-11-24), where Stripe sends
// the member back after checkout. Same copy and layout. The app read ?session_id= but never used it,
// so it's dropped (the Stripe webhook records the purchase). A Server Component: the framer-motion
// mount animations are tw-animate classes, and the share buttons are their own client components.

export function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20">
        <div className="container">
          {/* was motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} */}
          <div className="max-w-lg mx-auto text-center animate-in fade-in zoom-in-90 duration-500 fill-mode-both">
            {/* was motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} */}
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500 delay-200 fill-mode-both">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-aq-display">Thank You, Water Guardian</h1>
            <p className="text-muted-foreground mb-2">
              Your payment was successful. Your personalized AWI report is being prepared — we&apos;ll notify you when
              it&apos;s ready.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Every dollar flows toward indigenous water stewardship and regenerative futures.
            </p>

            <div className="glass-card border border-border/40 rounded-2xl p-6 mb-8">
              <Droplets className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">What Happens Next</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-sm mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  We analyze your water profile against our full QPR database
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Your personalized AWI scores are calculated
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Custom recommendations are generated for your location & budget
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Your downloadable PDF report arrives in your inbox
                </li>
              </ul>
            </div>

            <div className="glass-card border border-primary/20 rounded-2xl p-6 mb-8 bg-primary/3">
              <Share2 className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Spread the Flow</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your referral link — each friend gets $5 off, and you earn $5 credit toward your next report.
              </p>
              <ShareButton variant="card" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild>
                <Link href={aq("/explore")}>
                  Explore Waters <ArrowRight aria-hidden="true" className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={aq("/awi")}>View AWI Index</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
