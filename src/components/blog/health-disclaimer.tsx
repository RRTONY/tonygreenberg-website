// Health disclaimer near the end of health-related essays (SEO pack section
// 3 and 8, owner's yes 2026-10-10). An essay counts as health-related when it
// carries one of these Sanity tags (exact match, any case), so an editor can
// opt a new essay in from Studio by adding one of them. Chosen 2026-10-10 from
// the tags essays already use for personal health advice: blood tests, heart,
// diet, addiction and treatment. Left out on purpose: essays that only discuss
// health policy or the health business ("public health", "digital health").
// Coffee essays (a tag mentioning coffee or caffeine) get the caffeine wording.
const HEALTH_TAGS = new Set([
  "coffee bone density",
  "cafestol ldl",
  "coffee calcium loss",
  "caffeine",
  "blood testing",
  "toxicology",
  "preventative health",
  "preventative medicine",
  "biomarkers",
  "longevity",
  "cardiac health",
  "preventive cardiology",
  "heart health optimization",
  "personal health",
  "diet and lifestyle",
  "addiction",
  "addiction recovery",
  "substance use",
  "ptsd treatment",
  "clinical ibogaine",
  "peptide therapy",
  "psychedelic medicine safety",
]);

export function healthDisclaimerKind(tags: string[] | undefined): "caffeine" | "general" | null {
  const lower = (tags ?? []).map((t) => t.trim().toLowerCase());
  if (!lower.some((t) => HEALTH_TAGS.has(t))) return null;
  return lower.some((t) => /coffee|caffeine/.test(t)) ? "caffeine" : "general";
}

const COPY = {
  caffeine:
    "This essay is opinion and general information, not medical advice. Talk to a clinician before changing your caffeine intake, especially if you have a heart condition, are pregnant, or take medication.",
  general:
    "This essay is opinion and general information, not medical advice. Talk to a clinician before changing your diet, supplements or medication.",
};

export function HealthDisclaimer({ tags }: { tags?: string[] }) {
  const kind = healthDisclaimerKind(tags);
  if (!kind) return null;
  return (
    <aside aria-label="Health disclaimer" className="mt-10 border-l-2 border-essay-brown/35 pl-4">
      <p className="font-mono text-xs leading-relaxed tracking-[0.02em] text-muted-foreground">{COPY[kind]}</p>
    </aside>
  );
}
