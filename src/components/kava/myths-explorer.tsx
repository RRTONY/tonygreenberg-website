"use client";

import { useState } from "react";
import { KavaCard } from "@/components/kava/kava-ui";

type Verdict = "DEBUNKED" | "NUANCED" | "FALSE AND DANGEROUS";

interface Myth {
  id: number;
  title: string;
  verdict: Verdict;
  evidence: string;
}

// Precomposed literal classes per verdict — small enumerable set, same
// Tailwind static-scanner rule enforced throughout this migration.
const VERDICT_CLASS: Record<Verdict, string> = {
  DEBUNKED: "bg-[#16a34a]/15 text-[#16a34a]",
  NUANCED: "bg-[#d97706]/15 text-[#d97706]",
  "FALSE AND DANGEROUS": "bg-[#dc2626]/15 text-[#dc2626]",
};

// Ported from legacy client/src/pages/kava/KavaMyths.tsx — the real 7
// myths, real verdicts, and real evidence paragraphs (WHO findings, the
// 2002/2014 European ban and reversal, CYP2D6 metabolism data, chemotype
// distinctions), all unchanged and verbatim. Expand/collapse interactivity
// extracted into this client island.
const MYTHS: Myth[] = [
  {
    id: 1,
    title: "Kava damages the liver — it was banned in Europe for a reason",
    verdict: "DEBUNKED",
    evidence:
      "The European bans of 2002 were based on over 100 case reports of liver toxicity. Follow-up investigation revealed the culprit: non-noble tudei cultivars used in ethanolic extracts — not traditional aqueous noble kava. The German Administrative Court overturned the 2002 ban on June 10, 2014, making kava legal again. WHO concluded that traditional aqueous noble kava presents an acceptably low health risk — described as dramatically safer than Paracetamol. Key metabolic insight: 99% of Pacific Islanders have the CYP2D6 enzyme to safely metabolize kava; only 79 to 88% of Caucasian populations have this enzyme — which may explain why 3,000 years of Pacific traditional use produced no hepatotoxicity crisis, while Western extract supplement users did.",
  },
  {
    id: 2,
    title: "Kava is addictive because it acts on GABA like benzodiazepines",
    verdict: "NUANCED",
    evidence:
      "Kava produces reverse tolerance — the body becomes more sensitive to kava over time, not less. This is the pharmacological opposite of addiction. No withdrawal syndrome has been documented in traditional ceremonial use patterns. However, heavy daily extract supplementation in susceptible individuals has produced some habituation reports in the literature. Episodic ceremonial use — the PRI model — carries no meaningful addiction risk. The benzodiazepine comparison breaks at the receptor level: kava does not bind to the benzodiazepine receptor site; it modulates GABA-A through a different mechanism.",
  },
  {
    id: 3,
    title: "Kava is a psychedelic — it makes you hallucinate",
    verdict: "DEBUNKED",
    evidence:
      "Kava is psychoactive but not psychedelic. Kavalactones make subtle changes to mood without affecting cognition, reality perception, or causing hallucinations. Kava does not activate 5-HT2A receptors — the defining mechanism of classical psychedelics including psilocybin, LSD, and mescaline. Heavy doses of fresh Pohnpeian sakau may produce mild sensory attenuation for experienced users — this is not hallucination. It is the GABA-mediated quieting of sensory processing.",
  },
  {
    id: 4,
    title: "Kava knocks you out — it is basically a sedative",
    verdict: "NUANCED",
    evidence:
      'Noble aqueous kava at ceremonial doses of 120 to 240mg kavalactones produces what 19th-century ethnographers described as "a pleasant, warm, and cheerful, but lazy feeling. Even after consuming large volumes of kava, reason and consciousness remain unaffected." The knocked-out experience is specific to: tudei non-noble cultivars; ethanolic extracts; excessive dosing above 300mg kavalactones; or mixing with alcohol. Correct noble aqueous preparation at ceremonial dose: alert, grounded, socially open, and fully present.',
  },
  {
    id: 5,
    title: "All kava products are the same",
    verdict: "FALSE AND DANGEROUS",
    evidence:
      "This is the most consequential myth in the kava space. Chemotype determines pharmacological personality. A Vanuatu fresh-ground preparation is pharmacologically different from a Hawaiian Mo'i traditional bowl, which is categorically different from a Pohnpeian sakau session, which is entirely different from a kava supplement tablet. Outside of Vanuatu, Solomon Islands, and Papua New Guinea, there are no indigenous varieties with heavy kavalactones. Polynesian navigators spread only noble cultivars across the Pacific — for good reason. Always verify cultivar, always verify preparation method, always verify noble status.",
  },
  {
    id: 6,
    title: "Kava capsules work the same as traditional kava tea",
    verdict: "NUANCED",
    evidence:
      "Capsules and ethanolic extracts alter the kavalactone ratio and bioavailability in ways that change the experience and the safety profile. The analogy: natural kava beverage is to a kava capsule as a freshly brewed cappuccino is to a caffeine pill. Both deliver the active compound; the experience is fundamentally different. For PRI ceremonial use: only traditional aqueous preparation of noble cultivar is appropriate. Capsules may serve individual daily therapeutic purposes between sessions, but they are not a ceremonial substitute — they lack the relational, embodied, and sensory dimensions of the kava bowl.",
  },
  {
    id: 7,
    title: "Kava is not safe for long-term use",
    verdict: "NUANCED",
    evidence:
      "Pacific Island populations have used kava daily for their entire adult lives for 3,000 years. The chronic-use concerns documented in Western medical literature are specific to ethanolic extract supplements, not traditional aqueous noble kava. WHO: traditional aqueous noble kava presents acceptably low health risk. Australia regulates kava as food under the Australia New Zealand Food Standards Code. Hawaii granted GRAS status in 2024. The appropriate framing: long-term traditional aqueous noble kava use = well-established safety profile. Long-term high-dose extract supplementation = legitimate concern requiring medical monitoring.",
  },
];

export function MythsExplorer() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {MYTHS.map((myth) => {
        const isOpen = expanded === myth.id;
        return (
          <KavaCard
            key={myth.id}
            className="cursor-pointer"
            onClick={() => setExpanded(isOpen ? null : myth.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${VERDICT_CLASS[myth.verdict]}`}
                  >
                    {myth.verdict}
                  </span>
                </div>
                <h3 className="font-heading text-lg leading-[1.4] font-bold text-kava-ink">
                  Myth {myth.id}: &ldquo;{myth.title}&rdquo;
                </h3>
              </div>
              <span
                className={`mt-1 shrink-0 text-xl text-kava-saffron transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"}`}
              >
                +
              </span>
            </div>
            {isOpen && (
              <div className="mt-4 border-t border-kava-sand-muted pt-4">
                <p className="text-base leading-[1.75] text-kava-ink/80">{myth.evidence}</p>
              </div>
            )}
          </KavaCard>
        );
      })}
    </div>
  );
}
