import { BookOpen, Compass, Handshake, Microscope, type LucideIcon } from "lucide-react";
import type { Door } from "@/components/marketing/four-doors";

// Ported from legacy client/src/pages/Blog.tsx's `BLOG_DOORS`. Real copy,
// unchanged. Legacy rendered these as image-first tap cards using 4 real
// photos (door01-04) that lived on the Manus `/api/img/` proxy — rescued
// via `scripts/rescue-homepage-images.ts` (fetched once from the still-live
// legacy host, uploaded to Sanity, one-off script since this homepage isn't
// otherwise Sanity-backed) and hardcoded below as real `cdn.sanity.io`
// URLs. `icon`/`imgWidth`/`imgHeight` stay as a fallback path in
// `four-doors.tsx` for any door that ever loses its photo again, but all 4
// have real images now.
//
// `icon` here is the bare component (not yet rendered) — this is plain data,
// consumed by a Server Component (see app/page.tsx) that renders each icon
// into an element before handing the array to FourDoors, a Client
// Component that can't accept a raw component reference as a prop.
export type HomeDoor = Omit<Door, "icon"> & { icon?: LucideIcon };

export const HOME_DOORS: HomeDoor[] = [
  {
    num: "01",
    title: "Read",
    sub: "Essays on culture, capital & consciousness",
    href: "#essays-archive",
    icon: BookOpen,
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/7670024ec62a664462e3d5bfdc26cb79475fc237-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Twenty-five years of thinking, unfiltered",
    body: "Essays that challenge extractive systems and explore what comes next. Culture, capital, consciousness — written for people who are tired of being managed and ready to think for themselves.",
    bullets: [
      "118 essays spanning enterprise technology, psychedelic medicine, and social impact",
      "Featured in Harvard H+, Davos 2022, and independent media",
      "No paywall. No algorithm. Just the work.",
    ],
    cta: "Read the Essays",
  },
  {
    num: "02",
    title: "Diagnose",
    sub: "Assessments that clarify who you are",
    href: "/find-my",
    icon: Compass,
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/9fa1715fe62fd90ee02f9c4741afc2c5456c4db8-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Clarity is a competitive advantage",
    body: "Short assessments — five to ten minutes — that surface decisions you've been avoiding. Who you are, what you want, and what's getting in the way. Immediate insight, no consultant required.",
    bullets: [
      "Psychographic profiling across leadership, risk, and values",
      "Calibrated against 25 years of pattern recognition",
      "Results you can actually act on",
    ],
    cta: "Find Your Fit",
  },
  {
    num: "03",
    title: "Engage",
    sub: "Builders & investors in regenerative systems",
    href: "/ecosystem",
    icon: Handshake,
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/f5a276d213f7ddc29f6a9b196028e268413108e2-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "The people building what comes after extraction",
    body: "A curated network of builders, investors, and operators who are done with the old playbook. Real capital. Real projects. No pitch decks required — just alignment on what matters.",
    bullets: [
      "Active investments across psychedelic medicine, impact tokens, and payments infrastructure",
      "ImpactSoul — a Certified B Corp tokenizing cultural and real estate assets",
      "Introductions by merit, not by LinkedIn connection count",
    ],
    cta: "Explore the Ecosystem",
  },
  {
    num: "04",
    title: "Verify",
    sub: "COA checks, testing & vendor scoring",
    href: "/verify-your-coa",
    icon: Microscope,
    img: "https://cdn.sanity.io/images/a3q1cyqs/production/305e817d671e9a50f85d064760e1e01f5a7bb73e-1200x1607.webp",
    imgWidth: 1200,
    imgHeight: 1607,
    headline: "Trust, but verify. Actually, just verify.",
    body: "Before you order anything from anyone — peptides, supplements, compounds — here's how to actually confirm what you're getting. COA interpretation, independent testing labs, and vendor scoring built from real sourcing experience.",
    bullets: [
      "Certificate of Analysis (COA) reading guide",
      "Independent third-party lab recommendations",
      "Vendor scoring rubric based on $10B+ procurement experience",
    ],
    cta: "Verify Your Source",
  },
];
