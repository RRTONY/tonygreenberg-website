import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { PaymentSuccess } from "@/components/aqueous/pages/payment-success";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

describe("PaymentSuccess", () => {
  it("thanks the member, explains what's next and links on", () => {
    render(
      <AqueousProviders>
        <PaymentSuccess />
      </AqueousProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Thank You, Water Guardian");
    expect(screen.getByText("What Happens Next")).toBeInTheDocument();
    expect(screen.getByText("Spread the Flow")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Waters/ })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: "View AWI Index" })).toHaveAttribute("href", "/aqueous/awi");
  });
});
