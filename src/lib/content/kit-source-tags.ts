// Ported from legacy server/routers.ts's `subscribe.add` procedure — the
// source→tag mapping used to segment newsletter subscribers in Kit
// (ConvertKit) by which form on the site they signed up from. Real
// content, unchanged. Includes tags for pages not built in this app yet
// (later "Find Your X" assessments) — harmless to keep; a source string
// that isn't a key here just falls back to a generated "Source: X" tag,
// same as legacy.
export const KIT_TAG_MAP: Record<string, string> = {
  footer: "Website Footer",
  subscribe: "Newsletter: Throughline",
  "first-sip": "BrewSoul: First Sip",
  "find-your-me": "Assessment: Find Your Me",
  "find-your-mirror": "Assessment: Find Your Mirror",
  "find-your-peptide": "Assessment: Find Your Peptide",
  "find-your-attachment-style": "Assessment: Attachment Style",
  "find-your-love-language": "Assessment: Love Language",
  "find-your-therapy": "Assessment: Find Your Therapy",
  "find-your-diet": "Assessment: Find Your Diet",
  "find-your-sleep": "Assessment: Find Your Sleep",
  "find-your-movement": "Assessment: Find Your Movement",
  "find-your-coffee": "Assessment: Find Your Coffee",
  "find-your-sake": "Assessment: Find Your Sake",
  "find-your-kitchen": "Assessment: Find Your Kitchen",
  "find-your-style": "Assessment: Find Your Style",
  "find-your-spirit": "Assessment: Find Your Spirit",
  "find-your-religion": "Assessment: Find Your Religion",
  "find-your-sexuality": "Assessment: Find Your Sexuality",
  "peptide-quiz-25": "Peptide: 25-Question Quiz",
  "peptide-supply-chain": "Peptide: Supply Chain Gate",
  "peptide-hall-of-shame": "Peptide: Hall of Shame",
  "peptide-matrix": "Peptide: Review-Evidence Matrix",
  "mid-article": "Blog: Mid-Article Signup",
  "consciousness-scale": "Assessment: Consciousness Scale",
  "grant-study": "Assessment: Grant Study",
  "dharma-finder": "Assessment: Dharma Finder",
  "journey-finder": "Assessment: Journey Finder",
  "living-declaration": "Community: Living Declaration",
  // EmailGate always sources as `find-your-<assessmentSlug>` (see that
  // component), but these 3 assessments' real routes are the bare
  // /consciousness-scale, /grant-study, /dharma-finder — not /find-your-*
  // — so their EmailGate calls produce a `find-your-` prefixed source that
  // wouldn't otherwise match the bare keys above. Same tag value as the
  // bare key; just the alias EmailGate's fixed prefix actually looks up.
  "find-your-consciousness-scale": "Assessment: Consciousness Scale",
  "find-your-grant-study": "Assessment: Grant Study",
  "find-your-dharma-finder": "Assessment: Dharma Finder",
  // /assessment's 3-way Builder/Crusader/Investor archetype quiz — real
  // per-archetype segmentation, ported from legacy's own source strings.
  "assessment-builder": "Assessment: Builder",
  "assessment-crusader": "Assessment: Crusader",
  "assessment-investor": "Assessment: Investor",
};

// Prefix-matched sources (dynamic per-post/per-flow identifiers).
export const KIT_DYNAMIC_TAG_PREFIXES: [prefix: string, tag: string][] = [
  ["jewel-box:", "Exit Intent: Jewel Box"],
  ["outburst-", "Blog: Subscribe Outburst"],
  ["micro-yes-", "Blog: Micro-Yes Flow"],
  ["tip-me-off", "Engagement: Tip Me Off"],
];

export function resolveKitTag(source: string): string {
  if (KIT_TAG_MAP[source]) return KIT_TAG_MAP[source];
  for (const [prefix, tag] of KIT_DYNAMIC_TAG_PREFIXES) {
    if (source.startsWith(prefix)) return tag;
  }
  return `Source: ${source}`;
}
