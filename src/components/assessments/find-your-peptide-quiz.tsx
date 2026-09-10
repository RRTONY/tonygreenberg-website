"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Dna,
  Flame,
  Paperclip,
  ShieldCheck,
  Sprout,
  TriangleAlert,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";
import { BioChainCTA } from "@/components/marketing/biochain-cta";

// Ported from legacy client/src/pages/FindYourPeptide.tsx — "The Peptide
// Clarity Index™," a real, evidence-cited 10-question assessment across 7
// clinical axes (recovery/metabolic/vitality/immune/cognitive/sexual/
// longevity), mapping to 16 real archetypal peptide profiles. Every
// question (with its real PubMed/journal citation), every profile's real
// primary/secondary peptides with mechanisms and evidence citations,
// suggested lab work, red flags, and stacking notes are ported unchanged
// and verbatim — this is clinical-adjacent content built from real
// research, not something to paraphrase. The real Peptide Readiness Score
// (average axis score minus a contraindication penalty), the real
// contraindication-flag screening, and the real medical disclaimer are
// all preserved. The real share buttons (Twitter/LinkedIn/email/copy
// link) are backend-free and kept; `AssessmentResultActions` is the same
// simplified (Download-PDF-only) version already built for
// `/find-your-spirit` — legacy's "Send to Tony"/DB-save props aren't
// needed since that backend isn't built. Legacy's results screen used
// light cream text (`rgba(232,228,220,*)`) on `ThemedBackground`'s real
// light pastel "peptide" theme — same low-contrast bug already caught and
// fixed on `/find-your-style` and `/find-your-sexuality`; normalized to
// dark ink here too. No email-gate: legacy's version here didn't use the
// shared `EmailGate` component (it had its own simpler inline gate) — the
// simpler inline version is preserved rather than swapped for the shared
// component, since it never called the Kit/subscribe endpoint even in
// legacy (this gate was a plain client-side unlock, not backed by a real
// mailing-list action).
type Axis = "recovery" | "metabolic" | "vitality" | "immune" | "cognitive" | "sexual" | "longevity";

const AXES: Record<Axis, { label: string }> = {
  recovery: { label: "Recovery & Repair" },
  metabolic: { label: "Metabolic Health" },
  vitality: { label: "Growth & Vitality" },
  immune: { label: "Immune Defense" },
  cognitive: { label: "Cognitive Performance" },
  sexual: { label: "Hormonal & Sexual" },
  longevity: { label: "Longevity & Cellular" },
};

const AXIS_ICONS: Record<Axis, LucideIcon> = {
  recovery: Wrench,
  metabolic: Zap,
  vitality: Sprout,
  immune: ShieldCheck,
  cognitive: Brain,
  sexual: Flame,
  longevity: Dna,
};
const AXIS_KEYS = Object.keys(AXES) as Axis[];
const ACCENT = "#00838F";

interface Choice {
  text: string;
  subtext?: string;
  weights: Partial<Record<Axis, number>>;
  contraFlag?: string;
}
interface Question {
  stem: string;
  subtext: string;
  citation?: string;
  choices: Choice[];
}

function ch(
  text: string,
  weights: Partial<Record<Axis, number>>,
  extra?: { subtext?: string; contraFlag?: string },
): Choice {
  return { text, weights, ...extra };
}

const QUESTIONS: Question[] = [
  {
    stem: "How does your body handle physical damage?",
    subtext:
      "Think about the last time you were injured, had surgery, or pushed your body hard. How did recovery go?",
    citation: "Sikiric et al., J Physiol Pharmacol, 2018 — BPC-157 tissue repair mechanisms",
    choices: [
      ch(
        "I heal quickly — minor injuries resolve in days, not weeks",
        { recovery: 1, vitality: 1 },
        { subtext: "Strong baseline recovery" },
      ),
      ch(
        "Recovery takes longer than it used to — I notice a slow decline",
        { recovery: 3, vitality: 2, longevity: 1 },
        { subtext: "Age-related repair slowdown" },
      ),
      ch(
        "I have chronic pain or an injury that never fully healed",
        { recovery: 4, immune: 1 },
        { subtext: "Persistent tissue damage" },
      ),
      ch(
        "My gut is the problem — bloating, inflammation, or digestive issues dominate",
        { recovery: 3, immune: 2, metabolic: 1 },
        { subtext: "Gut-specific repair needs" },
      ),
      ch(
        "I'm recovering from surgery or a major physical event right now",
        { recovery: 5, vitality: 2 },
        { subtext: "Acute recovery window", contraFlag: "active_recovery" },
      ),
    ],
  },
  {
    stem: "What's your relationship with your metabolism?",
    subtext:
      "Not what the scale says. How your body processes energy, stores fat, and responds to food.",
    citation: "Wilding et al., NEJM, 2021 — Semaglutide STEP trial outcomes",
    choices: [
      ch("My metabolism works fine — I maintain weight without much effort", {
        metabolic: 1,
        vitality: 1,
      }),
      ch(
        "I've gained weight that won't respond to diet or exercise anymore",
        { metabolic: 4, vitality: 1, longevity: 1 },
        { subtext: "Metabolic resistance" },
      ),
      ch(
        "I crash after meals — energy spikes and drops control my day",
        { metabolic: 3, cognitive: 2, vitality: 1 },
        { subtext: "Insulin/glucose dysregulation" },
      ),
      ch(
        "I have a family history of diabetes, heart disease, or metabolic syndrome",
        { metabolic: 4, longevity: 2, immune: 1 },
        { subtext: "Genetic metabolic risk", contraFlag: "metabolic_family_history" },
      ),
      ch(
        "I'm actively trying to recompose my body — lose fat, gain muscle",
        { metabolic: 3, vitality: 3 },
        { subtext: "Body recomposition goal" },
      ),
    ],
  },
  {
    stem: "How do you sleep — and how do you feel when you wake up?",
    subtext:
      "Sleep architecture is the foundation of growth hormone release, cellular repair, and cognitive consolidation.",
    citation: "Van Cauter et al., JAMA, 2000 — GH secretion and sleep quality correlation",
    choices: [
      ch("I sleep well and wake rested — 7-8 hours of solid, uninterrupted sleep", {
        vitality: 1,
        cognitive: 1,
      }),
      ch(
        "I sleep enough hours but wake exhausted — the quality is gone",
        { vitality: 4, cognitive: 2, longevity: 1 },
        { subtext: "Disrupted sleep architecture" },
      ),
      ch(
        "I can't fall asleep — my mind races or my body won't settle",
        { cognitive: 3, vitality: 2, immune: 1 },
        { subtext: "Onset insomnia / HPA axis dysregulation" },
      ),
      ch(
        "I wake at 2-4 AM and can't get back to sleep",
        { vitality: 4, longevity: 2, metabolic: 1 },
        { subtext: "Cortisol/GH imbalance pattern" },
      ),
      ch(
        "I've noticed my recovery from workouts and illness has slowed with poor sleep",
        { vitality: 3, recovery: 3, immune: 2 },
        { subtext: "Sleep-recovery cascade failure" },
      ),
    ],
  },
  {
    stem: "How often do you get sick — and how hard does it hit?",
    subtext:
      "Your immune system is a peptide-driven orchestra. This question maps its current performance.",
    citation: "Tuthill et al., Ann NY Acad Sci, 2010 — Thymosin alpha-1 immune modulation",
    choices: [
      ch("Rarely sick — maybe once a year, and I bounce back fast", { immune: 1, vitality: 1 }),
      ch(
        "I catch everything going around — colds, flu, infections hit me hard",
        { immune: 4, vitality: 2, longevity: 1 },
        { subtext: "Immune suppression pattern" },
      ),
      ch(
        "I have autoimmune issues — my immune system attacks my own body",
        { immune: 5, recovery: 2, longevity: 1 },
        { subtext: "Immune dysregulation", contraFlag: "autoimmune" },
      ),
      ch(
        "Chronic low-grade inflammation — I'm not 'sick' but I'm never fully well",
        { immune: 3, longevity: 3, recovery: 1 },
        { subtext: "Inflammaging pattern" },
      ),
      ch(
        "I'm immunocompromised or on immunosuppressive medication",
        { immune: 5, longevity: 2 },
        { subtext: "Medical immune status", contraFlag: "immunocompromised" },
      ),
    ],
  },
  {
    stem: "What's happening with your brain?",
    subtext:
      "Not your intelligence. Your cognitive machinery — focus, recall, processing speed, mental stamina.",
    citation: "Uchida et al., Behav Brain Res, 2017 — Semax/Selank nootropic mechanisms",
    choices: [
      ch("Sharp as ever — I can focus for hours and recall details easily", {
        cognitive: 1,
        vitality: 1,
      }),
      ch(
        "Brain fog is real — I lose words, forget why I walked into rooms",
        { cognitive: 4, longevity: 2, vitality: 1 },
        { subtext: "Cognitive decline pattern" },
      ),
      ch(
        "I can focus but I'm mentally exhausted by 2 PM every day",
        { cognitive: 3, metabolic: 2, vitality: 1 },
        { subtext: "Cognitive fatigue / neurotransmitter depletion" },
      ),
      ch(
        "Anxiety and racing thoughts dominate — I can't quiet my mind",
        { cognitive: 4, immune: 1, sexual: 1 },
        { subtext: "HPA axis / GABAergic imbalance" },
      ),
      ch(
        "I have a family history of cognitive decline, Alzheimer's, or dementia",
        { cognitive: 4, longevity: 4 },
        { subtext: "Neuroprotection priority", contraFlag: "neuro_family_history" },
      ),
    ],
  },
  {
    stem: "How's your hormonal and sexual health?",
    subtext:
      "Libido, energy, mood, and sexual function are downstream signals of peptide and hormonal balance.",
    citation: "Diamond et al., J Sex Med, 2016 — PT-141 (bremelanotide) clinical efficacy",
    choices: [
      ch("Everything works well — libido, energy, and function are all solid", {
        sexual: 1,
        vitality: 1,
      }),
      ch(
        "My libido has dropped noticeably — I'm less interested than I used to be",
        { sexual: 4, vitality: 2, longevity: 1 },
        { subtext: "Hormonal decline pattern" },
      ),
      ch(
        "Function is impaired — it's not just desire, it's physical response",
        { sexual: 5, vitality: 2 },
        { subtext: "Physiological sexual dysfunction", contraFlag: "sexual_dysfunction" },
      ),
      ch(
        "Mood swings, hot flashes, or hormonal symptoms are disrupting my life",
        { sexual: 3, immune: 2, metabolic: 1 },
        { subtext: "Endocrine disruption" },
      ),
      ch(
        "I'm on hormone replacement therapy and want to optimize further",
        { sexual: 3, vitality: 2, longevity: 2 },
        { subtext: "HRT optimization context", contraFlag: "on_hrt" },
      ),
    ],
  },
  {
    stem: "How do you think about aging?",
    subtext:
      "Not vanity. The biological reality of cellular senescence, telomere shortening, and oxidative damage.",
    citation: "Khavinson et al., Bull Exp Biol Med, 2003 — Epitalon telomerase activation",
    choices: [
      ch("I feel my biological age matches my chronological age — aging normally", {
        longevity: 1,
        vitality: 1,
      }),
      ch(
        "I feel older than my age — my body is aging faster than my years",
        { longevity: 4, vitality: 3, recovery: 1 },
        { subtext: "Accelerated biological aging" },
      ),
      ch(
        "I'm proactively trying to slow aging — I want to optimize healthspan",
        { longevity: 3, vitality: 2, cognitive: 1 },
        { subtext: "Longevity optimization mindset" },
      ),
      ch(
        "Skin, hair, and visible aging markers are progressing rapidly",
        { longevity: 3, vitality: 2, sexual: 1 },
        { subtext: "Collagen/elastin decline" },
      ),
      ch(
        "I've had cancer, serious illness, or major health events that accelerated aging",
        { longevity: 5, immune: 3, recovery: 2 },
        { subtext: "Post-illness cellular damage", contraFlag: "cancer_history" },
      ),
    ],
  },
  {
    stem: "What does your daily stress load look like?",
    subtext:
      "Chronic stress is a peptide disruptor — it suppresses GH, inflames the gut, crashes immunity, and accelerates aging simultaneously.",
    citation: "McEwen, NEJM, 1998 — Allostatic load and stress-mediated physiological damage",
    choices: [
      ch("Manageable — I have stress but I recover from it well", {
        cognitive: 1,
        immune: 1,
        vitality: 1,
      }),
      ch(
        "High but functional — I perform under pressure but I'm burning reserves",
        { cognitive: 2, immune: 2, vitality: 2, metabolic: 1 },
        { subtext: "Allostatic overload building" },
      ),
      ch(
        "Chronic and unrelenting — I haven't felt truly relaxed in months or years",
        { cognitive: 3, immune: 3, vitality: 2, longevity: 2 },
        { subtext: "HPA axis dysregulation" },
      ),
      ch(
        "My stress manifests physically — headaches, GI issues, muscle tension, insomnia",
        { recovery: 3, immune: 2, cognitive: 2, metabolic: 1 },
        { subtext: "Somatized stress" },
      ),
      ch(
        "I've experienced burnout, trauma, or PTSD that changed my baseline",
        { cognitive: 4, immune: 3, longevity: 2, sexual: 1 },
        { subtext: "Neurological stress injury", contraFlag: "trauma_history" },
      ),
    ],
  },
  {
    stem: "Medical history check — select everything that applies.",
    subtext:
      "This is a safety screening question. Certain peptides are contraindicated with specific conditions. Select the most relevant.",
    citation:
      "FDA Safety Communication, 2023 — Peptide therapy contraindications and monitoring requirements",
    choices: [
      ch("No significant medical history — generally healthy", { vitality: 1 }),
      ch(
        "I take prescription medications daily (blood pressure, thyroid, psychiatric, etc.)",
        { immune: 1, metabolic: 1 },
        { subtext: "Drug interaction screening required", contraFlag: "prescription_meds" },
      ),
      ch(
        "I have a history of cancer or am in remission",
        { longevity: 2, immune: 2 },
        { subtext: "Growth factor contraindication flag", contraFlag: "cancer_history" },
      ),
      ch(
        "I have kidney or liver disease",
        { metabolic: 1, immune: 1 },
        { subtext: "Peptide clearance concern", contraFlag: "organ_disease" },
      ),
      ch(
        "I'm pregnant, breastfeeding, or trying to conceive",
        { sexual: 1 },
        { subtext: "Absolute contraindication for most peptides", contraFlag: "pregnancy" },
      ),
    ],
  },
  {
    stem: "What matters most to you right now?",
    subtext:
      "This weights your results toward your primary goal. All axes still factor in — but your priority gets amplified.",
    choices: [
      ch(
        "Heal something specific — an injury, gut issue, or chronic pain",
        { recovery: 5 },
        { subtext: "Recovery-first protocol" },
      ),
      ch(
        "Lose weight and fix my metabolism",
        { metabolic: 5 },
        { subtext: "Metabolic-first protocol" },
      ),
      ch(
        "Feel younger — more energy, better sleep, stronger body",
        { vitality: 5 },
        { subtext: "Vitality-first protocol" },
      ),
      ch(
        "Protect my brain — sharper thinking, better memory, less anxiety",
        { cognitive: 5 },
        { subtext: "Cognitive-first protocol" },
      ),
      ch(
        "Slow aging and optimize long-term health",
        { longevity: 5 },
        { subtext: "Longevity-first protocol" },
      ),
    ],
  },
];

interface PeptideProfile {
  name: string;
  tagline: string;
  axes: [Axis, Axis];
  description: string;
  primaryPeptides: { name: string; mechanism: string; evidence: string }[];
  secondaryPeptides: { name: string; mechanism: string }[];
  suggestedLabWork: string[];
  redFlags: string[];
  stackingNotes: string;
  shareText: string;
}

const PROFILES: PeptideProfile[] = [
  {
    name: "The Rebuilder",
    tagline: "Repair what's broken. Restore what's lost.",
    axes: ["recovery", "vitality"],
    description:
      "Your body is signaling for repair — tissue damage, slow healing, and declining vitality converge in a pattern that responds powerfully to regenerative peptides. The Rebuilder profile indicates your system needs targeted repair compounds paired with growth factor support to restore baseline function.",
    primaryPeptides: [
      {
        name: "BPC-157",
        mechanism:
          "Gastric pentadecapeptide that accelerates tissue repair via VEGF upregulation, nitric oxide modulation, and growth factor signaling",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018; Curr Pharm Des, 2018",
      },
      {
        name: "TB-500 (Thymosin Beta-4)",
        mechanism:
          "Promotes cell migration, blood vessel formation, and reduces inflammation at injury sites",
        evidence: "Goldstein et al., Expert Opin Biol Ther, 2012",
      },
      {
        name: "Sermorelin",
        mechanism:
          "GHRH analog stimulating natural GH release for recovery support and tissue regeneration",
        evidence: "Walker, J Clin Endocrinol Metab, 2006",
      },
    ],
    secondaryPeptides: [
      { name: "CJC-1295", mechanism: "Extended GH release for sustained recovery support" },
      {
        name: "Ipamorelin",
        mechanism: "Selective GH secretagogue with minimal cortisol/prolactin impact",
      },
    ],
    suggestedLabWork: [
      "IGF-1 levels",
      "CRP (C-reactive protein)",
      "CBC with differential",
      "Comprehensive metabolic panel",
      "ESR (erythrocyte sedimentation rate)",
    ],
    redFlags: [
      "Active cancer diagnosis (growth factors contraindicated)",
      "Uncontrolled bleeding disorders",
      "Pregnancy or breastfeeding",
    ],
    stackingNotes:
      "BPC-157 + TB-500 is the gold standard recovery stack. Add Sermorelin for systemic GH support. Cycle: 4-8 weeks on, 2-4 weeks off. BPC-157 can be taken orally for gut-specific repair or injected subcutaneously for systemic effect.",
    shareText:
      "I'm The Rebuilder — my peptide profile prioritizes tissue repair and vitality restoration. Take the Peptide Clarity Index™ to find yours.",
  },
  {
    name: "The Metabolic Reset",
    tagline: "Rewire how your body processes energy.",
    axes: ["metabolic", "recovery"],
    description:
      "Your metabolism has shifted — weight resistance, energy crashes, and healing delays point to a system that needs metabolic recalibration alongside repair support. This profile responds to GLP-1 agonists combined with tissue-protective peptides.",
    primaryPeptides: [
      {
        name: "Semaglutide",
        mechanism:
          "GLP-1 receptor agonist that reduces appetite, improves insulin sensitivity, and promotes weight loss via central satiety signaling",
        evidence: "Wilding et al., NEJM, 2021 (STEP 1 trial); Rubino et al., JAMA, 2021",
      },
      {
        name: "BPC-157",
        mechanism:
          "Gut-protective peptide that supports metabolic healing and reduces GI inflammation",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018",
      },
    ],
    secondaryPeptides: [
      {
        name: "Tirzepatide",
        mechanism: "Dual GIP/GLP-1 agonist with superior weight loss and metabolic outcomes",
      },
      {
        name: "Tesamorelin",
        mechanism: "GHRH analog specifically shown to reduce visceral adipose tissue",
      },
    ],
    suggestedLabWork: [
      "Fasting insulin + glucose",
      "HbA1c",
      "Lipid panel",
      "Thyroid panel (TSH, free T3, free T4)",
      "Liver function tests",
    ],
    redFlags: [
      "Personal or family history of medullary thyroid carcinoma",
      "Multiple endocrine neoplasia type 2 (MEN2)",
      "Pancreatitis history",
      "Pregnancy",
    ],
    stackingNotes:
      "Semaglutide is typically dosed weekly with gradual titration (0.25mg → 0.5mg → 1.0mg → 2.4mg). BPC-157 oral can support GI tolerance. Never combine multiple GLP-1 agonists. Monitor for gallbladder issues.",
    shareText:
      "I'm The Metabolic Reset — my peptide profile targets metabolic recalibration and recovery. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Optimizer",
    tagline: "Peak performance starts at the molecular level.",
    axes: ["vitality", "cognitive"],
    description:
      "You're not broken — you're plateaued. Your vitality and cognitive systems are functional but declining, and you want to push them back to peak. The Optimizer profile combines growth hormone support with nootropic peptides for a performance-first protocol.",
    primaryPeptides: [
      {
        name: "CJC-1295 + Ipamorelin",
        mechanism:
          "Synergistic GH secretagogue stack that amplifies natural growth hormone pulsatility without suppressing the HPG axis",
        evidence: "Teichman et al., J Clin Endocrinol Metab, 2006",
      },
      {
        name: "Semax",
        mechanism:
          "Synthetic ACTH(4-10) analog with nootropic, neuroprotective, and neurorestorative properties via BDNF upregulation",
        evidence: "Uchida et al., Behav Brain Res, 2017; Ashmarin et al., Neurosci Res, 2005",
      },
    ],
    secondaryPeptides: [
      {
        name: "Selank",
        mechanism: "Anxiolytic nootropic peptide modulating GABA and serotonin systems",
      },
      {
        name: "Dihexa",
        mechanism: "Potent angiotensin IV analog with cognitive enhancement properties",
      },
    ],
    suggestedLabWork: [
      "IGF-1 levels",
      "DHEA-S",
      "Cortisol (AM)",
      "Vitamin D, B12",
      "Homocysteine",
      "Neurotransmitter panel (if available)",
    ],
    redFlags: ["Active pituitary tumors", "Uncontrolled diabetes", "History of acromegaly"],
    stackingNotes:
      "CJC-1295/Ipamorelin dosed at bedtime to amplify natural GH pulse. Semax administered intranasally in AM for cognitive support. Cycle GH peptides 5 days on / 2 off. Cognitive peptides can run continuously for 30-60 days.",
    shareText:
      "I'm The Optimizer — my peptide profile targets peak vitality and cognitive performance. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Guardian",
    tagline: "Fortify the body's first and last line of defense.",
    axes: ["immune", "recovery"],
    description:
      "Your immune system is either underperforming or misfiring, and tissue repair is compromised as a result. The Guardian profile combines immune-modulating peptides with regenerative compounds to rebuild defensive capacity while healing existing damage.",
    primaryPeptides: [
      {
        name: "Thymosin Alpha-1",
        mechanism:
          "Thymic peptide that modulates T-cell function, enhances NK cell activity, and restores immune balance in both immunosuppressed and autoimmune states",
        evidence: "Tuthill et al., Ann NY Acad Sci, 2010; Garaci, Ann NY Acad Sci, 2007",
      },
      {
        name: "BPC-157",
        mechanism: "Anti-inflammatory tissue repair with demonstrated immune-modulating properties",
        evidence: "Sikiric et al., Curr Pharm Des, 2018",
      },
      {
        name: "LL-37",
        mechanism:
          "Human cathelicidin antimicrobial peptide with broad-spectrum antimicrobial and immunomodulatory activity",
        evidence: "Vandamme et al., Cell Immunol, 2012",
      },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Supports tissue repair while reducing inflammatory burden" },
      { name: "KPV", mechanism: "Anti-inflammatory tripeptide derived from alpha-MSH" },
    ],
    suggestedLabWork: [
      "CBC with differential",
      "Immunoglobulin panel (IgG, IgA, IgM, IgE)",
      "ANA + inflammatory markers (CRP, ESR)",
      "Vitamin D",
      "Lymphocyte subset panel",
    ],
    redFlags: [
      "Organ transplant recipients on immunosuppressants (consult transplant team)",
      "Active severe infection (treat infection first)",
      "Pregnancy",
    ],
    stackingNotes:
      "Thymosin Alpha-1 is the cornerstone — typically 1.6mg subcutaneous 2-3x/week. BPC-157 supports gut-immune axis. LL-37 for active infection support. Do not use immune stimulants in organ transplant patients without specialist guidance.",
    shareText:
      "I'm The Guardian — my peptide profile fortifies immune defense and tissue repair. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Architect",
    tagline: "Redesign your body from the inside out.",
    axes: ["metabolic", "vitality"],
    description:
      "You want body recomposition — less fat, more muscle, better energy. The Architect profile combines metabolic peptides with growth hormone support for a comprehensive body transformation protocol.",
    primaryPeptides: [
      {
        name: "Tesamorelin",
        mechanism:
          "GHRH analog specifically proven to reduce visceral adipose tissue while preserving lean mass",
        evidence: "Falutz et al., NEJM, 2007",
      },
      {
        name: "CJC-1295 + Ipamorelin",
        mechanism:
          "GH secretagogue stack for muscle protein synthesis, fat oxidation, and recovery",
        evidence: "Teichman et al., J Clin Endocrinol Metab, 2006",
      },
    ],
    secondaryPeptides: [
      {
        name: "Semaglutide",
        mechanism: "GLP-1 agonist for appetite regulation and metabolic support",
      },
      {
        name: "AOD-9604",
        mechanism: "Modified GH fragment targeting fat metabolism without growth effects",
      },
    ],
    suggestedLabWork: [
      "IGF-1",
      "Fasting insulin + glucose",
      "HbA1c",
      "Lipid panel",
      "Body composition scan (DEXA)",
      "Testosterone (total + free)",
    ],
    redFlags: ["Active cancer", "Uncontrolled diabetes", "Pituitary disorders"],
    stackingNotes:
      "Tesamorelin or CJC-1295/Ipamorelin at bedtime. If adding Semaglutide, start low and titrate. Monitor IGF-1 levels quarterly. Combine with resistance training for maximum body recomposition effect.",
    shareText:
      "I'm The Architect — my peptide profile targets body recomposition and metabolic vitality. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Sentinel",
    tagline: "Defend the mind. Protect the system.",
    axes: ["immune", "cognitive"],
    description:
      "Your immune and cognitive systems are both under strain — neuroinflammation, brain fog, and immune dysregulation often travel together. The Sentinel profile targets the neuro-immune axis with peptides that protect both systems simultaneously.",
    primaryPeptides: [
      {
        name: "Selank",
        mechanism:
          "Tuftsin analog with combined anxiolytic, nootropic, and immunomodulatory properties — one of few peptides that bridges the neuro-immune axis",
        evidence: "Uchida et al., Behav Brain Res, 2017; Zozulya et al., Regul Pept, 2001",
      },
      {
        name: "Thymosin Alpha-1",
        mechanism: "Immune modulator that reduces neuroinflammation-driving immune dysfunction",
        evidence: "Tuthill et al., Ann NY Acad Sci, 2010",
      },
    ],
    secondaryPeptides: [
      { name: "Semax", mechanism: "BDNF-upregulating nootropic for cognitive restoration" },
      { name: "KPV", mechanism: "Anti-inflammatory peptide reducing systemic inflammation" },
    ],
    suggestedLabWork: [
      "Inflammatory markers (CRP, IL-6, TNF-alpha)",
      "CBC with differential",
      "Vitamin D, B12, folate",
      "Cortisol (AM)",
      "Neurotransmitter panel",
    ],
    redFlags: [
      "Active CNS infection",
      "Severe autoimmune encephalitis (specialist required)",
      "Pregnancy",
    ],
    stackingNotes:
      "Selank intranasal AM + Thymosin Alpha-1 subcutaneous 2-3x/week. This stack addresses the neuro-immune crosstalk that drives both brain fog and immune dysfunction. Add Semax if cognitive symptoms dominate.",
    shareText:
      "I'm The Sentinel — my peptide profile defends both mind and immune system. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Restorer",
    tagline: "Rebuild the physical foundation of vitality.",
    axes: ["recovery", "sexual"],
    description:
      "Physical repair and hormonal renewal are your dual priorities. Injury, chronic pain, or surgical recovery combined with declining sexual health suggest a system that needs both structural repair and hormonal rebalancing.",
    primaryPeptides: [
      {
        name: "BPC-157",
        mechanism:
          "Tissue repair peptide with demonstrated effects on erectile tissue and gut healing",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018",
      },
      {
        name: "PT-141 (Bremelanotide)",
        mechanism:
          "Melanocortin receptor agonist that acts centrally on sexual arousal pathways — works for both men and women",
        evidence: "Diamond et al., J Sex Med, 2016; Kingsberg et al., Obstet Gynecol, 2019",
      },
    ],
    secondaryPeptides: [
      {
        name: "Kisspeptin",
        mechanism: "GnRH stimulator for natural testosterone/estrogen support",
      },
      { name: "TB-500", mechanism: "Tissue repair support for physical recovery" },
    ],
    suggestedLabWork: [
      "Testosterone (total + free)",
      "Estradiol",
      "SHBG",
      "Prolactin",
      "PSA (men)",
      "CBC",
      "CRP",
    ],
    redFlags: [
      "Uncontrolled hypertension (PT-141 can raise BP)",
      "Active cardiovascular disease",
      "Pregnancy",
    ],
    stackingNotes:
      "BPC-157 daily for tissue repair. PT-141 is used on-demand (not daily) — typically 1-2 hours before desired effect. Do not combine PT-141 with PDE5 inhibitors without physician guidance.",
    shareText:
      "I'm The Restorer — my peptide profile targets physical repair and hormonal renewal. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Strategist",
    tagline: "Fuel the brain. Fix the engine.",
    axes: ["cognitive", "metabolic"],
    description:
      "Your brain and metabolism are linked — blood sugar crashes tank focus, metabolic dysfunction drives brain fog, and the cycle feeds itself. The Strategist profile breaks this loop with metabolic peptides that also support cognitive function.",
    primaryPeptides: [
      {
        name: "Semaglutide",
        mechanism:
          "GLP-1 agonist with emerging neuroprotective evidence — improves metabolic health while crossing the blood-brain barrier",
        evidence: "Wilding et al., NEJM, 2021; Femminella et al., Trials, 2019 (ELAD trial)",
      },
      {
        name: "Semax",
        mechanism:
          "Nootropic peptide enhancing BDNF, cognitive processing speed, and memory consolidation",
        evidence: "Ashmarin et al., Neurosci Res, 2005",
      },
    ],
    secondaryPeptides: [
      { name: "Selank", mechanism: "Anxiolytic nootropic for stress-related cognitive impairment" },
      { name: "Dihexa", mechanism: "Potent cognitive enhancer via HGF/c-Met pathway" },
    ],
    suggestedLabWork: [
      "Fasting insulin + glucose",
      "HbA1c",
      "Lipid panel",
      "Vitamin D, B12",
      "Homocysteine",
      "Cortisol (AM)",
    ],
    redFlags: ["Medullary thyroid carcinoma history", "MEN2 syndrome", "Active eating disorder"],
    stackingNotes:
      "Semaglutide weekly (titrate slowly) + Semax intranasal daily. The metabolic-cognitive synergy is well-documented — fixing insulin resistance often resolves 40-60% of brain fog symptoms independently.",
    shareText:
      "I'm The Strategist — my peptide profile optimizes both brain and metabolism. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Vanguard",
    tagline: "Cellular defense meets cellular longevity.",
    axes: ["longevity", "immune"],
    description:
      "You're playing the long game — immune resilience and cellular longevity are your priorities. The Vanguard profile combines telomere-protective peptides with immune modulators for a defense-in-depth approach to aging.",
    primaryPeptides: [
      {
        name: "Epitalon",
        mechanism:
          "Tetrapeptide that activates telomerase, potentially slowing telomere shortening and cellular senescence",
        evidence: "Khavinson et al., Bull Exp Biol Med, 2003; Neuroendocrinol Lett, 2003",
      },
      {
        name: "Thymosin Alpha-1",
        mechanism:
          "Restores thymic function that naturally declines with age, supporting immune surveillance against senescent cells",
        evidence: "Garaci, Ann NY Acad Sci, 2007",
      },
    ],
    secondaryPeptides: [
      { name: "FOXO4-DRI", mechanism: "Senolytic peptide that selectively clears senescent cells" },
      {
        name: "GHK-Cu",
        mechanism: "Copper peptide with tissue remodeling and gene expression modulation",
      },
    ],
    suggestedLabWork: [
      "Telomere length test",
      "Inflammatory markers (CRP, IL-6)",
      "Immunoglobulin panel",
      "Vitamin D",
      "Oxidative stress markers (8-OHdG)",
      "CBC with differential",
    ],
    redFlags: [
      "Active cancer (telomerase activation contraindicated)",
      "Organ transplant",
      "Pregnancy",
    ],
    stackingNotes:
      "Epitalon typically cycled 10-20 days, 2-3x per year. Thymosin Alpha-1 can run continuously. FOXO4-DRI is experimental — physician supervision mandatory. This is a longevity-focused stack, not acute treatment.",
    shareText:
      "I'm The Vanguard — my peptide profile targets cellular defense and longevity. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Renaissance",
    tagline: "Vitality and desire, restored together.",
    axes: ["vitality", "sexual"],
    description:
      "Energy and sexual health are declining in parallel — a common pattern as growth hormone and sex hormone production both decrease with age. The Renaissance profile addresses both systems simultaneously.",
    primaryPeptides: [
      {
        name: "CJC-1295 + Ipamorelin",
        mechanism:
          "GH secretagogue stack that improves energy, sleep, body composition, and indirectly supports hormonal balance",
        evidence: "Teichman et al., J Clin Endocrinol Metab, 2006",
      },
      {
        name: "PT-141",
        mechanism:
          "Central-acting sexual function peptide that works independently of hormonal status",
        evidence: "Diamond et al., J Sex Med, 2016",
      },
    ],
    secondaryPeptides: [
      {
        name: "Kisspeptin",
        mechanism: "Natural GnRH stimulator for endogenous hormone production",
      },
      { name: "Sermorelin", mechanism: "Alternative GHRH analog for GH support" },
    ],
    suggestedLabWork: [
      "IGF-1",
      "Testosterone (total + free)",
      "Estradiol",
      "DHEA-S",
      "Thyroid panel",
      "Prolactin",
      "SHBG",
    ],
    redFlags: ["Hormone-sensitive cancers", "Uncontrolled hypertension", "Pituitary tumors"],
    stackingNotes:
      "CJC-1295/Ipamorelin at bedtime for GH support. PT-141 on-demand for sexual function. Kisspeptin can be added for natural hormone stimulation. Monitor hormone levels quarterly.",
    shareText:
      "I'm The Renaissance — my peptide profile restores vitality and sexual health together. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Catalyst",
    tagline: "Metabolic clarity drives mental clarity.",
    axes: ["metabolic", "cognitive"],
    description:
      "Same as The Strategist but with metabolic axis dominant. Your metabolic dysfunction is the primary driver of cognitive symptoms. Fix the metabolism first, and cognitive function often follows.",
    primaryPeptides: [
      {
        name: "Tirzepatide",
        mechanism:
          "Dual GIP/GLP-1 agonist with superior metabolic outcomes and emerging cognitive benefits",
        evidence: "Jastreboff et al., NEJM, 2022 (SURMOUNT-1)",
      },
      {
        name: "Selank",
        mechanism: "Anxiolytic nootropic supporting cognitive function during metabolic transition",
        evidence: "Zozulya et al., Regul Pept, 2001",
      },
    ],
    secondaryPeptides: [
      { name: "Semax", mechanism: "BDNF-enhancing nootropic for cognitive support" },
      { name: "AOD-9604", mechanism: "GH fragment for targeted fat metabolism" },
    ],
    suggestedLabWork: [
      "Fasting insulin + glucose",
      "HbA1c",
      "Lipid panel",
      "Liver function",
      "Vitamin D, B12",
      "Body composition (DEXA)",
    ],
    redFlags: [
      "Medullary thyroid carcinoma",
      "MEN2",
      "Pancreatitis history",
      "Active eating disorder",
    ],
    stackingNotes:
      "Tirzepatide weekly with slow titration. Selank intranasal daily for cognitive support during metabolic transition. Many patients report cognitive improvement within 4-6 weeks of metabolic stabilization.",
    shareText:
      "I'm The Catalyst — metabolic clarity drives my mental clarity. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Centurion",
    tagline: "Age is a number. Biology is a choice.",
    axes: ["longevity", "vitality"],
    description:
      "You're optimizing for healthspan — not just lifespan. The Centurion profile combines longevity peptides with growth factor support for a comprehensive anti-aging protocol grounded in cellular biology.",
    primaryPeptides: [
      {
        name: "Epitalon",
        mechanism: "Telomerase activator for cellular longevity",
        evidence: "Khavinson et al., Bull Exp Biol Med, 2003",
      },
      {
        name: "CJC-1295 + Ipamorelin",
        mechanism:
          "GH support for the age-related decline in growth hormone that drives sarcopenia, fat gain, and reduced recovery",
        evidence: "Teichman et al., J Clin Endocrinol Metab, 2006",
      },
    ],
    secondaryPeptides: [
      { name: "GHK-Cu", mechanism: "Copper peptide for skin remodeling and gene expression" },
      { name: "NAD+ precursors", mechanism: "Cellular energy and DNA repair support" },
    ],
    suggestedLabWork: [
      "IGF-1",
      "Telomere length",
      "Oxidative stress markers",
      "Inflammatory markers",
      "DEXA scan",
      "Vitamin D",
      "Comprehensive metabolic panel",
    ],
    redFlags: ["Active cancer", "Pituitary tumors", "Uncontrolled diabetes"],
    stackingNotes:
      "Epitalon cycled 2-3x/year. CJC-1295/Ipamorelin at bedtime ongoing with periodic breaks. GHK-Cu topical or subcutaneous. This is a marathon protocol — expect gradual improvements over 6-12 months.",
    shareText:
      "I'm The Centurion — my peptide profile targets healthspan optimization and anti-aging. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Healer",
    tagline: "Deep repair meets deep defense.",
    axes: ["recovery", "immune"],
    description:
      "Your body is fighting on two fronts — tissue damage and immune dysfunction. These often feed each other: chronic inflammation prevents healing, and unhealed tissue triggers immune responses. The Healer profile breaks this cycle.",
    primaryPeptides: [
      {
        name: "BPC-157",
        mechanism:
          "Tissue repair with anti-inflammatory properties that calm immune overreaction at injury sites",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018",
      },
      {
        name: "Thymosin Alpha-1",
        mechanism: "Immune modulator that restores balanced immune function",
        evidence: "Tuthill et al., Ann NY Acad Sci, 2010",
      },
      {
        name: "KPV",
        mechanism:
          "Alpha-MSH-derived anti-inflammatory tripeptide with gut-specific immune modulation",
        evidence: "Brzoska et al., Ann NY Acad Sci, 2008",
      },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Tissue repair and anti-inflammatory support" },
      { name: "LL-37", mechanism: "Antimicrobial peptide for infection-related immune burden" },
    ],
    suggestedLabWork: [
      "CBC with differential",
      "CRP, ESR",
      "ANA panel",
      "Immunoglobulin levels",
      "Comprehensive stool analysis",
      "Food sensitivity panel",
    ],
    redFlags: ["Active severe infection (treat first)", "Organ transplant", "Pregnancy"],
    stackingNotes:
      "BPC-157 + Thymosin Alpha-1 is the repair-immune foundation. Add KPV for gut-specific immune issues. This stack is particularly effective for autoimmune-driven tissue damage (IBD, rheumatoid conditions).",
    shareText:
      "I'm The Healer — my peptide profile targets deep repair and immune restoration. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Alchemist",
    tagline: "Protect the mind across decades, not days.",
    axes: ["longevity", "cognitive"],
    description:
      "Your priority is neuroprotection — preserving cognitive function as you age. Family history of dementia, early cognitive decline, or proactive brain health optimization all point to The Alchemist profile.",
    primaryPeptides: [
      {
        name: "Dihexa",
        mechanism:
          "Angiotensin IV analog that is 10 million times more potent than BDNF at promoting synaptogenesis via HGF/c-Met pathway",
        evidence: "McCoy et al., J Pharmacol Exp Ther, 2013",
      },
      {
        name: "Epitalon",
        mechanism: "Telomerase activation for neuronal longevity and cellular protection",
        evidence: "Khavinson et al., Neuroendocrinol Lett, 2003",
      },
    ],
    secondaryPeptides: [
      {
        name: "Semax",
        mechanism: "BDNF upregulation for neuroprotection and cognitive enhancement",
      },
      { name: "Selank", mechanism: "Anxiolytic with neuroprotective properties" },
    ],
    suggestedLabWork: [
      "Homocysteine",
      "Vitamin D, B12, folate",
      "Inflammatory markers",
      "ApoE genotype (if not already known)",
      "Telomere length",
      "Oxidative stress markers",
    ],
    redFlags: ["Active brain tumor", "Uncontrolled seizure disorder", "Pregnancy"],
    stackingNotes:
      "Dihexa is experimental and requires physician supervision. Epitalon cycled. Semax intranasal daily for ongoing neuroprotection. This is a prevention-focused protocol — start early for maximum benefit.",
    shareText:
      "I'm The Alchemist — my peptide profile targets long-term brain protection and cognitive longevity. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Phoenix",
    tagline: "Rise from cellular damage. Regenerate from within.",
    axes: ["recovery", "longevity"],
    description:
      "You've been through something — surgery, illness, trauma, or accumulated damage — and your body needs both acute repair and long-term cellular restoration. The Phoenix profile combines regenerative peptides with longevity compounds.",
    primaryPeptides: [
      {
        name: "BPC-157",
        mechanism: "Comprehensive tissue repair across multiple organ systems",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018",
      },
      {
        name: "Epitalon",
        mechanism: "Cellular longevity support via telomerase activation",
        evidence: "Khavinson et al., Bull Exp Biol Med, 2003",
      },
      {
        name: "GHK-Cu",
        mechanism:
          "Copper peptide that remodels tissue, reduces scarring, and modulates gene expression toward a younger phenotype",
        evidence: "Pickart et al., Oxid Med Cell Longev, 2012",
      },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Tissue migration and repair support" },
      { name: "NAD+ precursors", mechanism: "Cellular energy restoration" },
    ],
    suggestedLabWork: [
      "Comprehensive metabolic panel",
      "CBC",
      "CRP, ESR",
      "IGF-1",
      "Telomere length",
      "Oxidative stress markers",
      "Vitamin D",
    ],
    redFlags: ["Active cancer (growth factors + telomerase contraindicated)", "Pregnancy"],
    stackingNotes:
      "BPC-157 for acute repair (4-8 weeks), then transition to Epitalon + GHK-Cu for long-term cellular restoration. This is a phased protocol: repair first, then longevity optimization.",
    shareText:
      "I'm The Phoenix — my peptide profile targets regeneration and cellular renewal. Take the Peptide Clarity Index™.",
  },
  {
    name: "The Sovereign",
    tagline: "Balanced optimization across every system.",
    axes: ["vitality", "longevity"],
    description:
      "Your scores are relatively balanced across all axes — no single system is in crisis, but multiple systems show mild-to-moderate decline. The Sovereign profile takes a comprehensive, balanced approach to whole-system optimization.",
    primaryPeptides: [
      {
        name: "CJC-1295 + Ipamorelin",
        mechanism:
          "Foundation GH support that benefits virtually every system — sleep, recovery, body composition, immune function, and cognitive health",
        evidence: "Teichman et al., J Clin Endocrinol Metab, 2006",
      },
      {
        name: "BPC-157",
        mechanism: "Systemic tissue protection and gut health support",
        evidence: "Sikiric et al., J Physiol Pharmacol, 2018",
      },
    ],
    secondaryPeptides: [
      { name: "Thymosin Alpha-1", mechanism: "Immune modulation for balanced defense" },
      { name: "Epitalon", mechanism: "Longevity support via telomerase activation" },
    ],
    suggestedLabWork: [
      "Comprehensive metabolic panel",
      "CBC with differential",
      "IGF-1",
      "Thyroid panel",
      "Vitamin D, B12",
      "Testosterone/Estradiol",
      "CRP",
    ],
    redFlags: ["Active cancer", "Pregnancy", "Uncontrolled chronic conditions"],
    stackingNotes:
      "Start with CJC-1295/Ipamorelin + BPC-157 as the foundation. After 8-12 weeks, assess which systems responded least and add targeted peptides. The Sovereign approach is iterative — optimize the foundation, then specialize.",
    shareText:
      "I'm The Sovereign — my peptide profile targets balanced whole-system optimization. Take the Peptide Clarity Index™.",
  },
];

function calculateScores(answers: Record<number, number>): Record<Axis, number> {
  const raw = {} as Record<Axis, number>;
  Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
    const choice = QUESTIONS[Number(qIdx)]?.choices[choiceIdx];
    if (!choice) return;
    for (const axis in choice.weights) {
      const a = axis as Axis;
      raw[a] = (raw[a] || 0) + (choice.weights[a] ?? 0);
    }
  });
  const maxPossible = 15;
  const normalized = {} as Record<Axis, number>;
  AXIS_KEYS.forEach((axis) => {
    normalized[axis] = Math.min(100, Math.round(((raw[axis] || 0) / maxPossible) * 100));
  });
  return normalized;
}

function getContraFlags(answers: Record<number, number>): string[] {
  const flags: string[] = [];
  Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
    const flag = QUESTIONS[Number(qIdx)]?.choices[choiceIdx]?.contraFlag;
    if (flag) flags.push(flag);
  });
  return flags;
}

function getProfile(scores: Record<Axis, number>): PeptideProfile {
  const sorted = (Object.entries(scores) as [Axis, number][]).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0]?.[0] ?? "vitality";
  const top2 = sorted[1]?.[0] ?? "longevity";
  const match = PROFILES.find(
    (p) => (p.axes[0] === top1 && p.axes[1] === top2) || (p.axes[0] === top2 && p.axes[1] === top1),
  );
  if (!match)
    return (
      PROFILES.find((p) => p.axes[0] === top1 || p.axes[1] === top1) ||
      PROFILES[PROFILES.length - 1]
    );
  return match;
}

function getPeptideReadinessScore(scores: Record<Axis, number>, contraFlags: string[]): number {
  const values = Object.values(scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const penalty = contraFlags.length * 8;
  return Math.max(0, Math.min(100, Math.round(avg - penalty)));
}

export function FindYourPeptideQuiz() {
  const [phase, setPhase] = useState<"landing" | "assessment" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const { markComplete } = useJourneyProgress();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [shareCount, setShareCount] = useState(0);

  const totalQuestions = QUESTIONS.length;
  const progress = Object.keys(answers).length / totalQuestions;

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const contraFlags = useMemo(() => getContraFlags(answers), [answers]);
  const profile = useMemo(() => getProfile(scores), [scores]);
  const prs = useMemo(() => getPeptideReadinessScore(scores, contraFlags), [scores, contraFlags]);

  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const next = { ...answers, [currentQ]: choiceIdx };
      setAnswers(next);
      if (currentQ < totalQuestions - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setPhase("results");
        markComplete("find-your-peptide");
      }
    },
    [currentQ, totalQuestions, answers, markComplete],
  );

  const handleShare = useCallback(
    (platform: string) => {
      const url = window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com");
      const text = profile.shareText;
      if (platform === "twitter")
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
      if (platform === "linkedin")
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
      if (platform === "email")
        window.open(
          `mailto:?subject=${encodeURIComponent("My Peptide Clarity Index™ Results")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
          "_blank",
        );
      if (platform === "copy") navigator.clipboard?.writeText(url);
      setShareCount((prev) => prev + 1);
    },
    [profile],
  );

  const handleRestart = () => {
    setPhase("landing");
    setCurrentQ(0);
    setAnswers({});
    setShareCount(0);
    setEmailGated(false);
    setGateEmail("");
  };

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="peptide" />
        <JourneyTracker variant="light" currentAssessmentId="find-your-peptide" />
        <AssessmentIntro
          title="Find Your Peptide"
          subtitle="Your biology is speaking in molecules. Time to learn the language."
          description="Peptides are the body's signaling molecules — tiny chains of amino acids that regulate everything from sleep to inflammation to cognitive function. This assessment maps your biological needs across 7 clinical axes to find the peptide protocols that match your specific optimization goals."
          stats={{ questions: totalQuestions, dimensions: AXIS_KEYS.length, minutes: 4 }}
          whatYouGet={[
            "Your peptide profile and primary biological needs",
            "A dimensional map of your optimization priorities",
            "Understanding of which peptide protocols match your goals",
            "Evidence-based resources for informed decisions",
          ]}
          accentColor={ACCENT}
          heroImage="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/peptide-hero-find-Pd2B4xq5sV9Fwq6fkoA8sC.webp"
          onBegin={() => setPhase("assessment")}
        />
      </div>
    );
  }

  if (phase === "assessment") {
    const q = QUESTIONS[currentQ];
    return (
      <div className="relative z-1 min-h-screen px-6 py-8 font-sans text-[#2C1810]">
        <ThemedBackground theme="peptide" />
        <div className="mx-auto mb-8 max-w-150">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold/60">
              QUESTION {currentQ + 1} OF {totalQuestions}
            </span>
            <span className="font-mono text-[0.65rem] text-[#8B7B6B]">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="h-[3px] rounded-sm bg-black/6">
            <div
              className="h-full rounded-sm bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-150">
          <h2 className="mb-2 font-heading text-[clamp(1.4rem,3.5vw,1.8rem)] leading-[1.3]">
            {q.stem}
          </h2>
          <p className="mb-2 text-[0.95rem] leading-relaxed text-[#8B7B6B]">{q.subtext}</p>
          {q.citation && (
            <p className="mb-6 font-mono text-[0.6rem] text-brand-gold/40">
              <Paperclip aria-hidden="true" className="mr-1 inline size-3" />
              {q.citation}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {q.choices.map((choice, idx) => (
              <button
                key={choice.text}
                onClick={() => handleAnswer(idx)}
                className={`rounded-md border px-5 py-4 text-left transition-all ${
                  answers[currentQ] === idx
                    ? "border-brand-gold-light/40 bg-brand-gold-light/12"
                    : "border-black/6 bg-white/40"
                }`}
              >
                <div className="text-[0.95rem] leading-relaxed">{choice.text}</div>
                {choice.subtext && (
                  <div className="mt-1 font-mono text-[0.7rem] text-[#8B7B6B]">
                    {choice.subtext}
                  </div>
                )}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ((prev) => prev - 1)}
              className="mt-6 rounded-sm border border-black/10 px-4 py-2 font-mono text-[0.7rem] text-[#8B7B6B]"
            >
              <ArrowLeft aria-hidden="true" className="mr-1 inline size-3.5" />
              Previous
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "results" && !emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center px-6 py-16 font-sans text-[#2C1810]">
        <ThemedBackground theme="peptide" />
        <div className="max-w-110 text-center">
          <Dna aria-hidden="true" className="mx-auto mb-4 size-10 text-brand-gold" />
          <h2 className="mb-2 font-heading text-3xl text-brand-gold">
            Your Peptide Clarity Index™ is ready.
          </h2>
          <p className="mb-2 text-base leading-relaxed text-[#8B7B6B]">
            Enter your email to unlock your personalized 7-axis profile, peptide recommendations
            with evidence citations, suggested lab work, and contraindication screening results.
          </p>
          <p className="mb-6 font-mono text-[0.7rem] text-[#8B7B6B]">
            Peptide Readiness Score: <span className="text-brand-gold">{prs}/100</span>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (gateEmail.includes("@")) setEmailGated(true);
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-sm border border-brand-gold-light/30 bg-white/50 px-4 py-2.5 font-mono text-[0.85rem] outline-none"
            />
            <button
              type="submit"
              className="rounded-sm bg-brand-gold-light px-6 py-2.5 font-mono text-[0.78rem] font-bold text-[#0A0A10] uppercase"
            >
              Unlock
            </button>
          </form>
          <p className="mt-3 font-mono text-[0.65rem] text-[#8B7B6B]">
            No spam. Unsubscribe anytime. Your data stays private.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen px-6 py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="peptide" />
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold/60 uppercase">
            Your Peptide Clarity Index™ Result
          </div>
          <h1 className="mb-2 font-heading text-[clamp(2rem,5vw,3rem)] text-brand-gold">
            {profile.name}
          </h1>
          <p className="text-lg text-[#8B7B6B] italic">{profile.tagline}</p>
        </div>

        <div className="mb-10 rounded-lg border border-brand-gold/15 bg-white/40 p-6 text-center">
          <div className="mb-2 font-mono text-[0.65rem] text-[#8B7B6B]">
            PEPTIDE READINESS SCORE
          </div>
          <div className="font-heading text-5xl font-bold text-brand-gold">{prs}</div>
          <div className="font-mono text-[0.7rem] text-[#8B7B6B]">
            {prs >= 70
              ? "High readiness — strong candidate for peptide therapy"
              : prs >= 40
                ? "Moderate readiness — targeted protocols recommended"
                : "Low readiness — physician consultation strongly recommended before starting"}
          </div>
          {contraFlags.length > 0 && (
            <div className="mt-3 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[0.65rem] text-red-800">
              <TriangleAlert aria-hidden="true" className="mr-1 inline size-3.5" />
              {contraFlags.length} contraindication flag{contraFlags.length > 1 ? "s" : ""} detected
              — physician review required
            </div>
          )}
        </div>

        <div className="mb-10 text-center">
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60 uppercase">
            Your 7-Axis Clinical Profile
          </h3>
          <div className="flex justify-center">
            <AssessmentRadarChart
              scores={Object.fromEntries(AXIS_KEYS.map((k) => [AXES[k].label, scores[k] || 0]))}
              max={100}
              accentColor="#D4B96A"
            />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60 uppercase">
            Axis Scores
          </h3>
          {AXIS_KEYS.map((key) => {
            const Icon = AXIS_ICONS[key];
            return (
              <div key={key} className="mb-3">
                <div className="mb-1 flex justify-between">
                  <span className="inline-flex items-center gap-2 text-[0.85rem]">
                    <Icon aria-hidden="true" className="size-3.5 text-brand-gold" />
                    {AXES[key].label}
                  </span>
                  <span className="font-mono text-[0.75rem] text-brand-gold">
                    {scores[key] || 0}/100
                  </span>
                </div>
                <div className="h-1.5 rounded-sm bg-black/6">
                  <div
                    className="h-full rounded-sm bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-1000"
                    style={{ width: `${scores[key] || 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-10 rounded-lg border border-brand-gold/10 bg-white/40 p-6">
          <p className="text-base leading-relaxed">{profile.description}</p>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60 uppercase">
            Primary Peptide Recommendations
          </h3>
          {profile.primaryPeptides.map((p) => (
            <div
              key={p.name}
              className="mb-4 rounded-md border border-brand-gold/10 bg-white/40 p-4"
            >
              <div className="mb-1 font-heading text-lg text-brand-gold">{p.name}</div>
              <p className="mb-1 text-sm leading-relaxed">{p.mechanism}</p>
              <p className="font-mono text-[0.65rem] text-brand-gold/50">
                <Paperclip aria-hidden="true" className="mr-1 inline size-3" />
                {p.evidence}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60 uppercase">
            Secondary Considerations
          </h3>
          {profile.secondaryPeptides.map((p) => (
            <div key={p.name} className="mb-2 rounded-md border border-black/5 bg-white/20 p-3">
              <span className="text-sm">{p.name}</span>
              <span className="text-sm text-[#8B7B6B]"> — {p.mechanism}</span>
            </div>
          ))}
        </div>

        <div className="mb-10 rounded-lg border border-brand-gold/15 bg-brand-gold-light/8 p-5">
          <h3 className="mb-2 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold uppercase">
            Stacking Protocol Notes
          </h3>
          <p className="text-sm leading-relaxed">{profile.stackingNotes}</p>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60 uppercase">
            Suggested Lab Work Before Starting
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.suggestedLabWork.map((lab) => (
              <span
                key={lab}
                className="rounded-full border border-black/8 bg-white/40 px-3 py-1.5 font-mono text-[0.7rem] text-[#8B7B6B]"
              >
                {lab}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-10 rounded-lg border border-red-500/15 bg-red-500/5 p-5">
          <h3 className="mb-3 flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.15em] text-red-800/70 uppercase">
            <TriangleAlert aria-hidden="true" className="size-3.5" /> Contraindications &amp; Red
            Flags
          </h3>
          <ul className="space-y-1 text-[0.85rem] leading-relaxed text-red-900/70">
            {profile.redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </div>

        <div className="mb-10 text-center">
          <p className="mb-3 font-mono text-[0.7rem] text-[#8B7B6B]">Share your results</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["twitter", "linkedin", "email", "copy"].map((p) => (
              <button
                key={p}
                onClick={() => handleShare(p)}
                className="rounded-sm border border-black/10 bg-white/40 px-4 py-2 font-mono text-[0.7rem] text-[#8B7B6B] capitalize"
              >
                {p === "copy" ? "Copy Link" : p}
              </button>
            ))}
          </div>
          {shareCount > 0 && (
            <p className="mt-2 font-mono text-[0.6rem] text-brand-gold/50">Shared {shareCount}x</p>
          )}
        </div>

        <div className="mb-10 text-center">
          <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-peptide" />
          <button
            onClick={handleRestart}
            className="rounded-sm border border-brand-gold/30 px-6 py-2.5 font-mono text-[0.75rem] text-brand-gold"
          >
            Retake Assessment
          </button>
        </div>

        <div className="mb-10 rounded-lg border border-black/6 bg-white/20 p-5">
          <p className="text-center font-mono text-[0.65rem] leading-relaxed text-[#8B7B6B]">
            <strong className="text-[#5A4A3A]">Medical Disclaimer:</strong> This assessment is for
            educational purposes only and does not constitute medical advice. Peptide therapy should
            only be pursued under the supervision of a qualified healthcare provider. Always consult
            your physician before starting any new therapeutic protocol. Individual results vary.
            Citations reference published research but do not guarantee outcomes.
          </p>
        </div>

        <div className="mb-10 rounded-lg border border-brand-gold/15 bg-brand-gold-light/8 p-6 text-center">
          <p className="mb-3 text-base text-[#8B7B6B]">
            Want the full story? Read the deep-dive essay behind this assessment.
          </p>
          <Link
            href="/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine"
            className="border-b border-brand-gold/30 font-mono text-[0.8rem] text-brand-gold"
          >
            Read &quot;The Peptide Truth&quot; <ForwardIcon aria-hidden="true" />
          </Link>
        </div>

        <div className="mx-auto max-w-175">
          <BioChainCTA
            variant="buyer"
            context="Looking for verified peptide sourcing? Buyer intake at RampRate BioChain."
          />
        </div>
      </div>
      <WhatsNext />
    </div>
  );
}
