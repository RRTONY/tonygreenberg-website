/**
 * SSR Batch 2 — Remaining non-blog sitemap pages
 * Adds SSR coverage for all pages not yet handled by ssr-pages.ts, ssr-forms.ts,
 * ssr-brewsoul.ts, or ssr-blog-batch.ts.
 *
 * PERMANENT RULE: Every page in the sitemap MUST have server-rendered HTML.
 * Content must be visible in View Source without JavaScript execution.
 */

const BASE_URL = "https://tonygreenberg.com";
const DEFAULT_SOCIAL_IMAGE = `${BASE_URL}/api/img/tony-headshot_2d63de23.jpg`;

function normalizeMediaUrls(html: string): string {
  return html
    .replace(/https?:\/\/(?:private-us-east-1|files)\.manuscdn\.com[^"'\s<)]*/gi, DEFAULT_SOCIAL_IMAGE)
    .replace(/(?:https?:\/\/tonygreenberg\.com)?\/manus-storage\/([^"'\s<)]+)/gi, `${BASE_URL}/api/img/$1`)
    .replace(/\$\{BASE_URL\}\/og-default\.jpg/gi, DEFAULT_SOCIAL_IMAGE);
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TONY_PERSON_B2 = {
  "@type": "Person",
  "@id": "https://tonygreenberg.com/#tony-greenberg",
  name: "Tony Greenberg",
  jobTitle: "Investor, Systems Thinker, Builder",
  description: "Twenty-five years of enterprise technology, impact investing, psychedelic medicine, and trying to make capitalism less extractive.",
  url: "https://tonygreenberg.com",
  sameAs: [
    "https://www.linkedin.com/in/tonygreenberg",
    "https://x.com/ThinkTony",
    "https://tonygreenberg.com",
  ],
};

function wrapPage(opts: {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  body: string;
  jsonLd?: object;
  jsonLdExtra?: object[];
}): string {
  const { title, description, keywords, canonical, body, jsonLd, jsonLdExtra } = opts;
  const resolvedDescription = description.trim().length >= 70
    ? description.trim()
    : `${description.trim()} Explore Tony Greenberg's work on systems, trust, capital, and what comes next.`;
  const fullTitle = title.includes("Tony Greenberg") ? title : `${title} — Tony Greenberg`;
  const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com", "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://tonygreenberg.com/search?q={search_term_string}" }, "query-input": "required name=search_term_string" } };
  return normalizeMediaUrls(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(fullTitle)}</title>
  <meta name="description" content="${escapeAttr(resolvedDescription)}" />
  ${keywords ? `<meta name="keywords" content="${escapeAttr(keywords)}" />` : ""}
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeAttr(fullTitle)}" />
  <meta property="og:description" content="${escapeAttr(resolvedDescription)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:image" content="${DEFAULT_SOCIAL_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Tony Greenberg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(fullTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(resolvedDescription)}" />
  <meta name="twitter:image" content="${DEFAULT_SOCIAL_IMAGE}" />
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
  ${jsonLdExtra ? jsonLdExtra.map((s: object) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n  ") : ""}
  <style>
    body { font-family: 'Source Sans 3', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; line-height: 1.15; margin-bottom: 1rem; }
    h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; margin-top: 2.5rem; line-height: 1.2; }
    h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; margin-top: 2rem; }
    a { color: #8B6914; }
    blockquote { border-left: 3px solid #D4B96A; padding-left: 1rem; margin-left: 0; font-style: italic; color: #444; }
    .principle { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .nav-links { display: flex; flex-wrap: wrap; gap: 1rem; margin: 2rem 0; }
    .nav-links a { background: #f5f5f0; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; color: #1a1a2e; border: 1px solid #e0e0e0; }
    .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
    .stat { display: inline-block; margin-right: 2rem; margin-bottom: 1rem; }
    .stat strong { display: block; font-size: 1.5rem; color: #8B6914; }
  </style>
</head>
<body>
  ${body}
  <footer class="footer">
    <p><strong>Tony Greenberg</strong> — Only Time Buys Trust. <a href="${BASE_URL}">tonygreenberg.com</a> · <a href="https://ramprate.com">ramprate.com</a> · <a href="https://impactsoul.is">impactsoul.is</a></p>
    <p><a href="${canonical}">View the full interactive version →</a></p>
  </footer>
</body>
</html>`);
}

// ── Core identity pages ──

export function renderSelfPortraitHTML(): string {
  return wrapPage({
    title: "Self-Portrait — The Composite You",
    description: "A unified visualization combining all your assessment dimensions into one identity map. Where your scores across health, mind, relationships, and purpose converge.",
    keywords: "self-portrait, identity assessment, composite profile, Tony Greenberg",
    canonical: `${BASE_URL}/self-portrait`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Self-Portrait — The Composite You",
      "url": "https://tonygreenberg.com/self-portrait",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Self-Portrait — The Composite You</h1>
      <p><em>Where your scores across health, mind, relationships, and purpose converge into a single identity map.</em></p>
    </header>
    <section>
      <h2>What This Is</h2>
      <p>The Self-Portrait pulls together every assessment you've taken — your Soul Score, your attachment style, your therapy match, your peptide profile, your spiritual archetype — and renders them as a unified picture of who you are right now.</p>
      <p>Not who you want to be. Not who you were. Who you are, measured across the dimensions that actually matter.</p>
    </section>
    <section>
      <h2>The Dimensions</h2>
      <ul>
        <li><strong>Mind:</strong> Consciousness Scale score, Dharma Finder archetype, Grant Study resilience markers</li>
        <li><strong>Body:</strong> Peptide protocol fit, movement style, sleep chronotype, dietary approach</li>
        <li><strong>Relationships:</strong> Attachment style, love language, spiritual archetype</li>
        <li><strong>Purpose:</strong> Soul Score alignment, life assessment gaps, journey path</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/soulscore">Soul Score</a>
      <a href="${BASE_URL}/life-assessment">Life Assessment</a>
      <a href="${BASE_URL}/find-my">Find What's Yours</a>
    </nav>
  </article>`
  });
}

export function renderTheLetterHTML(): string {
  return wrapPage({
    title: "The Letter — Tony Greenberg",
    description: "A direct letter from Tony Greenberg. The context, the stakes, and why this site exists. Read this first.",
    keywords: "Tony Greenberg letter, personal statement, context",
    canonical: `${BASE_URL}/the-letter`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Letter — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-letter",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/the-letter" }
    },
    body: `<article>
    <header>
      <h1>The Letter</h1>
      <p><em>Read this first. Everything else makes more sense after.</em></p>
    </header>
    <section>
      <h2>Why This Exists</h2>
      <p>Twenty-five years of work across enterprise technology, psychedelic medicine, impact investing, and regenerative capital. This site is the attempt to make sense of it — to show how the threads connect, where the patterns lead, and what it all means for what comes next.</p>
      <p>Tony Greenberg has been in the room when billion-dollar decisions were made, when FDA breakthrough therapies were filed, when communities were built and broken. The letter is the context for all of it.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/seven-doors">The Seven Doors</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/start-here">Start Here</a>
    </nav>
  </article>`
  });
}

// ── Content hubs ──

export function renderJourneysHTML(): string {
  return wrapPage({
    title: "Journeys — Tony Greenberg",
    description: "Tony Greenberg's travels, experiences, and the places that shaped his thinking. From Santa Monica to the world.",
    keywords: "Tony Greenberg travels, journeys, experiences, places",
    canonical: `${BASE_URL}/journeys`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Journeys — Tony Greenberg",
      "url": "https://tonygreenberg.com/journeys",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Journeys</h1>
      <p><em>The places that shaped the thinking. From Santa Monica to the world.</em></p>
    </header>
    <section>
      <h2>Why Place Matters</h2>
      <p>Every significant shift in Tony Greenberg's thinking has been preceded by a physical journey. The Amazon basin. The Bwiti ceremony in Gabon. The Summit Series in Utah. The kava bars of Fiji. The data centers of Northern Virginia.</p>
      <p>Place is not backdrop. It's the curriculum.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-journey">Find Your Journey</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/seven-doors">Seven Doors</a>
    </nav>
  </article>`
  });
}

export function renderSeriesHTML(): string {
  return wrapPage({
    title: "Series — Curated Essay Collections",
    description: "Curated essay collections — multi-part investigations into blockchain, trust, communication, and the future of business.",
    keywords: "essay series, blockchain, trust, communication, business, Tony Greenberg",
    canonical: `${BASE_URL}/series`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Series — Curated Essay Collections",
      "url": "https://tonygreenberg.com/series",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Series</h1>
      <p><em>Multi-part investigations into the systems that shape how we work, trust, and build.</em></p>
    </header>
    <section>
      <h2>The Collections</h2>
      <ul>
        <li><strong>The Honesty Dance:</strong> Two-part investigation into buyer-seller dynamics and the trust deficit in enterprise sales</li>
        <li><strong>Fast Growth / Likely to Fall:</strong> Three-part series on the structural fragility of hypergrowth companies</li>
        <li><strong>The Cynic's Predictions:</strong> Annual technology forecasts from 2011 through 2016 — with retrospective scoring</li>
        <li><strong>Eco-Vegan Realities:</strong> Multi-part examination of ethical and economic trade-offs in sustainable living</li>
        <li><strong>The IT Challenges:</strong> Three-part series on enterprise technology procurement and vendor management</li>
        <li><strong>The Molecule as Mirror:</strong> 11-part deep dive into psychedelic medicine, consciousness, and the future of mental health</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">All Essays</a>
      <a href="${BASE_URL}/essays">Essay Index</a>
      <a href="${BASE_URL}/the-index">The Index</a>
    </nav>
  </article>`
  });
}

// ── Projects & ventures ──

export function renderProjectsHTML(): string {
  return wrapPage({
    title: "Projects — Tony Greenberg",
    description: "The active projects, ventures, and platforms Tony Greenberg is building. RampRate, ImpactSoul, BrewSoul, BioChain, and more.",
    keywords: "Tony Greenberg projects, RampRate, ImpactSoul, BrewSoul, BioChain, ventures",
    canonical: `${BASE_URL}/projects`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Projects — Tony Greenberg",
      description: "The active projects, ventures, and platforms Tony Greenberg is building.",
      url: `${BASE_URL}/projects`,
      author: { "@type": "Person", name: "Tony Greenberg", url: BASE_URL },
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com", description: "Enterprise technology benchmarking firm. $24B+ benchmarked. Microsoft, Disney, Goldman Sachs, Nike.", founder: { "@type": "Person", name: "Tony Greenberg" } },
      { "@context": "https://schema.org", "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is", description: "Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact.", founder: { "@type": "Person", name: "Tony Greenberg" } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE_URL}/projects` } ] },
    ],
    body: `<article>
    <header>
      <h1>Projects</h1>
      <p><em>The active ventures, platforms, and experiments. Each one a response to a broken system.</em></p>
    </header>
    <section>
      <h2>Active Ventures</h2>
      <div class="principle">
        <h3>RampRate</h3>
        <p>25 years. $24B+ benchmarked. The enterprise technology advisory that has served Microsoft, Disney, Goldman Sachs, Nike, and 90+ Fortune 500 clients. The SPY Index holds 1M+ data points on IT market pricing.</p>
      </div>
      <div class="principle">
        <h3>ImpactSoul</h3>
        <p>A Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health).</p>
      </div>
      <div class="principle">
        <h3>BrewSoul</h3>
        <p>The world's most rigorous specialty coffee intelligence platform. Sourcing transparency, roaster accountability, and the science of what's actually in your cup.</p>
      </div>
      <div class="principle">
        <h3>BioChain</h3>
        <p>Peptide supply chain transparency. Connecting verified manufacturers to informed buyers. The antidote to the gray market.</p>
      </div>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/ecosystem">The Ecosystem</a>
      <a href="${BASE_URL}/invest">Invest in the Thesis</a>
      <a href="${BASE_URL}/impact">Impact</a>
      <a href="${BASE_URL}/brewsoul">BrewSoul</a>
    </nav>
  </article>`
  });
}

export function renderEcosystemHTML(): string {
  return wrapPage({
    title: "The Ecosystem — Tony Greenberg",
    description: "A curated network for people building what replaces what's broken. The companies, causes, and collaborators in Tony Greenberg's orbit.",
    keywords: "Tony Greenberg ecosystem, network, portfolio, companies, collaborators",
    canonical: `${BASE_URL}/ecosystem`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "The Ecosystem — Tony Greenberg",
      description: "A curated network for people building what replaces what's broken.",
      url: `${BASE_URL}/ecosystem`,
      author: { "@type": "Person", name: "Tony Greenberg", url: BASE_URL },
      about: [
        { "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com" },
        { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
        { "@type": "Organization", name: "MycoMedica Life Sciences" },
        { "@type": "Organization", name: "AtaiBeckley" },
      ],
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "The Ecosystem", item: `${BASE_URL}/ecosystem` } ] },
    ],
    body: `<article>
    <header>
      <h1>The Ecosystem</h1>
      <p><em>A curated network for people building what replaces what's broken.</em></p>
    </header>
    <section>
      <h2>The Domains</h2>
      <ul>
        <li><strong>Enterprise Technology:</strong> RampRate, SPY Index, BioChain</li>
        <li><strong>Psychedelic Medicine:</strong> MycoMedica Life Sciences, AtaiBeckley, Bexson Biomedical, Wake Network, Radicle Science, Tripp</li>
        <li><strong>Impact &amp; Tokenization:</strong> ImpactSoul — BEYOND, REX, SPACE, BEING token ecosystems</li>
        <li><strong>Health &amp; Longevity:</strong> Peptide research, kava intelligence, biometric tracking</li>
        <li><strong>Consumer Advocacy:</strong> BrewSoul, Peptide Hall of Shame, Charity Scorecard</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/ecosystem-map">Ecosystem Map</a>
      <a href="${BASE_URL}/invest">Invest in the Thesis</a>
      <a href="${BASE_URL}/projects">Projects</a>
      <a href="${BASE_URL}/impact">Impact</a>
    </nav>
  </article>`
  });
}

export function renderInvestHTML(): string {
  return wrapPage({
    title: "Invest in the Thesis — Portfolio & ABIT Waitlist",
    description: "35+ portfolio companies across psychedelic medicine, impact venture, Web3, blockchain, and health tech. ImpactSoul ABITs launch Q3 2026.",
    keywords: "Tony Greenberg invest, portfolio, ABIT, ImpactSoul, psychedelic medicine, impact venture",
    canonical: `${BASE_URL}/invest`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Invest in the Thesis — Portfolio & ABIT Waitlist",
      description: "35+ portfolio companies. Four token ecosystems. Regenerative capital.",
      url: `${BASE_URL}/invest`,
      author: { "@type": "Person", name: "Tony Greenberg", url: BASE_URL },
      about: { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is", description: "Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact." },
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Invest in the Thesis", item: `${BASE_URL}/invest` } ] },
    ],
    body: `<article>
    <header>
      <h1>Invest in the Thesis</h1>
      <p><em>35+ portfolio companies. Four token ecosystems. One thesis: regenerative capital changes everything.</em></p>
    </header>
    <section>
      <h2>The Portfolio</h2>
      <div class="principle">
        <h3>Psychedelic Medicine (6 active investments)</h3>
        <p>MycoMedica Life Sciences (co-founded with Paul Stamets), AtaiBeckley (FDA Breakthrough Therapy designation), Bexson Biomedical, Wake Network, Radicle Science, Tripp.</p>
      </div>
      <div class="principle">
        <h3>ImpactSoul ABITs</h3>
        <p>Asset-Backed Impact Tokens launching Q3 2026. Four ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health). A Certified B Corp structure.</p>
      </div>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/ecosystem">The Ecosystem</a>
      <a href="${BASE_URL}/impact">Impact</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
    </nav>
  </article>`
  });
}

export function renderImpactHTML(): string {
  return wrapPage({
    title: "Impact — Tony Greenberg",
    description: "The measurable impact of Tony Greenberg's work across enterprise technology, psychedelic medicine, and regenerative capital.",
    keywords: "Tony Greenberg impact, ImpactSoul, regenerative capital, psychedelic medicine impact",
    canonical: `${BASE_URL}/impact`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Impact — Tony Greenberg",
      description: "The measurable impact of Tony Greenberg's work across enterprise technology, psychedelic medicine, and regenerative capital.",
      url: `${BASE_URL}/impact`,
      author: { "@type": "Person", name: "Tony Greenberg", url: BASE_URL },
      about: [
        { "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com" },
        { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
      ],
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Impact", item: `${BASE_URL}/impact` } ] },
    ],
    body: `<article>
    <header>
      <h1>Impact</h1>
      <p><em>The scoreboard nobody built. Measuring what actually matters.</em></p>
    </header>
    <section>
      <h2>The Numbers</h2>
      <div class="stat"><strong>$24B+</strong> IT spend benchmarked through RampRate</div>
      <div class="stat"><strong>90+</strong> Enterprise clients served</div>
      <div class="stat"><strong>35+</strong> Portfolio companies</div>
      <div class="stat"><strong>6</strong> Active psychedelic medicine investments</div>
      <div class="stat"><strong>4</strong> ImpactSoul token ecosystems</div>
      <div class="stat"><strong>118+</strong> Published essays</div>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/impact-dashboard">Impact Dashboard</a>
      <a href="${BASE_URL}/invest">Invest in the Thesis</a>
      <a href="${BASE_URL}/ecosystem">The Ecosystem</a>
      <a href="${BASE_URL}/charity-scorecard">Charity Scorecard</a>
    </nav>
  </article>`
  });
}

export function renderHeroesHTML(): string {
  return wrapPage({
    title: "Heroes — Tony Greenberg",
    description: "The people who shaped Tony Greenberg's thinking. Mentors, collaborators, and the intellectual lineage behind the work.",
    keywords: "Tony Greenberg heroes, mentors, influences, intellectual lineage",
    canonical: `${BASE_URL}/heroes`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Heroes — Tony Greenberg",
      "url": "https://tonygreenberg.com/heroes",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Heroes</h1>
      <p><em>The people who shaped the thinking. The shoulders this work stands on.</em></p>
    </header>
    <section>
      <h2>The Lineage</h2>
      <p>Arnold Patent on abundance. Ram Dass on presence. Paul Stamets on mycology and consciousness. David Hawkins on the calibration of consciousness. Ray Kurzweil on the trajectory of intelligence. The Summit Series community on what happens when you put the right people in the same room.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-territory">The Territory</a>
      <a href="${BASE_URL}/ecosystem">The Ecosystem</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

export function renderPublishedHTML(): string {
  return wrapPage({
    title: "Published — Tony Greenberg",
    description: "Bylines across HuffPost, Medium, MediaVillage, and more. 28+ articles on technology, trust, blockchain, and the human condition.",
    keywords: "Tony Greenberg published, bylines, HuffPost, Medium, MediaVillage, articles",
    canonical: `${BASE_URL}/published`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Published — Tony Greenberg",
      "url": "https://tonygreenberg.com/published",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Published</h1>
      <p><em>28+ bylines across HuffPost, Medium, MediaVillage, and more.</em></p>
    </header>
    <section>
      <h2>The Outlets</h2>
      <ul>
        <li><strong>HuffPost:</strong> Technology, trust, and the human condition</li>
        <li><strong>Medium:</strong> Enterprise technology, blockchain, and impact investing</li>
        <li><strong>MediaVillage:</strong> IT procurement, vendor management, and market intelligence</li>
        <li><strong>Forbes:</strong> Psychedelic medicine and the future of mental health</li>
        <li><strong>LinkedIn:</strong> Long-form essays on systems thinking and regenerative capital</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">All Essays</a>
      <a href="${BASE_URL}/essays">Essay Index</a>
      <a href="${BASE_URL}/the-open-door">What I Can Do For You</a>
    </nav>
  </article>`
  });
}

export function renderClientsHTML(): string {
  return wrapPage({
    title: "Clients — RampRate & Tony Greenberg",
    description: "90+ enterprise clients served by RampRate over 25 years. Microsoft, Disney, Goldman Sachs, Nike, and more.",
    keywords: "RampRate clients, Tony Greenberg clients, Microsoft, Disney, Goldman Sachs, Nike, enterprise technology",
    canonical: `${BASE_URL}/clients`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Clients — RampRate & Tony Greenberg",
      "url": "https://tonygreenberg.com/clients",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Clients</h1>
      <p><em>90+ enterprise clients. 25 years. $24B+ benchmarked.</em></p>
    </header>
    <section>
      <h2>The Roster</h2>
      <p>RampRate has served the full spectrum of Fortune 500 enterprise technology buyers — from media companies navigating digital transformation to financial institutions managing multi-billion-dollar IT infrastructure.</p>
      <p>Representative clients include: Microsoft, Disney, Goldman Sachs, Nike, Warner Bros, Verizon, AT&amp;T, Comcast, Time Warner, and 80+ more across financial services, media, healthcare, and retail.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-web">The Network</a>
      <a href="${BASE_URL}/the-open-door">What I Can Do For You</a>
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
    </nav>
  </article>`
  });
}

export function renderBuiltOnManusHTML(): string {
  return wrapPage({
    title: "Built on Manus — Tony Greenberg",
    description: "This site was built using Manus AI — the autonomous agent platform. A case study in what AI-native development looks like.",
    keywords: "Manus AI, built on Manus, AI development, autonomous agent",
    canonical: `${BASE_URL}/built-on-manus`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Built on Manus — Tony Greenberg",
      "url": "https://tonygreenberg.com/built-on-manus",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Built on Manus</h1>
      <p><em>This site was built using Manus — the autonomous AI agent platform.</em></p>
    </header>
    <section>
      <h2>What That Means</h2>
      <p>tonygreenberg.com is not a template. It's a custom-built React + Express + tRPC application with 200+ pages, 118+ blog posts, 20+ assessments, and multiple interactive tools — all built by an AI agent working autonomously over multiple sessions.</p>
    </section>
    <section>
      <h2>The Stack</h2>
      <ul>
        <li>React 19 + Tailwind 4 (frontend)</li>
        <li>Express 4 + tRPC 11 (backend)</li>
        <li>MySQL + Drizzle ORM (database)</li>
        <li>Server-Side Rendering for all major pages</li>
        <li>Google Search Console optimized</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/">Home</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/projects">Projects</a>
    </nav>
  </article>`
  });
}

// ── Community & engagement ──

export function renderConnectHTML(): string {
  return wrapPage({
    title: "Connect — Tony Greenberg",
    description: "Connect with Tony Greenberg. The right way to reach out, what qualifies, and what happens next.",
    keywords: "Tony Greenberg connect, contact, reach out, collaborate",
    canonical: `${BASE_URL}/connect`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Connect — Tony Greenberg",
      "url": "https://tonygreenberg.com/connect",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Connect</h1>
      <p><em>The right way to reach out. What qualifies. What happens next.</em></p>
    </header>
    <section>
      <h2>The Right Entry Points</h2>
      <ul>
        <li><strong>The Gate:</strong> For companies and individuals who want to work directly with Tony</li>
        <li><strong>The Amplifier:</strong> For companies already scaling who need the external advisory layer</li>
        <li><strong>The Diamond Cut:</strong> For services businesses not yet at product scale</li>
        <li><strong>Subscribe:</strong> For people who want to follow the thinking without a direct relationship</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
      <a href="${BASE_URL}/diamond-cut">The Diamond Cut</a>
      <a href="${BASE_URL}/subscribe">Subscribe</a>
    </nav>
  </article>`
  });
}

export function renderSubscribeHTML(): string {
  return wrapPage({
    title: "Subscribe — The Throughline",
    description: "91 essays. 15 years. Zero algorithm. Subscribe to receive Tony Greenberg's essays directly — no social feed required.",
    keywords: "Tony Greenberg subscribe, newsletter, essays, Throughline",
    canonical: `${BASE_URL}/subscribe`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Subscribe — The Throughline",
      "url": "https://tonygreenberg.com/subscribe",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Subscribe — The Throughline</h1>
      <p><em>91 essays. 15 years. Zero algorithm. Direct to your inbox.</em></p>
    </header>
    <section>
      <h2>What You Get</h2>
      <p>When Tony Greenberg publishes an essay, it goes to subscribers first. No social feed. No algorithm deciding whether you see it. No platform between the writer and the reader.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Read the Essays</a>
      <a href="${BASE_URL}/essays">Essay Index</a>
      <a href="${BASE_URL}/find-your-journey">Find Your Reading Path</a>
    </nav>
  </article>`
  });
}

export function renderAmplifierHTML(): string {
  return wrapPage({
    title: "The Amplifier — Networked Advisory",
    description: "For companies already scaling who need the external layer no internal coach provides. Tony opens rooms. You walk through them.",
    keywords: "Tony Greenberg amplifier, advisory, consulting, networked advisory",
    canonical: `${BASE_URL}/amplifier`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "The Amplifier — Tony Greenberg",
      "url": "https://tonygreenberg.com/amplifier",
      "provider": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "areaServed": "Worldwide"
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What is The Amplifier?", "acceptedAnswer": { "@type": "Answer", "text": "Networked advisory for companies already scaling. Tony opens rooms. You walk through them. Every engagement includes a handpicked vertical domain expert." } },
        { "@type": "Question", "name": "How does an engagement begin?", "acceptedAnswer": { "@type": "Answer", "text": "Every engagement begins with a scoping conversation. Engagements are relationship-originated and priced inside the conversation." } },
        { "@type": "Question", "name": "Is there a guarantee?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The 2X Return Guarantee: do the work, show the receipts, get 2x back." } },
        { "@type": "Question", "name": "What does Tony bring?", "acceptedAnswer": { "@type": "Answer", "text": "25 years of pattern recognition, 90+ enterprise client relationships across Microsoft, Disney, Goldman Sachs, and Nike, and a network spanning enterprise technology, psychedelic medicine, and regenerative capital." } }
      ] }
    ],
    body: `<article>
    <header>
      <h1>The Amplifier</h1>
      <p><em>For companies already scaling who need the external layer no internal coach provides.</em></p>
    </header>
    <section>
      <h2>The Model</h2>
      <p>Outcome-oriented. Engagements begin with a scoping conversation. Tony Greenberg brings 25 years of pattern recognition, 90+ enterprise client relationships, and a network that spans enterprise technology, psychedelic medicine, and regenerative capital.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/diamond-cut">The Diamond Cut</a>
      <a href="${BASE_URL}/clients">Client Roster</a>
      <a href="${BASE_URL}/connect">Connect</a>
    </nav>
  </article>`
  });
}

// ── Explore sections ──

export function renderTerritoryHTML(): string {
  return wrapPage({
    title: "The Territory — Influences & Intellectual Lineage",
    description: "The heroes, influences, and intellectual lineage that shaped Tony Greenberg's worldview. From Arnold Patent to Ram Dass to systems thinking.",
    keywords: "Tony Greenberg influences, intellectual lineage, Arnold Patent, Ram Dass, David Hawkins",
    canonical: `${BASE_URL}/the-territory`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Territory — Tony Greenberg",
      "url": "https://tonygreenberg.com/territory",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Territory</h1>
      <p><em>The heroes, influences, and intellectual lineage that shaped the thinking.</em></p>
    </header>
    <section>
      <h2>The Thinkers</h2>
      <ul>
        <li><strong>Arnold Patent:</strong> Abundance consciousness and the nature of universal law</li>
        <li><strong>Ram Dass:</strong> Presence, service, and the dissolution of ego in spiritual practice</li>
        <li><strong>David Hawkins:</strong> The Map of Consciousness — calibrating states from shame to enlightenment</li>
        <li><strong>Paul Stamets:</strong> Mycology, psilocybin research, and the intelligence of fungal networks</li>
        <li><strong>Ray Kurzweil:</strong> The Singularity, exponential technology, and the trajectory of intelligence</li>
        <li><strong>Buckminster Fuller:</strong> Systems thinking, geodesic structures, and doing more with less</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/heroes">Heroes</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

export function renderEngineRoomHTML(): string {
  return wrapPage({
    title: "The Engine Room — Operational Infrastructure",
    description: "The operational infrastructure behind Tony Greenberg's work. How the companies and causes connect, the team that runs them, and the systems that make it work.",
    keywords: "Tony Greenberg engine room, operations, infrastructure, team, systems",
    canonical: `${BASE_URL}/engine-room`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Engine Room — Tony Greenberg",
      "url": "https://tonygreenberg.com/engine-room",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Engine Room</h1>
      <p><em>The operational infrastructure behind the work. How the companies and causes connect.</em></p>
    </header>
    <section>
      <h2>The Systems</h2>
      <p>Twenty-five years of enterprise technology advisory has produced a set of operational systems that are now applied across the entire portfolio. The SPY Index. The vendor negotiation playbook. The impact measurement framework. The assessment battery.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/projects">Projects</a>
      <a href="${BASE_URL}/clients">Clients</a>
      <a href="${BASE_URL}/ecosystem">Ecosystem</a>
    </nav>
  </article>`
  });
}

export function renderTheBodyHTML(): string {
  return wrapPage({
    title: "The Body — Health Protocols & Biometric Tracking",
    description: "Tony Greenberg's health protocols, biometric tracking, peptide research, and measurement-driven wellness approach with Oura Ring data.",
    keywords: "Tony Greenberg health, biometric tracking, peptides, Oura Ring, wellness protocols",
    canonical: `${BASE_URL}/the-body`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Body — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-body",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Body</h1>
      <p><em>Health protocols, biometric tracking, and the measurement-driven approach to longevity.</em></p>
    </header>
    <section>
      <h2>The Protocols</h2>
      <ul>
        <li><strong>Peptide Stack:</strong> BPC-157, TB-500, Epithalon — sourced through verified supply chains</li>
        <li><strong>Sleep Optimization:</strong> Chronotype-aligned scheduling, HRV-guided recovery</li>
        <li><strong>Movement:</strong> Zone 2 cardio, strength training, mobility work</li>
        <li><strong>Nutrition:</strong> Evidence-based dietary approach, continuous glucose monitoring</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/peptide-watch">Peptide Watch</a>
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
      <a href="${BASE_URL}/find-your-sleep">Find Your Sleep</a>
      <a href="${BASE_URL}/find-your-movement">Find Your Movement</a>
    </nav>
  </article>`
  });
}

export function renderNightstandHTML(): string {
  return wrapPage({
    title: "The Nightstand — Reading, Watching, Thinking",
    description: "What Tony Greenberg is reading, watching, and thinking about. Books, articles, and ideas that shape the worldview.",
    keywords: "Tony Greenberg reading, books, articles, ideas, nightstand",
    canonical: `${BASE_URL}/the-nightstand`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Nightstand — Tony Greenberg",
      "url": "https://tonygreenberg.com/nightstand",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Nightstand</h1>
      <p><em>What's on the reading stack. What's shaping the thinking right now.</em></p>
    </header>
    <section>
      <h2>The Permanent Stack</h2>
      <ul>
        <li><em>The Power of Now</em> — Eckhart Tolle</li>
        <li><em>Power vs. Force</em> — David Hawkins</li>
        <li><em>Mycelium Running</em> — Paul Stamets</li>
        <li><em>The Singularity Is Near</em> — Ray Kurzweil</li>
        <li><em>Abundance</em> — Peter Diamandis</li>
        <li><em>How to Change Your Mind</em> — Michael Pollan</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/library">The Library</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/the-territory">The Territory</a>
    </nav>
  </article>`
  });
}

export function renderTheWebHTML(): string {
  return wrapPage({
    title: "The Web — Network & Relationships",
    description: "Tony Greenberg's network — the clients, partners, and relationships built over 25 years. Disney, Microsoft, Goldman Sachs, Nike, and more.",
    keywords: "Tony Greenberg network, relationships, clients, partners, connections",
    canonical: `${BASE_URL}/the-web`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Web — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-web",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Web</h1>
      <p><em>25 years of relationships. The network that makes the work possible.</em></p>
    </header>
    <section>
      <h2>The Nodes</h2>
      <ul>
        <li><strong>Enterprise Technology:</strong> CIOs, CTOs, and procurement leaders at 90+ Fortune 500 companies</li>
        <li><strong>Psychedelic Medicine:</strong> Researchers, clinicians, and investors across the FDA-regulated pipeline</li>
        <li><strong>Impact Investing:</strong> Family offices, impact funds, and B Corp operators</li>
        <li><strong>Regenerative Capital:</strong> Token ecosystem builders and community capital practitioners</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/clients">Clients</a>
      <a href="${BASE_URL}/ecosystem">Ecosystem</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
    </nav>
  </article>`
  });
}

export function renderPickUpHTML(): string {
  return wrapPage({
    title: "Pick Up the Phone — Contact Tony Greenberg",
    description: "Ready to work with Tony Greenberg? Seven out of ten don't qualify. Enter The Gate to find out if you do.",
    keywords: "Tony Greenberg contact, phone, reach out, work together",
    canonical: `${BASE_URL}/pick-up-the-phone`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Pick Up — Tony Greenberg",
      "url": "https://tonygreenberg.com/pick-up",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Pick Up the Phone</h1>
      <p><em>Ready to work together? Here's how to find out if you qualify.</em></p>
    </header>
    <section>
      <h2>The Right Path</h2>
      <p>If you've read the essays and recognized yourself in the work. If you've taken the assessments and understood what they're measuring. If you have a real intersection with enterprise technology, psychedelic medicine, or regenerative capital — then enter The Gate.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
      <a href="${BASE_URL}/connect">Connect</a>
    </nav>
  </article>`
  });
}

export function renderIntelHTML(): string {
  return wrapPage({
    title: "Intel — Impact Theses & Competitive Landscape",
    description: "The work — impact theses, Hawkins consciousness scores, competitive landscape, and impact metrics for the companies and causes Tony Greenberg is building.",
    keywords: "Tony Greenberg intel, impact thesis, consciousness scores, competitive landscape, metrics",
    canonical: `${BASE_URL}/intel`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Intel — Tony Greenberg",
      "url": "https://tonygreenberg.com/intel",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Intel</h1>
      <p><em>The work. Impact theses, consciousness scores, competitive landscape, and metrics.</em></p>
    </header>
    <section>
      <h2>What's Here</h2>
      <ul>
        <li><strong>Impact Theses:</strong> The investment logic behind each portfolio company</li>
        <li><strong>Consciousness Scores:</strong> David Hawkins-calibrated scores for organizations, movements, and ideas</li>
        <li><strong>Competitive Landscape:</strong> Market maps for enterprise technology, psychedelic medicine, and impact investing</li>
        <li><strong>Impact Metrics:</strong> The scoreboard for the four ImpactSoul token ecosystems</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/impact-dashboard">Impact Dashboard</a>
      <a href="${BASE_URL}/thesis-threads">Thesis Threads</a>
      <a href="${BASE_URL}/ecosystem">Ecosystem</a>
    </nav>
  </article>`
  });
}

export function renderTheOpenDoorHTML(): string {
  return wrapPage({
    title: "The Open Door — What Tony Greenberg Can Do For You",
    description: "What Tony Greenberg's ecosystem can do for your company. Client testimonials with ROI data and published articles across Forbes, HuffPost, and Medium.",
    keywords: "Tony Greenberg open door, what I can do, ROI, client testimonials, advisory",
    canonical: `${BASE_URL}/the-open-door`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Open Door — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-open-door",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Open Door</h1>
      <p><em>What the ecosystem can do for your company. The evidence, the testimonials, the ROI.</em></p>
    </header>
    <section>
      <h2>The Evidence</h2>
      <p>Client testimonials with specific ROI data. Published articles across Forbes, HuffPost, and Medium. 25 years of pattern recognition applied to your specific problem.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/clients">Client Roster</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
    </nav>
  </article>`
  });
}

export function renderTheIndexHTML(): string {
  return wrapPage({
    title: "The Index — Searchable Idea Database",
    description: "Search across 91 essays, 18 concept categories, and 25 years of thinking on technology, trust, ethics, and human development.",
    keywords: "Tony Greenberg index, searchable essays, ideas, concepts, database",
    canonical: `${BASE_URL}/the-index`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Index — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-index",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Index</h1>
      <p><em>91 essays. 18 concept categories. 25 years of thinking. Searchable.</em></p>
    </header>
    <section>
      <h2>The Categories</h2>
      <ul>
        <li>Enterprise Technology &amp; AI</li>
        <li>Trust &amp; Communication</li>
        <li>Psychedelic Medicine &amp; Consciousness</li>
        <li>Impact Investing &amp; Regenerative Capital</li>
        <li>Health &amp; Longevity</li>
        <li>Systems Thinking</li>
        <li>Culture &amp; Community</li>
        <li>Business Strategy</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">All Essays</a>
      <a href="${BASE_URL}/essays">Essay Index</a>
      <a href="${BASE_URL}/series">Series</a>
    </nav>
  </article>`
  });
}

export function renderRecentCreationsHTML(): string {
  return wrapPage({
    title: "Built by Tony G — Digital Portfolio",
    description: "A living portfolio of digital creation. Eleven sites, eleven ideas that needed a home.",
    keywords: "Tony Greenberg portfolio, digital creation, websites, built by Tony G",
    canonical: `${BASE_URL}/recent-creations`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Recent Creations — Tony Greenberg",
      "url": "https://tonygreenberg.com/recent-creations",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Built by Tony G</h1>
      <p><em>A living portfolio of digital creation. Eleven sites, eleven ideas that needed a home.</em></p>
    </header>
    <section>
      <h2>Selected Projects</h2>
      <ul>
        <li><strong>BrewSoul:</strong> Specialty coffee intelligence platform</li>
        <li><strong>Kava Encyclopedia:</strong> The definitive kava knowledge base</li>
        <li><strong>Psychedelic Readiness Index:</strong> 5-domain readiness assessment</li>
        <li><strong>Peptide Watch:</strong> Supply chain transparency for peptide buyers</li>
        <li><strong>Charity Scorecard:</strong> Transparency scores for charitable organizations</li>
        <li><strong>Attention Theft Manifesto:</strong> The case against algorithmic manipulation</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/projects">All Projects</a>
      <a href="${BASE_URL}/ecosystem">Ecosystem</a>
      <a href="${BASE_URL}/built-on-manus">Built on Manus</a>
    </nav>
  </article>`
  });
}

export function renderFrameworkHTML(): string {
  return wrapPage({
    title: "How I'd Approach Your Problem — Tony Greenberg",
    description: "A 5-step framework for diagnosing complex business problems. Twenty-five years of pattern recognition distilled into questions worth asking.",
    keywords: "Tony Greenberg framework, problem solving, business diagnosis, consulting framework",
    canonical: `${BASE_URL}/framework`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Framework — Tony Greenberg",
      "url": "https://tonygreenberg.com/framework",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>How I'd Approach Your Problem</h1>
      <p><em>A 5-step framework for diagnosing complex business problems. 25 years of pattern recognition.</em></p>
    </header>
    <section>
      <h2>The Framework</h2>
      <ol>
        <li><strong>Map the system:</strong> What are the actual inputs, outputs, and feedback loops?</li>
        <li><strong>Find the constraint:</strong> Where is the bottleneck?</li>
        <li><strong>Identify the incentives:</strong> Who benefits from the current broken state?</li>
        <li><strong>Benchmark against the best:</strong> What does the best version of this look like?</li>
        <li><strong>Design the replacement:</strong> What's the minimum viable intervention that breaks the constraint?</li>
      </ol>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

export function renderLibraryHTML(): string {
  return wrapPage({
    title: "The Library — Tony Greenberg",
    description: "The books, research, and resources that inform Tony Greenberg's work across enterprise technology, psychedelic medicine, and regenerative capital.",
    keywords: "Tony Greenberg library, books, research, resources, reading list",
    canonical: `${BASE_URL}/library`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Library — Tony Greenberg",
      "url": "https://tonygreenberg.com/library",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Library</h1>
      <p><em>The books, research, and resources that inform the work.</em></p>
    </header>
    <section>
      <h2>The Stacks</h2>
      <ul>
        <li><strong>Consciousness &amp; Psychology:</strong> Hawkins, Tolle, Jung, Grof, Pollan</li>
        <li><strong>Systems Thinking:</strong> Fuller, Meadows, Senge, Taleb</li>
        <li><strong>Technology &amp; Futurism:</strong> Kurzweil, Diamandis, Harari</li>
        <li><strong>Psychedelic Medicine:</strong> Stamets, Shulgin, Strassman, Fadiman</li>
        <li><strong>Business &amp; Capital:</strong> Collins, Thiel, Andreessen, Buffett</li>
        <li><strong>Impact &amp; Regeneration:</strong> Sachs, Hawken, Lovins</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-nightstand">The Nightstand</a>
      <a href="${BASE_URL}/the-territory">The Territory</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

export function renderHealthHTML(): string {
  return wrapPage({
    title: "Health — Tony Greenberg",
    description: "Tony Greenberg's approach to health: biometric tracking, peptide research, kava medicine, and the measurement-driven path to longevity.",
    keywords: "Tony Greenberg health, longevity, biometrics, peptides, kava, wellness",
    canonical: `${BASE_URL}/health`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Health — Tony Greenberg",
      "url": "https://tonygreenberg.com/health",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Health</h1>
      <p><em>Measurement-driven. Evidence-based. No wellness theater.</em></p>
    </header>
    <section>
      <h2>The Domains</h2>
      <ul>
        <li><strong>Biometric Tracking:</strong> Oura Ring HRV, continuous glucose monitoring, sleep architecture</li>
        <li><strong>Peptide Research:</strong> BPC-157, TB-500, Epithalon — sourced through verified supply chains via BioChain</li>
        <li><strong>Kava Medicine:</strong> Threshold preparation, kavalactone science, ceremonial practice</li>
        <li><strong>Psychedelic Medicine:</strong> Psilocybin, ibogaine, mescaline — clinical and ceremonial contexts</li>
        <li><strong>Movement:</strong> Zone 2 cardio, strength training, mobility work</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-body">The Body</a>
      <a href="${BASE_URL}/peptide-watch">Peptide Watch</a>
      <a href="${BASE_URL}/kava">Kava Encyclopedia</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    </nav>
  </article>`
  });
}

// ── Assessments ──

export function renderAssessmentHTML(): string {
  return wrapPage({
    title: "Assessment — Tony Greenberg",
    description: "Take a diagnostic assessment to clarify your thinking, identify your gaps, and find your next move.",
    keywords: "Tony Greenberg assessment, diagnostic, self-assessment, clarity",
    canonical: `${BASE_URL}/assessment`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find My — Assessments by Tony Greenberg",
      "url": "https://tonygreenberg.com/find-my",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Assessment</h1>
      <p><em>Clarify your thinking. Identify your gaps. Find your next move.</em></p>
    </header>
    <section>
      <h2>The Assessment Battery</h2>
      <p>Tony Greenberg has built 20+ diagnostic assessments across health, mind, relationships, identity, and impact. Each one is designed to reduce friction and create clarity.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/soulscore">Soul Score</a>
      <a href="${BASE_URL}/life-assessment">Life Assessment</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    </nav>
  </article>`
  });
}

export function renderAssessmentsDharmaHTML(): string {
  return wrapPage({
    title: "Dharma Finder — Find Your Life's Purpose",
    description: "A comprehensive assessment to discover your dharma — your life's purpose and the unique contribution only you can make.",
    keywords: "dharma finder, life purpose, dharma assessment, Tony Greenberg",
    canonical: `${BASE_URL}/assessments/dharma-finder`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Dharma — Tony Greenberg",
      "url": "https://tonygreenberg.com/assessments/dharma",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Dharma Finder</h1>
      <p><em>Discover your life's purpose — the unique contribution only you can make.</em></p>
    </header>
    <section>
      <h2>What Is Dharma?</h2>
      <p>Dharma is the Sanskrit concept of one's righteous duty or life purpose. It's the intersection of what you're uniquely good at, what the world needs, and what brings you alive.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/soulscore">Soul Score</a>
      <a href="${BASE_URL}/life-assessment">Life Assessment</a>
    </nav>
  </article>`
  });
}

export function renderAssessmentsConsciousnessHTML(): string {
  return wrapPage({
    title: "Consciousness Scale — David Hawkins Map of Consciousness",
    description: "Where do you calibrate on the Hawkins Map of Consciousness? From shame (20) to enlightenment (700+). A diagnostic tool based on Power vs. Force.",
    keywords: "consciousness scale, David Hawkins, Map of Consciousness, Power vs Force, calibration",
    canonical: `${BASE_URL}/assessments/consciousness-scale`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Consciousness Scale — Tony Greenberg",
      "url": "https://tonygreenberg.com/assessments/consciousness",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Consciousness Scale</h1>
      <p><em>Where do you calibrate on the Hawkins Map of Consciousness?</em></p>
    </header>
    <section>
      <h2>The Map</h2>
      <p>David Hawkins' Map of Consciousness, from <em>Power vs. Force</em>, calibrates states of consciousness from shame (20) through courage (200) to love (500) to enlightenment (700+).</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/soulscore">Soul Score</a>
      <a href="${BASE_URL}/the-territory">The Territory</a>
    </nav>
  </article>`
  });
}

export function renderAssessmentsGrantHTML(): string {
  return wrapPage({
    title: "Grant Study Assessment — Harvard Resilience Framework",
    description: "Based on the Harvard Study of Adult Development (Grant Study) — the longest longitudinal study of human flourishing. Measure your resilience factors.",
    keywords: "Grant Study, Harvard Study of Adult Development, resilience, flourishing, assessment",
    canonical: `${BASE_URL}/assessments/grant-study`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Grant Assessment — Tony Greenberg",
      "url": "https://tonygreenberg.com/assessments/grant",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Grant Study Assessment</h1>
      <p><em>Based on the Harvard Study of Adult Development — 80+ years of data on what makes a good life.</em></p>
    </header>
    <section>
      <h2>The Research</h2>
      <p>The Harvard Study of Adult Development (the Grant Study) is the longest longitudinal study of human flourishing ever conducted. Started in 1938, it tracked 268 Harvard men across their entire lives, identifying the factors that predict health, happiness, and resilience.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/life-assessment">Life Assessment</a>
      <a href="${BASE_URL}/soulscore">Soul Score</a>
    </nav>
  </article>`
  });
}

export function renderFindYourJourneyHTML(): string {
  return wrapPage({
    title: "Find Your Journey — Personalized Reading Path",
    description: "Five questions. Your personalized reading path through 91 essays on consciousness, business, relationships, health, impact, and justice.",
    keywords: "find your journey, reading path, essays, Tony Greenberg, personalized",
    canonical: `${BASE_URL}/find-your-journey`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Journey — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-journey",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Journey</h1>
      <p><em>Five questions. Your personalized reading path through 91 essays.</em></p>
    </header>
    <section>
      <h2>The Paths</h2>
      <ul>
        <li><strong>The Seeker:</strong> Consciousness, psychedelics, and the inner life</li>
        <li><strong>The Builder:</strong> Enterprise technology, business strategy, and systems</li>
        <li><strong>The Investor:</strong> Impact capital, portfolio construction, and regenerative finance</li>
        <li><strong>The Healer:</strong> Health, longevity, and the body as system</li>
        <li><strong>The Connector:</strong> Relationships, community, and the web of trust</li>
        <li><strong>The Crusader:</strong> Consumer advocacy, accountability, and broken systems</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">All Essays</a>
      <a href="${BASE_URL}/essays">Essay Index</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourAttachmentStyleHTML(): string {
  return wrapPage({
    title: "Find Your Attachment Style — Relationship Assessment",
    description: "Discover your attachment style and how it shapes your relationships.",
    keywords: "find your attachment style, attachment theory, relationship assessment, secure anxious avoidant",
    canonical: `${BASE_URL}/find-your-attachment-style`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Attachment Style — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-attachment-style",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Attachment Style</h1>
      <p><em>How you attach shapes everything. Secure. Anxious. Avoidant. Disorganized.</em></p>
    </header>
    <section>
      <h2>The Styles</h2>
      <p>Attachment theory identifies four primary attachment styles that shape how we form and maintain relationships. Understanding your style is the first step to changing your patterns.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-love-language">Find Your Love Language</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/find-your-therapy">Find Your Therapy</a>
    </nav>
  </article>`
  });
}

export function renderFindYourLoveLanguageHTML(): string {
  return wrapPage({
    title: "Find Your Love Language — Relationship Communication Assessment",
    description: "Discover your love language and how to use it to strengthen your relationships.",
    keywords: "find your love language, love languages, relationship communication, Gary Chapman",
    canonical: `${BASE_URL}/find-your-love-language`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Love Language — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-love-language",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Love Language</h1>
      <p><em>How you give and receive love. The five languages. Your primary dialect.</em></p>
    </header>
    <section>
      <h2>The Five Languages</h2>
      <ul>
        <li><strong>Words of Affirmation:</strong> Verbal expressions of love and appreciation</li>
        <li><strong>Acts of Service:</strong> Doing things that ease the burden of responsibility</li>
        <li><strong>Receiving Gifts:</strong> Thoughtful tokens of love and care</li>
        <li><strong>Quality Time:</strong> Undivided attention and presence</li>
        <li><strong>Physical Touch:</strong> Physical expressions of love and connection</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-attachment-style">Find Your Attachment Style</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourSexualityHTML(): string {
  return wrapPage({
    title: "Find Your Sexuality — Identity & Orientation Assessment",
    description: "A thoughtful, evidence-based assessment to explore and understand your sexuality.",
    keywords: "find your sexuality, sexual identity, orientation assessment, LGBTQ",
    canonical: `${BASE_URL}/find-your-sexuality`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Sexuality — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-sexuality",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Sexuality</h1>
      <p><em>A thoughtful, evidence-based assessment to explore and understand your sexuality.</em></p>
    </header>
    <section>
      <h2>The Approach</h2>
      <p>Sexuality is a spectrum, not a binary. This assessment uses the Kinsey Scale, the Klein Sexual Orientation Grid, and contemporary research to map your sexual orientation and identity across multiple dimensions — without judgment, without labels you didn't choose.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/find-your-attachment-style">Find Your Attachment Style</a>
      <a href="${BASE_URL}/find-your-me">Find Your Me</a>
    </nav>
  </article>`
  });
}

export function renderFindYourSpiritHTML(): string {
  return wrapPage({
    title: "Find Your Spirit — Spiritual Archetype Assessment",
    description: "A comprehensive 35-question assessment mapping your spiritual landscape across 10 dimensions.",
    keywords: "find your spirit, spiritual archetype, spiritual assessment, Tony Greenberg",
    canonical: `${BASE_URL}/find-your-spirit`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Spirit — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-spirit",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Spirit</h1>
      <p><em>35 questions. 10 dimensions. Your spiritual archetype revealed.</em></p>
    </header>
    <section>
      <h2>What This Assessment Does</h2>
      <p>Most people inherit a spiritual identity rather than discover one. They absorb the framework of their upbringing — or reject it wholesale — without ever mapping their own actual landscape. Find Your Spirit is a 35-question assessment that does the mapping. It measures ten dimensions of spiritual orientation: transcendence, embodiment, community, ritual, mystery, ethics, surrender, meaning-making, nature, and lineage.</p>
      <p>The result is not a label. It is a topographic map of where you actually live spiritually — which territories feel native, which feel foreign, and which you have been avoiding. The assessment draws on frameworks from transpersonal psychology, contemplative traditions, and twenty-five years of Tony Greenberg's direct engagement with psychedelic medicine, indigenous ceremony, and consciousness research.</p>
      <h2>The Ten Dimensions</h2>
      <p><strong>Transcendence</strong> measures your orientation toward states beyond ordinary consciousness — whether through meditation, plant medicine, breathwork, or spontaneous mystical experience. <strong>Embodiment</strong> measures how much your spiritual life lives in the body versus the mind. <strong>Community</strong> measures whether your practice is solitary or relational by nature.</p>
      <p><strong>Ritual</strong> measures your relationship to form and repetition. <strong>Mystery</strong> measures your tolerance for — and attraction to — the unknowable. <strong>Ethics</strong> measures how central moral action is to your spiritual identity. <strong>Surrender</strong> measures your capacity to release control to something larger. <strong>Meaning-making</strong> measures how you construct narrative from experience.</p>
      <p><strong>Nature</strong> measures the degree to which the natural world is your primary spiritual context. <strong>Lineage</strong> measures your relationship to inherited tradition — whether you carry it, have broken from it, or are building something new.</p>
      <h2>Who This Is For</h2>
      <p>This assessment is for people who are serious about their inner life but skeptical of ready-made answers. It is for people in transition — leaving one framework, not yet inside another. It is for people preparing for psychedelic work who want to understand their spiritual baseline before entering altered states. And it is for people who simply want a more honest map of where they are.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-religion">Find Your Religion</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/the-philosophy">The Philosophy</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourReligionHTML(): string {
  return wrapPage({
    title: "Find Your Religion — Spiritual Alignment Assessment",
    description: "A 20-question assessment mapping your spiritual archetype across 8 dimensions.",
    keywords: "find your religion, spiritual alignment, religion assessment, Tony Greenberg",
    canonical: `${BASE_URL}/find-your-religion`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Religion — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-religion",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Religion</h1>
      <p><em>20 questions. 8 dimensions. Where your spiritual archetype actually lives.</em></p>
    </header>
    <section>
      <h2>Beyond the Label</h2>
      <p>Religion is the most misused word in the English language. It gets applied to institutional membership, cultural inheritance, and genuine spiritual conviction as if they were the same thing. They are not. Find Your Religion is a 20-question assessment that cuts through the label to the underlying archetype — the actual shape of your relationship to the sacred, the transcendent, and the community of practice.</p>
      <p>The eight dimensions measured are: cosmology (how you understand the structure of reality), practice (how you engage the sacred), community (whether your path is solitary or collective), authority (where you locate spiritual truth), ethics (how your spiritual life shapes your moral action), mystery (your relationship to the unknowable), lineage (your relationship to inherited tradition), and embodiment (whether your practice lives in the body or the mind).</p>
      <h2>What the Results Show</h2>
      <p>Most people score as a hybrid — drawing from multiple traditions without fully inhabiting any of them. The assessment identifies your primary archetype (Mystic, Devotee, Scholar, Activist, Naturalist, Skeptic, Ritualist, or Seeker) and your secondary orientation. It also identifies the tensions in your current framework — the places where your stated beliefs and your actual practice diverge.</p>
      <p>This is not a test of orthodoxy. There are no correct answers. The assessment is designed to produce an honest map, not a flattering one. The goal is clarity about where you actually are, which is the only useful starting point for any spiritual work.</p>
      <h2>Connection to Psychedelic Work</h2>
      <p>Tony Greenberg developed this assessment in the context of psychedelic medicine preparation. Understanding your spiritual archetype before entering altered states is one of the most underrated forms of set and setting work. The medicine will find your framework and work with it — or against it. Knowing your framework in advance is not optional for serious practitioners.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourDietHTML(): string {
  return wrapPage({
    title: "Find Your Diet — Personalized Nutrition Assessment",
    description: "A personalized diet assessment to find the nutritional approach that fits your biology and goals.",
    keywords: "find your diet, nutrition assessment, personalized diet, dietary approach",
    canonical: `${BASE_URL}/find-your-diet`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Diet — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-diet",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Diet</h1>
      <p><em>The nutritional approach that fits your biology, your goals, and your life.</em></p>
    </header>
    <section>
      <h2>Why Most Diet Advice Fails</h2>
      <p>Diet advice fails because it ignores the person. It prescribes a universal protocol — keto, Mediterranean, intermittent fasting, plant-based — without accounting for metabolic individuality, lifestyle constraints, psychological relationship with food, or the specific goals of the individual. The result is a 95% failure rate on most dietary interventions within two years.</p>
      <p>Find Your Diet is a personalized assessment that maps your biology, your goals, your constraints, and your relationship with food to identify the nutritional approach most likely to work for you specifically. It draws on research from metabolic science, behavioral nutrition, and Tony Greenberg's direct engagement with peptide therapeutics and longevity medicine.</p>
      <h2>What Gets Measured</h2>
      <p>The assessment measures five dimensions: metabolic type (how your body processes macronutrients), activity level and type (how your nutritional needs shift with your movement practice), health goals (weight, performance, longevity, cognitive function, or hormonal health), psychological relationship with food (restrictive, permissive, or flexible), and practical constraints (time, budget, cooking skill, and social context).</p>
      <p>The output is not a meal plan. It is a framework — a set of principles that should govern your nutritional choices given who you actually are. The specific foods, timing, and quantities are yours to determine within that framework.</p>
      <h2>The Peptide Connection</h2>
      <p>For those engaged with peptide therapeutics — GLP-1 analogs, growth hormone peptides, or metabolic peptides — dietary approach is not optional. The peptides work with your nutritional environment, not despite it. This assessment is a prerequisite for anyone considering peptide-assisted body composition or metabolic work.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-body">The Body</a>
      <a href="${BASE_URL}/find-your-movement">Find Your Movement</a>
      <a href="${BASE_URL}/find-your-sleep">Find Your Sleep</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourMovementHTML(): string {
  return wrapPage({
    title: "Find Your Movement — Exercise & Movement Assessment",
    description: "A personalized movement assessment to find the exercise approach that fits your body and lifestyle.",
    keywords: "find your movement, exercise assessment, movement protocol, fitness",
    canonical: `${BASE_URL}/find-your-movement`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Movement — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-movement",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Movement</h1>
      <p><em>The exercise approach that fits your body, your goals, and your life.</em></p>
    </header>
    <section>
      <h2>Movement Is Not Exercise</h2>
      <p>The fitness industry has collapsed movement into exercise — discrete sessions, measurable outputs, performance metrics. This is useful for athletes. It is not useful for most people, who need a sustainable relationship with physical activity that integrates into their actual life rather than competing with it.</p>
      <p>Find Your Movement is a personalized assessment that identifies the movement modalities, frequencies, and intensities that fit your body type, your goals, your psychological relationship with physical effort, and your practical constraints. The result is a movement framework — not a workout program, but a set of principles for building a physical life that lasts.</p>
      <h2>The Five Dimensions</h2>
      <p><strong>Body type and recovery capacity</strong> determines how much volume and intensity your system can absorb and recover from. <strong>Goals</strong> — whether longevity, performance, body composition, stress management, or mobility — determine which modalities are primary. <strong>Psychological relationship with effort</strong> determines whether you thrive with structure or need variety. <strong>Time and access constraints</strong> determine what is actually sustainable. <strong>Injury history and structural considerations</strong> determine what is safe.</p>
      <p>The assessment draws on research from exercise physiology, sports medicine, and the emerging science of movement as medicine — including the role of zone-2 cardio in metabolic health, resistance training in longevity, and the underrated importance of daily low-intensity movement over discrete high-intensity sessions.</p>
      <h2>Integration with Other Assessments</h2>
      <p>Movement does not exist in isolation. It interacts with sleep quality, nutritional approach, and stress levels. Find Your Movement is designed to be taken alongside Find Your Sleep and Find Your Diet for a complete picture of your physical optimization framework.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-body">The Body</a>
      <a href="${BASE_URL}/find-your-sleep">Find Your Sleep</a>
      <a href="${BASE_URL}/find-your-diet">Find Your Diet</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourSleepHTML(): string {
  return wrapPage({
    title: "Find Your Sleep — Sleep Optimization Assessment",
    description: "A personalized sleep assessment to optimize your sleep for your chronotype and lifestyle.",
    keywords: "find your sleep, sleep assessment, chronotype, sleep optimization",
    canonical: `${BASE_URL}/find-your-sleep`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Sleep — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-sleep",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Sleep</h1>
      <p><em>Optimize your sleep for your chronotype. The protocol that fits your biology.</em></p>
    </header>
    <section>
      <h2>Sleep Is Not One Size</h2>
      <p>The standard sleep advice — eight hours, consistent schedule, dark room, no screens — is correct in aggregate and useless in practice. It ignores chronotype, which is the genetically determined timing preference of your circadian rhythm. It ignores individual variation in sleep architecture, sleep debt, and recovery needs. And it ignores the practical reality of modern life, which does not accommodate a universal protocol.</p>
      <p>Find Your Sleep is a personalized assessment that identifies your chronotype, your sleep architecture tendencies, your primary sleep disruptors, and the interventions most likely to improve your sleep quality given your specific situation. The result is a sleep framework — a set of principles calibrated to your biology, not a generic protocol.</p>
      <h2>What Gets Assessed</h2>
      <p><strong>Chronotype</strong> is the foundation. Whether you are a morning type, evening type, or intermediate type determines the optimal timing of your sleep window, your peak cognitive performance hours, and your vulnerability to social jetlag — the chronic misalignment between your biological clock and your social schedule.</p>
      <p><strong>Sleep architecture</strong> refers to the distribution of sleep stages — light, deep, and REM — across your night. Different people have different natural distributions, and different goals (cognitive performance, physical recovery, emotional regulation) are served by different architectural profiles.</p>
      <p><strong>Primary disruptors</strong> are the specific factors degrading your sleep quality: stress and cortisol dysregulation, blue light exposure, alcohol, inconsistent timing, temperature, or underlying conditions like sleep apnea. The assessment identifies your primary disruptors and ranks interventions by likely impact.</p>
      <h2>The Peptide and Supplement Layer</h2>
      <p>For those engaged with peptide therapeutics or sleep supplements — BPC-157, DSIP, melatonin, magnesium glycinate, or others — this assessment provides the baseline needed to evaluate whether an intervention is working and what to optimize next.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/the-body">The Body</a>
      <a href="${BASE_URL}/find-your-movement">Find Your Movement</a>
      <a href="${BASE_URL}/find-your-diet">Find Your Diet</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourCoffeeHTML(): string {
  return wrapPage({
    title: "Find Your Coffee — BrewSoul Coffee Finder",
    description: "A personalized coffee finder based on your taste preferences and lifestyle. Powered by BrewSoul's specialty coffee intelligence.",
    keywords: "find your coffee, coffee finder, BrewSoul, specialty coffee, coffee assessment",
    canonical: `${BASE_URL}/find-your-coffee`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Coffee — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-coffee",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Coffee</h1>
      <p><em>Powered by BrewSoul's specialty coffee intelligence. Your perfect cup, matched to your palate.</em></p>
    </header>
    <section>
      <h2>The Problem with Coffee Recommendations</h2>
      <p>Most coffee recommendations are based on roast level. Light, medium, dark. This is the equivalent of recommending wine by color. It tells you almost nothing about what you will actually enjoy, because the variables that matter — origin, variety, processing method, altitude, fermentation, roaster philosophy — are invisible in a roast level label.</p>
      <p>Find Your Coffee is a personalized coffee finder built on BrewSoul's specialty coffee intelligence platform. It maps your flavor preferences, your brewing method, your tolerance for acidity and complexity, and your relationship with caffeine to identify the specific origins, processing methods, and roasters most likely to produce your ideal cup.</p>
      <h2>What Gets Assessed</h2>
      <p><strong>Flavor preference</strong> is the foundation. The assessment maps your palate across the primary flavor families in specialty coffee: fruit-forward (berry, citrus, stone fruit), chocolate and caramel, floral and tea-like, earthy and savory, and nutty and sweet. Most people have a dominant preference and a secondary one.</p>
      <p><strong>Processing method preference</strong> follows from flavor. Natural-processed coffees are fruit-forward and complex. Washed coffees are clean and bright. Honey-processed coffees sit between the two. Your flavor preference predicts your processing preference with high accuracy.</p>
      <p><strong>Origin</strong> is the final layer. Ethiopian coffees are floral and fruit-forward. Colombian coffees are balanced and approachable. Kenyan coffees are bright and complex. Guatemalan coffees are chocolate-forward with good body. The assessment maps your preferences to the origins most likely to satisfy them.</p>
      <h2>BrewSoul's Database</h2>
      <p>The recommendations draw on BrewSoul's database of specialty coffees, which includes sourcing information, tasting notes, roaster profiles, and availability data. The goal is not just to identify your preference archetype but to connect you with specific coffees you can actually buy and brew.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/brewsoul">BrewSoul</a>
      <a href="${BASE_URL}/brewsoul/browse">Browse Coffees</a>
      <a href="${BASE_URL}/find-your-sake">Find Your Sake</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourKitchenHTML(): string {
  return wrapPage({
    title: "Find Your Kitchen — Culinary Identity Assessment",
    description: "The kitchen is the last honest room in the house. Find the culinary identity that matches who you actually are.",
    keywords: "find your kitchen, culinary identity, cooking style, kitchen assessment",
    canonical: `${BASE_URL}/find-your-kitchen`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Kitchen — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-kitchen",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Kitchen</h1>
      <p><em>The kitchen is the last honest room in the house. Find yours.</em></p>
    </header>
    <section>
      <h2>The Kitchen as Identity</h2>
      <p>The kitchen is the last honest room in the house. The living room is curated. The bedroom is private. The kitchen is where you actually live — where your relationship with nourishment, pleasure, effort, and other people is enacted every day. Your culinary identity is not about skill level or cuisine preference. It is about the values and rhythms that govern how you feed yourself and the people you love.</p>
      <p>Find Your Kitchen is an assessment that identifies your culinary archetype — the underlying orientation that determines what kind of cook you are, what kind of kitchen you need, and what kind of food relationship will actually sustain you over time. It is not about what you should cook. It is about who you are in the kitchen.</p>
      <h2>The Culinary Archetypes</h2>
      <p><strong>The Nourisher</strong> cooks for others. The kitchen is an act of love, and the measure of a meal is whether people feel cared for. <strong>The Craftsperson</strong> cooks for the process. Technique, precision, and the satisfaction of doing something well are the primary motivations. <strong>The Explorer</strong> cooks for discovery. New ingredients, unfamiliar cuisines, and unexpected combinations are the point.</p>
      <p><strong>The Pragmatist</strong> cooks for efficiency. Good food, minimal fuss, maximum nutrition per unit of time. <strong>The Ritualist</strong> cooks for continuity. The same dishes, the same rhythms, the same recipes passed down or developed over decades. <strong>The Hedonist</strong> cooks for pleasure. Flavor, texture, and the sensory experience of eating are the primary values.</p>
      <h2>What the Assessment Produces</h2>
      <p>The result is your primary archetype, your secondary orientation, and a set of recommendations for kitchen setup, cooking approach, and food relationship that fits who you actually are. The goal is not to become a better cook. It is to have a more honest and sustainable relationship with the kitchen you already have.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-diet">Find Your Diet</a>
      <a href="${BASE_URL}/find-your-coffee">Find Your Coffee</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderFindYourStyleHTML(): string {
  return wrapPage({
    title: "Find Your Style — Personal Style Assessment",
    description: "Discover your personal style and the aesthetic that authentically represents you.",
    keywords: "find your style, personal style, aesthetic, style assessment",
    canonical: `${BASE_URL}/find-your-style`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Style — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-style",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Style</h1>
      <p><em>The aesthetic that authentically represents who you are.</em></p>
    </header>
    <section>
      <h2>Style as Signal</h2>
      <p>Style is not vanity. It is signal. The way you present yourself to the world communicates something about your values, your relationship with attention, your comfort with visibility, and your sense of self. Most people's style is inherited — assembled from cultural defaults, social pressure, and the path of least resistance — rather than chosen. Find Your Style is an assessment that helps you distinguish between the two.</p>
      <p>The assessment maps your aesthetic orientation across five dimensions: formality (how much structure and ceremony you bring to your presentation), individuality (how much you want to stand out versus fit in), comfort (how much physical ease matters relative to appearance), investment (how much time, money, and attention you are willing to give to your appearance), and coherence (how much you want your style to tell a consistent story versus express different facets of yourself).</p>
      <h2>The Style Archetypes</h2>
      <p>The assessment identifies your primary style archetype from eight categories: Classic, Minimal, Eclectic, Utilitarian, Expressive, Refined, Understated, and Constructed. Each archetype has a characteristic relationship with clothing, grooming, and the social function of appearance. Most people are a primary archetype with a secondary influence.</p>
      <p>The goal is not to prescribe a wardrobe. It is to give you a framework for making choices that are coherent with who you actually are, rather than who you think you should be or who you were ten years ago. Style clarity reduces decision fatigue, reduces spending on things that do not fit your identity, and produces a more authentic signal to the world.</p>
      <h2>Connection to Identity Work</h2>
      <p>Find Your Style is part of a broader suite of identity assessments that includes Find Your Me, Find Your Spirit, and Find Your Religion. The premise across all of them is the same: most people are living inside inherited identities rather than chosen ones, and the first step toward a more authentic life is an honest map of where you actually are.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/find-your-me">Find Your Me</a>
      <a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a>
    </nav>
  </article>`
  });
}

export function renderFindYourSakeHTML(): string {
  return wrapPage({
    title: "Find Your Sake — Rice, Water, Koji, Time",
    description: "20 questions across 5 dimensions. Discover the sake style that matches your palate, your philosophy, and your season.",
    keywords: "find your sake, sake assessment, sake pairing, Japanese sake, Tony Greenberg",
    canonical: `${BASE_URL}/find-your-sake`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find Your Sake — Tony Greenberg",
      "url": "https://tonygreenberg.com/find-your-sake",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Find Your Sake</h1>
      <p><em>Rice. Water. Koji. Time. 20 questions to find the sake that matches your palate and your season.</em></p>
    </header>
    <section>
      <h2>The Most Misunderstood Drink on Earth</h2>
      <p>Sake is the most misunderstood drink on earth. Most people encounter it warm, in a small ceramic cup, at a sushi restaurant, and conclude that it tastes like hot rice water. This is the equivalent of judging wine by the house carafe at a mediocre Italian restaurant. The range of sake — from bone-dry and mineral to lush and tropical, from delicate and floral to rich and umami-forward — is as wide as the range of wine, and the craft involved in producing great sake is as demanding as any winemaking tradition.</p>
      <p>Find Your Sake is a 20-question assessment across five dimensions that identifies the sake styles most likely to match your palate, your food preferences, your serving temperature preferences, and your philosophical orientation toward fermented beverages. The result is a profile that maps to specific sake categories, regions, and producers.</p>
      <h2>The Five Dimensions</h2>
      <p><strong>Flavor orientation</strong> is the foundation. Sake flavors range from fruity and floral (ginjo and daiginjo styles) to earthy and savory (junmai styles) to clean and neutral (honjozo styles). Your flavor preference in other beverages — wine, whisky, beer — predicts your sake preference with reasonable accuracy.</p>
      <p><strong>Dryness preference</strong> is measured by the Sake Meter Value (SMV), which ranges from very sweet to very dry. <strong>Body preference</strong> ranges from light and delicate to full and rich. <strong>Temperature preference</strong> determines whether you are drawn to chilled sake (which emphasizes delicacy and aroma) or warm sake (which emphasizes body and umami). <strong>Food pairing orientation</strong> determines whether you want sake that complements food or sake that stands alone.</p>
      <h2>Why This Matters</h2>
      <p>Sake is a threshold drink. It occupies a space between wine and spirits, between East and West, between the familiar and the genuinely foreign. For people interested in consciousness, in fermentation, in the relationship between craft and terroir, sake is one of the most rewarding beverages to explore. This assessment is the starting point for that exploration.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/spirits">Spirits</a>
      <a href="${BASE_URL}/find-your-coffee">Find Your Coffee</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

// ── Health & wellness pages ──

export function renderPsychedelicReadinessHTML(): string {
  const priUrl = `${BASE_URL}/psychedelic-readiness-index`;
  return wrapPage({
    title: "Psychedelic Readiness Index — Find Your Medicine",
    description: "The Psychedelic Readiness Index (PRI) — a 5-domain readiness assessment for psychedelic medicine. Psilocybin, ibogaine, MDMA, mescaline, and ketamine.",
    keywords: "Psychedelic Readiness Index, PRI, psilocybin, ibogaine, MDMA, mescaline, ketamine, readiness assessment",
    canonical: priUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${priUrl}#webpage`,
      name: "Psychedelic Readiness Index",
      description: "A 5-domain research-backed assessment measuring readiness for psychedelic-assisted therapy. Covers psilocybin, ibogaine, MDMA, mescaline, and ketamine.",
      url: priUrl,
      author: { ...TONY_PERSON_B2, "@context": undefined },
      medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
      about: [
        { "@type": "MedicalCondition", name: "Depression" },
        { "@type": "MedicalCondition", name: "PTSD" },
        { "@type": "MedicalCondition", name: "Addiction" },
      ],
      mainEntity: {
        "@type": "Quiz",
        name: "Psychedelic Readiness Index Assessment",
        description: "Five-domain readiness scoring for psychedelic medicine: Psychological Stability, Set & Setting, Medical Safety, Integration Capacity, Spiritual Readiness.",
        url: priUrl,
        author: { ...TONY_PERSON_B2, "@context": undefined },
      },
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Psychedelic Readiness Index?",
            acceptedAnswer: { "@type": "Answer", text: "The Psychedelic Readiness Index (PRI) is a research-backed assessment that measures your readiness for psychedelic-assisted therapy across five domains: Psychological Stability, Set & Setting, Medical Safety, Integration Capacity, and Spiritual Readiness." },
          },
          {
            "@type": "Question",
            name: "Which psychedelics does the PRI assess readiness for?",
            acceptedAnswer: { "@type": "Answer", text: "The PRI covers psilocybin (magic mushrooms), ibogaine, MDMA, mescaline/peyote, and ketamine. Each medicine has different readiness profiles and contraindications." },
          },
          {
            "@type": "Question",
            name: "Is the Psychedelic Readiness Index medically validated?",
            acceptedAnswer: { "@type": "Answer", text: "The PRI is based on clinical research from MAPS, Johns Hopkins, NYU, and Imperial College London. It is an educational tool, not a medical diagnosis. Always consult a licensed healthcare provider before pursuing psychedelic therapy." },
          },
          {
            "@type": "Question",
            name: "How long does the Psychedelic Readiness Index take?",
            acceptedAnswer: { "@type": "Answer", text: "The full PRI assessment takes approximately 10-15 minutes. You receive a detailed readiness profile across all five domains plus medicine-specific recommendations." },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Assessments", item: `${BASE_URL}/assessments` },
          { "@type": "ListItem", position: 3, name: "Psychedelic Readiness Index", item: priUrl },
        ],
      },
    ],
    body: `<article>
    <header>
      <h1>Psychedelic Readiness Index</h1>
      <p><em>The 5-domain readiness assessment for psychedelic medicine. Find your medicine. Know your readiness.</em></p>
    </header>
    <section>
      <h2>The Five Domains</h2>
      <ul>
        <li><strong>Psychological Stability:</strong> Current mental health baseline, trauma history, ego strength</li>
        <li><strong>Set &amp; Setting:</strong> Intention clarity, physical environment, support system</li>
        <li><strong>Medical Safety:</strong> Contraindications, drug interactions, physical health</li>
        <li><strong>Integration Capacity:</strong> Post-experience support, integration practice, community</li>
        <li><strong>Spiritual Readiness:</strong> Openness to non-ordinary states, surrender capacity</li>
      </ul>
    </section>
    <section style="background:#1a1a2e;color:#f0ece0;border-radius:8px;padding:1.5rem 2rem;margin:2.5rem 0;">
      <h3 style="margin-top:0;color:#D4B96A;">Get Your ImpactSoul Score</h3>
      <p>Your psychedelic readiness connects to a deeper question: what is your relationship to impact, consciousness, and regenerative change? The ImpactSoul Score measures exactly that — across 7 dimensions of purpose-aligned living.</p>
      <p><a href="https://impactsoul.is" rel="noopener" style="color:#D4B96A;font-weight:bold;">Take the ImpactSoul Score at impactsoul.is →</a></p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/iboga-ibogaine">Iboga &amp; Ibogaine</a>
      <a href="${BASE_URL}/kava">Kava Encyclopedia</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/find-your-journey">Find Your Journey</a>
      <a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a>
    </nav>
  </article>`
  });
}

export function renderPeyoteMescalineHTML(): string {
  return wrapPage({
    title: "Peyote & Mescaline — Deep Dive",
    description: "Comprehensive pharmacology, outcomes data, pharma-to-plant alternatives, supplement stacks, and readiness dimensions for mescaline and peyote.",
    keywords: "peyote, mescaline, psychedelic medicine, pharmacology, readiness, Tony Greenberg",
    canonical: `${BASE_URL}/peyote-mescaline`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Peyote & Mescaline — Tony Greenberg",
      "url": "https://tonygreenberg.com/peyote-mescaline",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/peyote-mescaline" }
    },
    body: `<article>
    <header>
      <h1>Peyote &amp; Mescaline — Deep Dive</h1>
      <p><em>The cactus medicines. Full pharmacology, outcomes data, and readiness framework.</em></p>
    </header>
    <section>
      <h2>The Pharmacology</h2>
      <p>Mescaline is a phenethylamine that acts primarily as a 5-HT2A receptor agonist — the same mechanism as psilocybin and LSD. Duration: 8-12 hours. Onset: 1-2 hours. Threshold dose: 100-150mg mescaline HCl equivalent.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/iboga-ibogaine">Iboga &amp; Ibogaine</a>
      <a href="${BASE_URL}/kava">Kava</a>
    </nav>
  </article>`
  });
}

export function renderPeptideHallOfShameHTML(): string {
  return wrapPage({
    title: "Peptide Assessment Hall of Shame — How 20 US Clinics Score",
    description: "We audited 20 peptide clinics and providers across the US on 6 clinical criteria. The results are damning: average score 93/100 (where 100 is worst).",
    keywords: "peptide clinics, peptide audit, hall of shame, peptide safety, clinical criteria",
    canonical: `${BASE_URL}/peptide-hall-of-shame`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Peptide Hall of Shame — Tony Greenberg",
      "url": "https://tonygreenberg.com/peptide-hall-of-shame",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/peptide-hall-of-shame" }
    },
    body: `<article>
    <header>
      <h1>Peptide Assessment Hall of Shame</h1>
      <p><em>20 US clinics audited. 6 clinical criteria. Average score: 93/100 (where 100 is worst).</em></p>
    </header>
    <section>
      <h2>The Six Criteria</h2>
      <ol>
        <li>Sourcing transparency — where do the peptides come from?</li>
        <li>Certificate of Analysis (COA) availability</li>
        <li>Compounding pharmacy accreditation (PCAB or equivalent)</li>
        <li>Licensed physician oversight</li>
        <li>Informed consent protocols</li>
        <li>Post-treatment monitoring and follow-up</li>
      </ol>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/peptide-watch">Peptide Watch</a>
      <a href="${BASE_URL}/peptide-supply-chain">Supply Chain</a>
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
    </nav>
  </article>`
  });
}

export function renderPeptideSupplyChainHTML(): string {
  return wrapPage({
    title: "Where Does Your Peptide Dollar Go? — Supply Chain Transparency",
    description: "Follow the money in the peptide supply chain. From Chinese API manufacturer to US compounding pharmacy to clinic to patient — and who takes what margin.",
    keywords: "peptide supply chain, peptide cost, peptide margin, BioChain, supply chain transparency",
    canonical: `${BASE_URL}/peptide-supply-chain`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Peptide Supply Chain — Tony Greenberg",
      "url": "https://tonygreenberg.com/peptide-supply-chain",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/peptide-supply-chain" }
    },
    body: `<article>
    <header>
      <h1>Where Does Your Peptide Dollar Go?</h1>
      <p><em>Follow the money. From Chinese API manufacturer to your vial — and who takes what margin.</em></p>
    </header>
    <section>
      <h2>The BioChain Solution</h2>
      <p>BioChain connects verified manufacturers directly to informed buyers — eliminating the gray market markup and providing full supply chain transparency.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/peptide-watch">Peptide Watch</a>
      <a href="${BASE_URL}/peptide-hall-of-shame">Hall of Shame</a>
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
    </nav>
  </article>`
  });
}

export function renderPeptideMatrixHTML(): string {
  return wrapPage({
    title: "Peptide Evidence Matrix — Evidence-Based Ratings",
    description: "Evidence-based ratings for peptides by efficacy, safety, and research quality. The most rigorous peptide assessment available.",
    keywords: "peptide matrix, peptide evidence, peptide efficacy, peptide safety, research quality",
    canonical: `${BASE_URL}/peptide-matrix`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Peptide Matrix — Tony Greenberg",
      "url": "https://tonygreenberg.com/peptide-matrix",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/peptide-matrix" }
    },
    body: `<article>
    <header>
      <h1>Peptide Evidence Matrix</h1>
      <p><em>Evidence-based ratings for peptides by efficacy, safety, and research quality.</em></p>
    </header>
    <section>
      <h2>The Top-Rated Peptides</h2>
      <ul>
        <li><strong>BPC-157:</strong> Efficacy A, Safety A, Research B+ — tissue repair, gut healing</li>
        <li><strong>TB-500:</strong> Efficacy A-, Safety A, Research B — systemic healing, recovery</li>
        <li><strong>Epithalon:</strong> Efficacy B+, Safety A, Research B — telomere extension, longevity</li>
        <li><strong>GHK-Cu:</strong> Efficacy B+, Safety A, Research B+ — skin, wound healing, anti-aging</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/peptide-watch">Peptide Watch</a>
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
      <a href="${BASE_URL}/peptide-hall-of-shame">Hall of Shame</a>
    </nav>
  </article>`
  });
}

export function renderRipPeptideSciencesHTML(): string {
  return wrapPage({
    title: "What Happened to Peptide Sciences? | Tony Greenberg",
    description: "A fact-focused overview of the Peptide Sciences shutdown, independent verification, COA quality, and the questions buyers should ask next.",
    keywords: "Peptide Sciences shutdown, peptide verification, COA verification, independent peptide testing, peptide safety",
    canonical: `${BASE_URL}/rip-peptide-sciences`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "What Happened to Peptide Sciences?",
      "url": `${BASE_URL}/rip-peptide-sciences`,
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": `${BASE_URL}/about` },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": BASE_URL },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/rip-peptide-sciences` }
    },
    body: `<article>
      <header><h1>What Happened to Peptide Sciences?</h1><p><em>A fact-focused guide to a vendor shutdown, product verification, and the limits of trust-by-brand.</em></p></header>
      <section><h2>What the shutdown exposed</h2><p>When a supplier disappears, a buyer loses more than a storefront. They lose access to the provenance records, batch context, and customer-service relationship that were supposed to support a purchasing decision. The lesson is not panic. It is to separate a brand claim from independently verifiable evidence.</p><p>This page tracks the questions that matter after a disruption: what was publicly communicated, what documentation can still be independently checked, and what a buyer should verify before relying on any replacement source.</p></section>
      <section><h2>What a real certificate of analysis requires</h2><p>A useful certificate of analysis is more than a vendor-issued PDF. It should identify the batch, the testing method, the laboratory, and a way to verify the result independently with the laboratory itself. A buyer should be able to trace a claim without asking the seller to interpret the evidence.</p><p>Testing documentation is one signal, not a medical endorsement or a guarantee of suitability. Consult a licensed clinician for decisions about prescription medicines or health conditions.</p></section>
      <section><h2>The durable rule</h2><p>Trust needs a chain of evidence. The seller can explain a product. The independent laboratory can verify a result. The buyer should be able to see where those two stories meet and where they do not.</p></section>
      <nav class="nav-links"><a href="${BASE_URL}/test-your-peptides">How to test your peptides</a><a href="${BASE_URL}/verify-your-coa">Verify a COA</a><a href="${BASE_URL}/price-tracker">Peptide price tracker</a><a href="${BASE_URL}/whats-legal">What is legal</a></nav>
    </article>`
  });
}

export function renderTestYourPeptidesHTML(): string {
  return wrapPage({
    title: "How to Independently Test Peptides | Tony Greenberg",
    description: "A practical verification framework for peptide documentation, third-party testing, batch records, and the questions worth asking before relying on a vial.",
    keywords: "independent peptide testing, peptide COA, certificate of analysis, third-party laboratory, peptide verification",
    canonical: `${BASE_URL}/test-your-peptides`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Independently Test Peptides",
      "url": `${BASE_URL}/test-your-peptides`,
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": `${BASE_URL}/about` },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": BASE_URL },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/test-your-peptides` }
    },
    body: `<article>
      <header><h1>How to Independently Test Peptides</h1><p><em>Do not outsource your judgment. Learn what the documentation can prove and what it cannot.</em></p></header>
      <section><h2>Start with the chain of evidence</h2><p>Independent verification begins with a batch-specific record. A document should name the sample, identify the laboratory and method, and allow the result to be checked with the laboratory rather than only through a vendor.</p><p>When those elements are missing, the document may still be information, but it is not a complete basis for confidence. Treat absence of evidence as a reason to slow down, not a reason to invent certainty.</p></section>
      <section><h2>Four useful questions</h2><ol><li>Is the result linked to the exact batch being offered?</li><li>Can the laboratory verify the report independently?</li><li>Does the method match the claim being made?</li><li>Is there a licensed clinical path where one is required?</li></ol></section>
      <section><h2>What this guide is not</h2><p>This is a buyer-verification framework. It is not medical advice, dosing guidance, or a recommendation to purchase or use any compound. Medication and treatment decisions belong with a qualified clinician.</p></section>
      <nav class="nav-links"><a href="${BASE_URL}/verify-your-coa">Verify a COA</a><a href="${BASE_URL}/rip-peptide-sciences">Peptide Sciences overview</a><a href="${BASE_URL}/price-tracker">Peptide price tracker</a><a href="${BASE_URL}/whats-legal">What is legal</a></nav>
    </article>`
  });
}

export function renderPriceTrackerHTML(): string {
  return wrapPage({
    title: "Peptide Price Tracker | Tony Greenberg",
    description: "Price intelligence for peptide markets, designed to expose information asymmetry and help readers compare claims, documentation, and the true cost of a purchasing path.",
    keywords: "peptide prices, peptide price tracker, peptide market pricing, peptide documentation, price intelligence",
    canonical: `${BASE_URL}/price-tracker`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Peptide Price Tracker",
      "url": `${BASE_URL}/price-tracker`,
      "description": "Price intelligence for peptide markets and buyer verification.",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": `${BASE_URL}/about` }
    },
    body: `<article>
      <header><h1>Peptide Price Tracker</h1><p><em>Pricing intelligence is not a shopping list. It is a way to see the information gap inside a market.</em></p></header>
      <section><h2>Price is a signal, not proof</h2><p>Two offers can carry very different prices because they include different services, standards, laboratory records, regulatory paths, or margins. A lower number does not prove better value. A higher number does not prove better quality. The job is to make the differences visible.</p><p>This tracker exists to give readers a clearer starting point for questions about provenance, documentation, clinical oversight, and the costs hidden behind a simple listed price.</p></section>
      <section><h2>Compare the path, not only the vial</h2><p>Before comparing price, compare the pathway: who made the product, what evidence is available, whether a licensed medical channel is involved, and who is accountable if a claim fails. That is where an apparent bargain can become an expensive information gap.</p></section>
      <section><h2>Use with care</h2><p>Market figures change and individual circumstances differ. This page does not recommend any peptide, supplier, or treatment plan. For medical decisions, work with a qualified clinician.</p></section>
      <nav class="nav-links"><a href="${BASE_URL}/test-your-peptides">How to test peptides</a><a href="${BASE_URL}/verify-your-coa">Verify a COA</a><a href="${BASE_URL}/rip-peptide-sciences">Peptide Sciences overview</a><a href="${BASE_URL}/whats-legal">What is legal</a></nav>
    </article>`
  });
}

// ── Advocacy & accountability ──

export function renderAttentionTheftHTML(): string {
  return wrapPage({
    title: "Attention Theft Manifesto — Tony Greenberg",
    description: "The case against algorithmic manipulation. How social media platforms steal your attention, monetize your behavior, and undermine your autonomy.",
    keywords: "attention theft, algorithmic manipulation, social media, attention economy, Tony Greenberg",
    canonical: `${BASE_URL}/attention-theft`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Attention Theft — Tony Greenberg",
      "url": "https://tonygreenberg.com/attention-theft",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/attention-theft" }
    },
    body: `<article>
    <header>
      <h1>Attention Theft Manifesto</h1>
      <p><em>The case against algorithmic manipulation. Your attention is not a product to be sold.</em></p>
    </header>
    <section>
      <h2>The Theft</h2>
      <p>Social media platforms are not free. You pay with your attention, your behavior data, and your autonomy. The algorithm is not neutral — it's optimized for engagement, which means it's optimized for outrage, fear, and compulsion. This is not a bug. It's the business model.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/humanos">Human OS 2.0</a>
      <a href="${BASE_URL}/subscribe">Subscribe</a>
    </nav>
  </article>`
  });
}

export function renderCheshireGrinHTML(): string {
  return wrapPage({
    title: "Alex Azzi — XRWorkout CEO & Biohackers UAE",
    description: "Community report documenting unpaid invoices and conduct concerns regarding Alex Azzi, CEO of XRWorkout and founder of Biohackers UAE.",
    keywords: "Alex Azzi, XRWorkout, Biohackers UAE, community report, accountability",
    canonical: `${BASE_URL}/cheshire-grin`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cheshire Grin — Tony Greenberg",
      "url": "https://tonygreenberg.com/cheshire-grin",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Alex Azzi — Community Report</h1>
      <p><em>A documented community report. The record, as it stands.</em></p>
    </header>
    <section>
      <h2>The Record</h2>
      <p>This page documents community concerns regarding Alex Azzi, CEO of XRWorkout and founder of Biohackers UAE. The documentation includes unpaid invoices, conduct concerns, and community testimony.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

export function renderAlexAzziHTML(): string {
  return wrapPage({
    title: "Alex Azzi — XRWorkout CEO & Biohackers UAE",
    description: "Community report documenting unpaid invoices and conduct concerns regarding Alex Azzi, CEO of XRWorkout and founder of Biohackers UAE.",
    keywords: "Alex Azzi, XRWorkout, Biohackers UAE, community report, accountability",
    canonical: `${BASE_URL}/alex-azzi`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Alex Azzi — Tony Greenberg",
      "url": "https://tonygreenberg.com/alex-azzi",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Alex Azzi — Community Report</h1>
      <p><em>A documented community report. The record, as it stands.</em></p>
    </header>
    <section>
      <h2>The Record</h2>
      <p>This page documents community concerns regarding Alex Azzi, CEO of XRWorkout and founder of Biohackers UAE. The documentation includes unpaid invoices, conduct concerns, and community testimony.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

export function renderImpactDashboardHTML(): string {
  return wrapPage({
    title: "Impact Measurement Dashboard — ImpactSoul",
    description: "The scoreboard nobody built. Four token ecosystems, 100 charities scored, 12 dimensions measured, 35+ portfolio companies tracked.",
    keywords: "ImpactSoul, impact dashboard, token ecosystems, impact measurement, portfolio tracking",
    canonical: `${BASE_URL}/impact-dashboard`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Impact Dashboard — Tony Greenberg",
      "url": "https://tonygreenberg.com/impact-dashboard",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Impact Measurement Dashboard</h1>
      <p><em>The scoreboard nobody built. Consciousness-adjusted impact at scale.</em></p>
    </header>
    <section>
      <h2>The Problem with Impact Measurement</h2>
      <p>Impact investing has a measurement problem. The industry has produced a proliferation of frameworks — ESG scores, B Impact Assessment, IRIS+ metrics, SDG alignment — without producing clarity. Most impact scores are self-reported, unaudited, and optimized for marketing rather than accountability. The result is a market where the best-looking impact reports often come from the least accountable organizations.</p>
      <p>The Impact Measurement Dashboard is ImpactSoul's attempt to build the scoreboard the industry needs. It applies a 12-dimension measurement framework across four token ecosystems, 100 charities, and 35+ portfolio companies. The framework is consciousness-adjusted — it accounts not just for what an organization does but for the level of awareness and intentionality it brings to how it does it.</p>
      <h2>What's Tracked</h2>
      <p>The four token ecosystems are BEYOND (ocean cleanup and marine conservation), REX (paleontology and natural history preservation), SPACE (digital access and technology equity), and BEING (mental health and consciousness research). Each ecosystem has its own impact metrics, but all are measured against the same 12-dimension framework.</p>
      <p>The 100 charities are scored across dimensions including mission clarity, financial efficiency, governance quality, impact measurement rigor, transparency, and consciousness level. The charity scorecard is available as a standalone tool for donors who want to make more informed giving decisions.</p>
      <h2>The Consciousness Adjustment</h2>
      <p>The consciousness adjustment is the most controversial element of the framework. It draws on David Hawkins' Map of Consciousness and Tony Greenberg's 25 years of organizational assessment work to evaluate the level of awareness an organization brings to its work. Organizations operating from fear, pride, or desire produce different outcomes than organizations operating from courage, acceptance, or love — even when their stated missions are identical. The dashboard makes this visible.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/impact">Impact</a>
      <a href="${BASE_URL}/charity-scorecard">Charity Scorecard</a>
      <a href="${BASE_URL}/invest">Invest in the Thesis</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

export function renderThesisThreadsHTML(): string {
  return wrapPage({
    title: "Thesis Threads — Connective Tissue Between Essays",
    description: "The connective tissue between Tony Greenberg's essays — recurring themes, arguments, and intellectual threads across 25 years of writing.",
    keywords: "thesis threads, essay themes, intellectual threads, Tony Greenberg writing",
    canonical: `${BASE_URL}/thesis-threads`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Thesis Threads — Tony Greenberg",
      "url": "https://tonygreenberg.com/thesis-threads",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Thesis Threads</h1>
      <p><em>The connective tissue. The recurring themes across 25 years of writing.</em></p>
    </header>
    <section>
      <h2>The Threads</h2>
      <ul>
        <li><strong>Trust as Infrastructure:</strong> From vendor negotiation to psychedelic ceremony</li>
        <li><strong>Broken Systems &amp; Their Replacements:</strong> Every essay identifies a broken system and points toward what replaces it</li>
        <li><strong>Consciousness as Capital:</strong> The Hawkins Map applied to organizations, movements, and ideas</li>
        <li><strong>The Measurement Imperative:</strong> What gets measured gets managed</li>
        <li><strong>The Regenerative Thesis:</strong> Extractive systems are reaching their limits</li>
      </ul>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/the-index">The Index</a>
      <a href="${BASE_URL}/find-your-journey">Find Your Reading Path</a>
    </nav>
  </article>`
  });
}

export function renderFauxTonyHTML(): string {
  return wrapPage({
    title: "FauxTony — AI Conversation with Tony Greenberg",
    description: "An AI-powered conversation interface trained on Tony Greenberg's essays, assessments, and thinking. Ask anything.",
    keywords: "FauxTony, AI conversation, Tony Greenberg AI, chat",
    canonical: `${BASE_URL}/fauxtony`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "FauxTony — Tony Greenberg",
      "url": "https://tonygreenberg.com/faux-tony",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>FauxTony</h1>
      <p><em>An AI-powered conversation trained on 25 years of essays, assessments, and thinking.</em></p>
    </header>
    <section>
      <h2>What This Is</h2>
      <p>FauxTony is an AI conversation interface trained on Tony Greenberg's published essays, assessments, and frameworks. It is not Tony Greenberg. It is a model of how Tony Greenberg thinks — built from 119 published essays, 25 assessment instruments, and the accumulated frameworks of 25 years of work at the intersection of enterprise technology, impact investing, psychedelic medicine, and systems thinking.</p>
      <p>The interface is designed for people who have read some of the work and want to go deeper — who want to ask follow-up questions, explore implications, or test ideas against the framework. It is also designed for people who are new to the work and want a guided entry point rather than starting with a cold archive of 119 essays.</p>
      <h2>What to Ask</h2>
      <p>FauxTony can engage with questions across all the domains covered in the work. <strong>Enterprise technology:</strong> vendor negotiation strategy, AI infrastructure procurement, data center economics, the RampRate SPY Index methodology. <strong>Psychedelic medicine:</strong> readiness assessment, facilitation principles, the Diode of Perception framework, specific medicines and their appropriate contexts. <strong>Impact investing:</strong> the ImpactSoul thesis, consciousness-adjusted impact measurement, tokenization of real assets, the regenerative capital framework.</p>
      <p><strong>Systems thinking:</strong> broken systems and what replaces them, the relationship between consciousness and organizational performance, the Hawkins Map applied to institutions. <strong>Personal development:</strong> the assessment suite, the identity frameworks, the philosophy of readiness and preparation. <strong>Writing and ideas:</strong> the arguments in specific essays, the connections between themes, the intellectual lineage of the work.</p>
      <h2>Limitations</h2>
      <p>FauxTony is a model, not the person. It can represent the published thinking accurately. It cannot access unpublished work, private conversations, or current events after its training cutoff. For direct engagement with Tony Greenberg, use the contact page or the engagement intake.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/articles">All Articles</a>
      <a href="${BASE_URL}/assessments">Assessments</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/engage">Work Together</a>
    </nav>
  </article>`
  });
}

export function renderClockKeeperHTML(): string {
  return wrapPage({
    title: "The Clock Keeper Chronicles: Part II — Your Response",
    description: "Five questions. Not an intellectual challenge — a container for what already exists. A form for the offering, in whatever shape it takes.",
    keywords: "clock keeper, Tony Greenberg, response, five questions",
    canonical: `${BASE_URL}/clock-keeper-part-2`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Clock Keeper — Tony Greenberg",
      "url": "https://tonygreenberg.com/clock-keeper",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Clock Keeper Chronicles: Part II</h1>
      <p><em>Five questions. A container for what already exists.</em></p>
    </header>
    <section>
      <h2>What This Is</h2>
      <p>The Clock Keeper Chronicles is a two-part project. Part I is an essay — a meditation on time, attention, and the strange experience of watching your own life from the outside. Part II is this: five questions that function as a container for your response to that essay, or to the larger questions it raises.</p>
      <p>The questions are not an intellectual challenge. They are not a quiz with correct answers. They are an invitation to articulate something that may not yet have words — your relationship with time, with the pace of your life, with the things you are postponing and the things you are rushing toward. The form is simple. The content is yours.</p>
      <h2>The Five Questions</h2>
      <p>The questions move from the concrete to the abstract. They begin with how you actually spend your time — the observable facts of your days — and move toward the harder questions: what you are protecting, what you are afraid of, and what you would do differently if you believed you had less time than you think.</p>
      <p>Tony Greenberg developed this project from his own experience of time pressure — the particular quality of attention that comes from having more things you want to do than time to do them, and the discipline required to choose well rather than simply react. The Clock Keeper is the part of you that knows the difference between urgency and importance, and is trying to get your attention.</p>
      <h2>How to Use This</h2>
      <p>Read Part I first. Then come here. Take as long as you need with each question. The responses are not scored or evaluated. They are offered as a record — a moment of honest accounting that you can return to. Some people find that writing the answers is the point. Others find that the questions themselves are enough.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/assessments">All Assessments</a>
    </nav>
  </article>`
  });
}

export function renderShopHTML(): string {
  return wrapPage({
    title: "Shop — Essay Products & Living Well",
    description: "Essay compilations, frameworks, and curated tools from Tony Greenberg. Twenty-five years of pattern recognition, available for the first time.",
    keywords: "Tony Greenberg shop, essay compilations, frameworks, tools",
    canonical: `${BASE_URL}/shop`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Shop — Tony Greenberg",
      "url": "https://tonygreenberg.com/shop",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Shop</h1>
      <p><em>Essay compilations, frameworks, and curated tools. 25 years of pattern recognition.</em></p>
    </header>
    <section>
      <h2>What's Here</h2>
      <p>Twenty-five years of working at the intersection of enterprise technology, impact investing, psychedelic medicine, and systems thinking produces a certain kind of knowledge. Not the kind that fits in a LinkedIn post or a conference keynote. The kind that only comes from being in the room — from the vendor negotiations, the board meetings, the ceremony circles, the failed investments, and the ones that worked.</p>
      <p>The Shop is where that knowledge becomes available in structured form. Essay compilations organized by theme. Frameworks extracted from the work and made standalone. Curated tools — assessments, diagnostics, and decision frameworks — that have been used in real engagements with real organizations and real individuals.</p>
      <h2>Essay Compilations</h2>
      <p>The essay compilations gather Tony Greenberg's published writing by domain: enterprise technology and AI infrastructure, psychedelic medicine and consciousness research, impact investing and regenerative capital, and systems thinking and organizational design. Each compilation includes the full essays plus editorial notes connecting the themes across time.</p>
      <p>The compilations are for people who want to go deep rather than skim. They are for people who have read one essay and want the full context. They are for people who are building something and want the pattern recognition that comes from 25 years of watching what works and what doesn't.</p>
      <h2>Frameworks and Tools</h2>
      <p>The frameworks are the distillations — the models that have proven useful across multiple domains and multiple clients. The Vendor Intelligence Framework. The Consciousness-Adjusted Impact Model. The Readiness Assessment Protocol. The Diamond Cut methodology. Each framework is documented with context, application guidelines, and worked examples.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/articles">All Articles</a>
      <a href="${BASE_URL}/assessments">Assessments</a>
      <a href="${BASE_URL}/subscribe">Subscribe</a>
      <a href="${BASE_URL}/engage">Work Together</a>
    </nav>
  </article>`
  });
}

export function renderDiamondCutHTML(): string {
  return wrapPage({
    title: "The Diamond Cut — Services to Product",
    description: "For services businesses not yet at product scale. Tony identifies the diamond in your rough, maps services to scalable product, and activates Fortune 50 distribution.",
    keywords: "diamond cut, services to product, Tony Greenberg, consulting, product strategy",
    canonical: `${BASE_URL}/diamond-cut`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "The Diamond Cut — Tony Greenberg",
      "url": "https://tonygreenberg.com/diamond-cut",
      "provider": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "areaServed": "Worldwide"
    },
    jsonLdExtra: [
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What is The Diamond Cut?", "acceptedAnswer": { "@type": "Answer", "text": "The Diamond Cut is Tony Greenberg's engagement model for services businesses sitting on unproductized expertise. Tony identifies the diamond in your rough, maps services to scalable product, and activates Fortune 50 distribution channels." } },
        { "@type": "Question", "name": "Who is this for?", "acceptedAnswer": { "@type": "Answer", "text": "Services businesses not yet at product scale. If you have a repeatable, scalable offering inside your current services business that could reach 10x more customers with the same team, this engagement is for you." } },
        { "@type": "Question", "name": "How does an engagement begin?", "acceptedAnswer": { "@type": "Answer", "text": "Every engagement begins with a scoping conversation. Engagements are relationship-originated and priced inside the conversation." } },
        { "@type": "Question", "name": "What is the guarantee?", "acceptedAnswer": { "@type": "Answer", "text": "The 2X Return Guarantee: do the work, show the receipts, get 2x back. Both engagements include a handpicked vertical domain expert — Tony does not show up alone." } }
      ] }
    ],
    body: `<article>
    <header>
      <h1>The Diamond Cut</h1>
      <p><em>For services businesses not yet at product scale. The diamond is already there.</em></p>
    </header>
    <section>
      <h2>What This Is</h2>
      <p>Most services businesses have a product inside them — a repeatable, scalable offering that could reach 10x more customers with the same team. The Diamond Cut is the engagement model for identifying that product, mapping the transition, and activating Fortune 50 distribution channels.</p>
      <p>Outcome-oriented. Engagements begin with a scoping conversation.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/amplifier">The Amplifier</a>
      <a href="${BASE_URL}/engage">Enter The Gate</a>
      <a href="${BASE_URL}/clients">Client Roster</a>
    </nav>
  </article>`
  });
}

export function renderSpiritsHTML(): string {
  return wrapPage({
    title: "Spirits — Tony Greenberg",
    description: "Tony Greenberg's guide to spirits — whisky, sake, mezcal, and the drinks that tell the truth about where they come from.",
    keywords: "spirits, whisky, sake, mezcal, Tony Greenberg, drinks",
    canonical: `${BASE_URL}/spirits`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Spirits — Tony Greenberg",
      "url": "https://tonygreenberg.com/spirits",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Spirits</h1>
      <p><em>The drinks that tell the truth about where they come from.</em></p>
    </header>
    <section>
      <h2>The Philosophy</h2>
      <p>Tony Greenberg has spent 25 years at the intersection of technology, capital, and consciousness. Spirits are where he rests. Not as an escape from that work, but as an extension of it. Every great spirit is a systems problem: the interaction of raw material, process, time, and terroir produces something that cannot be reverse-engineered. That is the same thing that makes a great company, a great relationship, or a great life.</p>
      <p>The drinks that matter are the ones that carry information. A 25-year Scotch carries the weather of 25 Scottish winters. A Oaxacan mezcal carries the specific agave variety, the specific village, the specific maestro who made it. Sake carries the rice variety, the water source, the koji culture. These are not marketing claims. They are the actual content of the drink. Learning to read them is learning to pay attention.</p>
    </section>
    <section>
      <h2>The Territories</h2>
      <ul>
        <li><strong>Whisky:</strong> Scotch, bourbon, Japanese, Irish, and the emerging craft distilleries. The grain, the barrel, the time, and the water. Single malt vs blended. Age statements and their limits. The difference between a whisky that was stored for 25 years and one that was made to taste like it was.</li>
        <li><strong>Sake:</strong> Rice, water, koji, and the brewer's judgment. The most honest drink on earth because there is nowhere to hide. Junmai, ginjo, daiginjo, nigori, koshu. The difference between sake made for export and sake made for the Japanese market. The Find Your Sake assessment is the starting point.</li>
        <li><strong>Mezcal:</strong> Agave, smoke, terroir, and the maestro. The spirit with the longest memory because the agave plant takes 8 to 30 years to mature before it can be harvested. Espadin vs tobala vs wild-harvested varieties. The difference between industrial mezcal and village production. The certification system and its limitations.</li>
        <li><strong>Kava:</strong> The threshold medicine. Not a spirit in the conventional sense, but a preparation that occupies the same cultural space in Polynesia and Melanesia that wine occupies in Europe. Noble vs tudei varieties. The kavalactone profile and its effects. The kava bar movement and what it means for the future of social drinking.</li>
      </ul>
    </section>
    <section>
      <h2>The Assessments</h2>
      <p>The Find Your Sake assessment matches your palate, occasion, and values to the right sake style. The Find Your Spirit assessment helps you identify the spirit category that matches your sensory preferences and the occasions you are drinking for. Both are built on the same principle as all Find My tools: accurate routing requires accurate input.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-sake">Find Your Sake</a>
      <a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a>
      <a href="${BASE_URL}/kava">Kava Encyclopedia</a>
      <a href="${BASE_URL}/brewsoul">BrewSoul</a>
    </nav>
  </article>`
  });
}

export function renderSupplierIntakeLongHTML(): string {
  return wrapPage({
    title: "Supplier Intake (Long Form) — BioChain by RampRate",
    description: "Detailed supplier intake for BioChain — the peptide supply chain transparency platform. For verified peptide manufacturers seeking direct buyer connections.",
    keywords: "supplier intake, BioChain, RampRate, peptide supplier, manufacturer, long form",
    canonical: `${BASE_URL}/supplier-intake-long`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Supplier Intake — Tony Greenberg",
      "url": "https://tonygreenberg.com/supplier-intake-long",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>Supplier Intake — Long Form</h1>
      <p><em>For verified peptide manufacturers seeking direct buyer connections through BioChain.</em></p>
    </header>
    <section>
      <h2>About BioChain</h2>
      <p>BioChain is RampRate's peptide supply chain transparency platform. It was built to solve a specific problem: the peptide market is opaque, unregulated, and full of actors whose quality claims cannot be verified. Buyers — whether researchers, clinicians, or informed consumers — have no reliable way to distinguish between manufacturers who meet pharmaceutical-grade standards and those who do not.</p>
      <p>BioChain creates that transparency. It documents manufacturer credentials, testing protocols, sourcing practices, and quality certifications in a standardized format that allows buyers to make informed decisions. The platform draws on RampRate's 25 years of supply chain intelligence work, applied to the emerging peptide therapeutics market.</p>
      <h2>The Long Form Intake</h2>
      <p>The long form supplier intake is for manufacturers who want full verification and direct buyer connections. It collects detailed information about manufacturing facilities, quality management systems, testing protocols, regulatory compliance, product catalog, and business practices. The process takes approximately 45 minutes to complete and requires documentation.</p>
      <p>Verified suppliers are listed in the BioChain database with their full credential profile. Buyers searching for specific peptides can filter by verification status, manufacturing location, testing protocols, and minimum order quantities. Verified suppliers receive direct inquiry notifications from qualified buyers.</p>
      <h2>What Verification Covers</h2>
      <p>BioChain verification covers: GMP compliance documentation, third-party testing protocols (HPLC, mass spectrometry, sterility), Certificate of Analysis standards, facility inspection records where available, regulatory status in the manufacturer's jurisdiction, and business registration and ownership documentation. Verification is not an endorsement — it is a documented record of what the manufacturer has provided and what has been independently confirmed.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/peptide-supply-chain">Supply Chain Transparency</a>
      <a href="${BASE_URL}/peptide-matrix">Peptide Matrix</a>
      <a href="${BASE_URL}/supplier-intake">Short Form Intake</a>
    </nav>
  </article>`
  });
}

export function renderTheMirrorHTML(): string {
  return wrapPage({
    title: "The Mirror — Life Assessment",
    description: "A comprehensive life audit across health, wealth, relationships, and purpose.",
    keywords: "life assessment, life audit, the mirror, Tony Greenberg",
    canonical: `${BASE_URL}/the-mirror`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Mirror — Tony Greenberg",
      "url": "https://tonygreenberg.com/the-mirror",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
    <header>
      <h1>The Mirror</h1>
      <p><em>A comprehensive life audit. Health, wealth, relationships, and purpose.</em></p>
    </header>
    <section>
      <h2>What the Mirror Does</h2>
      <p>Most people avoid honest self-assessment. Not because they are incapable of it, but because the gap between where they are and where they want to be is uncomfortable to look at directly. The Mirror is designed to make that look possible — structured, bounded, and productive rather than paralyzing.</p>
      <p>The Mirror is a comprehensive life audit across six dimensions: health (physical condition, energy, and longevity trajectory), wealth (financial position, trajectory, and relationship with money), relationships (quality and depth of connection across family, friendship, and partnership), work (alignment between what you do and what you are capable of), purpose (clarity about what you are here to do), and growth (the rate at which you are developing as a person).</p>
      <h2>The Six Dimensions</h2>
      <p><strong>Health</strong> covers physical condition, energy levels, sleep quality, movement practice, and longevity orientation. It asks not just where you are but where you are headed. <strong>Wealth</strong> covers financial position, income trajectory, savings rate, investment approach, and psychological relationship with money — including the beliefs about money that may be limiting your financial life.</p>
      <p><strong>Relationships</strong> covers the quality and depth of your primary relationships across family, friendship, romantic partnership, and professional community. <strong>Work</strong> covers the alignment between your current work and your actual capabilities, values, and ambitions. <strong>Purpose</strong> covers clarity about your direction — whether you have a clear sense of what you are building and why. <strong>Growth</strong> covers the rate at which you are developing — whether your life is expanding or contracting.</p>
      <h2>How to Use the Results</h2>
      <p>The Mirror produces a six-dimension profile with a score for each dimension and an overall life audit score. The profile identifies your strongest dimensions and your most significant gaps. It also identifies the relationships between dimensions — how your health is affecting your work, how your relationship clarity is affecting your purpose, how your financial anxiety is affecting your growth.</p>
      <p>The goal is not a perfect score. The goal is an honest map. Most people find that the act of completing the audit is itself valuable — that the questions surface things they knew but had not articulated, and that the profile gives them a starting point for the conversations and decisions that matter most.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/find-your-me">Find Your Me</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    </nav>
  </article>`
  });
}

// ── BrewSoul sub-pages (all served by the same BrewSoul HTML) ──

export function renderBrewSoulSubpageHTML(subpath: string): string {
  const subpageTitles: Record<string, { title: string; description: string }> = {
    "/brewsoul/home": { title: "BrewSoul — Specialty Coffee Intelligence", description: "The world's most rigorous specialty coffee platform. Sourcing, roasting, and brewing intelligence for serious coffee people." },
    "/brewsoul/browse": { title: "Browse Coffee — BrewSoul", description: "Browse specialty coffees by origin, process, roast level, and flavor profile." },
    "/brewsoul/first-sip": { title: "First Sip — BrewSoul", description: "Your first step into specialty coffee. Where to start, what to look for, and how to develop your palate." },
    "/brewsoul/quiz": { title: "Coffee Quiz — BrewSoul", description: "Find your perfect coffee match. 10 questions to discover your ideal origin, process, and roast." },
    "/brewsoul/wall-of-shame": { title: "Wall of Shame — BrewSoul", description: "100 coffee chains ranked by quality, transparency, and sourcing practices. The results are not flattering." },
    "/brewsoul/follow-the-dollar": { title: "Follow the Dollar — BrewSoul", description: "Where does your coffee dollar actually go? The supply chain economics of specialty coffee." },
    "/brewsoul/health": { title: "Coffee & Health — BrewSoul", description: "The complete science of coffee and health. What the research actually shows about your daily cup." },
    "/brewsoul/farms": { title: "Coffee Farms — BrewSoul", description: "The farms behind the best specialty coffees. Origin stories, farming practices, and producer profiles." },
    "/brewsoul/mold-free": { title: "Mold-Free Coffee — BrewSoul", description: "The truth about mycotoxins in coffee. Which coffees are actually mold-free and which are marketing." },
    "/brewsoul/experiences": { title: "Coffee Experiences — BrewSoul", description: "Curated coffee experiences — from farm visits to brewing workshops to tasting events." },
    "/brewsoul/varieties": { title: "Coffee Varieties — BrewSoul", description: "The complete guide to coffee varieties. Bourbon, Gesha, Typica, SL28, and more." },
    "/brewsoul/processing": { title: "Coffee Processing — BrewSoul", description: "Natural, washed, honey, anaerobic — the complete guide to coffee processing and how it affects flavor." },
    "/brewsoul/roasters": { title: "Roaster Directory — BrewSoul", description: "The best specialty coffee roasters, ranked and reviewed. Quality, sourcing, and transparency scores." },
    "/brewsoul/glossary": { title: "Coffee Glossary — BrewSoul", description: "The complete specialty coffee glossary. Every term you need to know, explained without pretension." },
    "/brewsoul/pairings": { title: "Coffee Pairings — BrewSoul", description: "What to eat with your coffee. Evidence-based pairing recommendations for every brewing method and origin." },
    "/brewsoul/economics": { title: "Coffee Economics — BrewSoul", description: "The economics of specialty coffee. Why good coffee costs what it costs, and where the money goes." },
    "/brewsoul/compare": { title: "Coffee Comparison — BrewSoul", description: "Compare coffees side by side. Origins, processes, roasters, and flavor profiles." },
    "/brewsoul/blend-builder": { title: "Blend Builder — BrewSoul", description: "Build your perfect coffee blend. Mix origins and processes to create your ideal cup." },
    "/brewsoul/drops": { title: "Coffee Drops — BrewSoul", description: "Limited releases and special drops from the best specialty roasters. Get notified when they land." },
    "/brewsoul/collection": { title: "My Coffee Collection — BrewSoul", description: "Track and manage your coffee collection. Rate, review, and discover what you love." },
    "/brewsoul/submit": { title: "Submit a Coffee — BrewSoul", description: "Submit a coffee for review. Help build the most rigorous specialty coffee database on the internet." },
    "/brewsoul/prescription": { title: "Coffee Prescription — BrewSoul", description: "Your personalized coffee prescription. Based on your taste profile, health goals, and lifestyle." },
    "/brewsoul/chains": { title: "Coffee Chains Ranked — BrewSoul", description: "100 coffee chains ranked by quality, sourcing, and transparency. From Starbucks to Blue Bottle." },
    "/brewsoul/biodynamic": { title: "Biodynamic Coffee — BrewSoul", description: "The complete guide to biodynamic coffee. What it means, why it matters, and the best producers." },
    "/brewsoul/decaf": { title: "Decaf Coffee — BrewSoul", description: "The truth about decaf. Swiss water, CO2, and chemical processes — what's actually in your decaf cup." },
    "/brewsoul/directory": { title: "Coffee Directory — BrewSoul", description: "The complete directory of specialty coffee roasters, cafes, and producers." },
    "/brewsoul/cities": { title: "Coffee Cities — BrewSoul", description: "The best cities for specialty coffee. Where to drink, what to order, and who's doing it right." },
    "/brewsoul/guest": { title: "Guest Series — BrewSoul", description: "Guest contributors sharing their expertise on specialty coffee, sustainability, and the future of the industry." },
    "/brewsoul/guest/shanita-nicholas": { title: "Shanita Nicholas — BrewSoul Guest Series", description: "Shanita Nicholas on specialty coffee, community, and the future of the industry." },
  };

  const meta = subpageTitles[subpath] || {
    title: "BrewSoul — Specialty Coffee Intelligence",
    description: "The world's most rigorous specialty coffee platform. Sourcing, roasting, and brewing intelligence for serious coffee people.",
  };

  return wrapPage({
    title: meta.title,
    description: meta.description,
    keywords: "BrewSoul, specialty coffee, coffee intelligence, Tony Greenberg",
    canonical: `${BASE_URL}${subpath}`,
    body: `<article>
    <header>
      <h1>${meta.title.replace(" — BrewSoul", "").replace(" — Tony Greenberg", "")}</h1>
      <p><em>${meta.description}</em></p>
    </header>
    <section>
      <h2>BrewSoul — Specialty Coffee Intelligence</h2>
      <p>BrewSoul is the world's most rigorous specialty coffee intelligence platform. 103 coffees scored. 100 chains ranked. 6 identity archetypes. Built on data, not vibes.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/brewsoul">BrewSoul Home</a>
      <a href="${BASE_URL}/brewsoul/browse">Browse Coffees</a>
      <a href="${BASE_URL}/brewsoul/quiz">Coffee Quiz</a>
      <a href="${BASE_URL}/find-your-coffee">Find Your Coffee</a>
    </nav>
  </article>`
  });
}

// ── Kava sub-pages ──

export function renderKavaSubpageHTML(subpath: string): string {
  const subpageMeta: Record<string, { title: string; description: string }> = {
    "/kava/origins": { title: "Kava Origins — Pacific Island Traditions", description: "The cultural and botanical origins of kava across the Pacific Islands. 3,000 years from Vanuatu to Hawaii." },
    "/kava/science": { title: "Kava Science — Kavalactones and Effects", description: "The complete science of kavalactones, their mechanisms, and what the research actually shows." },
    "/kava/interactions": { title: "Kava Drug Interactions — Safety Guide", description: "24 substances screened for kava interactions. CYP450 severity matrix, contraindications, and safe use guidelines." },
    "/kava/assessment": { title: "Kava Readiness Assessment — PRI", description: "5-domain kava readiness scoring — 0 to 100. Assess your readiness for kava as a threshold medicine." },
    "/kava/hawaii": { title: "Kava in Hawaii — The ICE Crisis Response", description: "How the Hawaiian 'awa bowl is being used as a path home from methamphetamine devastation." },
    "/kava/myths": { title: "Kava Myths Debunked — 7 Common Misconceptions", description: "7 myths about kava examined with evidence and verdicts. What's true, what's false, and what's complicated." },
    "/kava/caffeine": { title: "Kava and Caffeine — CYP1A2 Interactions", description: "Why coffee hits different with kava. CYP1A2 inhibition and the science of kava-caffeine interactions." },
    "/kava/products": { title: "Kava Products — Ceremonial Powders, RTDs, Supplements", description: "The complete kava product index. Ceremonial powders, ready-to-drink, supplements, and kava bar guides." },
    "/kava/certification": { title: "Kava Facilitator Certification — PRI", description: "12-module certification course for PRI threshold facilitators. Kava preparation, ceremony, and integration." },
  };

  const meta = subpageMeta[subpath] || {
    title: "Kava — The Threshold Medicine",
    description: "The definitive kava knowledge base. Science-grounded. Culturally respectful.",
  };

  return wrapPage({
    title: meta.title,
    description: meta.description,
    keywords: "kava, kavalactones, kava science, kava safety, Pacific Islands, threshold medicine",
    canonical: `${BASE_URL}${subpath}`,
    body: `<article>
    <header>
      <h1>${meta.title}</h1>
      <p><em>${meta.description}</em></p>
    </header>
    <section>
      <h2>The Kava Encyclopedia</h2>
      <p>Kava is a 3,000-year-old threshold medicine from the Pacific Islands. The Kava Encyclopedia at tonygreenberg.com is the most rigorous kava knowledge base available — science-grounded, culturally respectful, and built for people who want to understand what they're working with.</p>
    </section>
    <nav class="nav-links">
      <a href="${BASE_URL}/kava">Kava Home</a>
      <a href="${BASE_URL}/kava/origins">Origins</a>
      <a href="${BASE_URL}/kava/science">Science</a>
      <a href="${BASE_URL}/kava/interactions">Drug Interactions</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    </nav>
  </article>`
  });
}

function renderSpeakingHTML() {
  const canonical = `${BASE_URL}/speaking`;
  return wrapPage({
    title: "Speaking and Conversations | Tony Greenberg",
    description: "Keynotes, firesides, offsites, and working sessions with Tony Greenberg on trust, capital, technology, and the human operating system.",
    keywords: "Tony Greenberg speaker, keynote speaker, impact futurist, trust infrastructure, technology speaker, capital and impact",
    canonical,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": "Speaking and Conversations with Tony Greenberg",
      "url": canonical,
      "mainEntity": {
        "@type": "Person",
        "name": "Tony Greenberg",
        "jobTitle": "Business Person and Impact Futurist",
        "url": "https://tonygreenberg.com/about"
      }
    },
    jsonLdExtra: [{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tony Greenberg Speaking and Conversations",
      "serviceType": "Keynotes, firesides, executive offsites, and workshops",
      "provider": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "areaServed": "Worldwide",
      "url": canonical
    }],
    body: `<article>
      <h1>A room changes when someone names what everyone can already feel.</h1>
      <p>Tony Greenberg speaks about trust, capital, technology, and the human systems beneath them. The work is not a polished keynote about disruption. It is a live search for the lever that makes a broken system behave differently.</p>
      <p>For twenty five years, Tony has worked in the intermediary layer between buyers and sellers, managing more than $10 billion in transactions. He connects that experience to impact, attention, incentives, and the human operating system beneath every institution.</p>
      <h2>Speaking topics</h2>
      <section class="principle"><h3>Trust is infrastructure</h3><p>Every market, platform, and relationship is a trust system in disguise. Tony follows the seams where that system breaks, then asks what would make it worthy of the people inside it.</p></section>
      <section class="principle"><h3>Capital has a job to do</h3><p>Capital is not neutral. It can make extraction more efficient or make repair possible. This is a conversation about what happens when the people moving money decide to care where it lands.</p></section>
      <section class="principle"><h3>The human operating system</h3><p>Technology keeps accelerating. The nervous system running the technology has not received the same upgrade. Tony connects attention, incentives, identity, and the daily choices that decide whether a system helps or hollows us out.</p></section>
      <section class="principle"><h3>What comes after the broken thing</h3><p>The point is not to complain more elegantly. The point is to name the hidden mechanism, build a better one, and leave the room with somewhere specific to begin.</p></section>
      <h2>Formats</h2>
      <p>Tony is available for keynotes, fireside conversations, executive offsites, and workshops. Previous speaking and conversation settings include Davos, the Harvard H+ Summit, UCLA, and Paris Blockchain Week.</p>
      <h2>Start a conversation</h2>
      <p>Send the audience, the moment, and the question the room cannot quite ask itself to <a href="mailto:tony@tonygreenberg.com?subject=Speaking%20Invitation">tony@tonygreenberg.com</a>.</p>
      <nav class="nav-links"><a href="${BASE_URL}/about">About Tony</a><a href="${BASE_URL}/articles">Read the essays</a><a href="${BASE_URL}/impact-futurism">Impact Futurism</a></nav>
    </article>`
  });
}

/**
 * Route map for all batch-2 SSR pages.
 * Used by index.ts to register Express routes.
 */
export const BATCH2_SSR_ROUTES: Array<{ path: string; render: () => string }> = [
  // Core identity
  { path: "/self-portrait", render: renderSelfPortraitHTML },
  { path: "/the-letter", render: renderTheLetterHTML },
  // Content hubs
  { path: "/journeys", render: renderJourneysHTML },
  { path: "/series", render: renderSeriesHTML },
  // Projects & ventures
  { path: "/projects", render: renderProjectsHTML },
  { path: "/ecosystem", render: renderEcosystemHTML },
  { path: "/invest", render: renderInvestHTML },
  { path: "/impact", render: renderImpactHTML },
  { path: "/heroes", render: renderHeroesHTML },
  { path: "/published", render: renderPublishedHTML },
  { path: "/speaking", render: renderSpeakingHTML },
  { path: "/clients", render: renderClientsHTML },
  { path: "/built-on-manus", render: renderBuiltOnManusHTML },
  // Community & engagement
  { path: "/connect", render: renderConnectHTML },
  { path: "/subscribe", render: renderSubscribeHTML },
  { path: "/amplifier", render: renderAmplifierHTML },
  // Explore sections
  { path: "/the-territory", render: renderTerritoryHTML },
  { path: "/engine-room", render: renderEngineRoomHTML },
  { path: "/the-body", render: renderTheBodyHTML },
  { path: "/the-nightstand", render: renderNightstandHTML },
  { path: "/the-web", render: renderTheWebHTML },
  { path: "/pick-up-the-phone", render: renderPickUpHTML },
  { path: "/intel", render: renderIntelHTML },
  { path: "/the-open-door", render: renderTheOpenDoorHTML },
  { path: "/the-index", render: renderTheIndexHTML },
  { path: "/recent-creations", render: renderRecentCreationsHTML },
  { path: "/framework", render: renderFrameworkHTML },
  { path: "/library", render: renderLibraryHTML },
  { path: "/health", render: renderHealthHTML },
  // Assessments
  { path: "/assessment", render: renderAssessmentHTML },
  { path: "/assessments/dharma-finder", render: renderAssessmentsDharmaHTML },
  { path: "/assessments/consciousness-scale", render: renderAssessmentsConsciousnessHTML },
  { path: "/assessments/grant-study", render: renderAssessmentsGrantHTML },
  { path: "/find-your-journey", render: renderFindYourJourneyHTML },
  { path: "/find-your-attachment-style", render: renderFindYourAttachmentStyleHTML },
  { path: "/find-your-love-language", render: renderFindYourLoveLanguageHTML },
  { path: "/find-your-sexuality", render: renderFindYourSexualityHTML },
  { path: "/find-your-spirit", render: renderFindYourSpiritHTML },
  { path: "/find-your-religion", render: renderFindYourReligionHTML },
  { path: "/find-your-diet", render: renderFindYourDietHTML },
  { path: "/find-your-movement", render: renderFindYourMovementHTML },
  { path: "/find-your-sleep", render: renderFindYourSleepHTML },
  { path: "/find-your-coffee", render: renderFindYourCoffeeHTML },
  { path: "/find-your-kitchen", render: renderFindYourKitchenHTML },
  { path: "/find-your-style", render: renderFindYourStyleHTML },
  { path: "/find-your-sake", render: renderFindYourSakeHTML },
  // Health & wellness
  { path: "/psychedelic-readiness-index", render: renderPsychedelicReadinessHTML },
  { path: "/peyote-mescaline", render: renderPeyoteMescalineHTML },
  { path: "/peptide-hall-of-shame", render: renderPeptideHallOfShameHTML },
  { path: "/peptide-supply-chain", render: renderPeptideSupplyChainHTML },
  { path: "/peptide-matrix", render: renderPeptideMatrixHTML },
  { path: "/rip-peptide-sciences", render: renderRipPeptideSciencesHTML },
  { path: "/test-your-peptides", render: renderTestYourPeptidesHTML },
  { path: "/price-tracker", render: renderPriceTrackerHTML },
  // Advocacy & accountability
  { path: "/attention-theft", render: renderAttentionTheftHTML },
  { path: "/cheshire-grin", render: renderCheshireGrinHTML },
  { path: "/alex-azzi", render: renderAlexAzziHTML },
  { path: "/impact-dashboard", render: renderImpactDashboardHTML },
  { path: "/thesis-threads", render: renderThesisThreadsHTML },
  { path: "/fauxtony", render: renderFauxTonyHTML },
  { path: "/clock-keeper-part-2", render: renderClockKeeperHTML },
  { path: "/shop", render: renderShopHTML },
  { path: "/diamond-cut", render: renderDiamondCutHTML },
  { path: "/spirits", render: renderSpiritsHTML },
  { path: "/supplier-intake-long", render: renderSupplierIntakeLongHTML },
  { path: "/the-mirror", render: renderTheMirrorHTML },
  { path: "/articles", render: renderArticlesHTML },
  { path: "/the-philosophy", render: renderThePhilosophyHTML },
  { path: "/consciousness-scale", render: renderConsciousnessScaleHTML },
  { path: "/flow-circuit", render: renderFlowCircuitHTML },
  { path: "/facilitator-index", render: renderFacilitatorIndexHTML },
  { path: "/attention-theft/economics", render: renderAttentionTheftEconomicsHTML },
];

/**
 * BrewSoul sub-page routes (all served by renderBrewSoulSubpageHTML)
 */
export const BREWSOUL_SUBPAGE_PATHS = [
  "/brewsoul/home", "/brewsoul/browse", "/brewsoul/first-sip", "/brewsoul/quiz",
  "/brewsoul/wall-of-shame", "/brewsoul/follow-the-dollar", "/brewsoul/health",
  "/brewsoul/farms", "/brewsoul/mold-free", "/brewsoul/experiences", "/brewsoul/varieties",
  "/brewsoul/processing", "/brewsoul/roasters", "/brewsoul/glossary", "/brewsoul/pairings",
  "/brewsoul/economics", "/brewsoul/compare", "/brewsoul/blend-builder", "/brewsoul/drops",
  "/brewsoul/collection", "/brewsoul/submit", "/brewsoul/prescription", "/brewsoul/chains",
  "/brewsoul/biodynamic", "/brewsoul/decaf", "/brewsoul/directory", "/brewsoul/cities",
  "/brewsoul/guest", "/brewsoul/guest/shanita-nicholas",
];

/**
 * Kava sub-page routes (all served by renderKavaSubpageHTML)
 */
export const KAVA_SUBPAGE_PATHS = [
  "/kava/origins", "/kava/science", "/kava/interactions", "/kava/assessment",
  "/kava/hawaii", "/kava/myths", "/kava/caffeine", "/kava/products", "/kava/certification",
];

// ── Articles Archive SSR ──
export function renderArticlesHTML(): string {
  return wrapPage({
    title: "All Articles — Tony Greenberg",
    description: "Complete archive of Tony Greenberg's 119 published essays on enterprise technology, psychedelic medicine, impact investing, systems thinking, and conscious capitalism.",
    keywords: "Tony Greenberg articles, Tony Greenberg essays, enterprise technology, psychedelic medicine, impact investing, systems thinking, conscious capitalism",
    canonical: `${BASE_URL}/articles`,
    jsonLd: {"@context":"https://schema.org","@type":"CollectionPage","name":"Articles Archive — Tony Greenberg","url":"https://tonygreenberg.com/articles","author":{"@type":"Person","name":"Tony Greenberg","url":"https://tonygreenberg.com/about"},"isPartOf":{"@type":"WebSite","name":"Tony Greenberg","url":"https://tonygreenberg.com"}},

    body: `<article>
<header><h1>All Articles &mdash; Tony Greenberg</h1>
<p>119 essays on enterprise technology, psychedelic medicine, impact investing, systems thinking, and conscious capitalism. Every piece is indexed and searchable.</p></header>
<section><h2>Psychedelic Medicine</h2><p><em>Consciousness, therapeutic frontiers, and the science of healing.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/when-healing-becomes-extraction">I Made Money Today on Psychedelics. I&#39;m Not Celebrating.</a> &mdash; When Healing Becomes Extraction: An Open Letter to Rick Doblin and the Field <span style="color:#999;font-size:0.85em">(July 16, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/heart-protocol-addendum">The Heart Protocol — Pharmacological Addendum</a> &mdash; Compound interactions, misnomers, and what legitimate psychedelic research actually looks like <span style="color:#999;font-size:0.85em">(July 16, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/iboga-ibogaine-the-full-paradox">Iboga vs. Ibogaine: The Full Paradox</a> &mdash; Navigating the Paradoxical Compass — Tribal Ceremony vs. Clinical Reset <span style="color:#999;font-size:0.85em">(2026-06-01)</span></li>
</ul></section>
<section><h2>Systems & Innovation</h2><p><em>Technology, AI, infrastructure, and the architecture of change.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/the-password-is-killing-you">The Password Is Killing You. Literally.</a> &mdash; You didn&#39;t hire yourself to reset passwords. Neither did anyone else. And yet here we are, watching a magic link expire in real time like it&#39;s a parking meter with a grudge. <span style="color:#999;font-size:0.85em">(July 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/you-are-the-moat">You Are the Moat</a> &mdash; A letter to the generation being told they have to compete with infinity. <span style="color:#999;font-size:0.85em">(May 23, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/productivity-apps-that-rock-my-world-in-2026">Productivity Apps That Rock My World in 2026: The AI-Powered Workflow Wizard&#39;s Playbook</a> <span style="color:#999;font-size:0.85em">(February 20, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/psychedelics-could-become-extractive-capitalism">Psychedelics Could Become Extractive Capitalism—Unless We Hold Stakeholders Accountable</a> <span style="color:#999;font-size:0.85em">(November 12, 2021)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-way-of-dao">DAO: The Way Of Dao</a> <span style="color:#999;font-size:0.85em">(September 21, 2018)</span></li>
<li><a href="https://tonygreenberg.com/blog/enterprise-blockchain-can-big-business-co-opt">Enterprise Blockchain: Can Big Business Co-opt an Existential Threat?</a> <span style="color:#999;font-size:0.85em">(June 20, 2018)</span></li>
<li><a href="https://tonygreenberg.com/blog/what-solutions-are-best-built-with-blockchain">What Solutions are Best Built with Blockchain- or NOT</a> <span style="color:#999;font-size:0.85em">(March 29, 2018)</span></li>
<li><a href="https://tonygreenberg.com/blog/a-historical-perspective-on-blockchain">A Historical Perspective on Blockchain</a> <span style="color:#999;font-size:0.85em">(March 22, 2018)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-ball-and-blockchain-decentralization">The Ball and Blockchain: Obstacles to a World-Changing Trajectory</a> <span style="color:#999;font-size:0.85em">(March 21, 2018)</span></li>
<li><a href="https://tonygreenberg.com/blog/clout-v-klout-differences-and-never-be-the-same">Clout v. Klout: Why They Aren’t the Same Thing, And Never Will Be</a> <span style="color:#999;font-size:0.85em">(April 18, 2012)</span></li>
<li><a href="https://tonygreenberg.com/blog/amazon-trumps-all-other-suitors-quest-hulu">Amazon Trumps All Other Suitors in Quest for Hulu</a> <span style="color:#999;font-size:0.85em">(September 20, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again">Jumping Through Hoops with Hulu: Will Hollywood Kill Their Offspring Again?</a> <span style="color:#999;font-size:0.85em">(September 20, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/key-cloud-migration-decisions">Key Cloud Migration Decisions</a> <span style="color:#999;font-size:0.85em">(August 24, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/a-cynic-predicts-it-and-media-in-2011">A Cynic Predicts IT and Media in 2011</a> <span style="color:#999;font-size:0.85em">(January 5, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-2011-cynic-measures-his-predictions">The 2011 Cynic Measures His Predictions</a> <span style="color:#999;font-size:0.85em">(January 5, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/break-buggy-whip-now-tipping-for-streaming-video">Break Out the Buggy Whips. Is Now the Tipping Point for Streaming Video?</a> <span style="color:#999;font-size:0.85em">(November 17, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/boiling-the-human-summit-harvard-kurzweil">“Boiling the Human” H+ Summit Transcript / Harvard-Kurzweil</a> <span style="color:#999;font-size:0.85em">(September 11, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/google-verizon-walled-garden-plan">The Google/Verizon Walled Garden Plan: No Substantive Impact on Net Neutrality</a> <span style="color:#999;font-size:0.85em">(August 14, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/greenberg-kurzweil-scientist-foundation-of-trust">Greenberg on the same stage as Kurzweil, hah. H+ Summit: Rise of the Citizen-Scientist</a> <span style="color:#999;font-size:0.85em">(August 12, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/building-services-market-transhuman-era">Building a Services Market for the Transhuman Era</a> <span style="color:#999;font-size:0.85em">(August 12, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/wheres-my-flying-car-and-an-efficient-it-market">Where’s My Flying Car … and an Efficient IT Market?</a> <span style="color:#999;font-size:0.85em">(June 2, 2010)</span></li>
</ul></section>
<section><h2>Business & Capital</h2><p><em>Enterprise strategy, procurement, and the economics of trust.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/conscious-capital-partnership-ecosystem">The Alliance That Doesn&#39;t Require a Press Release</a> &mdash; How the Most Consequential Partnerships Are Built in the Quiet, Not the Noise <span style="color:#999;font-size:0.85em">(February 18, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/innovative-thinking-with-tony-greenberg-scale-up-show">Innovative Thinking with Tony Greenberg - The Scale Up Show with Ryan Staley 2024</a> <span style="color:#999;font-size:0.85em">(February 20, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/from-supply-chain-to-the-blockchain-heal">From Supply Chain to the Blockchain: Heal the Body, Mind, &amp; Earth</a> <span style="color:#999;font-size:0.85em">(November 20, 2022)</span></li>
<li><a href="https://tonygreenberg.com/blog/davos-2022-world-economic-forum-here-we-come">Davos 2022 - World Economic Forum. Here we come!</a> <span style="color:#999;font-size:0.85em">(May 22, 2022)</span></li>
<li><a href="https://tonygreenberg.com/blog/founders-institute-tony-outsourci">Founders Institute-Tony on Outsourcing 101</a> <span style="color:#999;font-size:0.85em">(October 23, 2021)</span></li>
<li><a href="https://tonygreenberg.com/blog/mastering-human-and-business-development">Mastering Human and Business Development</a> <span style="color:#999;font-size:0.85em">(November 14, 2020)</span></li>
<li><a href="https://tonygreenberg.com/blog/mastering-bd-the-art-of-the-no-that-opens-the-real-door">Mastering BD: The Art of the No That Opens the Real Door</a> <span style="color:#999;font-size:0.85em">(March 21, 2020)</span></li>
<li><a href="https://tonygreenberg.com/blog/thing-price-gouging-price-fixing">Is There Such a Thing as Price Gouging and Price Fixing in IT?</a> <span style="color:#999;font-size:0.85em">(December 15, 2017)</span></li>
<li><a href="https://tonygreenberg.com/blog/business-at-the-speed-of-light-millisecond-worth">Business At The Speed Of Light – What is a Millisecond Worth?</a> <span style="color:#999;font-size:0.85em">(December 15, 2017)</span></li>
<li><a href="https://tonygreenberg.com/blog/fast-growth-companies-likely-to-fall-part-3">How fast-growth companies are most likely to fall Part 3</a> <span style="color:#999;font-size:0.85em">(August 18, 2016)</span></li>
<li><a href="https://tonygreenberg.com/blog/so-now-that-we-admit-we-have-a-problem-part-2">So now that we admit we have a problem Part 2</a> <span style="color:#999;font-size:0.85em">(August 16, 2016)</span></li>
<li><a href="https://tonygreenberg.com/blog/it-challenges-buyers-are-ok-are-you-sure-part-1">IT Buyers Say “We are OK.” Are you Sure? Part 1</a> <span style="color:#999;font-size:0.85em">(August 14, 2016)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-cios-guide-to-smarter-vendor-negotiation">The CIO&#39;s guide to smarter vendor negotiation</a> <span style="color:#999;font-size:0.85em">(July 17, 2016)</span></li>
<li><a href="https://tonygreenberg.com/blog/when-valuations-dont-mean-valuable">When Valuations Don’t Mean Valuable</a> <span style="color:#999;font-size:0.85em">(June 16, 2016)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-buyers-sellers-honesty-dance-2">The Buyers &amp; Sellers Honesty Dance 2</a> <span style="color:#999;font-size:0.85em">(December 13, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-buyers-and-sellers-honesty-dance-1">The Buyers and Sellers Honesty Dance 1</a> <span style="color:#999;font-size:0.85em">(December 13, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/cios-maximize-roi-or-find-new-role-joe-weinman">How CIOs Must Maximize ROI ~ Learn This Or Find A New Role – Joe Weinman</a> <span style="color:#999;font-size:0.85em">(February 4, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/10-magic-questions-for-projects-success-kick-ass">10 Magic Questions to Make Your Project Go Right- How to Kick Ass by Kicking Assumptions</a> <span style="color:#999;font-size:0.85em">(September 26, 2014)</span></li>
<li><a href="https://tonygreenberg.com/blog/profiling-the-public-cloud-buyer">Profiling the Public Cloud Buyer</a> <span style="color:#999;font-size:0.85em">(August 25, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/it-services-good-shoe-10-years-later-ramprate">Making IT Fit Like a Good Shoe, Or, 10 years later, and RampRate has a long way to go!</a> <span style="color:#999;font-size:0.85em">(October 25, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/detroits-rut-stagnation-signs-services-markets">IT Services Markets Crumble~Driving Detroit’s Rut</a> <span style="color:#999;font-size:0.85em">(September 13, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/save-entrepreneurs-big-business-buying-startup-2">Save the Entrepreneur: Big Business Keeps Buying Startups, And Killing ‘Em</a> <span style="color:#999;font-size:0.85em">(September 11, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/myth-rfp-everything-half-price">The Myth of the RFP for Everything at Half Price</a> <span style="color:#999;font-size:0.85em">(July 21, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/why-good-service-is-all-about-trust">Why Good Service Is All About Trust</a> <span style="color:#999;font-size:0.85em">(June 14, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/customer-service-key-to-business-success">Customer Service: The Key to Business Success</a> <span style="color:#999;font-size:0.85em">(June 14, 2010)</span></li>
</ul></section>
<section><h2>Conscious Capital</h2><p><em>Impact investing, regenerative business, and capitalism reimagined.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/five-cups">Five Cups: Who Profits When the Government Tells You to Drink More?</a> &mdash; The AHA just raised the ceiling. The industry celebrated. Your bones did not. <span style="color:#999;font-size:0.85em">(July 20, 2026)</span></li>
</ul></section>
<section><h2>Impact & Purpose</h2><p><em>Social change, mission-driven work, and the long game.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/powering-purpose-driven-innovation">POWERING PURPOSE-DRIVEN INNOVATION</a> <span style="color:#999;font-size:0.85em">(February 20, 2023)</span></li>
<li><a href="https://tonygreenberg.com/blog/gratitude-in-action">Gratitude in Action: A Best Follow-Up to a Decade of Change</a> <span style="color:#999;font-size:0.85em">(February 20, 2023)</span></li>
<li><a href="https://tonygreenberg.com/blog/energy-as-impact">Energy as Impact</a> <span style="color:#999;font-size:0.85em">(February 20, 2023)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-tug-of-war-ethical-vs-economic-decisions">The Tug of War – Ethical vs. Economic Decisions</a> <span style="color:#999;font-size:0.85em">(June 6, 2017)</span></li>
<li><a href="https://tonygreenberg.com/blog/would-you-hire-someone-who-led-a-rebellion">Would You Hire Someone Who Led a Rebellion?</a> <span style="color:#999;font-size:0.85em">(March 9, 2017)</span></li>
<li><a href="https://tonygreenberg.com/blog/eco-vegan-realities-seriesethical-economic">Eco Vegan Realities Series- Ethical, Economic Decisions</a> <span style="color:#999;font-size:0.85em">(October 25, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/return-on-investment-going-green-going-green-2">Return on Investment - Are You Going Green?</a> <span style="color:#999;font-size:0.85em">(October 25, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/triple-bottom-line-of-soul-gregory-markel">Triple Bottom Line of Soul? &gt; Trust + Empathy = Business + Friendship</a> <span style="color:#999;font-size:0.85em">(September 11, 2010)</span></li>
</ul></section>
<section><h2>Culture & Communication</h2><p><em>Media, language, society, and the stories we tell.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/the-bottle-that-quietly-ends-an-entire-civilization">The Bottle That Quietly Ends an Entire Civilization</a> &mdash; An open letter to three of the most calibrated palates on the continent, disguised as a single malt review, disguised as the future of luxury. <span style="color:#999;font-size:0.85em">(May 23, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/frqncy-the-bus-that-restores-the-world">FRQNCY: The Bus That Restores the World</a> &mdash; On TimoTree, Response Pattern B, and What Happens When Wellness Infrastructure Stops Being a Conference Topic <span style="color:#999;font-size:0.85em">(May 23, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/is-that-a-lot-clarisse-abelarde">Is That A Lot? On Clarisse Abelarde&#39;s Magnificent Painting, a Cameo I Didn&#39;t Know I Was In, and What the Algorithm Tried to Hide</a> &mdash; A Cameo I Didn&#39;t Know I Was In, and a Cultural Moment the Art World Almost Never Witnesses <span style="color:#999;font-size:0.85em">(May 21, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-clock-keeper-chronicles-part-1">The Clock Keeper Chronicles: Part I — Strategic Invisibility Expires Now</a> &mdash; An intellectual challenge to a 50-year observer of consciousness, systems, and the meta-patterns beneath everything. <span style="color:#999;font-size:0.85em">(February 16, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-decay-of-modern-day-communication">The Decay of Modern Day Communication &amp; Demoralizing Lack of Accountability in Personal Messaging Which is Especially Dangerous Given all the Nearby Baboons</a> <span style="color:#999;font-size:0.85em">(April 11, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-decay-of-professional-phone-calls">The Decay of Professional Phone Calls Circa 2022 Or, Whatever Happened to Telephone Booths?</a> <span style="color:#999;font-size:0.85em">(December 30, 2022)</span></li>
<li><a href="https://tonygreenberg.com/blog/covid-deniers-need-to-take-a-breath">Covid Deniers Need to Take a Breath</a> <span style="color:#999;font-size:0.85em">(October 1, 2021)</span></li>
<li><a href="https://tonygreenberg.com/blog/6-act-of-speech-speaking-as-a-tool">6 Act Of Speech: Speaking As a Tool</a> <span style="color:#999;font-size:0.85em">(November 1, 2020)</span></li>
<li><a href="https://tonygreenberg.com/blog/marc-andreessen-rebuttal-2020">MARC ANDREESSEN REBUTTAL 2020</a> <span style="color:#999;font-size:0.85em">(May 4, 2020)</span></li>
<li><a href="https://tonygreenberg.com/blog/more-ignorance-or-indignance-in-the-wake-of-covid-19">More Ignorance or Indignance in the Wake of Covid-19?</a> <span style="color:#999;font-size:0.85em">(April 20, 2020)</span></li>
<li><a href="https://tonygreenberg.com/blog/only-time-buys-trust">Trust Us? Are You Really My Friend?</a> <span style="color:#999;font-size:0.85em">(October 16, 2017)</span></li>
<li><a href="https://tonygreenberg.com/blog/human-operating-system">Human Operating System</a> <span style="color:#999;font-size:0.85em">(December 13, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-arithmetic-of-relationships">The Arithmetic of Relationships &gt; What’s Our Mutual Net Profit?</a> <span style="color:#999;font-size:0.85em">(January 25, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-ties-that-bind-interpersonal-relationships">The Ties That Bind – Interpersonal Relationships Amended For The New Century</a> <span style="color:#999;font-size:0.85em">(January 25, 2015)</span></li>
<li><a href="https://tonygreenberg.com/blog/grateful-smuggest-sentiment-or-selfish-act">Grateful: Smuggest Sentiment or Second Most Selfish Act?</a> <span style="color:#999;font-size:0.85em">(November 27, 2014)</span></li>
<li><a href="https://tonygreenberg.com/blog/high-hells-demise-of-powerful-femininity">HIGH HELLS – The Demise of Powerful Femininity</a> <span style="color:#999;font-size:0.85em">(July 4, 2014)</span></li>
<li><a href="https://tonygreenberg.com/blog/apologize">I Apologize. Not Me. Nix “I Am Sorry” From Our Lexicon</a> <span style="color:#999;font-size:0.85em">(February 10, 2014)</span></li>
<li><a href="https://tonygreenberg.com/blog/clear-communication">Clear Communication - Companies spend a lot of money on it</a> <span style="color:#999;font-size:0.85em">(September 7, 2013)</span></li>
<li><a href="https://tonygreenberg.com/blog/founders-institute-anti-millennial-funding-guide">Banking on the Wrongs ~ A Guide to the Anti-Millennial Funding Craze</a> <span style="color:#999;font-size:0.85em">(June 26, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/truth-bias-mutually-exclusive">Truth And Bias Are Mutually Exclusive?</a> <span style="color:#999;font-size:0.85em">(August 12, 2010)</span></li>
</ul></section>
<section><h2>Living Well</h2><p><em>Health, longevity, performance, and the examined life.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/india-my-virtual-soul-home">India: My Virtual Soul &amp; Home</a> <span style="color:#999;font-size:0.85em">(July 30, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-molecule-as-mirror-from-substance-to-service">The Molecule as Mirror: From Substance to Service</a> <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-1-three-rooms-one-longing">The Molecule as Mirror, Part 1: Three Rooms, One Longing</a> &mdash; A founder with espresso. A nurse with ketamine. A man with methamphetamine. Three rituals. One quiet longing. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-2-the-old-maps">The Molecule as Mirror, Part 2: The Old Maps</a> &mdash; Freud gave us the pleasure principle. Jung gave us the shadow. Both were brilliant cartographers of a continent they could only see from the shore. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-3-the-new-cartographers">The Molecule as Mirror, Part 3: The New Cartographers</a> &mdash; Maté, Lembke, van der Kolk, Carhart-Harris, Brewer, Berridge — six thinkers completing the map Freud and Jung began. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-4-power-and-relief">The Molecule as Mirror, Part 4: Power and Relief</a> &mdash; Stimulants promise you will finally be enough. Depressants promise the noise will stop. The neuroscience reveals what you are actually seeking. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-5-escape-and-meaning">The Molecule as Mirror, Part 5: Escape and Meaning</a> &mdash; Dissociatives promise liberation from an unbearable self-story. Psychedelics promise significance beyond your résumé. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-6-the-pause-protocol">The Molecule as Mirror, Part 6: The Pause Protocol</a> &mdash; Before the sip, before the swallow, before the line — pause. Name the hunger without flinching. The answer reveals the assignment. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-7-the-pathway-to-dharma">The Molecule as Mirror, Part 7: The Pathway to Dharma</a> &mdash; A 12-week protocol for converting the hunger into service. The molecule cannot give you purpose. It can only reveal how much you want it. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-8-resources-and-costs">The Molecule as Mirror, Part 8: Resources and Costs</a> &mdash; From free starting points to comprehensive programs — a complete guide to every modality, with costs and evidence levels. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-9-a-ceremony-story">The Molecule as Mirror, Part 9: A Ceremony Story</a> &mdash; When words dissolve into knowing. A teaching that lives beyond language — where serendipity meets serendipia. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-10-what-the-pioneers-know">The Molecule as Mirror, Part 10: What the Pioneers Know</a> &mdash; The voices from the frontier — researchers, clinicians, and explorers who are mapping the territory between chemistry and consciousness. <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/molecule-as-mirror-11-the-doorway">The Molecule as Mirror, Part 11: The Doorway</a> &mdash; The question was never how do I stop using. The question is: What am I here to do that makes staying present worthwhile? <span style="color:#999;font-size:0.85em">(February 15, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership">Love as Dharma: A Science-Based Playbook for Magnetic Partnership</a> <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/productivity-apps-that-rocked-my-world-in-2024">Productivity Apps That Rocked My World in 2024: Secrets of a Workflow Wizard</a> <span style="color:#999;font-size:0.85em">(January 24, 2025)</span></li>
<li><a href="https://tonygreenberg.com/blog/forever-chemicals-in-my-blood-pfas-and-microplastics">Forever Chemicals in My Blood: What I Learned Testing for PFAS and Microplastics</a> <span style="color:#999;font-size:0.85em">(December 22, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/an-ode-to-kusaki-where-plants-become-culinary-masterpieces">An Ode to Kusaki: Where Plants Become Culinary Masterpieces - CLOSED Only the good die young</a> <span style="color:#999;font-size:0.85em">(March 22, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/elixir-of-life-device-and-journey">Elixir of Life Device and Journey</a> <span style="color:#999;font-size:0.85em">(November 2, 2023)</span></li>
<li><a href="https://tonygreenberg.com/blog/origen-restaurant">Origen Restaurant – Oaxaca’s Humble Servant of the Terroir</a> <span style="color:#999;font-size:0.85em">(February 17, 2013)</span></li>
<li><a href="https://tonygreenberg.com/blog/summit-series-weekend-community">Burning Man meets Davos? The Summit Series</a> <span style="color:#999;font-size:0.85em">(March 25, 2012)</span></li>
<li><a href="https://tonygreenberg.com/blog/my-other-car-is-a-bentley-not-car-to-leaf-alone">My Other Car is a Bentley…NOT. My First Electric Car</a> <span style="color:#999;font-size:0.85em">(December 9, 2011)</span></li>
<li><a href="https://tonygreenberg.com/blog/transforming-tony-2-books-mountain-life-strife">2 Great Books on a Mountain Saved my Life and Strife</a> <span style="color:#999;font-size:0.85em">(November 27, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/points-pointless-only-wine-expert-matters">Trusting Your Tongue, You’re the Expert in Wine</a> <span style="color:#999;font-size:0.85em">(October 25, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/surfing-wwc-worldwide-wine-club">Surfing the WWC (The Worldwide Wine Club)</a> <span style="color:#999;font-size:0.85em">(August 22, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/trust-tongue-bottle-wine">Trust Your Tongue – The Only Wine and Spirit Critic That Matters Is You</a> <span style="color:#999;font-size:0.85em">(July 3, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/drbronners-to-pressurecookers-simplify-your-life">Simplify your life - Dr. Bronner’s to Pressure Cookers</a> <span style="color:#999;font-size:0.85em">(June 2, 2010)</span></li>
<li><a href="https://tonygreenberg.com/blog/akbar-cuisine-restoration-economics">Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget</a> &mdash; While Los Angeles optimizes itself into a content factory, Akbar Cuisine on Washington Boulevard keeps doing the thing modern dining forgot: restore people. <span style="color:#999;font-size:0.85em">(2026-05-23)</span></li>
</ul></section>
<section><h2>The Crusades</h2><p><em>Accountability, advocacy, and the things worth fighting for.</em></p><ul>
<li><a href="https://tonygreenberg.com/blog/the-1000-hour-hold">The $1,000/Hour Hold: A Manifesto Against the Companies That Steal Your Time and Call It &#39;Service&#39;</a> &mdash; Why Your Bank Owes You Cash for Every Minute You Spend on Hold Fixing Their Mistake <span style="color:#999;font-size:0.85em">(February 20, 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-restaurant-with-no-menu-prices-ai-ethics-manifesto">Zuck: Fix This Now &amp; Lead AI Toward Ethical Billing</a> &mdash; A $1,520 refund demand. Meta&#39;s $10B+ liability rap sheet. 41 documented AI admissions of fault. 16 crisis cases. And a movement that&#39;s about to change everything. <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/california-toll-roads-legalized-scam">California Toll Roads Are a Legalized Scam. Here&#39;s the Proof.</a> &mdash; They spend $21 to collect $2.30. They&#39;ve extracted $28 billion from public roads that were supposed to be free. <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/find-my-ev-paul-scott-wont-let-you-buy-a-gas-car">Find My EV: Paul Scott Won&#39;t Let You Buy a Gas Car</a> <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet">The Butcher&#39;s Daughter, the Carbon Toll, and the Cheese That Ate the Planet</a> <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants">Restaurants Beware of Vegans and Vegans Beware of Lying Restaurants</a> <span style="color:#999;font-size:0.85em">(February 2026)</span></li>
<li><a href="https://tonygreenberg.com/blog/how-to-alienate-a-loyal-vegan">How to Alienate a Loyal Vegan of Decades Desperately Trying to Buy Your Product (Without Feeling Swindled)</a> <span style="color:#999;font-size:0.85em">(November 3, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/luz-lounge-where-loyalty-goes-to-die-groupon">Luz Lounge: Where Loyalty Goes to Die (and Groupon Deals Are Just Lipstick on a Lasered Pig)</a> <span style="color:#999;font-size:0.85em">(June 29, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud">Fitness Fraud Trap: How DMN8 Gym Became a Poster Child for Deceptive Billing Practices</a> <span style="color:#999;font-size:0.85em">(May 15, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/dmn8-the-most-beautiful-crooked-gym-in-the-world">DMN8 Santa Monica: The Most Outrageously Beautiful (and Crooked) Gym in the World?</a> <span style="color:#999;font-size:0.85em">(May 15, 2024)</span></li>
<li><a href="https://tonygreenberg.com/blog/bread-stuck-with-no-customer-service">Lodge Bread Stuck In Suck-Cess with No Customer Service As Good as Their Bread</a> <span style="color:#999;font-size:0.85em">(September 22, 2023)</span></li>
<li><a href="https://tonygreenberg.com/blog/forward-health-is-a-sideway-step-at-best">Forward Health is a sideway step at best</a> <span style="color:#999;font-size:0.85em">(February 2, 2022)</span></li>
<li><a href="https://tonygreenberg.com/blog/hiding-fees-tips-in-the-transparent-age">Hiding Fees &amp; Tips in the Transparent Age is Just Bad Business</a> <span style="color:#999;font-size:0.85em">(September 18, 2021)</span></li>
<li><a href="https://tonygreenberg.com/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine">The Peptide Truth: $65M Fraud Industry vs. Life-Changing Medicine</a> &mdash; An Evidence-Based Investigation into What Works, What Kills, and How to Tell the Difference <span style="color:#999;font-size:0.85em">(2026-02-16)</span></li>
</ul></section>
<nav class="nav-links"><a href="https://tonygreenberg.com/blog">Latest Posts</a><a href="https://tonygreenberg.com/about">About Tony</a><a href="https://tonygreenberg.com/subscribe">Subscribe</a></nav>
</article>`,
  });
}

// ── The Philosophy SSR ──
export function renderThePhilosophyHTML(): string {
  return wrapPage({
    title: "The Diode of Perception — Tony Greenberg",
    description: "The philosophy behind the Psychedelic Readiness Index. You are the instrument. Every medicine, every ceremony begins with one question: what is the current condition of the thing being played?",
    keywords: "psychedelic readiness philosophy, diode of perception, psychedelic instrument, readiness assessment philosophy, Tony Greenberg philosophy",
    canonical: `${BASE_URL}/the-philosophy`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Diode of Perception",
      "description": "The philosophy behind the Psychedelic Readiness Index.",
      "author": {
        "@type": "Person",
        "name": "Tony Greenberg",
        "url": "https://tonygreenberg.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Tony Greenberg",
        "url": "https://tonygreenberg.com"
      },
      "url": "https://tonygreenberg.com/the-philosophy"
    },
    body: `<article>
  <header>
    <h1>The Diode of Perception</h1>
    <p><em>The philosophy behind the Psychedelic Readiness Index</em></p>
  </header>
  <section>
    <p>Think of yourself as an electrical instrument. Not metaphorically — literally. Your nervous system is a conductor. Your history is the wiring. Your current emotional, physical, and psychological state is the resistance in the circuit.</p>
    <p>A diode only allows current to flow in one direction. When the conditions are right, energy moves through cleanly. When they are not, it blocks, distorts, or redirects.</p>
    <p>You are the diode.</p>
    <p>Every psychedelic experience — every ceremony, every clinical session, every solo journey — passes through you. The medicine does not act on a blank slate. It acts on the specific instrument you are right now, in this moment, with this history, carrying this weight.</p>
  </section>
  <section>
    <h2>What This Means</h2>
    <p><strong>You are the instrument.</strong> Every medicine, every ceremony, every facilitator conversation begins with one question: what is the current condition of the thing being played? Readiness is not a checklist. It is a calibration. The Psychedelic Readiness Index exists to help you understand the current state of your instrument before you ask it to carry a current it may not be ready to conduct.</p>
    <p><strong>Readiness is not a checklist.</strong> It is not "have you eaten today" and "do you have a safe space." It is the sum of your nervous system's current capacity to metabolize experience. Some people are ready with minimal preparation. Others need months. The instrument determines the timeline, not the calendar.</p>
    <p><strong>The electrical current is your intention.</strong> What you bring to the experience — your questions, your fears, your hopes, your unfinished business — is the current you are asking the instrument to carry. A weak instrument with a strong current produces distortion. A strong instrument with a clear current produces signal.</p>
    <p><strong>Time slowing is the signal.</strong> When the medicine works, time does not disappear — it expands. You are not removed from your life; you are placed more fully inside it. The diode is conducting cleanly. The signal is getting through.</p>
    <p><strong>Why this matters for facilitation.</strong> A facilitator's job is not to guide the medicine. It is to assess the instrument, prepare the circuit, and hold the space while the current moves. The Psychedelic Readiness Index is a tool for that assessment — a structured way to understand where the resistance is before the session begins.</p>
  </section>
  <nav class="nav-links">
    <a href="${BASE_URL}/psychedelic-readiness-index">Take the Readiness Index</a>
    <a href="${BASE_URL}/facilitator-index">Facilitator Index</a>
    <a href="${BASE_URL}/about">About Tony Greenberg</a>
  </nav>
</article>`,
  });
}


// ── Consciousness Scale SSR ──
export function renderConsciousnessScaleHTML(): string {
  return wrapPage({
    title: "Consciousness Scale — Map Your Level of Awareness",
    description: "The Hawkins Map of Consciousness adapted as a 25-question self-assessment. Calibrate where you are on the scale from Shame (20) to Enlightenment (700). Part of Tony Greenberg's assessment suite.",
    keywords: "consciousness scale, Hawkins map of consciousness, consciousness levels, awareness assessment, Tony Greenberg consciousness",
    canonical: `${BASE_URL}/consciousness-scale`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Consciousness Scale",
      "description": "The Hawkins Map of Consciousness adapted as a 25-question self-assessment.",
      "url": "https://tonygreenberg.com/consciousness-scale",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "applicationCategory": "LifestyleApplication",
    },
    body: `<article>
  <header>
    <h1>Consciousness Scale</h1>
    <p><em>Map Your Level of Awareness — The Hawkins Scale adapted as a self-assessment</em></p>
  </header>
  <section>
    <h2>What This Measures</h2>
    <p>David Hawkins mapped human consciousness across 17 levels — from Shame at 20 to Enlightenment at 700. The scale is logarithmic: the difference between 200 (Courage) and 500 (Love) is not 300 points, it is a fundamentally different relationship with reality.</p>
    <p>This 25-question assessment helps you calibrate where you are right now. Not where you want to be. Not where you were last year. Where you are today, in this moment, with this history.</p>
  </section>
  <section>
    <h2>The Scale</h2>
    <ul>
      <li><strong>20 — Shame:</strong> Humiliation. The lowest viable level.</li>
      <li><strong>100 — Fear:</strong> Anxiety. The driver of most defensive behavior.</li>
      <li><strong>200 — Courage:</strong> Affirmation. The critical threshold — above this, life is constructive.</li>
      <li><strong>350 — Acceptance:</strong> Forgiveness. The beginning of real agency.</li>
      <li><strong>500 — Love:</strong> Reverence. Unconditional, not emotional.</li>
      <li><strong>600 — Peace:</strong> Bliss. Rare. Sustained.</li>
      <li><strong>700 — Enlightenment:</strong> Ineffable.</li>
    </ul>
  </section>
  <nav class="nav-links">
    <a href="${BASE_URL}/assessments">All Assessments</a>
    <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    <a href="${BASE_URL}/dharma-finder">Dharma Finder</a>
    <a href="${BASE_URL}/about">About Tony</a>
  </nav>
</article>`,
  });
}

// ── Flow Circuit SSR ──
export function renderFlowCircuitHTML(): string {
  return wrapPage({
    title: "Flow Circuit — Tony Greenberg",
    description: "Flow Circuit is Tony Greenberg's dedicated flow state application. A full-featured tool for tracking, inducing, and understanding peak performance states.",
    keywords: "flow circuit, flow state, peak performance, Tony Greenberg flow, flow tracking",
    canonical: `${BASE_URL}/flow-circuit`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Flow Circuit — Tony Greenberg",
      "url": "https://tonygreenberg.com/flow-circuit",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "isPartOf": { "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" }
    },
    body: `<article>
  <header>
    <h1>Flow Circuit</h1>
    <p><em>The dedicated flow state application — peak performance tracking and induction</em></p>
  </header>
  <section>
    <p>Flow Circuit is Tony Greenberg's dedicated application for tracking, inducing, and understanding flow states. The full application is available at <a href="https://flow.tonygreenberg.com">flow.tonygreenberg.com</a>.</p>
    <p>Flow states — what Mihaly Csikszentmihalyi called optimal experience — are the moments when challenge and skill are perfectly matched, time disappears, and performance peaks. Flow Circuit provides the tools to understand your personal triggers, track your states, and design conditions for more frequent access.</p>
  </section>
  <nav class="nav-links">
    <a href="https://flow.tonygreenberg.com">Open Flow Circuit App</a>
    <a href="${BASE_URL}/assessments">All Assessments</a>
    <a href="${BASE_URL}/about">About Tony</a>
  </nav>
</article>`,
  });
}

// ── Facilitator Index SSR ──
export function renderFacilitatorIndexHTML(): string {
  return wrapPage({
    title: "The Facilitator Index — Know Who You Go With",
    description: "Invitation-only, anonymous, philosophy-first instrument for psychedelic practitioners and guides. 108 items across twelve bands. The companion to the Psychedelic Readiness Index.",
    keywords: "facilitator index, psychedelic facilitator, psychedelic guide, facilitator assessment, know who you go with, Tony Greenberg facilitator",
    canonical: `${BASE_URL}/facilitator-index`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "The Facilitator Index",
      "description": "Invitation-only instrument for psychedelic practitioners and guides. 108 items across twelve bands.",
      "url": "https://tonygreenberg.com/facilitator-index",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "applicationCategory": "HealthApplication",
    },
    body: `<article>
  <header>
    <h1>The Facilitator Index — Know Who You Go With</h1>
    <p><em>Invitation-only. Anonymous. Philosophy-first. 108 items across twelve bands.</em></p>
  </header>
  <section>
    <h2>What This Is</h2>
    <p>The Facilitator Index is the companion instrument to the Psychedelic Readiness Index. Where the PRI asks "are you ready?", the Facilitator Index asks "is this the right person to go with?"</p>
    <p>108 items across twelve bands: philosophy, ethics, container, preparation, integration, lineage, supervision, consent, touch policy, post-session support, sliding scale, and corroboration. The instrument is anonymous by design — practitioners self-report, seekers verify through corroboration tokens.</p>
  </section>
  <section>
    <h2>The Twelve Bands</h2>
    <ul>
      <li><strong>Philosophy:</strong> What does this facilitator believe about the medicine?</li>
      <li><strong>Ethics:</strong> What are their boundaries, and how are they enforced?</li>
      <li><strong>Container:</strong> How do they hold space — group size, setting, structure?</li>
      <li><strong>Preparation:</strong> What is the arc before the session?</li>
      <li><strong>Integration:</strong> What happens after?</li>
      <li><strong>Lineage:</strong> Where did they train, and with whom?</li>
      <li><strong>Supervision:</strong> Are they supervised, and by whom?</li>
      <li><strong>Consent:</strong> How is consent established and maintained?</li>
      <li><strong>Touch Policy:</strong> What is their explicit policy on physical contact?</li>
      <li><strong>Post-Session:</strong> Morning-after protocol, onward referral.</li>
      <li><strong>Sliding Scale:</strong> Do they work with underserved populations?</li>
      <li><strong>Corroboration:</strong> How is their identity and practice verified?</li>
    </ul>
  </section>
  <nav class="nav-links">
    <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    <a href="${BASE_URL}/the-philosophy">The Philosophy</a>
    <a href="${BASE_URL}/iboga-ibogaine">Iboga &amp; Ibogaine</a>
    <a href="${BASE_URL}/about">About Tony</a>
  </nav>
</article>`,
  });
}

// ── Attention Theft Sub-Pages SSR ──
export function renderAttentionTheftEconomicsHTML(): string {
  return wrapPage({
    title: "The Economics of Attention Theft — Tony Greenberg",
    description: "The financial architecture of attention theft. How platforms monetize distraction, the true cost of algorithmic manipulation, and the economic case for attention sovereignty.",
    keywords: "attention theft economics, attention economy, algorithmic manipulation economics, social media business model, Tony Greenberg",
    canonical: `${BASE_URL}/attention-theft/economics`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Attention Theft: Economics — Tony Greenberg",
      "url": "https://tonygreenberg.com/attention-theft/economics",
      "author": { "@type": "Person", "name": "Tony Greenberg", "url": "https://tonygreenberg.com/about" },
      "publisher": { "@type": "Organization", "name": "Tony Greenberg", "url": "https://tonygreenberg.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tonygreenberg.com/attention-theft/economics" }
    },
    body: `<article>
  <header>
    <h1>The Economics of Attention Theft</h1>
    <p><em>The financial architecture of distraction — and the economic case for sovereignty</em></p>
  </header>
  <section>
    <h2>The Business Model</h2>
    <p>Social media platforms generate revenue by selling your attention to advertisers. The more time you spend on the platform, the more ads you see, the more revenue they generate. The algorithm is not designed to make you happy — it is designed to maximize time-on-platform, which means maximizing engagement, which means maximizing outrage, fear, and compulsion.</p>
    <p>This is not a bug. It is the business model. And it is worth hundreds of billions of dollars.</p>
  </section>
  <section>
    <h2>The True Cost</h2>
    <p>The average American spends 7 hours per day on screens. At a conservative valuation of $50/hour for human attention, that is $350/day, $127,750/year, per person. Multiplied by 300 million American adults, the attention economy extracts approximately $38 trillion in human attention annually — from a single country.</p>
  </section>
  <nav class="nav-links">
    <a href="${BASE_URL}/attention-theft">Attention Theft Manifesto</a>
    <a href="${BASE_URL}/attention-theft/blocker-finder">Blocker Finder</a>
    <a href="${BASE_URL}/attention-theft/legal">Legal Remedies</a>
    <a href="${BASE_URL}/blog">Essays</a>
  </nav>
</article>`,
  });
}
