/**
 * Server-Side Rendering for the Psychedelic Readiness Index (PRI)
 * Serves full semantic HTML to search engine bots and AI crawlers
 * so the content is indexable, quotable, and machine-legible.
 *
 * The PRI is an interactive assessment tool — the SSR version provides
 * a comprehensive text description of the tool, its 6 domains, 26 medicines,
 * safety data, and methodology so crawlers understand the page's value.
 *
 * PERMANENT RULE: Every page unblocked for indexing MUST have server-rendered HTML.
 * Content must be visible in View Source without JavaScript execution.
 */

const BASE_URL = "https://tonygreenberg.com";
const CANONICAL = `${BASE_URL}/psychedelic-readiness-index`;
const OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/JrEwHESJubtCJhAB.jpg";

const TITLE = "Psychedelic Readiness Index — Know Before You Go";
const DESCRIPTION = "A comprehensive 6-domain, 50+ question readiness assessment covering 26 plant medicines and psychedelic compounds. Evaluates medical safety, pharmacological interactions, psychological stability, intention clarity, setting preparation, and integration planning. Built by Tony Greenberg with clinical research citations.";

const MEDICINES_LIST = [
  { name: "Psilocybin Mushrooms", latin: "Psilocybe cubensis", category: "Classic Tryptamine" },
  { name: "Ayahuasca", latin: "Banisteriopsis caapi + Psychotria viridis", category: "DMT + MAO Inhibitor" },
  { name: "MDMA Therapy", latin: "3,4-Methylenedioxymethamphetamine", category: "Empathogen" },
  { name: "Ketamine", latin: "NMDA Receptor Antagonist", category: "Dissociative" },
  { name: "LSD", latin: "Lysergic acid diethylamide", category: "Serotonergic" },
  { name: "DMT / 5-MeO-DMT", latin: "N,N-Dimethyltryptamine", category: "Tryptamine" },
  { name: "Iboga (Whole Plant)", latin: "Tabernanthe iboga", category: "Bwiti Sacrament" },
  { name: "Ibogaine (Isolated Alkaloid)", latin: "Ibogaine HCl", category: "Clinical Isolate" },
  { name: "Peyote / Mescaline", latin: "Lophophora williamsii", category: "Phenethylamine" },
  { name: "San Pedro / Huachuma", latin: "Echinopsis pachanoi", category: "Phenethylamine" },
  { name: "Kambo", latin: "Phyllomedusa bicolor", category: "Peptide (Non-Psychedelic)" },
  { name: "Rapeh (Hape)", latin: "Nicotiana rustica + ash", category: "Sacred Tobacco" },
  { name: "Sananga Eye Drops", latin: "Tabernaemontana undulata", category: "Amazonian Eye Medicine" },
  { name: "Cannabis (Ceremonial)", latin: "Cannabis sativa/indica", category: "Cannabinoid" },
  { name: "Salvia divinorum", latin: "Sage of the Diviners", category: "Kappa-Opioid Agonist" },
  { name: "Yopo / Vilca", latin: "Anadenanthera peregrina", category: "Seed Snuff" },
  { name: "Lion's Mane Stack", latin: "Hericium erinaceus", category: "Neuroplasticity (Non-Psychedelic)" },
  { name: "Iboga Microdose (Root Bark)", latin: "Tabernanthe iboga (sub-flood)", category: "Maintenance Protocol" },
  { name: "Amanita muscaria", latin: "Fly Agaric", category: "GABAergic / Muscimol" },
  { name: "Blue Lotus", latin: "Nymphaea caerulea", category: "Apomorphine Alkaloid" },
  { name: "Kanna", latin: "Sceletium tortuosum", category: "SRI (Serotonin Reuptake Inhibitor)" },
  { name: "Sassafras / MDA", latin: "Sassafras albidum", category: "Empathogen-Entactogen" },
  { name: "Soma (Theoretical)", latin: "Amanita / Ephedra / Peganum", category: "Vedic Sacrament" },
  { name: "Cacao (Ceremonial)", latin: "Theobroma cacao", category: "Heart Opener (Non-Psychedelic)" },
  { name: "Microdosing Protocol", latin: "Fadiman / Stamets Stack", category: "Sub-Perceptual" },
  { name: "Nitrous Oxide", latin: "N2O", category: "Dissociative (Short-Acting)" },
];

const DOMAINS = [
  { name: "Medical & Physical Health", icon: "🏥", description: "Cardiovascular screening, neurological history, pregnancy, liver/kidney function, diabetes, immunocompromised status. Hard stops for cardiac history, seizures, pregnancy." },
  { name: "Pharmacological Safety", icon: "💊", description: "MAOI interactions, MAO-B/Parkinson's drugs, SSRIs/SNRIs, lithium (hard stop), stimulants, tramadol/serotonergic opioids, St. John's Wort, 5-HTP. Includes washout period guidance." },
  { name: "Psychological Stability", icon: "🧠", description: "Schizophrenia/psychosis screening (hard stop), bipolar Type I family history, mania, active suicidal ideation, dissociative disorders, personality disorders, trauma readiness." },
  { name: "Set & Intention", icon: "🎯", description: "Clarity of purpose, emotional stability, relationship to control, curiosity vs. escapism, willingness to face difficult material, journaling/preparation practices." },
  { name: "Setting & Support", icon: "🌍", description: "Trusted sitter/facilitator, safe physical environment, post-experience support network, emergency plan, legal context, travel/logistics considerations." },
  { name: "Integration Planning", icon: "🔄", description: "Therapist/integration circle, journaling practice, time off work, somatic processing, community support, follow-up protocol, lifestyle changes." },
];

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderPRIHTML(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web Browser",
    author: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: BASE_URL,
    },
    datePublished: "2026-03-01",
    dateModified: new Date().toISOString().split("T")[0],
    keywords: [
      "psychedelic readiness assessment",
      "plant medicine safety",
      "psilocybin readiness",
      "ayahuasca screening",
      "ibogaine safety",
      "MDMA therapy eligibility",
      "ketamine assessment",
      "drug interaction checker",
      "MAO-B interaction matrix",
      "psychedelic harm reduction",
      "set and setting",
      "integration planning",
    ],
  };

  const medicineListHTML = MEDICINES_LIST.map(m =>
    `<li><strong>${m.name}</strong> (<em>${m.latin}</em>) — ${m.category}</li>`
  ).join("\n      ");

  const domainListHTML = DOMAINS.map(d =>
    `<li><strong>${d.icon} ${d.name}</strong>: ${d.description}</li>`
  ).join("\n      ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(TITLE)} — Tony Greenberg</title>
  <meta name="description" content="${escapeAttr(DESCRIPTION)}" />
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${CANONICAL}" />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeAttr(TITLE)}" />
  <meta property="og:description" content="${escapeAttr(DESCRIPTION)}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(TITLE)}" />
  <meta property="og:url" content="${CANONICAL}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(TITLE)}" />
  <meta name="twitter:description" content="${escapeAttr(DESCRIPTION)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta name="twitter:image:alt" content="${escapeAttr(TITLE)}" />
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body { font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-top: 2.5rem; }
    h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; margin-top: 2rem; }
    a { color: #8B6914; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    .disclaimer { background: #fff3cd; border: 1px solid #ffc107; padding: 1rem; border-radius: 4px; margin: 1.5rem 0; font-size: 0.9rem; }
    .cta { background: #8B6914; color: #fff; padding: 1rem 2rem; border-radius: 4px; display: inline-block; text-decoration: none; font-weight: bold; margin-top: 1rem; }
    .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <h1>Psychedelic Readiness Index</h1>
      <p class="meta">By <a href="${BASE_URL}/about">Tony Greenberg</a> · Interactive Assessment Tool · <a href="${CANONICAL}">Take the Assessment</a></p>
      <p><strong>Know Before You Go.</strong> A comprehensive readiness assessment for 26 plant medicines and psychedelic compounds, evaluating safety across 6 clinical domains with 50+ screening questions.</p>
    </header>

    <div class="disclaimer">
      <strong>Medical Disclaimer:</strong> This tool is for educational and harm-reduction purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before considering any psychedelic experience. Psychedelic-assisted therapies remain investigational in most jurisdictions.
    </div>

    <h2>The Six Assessment Domains</h2>
    <p>Each domain evaluates a critical dimension of readiness. Questions are scored on a 5-point scale and classified by severity: <strong>Hard Stop</strong> (absolute contraindication), <strong>Caution</strong> (requires medical consultation), or <strong>Standard</strong> (normal scoring).</p>
    <ul>
      ${domainListHTML}
    </ul>

    <h2>26 Medicines Covered</h2>
    <p>The Psychedelic Readiness Index provides substance-specific readiness profiles, safety data, contraindications, drug interactions, pricing ranges, provider recommendations, and tradition/lineage context for each of the following:</p>
    <ol>
      ${medicineListHTML}
    </ol>

    <h2>Key Safety Features</h2>
    <ul>
      <li><strong>MAO-B Interaction Matrix</strong> — The Parkinson's drug interaction most people miss. Covers rasagiline (Azilect), selegiline (Eldepryl/Zelapar), safinamide (Xadago) interactions with every psychedelic compound.</li>
      <li><strong>Medication Interaction Checker</strong> — SSRIs, SNRIs, lithium, benzodiazepines, stimulants, tramadol, St. John's Wort, and 50+ common medications cross-referenced against each substance.</li>
      <li><strong>Hard Stop Screening</strong> — Absolute contraindications that immediately flag (cardiac history, seizure disorders, schizophrenia/psychosis, pregnancy, lithium use).</li>
      <li><strong>Washout Period Guidance</strong> — How long to taper/discontinue medications before specific experiences, with clinical citations.</li>
      <li><strong>Crisis Resources</strong> — Fireside Project Psychedelic Support Line, SAMHSA National Helpline, 988 Suicide & Crisis Lifeline.</li>
    </ul>

    <h2>How It Works</h2>
    <ol>
      <li><strong>Select your medicine</strong> — Choose from 26 substances, each with a detailed safety profile.</li>
      <li><strong>Answer readiness questions</strong> — 50+ questions across 6 domains, tailored to your selected substance.</li>
      <li><strong>Receive your readiness score</strong> — Color-coded results (Green/Yellow/Red) with specific recommendations per domain.</li>
      <li><strong>Review safety data</strong> — Contraindications, drug interactions, side effects, legal status, and provider recommendations.</li>
      <li><strong>Plan your integration</strong> — Resources for therapists, integration circles, journaling protocols, and follow-up care.</li>
    </ol>

    <h2>Who This Is For</h2>
    <ul>
      <li>Individuals considering a first psychedelic experience who want to assess their readiness</li>
      <li>Experienced practitioners evaluating a new substance or revisiting readiness after life changes</li>
      <li>Therapists and facilitators screening clients for psychedelic-assisted therapy eligibility</li>
      <li>Harm reduction advocates seeking a structured, evidence-based screening tool</li>
      <li>Anyone taking medications who needs to understand pharmacological interactions</li>
    </ul>

    <h2>Research Foundation</h2>
    <p>The Psychedelic Readiness Index draws on peer-reviewed clinical research including:</p>
    <ul>
      <li>Carhart-Harris, R.L. & Friston, K.J. (2019). "REBUS and the Anarchic Brain." <em>Pharmacological Reviews</em>, 71(3), 316-344.</li>
      <li>Mitchell, J.M. et al. (2023). "MDMA-assisted therapy for moderate to severe PTSD." <em>Nature Medicine</em>, 29, 2473-2480.</li>
      <li>Johnson, M.W. et al. (2014). "Pilot study of psilocybin for tobacco addiction." <em>Journal of Psychopharmacology</em>, 28(11), 983-992.</li>
      <li>Noller, G.E. et al. (2018). "Ibogaine treatment outcomes for opioid dependence." <em>American Journal of Drug and Alcohol Abuse</em>, 44(1), 24-36.</li>
      <li>Murrough, J.W. et al. (2013). "Antidepressant efficacy of ketamine." <em>American Journal of Psychiatry</em>, 170(10).</li>
    </ul>

    <p><a class="cta" href="${CANONICAL}">Take the Psychedelic Readiness Index →</a></p>

    <footer class="footer">
      <p><strong>Tony Greenberg</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. He is an investor in MycoMedica Life Sciences (Paul Stamets's patent portfolio company) and has six active investments in the psychedelic medicine space.</p>
      <p><a href="${CANONICAL}">Take the full interactive assessment →</a></p>
    </footer>
  </article>
</body>
</html>`;
  return html;
}
