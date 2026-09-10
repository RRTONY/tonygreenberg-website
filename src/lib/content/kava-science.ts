export interface Kavalactone {
  num: number;
  name: string;
  abbrev: string;
  mechanisms: string[];
  priRelevance: string;
  colorHex: string;
}

// Ported from legacy client/src/pages/kava/KavaScience.tsx's real 6
// major kavalactones (real mechanisms, real PRI relevance), unchanged.
// Kept as a plain data module (not exported from the "use client"
// `chemotype-decoder.tsx`) since the Server Component page also needs it
// for the static kavalactone grid — same RSC-boundary lesson already
// learned porting /brewsoul/decaf.
export const KAVALACTONES: Kavalactone[] = [
  {
    num: 1,
    name: "Desmethoxyyangonin",
    abbrev: "DMY",
    mechanisms: ["Increases dopamine", "Reversible MAO-B inhibitor"],
    priRelevance:
      "Elevates mood, openness, sociability; reduces resistance to experience; fights effects of low dopamine.",
    colorHex: "#F59E0B",
  },
  {
    num: 2,
    name: "Dihydrokavain",
    abbrev: "DHK",
    mechanisms: ["GABA-A potentiation — the strongest anxiolytic kavalactone"],
    priRelevance:
      "Core anxiety reduction; dissolves the fear that blocks readiness; the therapeutic workhorse of the kava bowl.",
    colorHex: "#3B82F6",
  },
  {
    num: 3,
    name: "Yangonin",
    abbrev: "Y",
    mechanisms: ["CB1 receptor affinity — endocannabinoid system engagement", "CNS calming"],
    priRelevance:
      "Endocannabinoid bridge; produces warm, grounded sensory receptivity; the body-warmth kavalactone.",
    colorHex: "#10B981",
  },
  {
    num: 4,
    name: "Kavain",
    abbrev: "K",
    mechanisms: ["Sodium and calcium channel blockade", "Acts on limbic system and amygdala"],
    priRelevance:
      "Physical relaxation without cognitive fog; the ideal carrier state. Chemotypes with 4 as first number are most desirable for ceremony. Kavain and dihydrokavain are the most permeable to the blood-brain barrier.",
    colorHex: "#8B5CF6",
  },
  {
    num: 5,
    name: "Dihydromethysticin",
    abbrev: "DHM",
    mechanisms: [
      "Increases serotonin",
      "MAO-B inhibition",
      "Activates glutamatergic NMDA receptors",
    ],
    priRelevance:
      "Serotonergic priming; may sensitize 5-HT2A pathway for subsequent medicines; neuroprotective via Nrf2/HO1 pathway.",
    colorHex: "#EC4899",
  },
  {
    num: 6,
    name: "Methysticin",
    abbrev: "M",
    mechanisms: [
      "Serotonin modulation",
      "Nrf2 and HO1 pathway activation (neuroprotective)",
      "NF-kB inhibition (anti-inflammatory)",
    ],
    priRelevance:
      "Anti-neuroinflammatory; protects the nervous system entering altered states; the guardian kavalactone.",
    colorHex: "#EF4444",
  },
];

export const COMBINED_PROFILE = [
  "GABA-A potentiation (not via benzodiazepine receptor — different binding site)",
  "Dopamine modulation (dual — increases and decreases depending on specific kavalactone)",
  "Reversible MAO-B inhibition — ALL 6 major kavalactones share this property",
  "CB1 receptor affinity (endocannabinoid)",
  "Sodium channel blockade",
  "Calcium channel blockade — reduction up to 70%",
  "Norepinephrine reuptake inhibition (kavain and methysticin)",
  "Limbic system and amygdala targeting — fear center reduction",
  "Neuroprotective via Nrf2/HO1 pathway (methysticin, kavain, yangonin)",
  "Reverse tolerance — body becomes more sensitive to kava over time, not less",
  "Non-addictive — no withdrawal syndrome documented in traditional use patterns",
];
