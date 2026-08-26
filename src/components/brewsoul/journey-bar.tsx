"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const subscribeNever = () => () => {};

// True only after the client has hydrated — same `useSyncExternalStore`
// mount-gate idiom already established in `components/theme-toggle.tsx`.
// Reading localStorage straight in the render body used to happen
// unconditionally here, which made the client's first hydration pass
// disagree with the server's (no `window` there) — a real hydration
// mismatch, not just a lint nit. Gating the read behind this flag means
// SSR and the first client render both show "not visited," and the real
// localStorage-derived state only appears once React knows it's safe.
function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

// Ported from legacy client/src/pages/brewsoul/JourneyBar.tsx — a fixed
// bottom bar showing progress through the BrewSoul journey plus
// contextual "what's next" suggestions per page, so no page is a dead
// end. Real content/behavior, unchanged. Most linked pages aren't built
// yet — same forward-reference pattern as the rest of Phase 6 (the nav
// and directory are already full of these).
const JOURNEY_STEPS = [
  { id: "identity", label: "Identity Quiz", path: "/brewsoul", icon: "🪞", short: "Identity" },
  { id: "first-sip", label: "The First Sip", path: "/brewsoul/first-sip", icon: "✨", short: "Manifesto" },
  { id: "home", label: "Dashboard", path: "/brewsoul/home", icon: "☕", short: "Home" },
  { id: "quiz", label: "Taste Quiz", path: "/brewsoul/quiz", icon: "🎯", short: "Taste" },
  { id: "browse", label: "Catalog", path: "/brewsoul/browse", icon: "📖", short: "Browse" },
  { id: "chains", label: "Chain Rankings", path: "/brewsoul/chains", icon: "🏪", short: "Chains" },
] as const;

type Suggestion = { label: string; path: string; why: string };

const SUGGESTIONS: Record<string, Suggestion[]> = {
  "/brewsoul/first-sip": [
    { label: "Coffee Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "What science says" },
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where your money goes" },
  ],
  "/brewsoul/home": [
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Find your perfect match" },
    { label: "Browse All Coffees", path: "/brewsoul/browse", why: "Explore the full catalog" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Is your daily stop worth it?" },
  ],
  "/brewsoul/browse": [
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Let us match you" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Compare chains" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
  ],
  "/brewsoul/quiz": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "See the full catalog" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Rate your daily stop" },
    { label: "Dashboard", path: "/brewsoul/home", why: "Back to overview" },
  ],
  "/brewsoul/chains": [
    { label: "Browse Top Coffees", path: "/brewsoul/browse", why: "Find better options" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where your money goes" },
  ],
  "/brewsoul/wall-of-shame": [
    { label: "Browse Clean Coffees", path: "/brewsoul/browse", why: "Find the good stuff" },
    { label: "Mold-Free Verified", path: "/brewsoul/mold-free", why: "Tested & clean" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Who's actually good?" },
  ],
  "/brewsoul/follow-the-dollar": [
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
    { label: "Economics Deep Dive", path: "/brewsoul/economics", why: "The full picture" },
    { label: "Browse Ethical Coffees", path: "/brewsoul/browse", why: "Vote with your cup" },
  ],
  "/brewsoul/health": [
    { label: "Mold-Free Verified", path: "/brewsoul/mold-free", why: "Tested & clean" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find healthy options" },
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made matters" },
  ],
  "/brewsoul/farms": [
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Where money goes" },
    { label: "Economics", path: "/brewsoul/economics", why: "The supply chain" },
    { label: "Browse Farm Coffees", path: "/brewsoul/browse", why: "Taste the origin" },
  ],
  "/brewsoul/mold-free": [
    { label: "Health Claims", path: "/brewsoul/health", why: "What science says" },
    { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", why: "Who's failing" },
    { label: "Browse Clean Coffees", path: "/brewsoul/browse", why: "Find verified options" },
  ],
  "/brewsoul/experiences": [
    { label: "Food Pairings", path: "/brewsoul/pairings", why: "Perfect combinations" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your next cup" },
  ],
  "/brewsoul/varieties": [
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made" },
    { label: "Roaster Profiles", path: "/brewsoul/roasters", why: "Who roasts it" },
    { label: "Browse by Variety", path: "/brewsoul/browse", why: "Taste the difference" },
  ],
  "/brewsoul/processing": [
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Bean types explained" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Where it grows" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your method" },
  ],
  "/brewsoul/roasters": [
    { label: "Browse Their Coffees", path: "/brewsoul/browse", why: "Taste their work" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
    { label: "New Drops", path: "/brewsoul/drops", why: "Latest releases" },
  ],
  "/brewsoul/glossary": [
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Deep dive" },
    { label: "Processing Methods", path: "/brewsoul/processing", why: "How it's made" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Apply what you learned" },
  ],
  "/brewsoul/pairings": [
    { label: "Experiences", path: "/brewsoul/experiences", why: "Coffee moments" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find the pairing" },
  ],
  "/brewsoul/economics": [
    { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", why: "Your money's path" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "Who pays fairly?" },
  ],
  "/brewsoul/compare": [
    { label: "Browse Full Catalog", path: "/brewsoul/browse", why: "Find more to compare" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
    { label: "Blend Builder", path: "/brewsoul/blend-builder", why: "Create your own" },
  ],
  "/brewsoul/blend-builder": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find ingredients" },
    { label: "Varieties Guide", path: "/brewsoul/varieties", why: "Know your beans" },
    { label: "Food Pairings", path: "/brewsoul/pairings", why: "Perfect with..." },
  ],
  "/brewsoul/drops": [
    { label: "Browse Full Catalog", path: "/brewsoul/browse", why: "See everything" },
    { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
    { label: "My Collection", path: "/brewsoul/my-coffees", why: "Save favorites" },
  ],
  "/brewsoul/collection": [
    { label: "Browse More", path: "/brewsoul/browse", why: "Discover new coffees" },
    { label: "New Drops", path: "/brewsoul/drops", why: "Latest releases" },
    { label: "Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
  ],
  "/brewsoul/submit": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "See what's listed" },
    { label: "Chain Rankings", path: "/brewsoul/chains", why: "How chains rank" },
    { label: "Dashboard", path: "/brewsoul/home", why: "Back to overview" },
  ],
  "/brewsoul/prescription": [
    { label: "Browse Catalog", path: "/brewsoul/browse", why: "Find your prescription" },
    { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Refine your profile" },
    { label: "My Collection", path: "/brewsoul/collection", why: "Your saved coffees" },
  ],
  "/brewsoul/biodynamic": [
    { label: "Decaf Done Right", path: "/brewsoul/decaf", why: "Swiss Water vs. paint stripper" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "Peer-reviewed research" },
    { label: "Farm Profiles", path: "/brewsoul/farms", why: "Meet the growers" },
  ],
  "/brewsoul/decaf": [
    { label: "Biodynamic Census", path: "/brewsoul/biodynamic", why: "Every certified farm on earth" },
    { label: "Coffee & Health", path: "/brewsoul/health", why: "What science says" },
    { label: "Coffee Prescription", path: "/brewsoul/prescription", why: "Your daily recommendation" },
  ],
};

const DETAIL_SUGGESTIONS: Suggestion[] = [
  { label: "Browse More Coffees", path: "/brewsoul/browse", why: "Explore the catalog" },
  { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Find your match" },
  { label: "Compare Coffees", path: "/brewsoul/compare", why: "Side by side" },
];

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { label: "Dashboard", path: "/brewsoul/home", why: "Overview" },
  { label: "Browse Catalog", path: "/brewsoul/browse", why: "All coffees" },
  { label: "Take the Taste Quiz", path: "/brewsoul/quiz", why: "Get matched" },
];

export function JourneyBar() {
  const pathname = usePathname();
  const mounted = useMounted();

  const currentStep = JOURNEY_STEPS.find((s) => (s.path === "/brewsoul" ? pathname === "/brewsoul" : pathname.startsWith(s.path)));

  const isDetail = pathname.startsWith("/brewsoul/coffee/");
  const suggestions = isDetail ? DETAIL_SUGGESTIONS : SUGGESTIONS[pathname] || DEFAULT_SUGGESTIONS;

  // Don't show on the welcome/identity quiz page — it has its own flow
  if (pathname === "/brewsoul") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9990] border-t border-[#C5A23C]/20 bg-[#2C1810]/92 px-3 py-2.5 backdrop-blur-md sm:px-8">
      <div className="mb-2 flex items-center justify-center gap-1.5">
        {JOURNEY_STEPS.map((step) => {
          const isCurrent = currentStep?.id === step.id;
          const isVisited = mounted && !!localStorage.getItem(`brewsoul-visited-${step.id}`);
          return (
            <Link key={step.id} href={step.path} className="flex items-center gap-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  isCurrent
                    ? "w-6 bg-linear-to-br from-[#C5A23C] to-[#D4B96A]"
                    : isVisited
                      ? "w-2 rounded-full bg-[#C5A23C]/50"
                      : "w-2 rounded-full bg-white/15"
                }`}
              />
              {isCurrent && (
                <span className="font-mono text-[0.58rem] tracking-wide text-[#D4B96A] uppercase">{step.short}</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-mono text-[0.58rem] tracking-wide text-white/40 uppercase">Next →</span>
        {suggestions.map((s) => (
          <Link
            key={s.path}
            href={s.path}
            className="flex items-center gap-1.5 rounded-full border border-[#C5A23C]/20 bg-[#C5A23C]/12 px-3 py-1.5 transition-colors hover:border-[#C5A23C]/40 hover:bg-[#C5A23C]/25"
          >
            <span className="text-[0.78rem] font-semibold text-[#F5F0E6]">{s.label}</span>
            <span className="font-mono text-[0.58rem] text-[#D4B96A]/70">{s.why}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Not a hook — plain localStorage write, deliberately not "use"-prefixed
// despite legacy's naming (that name tripped React's rules-of-hooks lint
// when called from inside a useEffect, since ESLint treats any
// use-prefixed identifier as a hook).
export function markVisited(stepId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`brewsoul-visited-${stepId}`, "1");
  }
}

// A tiny client island for Server Component pages (e.g. first-sip) that
// just need to record a visit without becoming client components
// themselves.
export function MarkVisited({ stepId }: { stepId: string }) {
  useEffect(() => {
    markVisited(stepId);
  }, [stepId]);
  return null;
}
