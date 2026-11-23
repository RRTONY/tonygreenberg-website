import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AqueousProviders, useAWIProfile, useMember, useReferral } from "@/components/aqueous/aqueous-providers";
import { claimReferral, getAqueousMember, getMyReferral, trackShare } from "@/app/aqueous/actions";
import { defaultProfile } from "@/lib/content/aqueous/awi-engine";

vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(),
  getMyReferral: vi.fn(),
  claimReferral: vi.fn(),
  trackShare: vi.fn(),
}));

const member = { signedIn: true, email: "me@example.com", name: "Mia", isAdmin: false, subscriptionStatus: "active" };
const stats = { code: "AQ-ABC234", shares: 2, signups: 3, credits: "5.00", freeReportUnlocked: false };

let claimResult: { alreadyClaimed: boolean } | Error | null = null;

function Probe() {
  const { profile, hasCompletedSurvey, updateWeight, setProfile, resetProfile } = useAWIProfile();
  const referral = useReferral();
  const m = useMember();
  return (
    <div>
      <p>health:{profile.healthPriority}</p>
      <p>budget:{profile.budgetSensitivity}</p>
      <p>survey:{String(hasCompletedSurvey)}</p>
      <p>loading:{String(referral.loading)}</p>
      <p>loaded:{String(m.loaded)}</p>
      <p>signedIn:{String(m.signedIn)}</p>
      <p>email:{String(m.email)}</p>
      <p>link:{referral.stats?.link ?? "none"}</p>
      <p>shares:{referral.stats?.shares ?? "none"}</p>
      <p>referred:{String(referral.isReferred)}</p>
      <p>referrer:{String(referral.referrerCode)}</p>
      <p>claimed:{String(referral.alreadyClaimed)}</p>
      <button onClick={() => updateWeight("healthPriority", 9)}>weight</button>
      <button onClick={() => setProfile({ ...defaultProfile, budgetSensitivity: 2 })}>set</button>
      <button onClick={resetProfile}>reset</button>
      <button onClick={referral.trackShare}>share</button>
      <button onClick={m.refresh}>refresh</button>
      <button
        onClick={() =>
          referral.claimReferral("new@example.com").then(
            (r) => (claimResult = r),
            (e: Error) => (claimResult = e),
          )
        }
      >
        claim
      </button>
    </div>
  );
}

const renderProviders = () =>
  render(
    <AqueousProviders>
      <Probe />
    </AqueousProviders>,
  );

beforeEach(() => {
  claimResult = null;
  vi.mocked(getAqueousMember).mockResolvedValue(member);
  vi.mocked(getMyReferral).mockResolvedValue(stats);
  vi.mocked(trackShare).mockResolvedValue({ ok: true, data: null });
  vi.mocked(claimReferral).mockResolvedValue({ ok: true, data: { alreadyClaimed: false, totalSignups: 4, freeReportUnlocked: false } });
});
afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("AqueousProviders", () => {
  it("wraps the section in .aqueous-root with its fonts", async () => {
    const { container } = renderProviders();
    expect(container.firstElementChild).toHaveClass("aqueous-root", "--font-test", "min-h-screen");
    await screen.findByText("loaded:true");
  });

  it("starts from the default profile and keeps changes under the app's key", async () => {
    renderProviders();
    expect(screen.getByText(`health:${defaultProfile.healthPriority}`)).toBeInTheDocument();
    expect(screen.getByText("survey:false")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "weight" }));
    expect(screen.getByText("health:9")).toBeInTheDocument();
    expect(screen.getByText("survey:true")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("aqueous_user_profile")!)).toEqual({ ...defaultProfile, healthPriority: 9 });

    await userEvent.click(screen.getByRole("button", { name: "set" }));
    expect(screen.getByText("budget:2")).toBeInTheDocument();
    expect(screen.getByText(`health:${defaultProfile.healthPriority}`)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(screen.getByText("survey:false")).toBeInTheDocument();
    expect(screen.getByText(`budget:${defaultProfile.budgetSensitivity}`)).toBeInTheDocument();
  });

  it("loads a returning visitor's saved profile", async () => {
    window.localStorage.setItem("aqueous_user_profile", JSON.stringify({ ...defaultProfile, healthPriority: 1 }));
    renderProviders();
    expect(screen.getByText("health:1")).toBeInTheDocument();
    expect(screen.getByText("survey:true")).toBeInTheDocument();
    await screen.findByText("loaded:true");
  });

  it("loads the member and their referral link from the server", async () => {
    renderProviders();
    expect(screen.getByText("loading:true")).toBeInTheDocument();
    expect(screen.getByText("loaded:false")).toBeInTheDocument();
    expect(screen.getByText("signedIn:false")).toBeInTheDocument();
    expect(await screen.findByText("loaded:true")).toBeInTheDocument();
    expect(screen.getByText("loading:false")).toBeInTheDocument();
    expect(screen.getByText("signedIn:true")).toBeInTheDocument();
    expect(screen.getByText("email:me@example.com")).toBeInTheDocument();
    expect(screen.getByText(`link:${window.location.origin}/aqueous?ref=AQ-ABC234`)).toBeInTheDocument();
    expect(screen.getByText("shares:2")).toBeInTheDocument();
  });

  it("stays signed out when the check fails", async () => {
    vi.mocked(getAqueousMember).mockRejectedValue(new Error("offline"));
    renderProviders();
    expect(await screen.findByText("loaded:true")).toBeInTheDocument();
    expect(screen.getByText("signedIn:false")).toBeInTheDocument();
    expect(screen.getByText("link:none")).toBeInTheDocument();
  });

  it("ignores an answer that arrives after it unmounted", async () => {
    let resolve!: (v: typeof member) => void;
    vi.mocked(getAqueousMember).mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = renderProviders();
    unmount();
    await act(async () => resolve(member));
    expect(getMyReferral).toHaveBeenCalledTimes(1);
  });

  it("remembers a valid ?ref= code (upper-cased) and ignores a bad one", async () => {
    window.history.replaceState(null, "", "/aqueous?ref=aq-xyz789");
    renderProviders();
    expect(await screen.findByText("referrer:AQ-XYZ789")).toBeInTheDocument();
    expect(screen.getByText("referred:true")).toBeInTheDocument();
    expect(window.localStorage.getItem("aqueous_referred_by")).toBe('"AQ-XYZ789"');
    await screen.findByText("loaded:true");
  });

  it("doesn't remember a malformed ?ref=", async () => {
    window.history.replaceState(null, "", "/aqueous?ref=evil<script>");
    renderProviders();
    await screen.findByText("loaded:true");
    expect(screen.getByText("referred:false")).toBeInTheDocument();
    expect(window.localStorage.getItem("aqueous_referred_by")).toBeNull();
  });

  it("claims the referral with the remembered code and marks it claimed", async () => {
    window.localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ABC234"));
    renderProviders();
    await screen.findByText("loaded:true");
    await userEvent.click(screen.getByRole("button", { name: "claim" }));
    await waitFor(() => expect(claimResult).toEqual({ alreadyClaimed: false, totalSignups: 4, freeReportUnlocked: false }));
    expect(claimReferral).toHaveBeenCalledWith("AQ-ABC234", { email: "new@example.com", name: "" });
    expect(screen.getByText("claimed:true")).toBeInTheDocument();
    expect(window.localStorage.getItem("aqueous_referral_claimed")).toBe("true");
  });

  it("passes on a failed claim without marking it claimed", async () => {
    window.localStorage.setItem("aqueous_referred_by", JSON.stringify("AQ-ABC234"));
    vi.mocked(claimReferral).mockResolvedValue({ ok: false, error: "You can't claim your own referral link." });
    renderProviders();
    await screen.findByText("loaded:true");
    await userEvent.click(screen.getByRole("button", { name: "claim" }));
    await waitFor(() => expect(claimResult).toBeInstanceOf(Error));
    expect((claimResult as Error).message).toBe("You can't claim your own referral link.");
    expect(screen.getByText("claimed:false")).toBeInTheDocument();
  });

  it("can't claim without a referrer code", async () => {
    renderProviders();
    await screen.findByText("loaded:true");
    await userEvent.click(screen.getByRole("button", { name: "claim" }));
    await waitFor(() => expect((claimResult as Error).message).toBe("No referrer code"));
    expect(claimReferral).not.toHaveBeenCalled();
  });

  it("counts a share for a member with a link, then refreshes their stats", async () => {
    renderProviders();
    await screen.findByText("loaded:true");
    vi.mocked(getMyReferral).mockResolvedValue({ ...stats, shares: 3 });
    await userEvent.click(screen.getByRole("button", { name: "share" }));
    expect(trackShare).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("shares:3")).toBeInTheDocument();
    expect(getAqueousMember).toHaveBeenCalledTimes(2);
  });

  it("doesn't count a share without a link, and survives a failed share", async () => {
    vi.mocked(getMyReferral).mockResolvedValue(null);
    renderProviders();
    await screen.findByText("loaded:true");
    await userEvent.click(screen.getByRole("button", { name: "share" }));
    expect(trackShare).not.toHaveBeenCalled();

    vi.mocked(getMyReferral).mockResolvedValue(stats);
    await userEvent.click(screen.getByRole("button", { name: "refresh" }));
    await screen.findByText("shares:2");
    vi.mocked(trackShare).mockRejectedValue(new Error("offline"));
    await userEvent.click(screen.getByRole("button", { name: "share" }));
    expect(trackShare).toHaveBeenCalledTimes(1);
    expect(screen.getByText("shares:2")).toBeInTheDocument();
  });
});

describe("hooks outside the provider", () => {
  it("throw a clear error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAWIProfile())).toThrow("useAWIProfile must be used within AqueousProviders");
    expect(() => renderHook(() => useReferral())).toThrow("useReferral must be used within AqueousProviders");
    expect(() => renderHook(() => useMember())).toThrow("useMember must be used within AqueousProviders");
  });
});
