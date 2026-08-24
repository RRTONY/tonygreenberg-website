/**
 * FIND YOUR PEPTIDE — The Peptide Clarity Index™
 * 
 * A scientifically structured 10-question multi-axis assessment that maps users
 * to one of 16 peptide archetypes across 7 clinical dimensions. Uses stacked
 * response weighting, cross-axis synergy scoring, and contraindication flags.
 * 
 * 7 Axes: Recovery, Metabolic, GH/Vitality, Immune, Cognitive, Sexual, Longevity
 * 16 Archetypes: Combinatorial profiles from top 2 scoring axes
 * 
 * Design: Dark contemplative glass-morphism matching Find My ecosystem.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import { AssessmentResultActions } from "@/components/AssessmentResultActions";
import { BioChainCTA } from "@/components/BioChainCTA";

/* ── TYPES ── */

interface Choice {
  text: string;
  subtext?: string;
  weights: Record<string, number>; // axis → weighted score
  contraFlag?: string; // optional contraindication flag
}

interface Question {
  id: number;
  stem: string;
  subtext: string;
  citation?: string; // PubMed or journal reference
  choices: Choice[];
}

interface PeptideProfile {
  id: string;
  name: string;
  tagline: string;
  axes: [string, string]; // top 2 axes that define this profile
  description: string;
  primaryPeptides: { name: string; mechanism: string; evidence: string }[];
  secondaryPeptides: { name: string; mechanism: string }[];
  suggestedLabWork: string[];
  redFlags: string[];
  stackingNotes: string;
  shareText: string;
}

/* ── 7 CLINICAL AXES ── */

const AXES: Record<string, { label: string; icon: string; description: string; peptideClass: string }> = {
  recovery: { label: "Recovery & Repair", icon: "🔧", description: "Tissue healing, joint repair, gut restoration, surgical recovery", peptideClass: "BPC-157, TB-500" },
  metabolic: { label: "Metabolic Health", icon: "⚡", description: "Weight management, insulin sensitivity, appetite regulation, metabolic syndrome", peptideClass: "Semaglutide, Tirzepatide" },
  vitality: { label: "Growth & Vitality", icon: "🌱", description: "Sleep quality, energy, muscle mass, skin elasticity, anti-aging", peptideClass: "Sermorelin, CJC-1295, Ipamorelin" },
  immune: { label: "Immune Defense", icon: "🛡️", description: "Immune modulation, autoimmune support, inflammation control", peptideClass: "Thymosin Alpha-1, LL-37" },
  cognitive: { label: "Cognitive Performance", icon: "🧠", description: "Focus, memory, neuroprotection, stress resilience, brain fog", peptideClass: "Selank, Semax, Dihexa" },
  sexual: { label: "Hormonal & Sexual", icon: "🔥", description: "Libido, hormonal balance, reproductive health, sexual function", peptideClass: "PT-141, Kisspeptin" },
  longevity: { label: "Longevity & Cellular", icon: "🧬", description: "Telomere health, oxidative stress, cellular senescence, aging biomarkers", peptideClass: "Epitalon, FOXO4-DRI, NAD+ peptides" },
};

/* ── 10 QUESTIONS ── */

const QUESTIONS: Question[] = [
  {
    id: 1,
    stem: "How does your body handle physical damage?",
    subtext: "Think about the last time you were injured, had surgery, or pushed your body hard. How did recovery go?",
    citation: "Sikiric et al., J Physiol Pharmacol, 2018 — BPC-157 tissue repair mechanisms",
    choices: [
      { text: "I heal quickly — minor injuries resolve in days, not weeks", subtext: "Strong baseline recovery", weights: { recovery: 1, vitality: 1 } },
      { text: "Recovery takes longer than it used to — I notice a slow decline", subtext: "Age-related repair slowdown", weights: { recovery: 3, vitality: 2, longevity: 1 } },
      { text: "I have chronic pain or an injury that never fully healed", subtext: "Persistent tissue damage", weights: { recovery: 4, immune: 1 } },
      { text: "My gut is the problem — bloating, inflammation, or digestive issues dominate", subtext: "Gut-specific repair needs", weights: { recovery: 3, immune: 2, metabolic: 1 } },
      { text: "I'm recovering from surgery or a major physical event right now", subtext: "Acute recovery window", weights: { recovery: 5, vitality: 2 }, contraFlag: "active_recovery" },
    ],
  },
  {
    id: 2,
    stem: "What's your relationship with your metabolism?",
    subtext: "Not what the scale says. How your body processes energy, stores fat, and responds to food.",
    citation: "Wilding et al., NEJM, 2021 — Semaglutide STEP trial outcomes",
    choices: [
      { text: "My metabolism works fine — I maintain weight without much effort", weights: { metabolic: 1, vitality: 1 } },
      { text: "I've gained weight that won't respond to diet or exercise anymore", subtext: "Metabolic resistance", weights: { metabolic: 4, vitality: 1, longevity: 1 } },
      { text: "I crash after meals — energy spikes and drops control my day", subtext: "Insulin/glucose dysregulation", weights: { metabolic: 3, cognitive: 2, vitality: 1 } },
      { text: "I have a family history of diabetes, heart disease, or metabolic syndrome", subtext: "Genetic metabolic risk", weights: { metabolic: 4, longevity: 2, immune: 1 }, contraFlag: "metabolic_family_history" },
      { text: "I'm actively trying to recompose my body — lose fat, gain muscle", subtext: "Body recomposition goal", weights: { metabolic: 3, vitality: 3 } },
    ],
  },
  {
    id: 3,
    stem: "How do you sleep — and how do you feel when you wake up?",
    subtext: "Sleep architecture is the foundation of growth hormone release, cellular repair, and cognitive consolidation.",
    citation: "Van Cauter et al., JAMA, 2000 — GH secretion and sleep quality correlation",
    choices: [
      { text: "I sleep well and wake rested — 7-8 hours of solid, uninterrupted sleep", weights: { vitality: 1, cognitive: 1 } },
      { text: "I sleep enough hours but wake exhausted — the quality is gone", subtext: "Disrupted sleep architecture", weights: { vitality: 4, cognitive: 2, longevity: 1 } },
      { text: "I can't fall asleep — my mind races or my body won't settle", subtext: "Onset insomnia / HPA axis dysregulation", weights: { cognitive: 3, vitality: 2, immune: 1 } },
      { text: "I wake at 2-4 AM and can't get back to sleep", subtext: "Cortisol/GH imbalance pattern", weights: { vitality: 4, longevity: 2, metabolic: 1 } },
      { text: "I've noticed my recovery from workouts and illness has slowed with poor sleep", subtext: "Sleep-recovery cascade failure", weights: { vitality: 3, recovery: 3, immune: 2 } },
    ],
  },
  {
    id: 4,
    stem: "How often do you get sick — and how hard does it hit?",
    subtext: "Your immune system is a peptide-driven orchestra. This question maps its current performance.",
    citation: "Tuthill et al., Ann NY Acad Sci, 2010 — Thymosin alpha-1 immune modulation",
    choices: [
      { text: "Rarely sick — maybe once a year, and I bounce back fast", weights: { immune: 1, vitality: 1 } },
      { text: "I catch everything going around — colds, flu, infections hit me hard", subtext: "Immune suppression pattern", weights: { immune: 4, vitality: 2, longevity: 1 } },
      { text: "I have autoimmune issues — my immune system attacks my own body", subtext: "Immune dysregulation", weights: { immune: 5, recovery: 2, longevity: 1 }, contraFlag: "autoimmune" },
      { text: "Chronic low-grade inflammation — I'm not 'sick' but I'm never fully well", subtext: "Inflammaging pattern", weights: { immune: 3, longevity: 3, recovery: 1 } },
      { text: "I'm immunocompromised or on immunosuppressive medication", subtext: "Medical immune status", weights: { immune: 5, longevity: 2 }, contraFlag: "immunocompromised" },
    ],
  },
  {
    id: 5,
    stem: "What's happening with your brain?",
    subtext: "Not your intelligence. Your cognitive machinery — focus, recall, processing speed, mental stamina.",
    citation: "Uchida et al., Behav Brain Res, 2017 — Semax/Selank nootropic mechanisms",
    choices: [
      { text: "Sharp as ever — I can focus for hours and recall details easily", weights: { cognitive: 1, vitality: 1 } },
      { text: "Brain fog is real — I lose words, forget why I walked into rooms", subtext: "Cognitive decline pattern", weights: { cognitive: 4, longevity: 2, vitality: 1 } },
      { text: "I can focus but I'm mentally exhausted by 2 PM every day", subtext: "Cognitive fatigue / neurotransmitter depletion", weights: { cognitive: 3, metabolic: 2, vitality: 1 } },
      { text: "Anxiety and racing thoughts dominate — I can't quiet my mind", subtext: "HPA axis / GABAergic imbalance", weights: { cognitive: 4, immune: 1, sexual: 1 } },
      { text: "I have a family history of cognitive decline, Alzheimer's, or dementia", subtext: "Neuroprotection priority", weights: { cognitive: 4, longevity: 4 }, contraFlag: "neuro_family_history" },
    ],
  },
  {
    id: 6,
    stem: "How's your hormonal and sexual health?",
    subtext: "Libido, energy, mood, and sexual function are downstream signals of peptide and hormonal balance.",
    citation: "Diamond et al., J Sex Med, 2016 — PT-141 (bremelanotide) clinical efficacy",
    choices: [
      { text: "Everything works well — libido, energy, and function are all solid", weights: { sexual: 1, vitality: 1 } },
      { text: "My libido has dropped noticeably — I'm less interested than I used to be", subtext: "Hormonal decline pattern", weights: { sexual: 4, vitality: 2, longevity: 1 } },
      { text: "Function is impaired — it's not just desire, it's physical response", subtext: "Physiological sexual dysfunction", weights: { sexual: 5, vitality: 2 }, contraFlag: "sexual_dysfunction" },
      { text: "Mood swings, hot flashes, or hormonal symptoms are disrupting my life", subtext: "Endocrine disruption", weights: { sexual: 3, immune: 2, metabolic: 1 } },
      { text: "I'm on hormone replacement therapy and want to optimize further", subtext: "HRT optimization context", weights: { sexual: 3, vitality: 2, longevity: 2 }, contraFlag: "on_hrt" },
    ],
  },
  {
    id: 7,
    stem: "How do you think about aging?",
    subtext: "Not vanity. The biological reality of cellular senescence, telomere shortening, and oxidative damage.",
    citation: "Khavinson et al., Bull Exp Biol Med, 2003 — Epitalon telomerase activation",
    choices: [
      { text: "I feel my biological age matches my chronological age — aging normally", weights: { longevity: 1, vitality: 1 } },
      { text: "I feel older than my age — my body is aging faster than my years", subtext: "Accelerated biological aging", weights: { longevity: 4, vitality: 3, recovery: 1 } },
      { text: "I'm proactively trying to slow aging — I want to optimize healthspan", subtext: "Longevity optimization mindset", weights: { longevity: 3, vitality: 2, cognitive: 1 } },
      { text: "Skin, hair, and visible aging markers are progressing rapidly", subtext: "Collagen/elastin decline", weights: { longevity: 3, vitality: 2, sexual: 1 } },
      { text: "I've had cancer, serious illness, or major health events that accelerated aging", subtext: "Post-illness cellular damage", weights: { longevity: 5, immune: 3, recovery: 2 }, contraFlag: "cancer_history" },
    ],
  },
  {
    id: 8,
    stem: "What does your daily stress load look like?",
    subtext: "Chronic stress is a peptide disruptor — it suppresses GH, inflames the gut, crashes immunity, and accelerates aging simultaneously.",
    citation: "McEwen, NEJM, 1998 — Allostatic load and stress-mediated physiological damage",
    choices: [
      { text: "Manageable — I have stress but I recover from it well", weights: { cognitive: 1, immune: 1, vitality: 1 } },
      { text: "High but functional — I perform under pressure but I'm burning reserves", subtext: "Allostatic overload building", weights: { cognitive: 2, immune: 2, vitality: 2, metabolic: 1 } },
      { text: "Chronic and unrelenting — I haven't felt truly relaxed in months or years", subtext: "HPA axis dysregulation", weights: { cognitive: 3, immune: 3, vitality: 2, longevity: 2 } },
      { text: "My stress manifests physically — headaches, GI issues, muscle tension, insomnia", subtext: "Somatized stress", weights: { recovery: 3, immune: 2, cognitive: 2, metabolic: 1 } },
      { text: "I've experienced burnout, trauma, or PTSD that changed my baseline", subtext: "Neurological stress injury", weights: { cognitive: 4, immune: 3, longevity: 2, sexual: 1 }, contraFlag: "trauma_history" },
    ],
  },
  {
    id: 9,
    stem: "Medical history check — select everything that applies.",
    subtext: "This is a safety screening question. Certain peptides are contraindicated with specific conditions. Select the most relevant.",
    citation: "FDA Safety Communication, 2023 — Peptide therapy contraindications and monitoring requirements",
    choices: [
      { text: "No significant medical history — generally healthy", weights: { vitality: 1 } },
      { text: "I take prescription medications daily (blood pressure, thyroid, psychiatric, etc.)", subtext: "Drug interaction screening required", weights: { immune: 1, metabolic: 1 }, contraFlag: "prescription_meds" },
      { text: "I have a history of cancer or am in remission", subtext: "Growth factor contraindication flag", weights: { longevity: 2, immune: 2 }, contraFlag: "cancer_history" },
      { text: "I have kidney or liver disease", subtext: "Peptide clearance concern", weights: { metabolic: 1, immune: 1 }, contraFlag: "organ_disease" },
      { text: "I'm pregnant, breastfeeding, or trying to conceive", subtext: "Absolute contraindication for most peptides", weights: { sexual: 1 }, contraFlag: "pregnancy" },
    ],
  },
  {
    id: 10,
    stem: "What matters most to you right now?",
    subtext: "This weights your results toward your primary goal. All axes still factor in — but your priority gets amplified.",
    choices: [
      { text: "Heal something specific — an injury, gut issue, or chronic pain", subtext: "Recovery-first protocol", weights: { recovery: 5 } },
      { text: "Lose weight and fix my metabolism", subtext: "Metabolic-first protocol", weights: { metabolic: 5 } },
      { text: "Feel younger — more energy, better sleep, stronger body", subtext: "Vitality-first protocol", weights: { vitality: 5 } },
      { text: "Protect my brain — sharper thinking, better memory, less anxiety", subtext: "Cognitive-first protocol", weights: { cognitive: 5 } },
      { text: "Slow aging and optimize long-term health", subtext: "Longevity-first protocol", weights: { longevity: 5 } },
    ],
  },
];

/* ── 16 ARCHETYPES ── */

const PROFILES: PeptideProfile[] = [
  {
    id: "rebuilder", name: "The Rebuilder", tagline: "Repair what's broken. Restore what's lost.",
    axes: ["recovery", "vitality"],
    description: "Your body is signaling for repair — tissue damage, slow healing, and declining vitality converge in a pattern that responds powerfully to regenerative peptides. The Rebuilder profile indicates your system needs targeted repair compounds paired with growth factor support to restore baseline function.",
    primaryPeptides: [
      { name: "BPC-157", mechanism: "Gastric pentadecapeptide that accelerates tissue repair via VEGF upregulation, nitric oxide modulation, and growth factor signaling", evidence: "Sikiric et al., J Physiol Pharmacol, 2018; Curr Pharm Des, 2018" },
      { name: "TB-500 (Thymosin Beta-4)", mechanism: "Promotes cell migration, blood vessel formation, and reduces inflammation at injury sites", evidence: "Goldstein et al., Expert Opin Biol Ther, 2012" },
      { name: "Sermorelin", mechanism: "GHRH analog stimulating natural GH release for recovery support and tissue regeneration", evidence: "Walker, J Clin Endocrinol Metab, 2006" },
    ],
    secondaryPeptides: [
      { name: "CJC-1295", mechanism: "Extended GH release for sustained recovery support" },
      { name: "Ipamorelin", mechanism: "Selective GH secretagogue with minimal cortisol/prolactin impact" },
    ],
    suggestedLabWork: ["IGF-1 levels", "CRP (C-reactive protein)", "CBC with differential", "Comprehensive metabolic panel", "ESR (erythrocyte sedimentation rate)"],
    redFlags: ["Active cancer diagnosis (growth factors contraindicated)", "Uncontrolled bleeding disorders", "Pregnancy or breastfeeding"],
    stackingNotes: "BPC-157 + TB-500 is the gold standard recovery stack. Add Sermorelin for systemic GH support. Cycle: 4-8 weeks on, 2-4 weeks off. BPC-157 can be taken orally for gut-specific repair or injected subcutaneously for systemic effect.",
    shareText: "I'm The Rebuilder — my peptide profile prioritizes tissue repair and vitality restoration. Take the Peptide Clarity Index™ to find yours.",
  },
  {
    id: "metabolic-reset", name: "The Metabolic Reset", tagline: "Rewire how your body processes energy.",
    axes: ["metabolic", "recovery"],
    description: "Your metabolism has shifted — weight resistance, energy crashes, and healing delays point to a system that needs metabolic recalibration alongside repair support. This profile responds to GLP-1 agonists combined with tissue-protective peptides.",
    primaryPeptides: [
      { name: "Semaglutide", mechanism: "GLP-1 receptor agonist that reduces appetite, improves insulin sensitivity, and promotes weight loss via central satiety signaling", evidence: "Wilding et al., NEJM, 2021 (STEP 1 trial); Rubino et al., JAMA, 2021" },
      { name: "BPC-157", mechanism: "Gut-protective peptide that supports metabolic healing and reduces GI inflammation", evidence: "Sikiric et al., J Physiol Pharmacol, 2018" },
    ],
    secondaryPeptides: [
      { name: "Tirzepatide", mechanism: "Dual GIP/GLP-1 agonist with superior weight loss and metabolic outcomes" },
      { name: "Tesamorelin", mechanism: "GHRH analog specifically shown to reduce visceral adipose tissue" },
    ],
    suggestedLabWork: ["Fasting insulin + glucose", "HbA1c", "Lipid panel", "Thyroid panel (TSH, free T3, free T4)", "Liver function tests"],
    redFlags: ["Personal or family history of medullary thyroid carcinoma", "Multiple endocrine neoplasia type 2 (MEN2)", "Pancreatitis history", "Pregnancy"],
    stackingNotes: "Semaglutide is typically dosed weekly with gradual titration (0.25mg → 0.5mg → 1.0mg → 2.4mg). BPC-157 oral can support GI tolerance. Never combine multiple GLP-1 agonists. Monitor for gallbladder issues.",
    shareText: "I'm The Metabolic Reset — my peptide profile targets metabolic recalibration and recovery. Take the Peptide Clarity Index™.",
  },
  {
    id: "optimizer", name: "The Optimizer", tagline: "Peak performance starts at the molecular level.",
    axes: ["vitality", "cognitive"],
    description: "You're not broken — you're plateaued. Your vitality and cognitive systems are functional but declining, and you want to push them back to peak. The Optimizer profile combines growth hormone support with nootropic peptides for a performance-first protocol.",
    primaryPeptides: [
      { name: "CJC-1295 + Ipamorelin", mechanism: "Synergistic GH secretagogue stack that amplifies natural growth hormone pulsatility without suppressing the HPG axis", evidence: "Teichman et al., J Clin Endocrinol Metab, 2006" },
      { name: "Semax", mechanism: "Synthetic ACTH(4-10) analog with nootropic, neuroprotective, and neurorestorative properties via BDNF upregulation", evidence: "Uchida et al., Behav Brain Res, 2017; Ashmarin et al., Neurosci Res, 2005" },
    ],
    secondaryPeptides: [
      { name: "Selank", mechanism: "Anxiolytic nootropic peptide modulating GABA and serotonin systems" },
      { name: "Dihexa", mechanism: "Potent angiotensin IV analog with cognitive enhancement properties" },
    ],
    suggestedLabWork: ["IGF-1 levels", "DHEA-S", "Cortisol (AM)", "Vitamin D, B12", "Homocysteine", "Neurotransmitter panel (if available)"],
    redFlags: ["Active pituitary tumors", "Uncontrolled diabetes", "History of acromegaly"],
    stackingNotes: "CJC-1295/Ipamorelin dosed at bedtime to amplify natural GH pulse. Semax administered intranasally in AM for cognitive support. Cycle GH peptides 5 days on / 2 off. Cognitive peptides can run continuously for 30-60 days.",
    shareText: "I'm The Optimizer — my peptide profile targets peak vitality and cognitive performance. Take the Peptide Clarity Index™.",
  },
  {
    id: "guardian", name: "The Guardian", tagline: "Fortify the body's first and last line of defense.",
    axes: ["immune", "recovery"],
    description: "Your immune system is either underperforming or misfiring, and tissue repair is compromised as a result. The Guardian profile combines immune-modulating peptides with regenerative compounds to rebuild defensive capacity while healing existing damage.",
    primaryPeptides: [
      { name: "Thymosin Alpha-1", mechanism: "Thymic peptide that modulates T-cell function, enhances NK cell activity, and restores immune balance in both immunosuppressed and autoimmune states", evidence: "Tuthill et al., Ann NY Acad Sci, 2010; Garaci, Ann NY Acad Sci, 2007" },
      { name: "BPC-157", mechanism: "Anti-inflammatory tissue repair with demonstrated immune-modulating properties", evidence: "Sikiric et al., Curr Pharm Des, 2018" },
      { name: "LL-37", mechanism: "Human cathelicidin antimicrobial peptide with broad-spectrum antimicrobial and immunomodulatory activity", evidence: "Vandamme et al., Cell Immunol, 2012" },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Supports tissue repair while reducing inflammatory burden" },
      { name: "KPV", mechanism: "Anti-inflammatory tripeptide derived from alpha-MSH" },
    ],
    suggestedLabWork: ["CBC with differential", "Immunoglobulin panel (IgG, IgA, IgM, IgE)", "ANA + inflammatory markers (CRP, ESR)", "Vitamin D", "Lymphocyte subset panel"],
    redFlags: ["Organ transplant recipients on immunosuppressants (consult transplant team)", "Active severe infection (treat infection first)", "Pregnancy"],
    stackingNotes: "Thymosin Alpha-1 is the cornerstone — typically 1.6mg subcutaneous 2-3x/week. BPC-157 supports gut-immune axis. LL-37 for active infection support. Do not use immune stimulants in organ transplant patients without specialist guidance.",
    shareText: "I'm The Guardian — my peptide profile fortifies immune defense and tissue repair. Take the Peptide Clarity Index™.",
  },
  {
    id: "architect", name: "The Architect", tagline: "Redesign your body from the inside out.",
    axes: ["metabolic", "vitality"],
    description: "You want body recomposition — less fat, more muscle, better energy. The Architect profile combines metabolic peptides with growth hormone support for a comprehensive body transformation protocol.",
    primaryPeptides: [
      { name: "Tesamorelin", mechanism: "GHRH analog specifically proven to reduce visceral adipose tissue while preserving lean mass", evidence: "Falutz et al., NEJM, 2007" },
      { name: "CJC-1295 + Ipamorelin", mechanism: "GH secretagogue stack for muscle protein synthesis, fat oxidation, and recovery", evidence: "Teichman et al., J Clin Endocrinol Metab, 2006" },
    ],
    secondaryPeptides: [
      { name: "Semaglutide", mechanism: "GLP-1 agonist for appetite regulation and metabolic support" },
      { name: "AOD-9604", mechanism: "Modified GH fragment targeting fat metabolism without growth effects" },
    ],
    suggestedLabWork: ["IGF-1", "Fasting insulin + glucose", "HbA1c", "Lipid panel", "Body composition scan (DEXA)", "Testosterone (total + free)"],
    redFlags: ["Active cancer", "Uncontrolled diabetes", "Pituitary disorders"],
    stackingNotes: "Tesamorelin or CJC-1295/Ipamorelin at bedtime. If adding Semaglutide, start low and titrate. Monitor IGF-1 levels quarterly. Combine with resistance training for maximum body recomposition effect.",
    shareText: "I'm The Architect — my peptide profile targets body recomposition and metabolic vitality. Take the Peptide Clarity Index™.",
  },
  {
    id: "sentinel", name: "The Sentinel", tagline: "Defend the mind. Protect the system.",
    axes: ["immune", "cognitive"],
    description: "Your immune and cognitive systems are both under strain — neuroinflammation, brain fog, and immune dysregulation often travel together. The Sentinel profile targets the neuro-immune axis with peptides that protect both systems simultaneously.",
    primaryPeptides: [
      { name: "Selank", mechanism: "Tuftsin analog with combined anxiolytic, nootropic, and immunomodulatory properties — one of few peptides that bridges the neuro-immune axis", evidence: "Uchida et al., Behav Brain Res, 2017; Zozulya et al., Regul Pept, 2001" },
      { name: "Thymosin Alpha-1", mechanism: "Immune modulator that reduces neuroinflammation-driving immune dysfunction", evidence: "Tuthill et al., Ann NY Acad Sci, 2010" },
    ],
    secondaryPeptides: [
      { name: "Semax", mechanism: "BDNF-upregulating nootropic for cognitive restoration" },
      { name: "KPV", mechanism: "Anti-inflammatory peptide reducing systemic inflammation" },
    ],
    suggestedLabWork: ["Inflammatory markers (CRP, IL-6, TNF-alpha)", "CBC with differential", "Vitamin D, B12, folate", "Cortisol (AM)", "Neurotransmitter panel"],
    redFlags: ["Active CNS infection", "Severe autoimmune encephalitis (specialist required)", "Pregnancy"],
    stackingNotes: "Selank intranasal AM + Thymosin Alpha-1 subcutaneous 2-3x/week. This stack addresses the neuro-immune crosstalk that drives both brain fog and immune dysfunction. Add Semax if cognitive symptoms dominate.",
    shareText: "I'm The Sentinel — my peptide profile defends both mind and immune system. Take the Peptide Clarity Index™.",
  },
  {
    id: "restorer", name: "The Restorer", tagline: "Rebuild the physical foundation of vitality.",
    axes: ["recovery", "sexual"],
    description: "Physical repair and hormonal renewal are your dual priorities. Injury, chronic pain, or surgical recovery combined with declining sexual health suggest a system that needs both structural repair and hormonal rebalancing.",
    primaryPeptides: [
      { name: "BPC-157", mechanism: "Tissue repair peptide with demonstrated effects on erectile tissue and gut healing", evidence: "Sikiric et al., J Physiol Pharmacol, 2018" },
      { name: "PT-141 (Bremelanotide)", mechanism: "Melanocortin receptor agonist that acts centrally on sexual arousal pathways — works for both men and women", evidence: "Diamond et al., J Sex Med, 2016; Kingsberg et al., Obstet Gynecol, 2019" },
    ],
    secondaryPeptides: [
      { name: "Kisspeptin", mechanism: "GnRH stimulator for natural testosterone/estrogen support" },
      { name: "TB-500", mechanism: "Tissue repair support for physical recovery" },
    ],
    suggestedLabWork: ["Testosterone (total + free)", "Estradiol", "SHBG", "Prolactin", "PSA (men)", "CBC", "CRP"],
    redFlags: ["Uncontrolled hypertension (PT-141 can raise BP)", "Active cardiovascular disease", "Pregnancy"],
    stackingNotes: "BPC-157 daily for tissue repair. PT-141 is used on-demand (not daily) — typically 1-2 hours before desired effect. Do not combine PT-141 with PDE5 inhibitors without physician guidance.",
    shareText: "I'm The Restorer — my peptide profile targets physical repair and hormonal renewal. Take the Peptide Clarity Index™.",
  },
  {
    id: "strategist", name: "The Strategist", tagline: "Fuel the brain. Fix the engine.",
    axes: ["cognitive", "metabolic"],
    description: "Your brain and metabolism are linked — blood sugar crashes tank focus, metabolic dysfunction drives brain fog, and the cycle feeds itself. The Strategist profile breaks this loop with metabolic peptides that also support cognitive function.",
    primaryPeptides: [
      { name: "Semaglutide", mechanism: "GLP-1 agonist with emerging neuroprotective evidence — improves metabolic health while crossing the blood-brain barrier", evidence: "Wilding et al., NEJM, 2021; Femminella et al., Trials, 2019 (ELAD trial)" },
      { name: "Semax", mechanism: "Nootropic peptide enhancing BDNF, cognitive processing speed, and memory consolidation", evidence: "Ashmarin et al., Neurosci Res, 2005" },
    ],
    secondaryPeptides: [
      { name: "Selank", mechanism: "Anxiolytic nootropic for stress-related cognitive impairment" },
      { name: "Dihexa", mechanism: "Potent cognitive enhancer via HGF/c-Met pathway" },
    ],
    suggestedLabWork: ["Fasting insulin + glucose", "HbA1c", "Lipid panel", "Vitamin D, B12", "Homocysteine", "Cortisol (AM)"],
    redFlags: ["Medullary thyroid carcinoma history", "MEN2 syndrome", "Active eating disorder"],
    stackingNotes: "Semaglutide weekly (titrate slowly) + Semax intranasal daily. The metabolic-cognitive synergy is well-documented — fixing insulin resistance often resolves 40-60% of brain fog symptoms independently.",
    shareText: "I'm The Strategist — my peptide profile optimizes both brain and metabolism. Take the Peptide Clarity Index™.",
  },
  {
    id: "vanguard", name: "The Vanguard", tagline: "Cellular defense meets cellular longevity.",
    axes: ["longevity", "immune"],
    description: "You're playing the long game — immune resilience and cellular longevity are your priorities. The Vanguard profile combines telomere-protective peptides with immune modulators for a defense-in-depth approach to aging.",
    primaryPeptides: [
      { name: "Epitalon", mechanism: "Tetrapeptide that activates telomerase, potentially slowing telomere shortening and cellular senescence", evidence: "Khavinson et al., Bull Exp Biol Med, 2003; Neuroendocrinol Lett, 2003" },
      { name: "Thymosin Alpha-1", mechanism: "Restores thymic function that naturally declines with age, supporting immune surveillance against senescent cells", evidence: "Garaci, Ann NY Acad Sci, 2007" },
    ],
    secondaryPeptides: [
      { name: "FOXO4-DRI", mechanism: "Senolytic peptide that selectively clears senescent cells" },
      { name: "GHK-Cu", mechanism: "Copper peptide with tissue remodeling and gene expression modulation" },
    ],
    suggestedLabWork: ["Telomere length test", "Inflammatory markers (CRP, IL-6)", "Immunoglobulin panel", "Vitamin D", "Oxidative stress markers (8-OHdG)", "CBC with differential"],
    redFlags: ["Active cancer (telomerase activation contraindicated)", "Organ transplant", "Pregnancy"],
    stackingNotes: "Epitalon typically cycled 10-20 days, 2-3x per year. Thymosin Alpha-1 can run continuously. FOXO4-DRI is experimental — physician supervision mandatory. This is a longevity-focused stack, not acute treatment.",
    shareText: "I'm The Vanguard — my peptide profile targets cellular defense and longevity. Take the Peptide Clarity Index™.",
  },
  {
    id: "renaissance", name: "The Renaissance", tagline: "Vitality and desire, restored together.",
    axes: ["vitality", "sexual"],
    description: "Energy and sexual health are declining in parallel — a common pattern as growth hormone and sex hormone production both decrease with age. The Renaissance profile addresses both systems simultaneously.",
    primaryPeptides: [
      { name: "CJC-1295 + Ipamorelin", mechanism: "GH secretagogue stack that improves energy, sleep, body composition, and indirectly supports hormonal balance", evidence: "Teichman et al., J Clin Endocrinol Metab, 2006" },
      { name: "PT-141", mechanism: "Central-acting sexual function peptide that works independently of hormonal status", evidence: "Diamond et al., J Sex Med, 2016" },
    ],
    secondaryPeptides: [
      { name: "Kisspeptin", mechanism: "Natural GnRH stimulator for endogenous hormone production" },
      { name: "Sermorelin", mechanism: "Alternative GHRH analog for GH support" },
    ],
    suggestedLabWork: ["IGF-1", "Testosterone (total + free)", "Estradiol", "DHEA-S", "Thyroid panel", "Prolactin", "SHBG"],
    redFlags: ["Hormone-sensitive cancers", "Uncontrolled hypertension", "Pituitary tumors"],
    stackingNotes: "CJC-1295/Ipamorelin at bedtime for GH support. PT-141 on-demand for sexual function. Kisspeptin can be added for natural hormone stimulation. Monitor hormone levels quarterly.",
    shareText: "I'm The Renaissance — my peptide profile restores vitality and sexual health together. Take the Peptide Clarity Index™.",
  },
  {
    id: "catalyst", name: "The Catalyst", tagline: "Metabolic clarity drives mental clarity.",
    axes: ["metabolic", "cognitive"],
    description: "Same as The Strategist but with metabolic axis dominant. Your metabolic dysfunction is the primary driver of cognitive symptoms. Fix the metabolism first, and cognitive function often follows.",
    primaryPeptides: [
      { name: "Tirzepatide", mechanism: "Dual GIP/GLP-1 agonist with superior metabolic outcomes and emerging cognitive benefits", evidence: "Jastreboff et al., NEJM, 2022 (SURMOUNT-1)" },
      { name: "Selank", mechanism: "Anxiolytic nootropic supporting cognitive function during metabolic transition", evidence: "Zozulya et al., Regul Pept, 2001" },
    ],
    secondaryPeptides: [
      { name: "Semax", mechanism: "BDNF-enhancing nootropic for cognitive support" },
      { name: "AOD-9604", mechanism: "GH fragment for targeted fat metabolism" },
    ],
    suggestedLabWork: ["Fasting insulin + glucose", "HbA1c", "Lipid panel", "Liver function", "Vitamin D, B12", "Body composition (DEXA)"],
    redFlags: ["Medullary thyroid carcinoma", "MEN2", "Pancreatitis history", "Active eating disorder"],
    stackingNotes: "Tirzepatide weekly with slow titration. Selank intranasal daily for cognitive support during metabolic transition. Many patients report cognitive improvement within 4-6 weeks of metabolic stabilization.",
    shareText: "I'm The Catalyst — metabolic clarity drives my mental clarity. Take the Peptide Clarity Index™.",
  },
  {
    id: "centurion", name: "The Centurion", tagline: "Age is a number. Biology is a choice.",
    axes: ["longevity", "vitality"],
    description: "You're optimizing for healthspan — not just lifespan. The Centurion profile combines longevity peptides with growth factor support for a comprehensive anti-aging protocol grounded in cellular biology.",
    primaryPeptides: [
      { name: "Epitalon", mechanism: "Telomerase activator for cellular longevity", evidence: "Khavinson et al., Bull Exp Biol Med, 2003" },
      { name: "CJC-1295 + Ipamorelin", mechanism: "GH support for the age-related decline in growth hormone that drives sarcopenia, fat gain, and reduced recovery", evidence: "Teichman et al., J Clin Endocrinol Metab, 2006" },
    ],
    secondaryPeptides: [
      { name: "GHK-Cu", mechanism: "Copper peptide for skin remodeling and gene expression" },
      { name: "NAD+ precursors", mechanism: "Cellular energy and DNA repair support" },
    ],
    suggestedLabWork: ["IGF-1", "Telomere length", "Oxidative stress markers", "Inflammatory markers", "DEXA scan", "Vitamin D", "Comprehensive metabolic panel"],
    redFlags: ["Active cancer", "Pituitary tumors", "Uncontrolled diabetes"],
    stackingNotes: "Epitalon cycled 2-3x/year. CJC-1295/Ipamorelin at bedtime ongoing with periodic breaks. GHK-Cu topical or subcutaneous. This is a marathon protocol — expect gradual improvements over 6-12 months.",
    shareText: "I'm The Centurion — my peptide profile targets healthspan optimization and anti-aging. Take the Peptide Clarity Index™.",
  },
  {
    id: "healer", name: "The Healer", tagline: "Deep repair meets deep defense.",
    axes: ["recovery", "immune"],
    description: "Your body is fighting on two fronts — tissue damage and immune dysfunction. These often feed each other: chronic inflammation prevents healing, and unhealed tissue triggers immune responses. The Healer profile breaks this cycle.",
    primaryPeptides: [
      { name: "BPC-157", mechanism: "Tissue repair with anti-inflammatory properties that calm immune overreaction at injury sites", evidence: "Sikiric et al., J Physiol Pharmacol, 2018" },
      { name: "Thymosin Alpha-1", mechanism: "Immune modulator that restores balanced immune function", evidence: "Tuthill et al., Ann NY Acad Sci, 2010" },
      { name: "KPV", mechanism: "Alpha-MSH-derived anti-inflammatory tripeptide with gut-specific immune modulation", evidence: "Brzoska et al., Ann NY Acad Sci, 2008" },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Tissue repair and anti-inflammatory support" },
      { name: "LL-37", mechanism: "Antimicrobial peptide for infection-related immune burden" },
    ],
    suggestedLabWork: ["CBC with differential", "CRP, ESR", "ANA panel", "Immunoglobulin levels", "Comprehensive stool analysis", "Food sensitivity panel"],
    redFlags: ["Active severe infection (treat first)", "Organ transplant", "Pregnancy"],
    stackingNotes: "BPC-157 + Thymosin Alpha-1 is the repair-immune foundation. Add KPV for gut-specific immune issues. This stack is particularly effective for autoimmune-driven tissue damage (IBD, rheumatoid conditions).",
    shareText: "I'm The Healer — my peptide profile targets deep repair and immune restoration. Take the Peptide Clarity Index™.",
  },
  {
    id: "alchemist", name: "The Alchemist", tagline: "Protect the mind across decades, not days.",
    axes: ["longevity", "cognitive"],
    description: "Your priority is neuroprotection — preserving cognitive function as you age. Family history of dementia, early cognitive decline, or proactive brain health optimization all point to The Alchemist profile.",
    primaryPeptides: [
      { name: "Dihexa", mechanism: "Angiotensin IV analog that is 10 million times more potent than BDNF at promoting synaptogenesis via HGF/c-Met pathway", evidence: "McCoy et al., J Pharmacol Exp Ther, 2013" },
      { name: "Epitalon", mechanism: "Telomerase activation for neuronal longevity and cellular protection", evidence: "Khavinson et al., Neuroendocrinol Lett, 2003" },
    ],
    secondaryPeptides: [
      { name: "Semax", mechanism: "BDNF upregulation for neuroprotection and cognitive enhancement" },
      { name: "Selank", mechanism: "Anxiolytic with neuroprotective properties" },
    ],
    suggestedLabWork: ["Homocysteine", "Vitamin D, B12, folate", "Inflammatory markers", "ApoE genotype (if not already known)", "Telomere length", "Oxidative stress markers"],
    redFlags: ["Active brain tumor", "Uncontrolled seizure disorder", "Pregnancy"],
    stackingNotes: "Dihexa is experimental and requires physician supervision. Epitalon cycled. Semax intranasal daily for ongoing neuroprotection. This is a prevention-focused protocol — start early for maximum benefit.",
    shareText: "I'm The Alchemist — my peptide profile targets long-term brain protection and cognitive longevity. Take the Peptide Clarity Index™.",
  },
  {
    id: "phoenix", name: "The Phoenix", tagline: "Rise from cellular damage. Regenerate from within.",
    axes: ["recovery", "longevity"],
    description: "You've been through something — surgery, illness, trauma, or accumulated damage — and your body needs both acute repair and long-term cellular restoration. The Phoenix profile combines regenerative peptides with longevity compounds.",
    primaryPeptides: [
      { name: "BPC-157", mechanism: "Comprehensive tissue repair across multiple organ systems", evidence: "Sikiric et al., J Physiol Pharmacol, 2018" },
      { name: "Epitalon", mechanism: "Cellular longevity support via telomerase activation", evidence: "Khavinson et al., Bull Exp Biol Med, 2003" },
      { name: "GHK-Cu", mechanism: "Copper peptide that remodels tissue, reduces scarring, and modulates gene expression toward a younger phenotype", evidence: "Pickart et al., Oxid Med Cell Longev, 2012" },
    ],
    secondaryPeptides: [
      { name: "TB-500", mechanism: "Tissue migration and repair support" },
      { name: "NAD+ precursors", mechanism: "Cellular energy restoration" },
    ],
    suggestedLabWork: ["Comprehensive metabolic panel", "CBC", "CRP, ESR", "IGF-1", "Telomere length", "Oxidative stress markers", "Vitamin D"],
    redFlags: ["Active cancer (growth factors + telomerase contraindicated)", "Pregnancy"],
    stackingNotes: "BPC-157 for acute repair (4-8 weeks), then transition to Epitalon + GHK-Cu for long-term cellular restoration. This is a phased protocol: repair first, then longevity optimization.",
    shareText: "I'm The Phoenix — my peptide profile targets regeneration and cellular renewal. Take the Peptide Clarity Index™.",
  },
  {
    id: "sovereign", name: "The Sovereign", tagline: "Balanced optimization across every system.",
    axes: ["vitality", "longevity"],
    description: "Your scores are relatively balanced across all axes — no single system is in crisis, but multiple systems show mild-to-moderate decline. The Sovereign profile takes a comprehensive, balanced approach to whole-system optimization.",
    primaryPeptides: [
      { name: "CJC-1295 + Ipamorelin", mechanism: "Foundation GH support that benefits virtually every system — sleep, recovery, body composition, immune function, and cognitive health", evidence: "Teichman et al., J Clin Endocrinol Metab, 2006" },
      { name: "BPC-157", mechanism: "Systemic tissue protection and gut health support", evidence: "Sikiric et al., J Physiol Pharmacol, 2018" },
    ],
    secondaryPeptides: [
      { name: "Thymosin Alpha-1", mechanism: "Immune modulation for balanced defense" },
      { name: "Epitalon", mechanism: "Longevity support via telomerase activation" },
    ],
    suggestedLabWork: ["Comprehensive metabolic panel", "CBC with differential", "IGF-1", "Thyroid panel", "Vitamin D, B12", "Testosterone/Estradiol", "CRP"],
    redFlags: ["Active cancer", "Pregnancy", "Uncontrolled chronic conditions"],
    stackingNotes: "Start with CJC-1295/Ipamorelin + BPC-157 as the foundation. After 8-12 weeks, assess which systems responded least and add targeted peptides. The Sovereign approach is iterative — optimize the foundation, then specialize.",
    shareText: "I'm The Sovereign — my peptide profile targets balanced whole-system optimization. Take the Peptide Clarity Index™.",
  },
];

/* ── SCORING ENGINE ── */

function calculateScores(answers: Record<number, number>): Record<string, number> {
  const raw: Record<string, number> = {};
  Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
    const q = QUESTIONS[Number(qIdx)];
    if (!q) return;
    const choice = q.choices[choiceIdx];
    if (!choice) return;
    Object.entries(choice.weights).forEach(([axis, val]) => {
      raw[axis] = (raw[axis] || 0) + val;
    });
  });
  // Normalize to 0-100 per axis
  const maxPossible = 15; // theoretical max per axis across 10 questions
  const normalized: Record<string, number> = {};
  Object.keys(AXES).forEach((axis) => {
    normalized[axis] = Math.min(100, Math.round(((raw[axis] || 0) / maxPossible) * 100));
  });
  return normalized;
}

function getContraFlags(answers: Record<number, number>): string[] {
  const flags: string[] = [];
  Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
    const q = QUESTIONS[Number(qIdx)];
    if (!q) return;
    const choice = q.choices[choiceIdx];
    if (choice?.contraFlag) flags.push(choice.contraFlag);
  });
  return flags;
}

function getProfile(scores: Record<string, number>): PeptideProfile {
  // Sort axes by score descending
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0]?.[0] || "vitality";
  const top2 = sorted[1]?.[0] || "longevity";
  
  // Find profile matching top 2 axes (order-independent)
  const match = PROFILES.find(p => 
    (p.axes[0] === top1 && p.axes[1] === top2) ||
    (p.axes[0] === top2 && p.axes[1] === top1)
  );
  
  // If no exact match, find closest by primary axis
  if (!match) {
    return PROFILES.find(p => p.axes[0] === top1 || p.axes[1] === top1) || PROFILES[PROFILES.length - 1];
  }
  return match;
}

function getPeptideReadinessScore(scores: Record<string, number>, contraFlags: string[]): number {
  // PRS = average of all axis scores, penalized by contraindications
  const values = Object.values(scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const penalty = contraFlags.length * 8; // each contra flag reduces readiness
  return Math.max(0, Math.min(100, Math.round(avg - penalty)));
}

/* ── RADAR CHART ── */

function RadarChart({ scores, size = 280 }: { scores: Record<string, number>; size?: number }) {
  const axes = Object.keys(AXES);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const angleStep = (2 * Math.PI) / axes.length;
  
  const getPoint = (axis: number, value: number) => {
    const angle = axis * angleStep - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      {/* Grid */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={axes.map((_, i) => { const p = getPoint(i, level); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke="rgba(212,185,106,0.12)"
          strokeWidth="0.5"
        />
      ))}
      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(212,185,106,0.15)" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <polygon
        points={axes.map((axis, i) => { const p = getPoint(i, scores[axis] || 0); return `${p.x},${p.y}`; }).join(" ")}
        fill="rgba(212,185,106,0.15)"
        stroke="#D4B96A"
        strokeWidth="1.5"
      />
      {/* Data points */}
      {axes.map((axis, i) => {
        const p = getPoint(i, scores[axis] || 0);
        return <circle key={axis} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />;
      })}
      {/* Labels */}
      {axes.map((axis, i) => {
        const p = getPoint(i, 118);
        return (
          <text
            key={axis}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "7px", fill: "rgba(232,228,220,0.7)", fontFamily: "'DM Mono', monospace" }}
          >
            {AXES[axis].icon} {AXES[axis].label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ── */

export default function FindYourPeptide() {
  const [phase, setPhase] = useState<"landing" | "assessment" | "results">("landing");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [emailGated, setEmailGated] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const { markComplete } = useJourneyProgress();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [fadeIn, setFadeIn] = useState(true);
  const [resultsFadeIn, setResultsFadeIn] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const totalQuestions = QUESTIONS.length;
  const progress = Object.keys(answers).length / totalQuestions;

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const contraFlags = useMemo(() => getContraFlags(answers), [answers]);
  const profile = useMemo(() => getProfile(scores), [scores]);
  const prs = useMemo(() => getPeptideReadinessScore(scores, contraFlags), [scores, contraFlags]);

  const handleAnswer = useCallback((choiceIdx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [currentQ]: choiceIdx }));
      if (currentQ < totalQuestions - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setPhase("results");
        markComplete("find-your-peptide");
        try {
          const finalAnswers = { ...answers, [currentQ]: choiceIdx };
          const finalScores = calculateScores(finalAnswers);
          const finalProfile = getProfile(finalScores);
          localStorage.setItem("peptide_results", JSON.stringify({
            archetype: finalProfile.name,
            scores: finalScores,
            prs: getPeptideReadinessScore(finalScores, getContraFlags(finalAnswers)),
            contraFlags: getContraFlags(finalAnswers),
            timestamp: Date.now(),
          }));
        } catch {}
        setTimeout(() => setResultsFadeIn(true), 100);
      }
      setFadeIn(true);
    }, 300);
  }, [currentQ, totalQuestions, answers]);

  const handleShare = useCallback((platform: string) => {
    const url = window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com");
    const text = profile.shareText;
    switch (platform) {
      case "twitter": window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank"); break;
      case "linkedin": window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank"); break;
      case "email": window.open(`mailto:?subject=${encodeURIComponent("My Peptide Clarity Index™ Results")}&body=${encodeURIComponent(text + "\n\n" + url)}`, "_blank"); break;
      case "copy": navigator.clipboard?.writeText(url); break;
    }
    setShareCount((prev) => prev + 1);
  }, [profile]);

  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentQ(0);
    setAnswers({});
    setFadeIn(true);
    setResultsFadeIn(false);
    setShareCount(0);
    setEmailGated(false);
    setGateEmail("");
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [phase]);

  /* ── BG ── */
  const bg = (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "transparent" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(34,139,34,0.06) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 30%, rgba(212,185,106,0.04) 0%, transparent 50%)" }} />
    </div>
  );

  /* ── LANDING ── */
  if (phase === "landing") {
    return (
      <>
        <SEO title="Find Your Peptide — The Peptide Clarity Index™" description="The most comprehensive peptide assessment available. 10 questions, 7 clinical axes, 16 personalized archetypes."
        indexable={true} />
        <JourneyTracker variant="light" currentAssessmentId="find-your-peptide" />
        {bg}
        <AssessmentIntro
          title="Find Your Peptide"
          subtitle="Your biology is speaking in molecules. Time to learn the language."
          description="Peptides are the body's signaling molecules — tiny chains of amino acids that regulate everything from sleep to inflammation to cognitive function. This assessment maps your biological needs across 7 clinical axes to find the peptide protocols that match your specific optimization goals."
          stats={{ questions: 10, dimensions: 7, minutes: 4 }}
          whatYouGet={["Your peptide profile and primary biological needs", "A dimensional map of your optimization priorities", "Understanding of which peptide protocols match your goals", "Evidence-based resources for informed decisions"]}
          accentColor="#00838F"
          heroImage="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/peptide-hero-find-Pd2B4xq5sV9Fwq6fkoA8sC.webp"
          onBegin={() => setPhase('assessment')}
        />
      </>
    );
  }

  /* ── ASSESSMENT ── */
  if (phase === "assessment") {
    const q = QUESTIONS[currentQ];
    return (
      <>
        <SEO title={`Question ${currentQ + 1} — Peptide Clarity Index™`} description="Answer 10 scientifically structured questions to discover your personalized peptide profile."
        indexable={true} />
        {bg}
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "2rem 1.5rem" }}>
          {/* Progress */}
          <div style={{ maxWidth: 600, margin: "0 auto 2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(212,185,106,0.5)", letterSpacing: "0.1em" }}>
                QUESTION {currentQ + 1} OF {totalQuestions}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.3)" }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #8B6914, #D4B96A)", borderRadius: 2, transition: "width 0.5s ease" }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ maxWidth: 600, margin: "0 auto", opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s ease" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", color: "#2C1810", lineHeight: 1.3, marginBottom: "0.5rem" }}>
              {q.stem}
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.5)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              {q.subtext}
            </p>
            {q.citation && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(212,185,106,0.3)", marginBottom: "1.5rem" }}>
                📎 {q.citation}
              </p>
            )}

            {/* Choices */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {q.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  style={{
                    padding: "1rem 1.25rem",
                    background: answers[currentQ] === idx ? "rgba(212,185,106,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${answers[currentQ] === idx ? "rgba(212,185,106,0.4)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,185,106,0.08)"; e.currentTarget.style.borderColor = "rgba(212,185,106,0.25)"; }}
                  onMouseLeave={(e) => { if (answers[currentQ] !== idx) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; } }}
                >
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#2C1810", lineHeight: 1.5 }}>
                    {choice.text}
                  </div>
                  {choice.subtext && (
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.35)", marginTop: "0.25rem" }}>
                      {choice.subtext}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Back button */}
            {currentQ > 0 && (
              <button
                onClick={() => { setFadeIn(false); setTimeout(() => { setCurrentQ(prev => prev - 1); setFadeIn(true); }, 300); }}
                style={{ marginTop: "1.5rem", padding: "0.5rem 1rem", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(232,228,220,0.4)", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", cursor: "pointer" }}
              >
                ← Previous
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── EMAIL GATE ── */
  if (phase === "results" && !emailGated) {
    return (
      <>
        <SEO title="Your Results Are Ready — Peptide Clarity Index™" description="Enter your email to unlock your personalized 7-axis peptide profile with evidence-cited recommendations."
        indexable={true} />
        {bg}
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 440, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🧬</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#8B6914", marginBottom: "0.5rem" }}>
              Your Peptide Clarity Index™ is ready.
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Enter your email to unlock your personalized 7-axis profile, peptide recommendations with evidence citations, suggested lab work, and contraindication screening results.
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.35)", marginBottom: "1.5rem" }}>
              Peptide Readiness Score: <span style={{ color: "#8B6914" }}>{prs}/100</span>
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (gateEmail.includes("@")) setEmailGated(true); }} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: "4px", border: "1px solid rgba(212,185,106,0.3)", background: "rgba(255,255,255,0.05)", color: "#2C1810", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none" }}
              />
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#D4B96A", color: "#0A0A10", border: "none", borderRadius: "4px", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer" }}>
                UNLOCK
              </button>
            </form>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.3)", marginTop: "0.8rem" }}>
              No spam. Unsubscribe anytime. Your data stays private.
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── RESULTS ── */
  return (
    <>
      <ThemedBackground theme="peptide" />
      <SEO title={`${profile.name} — Peptide Clarity Index™`} description={profile.description}
        indexable={true} />
      {bg}
      <div style={{ minHeight: "100vh", padding: "4rem 1.5rem", position: "relative", zIndex: 1, opacity: resultsFadeIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(212,185,106,0.5)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Your Peptide Clarity Index™ Result
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#8B6914", marginBottom: "0.5rem" }}>
              {profile.name}
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.2rem", color: "rgba(232,228,220,0.6)", fontStyle: "italic" }}>
              {profile.tagline}
            </p>
          </div>

          {/* Peptide Readiness Score */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem", padding: "1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.4)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>PEPTIDE READINESS SCORE</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "#8B6914", fontWeight: 700 }}>{prs}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.4)" }}>
              {prs >= 70 ? "High readiness — strong candidate for peptide therapy" : prs >= 40 ? "Moderate readiness — targeted protocols recommended" : "Low readiness — physician consultation strongly recommended before starting"}
            </div>
            {contraFlags.length > 0 && (
              <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "4px", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(220,120,120,0.8)" }}>
                ⚠️ {contraFlags.length} contraindication flag{contraFlags.length > 1 ? "s" : ""} detected — physician review required
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Your 7-Axis Clinical Profile
            </h3>
            <RadarChart scores={scores} />
          </div>

          {/* Axis Breakdown */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Axis Scores
            </h3>
            {Object.entries(AXES).map(([key, axis]) => (
              <div key={key} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#2C1810" }}>{axis.icon} {axis.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#8B6914" }}>{scores[key] || 0}/100</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${scores[key] || 0}%`, background: "linear-gradient(90deg, #8B6914, #D4B96A)", borderRadius: 3, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Profile Description */}
          <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,185,106,0.1)", borderRadius: "8px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "rgba(232,228,220,0.7)", lineHeight: 1.7 }}>
              {profile.description}
            </p>
          </div>

          {/* Primary Peptides */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Primary Peptide Recommendations
            </h3>
            {profile.primaryPeptides.map((p, i) => (
              <div key={i} style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,185,106,0.1)", borderRadius: "6px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#8B6914", marginBottom: "0.25rem" }}>{p.name}</div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{p.mechanism}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(212,185,106,0.4)" }}>📎 {p.evidence}</p>
              </div>
            ))}
          </div>

          {/* Secondary Peptides */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Secondary Considerations
            </h3>
            {profile.secondaryPeptides.map((p, i) => (
              <div key={i} style={{ marginBottom: "0.5rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#2C1810" }}>{p.name}</span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "rgba(232,228,220,0.5)" }}> — {p.mechanism}</span>
              </div>
            ))}
          </div>

          {/* Stacking Notes */}
          <div style={{ marginBottom: "2.5rem", padding: "1.25rem", background: "rgba(212,185,106,0.05)", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#8B6914", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Stacking Protocol Notes
            </h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7 }}>
              {profile.stackingNotes}
            </p>
          </div>

          {/* Suggested Lab Work */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Suggested Lab Work Before Starting
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {profile.suggestedLabWork.map((lab, i) => (
                <span key={i} style={{ padding: "0.35rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.6)" }}>
                  {lab}
                </span>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div style={{ marginBottom: "2.5rem", padding: "1.25rem", background: "rgba(220,50,50,0.05)", border: "1px solid rgba(220,50,50,0.15)", borderRadius: "8px" }}>
            <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(220,120,120,0.7)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
              ⚠️ Contraindications & Red Flags
            </h3>
            {profile.redFlags.map((flag, i) => (
              <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "rgba(220,150,150,0.7)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                • {flag}
              </p>
            ))}
          </div>

          {/* Share */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.4)", marginBottom: "0.75rem" }}>
              Share your results
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {["twitter", "linkedin", "email", "copy"].map((p) => (
                <button key={p} onClick={() => handleShare(p)} style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(232,228,220,0.6)", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", cursor: "pointer", textTransform: "capitalize" }}>
                  {p === "copy" ? "Copy Link" : p}
                </button>
              ))}
            </div>
            {shareCount > 0 && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(212,185,106,0.4)", marginTop: "0.5rem" }}>Shared {shareCount}x</p>}
          </div>

          {/* Restart */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
            assessmentType="peptide"
            sessionId={sessionId}
            answers={JSON.stringify(answers)}
            resultSummary={JSON.stringify({ peptide: profile?.name })}
            totalScore={null}
            />

            <button onClick={handleRestart} style={{ padding: "0.6rem 1.5rem", background: "none", border: "1px solid rgba(212,185,106,0.3)", borderRadius: "4px", color: "#8B6914", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", cursor: "pointer" }}>

              Retake Assessment
            </button>
          </div>

          {/* Medical Disclaimer */}
          <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.35)", lineHeight: 1.7, textAlign: "center" }}>
              <strong style={{ color: "rgba(232,228,220,0.5)" }}>Medical Disclaimer:</strong> This assessment is for educational purposes only and does not constitute medical advice. Peptide therapy should only be pursued under the supervision of a qualified healthcare provider. Always consult your physician before starting any new therapeutic protocol. Individual results vary. Citations reference published research but do not guarantee outcomes.
            </p>
          </div>

          {/* Read the article CTA */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem", padding: "1.5rem", background: "rgba(212,185,106,0.05)", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "rgba(232,228,220,0.6)", marginBottom: "0.75rem" }}>
              Want the full story? Read the deep-dive essay behind this assessment.
            </p>
            <Link href="/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(212,185,106,0.3)" }}>
              Read "The Peptide Truth" →
            </Link>
          </div>

          {/* BioChain CTA */}
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <BioChainCTA variant="buyer" context="Looking for verified peptide sourcing? Buyer intake at RampRate BioChain." />
          </div>
          <WhatsNext />
        </div>
      </div>
    </>
  );
}
