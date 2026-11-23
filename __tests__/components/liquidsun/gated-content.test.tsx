import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GatedContent, GatedValue } from "@/components/liquidsun/gated-content";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { getLiquidsunMember, type LiquidsunMember } from "@/app/liquid-sun/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn() }));

const member = (over: Partial<LiquidsunMember>): LiquidsunMember => ({
  signedIn: false,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
  ...over,
});

function renderGates() {
  return render(
    <LiquidsunProviders>
      <GatedContent type="buy" placeholder={<span>Buy — $XX</span>}>
        <a href="https://shop.test">Buy — $86</a>
      </GatedContent>
      <GatedContent type="review">
        <p>Review text</p>
      </GatedContent>
      <GatedContent type="premium">
        <p>Premium data</p>
      </GatedContent>
      <GatedContent type="premium" forceShow>
        <p>Forced</p>
      </GatedContent>
      <GatedValue>
        <span>89</span>
      </GatedValue>
      <GatedValue type="buy">
        <span>$40</span>
      </GatedValue>
    </LiquidsunProviders>,
  );
}

beforeEach(() => {
  navigation.pathname = "/liquid-sun";
});

describe("GatedContent / GatedValue", () => {
  it("blurs content and sends a signed-out visitor to sign in and back", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({}));
    renderGates();
    const buy = await screen.findAllByRole("link", { name: "Sign in free to see where to buy" });
    expect(buy).toHaveLength(2);
    for (const link of buy) expect(link).toHaveAttribute("href", "/login?next=%2Fliquid-sun");
    expect(screen.getByText("Buy — $XX")).toBeInTheDocument();
    expect(screen.queryByText("Buy — $86")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in free to read reviews" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upgrade to Premium for full access" })).toHaveAttribute("href", "/liquid-sun/premium");
    expect(screen.getByText("Forced")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in free to see panel scores" })).toHaveTextContent("89");
  });

  it("shows free content to a signed-in member but keeps Premium locked", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({ signedIn: true }));
    renderGates();
    expect(await screen.findByRole("link", { name: "Buy — $86" })).toHaveAttribute("href", "https://shop.test");
    expect(screen.getByText("Review text")).toBeInTheDocument();
    expect(screen.getByText("89")).not.toHaveAttribute("aria-hidden");
    expect(screen.getByRole("link", { name: "Upgrade to Premium for full access" })).toBeInTheDocument();
  });

  it("unlocks everything for a Premium member", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({ signedIn: true, isPremium: true }));
    renderGates();
    // Locked content is rendered blurred inside the sign-in link, so wait for the links to go.
    await waitFor(() => expect(screen.queryByRole("link", { name: /Sign in free|Upgrade/ })).not.toBeInTheDocument());
    expect(screen.getByText("Premium data")).toBeInTheDocument();
  });

  it("uses /liquid-sun as the return page when the path is unknown", () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member({}));
    navigation.pathname = "" as string;
    renderGates();
    expect(screen.getByRole("link", { name: "Sign in free to read reviews" })).toHaveAttribute("href", "/login?next=%2Fliquid-sun");
  });
});
