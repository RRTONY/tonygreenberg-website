/**
 * PeptideWatch — The Definitive Consumer Safety Guide
 * All data extracted from the March 2026 PeptideWatch HTML document.
 */

export const HERO_STATS = [
  { num: "50+", label: "FDA Warning Letters 2024\u201325" },
  { num: "$328M", label: "Gray-Market Imports 2025" },
  { num: "5,930", label: "Independent Tests (Finnrick)" },
  { num: "10+", label: "Major Vendors Shut Down" },
];

export const MARKETS = [
  {
    num: "01",
    title: "Real Pharma",
    desc: "FDA-regulated manufacturing, licensed compounding, validated testing, traceability, boring paperwork, and fewer surprises. Safe. Expensive. Getting harder to access.",
    color: "cobalt" as const,
  },
  {
    num: "02",
    title: "Wellness Gray Market",
    desc: "Clinics, telehealth sellers, med spas, online peptide brands \u2014 wrapping questionable sourcing in luxury language and white coats. Mixed risk. Often deceptive.",
    color: "saffron" as const,
  },
  {
    num: "03",
    title: "Feral Underbelly",
    desc: "Research-use labeling games, counterfeit injectables, fake COAs, offshore sourcing with invisible chain of custody, and sales funnels designed to remove every safety checkpoint. This is where monsters breed.",
    color: "terracotta" as const,
  },
];

export interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
}

export const TIMELINE: TimelineEvent[] = [
  { date: "March 2024", title: "Eli Lilly ITC Complaint", desc: "Lilly filed against 12 vendors selling tirzepatide \u2014 named respondents include Strate Labs, Arctic Peptides, Triggered Brand, Swiss Chems, Paradigm Peptides, GenX Peptides, and others." },
  { date: "November 2024", title: "BPC-157 Added to \u201CDo Not Compound\u201D List", desc: "FDA determines BPC-157 lacks sufficient safety and efficacy data, effectively banning both 503A and 503B compounders from producing it." },
  { date: "November 2024", title: "Massachusetts Med Spa Counterfeit Injections Charged", desc: "DOJ: med spa owner charged with importing counterfeit Botox, Sculptra, and Juvederm from China and Brazil, administering thousands of injections over three-plus years." },
  { date: "December 2024", title: "FDA Warning Letters Roundup", desc: "Prime Peptides, Xcel Peptides/Xcel Research, SwissChems, Summit Research Peptides, and Veronvy all named. Veronvy also offered oral GLP-1 products and claimed FDA approval." },
  { date: "December 2024", title: "Tirzepatide Shortage Resolved", desc: "FDA removes tirzepatide from national shortage list (Dec. 19). Compounding legal exception begins closing. Market scramble begins." },
  { date: "February 2025", title: "Semaglutide Shortage Resolved", desc: "FDA declares semaglutide shortage officially resolved. Legal justification for generic compounding eliminated for both GLP-1 compounds." },
  { date: "February 2025", title: "USApeptide.com Warning Letter", desc: "FDA issues warning for unapproved and misbranded semaglutide and tirzepatide sold online despite \u201Cresearch use only\u201D labeling." },
  { date: "February 2026", title: "Peaks Curative Warning Letter", desc: "FDA cites false claims of FDA approval, misleading \u201Csame as Ozempic\u201D language, and falsely implying the site was the compounder of record." },
  { date: "June 2025", title: "Amino Asylum Warehouse Raided", desc: "FDA agents raid Amino Asylum warehouse, forcing one of the largest vendors offline overnight." },
  { date: "September 2025", title: "50+ Warning Letters Issued", desc: "FDA issues more than 50 warning letters to GLP-1 compounders and telehealth providers for misleading \u201Csame active ingredient\u201D and \u201Cclinically proven\u201D claims. Novo Nordisk and Eli Lilly both received letters for their own advertising practices." },
  { date: "September 2025", title: "Green List Import Alert Launched", desc: "FDA launches worldwide Green List import alert targeting illicit GLP-1 APIs. Authorizes detention of shipments from foreign manufacturers unless on vetted supplier list." },
  { date: "December 2025", title: "Paradigm Peptides \u2014 Guilty Pleas", desc: "Founders Matthew Kawa and Jennifer Stechkober enter guilty pleas. Products labeled as SARMs were found to contain testosterone, a controlled substance. Products included peptides, hCG, and SARMs sold to thousands of customers nationwide." },
  { date: "Early 2026", title: "SAFE Drugs Act", desc: "New legislation prohibits selling research chemicals biologically identical to FDA-approved drugs without a New Drug Application. The \u201Cresearch use only\u201D shield is now legally dead." },
  { date: "February 2026", title: "RFK Jr. Restores 14 Peptides to Category 1", desc: "HHS Secretary Kennedy announces approximately 14 of 19 previously restricted peptides moved back to Category 1, restoring compounding pharmacy access with a physician\u2019s prescription." },
  { date: "March 6, 2026", title: "Peptide Sciences Shuts Down", desc: "The largest U.S. research peptide vendor \u2014 $7.45M in December 2025 sales alone \u2014 voluntarily closes with three sentences and no transition plan. Finnrick testing had flagged retatrutide (E rating, 37 samples, counterfeit detected) and CJC-1295 (E rating, 4.3/10). The old model is over." },
];

export interface WallOfShameEntry {
  vendor: string;
  badges: Array<{ label: string; type: "fda" | "doj" | "ftc" | "itc" | "state" | "closed" | "nad" }>;
  violation: string;
  status: string;
}

export const WALL_OF_SHAME: WallOfShameEntry[] = [
  { vendor: "Peptide Sciences", badges: [{ label: "Closed", type: "closed" }], violation: "Finnrick testing revealed E rating on retatrutide (counterfeit detected) and CJC-1295. Voluntary shutdown March 6, 2026 ahead of enforcement.", status: "Gone" },
  { vendor: "Paradigm Peptides", badges: [{ label: "DOJ", type: "doj" }], violation: "Products labeled as SARMs contained testosterone (controlled substance). Unapproved peptides, hCG, SARMs sold nationwide. Founders entered guilty pleas Dec. 2025.", status: "Closed / Convicted" },
  { vendor: "All American Peptide", badges: [{ label: "DOJ", type: "doj" }], violation: "$3M+ scheme distributing misbranded and unapproved drugs including peptides and performance-enhancing drugs. Owners admitted guilt.", status: "Convicted" },
  { vendor: "Tailor Made Compounding", badges: [{ label: "DOJ", type: "doj" }], violation: "Guilty plea for distributing unapproved drugs including BPC-157. $1.79M forfeiture.", status: "Convicted" },
  { vendor: "Xcel Peptides / Xcel Research", badges: [{ label: "FDA", type: "fda" }], violation: "Warning letter Dec. 2024. Multiple peptides including retatrutide, cagrilintide, semaglutide, sermorelin sold as unapproved/misbranded.", status: "Warning Issued" },
  { vendor: "Summit Research Peptides", badges: [{ label: "FDA", type: "fda" }], violation: "Warning letter Dec. 2024. Semaglutide, retatrutide, cagrilintide, tirzepatide, mazdutide offerings.", status: "Warning Issued" },
  { vendor: "Prime Peptides", badges: [{ label: "FDA", type: "fda" }], violation: "Named in Dec. 2024 FDA warning letter roundup for GLP-1 products.", status: "Warning Issued" },
  { vendor: "SwissChems", badges: [{ label: "FDA", type: "fda" }, { label: "ITC", type: "itc" }], violation: "FDA warning letter Dec. 2024. Also named in Eli Lilly ITC complaint for tirzepatide.", status: "Multiple Actions" },
  { vendor: "Veronvy", badges: [{ label: "FDA", type: "fda" }], violation: "Dec. 2024 warning. Offered oral GLP-1 products and explicitly claimed FDA approval \u2014 among the most egregious misbranding found.", status: "Warning Issued" },
  { vendor: "USApeptide.com", badges: [{ label: "FDA", type: "fda" }], violation: "Warning letter Feb. 2025. Unapproved semaglutide and tirzepatide sold online despite \u201Cresearch use only\u201D language.", status: "Warning Issued" },
  { vendor: "Peaks Curative", badges: [{ label: "FDA", type: "fda" }], violation: "Feb. 2026 warning. Called compounded semaglutide \u201CFDA-approved,\u201D claimed it was \u201Csafe, affordable, and effective,\u201D falsely implied it was the compounder.", status: "Warning Issued" },
  { vendor: "NextMed", badges: [{ label: "FTC", type: "ftc" }], violation: "2025 FTC action. Misleading prices, fake reviews, deceptive weight-loss claims, membership traps in GLP-1 programs.", status: "FTC Action" },
  { vendor: "Triggered Brand", badges: [{ label: "ITC", type: "itc" }, { label: "State", type: "state" }], violation: "Named in Lilly ITC case. Connecticut AG settlement \u2014 sold raw semaglutide/tirzepatide powders with human injection instructions, no prescriptions, no sterility controls.", status: "Ceased / Settlement" },
  { vendor: "Amino Asylum", badges: [{ label: "FDA", type: "fda" }], violation: "Warehouse raided by FDA agents June 2025. One of the largest vendors forced offline overnight.", status: "Raided" },
  { vendor: "Empower Pharmacy", badges: [{ label: "FDA", type: "fda" }], violation: "Long-running regulatory issues. Houston Chronicle reported allegations of food-grade and animal-grade ingredients used to cut costs. Empower denies wrongdoing. Litigation ongoing. Treat as documented regulatory concerns, not final adjudication.", status: "Under Scrutiny" },
  { vendor: "Willow Health Services", badges: [{ label: "NAD", type: "nad" }], violation: "Dec. 2025 NAD ruling. Multiple health claims for compounded semaglutide tablets found unsubstantiated. Referred to state and federal regulatory authorities.", status: "Referred" },
  { vendor: "Massachusetts Med Spa (unnamed)", badges: [{ label: "DOJ", type: "doj" }], violation: "Owner charged Nov. 2024 with importing counterfeit Botox, Sculptra, Juvederm from China and Brazil. Thousands of injections administered.", status: "Criminal Charges" },
  { vendor: "Strate Labs / Arctic Peptides", badges: [{ label: "ITC", type: "itc" }], violation: "Found in default by ITC. Cease and desist orders recommended by Administrative Law Judge for tirzepatide violations.", status: "ITC Order" },
];

export interface FraudPattern {
  num: string;
  title: string;
  body: string;
}

export const FRAUD_PATTERNS: FraudPattern[] = [
  { num: "01", title: "The \u201CResearch Use Only\u201D Fig Leaf", body: "The oldest carnival trick in the tent. Sellers label semaglutide, tirzepatide, retatrutide, and similar products \u201Cfor research use only\u201D or \u201Cnot for human consumption\u201D \u2014 then market them with dosing instructions, weight-loss language, and human outcome references. The SAFE Drugs Act of early 2026 effectively killed this shield. As Frier Levitt stated, the disclaimer was providing \u201Cessentially zero protection\u201D by the time Peptide Sciences closed." },
  { num: "02", title: "Fake \u201CFDA-Approved\u201D or \u201CSame as Ozempic\u201D Language", body: "Borrowing the credibility of an approved drug while selling something not approved, not bioequivalent, and not reviewed by FDA. Peaks Curative called compounded semaglutide \u201CFDA-approved.\u201D Veronvy went further \u2014 explicitly claiming FDA approval on oral GLP-1 products. More than 50 companies received FDA warning letters in September 2025 for \u201Csame active ingredient\u201D and \u201Cclinically proven\u201D claims." },
  { num: "03", title: "Hidden Prices, Fake Reviews, and Junk Marketing Math", body: "The GLP-1 ecosystem is drenched in direct-response tricks borrowed from supplement and subscription software playbooks. The FTC\u2019s 2025 action against NextMed alleged misleading prices, fake reviews, deceptive weight-loss claims, and tactics that pushed consumers into annual memberships. Operators who play games with reviews and billing typically also play games with sourcing. Different mask, same face." },
  { num: "04", title: "The Shortage-Loophole Hustle", body: "When semaglutide and tirzepatide were in shortage, compounders had legal room to operate. When shortages resolved \u2014 tirzepatide December 19, 2024; semaglutide February 21, 2025 \u2014 that room closed. What happened? A stampede. Sellers treated \u201Cshortage\u201D as \u201Cfree-for-all.\u201D State AGs noted that more than 40 states wrote to the FDA describing a national ecosystem of counterfeit, contaminated, and research-grade GLP-1s entering through unregulated channels even after the shortage window closed." },
  { num: "05", title: "Salt-Form Swaps and Chemistry Cosplay", body: "FDA has specifically warned that some compounders use semaglutide salt forms \u2014 semaglutide sodium and semaglutide acetate \u2014 which are different active ingredients from the base form used in approved drugs. FDA stated it is not aware of a basis for compounding with those salts that would meet legal conditions. Translation: some people are not selling the thing you think they are selling." },
  { num: "06", title: "Add-On Ingredient Roulette", body: "Combining peptides with B12, B6, NAD, levocarnitine, or other ingredients makes the product sound \u201Cbespoke\u201D while adding unstudied risk. FDA has stated the safety of combining semaglutide with such ingredients has not been established. Reuters reported that Eli Lilly found a previously unknown impurity in tested samples combining tirzepatide with vitamin B12 \u2014 and requested a recall of affected compounded products. This is where wellness marketing becomes kitchen chemistry with better typography." },
  { num: "07", title: "Dosing-Chaos Engineering", body: "Multiple-dose vials, concentration confusion, mg-to-units conversion games, and sloppy instructions are not innocent errors \u2014 they are structural risk multipliers. FDA received reports of dosing errors involving compounded semaglutide in multiple-dose vials. Some patients sought medical attention or required hospitalization. Reported events included nausea, vomiting, dehydration, pancreatitis, gallstones, fainting, and more. Any seller who makes dose math harder than necessary is increasing your probability of becoming a cautionary tale." },
  { num: "08", title: "Opaque Import Chains and \u201CTrust Me\u201D Sourcing", body: "U.S. peptide imports from China nearly doubled in 2025 \u2014 reaching $328M in the first nine months alone, up from $164M in 2024. Most consumers have no idea they are participating in an uncontrolled pharmaceutical experiment. FDA\u2019s internet-pharmacy warnings state plainly that buying prescription drugs from unsafe online pharmacies can be \u201Cdangerous or even deadly.\u201D If the seller cannot tell you who made it, who imported it, what lot it came from, and who tested it \u2014 you are not buying medicine. You are buying a story." },
  { num: "09", title: "COA Theater", body: "The market loves PDFs. Fraudsters know this. A COA is useful only if it is batch-specific, tied to the exact lot, issued by a real independent lab, and verifiable. Finnrick\u2019s database of 5,930 tests across 196 vendors revealed widespread gaps: quantity deviation of up to plus or minus 80% versus advertised values for some products, counterfeit detection flags, and COAs that functioned as internal quality documents rather than independent verification. A pretty COA without real chain of custody is a paper costume." },
  { num: "10", title: "Non-Pharma-Grade Ingredient Cost Cutting", body: "Houston Chronicle reporting on Empower Pharmacy described FDA records and state documents alleging use of ingredients not intended for pharmaceuticals \u2014 including \u201Cfood grade\u201D \u2014 and allegations by a former supply-chain director that adulterated and food- or animal-grade ingredients were used to cut costs. Empower denies wrongdoing and litigation is ongoing. This must be treated as allegations and documented regulatory concerns, not final adjudication. But the pattern is exactly the one consumers should fear: margin pressure turning into ingredient downgrades." },
  { num: "11", title: "Counterfeit Injection Channels", body: "Once the logic moves from \u201Cgray peptide seller\u201D to \u201Ccounterfeit injectable,\u201D the risk gets darker. The Massachusetts med spa case involved foreign sourcing, brand confusion, counterfeit injectable product, and trusting patients. State AGs identified counterfeit semaglutide imported from China, Turkey, and India being repackaged as FDA-approved products. The same supply-chain failure mode, the same extractive logic, different product labels." },
  { num: "12", title: "Straight-Up Criminal Distribution", body: "All American Peptide: $3M+ scheme, owners admitted guilt. Tailor Made Compounding: guilty plea, $1.79M forfeiture, BPC-157 distribution. Paradigm Peptides: founders pleaded guilty December 2025 after products labeled as SARMs were found to contain testosterone. The criminal docket is not a hypothetical. As BioLongevity Labs stated after Peptide Sciences closed: \u201CThe federal government \u2014 DOJ, FBI, and FDA \u2014 has decided that RUO peptide manufacturing and distribution can no longer sell, manufacture, or distribute injectable peptides or bioregulators. Anything injectable is now toast.\u201D" },
];

export interface ChecklistItem {
  num: number;
  question: string;
  want: string;
  fail: string;
}

export const BUYER_CHECKLIST: ChecklistItem[] = [
  { num: 1, question: "Who synthesized this exact lot?", want: "Manufacturer legal name \u00B7 physical address \u00B7 country \u00B7 FDA registration status \u00B7 cGMP or equivalent quality system", fail: "FAIL: \u201CProprietary source\u201D / \u201CTrusted partner\u201D / \u201CConfidential\u201D" },
  { num: 2, question: "What is the exact lot number and production date?", want: "Lot number matching on vial, outer packaging, invoice, and COA \u00B7 manufacture date \u00B7 expiry date", fail: "FAIL: No lot number \u00B7 lot only on COA not product \u00B7 one COA reused across lots" },
  { num: 3, question: "Who imported it into the U.S.?", want: "Importer of record \u00B7 entry port \u00B7 customs broker \u00B7 chain-of-custody records from manufacturer to U.S. receiver", fail: "FAIL: Silence \u00B7 \u201Cwe source domestically\u201D with no evidence \u00B7 vague answer about \u201Ctrusted partners\u201D" },
  { num: 4, question: "Who tested it?", want: "Independent third-party lab \u00B7 ISO 17025 accreditation \u00B7 batch-specific report with chromatogram or raw analytical data", fail: "FAIL: Only internal testing \u00B7 only vendor-generated certificate \u00B7 refusal to let you contact the lab" },
  { num: 5, question: "What exactly was tested?", want: "Identity \u00B7 purity \u00B7 assay/content \u00B7 related impurities \u00B7 residual solvents \u00B7 for injectables: sterility, endotoxin, particulate", fail: "FAIL: Only \u201Cpurity 99%\u201D \u00B7 no identity confirmation \u00B7 no sterility/endotoxin for injectable claims" },
  { num: 6, question: "Where was it filled and vialed?", want: "Facility name and location \u00B7 licensed/regulated status \u00B7 sterile-compounding compliance statement where applicable", fail: "FAIL: \u201CNo issue, it\u2019s done in-house\u201D \u00B7 no address \u00B7 no facility quality statement" },
  { num: 7, question: "What exactly is in it besides the peptide?", want: "Full excipient list \u00B7 any vitamins or add-ons disclosed \u00B7 base form vs. salt form \u00B7 concentration per mL and total per vial", fail: "FAIL: Mystery blends \u00B7 \u201Cenhanced formula\u201D language \u00B7 brand names without chemistry" },
  { num: 8, question: "How is the dose expressed?", want: "mg or mcg per dose \u00B7 mL per dose \u00B7 concentration clearly shown \u00B7 simple syringe conversion chart", fail: "FAIL: Unit-only instructions \u00B7 ambiguous dosing \u00B7 different concentration strengths with same visual packaging" },
  { num: 9, question: "Can the package be authenticated?", want: "Lot-linked QR or 2D code \u00B7 tamper-evident seal \u00B7 batch document accessible from scan", fail: "FAIL: QR goes only to marketing page \u00B7 no serialization \u00B7 code not tied to a specific lot" },
  { num: 10, question: "What claims are being made?", want: "Plain, conservative, chemically accurate language", fail: "IMMEDIATE WALK-AWAY: \u201CFDA-approved\u201D \u00B7 \u201Csame as Ozempic/Mounjaro\u201D \u00B7 \u201Cgeneric\u201D \u00B7 \u201Cclinically proven\u201D without proof \u00B7 \u201Cpharma grade\u201D without source and GMP evidence" },
];

export interface ScorecardCategory {
  letter: string;
  name: string;
  desc: string;
}

export const SCORECARD_CATEGORIES: ScorecardCategory[] = [
  { letter: "A", name: "Manufacturer Transparency", desc: "0 = hidden or \u201Cproprietary\u201D \u00B7 5 = fully identified with auditable facility trail and regulatory registration" },
  { letter: "B", name: "Import Traceability", desc: "0 = unknown origin \u00B7 5 = importer, broker, entry port, and chain of custody fully documented" },
  { letter: "C", name: "Analytical Testing Quality", desc: "0 = vendor PDF only \u00B7 5 = independent ISO 17025 accredited lab with batch-specific data and raw chromatogram" },
  { letter: "D", name: "Sterile Handling Controls", desc: "0 = unclear or none \u00B7 5 = documented qualified sterile environment or regulated fill-finish with verifiable compliance" },
  { letter: "E", name: "Label Honesty", desc: "0 = deceptive or inflated claims \u00B7 5 = precise, plain, non-promotional, chemically accurate, no FDA/approval language" },
  { letter: "F", name: "Dosing Clarity", desc: "0 = confusing, ambiguous, or dangerous instructions \u00B7 5 = unambiguous, conversion chart included, idiot-proof" },
  { letter: "G", name: "Ingredient Integrity", desc: "0 = salts/blends/mystery additives undisclosed \u00B7 5 = exact form, excipient list, and concentration fully disclosed" },
  { letter: "H", name: "Packaging Authentication", desc: "0 = cosmetic QR links to marketing page only \u00B7 5 = lot-linked authentication with tamper evidence and serialized lot history" },
  { letter: "I", name: "Regulatory Posture", desc: "0 = open warning letters, law-skating, enforcement history \u00B7 5 = clean, conservative, no outstanding issues, boring is good" },
  { letter: "J", name: "Responsiveness to Verification", desc: "0 = defensive, evasive, hostile to questions \u00B7 5 = prompt, document-rich, welcomes scrutiny, invites lab contact" },
];

export const SCORE_TIERS = [
  { range: "45\u201350", verdict: "Best available in a messy market", note: "Still verify every batch. No vendor is infallible.", color: "#2A5AA0" },
  { range: "35\u201344", verdict: "Maybe acceptable \u2014 verify aggressively", note: "Multiple gaps present. Treat every lot as a new unknown.", color: "#B86A28" },
  { range: "25\u201334", verdict: "Too many holes", note: "Not acceptable for any injectable or high-risk compound.", color: "#C84B2A" },
  { range: "Under 25", verdict: "Walk away immediately", note: "Do not proceed under any circumstances.", color: "#C84B2A" },
];

export interface WatchdogPillar {
  icon: string;
  title: string;
  body: string;
}

export const WATCHDOG_PILLARS: WatchdogPillar[] = [
  { icon: "\uD83D\uDD2C", title: "Independent Testing Lab Network", body: "Partner with ISO 17025-accredited labs to systematically test products from the market. Publish results publicly. Expand Finnrick-model coverage to include sterility, endotoxin, heavy metals, and residual solvents \u2014 not just purity and quantity." },
  { icon: "\uD83D\uDCCA", title: "Public Vendor Registry", body: "Maintain a public, searchable database of vendor scores using the 10-category scorecard. Red/yellow/green status updated quarterly. Any vendor receiving a criminal referral or warning letter is immediately flagged." },
  { icon: "\u2696\uFE0F", title: "Regulatory Liaison Office", body: "Dedicated staff for FDA MedWatch reporting, DOJ/HHS-OIG referrals, and coordination with state boards of pharmacy and medical boards. Make whistleblower intake frictionless. Provide consumers with structured reporting support." },
  { icon: "\uD83D\uDD17", title: "Supply Chain Audit Program", body: "Offer paid audit certification to vendors willing to open their supply chains to independent review. Certified vendors earn a PeptideWatch seal. Any vendor refusing audit is rated accordingly." },
  { icon: "\uD83D\uDCF1", title: "Consumer Alert System", body: "Real-time alerts when new FDA warning letters, DOJ indictments, ITC orders, or state AG actions drop. SMS and email opt-in. Free to consumers. Partners with LegitScript, Finnrick, and PeptideExaminer for data sharing." },
  { icon: "\uD83C\uDF93", title: "Clinician Education Program", body: "Train prescribing physicians, telehealth providers, and med-spa clinicians on supply-chain due diligence. Offer CME credits. Publish procurement SOPs. The goal: make responsible sourcing the default, not the exception." },
];

export interface ReportChannel {
  agency: string;
  desc: string;
  url: string;
  label: string;
}

export const REPORT_CHANNELS: ReportChannel[] = [
  { agency: "FDA MedWatch", desc: "Adverse events and product quality problems, including compounded semaglutide-related events. FDA specifically recommends this pathway.", url: "https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program", label: "Report" },
  { agency: "FDA Online Pharmacy", desc: "Report unsafe online pharmacies, including \u201Cresearch use only\u201D sellers operating as drug distributors.", url: "https://www.fda.gov/drugs/buying-using-medicine-safely/internet-pharmacy", label: "Report" },
  { agency: "DOJ / HHS-OIG", desc: "For fraud, counterfeit product, or systemic criminal conduct. HHS-OIG hotline: 1-800-HHS-TIPS.", url: "https://oig.hhs.gov/fraud/report-fraud/", label: "Report" },
  { agency: "State Board", desc: "Report to state board of pharmacy (pharmacy/prescriber issues) or state medical board (physician/clinic false claims).", url: "https://www.nabp.pharmacy/boards-of-pharmacy/", label: "Find Board" },
  { agency: "FTC", desc: "For deceptive advertising, fake reviews, misleading pricing, and membership trap schemes.", url: "https://reportfraud.ftc.gov/", label: "Report" },
  { agency: "Finnrick", desc: "Submit a product sample for independent testing. Free for U.S.-based submissions. Results published publicly.", url: "https://www.finnrick.com", label: "Submit" },
];

export const MANUS_LAYERS = [
  { num: 1, title: "Static Reference (Zero Tokens at Runtime)", body: "The 10-Question Checklist, the 10-Category Scorecard, the 12 Fraud Patterns, and the Enforcement Timeline are static knowledge. Load once. No retrieval required for standard consumer queries." },
  { num: 2, title: "Dynamic Lookup (Minimal Tokens)", body: "Vendor Wall of Shame status should be queried against live sources \u2014 FDA Warning Letters database, DOJ press releases, Finnrick vendor ratings \u2014 at time of query. A single API call to each. Return only status flag, not full document." },
  { num: 3, title: "Scored Assessment (Structured Output)", body: "When a consumer submits a vendor name or product, the system runs the 10-category scorecard using structured prompts that return JSON scores, not prose. Aggregate to total. Output tier classification (Best / Verify / Holes / Walk Away) with specific gap flags." },
  { num: 4, title: "Whistleblower Routing (Event-Triggered)", body: "If query contains adverse event language or product quality concern language, trigger the reporting pathway selection logic. Return only the 2\u20133 most relevant reporting agencies with direct URLs. No prose." },
  { num: 5, title: "Alert Ingestion (Background)", body: "Weekly batch process ingests new FDA warning letters, DOJ press releases, and Finnrick rating updates. Flags any change in vendor status. No human token cost until a query hits a recently-changed vendor." },
];

/** Role-based checklists for different stakeholders */
export interface RoleChecklist {
  role: string;
  icon: string;
  color: string;
  description: string;
  items: string[];
}

export const ROLE_CHECKLISTS: RoleChecklist[] = [
  {
    role: "Consumer / Patient",
    icon: "\uD83D\uDC64",
    color: "#2A5AA0",
    description: "You are buying peptides for personal use \u2014 whether through a doctor, telehealth, clinic, or online seller.",
    items: [
      "Run the 10-Question Supply Chain Test on every vendor before purchasing",
      "Check Finnrick Analytics for independent test results on your specific product and vendor",
      "Verify your doctor or prescriber can name the compounder, lot number, and testing lab",
      "Refuse any product without a batch-specific COA from an independent ISO 17025 lab",
      "Cross-reference your vendor against the Wall of Shame before every purchase",
      "Report adverse events immediately to FDA MedWatch",
      "Never accept \u201Cresearch use only\u201D labeling on anything you intend to inject",
      "Demand clear dosing instructions in mg/mcg per dose with syringe conversion charts",
      "Keep all packaging, lot numbers, receipts, and COAs for every purchase",
      "If a vendor scores below 35 on the Vendor Scorecard, walk away immediately",
    ],
  },
  {
    role: "Supplier / Compounder",
    icon: "\uD83C\uDFED",
    color: "#B86A28",
    description: "You manufacture, compound, or distribute peptides to clinics, pharmacies, or directly to consumers.",
    items: [
      "Maintain full chain-of-custody documentation from API manufacturer to final product",
      "Use only ISO 17025-accredited independent labs for batch testing \u2014 never self-certify",
      "Publish your manufacturer identity, facility address, and FDA registration status publicly",
      "Implement lot-linked QR authentication tied to serialized batch history",
      "Disclose all excipients, salt forms, and concentrations on every label",
      "Submit voluntarily to Finnrick Analytics testing to build public credibility",
      "Maintain cGMP or equivalent quality systems with documented audit trails",
      "Never use \u201Cresearch use only\u201D labeling on products marketed with human dosing language",
      "Proactively report any quality deviations to FDA and affected customers",
      "Welcome independent supply chain audits \u2014 seek PeptideWatch certification when available",
    ],
  },
  {
    role: "Distributor / Reseller",
    icon: "\uD83D\uDE9A",
    color: "#6B4C8A",
    description: "You buy peptides from manufacturers or compounders and resell to clinics, practitioners, or consumers.",
    items: [
      "Score every upstream supplier using the 10-Category Vendor Scorecard before onboarding",
      "Verify importer of record, entry port, and customs broker for all imported products",
      "Maintain cold-chain documentation and temperature monitoring for all peptide shipments",
      "Refuse to carry any product from a vendor with active FDA warning letters or DOJ actions",
      "Require batch-specific independent COAs for every lot you accept into inventory",
      "Implement tamper-evident packaging and lot-linked serialization on all outbound shipments",
      "Conduct quarterly re-verification of all active suppliers against enforcement databases",
      "Document and retain chain of custody from receipt through final delivery to customer",
      "Report any suspected counterfeit or adulterated product to FDA and DOJ immediately",
      "Never make \u201CFDA-approved,\u201D \u201Csame as Ozempic,\u201D or \u201Cclinically proven\u201D claims in marketing",
    ],
  },
  {
    role: "Prescriber / Clinician",
    icon: "\u2695\uFE0F",
    color: "#2D7D46",
    description: "You are a physician, NP, PA, or telehealth provider prescribing or administering peptides to patients.",
    items: [
      "Know your compounder by name, address, and regulatory status \u2014 not just your distributor",
      "Verify every lot\u2019s COA independently before administering to patients",
      "Confirm sterility and endotoxin testing results for all injectable compounds",
      "Check Finnrick ratings for your specific compounder and product before each order",
      "Refuse to prescribe from any source that cannot provide full chain-of-custody documentation",
      "Report all adverse events to FDA MedWatch within 15 days of awareness",
      "Never rely on vendor-provided COAs alone \u2014 require independent third-party verification",
      "Maintain detailed records of lot numbers, compounders, and test results for every patient",
      "Stay current on FDA warning letters and enforcement actions affecting your supply chain",
      "Educate patients on supply chain risks and provide them with the 10-Question Checklist",
    ],
  },
  {
    role: "Researcher",
    icon: "\uD83D\uDD2C",
    color: "#8B6914",
    description: "You use peptides in laboratory research, clinical trials, or academic studies.",
    items: [
      "Source only from vendors with documented cGMP manufacturing and full analytical packages",
      "Verify identity, purity, and assay for every lot using your own independent analysis",
      "Maintain complete chain-of-custody records for regulatory compliance and reproducibility",
      "Cross-reference vendor claims against Finnrick independent testing data",
      "Document all supplier qualifications in your research protocols and publications",
      "Report any quality concerns to your IRB, institutional biosafety committee, and FDA",
      "Never use \u201Cresearch use only\u201D products from vendors marketing to human consumers",
      "Require certificates of analysis with raw chromatographic data, not just summary reports",
      "Implement incoming quality control testing for all peptide reagents before use in experiments",
      "Track lot-to-lot variability and flag any significant deviations to your supplier and peers",
    ],
  },
];
