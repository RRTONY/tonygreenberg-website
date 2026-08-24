/**
 * PEPTIDE CONSUMER LITERACY QUIZ — 25 Questions
 *
 * Scores users across 5 dimensions:
 *   1. Science Literacy (SL) — understanding of clinical evidence, trial phases, FDA processes
 *   2. Red Flag Detection (RF) — ability to spot manipulation, fake credentials, hype
 *   3. Provider Evaluation (PE) — knowing what makes a credible peptide provider
 *   4. Regulatory Awareness (RA) — understanding of legal landscape, compounding, FDA status
 *   5. Personal Risk Assessment (PR) — awareness of contraindications, interactions, monitoring
 *
 * 5 Result Profiles:
 *   95-100: Peptide Savant — you could teach this class
 *   75-94:  Informed Consumer — solid foundation, minor gaps
 *   50-74:  Developing Awareness — knows some basics, vulnerable to sophisticated marketing
 *   25-49:  High-Risk Consumer — significant knowledge gaps, susceptible to manipulation
 *   0-24:   Danger Zone — urgent need for education before making any peptide decisions
 *
 * Design: Warm parchment editorial style matching the Peptide Truth system.
 */

import { useState, useCallback, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";
import { BioChainCTA } from "@/components/BioChainCTA";

/* ── TYPES ── */

interface Choice {
  text: string;
  correct: boolean;
  points: number; // 0-4
  dimension: string; // SL, RF, PE, RA, PR
  feedback: string;
}

interface Question {
  id: number;
  stem: string;
  context?: string;
  citation?: string;
  dimension: string;
  choices: Choice[];
}

interface Profile {
  id: string;
  name: string;
  range: [number, number];
  tagline: string;
  description: string;
  icon: string;
  color: string;
  recommendations: string[];
  riskLevel: string;
}

/* ── 5 DIMENSIONS ── */

const DIMENSIONS: Record<string, { label: string; icon: string; description: string }> = {
  SL: { label: "Science Literacy", icon: "🔬", description: "Understanding of clinical evidence, trial phases, and FDA approval processes" },
  RF: { label: "Red Flag Detection", icon: "🚩", description: "Ability to spot manipulation, fake credentials, and marketing hype" },
  PE: { label: "Provider Evaluation", icon: "🏥", description: "Knowing what makes a credible peptide provider vs. a pill mill" },
  RA: { label: "Regulatory Awareness", icon: "⚖️", description: "Understanding of legal landscape, compounding pharmacy rules, and FDA status" },
  PR: { label: "Personal Risk Assessment", icon: "🛡️", description: "Awareness of contraindications, drug interactions, and monitoring requirements" },
};

/* ── 5 RESULT PROFILES ── */

const PROFILES: Profile[] = [
  {
    id: "savant",
    name: "Peptide Savant",
    range: [95, 100],
    tagline: "You could teach this class.",
    icon: "🏆",
    color: "#2E7D32",
    description: "You demonstrate expert-level understanding of peptide science, regulatory frameworks, and risk assessment. You can distinguish between legitimate clinical evidence and marketing claims with precision. Your knowledge base rivals that of informed clinicians. You are extremely unlikely to be manipulated by influencer marketing or unsubstantiated health claims.",
    recommendations: [
      "Share your knowledge — most consumers score far below you",
      "Consider mentoring others navigating the peptide landscape",
      "Stay current with FDA regulatory updates and new clinical trials",
      "Review the Evidence Matrix to see how your knowledge maps to provider credibility",
    ],
    riskLevel: "MINIMAL",
  },
  {
    id: "informed",
    name: "Informed Consumer",
    range: [75, 94],
    tagline: "Solid foundation. Minor blind spots.",
    icon: "📊",
    color: "#1565C0",
    description: "You have a strong working knowledge of peptide science and can identify most red flags. You understand the difference between anecdotal evidence and clinical trials, and you know what questions to ask providers. Some gaps remain in specialized areas — regulatory nuances or specific contraindication awareness — but you are well-positioned to make informed decisions.",
    recommendations: [
      "Review the areas where you scored lowest — those are your vulnerability points",
      "Cross-reference any provider claims against our Hall of Shame rankings",
      "Use the Supply Chain Transparency tool before purchasing",
      "Consider consulting a board-certified endocrinologist for personalized guidance",
    ],
    riskLevel: "LOW",
  },
  {
    id: "developing",
    name: "Developing Awareness",
    range: [50, 74],
    tagline: "You know some basics. That's not enough.",
    icon: "📖",
    color: "#F9A825",
    description: "You have foundational knowledge but significant gaps that leave you vulnerable to sophisticated marketing tactics. You can spot the most obvious red flags but may miss subtler manipulation. Influencer endorsements and high production-value marketing materials could sway your judgment. The peptide industry specifically targets consumers at your knowledge level — you know enough to be interested but not enough to be protected.",
    recommendations: [
      "Do NOT purchase peptides until you've reviewed the full Evidence Matrix",
      "Study the Hall of Shame to understand what bad providers look like",
      "Learn the difference between Phase 1, 2, and 3 clinical trials",
      "Require any provider to show you their physician oversight credentials",
      "Use the Supply Chain tool to understand where your money actually goes",
    ],
    riskLevel: "MODERATE",
  },
  {
    id: "high-risk",
    name: "High-Risk Consumer",
    range: [25, 49],
    tagline: "You are the target market for bad actors.",
    icon: "⚠️",
    color: "#E65100",
    description: "Your current knowledge level makes you highly susceptible to peptide marketing manipulation. You lack the frameworks to distinguish between legitimate medical providers and wellness influencers selling hope. At this level, you are statistically more likely to purchase from unregulated sources, skip necessary lab work, ignore contraindications, and spend money on products with no clinical evidence. This is not a judgment — it is a risk assessment.",
    recommendations: [
      "STOP — do not purchase any peptides until you've completed your education",
      "Read the Peptide Truth article from start to finish",
      "Study every entity in the Evidence Matrix and understand why scores differ",
      "Learn what FDA Phase 3 trials mean and why they matter",
      "Understand that 5-star Google reviews have zero correlation with clinical efficacy",
      "Consult a board-certified physician (not a 'wellness coach') before any peptide use",
    ],
    riskLevel: "HIGH",
  },
  {
    id: "danger",
    name: "Danger Zone",
    range: [0, 24],
    tagline: "Urgent: you need education before making any peptide decisions.",
    icon: "🚨",
    color: "#B71C1C",
    description: "Your responses indicate critical gaps in understanding that put you at serious risk of physical harm and financial exploitation. You are unable to distinguish between evidence-based medicine and marketing, between credentialed physicians and social media influencers, between FDA-approved therapies and unregulated compounds. Every dollar you spend on peptides at this knowledge level has a high probability of being wasted or harmful. This assessment exists specifically to protect consumers like you.",
    recommendations: [
      "DO NOT purchase any peptides — your risk of harm is extremely high",
      "Start with the Peptide Truth article and read every section",
      "Study the Hall of Shame to understand the full spectrum of provider quality",
      "Learn what 'compounding pharmacy' means and how it differs from FDA-approved drugs",
      "Understand that influencers with millions of followers have ZERO medical authority",
      "Find a board-certified endocrinologist in your area before considering any peptide therapy",
      "Retake this quiz after completing your education to measure your progress",
    ],
    riskLevel: "CRITICAL",
  },
];

/* ── 25 QUESTIONS ── */

const QUESTIONS: Question[] = [
  // ── SCIENCE LITERACY (5 questions) ──
  {
    id: 1,
    stem: "A peptide company claims their product 'has been shown in studies to increase growth hormone by 300%.' What is the most important question to ask?",
    context: "This is one of the most common marketing claims in the peptide industry.",
    dimension: "SL",
    choices: [
      { text: "Were those studies conducted in humans, in Phase 2 or 3 clinical trials?", correct: true, points: 4, dimension: "SL", feedback: "Correct. Animal studies and in-vitro results do not predict human outcomes. Only Phase 2+ human trials provide meaningful evidence." },
      { text: "How many people in the study experienced this increase?", correct: false, points: 2, dimension: "SL", feedback: "Partially correct. Sample size matters, but the more critical question is whether the study was conducted in humans at all. Many peptide claims cite rat studies." },
      { text: "Which brand of peptide was used in the study?", correct: false, points: 0, dimension: "SL", feedback: "This misses the point entirely. The question isn't which brand — it's whether the evidence is from human clinical trials or animal/in-vitro studies." },
      { text: "What percentage increase did the control group show?", correct: false, points: 1, dimension: "SL", feedback: "Understanding controls is good science, but the foundational question is whether the study involved humans in a rigorous trial design." },
    ],
  },
  {
    id: 2,
    stem: "What does 'FDA-approved' actually mean for a peptide?",
    context: "Only a handful of peptides have achieved full FDA approval.",
    dimension: "SL",
    choices: [
      { text: "The FDA has reviewed Phase 1, 2, and 3 clinical trial data and determined the drug is safe and effective for a specific indication", correct: true, points: 4, dimension: "SL", feedback: "Correct. FDA approval requires rigorous multi-phase clinical trials demonstrating both safety and efficacy for a specific medical condition." },
      { text: "The FDA has confirmed the peptide is safe for human consumption", correct: false, points: 1, dimension: "SL", feedback: "Incomplete. FDA approval is indication-specific — a drug is approved for treating a particular condition, not as 'generally safe.'" },
      { text: "The peptide has been tested and found to have no side effects", correct: false, points: 0, dimension: "SL", feedback: "No drug has zero side effects. FDA approval means the benefits outweigh the risks for a specific condition — not that it's side-effect-free." },
      { text: "The FDA allows it to be sold in the United States", correct: false, points: 1, dimension: "SL", feedback: "Many non-FDA-approved compounds are legally sold (supplements, compounded medications). 'Allowed to sell' and 'FDA-approved' are very different things." },
    ],
  },
  {
    id: 3,
    stem: "BPC-157 is one of the most popular peptides sold online. What is its current FDA status?",
    context: "BPC-157 (Body Protection Compound) is derived from a protein found in gastric juice.",
    citation: "FDA Bulk Drug Substances Advisory, 2024",
    dimension: "SL",
    choices: [
      { text: "It has never completed a single Phase 2 or Phase 3 human clinical trial", correct: true, points: 4, dimension: "SL", feedback: "Correct. Despite enormous popularity, BPC-157 has zero completed Phase 2 or 3 human trials. All evidence is from animal studies and case reports." },
      { text: "It is FDA-approved for tissue repair and gut healing", correct: false, points: 0, dimension: "SL", feedback: "Completely false. BPC-157 has no FDA approval for any indication. This is one of the most widespread misconceptions in the peptide market." },
      { text: "It is in Phase 3 clinical trials and expected to be approved soon", correct: false, points: 1, dimension: "SL", feedback: "No Phase 3 trials exist for BPC-157. There is no imminent approval pathway." },
      { text: "It was previously FDA-approved but had its approval revoked", correct: false, points: 0, dimension: "SL", feedback: "BPC-157 was never FDA-approved. It has always been an unregulated research compound." },
    ],
  },
  {
    id: 4,
    stem: "A clinic's website states: 'Our peptide protocols are backed by over 500 peer-reviewed studies.' What should you verify?",
    dimension: "SL",
    choices: [
      { text: "Whether those studies are human trials (not animal/in-vitro), and whether they tested the specific peptide at the specific dose the clinic prescribes", correct: true, points: 4, dimension: "SL", feedback: "Correct. '500 studies' is meaningless if they're all rat studies, or if they tested different peptides, different doses, or different conditions than what the clinic sells." },
      { text: "Whether the studies are published in reputable journals", correct: false, points: 2, dimension: "SL", feedback: "Journal quality matters, but the critical issue is whether the studies are human trials testing the specific protocols the clinic actually uses." },
      { text: "Whether 500 is a large enough number of studies", correct: false, points: 0, dimension: "SL", feedback: "The number of studies is irrelevant if none of them are human clinical trials testing the clinic's actual protocols." },
      { text: "Whether the clinic's doctors authored any of the studies", correct: false, points: 1, dimension: "SL", feedback: "Author credentials matter, but the fundamental question is study type (human vs. animal) and relevance to the clinic's actual offerings." },
    ],
  },
  {
    id: 5,
    stem: "What is the difference between a Phase 1 and a Phase 3 clinical trial?",
    dimension: "SL",
    choices: [
      { text: "Phase 1 tests safety in a small group; Phase 3 tests efficacy in a large population against a control", correct: true, points: 4, dimension: "SL", feedback: "Correct. Phase 1 (20-80 people, safety/dosing), Phase 2 (100-300, preliminary efficacy), Phase 3 (1,000-3,000+, definitive efficacy vs. placebo)." },
      { text: "Phase 1 is done in animals; Phase 3 is done in humans", correct: false, points: 1, dimension: "SL", feedback: "Animal testing is pre-clinical, before Phase 1. All three phases involve humans, with increasing rigor and sample size." },
      { text: "Phase 1 tests one peptide; Phase 3 tests combinations", correct: false, points: 0, dimension: "SL", feedback: "This is not how trial phases work. Phases differ in sample size, objectives (safety vs. efficacy), and statistical rigor." },
      { text: "There is no meaningful difference — they're just stages of the same process", correct: false, points: 0, dimension: "SL", feedback: "The differences are enormous. A Phase 1 result tells you almost nothing about whether a drug works. Phase 3 is the gold standard for efficacy evidence." },
    ],
  },

  // ── RED FLAG DETECTION (5 questions) ──
  {
    id: 6,
    stem: "An Instagram influencer with 2 million followers posts: 'This peptide changed my life. I've never felt better. Link in bio.' What red flags are present?",
    dimension: "RF",
    choices: [
      { text: "Anecdotal evidence, no disclosure of financial relationship, no medical credentials, no mention of risks or contraindications", correct: true, points: 4, dimension: "RF", feedback: "Correct. All four red flags are present: personal anecdote (not evidence), likely undisclosed sponsorship, no medical authority, and zero risk disclosure." },
      { text: "The influencer might not actually use the product", correct: false, points: 1, dimension: "RF", feedback: "Authenticity is a concern, but even if they genuinely use it, the post still lacks evidence, credentials, risk disclosure, and financial transparency." },
      { text: "2 million followers means many people could be misled", correct: false, points: 1, dimension: "RF", feedback: "Scale of influence is a concern, but the core red flags are the absence of evidence, credentials, risk disclosure, and financial transparency." },
      { text: "There are no red flags — personal testimonials are valuable evidence", correct: false, points: 0, dimension: "RF", feedback: "Personal testimonials are the weakest form of evidence. They are subject to placebo effect, selection bias, and financial incentives." },
    ],
  },
  {
    id: 7,
    stem: "A peptide clinic's website prominently displays '4.9 stars on Google with 2,000+ reviews.' How should you interpret this?",
    dimension: "RF",
    choices: [
      { text: "Google reviews measure customer service experience, not clinical efficacy — a 5-star review tells you nothing about whether the peptide worked medically", correct: true, points: 4, dimension: "RF", feedback: "Correct. Google reviews reflect subjective experience (friendly staff, nice office, fast shipping) — not clinical outcomes. A clinic can have 5 stars and zero evidence." },
      { text: "This is strong evidence that the clinic's treatments work", correct: false, points: 0, dimension: "RF", feedback: "This is exactly the cognitive error the peptide industry exploits. Reviews measure satisfaction, not efficacy. A sugar pill with great customer service gets 5 stars." },
      { text: "You should check if the reviews mention specific health improvements", correct: false, points: 1, dimension: "RF", feedback: "Even reviews mentioning health improvements are anecdotal and subject to placebo effect. They cannot substitute for clinical evidence." },
      { text: "2,000 reviews is a large enough sample to be statistically meaningful", correct: false, points: 0, dimension: "RF", feedback: "Review volume has no relationship to clinical evidence quality. 2,000 uncontrolled anecdotes do not equal one controlled clinical trial." },
    ],
  },
  {
    id: 8,
    stem: "A provider's bio states: 'Dr. Smith, Human Biologist, Certified Wellness Practitioner, Peptide Optimization Specialist.' What should concern you?",
    dimension: "RF",
    choices: [
      { text: "None of these are recognized medical credentials — 'Human Biologist' is not a medical degree, and the other titles are self-awarded or from non-accredited bodies", correct: true, points: 4, dimension: "RF", feedback: "Correct. These are marketing titles, not medical credentials. Look for: MD, DO, board certification in endocrinology, internal medicine, or a relevant specialty." },
      { text: "The bio doesn't mention which university they attended", correct: false, points: 1, dimension: "RF", feedback: "University matters, but the core issue is that none of these titles represent recognized medical credentials or board certifications." },
      { text: "'Specialist' means they have deep expertise in peptides", correct: false, points: 0, dimension: "RF", feedback: "'Specialist' is not a protected medical term. Anyone can call themselves a specialist. Board certification in a relevant medical specialty is what matters." },
      { text: "This seems like a well-qualified provider", correct: false, points: 0, dimension: "RF", feedback: "None of these credentials qualify someone to prescribe or manage peptide therapy. This is a textbook example of credential inflation." },
    ],
  },
  {
    id: 9,
    stem: "A peptide company offers a 'free consultation' where a 'health coach' recommends a $400/month peptide protocol after a 15-minute phone call. What pattern is this?",
    dimension: "RF",
    choices: [
      { text: "A sales funnel disguised as medical care — no legitimate medical evaluation can occur in 15 minutes with a non-physician", correct: true, points: 4, dimension: "RF", feedback: "Correct. This is a classic sales funnel: free lead generation → unqualified 'consultation' → high-margin product sale. No lab work, no medical history, no physician oversight." },
      { text: "A reasonable way to learn about peptides before committing", correct: false, points: 0, dimension: "RF", feedback: "This is not education — it's a sales pitch. A 15-minute call with a health coach cannot constitute a medical evaluation." },
      { text: "Concerning because the price seems high", correct: false, points: 1, dimension: "RF", feedback: "Price is a secondary concern. The primary issue is that a non-physician is recommending medical interventions without proper evaluation." },
      { text: "Normal — most clinics offer free consultations", correct: false, points: 0, dimension: "RF", feedback: "Legitimate medical practices conduct thorough evaluations with licensed physicians. 'Free consultations' by health coaches are sales mechanisms, not medical care." },
    ],
  },
  {
    id: 10,
    stem: "You see a before/after photo on a peptide company's website showing dramatic weight loss. The fine print says 'Results not typical. Individual results may vary.' What should you know?",
    dimension: "RF",
    choices: [
      { text: "Before/after photos are uncontrolled, unverified, and may involve other interventions (diet, exercise, surgery) — they are marketing tools, not evidence", correct: true, points: 4, dimension: "RF", feedback: "Correct. Before/after photos are the lowest form of evidence. They can be staged, cherry-picked, involve multiple interventions, or be entirely fabricated." },
      { text: "The disclaimer makes it honest — they're being transparent about variability", correct: false, points: 0, dimension: "RF", feedback: "The disclaimer is a legal shield, not transparency. It allows them to show misleading images while technically covering themselves." },
      { text: "You should ask how many people achieved similar results", correct: false, points: 1, dimension: "RF", feedback: "Better question, but even aggregate before/after data is uncontrolled. Without a control group, you cannot attribute results to the peptide." },
      { text: "The photo is probably real since they'd face legal consequences for faking it", correct: false, points: 0, dimension: "RF", feedback: "Enforcement of misleading health marketing is extremely rare. The FTC and FDA have limited resources to police thousands of supplement and peptide companies." },
    ],
  },

  // ── PROVIDER EVALUATION (5 questions) ──
  {
    id: 11,
    stem: "Which of the following is the MOST important credential for a peptide prescriber?",
    dimension: "PE",
    choices: [
      { text: "Board certification in endocrinology, internal medicine, or a relevant medical specialty with an active medical license", correct: true, points: 4, dimension: "PE", feedback: "Correct. Board certification in a relevant specialty means the physician has completed residency training, passed rigorous exams, and maintains continuing education." },
      { text: "A large social media following with many patient testimonials", correct: false, points: 0, dimension: "PE", feedback: "Social media following has zero correlation with medical competence. Many of the most dangerous peptide promoters have the largest followings." },
      { text: "Certification from a peptide training academy or wellness institute", correct: false, points: 1, dimension: "PE", feedback: "Most 'peptide training academies' are not accredited medical education programs. They are often run by companies that also sell peptides." },
      { text: "Years of experience specifically with peptides", correct: false, points: 1, dimension: "PE", feedback: "Experience matters, but without proper medical training and board certification, 'years of experience' could mean years of practicing without adequate oversight." },
    ],
  },
  {
    id: 12,
    stem: "A legitimate peptide clinic should require which of the following BEFORE prescribing?",
    dimension: "PE",
    choices: [
      { text: "Comprehensive blood work, full medical history review, contraindication screening, and ongoing monitoring protocol", correct: true, points: 4, dimension: "PE", feedback: "Correct. All four are non-negotiable. Any clinic that prescribes peptides without comprehensive labs and medical history is operating below standard of care." },
      { text: "A brief health questionnaire and payment information", correct: false, points: 0, dimension: "PE", feedback: "This is a pill mill pattern. A questionnaire and credit card is not a medical evaluation." },
      { text: "Blood work and a phone consultation with a nurse practitioner", correct: false, points: 2, dimension: "PE", feedback: "Blood work is good, but a phone call with an NP is insufficient. Full medical history, contraindication screening, and a monitoring protocol are also required." },
      { text: "A signed waiver acknowledging the risks", correct: false, points: 0, dimension: "PE", feedback: "A waiver protects the clinic legally — it does not constitute medical evaluation or patient safety." },
    ],
  },
  {
    id: 13,
    stem: "What distinguishes a compounding pharmacy from a regular pharmacy in the context of peptides?",
    dimension: "PE",
    choices: [
      { text: "Compounding pharmacies create custom formulations under a physician's prescription; they are regulated by state boards but not subject to the same FDA manufacturing standards as commercial drug manufacturers", correct: true, points: 4, dimension: "PE", feedback: "Correct. Compounding pharmacies fill a legitimate medical need but operate under different (less stringent) oversight than FDA-approved drug manufacturers." },
      { text: "Compounding pharmacies are FDA-approved facilities that make generic versions of brand-name peptides", correct: false, points: 0, dimension: "PE", feedback: "Compounding pharmacies are NOT FDA-approved manufacturers. They are state-regulated and create custom formulations, not generic copies." },
      { text: "There is no difference — all pharmacies are regulated the same way", correct: false, points: 0, dimension: "PE", feedback: "The regulatory differences are significant. Compounding pharmacies have different quality control requirements than FDA-regulated manufacturers." },
      { text: "Compounding pharmacies are unregulated and should be avoided", correct: false, points: 1, dimension: "PE", feedback: "Compounding pharmacies ARE regulated (by state boards), and they serve legitimate medical purposes. But their oversight is less rigorous than FDA manufacturing standards." },
    ],
  },
  {
    id: 14,
    stem: "You're evaluating two peptide clinics. Clinic A has a 10-page intake form asking about medications, allergies, family history, and requires lab work. Clinic B has a 1-page form and can ship peptides within 48 hours. Which is more credible?",
    dimension: "PE",
    choices: [
      { text: "Clinic A — thorough intake and required lab work indicate proper medical evaluation; Clinic B's speed suggests they're prioritizing sales over safety", correct: true, points: 4, dimension: "PE", feedback: "Correct. Medical thoroughness is a positive signal. Speed of fulfillment without proper evaluation is a major red flag." },
      { text: "Clinic B — efficiency suggests they have streamlined, modern processes", correct: false, points: 0, dimension: "PE", feedback: "In medicine, 'efficiency' that skips evaluation is not innovation — it's negligence. You cannot safely prescribe peptides without thorough assessment." },
      { text: "Both are equally credible — different clinics have different processes", correct: false, points: 0, dimension: "PE", feedback: "These are not equivalent approaches. Skipping medical evaluation is not a 'different process' — it's a failure of standard of care." },
      { text: "Neither — you can't judge a clinic by its intake process", correct: false, points: 1, dimension: "PE", feedback: "Intake process is one of the strongest signals of clinical quality. Thorough evaluation correlates with better patient outcomes." },
    ],
  },
  {
    id: 15,
    stem: "A clinic advertises 'physician-supervised peptide therapy.' What should you verify?",
    dimension: "PE",
    choices: [
      { text: "Whether the physician is actively involved in your care (reviews your labs, adjusts dosing, monitors side effects) — or just signs prescriptions remotely", correct: true, points: 4, dimension: "PE", feedback: "Correct. 'Physician-supervised' often means a doctor rubber-stamps prescriptions without meaningful involvement. Active physician engagement is what matters." },
      { text: "Whether the physician has a medical degree", correct: false, points: 1, dimension: "PE", feedback: "Having an MD is necessary but insufficient. The question is whether the physician is actively involved in your care or just lending their license." },
      { text: "Whether the clinic has good reviews", correct: false, points: 0, dimension: "PE", feedback: "Reviews do not verify physician involvement. A clinic can have great reviews while the 'supervising' physician never sees a single patient." },
      { text: "Whether the physician is listed on the clinic's website", correct: false, points: 1, dimension: "PE", feedback: "Being listed on a website doesn't mean the physician is actively involved in patient care. Many clinics list physicians who only sign prescriptions." },
    ],
  },

  // ── REGULATORY AWARENESS (5 questions) ──
  {
    id: 16,
    stem: "As of 2024, the FDA issued a warning about which popular peptide category?",
    citation: "FDA Safety Communication, 2024",
    dimension: "RA",
    choices: [
      { text: "The FDA warned against compounded versions of semaglutide and tirzepatide, citing safety concerns about unregulated formulations", correct: true, points: 4, dimension: "RA", feedback: "Correct. The FDA specifically warned that compounded GLP-1 receptor agonists may not be safe or effective, and may contain different active ingredients than claimed." },
      { text: "The FDA banned all peptides from being sold in the US", correct: false, points: 0, dimension: "RA", feedback: "The FDA has not banned all peptides. Some are FDA-approved (like semaglutide as Ozempic/Wegovy). The warning was specifically about compounded versions." },
      { text: "The FDA approved all commonly used peptides as safe", correct: false, points: 0, dimension: "RA", feedback: "The opposite occurred. The FDA issued warnings about the safety of compounded peptide formulations." },
      { text: "The FDA has not issued any peptide-related warnings", correct: false, points: 0, dimension: "RA", feedback: "The FDA has issued multiple warnings about peptides, including specific warnings about compounded semaglutide and tirzepatide in 2024." },
    ],
  },
  {
    id: 17,
    stem: "Can you legally buy peptides online without a prescription in the United States?",
    dimension: "RA",
    choices: [
      { text: "Some peptides are sold as 'research chemicals not for human consumption' — technically legal to purchase but illegal to use for self-treatment, and they bypass all medical safety checks", correct: true, points: 4, dimension: "RA", feedback: "Correct. The 'research chemical' loophole allows sale but not human use. Purchasing through this channel means zero quality control, zero physician oversight, and zero legal protection." },
      { text: "Yes, peptides are classified as supplements and can be freely purchased", correct: false, points: 0, dimension: "RA", feedback: "Most therapeutic peptides are NOT classified as supplements. They are either prescription drugs or research chemicals — not over-the-counter products." },
      { text: "No, all peptides require a prescription", correct: false, points: 1, dimension: "RA", feedback: "While therapeutic peptides should require prescriptions, the 'research chemical' market operates in a legal gray area that allows purchase without prescriptions." },
      { text: "It depends on the state you live in", correct: false, points: 1, dimension: "RA", feedback: "While state laws vary, the fundamental issue is federal: the 'research chemical' loophole exists nationally, and FDA regulation applies everywhere." },
    ],
  },
  {
    id: 18,
    stem: "What is the legal significance of a peptide being listed on the FDA's 'Bulk Drug Substances' list?",
    dimension: "RA",
    choices: [
      { text: "It means compounding pharmacies can legally use it to create custom formulations under a physician's prescription — but it is NOT the same as FDA approval", correct: true, points: 4, dimension: "RA", feedback: "Correct. Being on the bulk drug substances list allows compounding, but it does not mean the peptide has been proven safe or effective through clinical trials." },
      { text: "It means the FDA has approved the peptide for medical use", correct: false, points: 0, dimension: "RA", feedback: "Being on the bulk drug substances list is NOT FDA approval. It simply allows compounding pharmacies to use the substance." },
      { text: "It means the peptide has been banned by the FDA", correct: false, points: 0, dimension: "RA", feedback: "Being on the list is the opposite of being banned — it allows legal compounding. However, the FDA can and does remove substances from this list." },
      { text: "It has no legal significance", correct: false, points: 0, dimension: "RA", feedback: "It has significant legal significance — it determines whether compounding pharmacies can legally prepare formulations containing that substance." },
    ],
  },
  {
    id: 19,
    stem: "A peptide company operates from overseas and ships directly to US consumers. What regulatory protections do you have?",
    dimension: "RA",
    choices: [
      { text: "Essentially none — overseas companies are outside US regulatory jurisdiction, products may not meet any quality standards, and you have no legal recourse if harmed", correct: true, points: 4, dimension: "RA", feedback: "Correct. Overseas peptide vendors operate outside FDA jurisdiction. Products may be contaminated, mislabeled, or contain no active ingredient. You have no legal recourse." },
      { text: "The same protections as buying from a US company — international trade laws apply", correct: false, points: 0, dimension: "RA", feedback: "International trade laws do not protect individual consumers buying unregulated compounds from overseas. FDA enforcement at the border is limited." },
      { text: "Your credit card company will protect you if the product is defective", correct: false, points: 0, dimension: "RA", feedback: "Credit card chargebacks may recover your money, but they cannot protect you from physical harm caused by contaminated or mislabeled products." },
      { text: "The company's country of origin regulates them", correct: false, points: 1, dimension: "RA", feedback: "Many overseas peptide vendors operate from jurisdictions with minimal pharmaceutical regulation. Even where regulations exist, enforcement is often weak." },
    ],
  },
  {
    id: 20,
    stem: "What happened when the FDA removed certain peptides from the compounding list in 2023-2024?",
    dimension: "RA",
    choices: [
      { text: "Compounding pharmacies could no longer legally produce those peptides, but many continued selling existing inventory or reformulated under different names", correct: true, points: 4, dimension: "RA", feedback: "Correct. FDA removal created a complex enforcement landscape where some pharmacies complied, others sold remaining stock, and the gray market expanded." },
      { text: "All peptide clinics immediately stopped offering those peptides", correct: false, points: 0, dimension: "RA", feedback: "Compliance was not immediate or universal. Many clinics continued offering removed peptides through various legal workarounds or simply ignored the ruling." },
      { text: "Nothing changed — the FDA's list has no enforcement power", correct: false, points: 0, dimension: "RA", feedback: "The FDA's list has real enforcement power, but enforcement is resource-constrained. The removal had significant market impact even if compliance was imperfect." },
      { text: "The peptides became available over the counter instead", correct: false, points: 0, dimension: "RA", feedback: "Removal from the compounding list makes peptides harder to obtain legally, not easier. It does not convert them to OTC products." },
    ],
  },

  // ── PERSONAL RISK ASSESSMENT (5 questions) ──
  {
    id: 21,
    stem: "You are considering starting a peptide protocol. Which of the following is a contraindication that should STOP you from proceeding without specialist consultation?",
    dimension: "PR",
    choices: [
      { text: "Any active cancer, history of cancer, autoimmune disease, pregnancy/nursing, or current use of immunosuppressants", correct: true, points: 4, dimension: "PR", feedback: "Correct. All of these are serious contraindications. Growth-promoting peptides can accelerate cancer growth. Immune-modulating peptides can worsen autoimmune conditions." },
      { text: "Being over 40 years old", correct: false, points: 0, dimension: "PR", feedback: "Age alone is not a contraindication. Many legitimate peptide therapies are specifically designed for age-related conditions." },
      { text: "Having a BMI over 30", correct: false, points: 0, dimension: "PR", feedback: "Elevated BMI is not a contraindication — in fact, some peptides (like GLP-1 agonists) are specifically indicated for obesity management." },
      { text: "Taking daily vitamins or supplements", correct: false, points: 0, dimension: "PR", feedback: "Standard vitamins and supplements are not contraindications for peptide therapy. The concern is with prescription medications and serious medical conditions." },
    ],
  },
  {
    id: 22,
    stem: "What blood work should be done BEFORE starting any peptide protocol?",
    dimension: "PR",
    choices: [
      { text: "Complete metabolic panel, hormone panel (IGF-1, testosterone, thyroid), CBC, liver/kidney function, fasting glucose, and baseline markers specific to the peptide being considered", correct: true, points: 4, dimension: "PR", feedback: "Correct. Comprehensive baseline labs are essential for safety monitoring. Without them, you cannot detect adverse effects or measure whether the peptide is working." },
      { text: "A basic blood test to check cholesterol", correct: false, points: 1, dimension: "PR", feedback: "Cholesterol alone is completely insufficient. Peptide therapy requires comprehensive baseline labs across multiple systems." },
      { text: "No blood work is necessary — peptides are natural and safe", correct: false, points: 0, dimension: "PR", feedback: "This is dangerous misinformation. 'Natural' does not mean safe, and all peptide therapy requires baseline and ongoing lab monitoring." },
      { text: "Whatever the clinic recommends", correct: false, points: 1, dimension: "PR", feedback: "You should know what labs are appropriate, not blindly defer. Some clinics minimize lab requirements to reduce friction and increase sales." },
    ],
  },
  {
    id: 23,
    stem: "You start a peptide and experience persistent headaches, joint pain, and water retention. What should you do?",
    dimension: "PR",
    choices: [
      { text: "Stop the peptide immediately, contact your prescribing physician, and get follow-up blood work — these could be signs of excess growth hormone or other adverse effects", correct: true, points: 4, dimension: "PR", feedback: "Correct. These symptoms can indicate GH excess, fluid retention, or other adverse effects that require medical evaluation and possible dose adjustment or discontinuation." },
      { text: "Reduce the dose by half and see if symptoms improve", correct: false, points: 1, dimension: "PR", feedback: "Self-adjusting medication doses without physician guidance is risky. The symptoms may indicate a serious adverse reaction that requires medical evaluation." },
      { text: "Continue — these are normal 'detox' symptoms that will pass", correct: false, points: 0, dimension: "PR", feedback: "'Detox symptoms' is not a medical concept in peptide therapy. Persistent adverse effects require medical evaluation, not patience." },
      { text: "Switch to a different peptide that doesn't cause these side effects", correct: false, points: 0, dimension: "PR", feedback: "Self-switching peptides without medical guidance compounds the risk. The symptoms need to be evaluated before any changes are made." },
    ],
  },
  {
    id: 24,
    stem: "How often should you get blood work while on an active peptide protocol?",
    dimension: "PR",
    choices: [
      { text: "Baseline before starting, 4-6 weeks after initiation, then every 3-6 months depending on the peptide and your response", correct: true, points: 4, dimension: "PR", feedback: "Correct. Regular monitoring is essential to detect adverse effects early, verify efficacy, and adjust dosing. The specific schedule depends on the peptide and individual response." },
      { text: "Once a year during your annual physical", correct: false, points: 1, dimension: "PR", feedback: "Annual testing is far too infrequent for active peptide therapy. Adverse effects can develop within weeks and need to be caught early." },
      { text: "Only if you experience side effects", correct: false, points: 0, dimension: "PR", feedback: "Many adverse effects are asymptomatic (elevated liver enzymes, hormonal imbalances). Waiting for symptoms means missing problems that blood work would catch." },
      { text: "Blood work isn't necessary if you feel fine", correct: false, points: 0, dimension: "PR", feedback: "Feeling fine does not mean your labs are normal. Many peptide-related complications are detectable only through blood work." },
    ],
  },
  {
    id: 25,
    stem: "You find a peptide forum where users share dosing protocols, cycle lengths, and stacking combinations. How should you use this information?",
    dimension: "PR",
    choices: [
      { text: "As awareness of what the community discusses — but NEVER as a substitute for individualized medical guidance, since your genetics, health conditions, and medications make your situation unique", correct: true, points: 4, dimension: "PR", feedback: "Correct. Forum protocols are crowd-sourced experiments with no quality control. Your individual medical profile makes generic protocols potentially dangerous." },
      { text: "Follow the most popular protocol since it's been tested by many people", correct: false, points: 0, dimension: "PR", feedback: "Popularity does not equal safety or efficacy. Forum users are self-selecting, rarely report adverse effects, and have different medical profiles than you." },
      { text: "Use it as a starting point and adjust based on how you feel", correct: false, points: 1, dimension: "PR", feedback: "Self-experimentation with peptides based on forum protocols is risky. 'How you feel' is not a reliable indicator of safety." },
      { text: "Ignore it completely — online forums have no value", correct: false, points: 1, dimension: "PR", feedback: "Forums can provide awareness of the landscape, but the information should never replace individualized medical guidance." },
    ],
  },
];

/* ── COMPONENT ── */

export default function PeptideQuiz25() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "email" | "results">("intro");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId → choiceIndex
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  /* ── Scoring ── */
  const scores = useMemo(() => {
    const dims: Record<string, { earned: number; possible: number }> = {};
    Object.keys(DIMENSIONS).forEach(d => { dims[d] = { earned: 0, possible: 0 }; });

    Object.entries(answers).forEach(([qIdStr, choiceIdx]) => {
      const q = QUESTIONS[parseInt(qIdStr)];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      dims[q.dimension].earned += choice.points;
      dims[q.dimension].possible += 4;
    });

    return dims;
  }, [answers]);

  const totalScore = useMemo(() => {
    const earned = Object.values(scores).reduce((s, d) => s + d.earned, 0);
    const possible = Object.values(scores).reduce((s, d) => s + d.possible, 0);
    return possible > 0 ? Math.round((earned / possible) * 100) : 0;
  }, [scores]);

  const profile = useMemo(() => {
    return PROFILES.find(p => totalScore >= p.range[0] && totalScore <= p.range[1]) || PROFILES[PROFILES.length - 1];
  }, [totalScore]);

  /* ── Handlers ── */
  const handleSelect = useCallback((choiceIdx: number) => {
    if (showFeedback) return;
    setSelectedChoice(choiceIdx);
    setShowFeedback(true);
    setAnswers(prev => ({ ...prev, [currentQ]: choiceIdx }));
  }, [showFeedback, currentQ]);

  const handleNext = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setPhase("email");
    }
  }, [currentQ]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setEmailSubmitted(true);
    setPhase("results");
  };

  const handleSkipEmail = () => {
    setPhase("results");
  };

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + (showFeedback ? 1 : 0)) / QUESTIONS.length) * 100;

  /* ── Dimension bar chart for results ── */
  const DimensionBar = ({ dim, data }: { dim: string; data: { earned: number; possible: number } }) => {
    const pct = data.possible > 0 ? Math.round((data.earned / data.possible) * 100) : 0;
    const d = DIMENSIONS[dim];
    const barColor = pct >= 80 ? "#2E7D32" : pct >= 60 ? "#1565C0" : pct >= 40 ? "#F9A825" : pct >= 20 ? "#E65100" : "#B71C1C";
    return (
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#5A5540", letterSpacing: "0.04em" }}>
            {d.icon} {d.label}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", fontWeight: 700, color: barColor }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: "8px", background: "rgba(139,105,20,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: "4px",
            transition: "width 1s ease-out",
          }} />
        </div>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem", color: "#8B8070", marginTop: "0.2rem" }}>
          {d.description}
        </p>
      </div>
    );
  };

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      {/* FDA Shutdown Banner */}
      <div style={{ background: "linear-gradient(90deg, #1a0a0a 0%, #2a0a0a 50%, #1a0a0a 100%)", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(220, 38, 38, 0.3)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626", fontWeight: 700 }}>MARCH 2026</span>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#fca5a5" }}>Peptide Sciences shut down by FDA. <Link href="/rip-peptide-sciences" style={{ color: "#dc2626", textDecoration: "underline", fontWeight: 600 }}>Full breakdown &rarr;</Link></span>
        </div>
      </div>

      <SEO
        title="Peptide Consumer Literacy Quiz — 25 Questions"
        description="Test your peptide knowledge across 5 dimensions: Science Literacy, Red Flag Detection, Provider Evaluation, Regulatory Awareness, and Personal Risk Assessment."
        path="/quiz_25q"
        indexable={true}
      />

      {/* ── INTRO PHASE ── */}
      {phase === "intro" && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(3rem, 8vw, 6rem) 1.5rem" }}>
          {/* Glassmorphic Hero Image */}
          <div className="glitch-hero" style={{
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "2.5rem",
            boxShadow: "0 8px 40px rgba(139,105,20,0.15), 0 0 80px rgba(139,105,20,0.05)",
          }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/peptide-hero-quiz-7vdCSZEoxD7WaxFumSRhqx.webp"
              alt=""
              style={{ width: "100%", height: "auto", display: "block", filter: "brightness(0.85) contrast(1.1)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(139,105,20,0.12) 100%)", backdropFilter: "blur(0.5px)" }} />
            <div className="glitch-hero-scanlines" />
            <div className="glitch-hero-tear" />
          </div>

          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#8B6914",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}>
              PEPTIDE TRUTH SYSTEM
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}>
              How Well Do You Actually<br />
              Understand Peptides?
            </h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.15rem",
              color: "#5A5540",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto",
            }}>
              25 questions. 5 scoring dimensions. One honest assessment of whether
              you have the knowledge to make safe peptide decisions — or whether
              the industry is about to take advantage of you.
            </p>
          </div>

          {/* Dimension preview */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}>
            {Object.entries(DIMENSIONS).map(([key, dim]) => (
              <div key={key} style={{
                padding: "1.2rem",
                background: "#fff",
                borderRadius: "6px",
                border: "1px solid rgba(139,105,20,0.12)",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{dim.icon}</div>
                <h3 style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.04em",
                  color: "#8B6914",
                  marginBottom: "0.3rem",
                }}>{dim.label}</h3>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.82rem",
                  color: "#8B8070",
                  lineHeight: 1.5,
                }}>{dim.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}>
            {[
              { label: "QUESTIONS", value: "25" },
              { label: "DIMENSIONS", value: "5" },
              { label: "MINUTES", value: "8-12" },
              { label: "PROFILES", value: "5" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#8B6914",
                }}>{s.value}</div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  color: "#8B8070",
                }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div style={{
            padding: "1.2rem 1.5rem",
            background: "rgba(183,28,28,0.04)",
            border: "1px solid rgba(183,28,28,0.15)",
            borderRadius: "6px",
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.88rem",
              color: "#5A5540",
              lineHeight: 1.6,
            }}>
              <strong style={{ color: "#B71C1C" }}>Fair warning:</strong> This quiz is designed to be difficult.
              The peptide industry profits from consumer ignorance. If you score below 50%, that is not a
              personal failing — it means the system is working as designed to keep you uninformed. The
              purpose of this quiz is to change that.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setPhase("quiz")}
              style={{
                padding: "1rem 3rem",
                background: "#8B6914",
                color: "#FAFAF7",
                border: "none",
                borderRadius: "4px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              BEGIN THE QUIZ →
            </button>
          </div>

          {/* Legal */}
          <div style={{
            marginTop: "3rem",
            padding: "1rem",
            borderTop: "1px solid rgba(139,105,20,0.1)",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              color: "#B0A890",
              textAlign: "center",
              lineHeight: 1.6,
            }}>
          {/* BioChain CTA */}
          <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <BioChainCTA variant="both" context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate." />
          </div>
              This quiz is for educational purposes only and does not constitute medical advice.
              All questions are based on publicly available FDA communications, peer-reviewed literature,
              and established medical standards. Protected under Fair Comment doctrine.
              {" "}<Link href="/peptide-matrix" style={{ color: "#8B6914" }}>View our methodology →</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── QUIZ PHASE ── */}
      {phase === "quiz" && q && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) 1.5rem" }}>
          {/* Progress bar */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                color: "#8B8070",
              }}>
                QUESTION {currentQ + 1} OF {QUESTIONS.length}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                color: "#8B6914",
              }}>
                {DIMENSIONS[q.dimension].icon} {DIMENSIONS[q.dimension].label}
              </span>
            </div>
            <div style={{ height: "4px", background: "rgba(139,105,20,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                borderRadius: "2px",
                transition: "width 0.5s ease-out",
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.35,
              marginBottom: "0.6rem",
            }}>
              {q.stem}
            </h2>
            {q.context && (
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.9rem",
                color: "#8B8070",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}>
                {q.context}
              </p>
            )}
            {q.citation && (
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem",
                color: "#B0A890",
                marginTop: "0.3rem",
              }}>
                Source: {q.citation}
              </p>
            )}
          </div>

          {/* Choices */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "2rem" }}>
            {q.choices.map((choice, idx) => {
              const isSelected = selectedChoice === idx;
              const isCorrect = choice.correct;
              let borderColor = "rgba(139,105,20,0.15)";
              let bgColor = "#fff";

              if (showFeedback) {
                if (isCorrect) {
                  borderColor = "#2E7D32";
                  bgColor = "rgba(46,125,50,0.04)";
                } else if (isSelected && !isCorrect) {
                  borderColor = "#B71C1C";
                  bgColor = "rgba(183,28,28,0.04)";
                }
              } else if (isSelected) {
                borderColor = "#8B6914";
                bgColor = "rgba(139,105,20,0.04)";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showFeedback}
                  style={{
                    padding: "1rem 1.2rem",
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: "6px",
                    textAlign: "left",
                    cursor: showFeedback ? "default" : "pointer",
                    transition: "all 0.2s",
                    opacity: showFeedback && !isSelected && !isCorrect ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: showFeedback && isCorrect ? "#2E7D32" : showFeedback && isSelected ? "#B71C1C" : "#8B6914",
                      minWidth: "1.5rem",
                      marginTop: "0.15rem",
                    }}>
                      {showFeedback && isCorrect ? "✓" : showFeedback && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + idx)}
                    </span>
                    <div>
                      <p style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        color: "#1A1A1A",
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        {choice.text}
                      </p>
                      {showFeedback && (isSelected || isCorrect) && (
                        <p style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.82rem",
                          color: isCorrect ? "#2E7D32" : "#B71C1C",
                          lineHeight: 1.5,
                          marginTop: "0.5rem",
                          fontStyle: "italic",
                        }}>
                          {choice.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {showFeedback && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleNext}
                style={{
                  padding: "0.85rem 2.5rem",
                  background: "#8B6914",
                  color: "#FAFAF7",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                {currentQ < QUESTIONS.length - 1 ? "NEXT QUESTION →" : "SEE MY RESULTS →"}
              </button>
              <div style={{ marginTop: "0.8rem" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  color: "#B0A890",
                }}>
                  +{q.choices[selectedChoice!]?.points || 0} / 4 points ({DIMENSIONS[q.dimension].label})
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EMAIL GATE PHASE ── */}
      {phase === "email" && (
        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "clamp(4rem, 10vw, 8rem) 1.5rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>📊</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1.2,
            marginBottom: "0.8rem",
          }}>
            Your Results Are Ready
          </h2>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            color: "#5A5540",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}>
            Enter your email to receive your full literacy report with dimension-by-dimension
            breakdown, personalized risk profile, and actionable recommendations.
          </p>
          <form onSubmit={handleEmailSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                padding: "0.85rem 1rem",
                borderRadius: "4px",
                border: "1px solid rgba(139,105,20,0.25)",
                background: "#fff",
                color: "#1A1A1A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.88rem",
                outline: "none",
                minHeight: "48px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.85rem 1.5rem",
                background: "#8B6914",
                color: "#FAFAF7",
                border: "none",
                borderRadius: "4px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
                minHeight: "48px",
                whiteSpace: "nowrap",
              }}
            >
              GET MY REPORT
            </button>
          </form>
          <button
            onClick={handleSkipEmail}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#B0A890",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Skip — show me my results without email
          </button>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.62rem",
            color: "#B0A890",
            marginTop: "1.5rem",
          }}>
            We respect your privacy. Your results and email are never shared or sold.
          </p>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === "results" && profile && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(3rem, 8vw, 5rem) 1.5rem" }}>
          {/* Score header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#8B6914",
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}>
              YOUR PEPTIDE LITERACY SCORE
            </p>
            <div style={{
              fontSize: "4rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: profile.color,
              lineHeight: 1,
              marginBottom: "0.3rem",
            }}>
              {totalScore}%
            </div>
            <div style={{
              display: "inline-block",
              padding: "0.4rem 1.2rem",
              background: `${profile.color}15`,
              border: `1px solid ${profile.color}30`,
              borderRadius: "20px",
              marginBottom: "0.6rem",
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: profile.color,
                letterSpacing: "0.05em",
              }}>
                {profile.icon} {profile.name}
              </span>
            </div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontStyle: "italic",
              color: "#5A5540",
            }}>
              {profile.tagline}
            </p>
          </div>

          {/* Risk level badge */}
          <div style={{
            textAlign: "center",
            marginBottom: "2.5rem",
          }}>
            <span style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              background: profile.riskLevel === "CRITICAL" ? "rgba(183,28,28,0.08)" :
                profile.riskLevel === "HIGH" ? "rgba(230,81,0,0.08)" :
                profile.riskLevel === "MODERATE" ? "rgba(249,168,37,0.08)" :
                profile.riskLevel === "LOW" ? "rgba(21,101,192,0.08)" : "rgba(46,125,50,0.08)",
              border: `1px solid ${profile.color}30`,
              borderRadius: "4px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: profile.color,
            }}>
              RISK LEVEL: {profile.riskLevel}
            </span>
          </div>

          {/* Profile description */}
          <div style={{
            padding: "1.5rem 2rem",
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid rgba(139,105,20,0.12)",
            marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "#3A3530",
              lineHeight: 1.7,
            }}>
              {profile.description}
            </p>
          </div>

          {/* Dimension breakdown */}
          <div style={{
            padding: "1.5rem 2rem",
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid rgba(139,105,20,0.12)",
            marginBottom: "2.5rem",
          }}>
            <h3 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              color: "#8B6914",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}>
              DIMENSION BREAKDOWN
            </h3>
            {Object.entries(scores).map(([dim, data]) => (
              <DimensionBar key={dim} dim={dim} data={data} />
            ))}
          </div>

          {/* Recommendations */}
          <div style={{
            padding: "1.5rem 2rem",
            background: `${profile.color}08`,
            borderRadius: "6px",
            border: `1px solid ${profile.color}20`,
            marginBottom: "2.5rem",
          }}>
            <h3 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              color: profile.color,
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}>
              RECOMMENDATIONS FOR YOU
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {profile.recommendations.map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: profile.color,
                    fontWeight: 700,
                    minWidth: "1.2rem",
                    marginTop: "0.15rem",
                  }}>
                    {i + 1}.
                  </span>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "#3A3530",
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-links to peptide system */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}>
            {[
              { href: "/peptide-matrix", icon: "📊", title: "Evidence Matrix", desc: "See where providers fall on the Review vs. Evidence grid" },
              { href: "/peptide-hall-of-shame", icon: "🏚️", title: "Hall of Shame", desc: "Ranked assessment of 20 US peptide clinic questionnaires" },
              { href: "/peptide-supply-chain", icon: "💰", title: "Follow the Dollar", desc: "Where your money actually goes when you buy peptides" },
              { href: "/find-your-peptide", icon: "🧬", title: "Peptide Clarity Index", desc: "Find which peptides match your actual clinical needs" },
              { href: "/peptide-watch", icon: "🛡️", title: "PeptideWatch Safety Guide", desc: "12 fraud patterns, vendor scorecard, role-based safety checklists" },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  padding: "1.2rem",
                  background: "#fff",
                  borderRadius: "6px",
                  border: "1px solid rgba(139,105,20,0.12)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{link.icon}</div>
                <h4 style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  color: "#8B6914",
                  marginBottom: "0.3rem",
                }}>{link.title}</h4>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.82rem",
                  color: "#8B8070",
                  lineHeight: 1.4,
                  margin: 0,
                }}>{link.desc}</p>
              </Link>
            ))}
          </div>

          {/* Retake */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button
              onClick={() => {
                setPhase("intro");
                setCurrentQ(0);
                setAnswers({});
                setSelectedChoice(null);
                setShowFeedback(false);
                setEmail("");
                setEmailSubmitted(false);
                window.scrollTo(0, 0);
              }}
              style={{
                padding: "0.85rem 2rem",
                background: "transparent",
                border: "1px solid rgba(139,105,20,0.25)",
                borderRadius: "4px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                color: "#8B6914",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="peptide"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ peptide: profile?.name })}
              totalScore={null}
            />

              RETAKE THE QUIZ
            </button>
          </div>

          {/* Legal */}
          <div style={{
            padding: "1rem",
            borderTop: "1px solid rgba(139,105,20,0.1)",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              color: "#B0A890",
              textAlign: "center",
              lineHeight: 1.6,
            }}>
          {/* BioChain CTA */}
          <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <BioChainCTA variant="both" context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate." />
          </div>
              This quiz is for educational purposes only and does not constitute medical advice.
              All questions are based on publicly available FDA communications, peer-reviewed literature,
              and established medical standards. Protected under Fair Comment doctrine.
              If you believe any information is inaccurate, please{" "}
              <a href="mailto:t@ramprate.com" style={{ color: "#8B6914" }}>submit a correction</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
