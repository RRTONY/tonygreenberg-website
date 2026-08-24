/**
 * Payment Cancel — shown when user cancels Stripe checkout.
 */
import { Link } from "wouter";
import { Section, FadeIn } from "@/components/Editorial";
import SEO from "@/components/SEO";

export default function PaymentCancel() {
  return (
    <div>
      <SEO title="Payment Cancelled" description="Your payment was cancelled." path="/payment-cancel" />
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "4rem 1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#999" }}>✕</div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#0A0A10",
                marginBottom: "0.8rem",
              }}
            >
              Payment Cancelled
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "#555",
                marginBottom: "2rem",
              }}
            >
              No worries — nothing was charged. You can always come back when you're ready.
            </p>
            <Link
              href="/"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
