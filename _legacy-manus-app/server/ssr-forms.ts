/**
 * SSR Forms & Assessments
 * Renders full HTML for all interactive forms, quizzes, and assessments
 * so AI tools, bots, and curl can read all fields without JavaScript.
 *
 * Pages covered:
 *  /supplier-intake        — Stage 1 supplier qualification form (3 steps, 18 fields)
 *  /supplier-intake-long   — Stage 2 full supplier due diligence (6 steps, 42 fields)
 *  /find-your-peptide      — Peptide Clarity Index™ (10 questions, 7 axes)
 *  /quiz_25q               — 25-question Peptide Consumer Literacy Quiz
 *  /whats-legal            — Peptide regulatory status by country
 *  /charity-scorecard      — Charity due diligence scorecard
 *  /engage                 — The Gate — engagement audit form
 *  /community              — Community join form
 *  /find-your-therapy      — Therapy matching assessment (16 questions)
 *  /find-your-me           — Self-discovery assessment (5 questions)
 *  /life-assessment        — Life assessment tool
 *  /soulscore              — SoulScore impact measurement
 *  /dharma-finder          — Dharma profile (25 questions)
 *  /grant-study            — Harvard Grant Study life satisfaction (25 questions)
 *  /protecting-your-business — Business protection tool
 */

const BASE_CSS = `
  body { font-family: 'Georgia', serif; background: #0A0A10; color: #E8E4D8; margin: 0; padding: 0; }
  .container { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }
  h1 { font-size: 2.2rem; color: #D4B96A; margin-bottom: 0.5rem; }
  h2 { font-size: 1.5rem; color: #D4B96A; margin: 2rem 0 0.75rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
  h3 { font-size: 1.1rem; color: #C8A84A; margin: 1.5rem 0 0.5rem; }
  p { color: #999; line-height: 1.7; margin: 0.5rem 0 1rem; }
  .subtitle { font-size: 1rem; color: #888; margin-bottom: 2rem; }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  th { background: #1A1A24; color: #D4B96A; padding: 0.6rem 1rem; text-align: left; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
  td { padding: 0.6rem 1rem; border-bottom: 1px solid #1E1E2A; color: #CCC; font-size: 0.9rem; }
  tr:hover td { background: #111118; }
  .field-block { margin: 1rem 0; padding: 0.75rem 1rem; background: #111118; border-left: 3px solid #D4B96A; border-radius: 2px; }
  .field-label { font-size: 0.85rem; color: #D4B96A; font-family: monospace; letter-spacing: 0.08em; text-transform: uppercase; }
  .field-type { font-size: 0.75rem; color: #666; margin-left: 0.5rem; }
  .field-required { color: #E87070; font-size: 0.75rem; margin-left: 0.3rem; }
  .field-options { margin-top: 0.5rem; padding-left: 1rem; }
  .field-options li { color: #AAA; font-size: 0.85rem; margin: 0.2rem 0; list-style: disc; }
  .field-placeholder { color: #666; font-size: 0.8rem; font-style: italic; margin-top: 0.3rem; }
  .question-block { margin: 1.5rem 0; padding: 1rem 1.2rem; background: #0E0E18; border: 1px solid #222; border-radius: 4px; }
  .question-number { font-size: 0.7rem; color: #666; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; }
  .question-stem { font-size: 1.05rem; color: #E8E4D8; margin: 0.4rem 0; }
  .question-subtext { font-size: 0.82rem; color: #777; font-style: italic; margin-bottom: 0.5rem; }
  .question-citation { font-size: 0.72rem; color: #555; font-family: monospace; }
  .choice-list { margin: 0.5rem 0 0 0; padding: 0; list-style: none; }
  .choice-list li { padding: 0.3rem 0.6rem; margin: 0.2rem 0; background: #141420; border-radius: 3px; color: #BBB; font-size: 0.88rem; }
  .choice-subtext { color: #666; font-size: 0.75rem; font-style: italic; }
  .section-header { background: #141420; padding: 1rem 1.2rem; margin: 2rem 0 1rem; border-radius: 4px; }
  .section-header h2 { margin: 0 0 0.3rem; border: none; padding: 0; }
  .section-header p { margin: 0; font-size: 0.9rem; }
  .tag { display: inline-block; padding: 0.2rem 0.5rem; background: #1A1A28; border: 1px solid #333; border-radius: 3px; font-size: 0.75rem; color: #AAA; margin: 0.2rem; font-family: monospace; }
  .status-approved { color: #4ADE80; }
  .status-grey { color: #FBBF24; }
  .status-banned { color: #F87171; }
  .status-restricted { color: #FB923C; }
  .risk-low { color: #4ADE80; }
  .risk-medium { color: #FBBF24; }
  .risk-high { color: #F87171; }
  .nav-links { margin: 1.5rem 0; padding: 1rem; background: #0D0D18; border: 1px solid #222; border-radius: 4px; }
  .nav-links a { color: #D4B96A; text-decoration: none; margin-right: 1.5rem; font-size: 0.85rem; font-family: monospace; }
  .nav-links a:hover { text-decoration: underline; }
  .meta { font-size: 0.75rem; color: #555; font-family: monospace; margin-bottom: 2rem; }
`;

function wrap(title: string, description: string, path: string, body: string, image?: string): string {
  const canonicalUrl = `https://tonygreenberg.com${path}`;
  const ogImage = image || "https://tonygreenberg.com/og-default.jpg";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Tony Greenberg">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:site_name" content="Tony Greenberg">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@ThinkTony">
  <meta name="twitter:creator" content="@ThinkTony">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:image:alt" content="${title}">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "publisher": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
  })}</script>
  <style>${BASE_CSS}</style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <div class="container">
    <div class="nav-links">
      <a href="/">← Home</a>
      <a href="/the-body">Peptide Hub</a>
      <a href="/supplier-intake">Supplier Application</a>
      <a href="/find-your-peptide">Find Your Peptide</a>
      <a href="/quiz_25q">Peptide Quiz</a>
      <a href="/whats-legal">What's Legal</a>
    </div>
    ${body}
  </div>
</body>
</html>`;
}

/* ══════════════════════════════════════════════════════════════
   1. VENDOR INTAKE FORM
══════════════════════════════════════════════════════════════ */
export function renderSupplierIntakeHTML(): string {
  const body = `
    <h1>Supplier Application</h1>
    <p class="subtitle">Peptide Supply Partner Application — Two-Stage Qualification Process</p>
    <p>RampRate's peptide procurement team uses this two-stage process to evaluate potential supply partners. Stage 1 (18 fields, ~2-3 min, no uploads) is open to all applicants. Stage 2 (42 fields, 6 steps, with document uploads) is sent only to suppliers we decide to pursue. Submit Stage 1 at: <a href="https://tonygreenberg.com/supplier-intake" style="color:#D4B96A">tonygreenberg.com/supplier-intake</a></p>
    <div class="meta">FORM TYPE: Two-Stage Supplier Qualification | STAGE 1: 18 fields, 3 steps | STAGE 2: 42 fields, 6 steps</div>

    <div class="section-header">
      <h2>Section 1 — Company Information</h2>
      <p>Legal entity, contact details, and ownership structure</p>
    </div>
    ${field("Legal Entity Name", "text", true, "Registered business name")}
    ${field("DBA / Trade Name", "text", false, "Operating name, if different")}
    ${field("State / Country of Incorporation", "text", true, "e.g. Delaware, USA")}
    ${field("Year Founded", "number", true, "YYYY")}
    ${field("Website", "url", true, "https://")}
    ${field("Company LinkedIn", "url", false, "https://linkedin.com/company/...")}
    ${field("Headquarters Address", "text", true, "Full street address, city, state, zip")}
    ${field("Manufacturing Facility Address", "text", true, "Street, city, state, zip — if different from HQ")}
    ${fieldSelect("Number of Employees", true, ["1–10", "11–50", "51–200", "201–500", "500+"])}
    ${field("Primary Contact Name", "text", true, "Full name")}
    ${field("Title / Role", "text", true, "e.g. VP of Sales")}
    ${field("Email", "email", true, "name@company.com")}
    ${field("Phone", "tel", true, "+1 (555) 000-0000")}
    ${field("Names and Titles of All Principals / Founders", "textarea", true, "Name — Title — Ownership % (all individuals with >10% ownership)")}

    <div class="section-header">
      <h2>Section 2 — Manufacturing &amp; Capabilities</h2>
      <p>Production environment, capacity, and peptide-specific capabilities</p>
    </div>
    ${fieldSelect("Facility Type", true, ["Own Manufacturing", "Contract Manufacturer (CMO)", "Hybrid (Own + CMO)", "White Label / Private Label"])}
    ${fieldSelect("Facility Classification", true, ["FDA Registered", "cGMP Certified", "ISO 13485 / 9001", "503B Outsourcing Facility", "503A Compounding Pharmacy", "Other"])}
    ${fieldSelect("Peptide Synthesis Method", true, ["Solid-Phase Peptide Synthesis (SPPS)", "Liquid-Phase Synthesis (LPPS)", "Recombinant Expression", "Hybrid Approach", "Not Applicable"])}
    ${field("Monthly Production Capacity", "text", true, "e.g. 50,000 vials / month")}
    ${field("Current Peptide Products", "textarea", true, "List all compounds currently manufactured (BPC-157, TB-500, Semaglutide, Tirzepatide, etc.)")}
    ${field("Purity Levels Achieved", "text", true, "e.g. ≥98% HPLC purity")}
    ${fieldSelect("Sterile Fill Capability", false, ["Yes — In-House", "Yes — Outsourced", "No"])}
    ${field("Cold Chain / Storage Capabilities", "textarea", false, "Temperature-controlled storage, cold chain logistics, shipping capabilities")}
    ${fieldSelect("Chain-of-Custody Capability", true, ["Currently live", "Can implement on request", "Not currently capable"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Can you support lot-level tracking (QR code or blockchain-anchored) from synthesis through delivery?</p>

    <div class="section-header">
      <h2>Section 3 — Quality Assurance</h2>
      <p>Quality management systems, testing protocols, and compliance standards</p>
    </div>
    ${fieldSelect("Quality Management System", true, ["cGMP Compliant", "ISO 9001", "ISO 13485", "USP Compliant", "Multiple Standards", "In Development"])}
    ${fieldSelect("Third-Party Testing", true, ["Yes — Every Batch", "Yes — Periodic", "In-House Only", "No"])}
    ${fieldSelect("Independent Testing Willingness", true, ["Yes, ongoing", "Yes, one-time per new listing", "No"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Willing to have batches independently tested by a lab of the marketplace's choosing (e.g., Janoshik Analytical, MZ Biolabs), separate from your own COA process?</p>
    ${field("Testing Protocols", "textarea", true, "HPLC, Mass Spec, Endotoxin, Sterility, Microbial, Identity, Potency")}
    ${fieldSelect("Stability Testing Program", false, ["Yes — ICH Guidelines", "Yes — Internal Protocol", "No"])}
    ${fieldSelect("Recall / CAPA History", false, ["No recalls or CAPAs", "Minor CAPAs resolved", "Active CAPA in progress", "Recall history (disclose)"])}
    ${field("Testing Lab Name", "text", true, "Name of your primary third-party testing laboratory (e.g. Eurofins, Janoshik, MZ Biolabs)")}
    ${fieldSelect("COA Lot-Specific", true, ["Yes — every lot", "Yes — on request", "No"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Are your Certificates of Analysis issued per lot/batch?</p>
    ${fieldSelect("COA Publicly Viewable", true, ["Yes", "No"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Is your Certificate of Analysis viewable publicly before purchase?</p>
    ${field("COA Public URL", "url", false, "Link to your publicly accessible COA page (if applicable)")}
    ${fieldSelect("Identity Confirmation Method", true, ["HPLC", "Mass Spectrometry", "NMR", "HPLC + Mass Spec", "Other"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">How do you confirm peptide identity in your COA?</p>
    ${field("Batch Documentation", "textarea", true, "Batch record system, COA generation process, document retention policy")}

    <div class="section-header">
      <h2>Section 4 — Commercial Terms</h2>
      <p>Pricing structure, lead times, and partnership terms</p>
    </div>
    ${field("Minimum Order Quantity (MOQ)", "text", true, "e.g. 1,000 vials")}
    ${field("Standard Lead Time", "text", true, "e.g. 4–6 weeks from PO")}
    ${fieldSelect("Pricing Model", true, ["Per Unit / Per Vial", "Tiered Volume Pricing", "Annual Contract", "Custom / Negotiable"])}
    ${fieldSelect("Payment Terms", false, ["Net 30", "Net 60", "COD / Prepay", "50% Deposit / 50% on Delivery", "Custom Terms"])}
    ${field("Existing Distribution Channels", "textarea", false, "Current distribution partnerships, clinic networks, retail channels")}
    ${field("References", "textarea", false, "2–3 current client references (company name, contact, relationship duration)")}
    <div class="field-block">
      <label><span class="field-label">Pricing for Top Compounds</span><span class="field-required">* required</span></label>
      <p style="color:#777;font-size:0.82rem;margin:0.3rem 0">List pricing for your top 3–5 volume compounds: Compound — Unit Size — Price per Unit — MOQ Tier (max 5 rows)</p>
      <table style="width:100%;border-collapse:collapse;margin-top:0.5rem">
        <thead><tr><th style="text-align:left;padding:0.3rem 0.5rem;color:#D4B96A;font-size:0.75rem">Compound</th><th style="text-align:left;padding:0.3rem 0.5rem;color:#D4B96A;font-size:0.75rem">Unit Size</th><th style="text-align:left;padding:0.3rem 0.5rem;color:#D4B96A;font-size:0.75rem">Price/Unit</th><th style="text-align:left;padding:0.3rem 0.5rem;color:#D4B96A;font-size:0.75rem">MOQ Tier</th></tr></thead>
        <tbody>${[1,2,3,4,5].map(i => `<tr><td><input type="text" name="compound_${i}" placeholder="e.g. BPC-157" style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.3rem 0.5rem;border-radius:2px;font-size:0.82rem" /></td><td><input type="text" name="unit_size_${i}" placeholder="e.g. 5mg/vial" style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.3rem 0.5rem;border-radius:2px;font-size:0.82rem" /></td><td><input type="text" name="price_per_unit_${i}" placeholder="e.g. $12.00" style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.3rem 0.5rem;border-radius:2px;font-size:0.82rem" /></td><td><input type="text" name="moq_tier_${i}" placeholder="e.g. 100 min" style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.3rem 0.5rem;border-radius:2px;font-size:0.82rem" /></td></tr>`).join('')}</tbody>
      </table>
    </div>
    ${fieldUpload("Full Price List / Catalog", false, "Upload your complete pricing sheet (PDF, XLS, or CSV) for the marketplace to consider your full catalog for future RFPs")}

    <div class="section-header">
      <h2>Section 5 — Regulatory &amp; Compliance</h2>
      <p>Regulatory standing, licenses, and compliance history</p>
    </div>
    ${field("FDA Registration Number", "text", true, "FEI number")}
    ${fieldSelect("DEA Registration", true, ["Yes — Active", "Not Required", "Pending", "No"])}
    ${field("State Licenses", "textarea", true, "All active state pharmacy, manufacturing, or distribution licenses (State — License Type — Number)")}
    ${fieldSelect("Product Labeling & Sale Restrictions", true, ["Research-use-only (RUO)", "Compounded pharmacy (503A/503B)", "Both, depending on product"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">How is your product labeled and sold?</p>
    ${fieldSelect("Buyer Eligibility", true, ["Institutional/researcher only", "Clinics only", "Clinics and individuals", "All accounts"])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Do you sell only to institutional/qualified-researcher accounts, or also to clinics and individuals?</p>
    ${field("Last FDA Inspection Date", "text", false, "MM/YYYY or N/A")}
    ${fieldSelect("FDA Inspection Outcome", false, ["No Action Indicated (NAI)", "Voluntary Action Indicated (VAI)", "Official Action Indicated (OAI)", "Not Yet Inspected"])}
    ${field("Warning Letters or Consent Decrees", "textarea", false, "FDA warning letters, consent decrees, enforcement actions in past 5 years. Enter 'None' if not applicable.")}
    ${fieldSelect("Shipping Jurisdictions", true, [])}
    <p style="color:#777;font-size:0.82rem;margin:-0.5rem 0 1rem 0;font-style:italic">Which jurisdictions do you ship to/from? List all US states and international countries.</p>
    ${field("Shipping Jurisdictions (detail)", "textarea", true, "e.g. All 50 US states, Canada, EU (Germany, France, UK), Australia — list all jurisdictions you ship to and from")}
    ${field("Manufacturing Certifications", "textarea", false, "List all manufacturing certifications (e.g. ISO 9001:2015 cert #12345, cGMP cert, etc.)")}
    ${field("Insurance Coverage", "textarea", true, "Product liability, general liability, professional liability coverage amounts")}

    <div class="section-header">
      <h2>Section 6 — Document Upload</h2>
      <p>Supporting documentation. Accepted formats: PDF, DOC, JPG, PNG. Max 10MB per file.</p>
    </div>
    ${fieldUpload("Certificate of Analysis (COA)", true, "Most recent batch COA for primary peptide product")}
    ${fieldUpload("cGMP / Quality Certification", true, "Current cGMP, ISO, or equivalent quality certification")}
    ${fieldUpload("FDA Registration Documentation", false, "FDA establishment registration confirmation")}
    ${fieldUpload("Certificate of Insurance", true, "Current product liability insurance certificate")}
    ${fieldUpload("Sample SOP Document", false, "A representative Standard Operating Procedure")}
    ${fieldUpload("Additional Documentation", false, "Product catalog, company deck, or other supporting materials")}
  `;
  return wrap(
    "Supplier Application — Peptide Supply Partner (Stage 1 + Stage 2)",
    "RampRate's two-stage supplier qualification process. Stage 1: 18-field short form covering company identity, offer & scale, and terms & track record (no uploads). Stage 2: 42-field full due diligence wizard covering manufacturing, quality assurance, commercial terms, regulatory compliance, and document uploads.",
    "/supplier-intake",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   2. FIND YOUR PEPTIDE — Peptide Clarity Index™
══════════════════════════════════════════════════════════════ */
export function renderFindYourPeptideHTML(): string {
  const axes = [
    { id: "recovery", label: "Recovery & Repair", peptides: "BPC-157, TB-500", desc: "Tissue healing, joint repair, gut restoration, surgical recovery" },
    { id: "metabolic", label: "Metabolic Health", peptides: "Semaglutide, Tirzepatide", desc: "Weight management, insulin sensitivity, appetite regulation, metabolic syndrome" },
    { id: "vitality", label: "Growth & Vitality", peptides: "Sermorelin, CJC-1295, Ipamorelin", desc: "Sleep quality, energy, muscle mass, skin elasticity, anti-aging" },
    { id: "immune", label: "Immune Defense", peptides: "Thymosin Alpha-1, LL-37", desc: "Immune modulation, autoimmune support, inflammation control" },
    { id: "cognitive", label: "Cognitive Performance", peptides: "Selank, Semax, Dihexa", desc: "Focus, memory, neuroprotection, stress resilience, brain fog" },
    { id: "sexual", label: "Hormonal & Sexual", peptides: "PT-141, Kisspeptin", desc: "Libido, hormonal balance, reproductive health, sexual function" },
    { id: "longevity", label: "Longevity & Cellular", peptides: "Epitalon, FOXO4-DRI, NAD+ peptides", desc: "Telomere health, oxidative stress, cellular senescence, aging biomarkers" },
  ];
  const questions = [
    { n: 1, stem: "How does your body handle physical damage?", subtext: "Injury response, healing speed, and tissue repair capacity", choices: ["I heal quickly — minor injuries resolve in days", "Average healing — takes a few weeks for most things", "Slow healer — injuries linger, inflammation persists", "I have chronic injuries, joint pain, or unresolved damage", "I've had surgery, significant trauma, or gut damage that hasn't fully resolved"] },
    { n: 2, stem: "What's your relationship with your metabolism?", subtext: "Weight, energy regulation, and metabolic function", choices: ["Fast and efficient — I stay lean without much effort", "Normal — I maintain weight with reasonable diet and exercise", "Sluggish — I gain weight easily and lose it slowly", "I have diagnosed metabolic issues (insulin resistance, pre-diabetes, thyroid)", "I'm managing obesity, diabetes, or have been prescribed GLP-1 medications"] },
    { n: 3, stem: "How do you sleep — and how do you feel when you wake up?", subtext: "Sleep quality is the primary GH release window", choices: ["Deep, restorative sleep — I wake refreshed", "Generally good but inconsistent", "Difficulty falling or staying asleep — tired in the morning", "Chronic poor sleep — I'm always running on empty", "Sleep disorders, diagnosed or suspected (apnea, insomnia, circadian disruption)"] },
    { n: 4, stem: "How often do you get sick — and how hard does it hit?", subtext: "Your immune system is a peptide-driven orchestra", choices: ["Rarely sick — strong immune response", "Average — a few colds per year, recover normally", "Frequently ill — catch everything, slow recovery", "Autoimmune condition, chronic inflammation, or immune dysregulation", "Immunocompromised, on immunosuppressants, or post-chemotherapy"] },
    { n: 5, stem: "What's happening with your brain?", subtext: "Cognitive function, mental clarity, and neurological health", choices: ["Sharp and focused — operating at full capacity", "Some brain fog, occasional memory lapses", "Consistent cognitive decline — focus, memory, processing speed all affected", "Anxiety, depression, or mood disorders affecting daily function", "Neurological diagnosis or significant cognitive impairment"] },
    { n: 6, stem: "How's your hormonal and sexual health?", subtext: "Hormonal balance is the master regulator of vitality", choices: ["Strong libido, balanced hormones, no concerns", "Some decline — lower drive, less energy, subtle changes", "Significant hormonal imbalance — low T, estrogen dominance, or thyroid issues", "Sexual dysfunction — ED, low libido, arousal issues", "Diagnosed hormonal condition or on hormone replacement therapy"] },
    { n: 7, stem: "How do you think about aging?", subtext: "Your relationship with time shapes your biology", choices: ["I feel younger than my age — aging is going well", "I'm aging normally but want to optimize", "I'm aging faster than I'd like — visible and felt decline", "Skin, hair, and visible aging markers are progressing rapidly", "I've had cancer, serious illness, or major health events that accelerated aging"] },
    { n: 8, stem: "What does your daily stress load look like?", subtext: "Chronic stress is a peptide disruptor — it suppresses GH, inflames the gut, crashes immunity, and accelerates aging simultaneously.", choices: ["Manageable — I have stress but I recover from it well", "High but functional — I perform under pressure but I'm burning reserves", "Chronic and unrelenting — I haven't felt truly relaxed in months or years", "My stress manifests physically — headaches, GI issues, muscle tension, insomnia", "I've experienced burnout, trauma, or PTSD that changed my baseline"] },
    { n: 9, stem: "Medical history check — select everything that applies.", subtext: "Safety screening question. Certain peptides are contraindicated with specific conditions.", choices: ["No significant medical history — generally healthy", "I take prescription medications daily (blood pressure, thyroid, psychiatric, etc.)", "I have a history of cancer or am in remission", "I have kidney or liver disease", "I'm pregnant, breastfeeding, or trying to conceive"] },
    { n: 10, stem: "What matters most to you right now?", subtext: "This weights your results toward your primary goal.", choices: ["Heal something specific — an injury, gut issue, or chronic pain", "Lose weight and fix my metabolism", "Feel younger — more energy, better sleep, stronger body", "Protect my brain — sharper thinking, better memory, less anxiety", "Slow aging and optimize long-term health"] },
  ];

  const axesHTML = axes.map(a => `
    <tr>
      <td><strong>${a.label}</strong></td>
      <td>${a.desc}</td>
      <td style="color:#D4B96A;font-family:monospace;font-size:0.8rem">${a.peptides}</td>
    </tr>`).join("");

  const qHTML = questions.map(q => `
    <div class="question-block">
      <div class="question-number">QUESTION ${q.n} OF 10</div>
      <div class="question-stem">${q.stem}</div>
      <div class="question-subtext">${q.subtext}</div>
      <ul class="choice-list">
        ${q.choices.map(c => `<li>${c}</li>`).join("")}
      </ul>
    </div>`).join("");

  const body = `
    <h1>Find Your Peptide — The Peptide Clarity Index™</h1>
    <p class="subtitle">10 questions · 7 clinical axes · 16 personalized archetypes · ~4 minutes</p>
    <p>The most comprehensive peptide assessment available. Maps your biology across 7 clinical axes to identify which peptide compounds are most relevant to your specific health goals.</p>
    <div class="meta">ASSESSMENT TYPE: Multi-axis clinical mapping | QUESTIONS: 10 | AXES: 7 | ARCHETYPES: 16 | URL: tonygreenberg.com/find-your-peptide</div>

    <h2>The 7 Clinical Axes</h2>
    <table>
      <tr><th>Axis</th><th>Description</th><th>Primary Peptides</th></tr>
      ${axesHTML}
    </table>

    <h2>Assessment Questions</h2>
    ${qHTML}

    <h2>Input Field</h2>
    ${field("Email Address", "email", true, "your@email.com — required to unlock your personalized 7-axis peptide profile")}
  `;
  return wrap(
    "Find Your Peptide — The Peptide Clarity Index™",
    "10-question, 7-axis peptide assessment that maps your biology to identify which peptide compounds are most relevant to your health goals. 16 personalized archetypes.",
    "/find-your-peptide",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   3. PEPTIDE QUIZ — 25-Question Consumer Literacy Quiz
══════════════════════════════════════════════════════════════ */
export function renderPeptideQuiz25HTML(): string {
  const dimensions = [
    { id: "SQ", label: "Source Quality", desc: "Understanding where peptides come from and what quality signals matter" },
    { id: "RF", label: "Red Flags", desc: "Identifying deceptive marketing, fake COAs, and dangerous vendors" },
    { id: "PE", label: "Physician Engagement", desc: "Understanding proper medical oversight and clinical protocols" },
    { id: "RA", label: "Regulatory Awareness", desc: "Knowledge of FDA status, legal frameworks, and enforcement landscape" },
    { id: "SC", label: "Safety & Contraindications", desc: "Understanding drug interactions, contraindications, and safety protocols" },
  ];
  const sampleQuestions = [
    "What does a legitimate Certificate of Analysis (COA) include that a fake one typically omits?",
    "Which of the following is NOT a valid red flag when evaluating a peptide vendor?",
    "What does 'grey market' mean in the context of peptide compounds?",
    "A vendor claims their BPC-157 is 'FDA-approved.' This statement is:",
    "What is the primary difference between a 503A compounding pharmacy and a 503B outsourcing facility?",
    "Which peptide has received FDA approval for a specific medical indication?",
    "What does HPLC purity testing measure?",
    "A physician who prescribes peptides without reviewing bloodwork or medical history is:",
    "What is the legal status of BPC-157 in the United States as of 2026?",
    "Which of the following best describes the role of the DEA in peptide regulation?",
  ];

  const body = `
    <h1>Peptide Consumer Literacy Quiz</h1>
    <p class="subtitle">25 Questions · 5 Dimensions · ~8 minutes</p>
    <p>Tests your knowledge of peptide sourcing, red flags, physician oversight, regulatory frameworks, and safety protocols. Scores you across 5 dimensions of peptide consumer literacy.</p>
    <div class="meta">QUIZ TYPE: Knowledge assessment | QUESTIONS: 25 | DIMENSIONS: 5 | URL: tonygreenberg.com/quiz_25q</div>

    <h2>The 5 Scoring Dimensions</h2>
    <table>
      <tr><th>Code</th><th>Dimension</th><th>What It Measures</th></tr>
      ${dimensions.map(d => `<tr><td style="color:#D4B96A;font-family:monospace">${d.id}</td><td><strong>${d.label}</strong></td><td>${d.desc}</td></tr>`).join("")}
    </table>

    <h2>Sample Questions (First 10 of 25)</h2>
    ${sampleQuestions.map((q, i) => `
      <div class="question-block">
        <div class="question-number">QUESTION ${i + 1} OF 25</div>
        <div class="question-stem">${q}</div>
      </div>`).join("")}

    <h2>Score Interpretation</h2>
    <table>
      <tr><th>Score Range</th><th>Level</th><th>What It Means</th></tr>
      <tr><td>90–100</td><td style="color:#4ADE80">Expert Consumer</td><td>You understand the peptide landscape at a clinical level</td></tr>
      <tr><td>70–89</td><td style="color:#86EFAC">Informed Consumer</td><td>Strong foundational knowledge with some gaps</td></tr>
      <tr><td>50–69</td><td style="color:#FBBF24">Developing Literacy</td><td>You know the basics but are vulnerable to common deceptions</td></tr>
      <tr><td>Below 50</td><td style="color:#F87171">At Risk</td><td>Significant knowledge gaps that could lead to unsafe decisions</td></tr>
    </table>
  `;
  return wrap(
    "Peptide Consumer Literacy Quiz — 25 Questions",
    "25-question quiz testing knowledge of peptide sourcing, red flags, physician oversight, regulatory frameworks, and safety protocols. Scores across 5 dimensions.",
    "/quiz_25q",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   4. WHAT'S LEGAL — Peptide Regulatory Status
══════════════════════════════════════════════════════════════ */
export function renderWhatsLegalHTML(): string {
  const data = [
    { compound: "BPC-157", us: "Grey Market", uk: "Grey Market", australia: "Scheduled (S4)", rxPath: "No", userRisk: "LOW" },
    { compound: "TB-500", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "Semaglutide", us: "Approved (Rx)", uk: "Approved (Rx)", australia: "Approved (Rx)", rxPath: "Yes (Rx)", userRisk: "VERY HIGH" },
    { compound: "Tirzepatide", us: "Approved (Rx)", uk: "Approved (Rx)", australia: "Approved (Rx)", rxPath: "Yes (Rx)", userRisk: "VERY HIGH" },
    { compound: "Retatrutide", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "MEDIUM" },
    { compound: "CJC-1295", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
    { compound: "Ipamorelin", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
    { compound: "PT-141", us: "Approved (HSDD)", uk: "Grey Market", australia: "Grey Market", rxPath: "Yes (Rx)", userRisk: "LOW" },
    { compound: "Selank", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "Semax", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "Epithalon", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "GHK-Cu", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "AOD-9604", us: "Grey Market", uk: "Grey Market", australia: "TGA rejected", rxPath: "No", userRisk: "LOW-MEDIUM" },
    { compound: "MOTS-c", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "SS-31", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
    { compound: "Thymosin Alpha-1", us: "Grey Market", uk: "Approved (some)", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
    { compound: "Dihexa", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  ];

  const statusColor = (s: string) => {
    if (s.includes("Approved")) return "status-approved";
    if (s.includes("Grey")) return "status-grey";
    if (s.includes("Banned") || s.includes("Scheduled") || s.includes("rejected")) return "status-banned";
    return "";
  };
  const riskColor = (r: string) => {
    if (r === "LOW") return "risk-low";
    if (r === "MEDIUM" || r === "LOW-MEDIUM") return "risk-medium";
    return "risk-high";
  };

  const rows = data.map(d => `
    <tr>
      <td><strong>${d.compound}</strong></td>
      <td class="${statusColor(d.us)}">${d.us}</td>
      <td class="${statusColor(d.uk)}">${d.uk}</td>
      <td class="${statusColor(d.australia)}">${d.australia}</td>
      <td>${d.rxPath}</td>
      <td class="${riskColor(d.userRisk)}">${d.userRisk}</td>
    </tr>`).join("");

  const body = `
    <h1>What's Legal? — Peptide Regulatory Status by Country (2026)</h1>
    <p class="subtitle">Not legal advice. Not a scare piece. The actual legal status of every major peptide — compound by compound, country by country.</p>
    <p>The 2025–2026 FDA enforcement wave targeted vendors, not users. Here is the current regulatory status of 17 major peptide compounds across the US, UK, and Australia.</p>
    <div class="meta">DATA AS OF: 2026 | COMPOUNDS: 17 | COUNTRIES: 3 (US, UK, Australia) | URL: tonygreenberg.com/whats-legal</div>

    <h2>Status Key</h2>
    <p><span class="status-approved">Approved (Rx)</span> — FDA/regulatory approved with a prescription pathway &nbsp;|&nbsp;
    <span class="status-grey">Grey Market</span> — Not approved but not explicitly banned; enforcement targets vendors &nbsp;|&nbsp;
    <span class="status-banned">Banned / Scheduled</span> — Explicitly prohibited or scheduled controlled substance</p>

    <h2>Regulatory Status Table</h2>
    <table>
      <tr><th>Compound</th><th>United States</th><th>United Kingdom</th><th>Australia</th><th>Rx Path</th><th>User Risk</th></tr>
      ${rows}
    </table>

    <h2>Filter Options (Interactive)</h2>
    <p>The live page at <a href="https://tonygreenberg.com/whats-legal" style="color:#D4B96A">tonygreenberg.com/whats-legal</a> allows filtering by compound name, status, and country. The search field accepts any compound name or status keyword.</p>
    ${field("Search Compounds", "text", false, "e.g. BPC-157, Semaglutide, Grey Market, Approved...")}
  `;
  return wrap(
    "What's Legal? — Peptide Regulatory Status by Country (2026)",
    "The actual legal status of 17 major peptide compounds across the US, UK, and Australia. Not legal advice — just the facts, compound by compound.",
    "/whats-legal",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   5. ENGAGE — The Gate (Engagement Audit Form)
══════════════════════════════════════════════════════════════ */
export function renderEngageHTML(): string {
  const questions = [
    { label: "THE INITIATIVE", q: "What is the specific impact initiative you're building?", placeholder: "Describe the specific initiative, its mechanism, and who it serves..." },
    { label: "THE OUTCOMES", q: "What are the intended impact outcomes — and how will you measure them?", placeholder: "Define success metrics, timeline, and who benefits..." },
    { label: "THE FIT", q: "Why Tony Greenberg, RampRate, or ImpactSoul — specifically?", placeholder: "Reference specific work, frameworks, or capabilities that align with your needs..." },
    { label: "THE PROOF", q: "What have you already done — with your own hands and resources?", placeholder: "Describe concrete actions taken, resources deployed, lessons learned..." },
    { label: "THE COMMITMENT", q: "What resources are committed — budget, team, timeline?", placeholder: "Budget range, team composition, and timeline for execution..." },
  ];

  const body = `
    <h1>The Gate — Engagement Audit</h1>
    <p class="subtitle">5 questions · Not a contact form · A filter</p>
    <p>This is how Tony Greenberg decides who gets access. Not a contact form — an engagement audit. Five questions that separate people who want to talk about doing something from people who are actually doing it.</p>
    <div class="meta">FORM TYPE: Engagement qualification | QUESTIONS: 5 + contact info | URL: tonygreenberg.com/engage</div>

    <h2>Contact Information</h2>
    ${field("Full Name", "text", true, "Full name")}
    ${field("Email", "email", true, "your@email.com")}
    ${field("Company / Initiative Name", "text", false, "Company or initiative name (optional)")}

    <h2>The 5 Questions</h2>
    ${questions.map((q, i) => `
      <div class="question-block">
        <div class="question-number">QUESTION ${i + 1} OF 5 — ${q.label}</div>
        <div class="question-stem">${q.q}</div>
        <div class="field-placeholder">${q.placeholder}</div>
      </div>`).join("")}
  `;
  return wrap(
    "The Gate — Engagement Audit | Tony Greenberg",
    "Tony Greenberg's 5-question engagement audit. Not a contact form — a filter. Five questions that separate people who want to talk about doing something from people who are actually doing it.",
    "/engage",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   6. COMMUNITY — Join Form
══════════════════════════════════════════════════════════════ */
export function renderCommunityHTML(): string {
  const lookingFor = ["Co-founders", "Collaborators", "Investors", "Advisors", "Clients", "Peers", "Mentors", "Mentees", "Research Partners", "Community"];
  const interests = ["Psychedelics", "Peptides", "AI", "Impact Investing", "Consciousness", "Longevity", "Systems Thinking", "Regenerative Business", "Web3", "Climate", "Mental Health", "Biohacking", "Entrepreneurship", "Philosophy", "Spirituality"];

  const body = `
    <h1>Community — Tony Greenberg's Network</h1>
    <p class="subtitle">Join the community of builders, thinkers, and impact operators</p>
    <p>A curated community of people working at the intersection of consciousness, technology, and impact. Join to connect with co-founders, collaborators, investors, and peers.</p>
    <div class="meta">FORM TYPE: Community membership | FIELDS: 8 + multi-select tags | URL: tonygreenberg.com/community</div>

    <h2>Profile Form</h2>
    ${field("Display Name", "text", true, "Your name")}
    ${field("Bio / About", "textarea", false, "Tell the community who you are and what you're building...")}
    ${field("Location", "text", false, "City, Country")}
    ${field("Website", "url", false, "https://...")}

    <h2>I'm Looking For (multi-select)</h2>
    <div class="field-block">
      <div class="field-label">Looking For</div>
      <div class="field-options">
        ${lookingFor.map(o => `<span class="tag">${o}</span>`).join(" ")}
      </div>
    </div>

    <h2>Interests (multi-select tags)</h2>
    <div class="field-block">
      <div class="field-label">Interest Tags</div>
      <div class="field-options">
        ${interests.map(t => `<span class="tag">${t}</span>`).join(" ")}
      </div>
    </div>

    <h2>Invite a Friend</h2>
    ${field("Friend's Email", "email", false, "friend@example.com")}
    ${field("Personal Message", "textarea", false, "Hey, I think you'd love this community...")}
  `;
  return wrap(
    "Community — Tony Greenberg's Network",
    "Join Tony Greenberg's curated community of builders, thinkers, and impact operators working at the intersection of consciousness, technology, and impact.",
    "/community",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   7. FIND YOUR THERAPY — Therapy Matching Assessment
══════════════════════════════════════════════════════════════ */
export function renderFindYourTherapyHTML(): string {
  const questions = [
    "When you're in pain, where does it live?",
    "When something goes wrong, what's your first move?",
    "What's your relationship with self-help books?",
    "How do you relate to your own thinking?",
    "What's your relationship with your body?",
    "When was the last time you cried?",
    "Where does stress show up in your body first?",
    "How do you process difficult experiences?",
    "What scares you most about going deeper?",
    "What happens when someone gets too close?",
    "Who do you become in conflict?",
    "What does trust feel like in your body?",
    "What does healing look like to you?",
    "Do you dream? And do the dreams mean something?",
    "What pattern keeps showing up in your life?",
    "What's your relationship with your family of origin?",
  ];

  const body = `
    <h1>Find Your Therapy</h1>
    <p class="subtitle">16 questions · Multi-axis matching · Personalized therapy modality recommendations</p>
    <p>Maps your psychological profile across cognitive, somatic, relational, and depth dimensions to recommend the most aligned therapy modalities for your specific patterns.</p>
    <div class="meta">ASSESSMENT TYPE: Therapy matching | QUESTIONS: 16 | AXES: cognitive, somatic, relational, depth | URL: tonygreenberg.com/find-your-therapy</div>

    <h2>Assessment Questions</h2>
    ${questions.map((q, i) => `
      <div class="question-block">
        <div class="question-number">QUESTION ${i + 1} OF 16</div>
        <div class="question-stem">${q}</div>
      </div>`).join("")}

    <h2>Email to Unlock Results</h2>
    ${field("Email Address", "email", true, "your@email.com")}
  `;
  return wrap(
    "Find Your Therapy | Tony Greenberg",
    "16-question therapy matching assessment. Maps your psychological profile across cognitive, somatic, relational, and depth dimensions to recommend aligned therapy modalities.",
    "/find-your-therapy",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   8. FIND YOUR ME — Self-Discovery Assessment
══════════════════════════════════════════════════════════════ */
export function renderFindYourMeHTML(): string {
  const questions = [
    "The conversation you wish someone would finally have with you is about...",
    "When you're alone at 2am and the masks are off, you're thinking about...",
    "If you could master one thing in the next year, you'd choose...",
    "The pattern you keep repeating — the one you're ready to break — is...",
    "The future you're building — whether you've admitted it yet or not — looks like...",
  ];

  const body = `
    <h1>Find My to Find Your We</h1>
    <p class="subtitle">5 NLP-driven questions · Routes you into the full ecosystem</p>
    <p>Five questions that reveal who you are and route you into the full ecosystem of articles, assessments, community, and satellite sites. The gateway to the whole Tony Greenberg universe.</p>
    <div class="meta">ASSESSMENT TYPE: Identity routing | QUESTIONS: 5 | ARCHETYPES: 5+ | URL: tonygreenberg.com/find-your-me</div>

    <h2>The 5 Questions</h2>
    ${questions.map((q, i) => `
      <div class="question-block">
        <div class="question-number">QUESTION ${i + 1} OF 5</div>
        <div class="question-stem">${q}</div>
      </div>`).join("")}
  `;
  return wrap(
    "Find My to Find Your We | Tony Greenberg",
    "5 NLP-driven questions that reveal who you are and route you into the full ecosystem of articles, assessments, community, and satellite sites.",
    "/find-your-me",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   9. DHARMA FINDER — 25-Question Dharma Assessment
══════════════════════════════════════════════════════════════ */
export function renderDharmaFinderHTML(): string {
  const sections = [
    {
      title: "Capacities",
      subtitle: "Removing limitations to see what emerges",
      questions: [
        "If you had no financial constraints, what would you spend your time doing?",
        "What would you do even if you knew you would fail?",
        "What activities make you lose track of time completely?",
        "If you could only do one type of work for the rest of your life, what would it be?",
        "What problems do you find yourself thinking about even when no one asked you to?",
      ]
    },
    {
      title: "Values",
      subtitle: "What you care about, love, find meaningful",
      questions: [
        "What injustice in the world makes you most angry?",
        "What kind of impact do you most want to have on others?",
        "What would you want written on your tombstone?",
        "What causes would you sacrifice significant personal comfort for?",
        "What does a life well-lived look like to you?",
      ]
    },
    {
      title: "Propensities",
      subtitle: "Your native gifts and intrinsic motivations",
      questions: [
        "What do people consistently come to you for help with?",
        "What skills did you develop so naturally that you forgot others find them hard?",
        "What were you doing the last time someone said 'you're really good at this'?",
        "What type of problems do you solve better than most people you know?",
        "What would your closest friends say is your greatest gift?",
      ]
    },
    {
      title: "The Shadow Inquiry",
      subtitle: "What is not dharma — the honest reckoning",
      questions: [
        "What are you doing right now primarily for money, status, or approval — not because it lights you up?",
        "What have you been avoiding that you know you're meant to do?",
        "What would you stop doing immediately if you weren't afraid of what others would think?",
        "What part of your work feels like performance rather than expression?",
        "Where are you deceiving yourself? Where are you not living in alignment with your own values — and what would change if you stopped?",
      ]
    },
  ];

  const body = `
    <h1>Dharma Finder</h1>
    <p class="subtitle">25 questions distilled from Schmachtenberger's Dharma Inquiry · 4 sections</p>
    <p>A deep inquiry into your capacities, values, propensities, and shadows — designed to surface what you're actually here to do, as opposed to what you've been conditioned to pursue.</p>
    <div class="meta">ASSESSMENT TYPE: Purpose / dharma mapping | QUESTIONS: 25 | SECTIONS: 4 | SOURCE: Daniel Schmachtenberger's Dharma Inquiry | URL: tonygreenberg.com/dharma-finder</div>

    ${sections.map(s => `
      <div class="section-header">
        <h2>${s.title}</h2>
        <p>${s.subtitle}</p>
      </div>
      ${s.questions.map((q, i) => `
        <div class="question-block">
          <div class="question-stem">${q}</div>
        </div>`).join("")}
    `).join("")}
  `;
  return wrap(
    "Your Dharma Profile — Tony Greenberg",
    "25-question dharma assessment distilled from Daniel Schmachtenberger's Dharma Inquiry. Maps capacities, values, propensities, and shadows to surface your true purpose.",
    "/dharma-finder",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   10. GRANT STUDY — Harvard Grant Study Life Assessment
══════════════════════════════════════════════════════════════ */
export function renderGrantStudyHTML(): string {
  const factors = [
    { name: "Relationships", questions: [
      "How many people in your life could you call at 3am in a genuine crisis — and they would answer?",
      "In your closest relationship, how often do you feel truly seen — not just heard, but understood at a level beyond words?",
      "When was the last time you were genuinely vulnerable with someone — shared something that scared you to say?",
      "How would you describe the quality of your family relationships (chosen or biological)?",
      "Do you have a community — a group of people who share your values and hold you accountable?",
    ]},
    { name: "Adaptive Coping", questions: [
      "When life hits you with something unexpected and painful, your first response is usually:",
      "How do you relate to your own anger?",
      "When you fail at something important, your inner narrative sounds like:",
      "How often do you use humor to process difficult situations?",
      "Do you have practices (therapy, meditation, journaling, movement) that help you process emotions?",
    ]},
    { name: "Education & Intellectual Vitality", questions: [
      "How often do you actively seek out ideas that challenge your current worldview?",
      "When was the last time you learned something that genuinely changed how you think?",
      "How do you relate to not knowing something?",
      "What's your relationship with formal and informal learning?",
      "How often do you engage in deep, focused thinking — not scrolling, not multitasking?",
    ]},
    { name: "Mature Defenses", questions: [
      "When you're under significant stress, how do you typically respond?",
      "How do you handle situations where you have no control over the outcome?",
      "When someone criticizes you, what's your internal experience?",
      "How do you relate to your own mortality?",
      "What's your relationship with uncertainty about the future?",
    ]},
    { name: "Physical Health Habits", questions: [
      "How would you describe your relationship with your body?",
      "How consistent are you with sleep, movement, and nutrition?",
      "How often do you experience chronic pain, fatigue, or physical symptoms that limit your life?",
      "How do you relate to aging and physical decline?",
      "What's your relationship with substances (alcohol, caffeine, medications, recreational)?",
    ]},
  ];

  const body = `
    <h1>Grant Study Assessment</h1>
    <p class="subtitle">25 questions · 5 factors · Based on Harvard's 85-year longitudinal study</p>
    <p>Measures your life satisfaction across the five factors the Harvard Grant Study identified as most predictive of lifelong wellbeing. Based on 85 years of research tracking 724 men from young adulthood through old age.</p>
    <div class="meta">ASSESSMENT TYPE: Life satisfaction / wellbeing | QUESTIONS: 25 | FACTORS: 5 | SOURCE: Harvard Grant Study (85-year longitudinal) | URL: tonygreenberg.com/grant-study</div>

    ${factors.map(f => `
      <div class="section-header">
        <h2>${f.name}</h2>
      </div>
      ${f.questions.map(q => `
        <div class="question-block">
          <div class="question-stem">${q}</div>
        </div>`).join("")}
    `).join("")}
  `;
  return wrap(
    "Grant Study Assessment — Tony Greenberg",
    "25-question life satisfaction assessment based on the Harvard Grant Study's 85-year findings. Measures relationships, adaptive coping, intellectual vitality, mature defenses, and physical health.",
    "/grant-study",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   11. LIFE ASSESSMENT — The Mirror
══════════════════════════════════════════════════════════════ */
export function renderLifeAssessmentHTML(): string {
  const dimensions = [
    { name: "Purpose & Meaning", desc: "How clearly you understand your reason for being here and whether your daily life reflects it" },
    { name: "Relationships & Connection", desc: "The depth, quality, and reciprocity of your most important relationships" },
    { name: "Health & Vitality", desc: "Physical energy, mental clarity, and your relationship with your body" },
    { name: "Financial Sovereignty", desc: "Not just money — the degree to which your financial life enables rather than constrains your choices" },
    { name: "Growth & Learning", desc: "Whether you're expanding or contracting intellectually, emotionally, and professionally" },
    { name: "Contribution & Impact", desc: "How much of what you do actually matters to anyone beyond yourself" },
  ];

  const body = `
    <h1>Life Assessment — The Mirror</h1>
    <p class="subtitle">18 questions · 6 dimensions · A radar chart that doesn't care about your feelings</p>
    <p>A rigorous self-assessment across 6 life dimensions. Produces a radar chart showing where you're thriving and where you're avoiding. Not a wellness quiz — a mirror.</p>
    <div class="meta">ASSESSMENT TYPE: Life audit | QUESTIONS: 18 | DIMENSIONS: 6 | URL: tonygreenberg.com/life-assessment</div>

    <h2>The 6 Dimensions</h2>
    <table>
      <tr><th>Dimension</th><th>What It Measures</th></tr>
      ${dimensions.map(d => `<tr><td><strong>${d.name}</strong></td><td>${d.desc}</td></tr>`).join("")}
    </table>

    <h2>How It Works</h2>
    <p>Each dimension is scored on a 1–10 scale across 3 questions. Your answers generate a radar chart showing your current life profile. The assessment takes approximately 5 minutes.</p>
    ${field("Email Address", "email", false, "your@email.com — optional, to save and share your results")}
  `;
  return wrap(
    "Life Assessment — The Mirror | Tony Greenberg",
    "18-question life assessment across 6 dimensions: purpose, relationships, health, financial sovereignty, growth, and contribution. Produces a radar chart of your current life profile.",
    "/life-assessment",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   12. SOULSCORE — Impact Measurement Platform
══════════════════════════════════════════════════════════════ */
export function renderSoulScoreHTML(): string {
  const entityTypes = ["Individual", "Gig Worker", "Team", "Company", "CEO", "Supply Chain", "Fund", "Tokenized Asset"];
  const axes = [
    "Environmental Impact", "Social Justice", "Labor Practices", "Community Investment",
    "Governance Transparency", "Cultural Preservation", "Health & Wellbeing", "Economic Equity",
    "Innovation for Good", "Consciousness Leadership", "Regenerative Practices", "Long-term Thinking"
  ];

  const body = `
    <h1>SoulScore — Impact Measurement Platform</h1>
    <p class="subtitle">12-axis impact scoring · For individuals, teams, companies, and tokenized assets</p>
    <p>SoulScore is a 12-axis impact measurement system that eliminates single-dimension ESG gaming. Measures individuals, gig workers, teams, companies, CEOs, supply chains, funds, and tokenized assets on the same universal scale.</p>
    <div class="meta">PLATFORM TYPE: Impact measurement | AXES: 12 | ENTITY TYPES: 8 | URL: tonygreenberg.com/soulscore</div>

    <h2>Entity Types Measured</h2>
    <div class="field-block">
      <div class="field-label">Select Entity Type</div>
      <div class="field-options">
        ${entityTypes.map(e => `<span class="tag">${e}</span>`).join(" ")}
      </div>
    </div>

    <h2>The 12 Impact Axes</h2>
    <table>
      <tr><th>#</th><th>Axis</th></tr>
      ${axes.map((a, i) => `<tr><td style="color:#D4B96A;font-family:monospace">${String(i+1).padStart(2,"0")}</td><td>${a}</td></tr>`).join("")}
    </table>

    <h2>Why SoulScore Exists</h2>
    <p>Every impact platform that came before failed because they built dashboards on broken data. SoulScore is AI-native — data collection first, measurement auto-generates. On-chain verification eliminates self-reported data fraud.</p>
  `;
  return wrap(
    "SoulScore — Impact Measurement Platform | Tony Greenberg",
    "12-axis impact measurement system for individuals, teams, companies, and tokenized assets. Eliminates single-dimension ESG gaming with AI-native architecture.",
    "/soulscore",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   13. PROTECTING YOUR BUSINESS — Report Form
══════════════════════════════════════════════════════════════ */
export function renderProtectingYourBusinessHTML(): string {
  const body = `
    <h1>Protecting Your Business</h1>
    <p class="subtitle">A documented case study in business fraud — and a tool to report similar incidents</p>
    <p>A detailed case study on business fraud, embezzlement, and manipulation tactics — with a reporting tool for others who have experienced similar situations. Includes a 12-point protection checklist and background check resources.</p>
    <div class="meta">PAGE TYPE: Case study + reporting tool | FORM FIELDS: 9 | URL: tonygreenberg.com/protecting-your-business</div>

    <h2>Report Your Experience</h2>
    <p>If you have experienced fraud, embezzlement, or business manipulation, submit your case here. All submissions are reviewed and may be added to the public record.</p>
    ${field("Your Relationship to the Subject", "text", true, "e.g., Employer, Client, Business Partner")}
    ${field("Location of Incident", "text", false, "e.g., Santa Monica, CA")}
    ${field("Time Period", "text", false, "e.g., Jan 2024 – Jun 2024")}
    ${field("What Happened", "textarea", true, "Describe the situation in detail. What were you promised? What actually happened? Include amounts, dates, and any documentation you have. (Minimum 50 characters)")}
    ${field("Financial Amount Involved", "text", false, "e.g., $15,000")}
    ${field("Documentation Available", "text", false, "e.g., Yes — emails, signed contract, bank records")}
    ${field("Your Email", "email", true, "your@email.com")}

    <h2>Page Sections</h2>
    <table>
      <tr><th>Section</th><th>Content</th></tr>
      <tr><td>The Case</td><td>Documented case study of business fraud and embezzlement</td></tr>
      <tr><td>Timeline</td><td>Chronological record of events</td></tr>
      <tr><td>The Playbook</td><td>Manipulation tactics used — pattern recognition guide</td></tr>
      <tr><td>10 Red Flags</td><td>Warning signs to watch for in business relationships</td></tr>
      <tr><td>The Real Cost</td><td>Financial and reputational damage analysis</td></tr>
      <tr><td>Background Checks</td><td>Resources for vetting business partners</td></tr>
      <tr><td>12-Point Checklist</td><td>Protection framework for business owners</td></tr>
      <tr><td>Prevention Tools</td><td>Contracts, verification tools, and due diligence resources</td></tr>
    </table>
  `;
  return wrap(
    "Protecting Your Business | Tony Greenberg",
    "A documented case study in business fraud and a reporting tool for similar incidents. Includes 10 red flags, a 12-point protection checklist, and background check resources.",
    "/protecting-your-business",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   CHARITY SCORECARD — Charity Rankings & Due Diligence
══════════════════════════════════════════════════════════════ */
export function renderCharityScorecardHTML(): string {
  const body = `
    <h1>Charity Scorecard</h1>
    <p class="subtitle">Due diligence rankings for charitable organizations</p>
    <p>An independent scorecard evaluating charities across transparency, impact, overhead efficiency, and accountability. Rankings, detailed scorecards, and evaluator analysis — all in one place.</p>
    <div class="meta">PAGE TYPE: Charity due diligence | TABS: Rankings, Scorecard, Evaluators | URL: tonygreenberg.com/charity-scorecard</div>

    <h2>Scoring Dimensions</h2>
    <table>
      <tr><th>Dimension</th><th>What It Measures</th></tr>
      <tr><td><strong>Transparency</strong></td><td>Financial disclosure, leadership visibility, program reporting</td></tr>
      <tr><td><strong>Impact</strong></td><td>Measurable outcomes, beneficiary reach, program effectiveness</td></tr>
      <tr><td><strong>Overhead Efficiency</strong></td><td>Ratio of program expenses to administrative costs</td></tr>
      <tr><td><strong>Accountability</strong></td><td>Board governance, independent audits, complaint resolution</td></tr>
    </table>

    <h2>Transparency Status Levels</h2>
    <table>
      <tr><th>Status</th><th>Meaning</th></tr>
      <tr><td class="status-approved">Clear</td><td>Full financial and operational transparency</td></tr>
      <tr><td style="color:#86EFAC">Mostly Clear</td><td>Good transparency with minor gaps</td></tr>
      <tr><td class="status-grey">Hazy</td><td>Partial disclosure, some concerning gaps</td></tr>
      <tr><td class="status-banned">Opaque</td><td>Significant transparency failures</td></tr>
    </table>

    <h2>Search &amp; Filter</h2>
    ${field("Search Charities", "text", false, "Search by name, sector, or keyword...")}
  `;
  return wrap(
    "Charity Scorecard | Tony Greenberg",
    "Independent due diligence rankings for charitable organizations. Scores transparency, impact, overhead efficiency, and accountability.",
    "/charity-scorecard",
    body
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════════════════════════════════ */
function field(label: string, type: string, required: boolean, placeholder: string): string {
  const inputName = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const inputEl = type === 'textarea'
    ? `<textarea name="${inputName}" id="${inputName}" placeholder="${placeholder}" ${required ? 'required' : ''} rows="3" style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.4rem 0.6rem;border-radius:2px;font-family:inherit;font-size:0.85rem;margin-top:0.4rem"></textarea>`
    : `<input type="${type}" name="${inputName}" id="${inputName}" placeholder="${placeholder}" ${required ? 'required' : ''} style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.4rem 0.6rem;border-radius:2px;font-family:inherit;font-size:0.85rem;margin-top:0.4rem" />`;
  return `<div class="field-block">
    <label for="${inputName}">
      <span class="field-label">${label}</span>
      <span class="field-type">[${type}]</span>
      ${required ? '<span class="field-required">* required</span>' : ''}
    </label>
    <div class="field-placeholder">${placeholder}</div>
    ${inputEl}
  </div>`;
}

function fieldSelect(label: string, required: boolean, options: string[]): string {
  const inputName = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const optionsHTML = options.map(o => `<option value="${o.toLowerCase().replace(/[^a-z0-9]+/g, '_')}">${o}</option>`).join("");
  return `<div class="field-block">
    <label for="${inputName}">
      <span class="field-label">${label}</span>
      <span class="field-type">[select]</span>
      ${required ? '<span class="field-required">* required</span>' : ''}
    </label>
    <select name="${inputName}" id="${inputName}" ${required ? 'required' : ''} style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.4rem 0.6rem;border-radius:2px;font-family:inherit;font-size:0.85rem;margin-top:0.4rem">
      <option value="">— Select —</option>
      ${optionsHTML}
    </select>
    <ul class="field-options">
      ${options.map(o => `<li>${o}</li>`).join("")}
    </ul>
  </div>`;
}

function fieldUpload(label: string, required: boolean, description: string): string {
  const inputName = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `<div class="field-block">
    <label for="${inputName}">
      <span class="field-label">${label}</span>
      <span class="field-type">[file upload — PDF, DOC, JPG, PNG, max 10MB]</span>
      ${required ? '<span class="field-required">* required</span>' : ''}
    </label>
    <div class="field-placeholder">${description}</div>
    <input type="file" name="${inputName}" id="${inputName}" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" ${required ? 'required' : ''} style="width:100%;background:#0A0A10;color:#E8E4D8;border:1px solid #333;padding:0.4rem 0.6rem;border-radius:2px;font-family:inherit;font-size:0.85rem;margin-top:0.4rem" />
  </div>`;
}
