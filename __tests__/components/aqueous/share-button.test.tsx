import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { FloatingShare, ReferralBanner, ShareButton } from "@/components/aqueous/share-button";
import { getMyReferral, trackShare } from "@/app/aqueous/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

const STATS = { code: "AQ-ABC123", shares: 2, signups: 3, credits: "15.00", freeReportUnlocked: true };

function renderIn(ui: React.ReactNode) {
  return render(<AqueousProviders>{ui}</AqueousProviders>);
}

describe("ShareButton", () => {
  let open: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    navigation.pathname = "/aqueous/explore";
    open = vi.fn();
    vi.stubGlobal("open", open);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getMyReferral).mockResolvedValue(null);
  });

  it("button variant: shares this page with the member's code", async () => {
    vi.mocked(getMyReferral).mockResolvedValue(STATS);
    const user = userEvent.setup();
    renderIn(<ShareButton />);
    const trigger = screen.getByRole("button", { name: /Share & Earn \$5/ });
    await user.click(trigger);
    expect(await screen.findByText("AQ-ABC123")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "X / Twitter" }));
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent("http://localhost:3000/aqueous/explore?ref=AQ-ABC123"));
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent("Use my code AQ-ABC123"));
    expect(trackShare).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "WhatsApp" })).toBeNull();
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "WhatsApp" }));
    expect(open.mock.calls[1][0]).toMatch(/^https:\/\/wa\.me\//);
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Email" }));
    expect(open.mock.calls[2][0]).toMatch(/^mailto:/);
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(toast.success).toHaveBeenCalledWith("Link copied with your referral code!");
  });

  it("signed out: plain link, no code, and a sign-in link", async () => {
    const user = userEvent.setup();
    renderIn(<ShareButton variant="card" url="/aqueous/pricing?x=1" />);
    expect(await screen.findByRole("link", { name: "sign in to get yours" })).toHaveAttribute(
      "href",
      `/login?next=${encodeURIComponent("/aqueous/explore")}`,
    );
    expect(screen.getByRole("textbox", { name: "Your share link" })).toHaveValue("http://localhost:3000/aqueous/pricing?x=1");
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Link copied!");
    expect(screen.queryByText(/You've shared/)).toBeNull();
  });

  it("card variant with stats shows progress and the unlocked report", async () => {
    vi.mocked(getMyReferral).mockResolvedValue(STATS);
    renderIn(<ShareButton variant="card" url="https://example.com/a?b=1" />);
    expect(await screen.findByText(/You've shared 2 times · 3\/10 sign-ups/)).toBeInTheDocument();
    expect(screen.getByText("Free report unlocked!")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Your share link" })).toHaveValue("https://example.com/a?b=1&ref=AQ-ABC123");
  });

  it("card variant: singular share count", async () => {
    vi.mocked(getMyReferral).mockResolvedValue({ ...STATS, shares: 1, freeReportUnlocked: false });
    renderIn(<ShareButton variant="card" />);
    expect(await screen.findByText(/You've shared 1 time ·/)).toBeInTheDocument();
  });

  it("icon variant opens a menu and closes after a pick", async () => {
    const user = userEvent.setup();
    renderIn(<ShareButton variant="icon" />);
    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "Email" }));
    expect(screen.queryByRole("button", { name: "Email" })).toBeNull();
    expect(toast.success).not.toHaveBeenCalledWith("Link copied with your referral code!");
  });

  it("inline variant shows one button per platform", async () => {
    const user = userEvent.setup();
    renderIn(<ShareButton variant="inline" className="justify-center" />);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(toast.success).toHaveBeenCalledWith("Link copied!");
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("shows a spinner while the code is loading", () => {
    vi.mocked(getMyReferral).mockReturnValue(new Promise(() => {}));
    renderIn(<ShareButton variant="card" />);
    expect(screen.getByLabelText("Loading your code")).toBeInTheDocument();
  });
});

describe("FloatingShare", () => {
  it("wraps the share button in the floating share zone", () => {
    const { container } = renderIn(<FloatingShare />);
    expect(container.querySelector("#floating-share")).toHaveAttribute("data-shareable");
    expect(screen.getByRole("button", { name: /Share & Earn/ })).toBeInTheDocument();
  });
});

describe("ReferralBanner", () => {
  it("is hidden for visitors who weren't referred", () => {
    const { container } = renderIn(<ReferralBanner />);
    expect(container.querySelector("#referral-banner")).toBeNull();
  });

  it("welcomes a referred visitor until dismissed", async () => {
    localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ZZZ999"));
    const user = userEvent.setup();
    renderIn(<ReferralBanner />);
    expect(screen.getByText("AQ-ZZZ999")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("AQ-ZZZ999")).toBeNull();
  });

  it("is hidden once the discount was claimed", async () => {
    localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ZZZ999"));
    localStorage.setItem("aqueous_referral_claimed", "true");
    renderIn(<ReferralBanner />);
    await act(async () => {});
    await waitFor(() => expect(screen.queryByText("AQ-ZZZ999")).toBeNull());
  });
});
