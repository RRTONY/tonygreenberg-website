import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { Dashboard } from "@/components/aqueous/pages/dashboard";
import { createReport, getAqueousMember, getDashboard, type AqueousDashboard } from "@/app/aqueous/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
  getDashboard: vi.fn(),
  createReport: vi.fn(),
}));

const SIGNED_IN = { signedIn: true, email: "a@b.co", name: "Ana", isAdmin: false, subscriptionStatus: null };

const dash = (over: Partial<AqueousDashboard> = {}): AqueousDashboard => ({
  user: { name: "Ana", email: "a@b.co", isAdmin: false },
  purchases: [
    { id: 1, productType: "report", status: "completed", creditApplied: "5.00", createdAt: "2026-11-01T00:00:00Z" },
    { id: 2, productType: "subscription", status: "pending", creditApplied: "0.00", createdAt: "2026-11-02T00:00:00Z" },
  ],
  reports: [
    { id: 11, title: "AWI Report A", status: "complete", createdAt: "2026-11-03T00:00:00Z" },
    { id: 12, title: "AWI Report B", status: "generating", createdAt: "2026-11-03T00:00:00Z" },
    { id: 13, title: "AWI Report C", status: "failed", createdAt: "2026-11-03T00:00:00Z" },
    { id: 14, title: "AWI Report D", status: "pending", createdAt: "2026-11-03T00:00:00Z" },
  ],
  referral: { code: "AQ-ABC123", shares: 3, signups: 10, credits: "50.00", freeReportUnlocked: true },
  credit: 12.5,
  subscription: { id: "sub_1", status: "active" },
  reportsAvailable: 1,
  ...over,
});


const renderPage = () =>
  render(
    <AqueousProviders>
      <Dashboard />
    </AqueousProviders>,
  );

describe("Dashboard", () => {
  it("asks a signed-out visitor to sign in", async () => {
    renderPage();
    expect(screen.getByLabelText("Loading your dashboard")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Sign In to Access Your Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login?next=%2Faqueous%2Fdashboard");
    expect(getDashboard).not.toHaveBeenCalled();
  });

  it("shows the sign-in box when the server says the session ended", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Sign In to Access Your Dashboard" })).toBeInTheDocument();
  });

  it("says when it couldn't load, and tries again", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValueOnce({ ok: false, error: "This couldn't be done just now." });
    vi.mocked(getDashboard).mockRejectedValueOnce(new Error("x"));
    vi.mocked(getDashboard).mockResolvedValueOnce({ ok: true, data: dash() });
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText("This couldn't be done just now.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("This couldn't be loaded just now.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "Welcome back, Ana" })).toBeInTheDocument();
  });

  it("shows the overview, copies the referral link, and switches tabs", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValue({ ok: true, data: dash() });
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByRole("heading", { name: "Welcome back, Ana" })).toBeInTheDocument();
    expect(screen.getByText("$12.50")).toBeInTheDocument();
    expect(screen.getByText("Active — Flow State")).toBeInTheDocument();
    expect(screen.getByText("Free Report Unlocked!")).toBeInTheDocument();
    expect(screen.getByText("http://localhost:3000/aqueous?ref=AQ-ABC123")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Waters/ })).toHaveAttribute("href", "/aqueous/explore");

    await user.click(screen.getByRole("button", { name: "Copy referral link" }));
    expect(await navigator.clipboard.readText()).toBe("http://localhost:3000/aqueous?ref=AQ-ABC123");

    await user.click(screen.getByRole("button", { name: /Purchases/ }));
    expect(screen.getByRole("button", { name: /Purchases/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("(-$5.00 credit)")).toBeInTheDocument();
    expect(screen.getByText("pending")).toHaveClass("bg-amber-100");

    await user.click(screen.getByRole("button", { name: /Referrals/ }));
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("Unlocked!")).toBeInTheDocument();
    // Still "Copied" from the overview's copy a moment ago (shared state, as in the app).
    await user.click(screen.getByRole("button", { name: /Copied/ }));
    expect(await navigator.clipboard.readText()).toBe("http://localhost:3000/aqueous?ref=AQ-ABC123");
    await waitFor(() => expect(screen.getByRole("button", { name: /Copy$/ })).toBeInTheDocument(), { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /Reports/ }));
    expect(screen.getByRole("link", { name: /AWI Report A/ })).toHaveAttribute("href", "/aqueous/report/11");
    expect(within(screen.getByRole("link", { name: /AWI Report B/ })).getByText("generating")).toHaveClass("bg-blue-100");
    expect(within(screen.getByRole("link", { name: /AWI Report C/ })).getByText("failed")).toHaveClass("bg-red-100");
    expect(within(screen.getByRole("link", { name: /AWI Report D/ })).getByText("pending")).toHaveClass("bg-amber-100");
  });

  it("shows the empty states for a new member", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue({ ...SIGNED_IN, name: null });
    vi.mocked(getDashboard).mockResolvedValue({
      ok: true,
      data: dash({ user: { name: null, email: "a@b.co", isAdmin: false }, purchases: [], reports: [], referral: null, subscription: { id: null, status: null } }),
    });
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByRole("heading", { name: "Welcome back, Water Guardian" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upgrade to Flow State" })).toHaveAttribute("href", "/aqueous/pricing");
    await user.click(screen.getByRole("button", { name: /Purchases/ }));
    expect(screen.getByRole("link", { name: "View Pricing" })).toHaveAttribute("href", "/aqueous/pricing");
    await user.click(screen.getByRole("button", { name: /Referrals/ }));
    expect(screen.getByText("Start Sharing")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Reports/ }));
    expect(screen.getByText("No Reports Yet")).toBeInTheDocument();
  });

  it("generates a report and opens it", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValue({ ok: true, data: dash() });
    let resolve!: (v: { ok: true; data: { reportId: number } }) => void;
    vi.mocked(createReport).mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    renderPage();
    const button = await screen.findByRole("button", { name: /Generate New Report/ });
    await user.click(button);
    expect(createReport).toHaveBeenCalledWith();
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve({ ok: true, data: { reportId: 42 } });
    await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith("/aqueous/report/42"));
  });

  it("keeps the button when none is available and shows the server's reason", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValue({ ok: true, data: dash({ reports: [], reportsAvailable: 0 }) });
    const reason = "Reports come with a report purchase ($20), or free once 10 people sign up with your link.";
    vi.mocked(createReport).mockResolvedValueOnce({ ok: false, error: reason });
    vi.mocked(createReport).mockRejectedValueOnce(new Error("down"));
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole("button", { name: /Reports/ }));
    await user.click(screen.getByRole("button", { name: "Generate Report" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(reason));
    expect(screen.getByRole("button", { name: "Generate Report" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Generate Report" }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("This couldn't be done just now. Please try again in a minute."),
    );
    expect(navigation.router.push).not.toHaveBeenCalled();
  });

  it("New Report button on the reports list", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getDashboard).mockResolvedValue({ ok: true, data: dash() });
    vi.mocked(createReport).mockResolvedValue({ ok: true, data: { reportId: 7 } });
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole("button", { name: /Reports/ }));
    await user.click(screen.getByRole("button", { name: "New Report" }));
    await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith("/aqueous/report/7"));
  });
});
