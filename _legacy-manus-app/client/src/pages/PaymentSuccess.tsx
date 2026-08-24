/**
 * Payment Success — shown after a successful Stripe checkout.
 * Displays a confirmation and links back to the relevant section.
 */
import { Link } from "wouter";
import { Section, FadeIn } from "@/components/Editorial";
import SEO from "@/components/SEO";

export default function PaymentSuccess() {
  return (
    <div>
      <SEO title="Payment Successful" description="Your purchase is confirmed." path="/payment-success" />
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "4rem 1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#0A0A10",
                marginBottom: "0.8rem",
              }}
            >
              Payment Confirmed
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
              Thank you. Your purchase has been processed. You now have full access to the content you purchased.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "center" }}>
              <Link
                href="/blog"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#F5F0E0",
                  background: "#0A0A10",
                  padding: "0.8rem 2rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                READ THE ESSAYS →
              </Link>
              <Link
                href="/"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  color: "#8B6914",
                  textDecoration: "none",
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
