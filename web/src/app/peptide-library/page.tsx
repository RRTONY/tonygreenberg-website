import type { Metadata } from "next";
import Link from "next/link";
import { PeptideShutdownBanner } from "@/components/marketing/peptide-shutdown-banner";
import { BioChainCTA } from "@/components/marketing/biochain-cta";
import { PeptideLibraryList, type PeptideProfile } from "@/components/marketing/peptide-library-list";

// Ported from legacy client/src/pages/PeptideLibrary.tsx. Real content,
// unchanged — 20 real compound profiles across 8 categories (mechanism,
// safety tier, evidence score, regulatory status, pricing, stack partners,
// Oura tracking, key study, Tony's take). Legacy used an emoji per
// category; this app uses lucide-react.
export const metadata: Metadata = {
  title: "Peptide Library — Every Compound Profiled",
  description:
    "Complete peptide profiles with safety tiers, evidence scores, regulatory status, pricing, stack partners, and biomarker tracking suggestions. 20+ compounds. Zero affiliate links.",
  alternates: { canonical: "/peptide-library" },
};

const PEPTIDES: PeptideProfile[] = [
  { name: "Semaglutide", category: "metabolic", safetyTier: "green", evidence: 10, regulatoryStatus: "FDA-approved (Ozempic/Wegovy). Grey-market versions under legal pressure.", priceRange: "$120–$250 (research) / $400–$900 (Rx)", stackPartners: ["BPC-157 (GI support)", "Tirzepatide (switch, not stack)"], ouraTracking: "Resting HR, HRV, weight trend, sleep efficiency", tgTake: "Ozempic in a research vial. The economics are wild until they aren't.", mechanism: "GLP-1 receptor agonist. Reduces appetite, slows gastric emptying, improves insulin sensitivity.", keyStudy: "Wilding et al., NEJM, 2021 (STEP 1)" },
  { name: "Tirzepatide", category: "metabolic", safetyTier: "yellow", evidence: 9, regulatoryStatus: "FDA-approved (Mounjaro/Zepbound). Active pharma litigation against grey-market.", priceRange: "$150–$300 (research) / $500–$1,200 (Rx)", stackPartners: ["BPC-157 (GI tolerance)", "Thymosin Alpha-1 (immune support)"], ouraTracking: "Weight trend, resting HR, activity score, sleep latency", tgTake: "Genuinely effective. The legal situation is genuinely complicated. Both things are true.", mechanism: "Dual GIP/GLP-1 receptor agonist. Superior weight loss and metabolic outcomes vs. semaglutide in head-to-head trials.", keyStudy: "Jastreboff et al., NEJM, 2022 (SURMOUNT-1)" },
  { name: "Retatrutide", category: "metabolic", safetyTier: "yellow", evidence: 9, regulatoryStatus: "Investigational. Phase 3 complete. BLA submission to FDA planned Q1 2027. Analyst consensus on approval: late 2027 or early 2028. Not approved in any jurisdiction. Research-only.", priceRange: "$200–$450 (research) / N/A (Rx)", stackPartners: ["BPC-157 (GI support)", "Selank (appetite anxiety)"], ouraTracking: "Weight trend, body temperature, HRV, activity calories, dysesthesia monitoring", tgTake: "Phase 3 is done. TRIUMPH-1: 28.3% mean weight loss at 80 weeks on 12 mg (n=2,339), up to 30.3% at 104 weeks. TRIUMPH-4: 28.7% at 68 weeks. TRIUMPH-2 and TRIUMPH-3 both successful July 2026. The glucagon receptor arm is the differentiator — it's what pushes efficacy past tirzepatide's ~22.5%. The catch: dysesthesia (abnormal skin sensation) at 12.5% on 12 mg vs 0.9% placebo. Discontinuation in TRIUMPH-4 was 18.2% on 12 mg, but that dropped sharply when restricted to BMI ≥35 — the tolerability problem is aggressive titration in lower BMI users, not the molecule. BLA filing Q1 2027. Supply chain is still a circus but the data is no longer promising — it's definitive.", mechanism: "Triple agonist: GIP + GLP-1 + glucagon receptor (LY3437943). The glucagon arm drives incremental efficacy and a distinct adverse event signature vs. tirzepatide. No weight loss plateau observed through 40 weeks in T2D population. A1C reduction up to 2.0% in TRANSCEND-T2D-1.", keyStudy: "Jastreboff et al., NEJM, 2023 (Phase 2, 24.2% at 48 weeks); TRIUMPH-1 topline May 2026; TRIUMPH-4 topline Dec 2025" },
  { name: "BPC-157", category: "recovery", safetyTier: "yellow", evidence: 6, regulatoryStatus: "Not FDA-approved. No human trials. Widely available grey-market.", priceRange: "$45–$90 (research) / $150–$400 (Rx)", stackPartners: ["TB-500 (synergistic repair)", "GHK-Cu (skin/wound)"], ouraTracking: "Readiness score, HRV trend, recovery time after exercise", tgTake: "The most overhyped and underpriced peptide in the space. Both true at once.", mechanism: "Gastric pentadecapeptide. Promotes angiogenesis, tendon/ligament healing, GI mucosal repair.", keyStudy: "Sikiric et al., Curr Pharm Des, 2018" },
  { name: "TB-500", category: "recovery", safetyTier: "yellow", evidence: 5, regulatoryStatus: "Not FDA-approved. Research chemical. WADA banned.", priceRange: "$60–$120 (research) / $200–$500 (Rx)", stackPartners: ["BPC-157 (synergistic)", "GHK-Cu (wound healing)"], ouraTracking: "Recovery time, readiness score, resting HR post-injury", tgTake: "The repair peptide that athletes whisper about. WADA ban tells you it works.", mechanism: "Thymosin Beta-4 fragment. Promotes cell migration, blood vessel formation, tissue repair.", keyStudy: "Malinda et al., J Invest Dermatol, 1999" },
  { name: "SS-31 (Elamipretide)", category: "mitochondrial", safetyTier: "yellow", evidence: 5, regulatoryStatus: "Experimental. Failed FDA approval for Barth syndrome. Research-only.", priceRange: "$80–$180 (research) / N/A (Rx)", stackPartners: ["MOTS-c (metabolic synergy)", "Epithalon (longevity stack)"], ouraTracking: "HRV, body temperature stability, readiness score, VO2 proxy", tgTake: "The biohacker's bet on the mitochondria hypothesis. I'm watching the data.", mechanism: "Mitochondrial membrane protector. Stabilizes cardiolipin, reduces ROS, improves ATP production.", keyStudy: "Szeto, Br J Pharmacol, 2014" },
  { name: "MOTS-c", category: "mitochondrial", safetyTier: "yellow", evidence: 5, regulatoryStatus: "Experimental. No FDA pathway. Research-only.", priceRange: "$90–$200 (research) / N/A (Rx)", stackPartners: ["SS-31 (mitochondrial synergy)", "Epithalon (longevity)", "CJC-1295/Ipamorelin (GH support)"], ouraTracking: "Activity score, VO2 proxy, body temperature, metabolic markers", tgTake: "If the mitochondria are the powerhouse of the cell, MOTS-c is the after-hours maintenance crew.", mechanism: "Mitochondria-derived peptide. Regulates metabolic homeostasis, enhances exercise capacity, insulin sensitivity.", keyStudy: "Lee et al., Cell Metab, 2015" },
  { name: "Humanin", category: "mitochondrial", safetyTier: "yellow", evidence: 4, regulatoryStatus: "Experimental. No FDA pathway. Very limited availability.", priceRange: "$100–$250 (research) / N/A (Rx)", stackPartners: ["MOTS-c (mitochondrial)", "SS-31 (membrane protection)", "Epithalon (telomere)"], ouraTracking: "HRV trend, sleep efficiency, cognitive readiness", tgTake: "Promising. Underfunded. The longevity stack most people haven't heard of.", mechanism: "Cytoprotection, neuroprotection, insulin sensitivity. Mitochondria-derived peptide with anti-apoptotic properties.", keyStudy: "Hashimoto et al., PNAS, 2001" },
  { name: "Epithalon", category: "longevity", safetyTier: "yellow", evidence: 5, regulatoryStatus: "Not FDA-approved. Russian research origin. Grey-market.", priceRange: "$60–$120 (research) / N/A (Rx)", stackPartners: ["MOTS-c (metabolic longevity)", "Thymosin Alpha-1 (immune)", "GHK-Cu (skin aging)"], ouraTracking: "Sleep efficiency, HRV long-term trend, biological age markers", tgTake: "Longevity stack workhorse. Inexpensive. The telomerase data is intriguing if you believe the Russian studies.", mechanism: "Synthetic tetrapeptide. Activates telomerase, extends telomeres, regulates melatonin production.", keyStudy: "Khavinson et al., Bull Exp Biol Med, 2003" },
  { name: "Semax", category: "cognitive", safetyTier: "green", evidence: 7, regulatoryStatus: "Approved in Russia. Not FDA-approved. Available grey-market.", priceRange: "$40–$80 (research) / N/A (Rx)", stackPartners: ["Selank (anxiolytic synergy)", "CJC-1295/Ipamorelin (neuroplasticity)"], ouraTracking: "Cognitive readiness, sleep REM %, HRV morning", tgTake: "Russian nootropic with actual clinical data. Intranasal. Works fast. No crash.", mechanism: "Synthetic ACTH(4-10) analog. Upregulates BDNF, enhances attention, memory, and neuroprotection.", keyStudy: "Uchida et al., Behav Brain Res, 2017" },
  { name: "Selank", category: "cognitive", safetyTier: "green", evidence: 6, regulatoryStatus: "Approved in Russia. Not FDA-approved. Available grey-market.", priceRange: "$35–$70 (research) / N/A (Rx)", stackPartners: ["Semax (cognitive synergy)", "BPC-157 (gut-brain axis)"], ouraTracking: "HRV, stress resilience score, sleep latency, REM %", tgTake: "The anxiolytic peptide that doesn't make you stupid. Rare combination.", mechanism: "Tuftsin analog. Anxiolytic, nootropic, and immunomodulatory via GABA and serotonin modulation.", keyStudy: "Zozulya et al., Regul Pept, 2001" },
  { name: "Dihexa", category: "cognitive", safetyTier: "yellow", evidence: 6, regulatoryStatus: "Experimental. No human trials. Research-only. Handle with caution.", priceRange: "$80–$150 (research) / N/A (Rx)", stackPartners: ["Semax (neuroprotection)", "Epithalon (longevity)", "Selank (anxiolytic balance)"], ouraTracking: "Cognitive readiness, sleep quality, HRV trend", tgTake: "The most interesting cognitive peptide nobody talks about. The 'limited human data' caveat is real and important.", mechanism: "Angiotensin IV analog. 7x more potent than BDNF at promoting synaptogenesis via HGF/c-Met pathway.", keyStudy: "McCoy et al., J Pharmacol Exp Ther, 2013" },
  { name: "Cerebrolysin", category: "cognitive", safetyTier: "yellow", evidence: 7, regulatoryStatus: "Approved in Europe/Asia. Not FDA-approved. IV administration only.", priceRange: "$100–$300 (research) / N/A (Rx in US)", stackPartners: ["Semax (nootropic)", "BPC-157 (neuroprotection)"], ouraTracking: "Cognitive readiness, sleep architecture, HRV recovery", tgTake: "Decades of European data. Underutilized in the US because it's injectable and not profitable for anyone.", mechanism: "Neuropeptide complex derived from porcine brain. TBI recovery, stroke rehabilitation, Alzheimer's research.", keyStudy: "Bornstein et al., J Neural Transm, 2018" },
  { name: "P21", category: "cognitive", safetyTier: "red", evidence: 3, regulatoryStatus: "Experimental. Minimal research. Very limited availability.", priceRange: "$120–$250 (research) / N/A (Rx)", stackPartners: ["Semax (established nootropic)", "Selank (anxiolytic)"], ouraTracking: "Cognitive readiness, sleep quality", tgTake: "Interesting in theory. Underbaked in practice. Wait for more data.", mechanism: "CNTF (ciliary neurotrophic factor) analogue. Promotes neurogenesis. Tiny research base.", keyStudy: "Limited preclinical data only" },
  { name: "Thymosin Alpha-1", category: "immune", safetyTier: "green", evidence: 8, regulatoryStatus: "Approved in 35+ countries (Zadaxin). Not FDA-approved in US.", priceRange: "$70–$150 (research) / $300–$700 (Rx)", stackPartners: ["BPC-157 (gut-immune axis)", "LL-37 (antimicrobial)"], ouraTracking: "Readiness score, body temperature, HRV during illness", tgTake: "The immune peptide with actual global clinical use. Approved in 35 countries. The US just isn't one of them.", mechanism: "Thymic peptide. Modulates T-cell function, enhances NK cell activity, restores immune balance.", keyStudy: "Tuthill et al., Ann NY Acad Sci, 2010" },
  { name: "KPV", category: "immune", safetyTier: "green", evidence: 5, regulatoryStatus: "Not FDA-approved. Research chemical. Oral and injectable forms.", priceRange: "$40–$90 (research) / N/A (Rx)", stackPartners: ["BPC-157 (gut repair)", "LL-37 (antimicrobial)", "Thymosin Alpha-1 (immune)"], ouraTracking: "Readiness score, body temperature, sleep quality during flares", tgTake: "Underrated. If you have gut issues and haven't looked at KPV, look at KPV.", mechanism: "Alpha-MSH fragment. Potent anti-inflammatory for gut and skin. IBD applications.", keyStudy: "Brzoska et al., Ann NY Acad Sci, 2008" },
  { name: "LL-37", category: "immune", safetyTier: "yellow", evidence: 5, regulatoryStatus: "Not FDA-approved. Research chemical. Limited availability.", priceRange: "$60–$130 (research) / N/A (Rx)", stackPartners: ["Thymosin Alpha-1 (immune modulation)", "BPC-157 (tissue repair)", "KPV (anti-inflammatory)"], ouraTracking: "Body temperature, readiness during infection, HRV", tgTake: "Your body already makes this. The question is whether the exogenous version helps. Preliminary evidence: yes.", mechanism: "Host defense peptide. Broad-spectrum antimicrobial, wound healing, immune modulation.", keyStudy: "Vandamme et al., Cell Immunol, 2012" },
  { name: "PT-141 (Bremelanotide)", category: "sexual", safetyTier: "green", evidence: 8, regulatoryStatus: "FDA-approved (Vyleesi). Also available grey-market.", priceRange: "$50–$100 (research) / $200–$400 (Rx)", stackPartners: ["CJC-1295/Ipamorelin (vitality)", "Selank (anxiety reduction)"], ouraTracking: "Resting HR (acute response), sleep quality", tgTake: "FDA-approved for a reason. Works differently than PDE5 inhibitors. Central mechanism.", mechanism: "Melanocortin receptor agonist. Acts on CNS to increase sexual desire and arousal.", keyStudy: "Kingsberg et al., Obstet Gynecol, 2019" },
  { name: "GHK-Cu", category: "cosmetic", safetyTier: "green", evidence: 6, regulatoryStatus: "Not FDA-approved as drug. Available as cosmetic ingredient and research peptide.", priceRange: "$25–$60 (research) / N/A (Rx)", stackPartners: ["BPC-157 (wound healing)", "TB-500 (tissue repair)", "Matrixyl 3000 (collagen)"], ouraTracking: "Skin temperature, readiness (wound healing context)", tgTake: "The copper peptide that actually has data. Topical and injectable. Very cheap for what it does.", mechanism: "Copper-binding tripeptide. Stimulates collagen, elastin, glycosaminoglycans. Wound healing and anti-aging.", keyStudy: "Pickart et al., Int J Mol Sci, 2015" },
  { name: "Matrixyl 3000", category: "cosmetic", safetyTier: "green", evidence: 5, regulatoryStatus: "Cosmetic ingredient. No prescription needed. Topical only.", priceRange: "$20–$50 (topical products)", stackPartners: ["GHK-Cu (collagen synergy)", "Vitamin C (antioxidant)"], ouraTracking: "N/A (topical cosmetic)", tgTake: "The most boring peptide on this list and also the one your dermatologist is least likely to argue with.", mechanism: "Palmitoyl Tetrapeptide-7. Stimulates collagen production. Anti-aging. Topical use only.", keyStudy: "Robinson et al., Int J Cosmet Sci, 2005" },
  { name: "CJC-1295 + Ipamorelin", category: "longevity", safetyTier: "yellow", evidence: 7, regulatoryStatus: "Not FDA-approved. Available via compounding pharmacies and grey-market.", priceRange: "$80–$160 (research) / $250–$600 (Rx)", stackPartners: ["BPC-157 (recovery)", "Semax (cognitive)", "Epithalon (longevity)"], ouraTracking: "Deep sleep %, HRV, recovery score, body temperature", tgTake: "The stack that made peptides mainstream. Pricing reflects that.", mechanism: "Synergistic GH secretagogue stack. CJC-1295 extends GH release; Ipamorelin triggers clean GH pulse without cortisol/prolactin increase.", keyStudy: "Teichman et al., J Clin Endocrinol Metab, 2006" },
];

export default function PeptideLibraryPage() {
  return (
    <div>
      <PeptideShutdownBanner />

      <section className="bg-[#0A0A10] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C84B2A] uppercase">
            Compound Profiles · May 2026
          </p>
          <h1 className="mb-5 font-heading text-4xl leading-tight font-bold sm:text-5xl">
            The Complete <span className="text-brand-gold-light">Peptide Library</span>
          </h1>
          <p className="mb-4 max-w-2xl leading-relaxed text-zinc-300">
            Every compound profiled with safety tier, evidence quality, regulatory status,
            pricing, suggested stacks, and what to track on your Oura Ring. No affiliate links.
            No vendor partnerships. Just data.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold-light">{PEPTIDES.length}</div>
              <div className="text-xs tracking-wide text-zinc-400 uppercase">Compounds</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold-light">8</div>
              <div className="text-xs tracking-wide text-zinc-400 uppercase">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold-light">0</div>
              <div className="text-xs tracking-wide text-zinc-400 uppercase">Affiliate Links</div>
            </div>
          </div>
        </div>
      </section>

      <PeptideLibraryList peptides={PEPTIDES} />

      <div className="mx-auto max-w-2xl px-6">
        <BioChainCTA
          variant="both"
          context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />
      </div>

      <section className="bg-secondary px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          <Link href="/find-your-peptide" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Find Your Peptide (Quiz)
          </Link>
          <Link href="/price-tracker" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Price Tracker
          </Link>
          <Link href="/whats-legal" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            What&apos;s Legal
          </Link>
          <Link href="/verify-your-coa" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Verify Your COA
          </Link>
          <Link href="/test-your-peptides" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Test Your Peptides
          </Link>
          <Link href="/peptide-watch" className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium">
            Peptide Watchdog
          </Link>
        </div>
      </section>
    </div>
  );
}
