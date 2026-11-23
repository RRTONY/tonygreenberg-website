import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { Premium } from "@/components/liquidsun/pages/premium";
import { PremiumSuccess } from "@/components/liquidsun/pages/premium-success";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import {
  getLiquidsunMember,
  openBillingPortal,
  startPremiumCheckout,
  type LiquidsunMember,
} from "@/app/liquid-sun/actions";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(),
  startPremiumCheckout: vi.fn(),
  openBillingPortal: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { info: vi.fn(), error: vi.fn() } }));

const member = (over: Partial<LiquidsunMember> = {}): LiquidsunMember => ({
  signedIn: true,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
  ...over,
});

let assign: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.mocked(getLiquidsunMember).mockResolvedValue(member());
  assign = vi.fn();
  vi.stubGlobal("location", { ...window.location, assign });
});

const renderPage = (testMode = false) =>
  render(
    <LiquidsunProviders>
      <Premium testMode={testMode} />
    </LiquidsunProviders>,
  );

describe("Premium", () => {
  it("shows both plans with annual selected and the feature lists", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Unlock the Full Experience");
    expect(screen.getByRole("radio", { name: /Annual/ })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("radio", { name: /Monthly/ }));
    expect(screen.getByRole("radio", { name: /Monthly/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Real buy links with live pricing from 3+ retailers")).toBeInTheDocument();
    expect(screen.getByText("Browse the curated collection")).toBeInTheDocument();
  });

  it("shows the test card only in Stripe test mode", () => {
    const { unmount } = renderPage(false);
    expect(screen.getByText("Secure checkout powered by Stripe.")).toBeInTheDocument();
    unmount();
    renderPage(true);
    expect(screen.getByText(/Test with card 4242 4242 4242 4242/)).toBeInTheDocument();
  });

  it("asks a signed-out visitor to sign in first", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({ signedIn: false }));
    renderPage();
    expect(await screen.findByRole("link", { name: /Sign In to Subscribe/ })).toHaveAttribute(
      "href",
      "/login?next=/liquid-sun/premium",
    );
  });

  it("sends a member to Stripe Checkout for the chosen plan", async () => {
    let finish!: (v: { ok: true; data: { url: string } }) => void;
    vi.mocked(startPremiumCheckout).mockReturnValueOnce(new Promise((r) => (finish = r)));
    renderPage();
    await userEvent.click(screen.getByRole("radio", { name: /Monthly/ }));
    const button = await screen.findByRole("button", { name: /Subscribe — \$9.99\/mo/ });
    await userEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    finish({ ok: true, data: { url: "https://checkout.stripe.com/c/pay/cs_test_1" } });
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_1"));
    expect(startPremiumCheckout).toHaveBeenCalledWith("monthly");
    expect(toast.info).toHaveBeenCalledWith("Redirecting to secure checkout...");
  });

  it("shows checkout errors and lets the member try again", async () => {
    vi.mocked(startPremiumCheckout)
      .mockResolvedValueOnce({ ok: false, error: "Checkout isn't available just now." })
      .mockResolvedValueOnce({ ok: false, error: "" })
      .mockRejectedValueOnce(new Error("offline"));
    renderPage();
    const button = await screen.findByRole("button", { name: /Subscribe — \$79.99\/yr/ });
    await userEvent.click(button);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Checkout isn't available just now."));
    await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);
    await waitFor(() => expect(toast.error).toHaveBeenLastCalledWith("Failed to create checkout session"));
    await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(3));
    expect(assign).not.toHaveBeenCalled();
  });

  it("lets a Premium member open the billing portal", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({ isPremium: true, subscriptionStatus: "trialing", hasCustomer: true }));
    vi.mocked(openBillingPortal).mockResolvedValueOnce({ ok: true, data: { url: "https://billing.stripe.com/p/1" } });
    renderPage();
    expect(await screen.findByRole("heading", { name: "You're Premium" })).toBeInTheDocument();
    expect(screen.getByText("Trial active")).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Manage Subscription/ }));
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://billing.stripe.com/p/1"));
  });

  it("shows portal errors", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({ isPremium: true, subscriptionStatus: "active" }));
    vi.mocked(openBillingPortal)
      .mockResolvedValueOnce({ ok: false, error: "No Stripe customer found. Please subscribe first." })
      .mockResolvedValueOnce({ ok: false, error: "" })
      .mockRejectedValueOnce(new Error("offline"));
    renderPage();
    const manage = await screen.findByRole("button", { name: /Manage Subscription/ });
    expect(screen.queryByText("Trial active")).not.toBeInTheDocument();
    await userEvent.click(manage);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("No Stripe customer found. Please subscribe first."));
    await waitFor(() => expect(manage).toBeEnabled());
    await userEvent.click(manage);
    await waitFor(() => expect(toast.error).toHaveBeenLastCalledWith("Failed to open billing portal"));
    await waitFor(() => expect(manage).toBeEnabled());
    await userEvent.click(manage);
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(3));
  });
});

describe("PremiumSuccess", () => {
  it("welcomes the member, links on, and re-checks their status", async () => {
    render(
      <LiquidsunProviders>
        <PremiumSuccess />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to the Inner Circle");
    expect(screen.getByRole("link", { name: /Explore the Flavor Matrix/ })).toHaveAttribute("href", "/liquid-sun/quadrant");
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/liquid-sun");
    await waitFor(() => expect(getLiquidsunMember).toHaveBeenCalledTimes(2));
  });
});
