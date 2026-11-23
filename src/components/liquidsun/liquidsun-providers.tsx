"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { liquidsunTranslations, type LiquidsunLanguage } from "@/lib/content/liquidsun/translations";
import { liquidsunFontVariables } from "@/lib/fonts/liquidsun-fonts";
import { getLiquidsunMember, type LiquidsunMember } from "@/app/liquid-sun/actions";

// The LiquidSun app's LanguageContext (same localStorage key, "tequila-language", so a returning
// visitor keeps their choice) plus the member state its useAuth() and subscription.getStatus gave
// every page: signed in or not (Supabase Auth instead of Manus OAuth) and Premium or not (Stripe,
// recorded by the webhook). It also renders the section wrapper: .liquidsun-root scopes liquidsun.css.
// The app's ThemeProvider was fixed to dark, so there is no theme switch here.

type LanguageContextValue = {
  language: LiquidsunLanguage;
  setLanguage: (language: LiquidsunLanguage) => void;
  t: (key: string) => string;
};

export type MemberState = LiquidsunMember & {
  /** False until the first check comes back; gated content stays locked meanwhile, as on the app. */
  loaded: boolean;
  refresh: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const MemberContext = createContext<MemberState | undefined>(undefined);

const SIGNED_OUT: LiquidsunMember = {
  signedIn: false,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
};

export function LiquidsunProviders({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStore<LiquidsunLanguage>("tequila-language", "en");
  const [member, setMember] = useState<LiquidsunMember>(SIGNED_OUT);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let live = true;
    getLiquidsunMember()
      .then((m) => live && setMember(m))
      .catch(() => live && setMember(SIGNED_OUT))
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, [version]);

  const t = useCallback(
    (key: string) => liquidsunTranslations[language]?.[key] || liquidsunTranslations.en[key] || key,
    [language],
  );
  const languageValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const memberValue = useMemo(() => ({ ...member, loaded, refresh }), [member, loaded, refresh]);

  return (
    <LanguageContext.Provider value={languageValue}>
      <MemberContext.Provider value={memberValue}>
        <div lang={language} className={`${liquidsunFontVariables} liquidsun-root dark min-h-screen bg-background text-foreground`}>
          {children}
        </div>
      </MemberContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LiquidsunProviders");
  return context;
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) throw new Error("useMember must be used within LiquidsunProviders");
  return context;
}
