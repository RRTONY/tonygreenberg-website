import { NewsletterSignupForm } from "@/components/marketing/newsletter-signup-form";

// Homepage email capture right after Editor's Picks. Copy from the "SEO and UX
// Implementation Pack" (2026-10-05), owner's yes 2026-10-10. Reuses the site's
// one signup form (POST /api/subscribe to Kit, mailto fallback), so there's no
// second subscribe path to maintain. Same quiet gold-ruled band as
// /the-letter's "Dispatch" block.
export function HomeNewsletterCapture() {
  return (
    <section aria-labelledby="home-newsletter-heading" className="px-4 pb-10 sm:px-14">
      <div className="mx-auto max-w-3xl border-y border-brand-gold/20 bg-brand-gold-light/5 px-4 py-6 sm:px-8">
        <h2
          id="home-newsletter-heading"
          className="mb-1.5 font-heading text-xl leading-snug font-semibold text-foreground sm:text-2xl"
        >
          Get new essays and GemSparks
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          One email when a new essay goes live. No spam.
        </p>
        <NewsletterSignupForm
          source="homepage"
          buttonLabel="Subscribe"
          placeholder="you@example.com"
          className="flex flex-col gap-3 sm:flex-row"
        />
      </div>
    </section>
  );
}
