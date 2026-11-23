import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { ReferralClaimModal } from "@/components/aqueous/referral-claim-modal";
import { claimReferral } from "@/app/aqueous/actions";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(),
  claimReferral: vi.fn(),
}));

function referred() {
  localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ABC123"));
}

async function renderAndWait() {
  vi.useFakeTimers();
  const utils = render(
    <AqueousProviders>
      <ReferralClaimModal />
    </AqueousProviders>,
  );
  await act(async () => {
    vi.advanceTimersByTime(2100);
  });
  vi.useRealTimers();
  return utils;
}

async function fillAndSubmit(email: string, name = "") {
  if (name) fireEvent.change(screen.getByLabelText("Your name (optional)"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /Claim My \$5 Discount/ }));
  });
}

describe("ReferralClaimModal", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(claimReferral).mockReset();
  });

  it("stays hidden for visitors who weren't referred", async () => {
    await renderAndWait();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays hidden once closed this session", async () => {
    referred();
    sessionStorage.setItem("aqueous_referral_modal_dismissed", "true");
    await renderAndWait();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens after 2 seconds, focuses the first field, and claims the discount", async () => {
    referred();
    vi.mocked(claimReferral).mockResolvedValue({ ok: true, data: { alreadyClaimed: false } });
    await renderAndWait();
    const dialog = screen.getByRole("dialog", { name: "You've Been Gifted $5" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByLabelText("Your name (optional)")).toHaveFocus();
    expect(screen.getByText("AQ-ABC123")).toBeInTheDocument();
    await fillAndSubmit("friend@example.com", "Ana");
    expect(claimReferral).toHaveBeenCalledWith("AQ-ABC123", { email: "friend@example.com", name: "Ana" });
    expect(await screen.findByRole("heading", { name: "$5 Discount Claimed!" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start Exploring" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(sessionStorage.getItem("aqueous_referral_modal_dismissed")).toBe("true");
  });

  it("shows the already-claimed state", async () => {
    referred();
    vi.mocked(claimReferral).mockResolvedValue({ ok: true, data: { alreadyClaimed: true } });
    await renderAndWait();
    await fillAndSubmit("friend@example.com");
    expect(claimReferral).toHaveBeenCalledWith("AQ-ABC123", { email: "friend@example.com", name: "" });
    expect(await screen.findByRole("heading", { name: "Already Claimed" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue Browsing" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the server's error and a fallback for empty errors", async () => {
    referred();
    vi.mocked(claimReferral).mockResolvedValueOnce({ ok: false, error: "That referral link isn't valid." });
    await renderAndWait();
    await fillAndSubmit("friend@example.com");
    expect(await screen.findByRole("alert")).toHaveTextContent("That referral link isn't valid.");
    vi.mocked(claimReferral).mockRejectedValueOnce("boom");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Claim My \$5 Discount/ }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });

  it("validates the email before sending", async () => {
    referred();
    await renderAndWait();
    await fillAndSubmit("not-an-email");
    expect(await screen.findByText("Please enter a valid email.")).toBeInTheDocument();
    expect(claimReferral).not.toHaveBeenCalled();
  });

  it("closes with Escape, the close button, or the backdrop", async () => {
    referred();
    const { container } = await renderAndWait();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(container.querySelector("#referral-claim-modal")).toBeNull();
  });

  it("closes from the close button and the backdrop", async () => {
    referred();
    const first = await renderAndWait();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    first.unmount();
    sessionStorage.clear();
    const { container } = await renderAndWait();
    fireEvent.click(container.querySelector("#referral-claim-modal > div[aria-hidden]")!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("still closes when session storage is blocked", async () => {
    referred();
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
      if (key === "aqueous_referral_modal_dismissed") throw new Error("blocked");
      return key === "aqueous_referred_by" ? JSON.stringify("AQ-ABC123") : null;
    });
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    await renderAndWait();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    spy.mockRestore();
    setSpy.mockRestore();
  });
});
