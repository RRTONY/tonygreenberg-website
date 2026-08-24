/**
 * StripeCheckoutButton — reusable button that opens a Stripe Checkout session.
 * Handles auth gating, loading state, and error display.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";

interface StripeCheckoutButtonProps {
  productKey: string;
  label: string;
  successPath?: string;
  cancelPath?: string;
  /** Additional inline styles for the button */
  style?: React.CSSProperties;
  /** If true, render as a secondary/outline style */
  variant?: "primary" | "secondary";
  /** Disable the button externally */
  disabled?: boolean;
}

export default function StripeCheckoutButton({
  productKey,
  label,
  successPath,
  cancelPath,
  style,
  variant = "primary",
  disabled = false,
}: StripeCheckoutButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      setIsLoading(false);
    },
    onError: (err) => {
      setError(err.message);
      setIsLoading(false);
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setIsLoading(true);
    setError(null);
    checkout.mutate({
      productKey,
      origin: window.location.origin,
      successPath,
      cancelPath,
    });
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.82rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.9rem 2.5rem",
    borderRadius: "4px",
    border: variant === "secondary" ? "1px solid rgba(139,105,20,0.4)" : "none",
    cursor: isLoading || disabled ? "wait" : "pointer",
    opacity: isLoading || disabled ? 0.6 : 1,
    transition: "opacity 0.2s, background 0.2s",
    color: variant === "primary" ? "#F5F0E0" : "#8B6914",
    background: variant === "primary" ? "#0A0A10" : "transparent",
    ...style,
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading || disabled} style={baseStyle}>
        {isLoading ? "OPENING CHECKOUT..." : !isAuthenticated ? `SIGN IN TO ${label}` : label}
      </button>
      {error && (
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#c44",
            marginTop: "0.5rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
