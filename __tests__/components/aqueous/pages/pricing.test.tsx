import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { Pricing } from "@/components/aqueous/pages/pricing";
import { getAqueousMember, getMyCredit, getMyReferral, startCheckout } from "@/app/aqueous/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
  getMyCredit: vi.fn(async () => 0),
  startCheckout: vi.fn(),
}));

const SIGNED_IN = { signedIn: true, email: "a@b.co", name: "A", isAdmin: false, subscriptionStatus: null };
const STATS = { code: "AQ-ABC123", shares: 2, signups: 4, credits: "20.00", freeReportUnlocked: false };

let assign: ReturnType<typeof vi.fn>;
beforeEach(() => {
  assign = vi.fn();
  vi.stubGlobal("location", { ...window.location, assign });
});

const renderPage = () =>
  render(
    <AqueousProviders>
      <Pricing />
    </AqueousProviders>,
  );

describe("Pricing", () => {
  it("shows the three plans, the money split and the app's links", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cross-Reference Scores Are Free. Forever.");
    expect(screen.getByText("Open Source")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("Indigenous Water Stewards")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start Exploring" })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: /Find Your Water/ })).toHaveAttribute("href", "/aqueous/tap-water");
    expect(screen.getByRole("link", { name: "Read the Manifesto" })).toHaveAttribute("href", "/aqueous/manifesto");
    await waitFor(() => expect(getAqueousMember).toHaveBeenCalled());
    expect(getMyCredit).not.toHaveBeenCalled();
  });

  it("shows the referral discount and progress for a referred visitor", async () => {
    window.localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ZZZ999"));
    vi.mocked(getMyReferral).mockResolvedValue(STATS);
    renderPage();
    expect(await screen.findByText("You have a $5 referral discount applied!")).toBeInTheDocument();
    expect(screen.getByText("$15")).toBeInTheDocument();
    expect(await screen.findByText("4/10")).toBeInTheDocument();
  });

  it("sends a signed-out visitor to sign in", async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(getAqueousMember).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Get Your Report" }));
    expect(toast).toHaveBeenCalledWith("Please sign in first to purchase.");
    expect(navigation.router.push).toHaveBeenCalledWith("/login?next=%2Faqueous%2Fpricing");
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("starts checkout for a member, with credit applied, and goes to Stripe", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getMyCredit).mockResolvedValue(7.5);
    let resolve!: (v: { ok: true; data: { url: string } }) => void;
    vi.mocked(startCheckout).mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText("You have $7.50 in referral credits — applied at checkout!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Get Your Report" }));
    expect(startCheckout).toHaveBeenCalledWith("report", true);
    expect(screen.getByRole("button", { name: "Get Your Report" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Join Flow State" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Get Your Report" }).querySelector(".animate-spin")).not.toBeNull();
    resolve({ ok: true, data: { url: "https://checkout.stripe.com/x" } });
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/x"));
    expect(toast).toHaveBeenCalledWith("Redirecting to checkout...");
  });

  it("shows the server's error, and handles a session that ran out", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(startCheckout).mockResolvedValueOnce({ ok: false, error: "Checkout isn't available yet." });
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(getMyCredit).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: "Join Flow State" }));
    expect(startCheckout).toHaveBeenCalledWith("subscription", true);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Checkout isn't available yet."));
    expect(screen.getByRole("button", { name: "Join Flow State" })).toBeEnabled();

    vi.mocked(startCheckout).mockResolvedValueOnce({ ok: false, error: "Please sign in first.", signedOut: true });
    await user.click(screen.getByRole("button", { name: "Join Flow State" }));
    await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith("/login?next=%2Faqueous%2Fpricing"));

    vi.mocked(startCheckout).mockRejectedValueOnce(new Error("network"));
    await user.click(screen.getByRole("button", { name: "Get Your Report" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Failed to start checkout"));
  });

  it("keeps the donation buttons' coming-soon messages", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "$25" }));
    expect(toast).toHaveBeenCalledWith("Donation portal coming soon — thank you for your generosity!");
    await user.click(screen.getByRole("button", { name: "Custom" }));
    expect(toast).toHaveBeenCalledWith("Custom donation portal coming soon!");
  });
});
