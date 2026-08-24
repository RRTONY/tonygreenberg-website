/**
 * BlogPaywall — shown when a user tries to read post #21+
 * without blog access or an active membership.
 * First 20 posts are always free.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";

interface BlogPaywallProps {
  postIndex: number; // 0-based index of the post in the sorted list
  totalPosts: number;
}

export default function BlogPaywall({ postIndex, totalPosts }: BlogPaywallProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handlePurchase = () => {
    setIsLoading(true);
    checkout.mutate({
      productKey: "blog-access",
      origin: window.location.origin,
      successPath: window.location.pathname,
      cancelPath: window.location.pathname,
    });
  };

  return (
    <div
      style={{
        maxWidth: "780px",
        margin: "2rem 0",
        position: "relative",
      }}
    >
      {/* Gradient fade over truncated content */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #FAFAF7)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "2.5rem 2rem",
          background: "linear-gradient(135deg, #fefdfb 0%, #f8f5ed 100%)",
          border: "1px solid rgba(139,105,20,0.2)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8B6914",
            marginBottom: "1rem",
          }}
        >
          PREMIUM ESSAY
        </div>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0A0A10",
            marginBottom: "0.8rem",
            lineHeight: 1.3,
          }}
        >
          This essay is behind the paywall
        </h3>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#555",
            maxWidth: "480px",
            margin: "0 auto 1.5rem",
          }}
        >
          The first 20 essays are free. This is essay #{postIndex + 1} of {totalPosts}.
          Unlock all {totalPosts} essays with a one-time purchase of $9.99, or subscribe for full access.
        </p>

        {!isAuthenticated ? (
          <div>
            <a
              href={getLoginUrl()}
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#F5F0E0",
                background: "#0A0A10",
                padding: "0.9rem 2.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              SIGN IN TO CONTINUE
            </a>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: "#999",
                marginTop: "0.8rem",
              }}
            >
              Sign in to purchase access or check your existing purchases.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#F5F0E0",
                background: "#0A0A10",
                padding: "0.9rem 2.5rem",
                borderRadius: "4px",
                border: "none",
                cursor: isLoading ? "wait" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {isLoading ? "OPENING CHECKOUT..." : "UNLOCK ALL ESSAYS — $9.99"}
            </button>

            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                color: "#999",
                letterSpacing: "0.08em",
              }}
            >
              OR
            </span>

            <a
              href="/subscribe"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B6914",
                textDecoration: "none",
                borderBottom: "1px solid rgba(139,105,20,0.3)",
                paddingBottom: "2px",
              }}
            >
              SUBSCRIBE FOR $99/YR → INCLUDES ALL ESSAYS
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
