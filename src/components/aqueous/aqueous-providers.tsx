"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocalStore, writeLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { aqueousFontVariables } from "@/lib/fonts/aqueous-fonts";
import { aq } from "@/lib/content/aqueous/nav";
import { defaultProfile, type UserWaterProfile } from "@/lib/content/aqueous/awi-engine";
import {
  claimReferral as claimReferralAction,
  getAqueousMember,
  getMyReferral,
  trackShare as trackShareAction,
  type AqueousMember,
  type ClaimResult,
  type ReferralStats as ServerReferralStats,
} from "@/app/aqueous/actions";

// The Aqueous app's three contexts in one provider, plus the section wrapper (.aqueous-root scopes
// aqueous.css and sets the fonts):
// - AWIProfileContext: the 10-point water profile, kept in the visitor's browser under the app's own
//   key ("aqueous_user_profile"), so a returning visitor keeps their weights.
// - ReferralContext: "?ref=AQ-XXXXXX" on any /aqueous page is remembered ("aqueous_referred_by", the
//   app's key) for the claim modal; the member's own code and stats come from the server (actions.ts).
// - useAuth(): signed in or not (Supabase Auth instead of Manus OAuth), owner or not, plan status.
// The app's ThemeProvider was fixed to light, so there is no theme switch.

const PROFILE_KEY = "aqueous_user_profile";
const REFERRED_KEY = "aqueous_referred_by";
const CLAIMED_KEY = "aqueous_referral_claimed";
const NO_PROFILE: UserWaterProfile | null = null;
const NO_CODE: string | null = null;
const NOT_CLAIMED = false;

// ─── AWI profile ───

type AWIProfileContextType = {
  profile: UserWaterProfile;
  setProfile: (profile: UserWaterProfile) => void;
  updateWeight: (key: keyof UserWaterProfile, value: number) => void;
  hasCompletedSurvey: boolean;
  resetProfile: () => void;
};

// ─── Referral ───

export type ReferralStats = ServerReferralStats & { link: string };

type ReferralContextType = {
  stats: ReferralStats | null;
  loading: boolean;
  trackShare: () => void;
  isReferred: boolean;
  referrerCode: string | null;
  alreadyClaimed: boolean;
  claimReferral: (email: string, name?: string) => Promise<ClaimResult>;
};

// ─── Member ───

export type MemberState = AqueousMember & {
  /** False until the first check comes back. */
  loaded: boolean;
  refresh: () => void;
};

const AWIProfileContext = createContext<AWIProfileContextType | null>(null);
const ReferralContext = createContext<ReferralContextType | null>(null);
const MemberContext = createContext<MemberState | null>(null);

const SIGNED_OUT: AqueousMember = { signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null };

export function AqueousProviders({ children }: { children: ReactNode }) {
  // Profile
  const [stored, setStored] = useLocalStore<UserWaterProfile | null>(PROFILE_KEY, NO_PROFILE);
  const profile = stored ?? defaultProfile;
  const setProfile = useCallback((next: UserWaterProfile) => setStored(next), [setStored]);
  const updateWeight = useCallback(
    (key: keyof UserWaterProfile, value: number) => setStored((prev) => ({ ...(prev ?? defaultProfile), [key]: value })),
    [setStored],
  );
  const resetProfile = useCallback(() => setStored(null), [setStored]);
  const profileValue = useMemo(
    () => ({ profile, setProfile, updateWeight, hasCompletedSurvey: stored !== null, resetProfile }),
    [profile, setProfile, updateWeight, stored, resetProfile],
  );

  // Referral: remember ?ref= (an external store write, no state set in the effect).
  const [referrerCode] = useLocalStore<string | null>(REFERRED_KEY, NO_CODE);
  const [alreadyClaimed, setAlreadyClaimed] = useLocalStore<boolean>(CLAIMED_KEY, NOT_CLAIMED);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && /^AQ-[A-Z0-9]{6}$/i.test(ref)) writeLocalStore(REFERRED_KEY, ref.toUpperCase(), NO_CODE);
  }, []);

  // Member + own referral stats from the server.
  const [member, setMember] = useState<AqueousMember>(SIGNED_OUT);
  const [server, setServer] = useState<ServerReferralStats | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let live = true;
    Promise.all([getAqueousMember(), getMyReferral()])
      .then(([m, r]) => {
        if (!live) return;
        setMember(m);
        setServer(r);
      })
      .catch(() => live && setMember(SIGNED_OUT))
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, [version]);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const trackShare = useCallback(() => {
    if (!server) return;
    trackShareAction()
      .then(() => refresh())
      .catch(() => {});
  }, [server, refresh]);

  const claimReferral = useCallback(
    async (email: string, name?: string) => {
      if (!referrerCode) throw new Error("No referrer code");
      const result = await claimReferralAction(referrerCode, { email, name: name ?? "" });
      if (!result.ok) throw new Error(result.error);
      setAlreadyClaimed(true);
      return result.data;
    },
    [referrerCode, setAlreadyClaimed],
  );

  const stats = useMemo<ReferralStats | null>(
    () =>
      server
        ? { ...server, link: `${typeof window === "undefined" ? "https://tonygreenberg.com" : window.location.origin}${aq(`?ref=${server.code}`)}` }
        : null,
    [server],
  );
  const referralValue = useMemo(
    () => ({
      stats,
      loading: !loaded,
      trackShare,
      isReferred: Boolean(referrerCode),
      referrerCode,
      alreadyClaimed,
      claimReferral,
    }),
    [stats, loaded, trackShare, referrerCode, alreadyClaimed, claimReferral],
  );
  const memberValue = useMemo(() => ({ ...member, loaded, refresh }), [member, loaded, refresh]);

  return (
    <AWIProfileContext.Provider value={profileValue}>
      <MemberContext.Provider value={memberValue}>
        <ReferralContext.Provider value={referralValue}>
          <div className={`${aqueousFontVariables} aqueous-root min-h-screen bg-background text-foreground antialiased`}>{children}</div>
        </ReferralContext.Provider>
      </MemberContext.Provider>
    </AWIProfileContext.Provider>
  );
}

export function useAWIProfile() {
  const ctx = useContext(AWIProfileContext);
  if (!ctx) throw new Error("useAWIProfile must be used within AqueousProviders");
  return ctx;
}

export function useReferral() {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error("useReferral must be used within AqueousProviders");
  return ctx;
}

/** The app's useAuth(): `signedIn` is its `isAuthenticated`, `loaded` the inverse of its `loading`. */
export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMember must be used within AqueousProviders");
  return ctx;
}
