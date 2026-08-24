/**
 * SSR for Key Content Pages
 * Renders full semantic HTML for all major content pages so that
 * AI agents (Claude, ChatGPT, Perplexity) and search engines
 * can read the actual content without JavaScript execution.
 *
 * PERMANENT RULE: Every page unblocked for indexing MUST have server-rendered HTML.
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

function wrapPage(opts: {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  body: string;
  jsonLd?: object;
  jsonLdExtra?: object[];
}): string {
  const { title, description, keywords, canonical, ogImage, body, jsonLd, jsonLdExtra } = opts;
  const resolvedDescription = description.trim().length >= 70
    ? description.trim()
    : `${description.trim()} Explore Tony Greenberg's work on systems, trust, capital, and what comes next.`;
  const resolvedOgImage = ogImage || DEFAULT_SOCIAL_IMAGE;
  return normalizeMediaUrls(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(title.includes('Tony Greenberg') ? title : `${title} — Tony Greenberg`)}</title>
  <meta name="description" content="${escapeAttr(resolvedDescription)}" />
  ${keywords ? `<meta name="keywords" content="${escapeAttr(keywords)}" />` : ""}
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(resolvedDescription)}" />
  <meta property="og:image" content="${resolvedOgImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(title)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(title)}" />
  <meta name="twitter:description" content="${escapeAttr(resolvedDescription)}" />
  <meta name="twitter:image" content="${resolvedOgImage}" />
  <meta name="twitter:image:alt" content="${escapeAttr(title)}" />
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
  <!-- WebSite Schema for Sitelinks Searchbox -->
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", "name": "Tony Greenberg", "url": "https://tonygreenberg.com", "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://tonygreenberg.com/search?q={search_term_string}" }, "query-input": "required name=search_term_string" } })}</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
  ${jsonLdExtra ? jsonLdExtra.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("\n  ") : ""}
  <style>
    body { font-family: 'Source Sans 3', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; line-height: 1.15; margin-bottom: 1rem; }
    h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; margin-top: 2.5rem; line-height: 1.2; }
    h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; margin-top: 2rem; }
    a { color: #8B6914; }
    blockquote { border-left: 3px solid #D4B96A; padding-left: 1rem; margin-left: 0; font-style: italic; color: #444; }
    .section { margin-bottom: 3rem; }
    .principle { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .principle h3 { margin-top: 0; color: #e53e3e; }
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
    <p><strong>Tony Greenberg</strong> has been wrong about the timing and right about everything else for 25 years. First URL on live TV. First webcast. First digital record label with Beck and Rage Against the Machine. In 2000 he founded <a href="https://ramprate.com">RampRate</a> and spent two decades proving that enterprise technology pricing is mostly theater. <a href="https://impactsoul.is">ImpactSoul</a> is the current argument: that regenerative business is not idealism — it is the better business model. His thesis is three words: Only Time Buys Trust.</p>
    <p><a href="${canonical}">View the full interactive version →</a></p>
  </footer>
</body>
</html>`);
}

// ═══════════════════════════════════════════════════════════════
// HOMEPAGE (/)
// ═══════════════════════════════════════════════════════════════
export function renderHomepageHTML(): string {
  return wrapPage({
    title: "Tony Greenberg — Only Time Buys Trust",
    description: "Twenty-five years of building companies, advising Fortune 500s, investing in psychedelic medicine, tokenizing dinosaur skeletons, and trying to make capitalism less extractive. CEO, Builder, Connector.",
    keywords: "Tony Greenberg, enterprise technology, AI infrastructure, psychedelic medicine, impact investing, RampRate, ImpactSoul, systems thinking, conscious capitalism, peptides, ibogaine, tokenization, Fortune 500 advisor",
    canonical: BASE_URL,
    ogImage: `${BASE_URL}/og-default.jpg`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Tony Greenberg",
      url: BASE_URL,
      jobTitle: "Founder & CEO",
      worksFor: [
        { "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com" },
        { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
      ],
      affiliation: [
        { "@type": "Organization", name: "RampRate A-Team Inc." },
        { "@type": "Organization", name: "ImpactSoul" },
      ],
      description: "Twenty-five years building companies, advising Fortune 500s, investing in psychedelic medicine, and trying to make capitalism less extractive.",
      knowsAbout: ["Systems Thinking", "Impact Investing", "Enterprise Technology Strategy", "AI Ethics", "Trust Economy", "Psychedelic Medicine", "Tokenization", "Payments", "Peptide Therapeutics", "Conscious Capitalism", "Regenerative Capital"],
      image: "https://tonygreenberg.com/og-default.jpg",
      sameAs: [
        "https://www.linkedin.com/in/tonygreenberg",
        "https://x.com/ThinkTony",
        "https://www.instagram.com/ThinkTony",
        "https://ramprate.com",
        "https://impactsoul.is",
        "https://en.wikipedia.org/wiki/Tony_Greenberg"
      ],
      alumniOf: [
        { "@type": "Organization", name: "University of Southern California" }
      ],
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        ],
      },
    ],
    body: `
  <article>
    <header>
      <h1>Tony Greenberg</h1>
      <p style="font-size:1.3rem; color:#4a4a5a; font-style:italic;">Only Time Buys Trust</p>
    </header>

    <section class="section">
      <p style="font-size:1.4rem; line-height:1.6;">I expose broken systems. Then I build what replaces them.</p>
      <p>$10B+ transactions benchmarked. Microsoft, Disney, Goldman Sachs, Nike. 25 years.</p>
    </section>

    <section class="section">
      <h2>The Two Ways to Work with Tony</h2>
      <h3>The Advisor</h3>
      <p>For companies already scaling who need the external layer no internal coach provides. Tony opens rooms. You walk through them. Engagements begin with a scoping conversation.</p>
      <h3>The Operator</h3>
      <p>For services businesses sitting on unproductized expertise. Tony finds the diamond. Together you cut it. Engagements begin with a scoping conversation.</p>
      <p>Both engagements include a handpicked vertical domain expert. Tony does not show up alone.</p>
      <p><strong>2X RETURN GUARANTEE</strong> — Do the work. Show the receipts. Get 2x back.</p>
    </section>

    <section class="section">
      <h2>The Investment Thesis</h2>
      <p>ImpactSoul Asset-Backed Impact Tokens (ABITs) launch Q3 2026. Tokenizing cultural, regenerative, and natural assets that traditional capital markets cannot price.</p>
      <p>Join the waitlist: <a href="https://impactsoul.is">impactsoul.is</a></p>
    </section>

    <section class="section">
      <h2>The Intelligence of Coffee</h2>
      <p>103 coffees scored. 100 chains ranked. 6 identity archetypes. The most opinionated coffee intelligence platform on the internet — built on data, not vibes.</p>
      <p><a href="${BASE_URL}/brewsoul">Enter BrewSoul →</a></p>
    </section>

    <section class="section">
      <h2>Explore</h2>
      <nav class="nav-links">
        <a href="${BASE_URL}/humanos">Human OS 2.0</a>
        <a href="${BASE_URL}/living-declaration">A Living Declaration</a>
        <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
        <a href="${BASE_URL}/brewsoul">BrewSoul Coffee</a>
        <a href="${BASE_URL}/blog">Essays</a>
        <a href="${BASE_URL}/impact-dashboard">Impact Dashboard</a>
      </nav>
    </section>

    <section class="section">
      <blockquote>"Only time buys trust. The gold is in the cracks."</blockquote>
      <p>Contact: tony@impactsoul.is</p>
      <p>tonygreenberg.com · impactsoul.is · ramprate.com</p>
    </section>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// HUMAN OS 2.0 (/humanos)
// ═══════════════════════════════════════════════════════════════
export function renderHumanosHTML(): string {
  return wrapPage({
    title: "Human OS V2.0 — Be The Glitch",
    description: "Reclaim agency in the age of algorithmic control. Are you a Maximizer or a Satisficer? Human OS 2.0 is the counter-protocol for the Conscious Satisficer — someone who defines their own criteria for 'enough' and stops when they get there.",
    canonical: `${BASE_URL}/humanos`,
    ogImage: "${BASE_URL}/og-default.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Human OS V2.0",
      description: "A counter-protocol for reclaiming agency in the age of algorithmic control.",
      author: { "@type": "Person", name: "Tony Greenberg" },
      url: `${BASE_URL}/humanos`,
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Human OS V2.0", item: `${BASE_URL}/humanos` },
        ],
      },
    ],
    body: `
  <article>
    <header>
      <h1>HUMAN OS V2.0</h1>
      <p style="font-size:1.5rem; color:#e53e3e; font-weight:700;">The machine is perfect. BE THE GLITCH.</p>
      <p style="font-size:1.2rem;">Reclaim agency in the age of algorithmic control.</p>
    </header>

    <section class="section">
      <h2>Are You a Maximizer or a Satisficer?</h2>
      <p>We are being optimized to death. Every app, every feed, every notification is designed to make you believe that the next click, the next purchase, the next upgrade will finally make you complete. It won't. It can't. That's the trap.</p>
      <p><strong>Human OS 2.0</strong> is the counter-protocol. A system for the <strong>Conscious Satisficer</strong> — someone who has learned to define their own criteria for "enough" and stop when they get there. Not settling. <em>Choosing.</em></p>
    </section>

    <section class="section">
      <h2>What You'll Discover</h2>
      <ul>
        <li>Your operating system type — Maximizer, Satisficer, or somewhere in between</li>
        <li>The algorithmic loops keeping you stuck in optimization mode</li>
        <li>A personalized protocol for reclaiming your cognitive bandwidth</li>
        <li>Practical tools for shifting from endless seeking to intentional choosing</li>
      </ul>
    </section>

    <section class="section">
      <h2>Take the Diagnostic</h2>
      <p><em>"Are you playing the game, or is the game playing you?"</em></p>
      <p>8 questions. 3 minutes. Discover your path to conscious agency.</p>
      <p><a href="${BASE_URL}/assessment">Begin Diagnostic →</a></p>
    </section>

    <section class="section">
      <h2>Explore the System</h2>
      <nav class="nav-links">
        <a href="${BASE_URL}/humanos/philosophy">The Philosophy</a>
        <a href="${BASE_URL}/humanos/ecosystem">The Ecosystem</a>
        <a href="${BASE_URL}/humanos/resources">Resources</a>
        <a href="${BASE_URL}/humanos/path-to-here">Path to Here</a>
        <a href="${BASE_URL}/humanos/connect">Connect</a>
      </nav>
      <p><strong>The Philosophy:</strong> Boiling the Human, the Maximizer Trap, and the Conscious Satisficer framework.</p>
      <p><strong>The Ecosystem:</strong> Mentors, advisors, partners, and the companies that shaped this thinking.</p>
      <p><strong>Resources:</strong> Transformation playbooks, daily practices, and the essential reading list.</p>
      <p><strong>Path to Here:</strong> From the 2010 H+ Summit to today — the architect's journey.</p>
    </section>

    <section class="section">
      <h2>The Core Framework: Maximizer vs Satisficer</h2>
      <p>The psychologist Herbert Simon coined the term "satisficing" in 1956 — a portmanteau of "satisfy" and "suffice." His insight was that humans do not optimize; they satisfice. They search until they find something good enough, then stop. The modern attention economy has weaponized the Maximizer tendency: the belief that the optimal choice exists, that you have not found it yet, and that the next scroll will deliver it.</p>
      <p>A <strong>Maximizer</strong> is someone who must find the best possible option before making a decision. They research exhaustively, experience decision paralysis, and feel regret even after good outcomes because they wonder if something better existed. The optimization machine loves Maximizers. It feeds them infinite options and infinite regret.</p>
      <p>A <strong>Conscious Satisficer</strong> is someone who has defined their own criteria for "enough" in advance, searches until they find something that meets those criteria, and stops. Not because they are lazy. Because they understand that the search itself has a cost and that cost is the product the machine is selling.</p>
    </section>

    <section class="section">
      <h2>The Seven Principles of Human OS 2.0</h2>
      <ol>
        <li><strong>Define enough before you start searching.</strong> The machine cannot exploit a person who already knows what they want.</li>
        <li><strong>Attention is the only non-renewable resource.</strong> Money can be made again. Time cannot. Attention is time made granular.</li>
        <li><strong>The algorithm is not neutral.</strong> Every recommendation system has an objective function. That function is not your flourishing.</li>
        <li><strong>Friction is a feature, not a bug.</strong> The things worth doing are hard to start. The things the machine wants you to do are frictionless by design.</li>
        <li><strong>Boredom is data.</strong> The discomfort of an unoccupied mind is the signal that you are present. The machine wants you to interpret that signal as a problem to be solved with content.</li>
        <li><strong>Your operating system is not fixed.</strong> Maximizer and Satisficer are not personality types. They are habits. Habits can be changed.</li>
        <li><strong>Only time buys trust.</strong> In relationships, in work, in your own inner life — depth requires duration. The machine sells the simulation of depth at the speed of a swipe.</li>
      </ol>
    </section>

    <section class="section">
      <h2>Built on A Living Declaration</h2>
      <p>Human OS 2.0 is built on <a href="${BASE_URL}/living-declaration">A Living Declaration</a> — Tony Greenberg's foundational document on agency, systems, and the architecture of a life worth living. The Declaration is the philosophy. Human OS 2.0 is the operating system. The diagnostic is the first step.</p>
      <p>Tony Greenberg has been building at the intersection of technology, capital, and consciousness for 25 years. He founded RampRate in 2000 and spent two decades proving that enterprise technology pricing is mostly theater. ImpactSoul is the current argument: that regenerative business is not idealism, it is the better business model. His thesis is three words: <strong>Only Time Buys Trust.</strong></p>
      <p>Human OS 2.0 is the personal application of that thesis. If you cannot trust your own attention, nothing else you build will hold.</p>
      <p><a href="${BASE_URL}/living-declaration">Read A Living Declaration</a> | <a href="${BASE_URL}/about">About Tony Greenberg</a> | <a href="${BASE_URL}/assessment">Take the Diagnostic</a></p>
    </section>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// HUMAN OS PHILOSOPHY (/humanos/philosophy)
// ═══════════════════════════════════════════════════════════════
export function renderHumanosPhilosophyHTML(): string {
  return wrapPage({
    title: "Human OS 2.0 — The Philosophy",
    description: "Boiling the Human, the Maximizer Trap, and the Conscious Satisficer framework. In a world designed to maximize everything, the revolutionary act is to choose enough.",
    canonical: `${BASE_URL}/humanos/philosophy`,
    body: `
  <article>
    <header>
      <h1>The Philosophy</h1>
      <p style="font-size:1.3rem; font-style:italic;">"In a world designed to maximize everything, the revolutionary act is to choose enough."</p>
    </header>

    <section class="section">
      <h2>Boiling the Human</h2>
      <p>We are like frogs in a pot of water that is slowly heating up. The changes in our environment — the speed of information, the demand for attention, the erosion of privacy — have happened so gradually that we haven't noticed we are boiling alive.</p>
      <p>This presentation, delivered at the H+ Summit, was the first warning shot. It outlines exactly how technology is outpacing our biological evolution and what we must do to survive it.</p>
      <blockquote>"You are a transhuman. The very definition of the human condition is the necessity to adapt to change. Through technology, we now live in an intrinsically transhumanist era." — David Orban, Advisor to Singularity University, Former Chairman of Humanity+</blockquote>
      <p>David's philosophy — that we are all transhumans, defined by our ability to adapt and overcome limitations through technology — was the catalyst for Human OS 2.0. At the 2010 H+ Summit, his mentorship helped crystallize the core insight: technology must fit humans like a glove, not a cast.</p>
    </section>

    <section class="section">
      <h2>The Maximizer Trap</h2>
      <p>The Maximizer is driven by the relentless pursuit of "the best." Every decision is an optimization problem. Every outcome must be perfect. This operating system leads to:</p>
      <ul>
        <li>Chronic Dissatisfaction</li>
        <li>Decision Paralysis</li>
        <li>Perpetual Comparison</li>
        <li>Burnout</li>
      </ul>
      <p>The Maximizer is a slave to the algorithm, constantly seeking an external validation of perfection that does not exist.</p>
    </section>

    <section class="section">
      <h2>The Conscious Satisficer</h2>
      <p>The Satisficer is not about "settling." It is about strategic selection. It is the ability to define your own criteria for success and stop when they are met. This operating system unlocks:</p>
      <ul>
        <li>Contentment</li>
        <li>Decisiveness</li>
        <li>Self-Referencing</li>
        <li>Creative Energy</li>
      </ul>
      <p>The Conscious Satisficer reclaims their cognitive bandwidth for what truly matters: creation, connection, and impact.</p>
      <p>Human OS 2.0 is not just a mindset. It is a protocol for living. It requires a hard reset of your values, your habits, and your definitions of success.</p>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/living-declaration">Read the Living Declaration →</a>
      <a href="${BASE_URL}/humanos">Back to Human OS 2.0</a>
    </nav>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// A LIVING DECLARATION (/living-declaration)
// ═══════════════════════════════════════════════════════════════
export function renderLivingDeclarationHTML(): string {
  return wrapPage({
    title: "A Living Declaration — Only Time Buys Trust",
    description: "We're going to measure how fast people can become their best self — and connect them to the biochemistry, the community, and the accountability infrastructure that makes it possible. The most abundant life. The lowest carbon footprint. A better humanity for the future.",
    canonical: `${BASE_URL}/living-declaration`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "A Living Declaration — Only Time Buys Trust",
      author: { "@type": "Person", name: "Tony Greenberg" },
      url: `${BASE_URL}/living-declaration`,
      description: "Six principles for measuring the speed of human becoming.",
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "A Living Declaration", item: `${BASE_URL}/living-declaration` },
        ],
      },
    ],
    body: `
  <article>
    <header>
      <h1>A Living Declaration</h1>
      <p style="font-size:1.1rem; color:#666;">By Tony Greenberg</p>
    </header>

    <section class="section">
      <p style="font-size:1.2rem;">We're going to measure how fast people can become their best self — and connect them to the biochemistry, the community, and the accountability infrastructure that makes it possible. The most abundant life. The lowest carbon footprint. A better humanity for the future.</p>
      <p>For twenty-five years I've been building companies, exposing extractive systems, investing in consciousness-expanding medicine, tokenizing dinosaur skeletons for ocean cleanup, and writing about what happens when you refuse to accept the world as it's handed to you. Ninety-one essays. Twelve sites. A million data points. Six psychedelic medicine investments. A B Corp that tokenizes impact. A payments corridor measured in billions.</p>
      <p>All of it — every single thread — converges on one question:</p>
      <p style="font-size:1.3rem; font-weight:700;">How fast can a human being become the best version of themselves, and what infrastructure do they need to get there?</p>
      <p>This Living Declaration is the answer. Not a final answer — a living one. It will change as you change it. Because the most important thing I've learned in twenty-five years of building is this: the best architecture is the one your community finishes for you.</p>
    </section>

    <section class="section">
      <h2>Boiling the Human Revisited</h2>
      <p>At a Humanity+ conference at Harvard in 2010, I shared the stage to celebrate human potential and ingenuity. Yet even in that heady age of tech optimism — on the eve of Arab Spring when social media was undermining rather than enabling authoritarianism — I wasn't there to blindly cheerlead progress.</p>
      <p>Instead, I warned about the drive to exploit, to add fine print, to enshittify every product for an additional dollar — and how the process could be so slow and imperceptible that we would fail to notice it like a frog slowly being boiled alive. Few listened. The congregation was drunk on possibility.</p>
      <p>Two years later, in 2012, I wrote about the Human Operating System — arguing that "artificial intelligence is no match for natural stupidity" and that we needed technology built to fit humans "like a glove instead of a cast." The thesis has only become more urgent.</p>
      <p>Today we both can claim the mantle of prophecy. In the last five years, we've made as big a leap as any since splitting the atom. Yet the value of this change to humanity is just as ambiguous as the nuclear age. With superhuman intelligence at our fingertips, we haven't become supermen. We've become shallower, more anxious, and less capable.</p>
    </section>

    <section class="section">
      <h2>An Algorithm for Human Scale Agency</h2>
      <p>I did not write this to add to the chorus of doom. Fear is not just a poor foundation for flourishing — it's a surrender to the very forces you think you're fighting. The attention economy profits from your anxiety. Don't let them.</p>
      <p>I offer a different path: <strong>agency at human scale</strong>. In a world of systems designed to break you down, you can stand tall and reclaim your self-determination.</p>
      <blockquote>"The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn." — Alvin Toffler</blockquote>
    </section>

    <section class="section">
      <h2>The Original Six Principles</h2>
      <p><em>Not Commandments. Invitations.</em></p>

      <div class="principle">
        <h3>I. Measure the Becoming</h3>
        <p>We believe the most important metric in human history has never been tracked: the speed at which a person becomes their best self. Not productivity. Not output. Not GDP. The velocity of becoming. Every system we build, every index we create, every community we convene exists to compress the distance between who you are and who you're capable of being — and to measure that compression with the same rigor Wall Street applies to quarterly earnings.</p>
      </div>

      <div class="principle">
        <h3>II. Optimize the Vessel</h3>
        <p>Your biochemistry is not a footnote — it's the operating system. Peptides, exosomes, regenerative protocols, psychedelic-assisted therapy, biometric feedback loops with Oura and continuous glucose monitors — these aren't biohacking vanity projects. They're the infrastructure of human potential. You cannot think clearly in a body running on cortisol and seed oils. You cannot love deeply when your nervous system is stuck in fight-or-flight. We connect people to the biochemistry optimization that allows them to lead their most sacred, most fulfilling, most abundant life. Not as luxury. As prerequisite.</p>
      </div>

      <div class="principle">
        <h3>III. Shrink the Footprint, Expand the Soul</h3>
        <p>Here is the heresy that makes economists nervous: the goal is not more GDP. The goal is less. Less extraction. Less waste. Less of the frantic production-consumption cycle that's cooking the planet and hollowing out the species. We're building toward a world where the lowest carbon footprint enables the highest quality of life — where abundance is measured in health, connection, creative output, and time sovereignty, not in units shipped. Every token we mint, every protocol we design, every community we build is oriented toward this inversion: reduce the economic footprint, expand the human one.</p>
      </div>

      <div class="principle">
        <h3>IV. Connect the Dots, Build the Tribe</h3>
        <p>The loneliest generation in human history is also the most connected — digitally. The paradox is the diagnosis. We're not building another social network. We're building the connective tissue for people who've already done the inner work and are ready to find their tribe, their partner, their collaborator, their co-conspirator in building what comes next. Finding your people isn't a feature. It's the foundation. Every great company, every great movement, every great love story started with two people in a room who shouldn't have met but did.</p>
      </div>

      <div class="principle">
        <h3>V. Sacred Accountability</h3>
        <p>We measure everything. Not because measurement is sacred — but because what you measure, you can improve, and what you improve, you can share. The Flow Circuit tracks team performance. The Regenerative Protocol tracks biological optimization. The QPR Index scores intellectual rigor. Sacred Waters maps the geometry of healing. These aren't vanity dashboards. They're mirrors. And mirrors don't lie — even when the reflection is uncomfortable. We hold ourselves accountable first, then invite others to do the same.</p>
      </div>

      <div class="principle">
        <h3>VI. The Invitation Is the Architecture</h3>
        <p>This Living Declaration is not a monologue. It's an open door. We're asking you: What do you want to measure? What indices don't exist yet that should? What community would you build if you had the infrastructure? What does your most abundant life look like — and what's standing between you and it? The answers to these questions become the blueprint. Your input becomes the architecture. This isn't a platform built for you. It's a platform built with you.</p>
      </div>
    </section>

    <section class="section">
      <h2>The Infrastructure Is Live</h2>
      <p>Every principle in this Living Declaration maps to something that already exists — a site, a protocol, an investment, an essay, a community. The infrastructure isn't hypothetical. It's live.</p>
      <nav class="nav-links">
        <a href="${BASE_URL}/humanos">Human OS 2.0</a>
        <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
        <a href="${BASE_URL}/brewsoul">BrewSoul Coffee Intelligence</a>
        <a href="${BASE_URL}/impact-dashboard">Impact Dashboard</a>
        <a href="${BASE_URL}/blog">Essays (90+)</a>
      </nav>
    </section>

    <section class="section">
      <div class="stat"><strong>25</strong> Years Building</div>
      <div class="stat"><strong>90</strong> Essays Written</div>
      <div class="stat"><strong>12</strong> Sites Launched</div>
      <div class="stat"><strong>1M+</strong> Data Points</div>
      <div class="stat"><strong>6</strong> Active Investments</div>
      <div class="stat"><strong>$10B+</strong> Benchmarked</div>
    </section>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// ABOUT (/about)
// ═══════════════════════════════════════════════════════════════
export function renderAboutHTML(): string {
  return wrapPage({
    title: "About Tony Greenberg — Builder, Connector, Contrarian",
    description: "Tony Greenberg is a business person and impact futurist who has spent 25 years building the trust layer between buyers and sellers, technology, capital, and culture.",
    keywords: "Tony Greenberg biography, RampRate CEO, ImpactSoul founder, enterprise technology advisor, psychedelic medicine investor, impact investor, Fortune 500 advisor, Microsoft Disney Goldman Sachs Nike, conscious capitalism",
    canonical: `${BASE_URL}/about`,
    ogImage: "https://tonygreenberg.com/api/img/tony-headshot_2d63de23.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Tony Greenberg",
      url: BASE_URL,
      jobTitle: "Founder & CEO",
      worksFor: [
        { "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com" },
        { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
      ],
      affiliation: [
        { "@type": "Organization", name: "RampRate A-Team Inc." },
        { "@type": "Organization", name: "ImpactSoul" },
      ],
      description: "Business person and impact futurist. Twenty-five years building the objective trust layer between buyers and sellers, technology, capital, and culture.",
      knowsAbout: ["Systems Thinking", "Impact Investing", "Enterprise Technology Strategy", "AI Ethics", "Trust Economy", "Psychedelic Medicine", "Tokenization", "Payments", "Peptide Therapeutics", "Conscious Capitalism", "Regenerative Capital"],
      image: "https://tonygreenberg.com/api/img/tony-headshot_2d63de23.jpg",
      sameAs: [
        "https://www.linkedin.com/in/tonygreenberg",
        "https://x.com/ThinkTony",
        "https://www.instagram.com/ThinkTony",
        "https://ramprate.com",
        "https://impactsoul.is",
        "https://en.wikipedia.org/wiki/Tony_Greenberg",
      ],
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "About Tony Greenberg", item: `${BASE_URL}/about` },
        ],
      },
    ],
    body: `
  <article>
    <header>
      <h1>Tony Greenberg</h1>
      <p style="font-size:1.2rem; color:#4a4a5a;">CEO of RampRate &middot; Co-founder of ImpactSoul &middot; Builder, Connector, Contrarian</p>
    </header>

    <section class="section">
      <h2>The Short Version</h2>
      <p>Twenty-five years at the intersection of enterprise technology, capital, culture, and frontier science. I expose broken systems. Then I build what replaces them.</p>
      <p>I have helped manage the objective trust layer between buyers and sellers across more than $10 billion in transactions. Microsoft. Disney. Goldman Sachs. Nike. The work is not about procurement advice. It is about seeing how a relationship is working, naming where it fails, and building a better way through.</p>
    </section>

    <section class="section">
      <h2>What I Build</h2>
      <h3>RampRate</h3>
      <p>The world's most rigorous enterprise technology benchmarking firm. The SPY Index holds 1M+ data points. When everyone is doing AI and data centers, you need someone who's been in the room long enough to tell you which rooms are worth entering.</p>
      <p><a href="https://ramprate.com">ramprate.com</a></p>

      <h3>ImpactSoul</h3>
      <p>A Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health).</p>
      <p><a href="https://impactsoul.is">impactsoul.is</a></p>
    </section>

    <section class="section">
      <h2>What I Am Thinking About Now</h2>
      <p><strong>AI is a memory machine with an energy problem.</strong> The people solving the energy problem will quietly decide what the future gets to remember.</p>
      <p>I am following the collision of AI buildout, nuclear manufacturing, and the trust layer underneath every serious system.</p>
      <p><a href="${BASE_URL}/blog/energy-is-money-money-is-memory">Read: Energy Is Money. Money Is Memory.</a></p>
    </section>

    <section class="section">
      <h2>Active Investments</h2>
      <ul>
        <li><strong>MycoMedica Life Sciences</strong> — a small investment in fungal science and nature-based medicine</li>
        <li><strong>AtaiBeckley</strong> — FDA Breakthrough Therapy designation</li>
        <li><strong>Wake Network</strong> — psychedelic therapy access</li>
        <li><strong>Radicle Science</strong> — rigorous supplement research</li>
        <li><strong>Tripp</strong> — VR-assisted psychedelic therapy</li>
      </ul>
    </section>

    <section class="section">
      <h2>The Writing</h2>
      <p>121 essays on enterprise technology, consciousness, health systems, impact, culture, and systems thinking. All at <a href="${BASE_URL}/blog">${BASE_URL}/blog</a></p>
    </section>

    <section class="section">
      <h2>Contact</h2>
      <p>tony@impactsoul.is</p>
      <p><a href="${BASE_URL}/connect">${BASE_URL}/connect</a></p>
      <p><a href="${BASE_URL}/speaking">Speaking and conversations</a></p>
    </section>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// BREWSOUL (/brewsoul)
// ═══════════════════════════════════════════════════════════════
// BrewSoul SSR is now handled by the dedicated ssr-brewsoul.ts module
// which includes the full catalog table (107 coffees + 100 chains).
import { renderBrewSoulHTML } from "./ssr-brewsoul";
import fs from "fs";
import path from "path";

// ═══════════════════════════════════════════════════════════════
// BLOG INDEX (/blog and /essays)
// Full article directory for AI crawlers and search engines.
// Lists all articles organized by topic cluster with summaries.
// ═══════════════════════════════════════════════════════════════
interface BlogIndexPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  reads: number;
}

let _blogIndexCache: BlogIndexPost[] | null = null;
let _blogIndexCacheTime = 0;
const BLOG_INDEX_CACHE_TTL = 60_000;

function loadBlogIndex(): BlogIndexPost[] {
  const now = Date.now();
  if (_blogIndexCache && now - _blogIndexCacheTime < BLOG_INDEX_CACHE_TTL) return _blogIndexCache;
  try {
    const blogDataPath = path.resolve(import.meta.dirname, "../client/src/data/blogData.json");
    const raw = JSON.parse(fs.readFileSync(blogDataPath, "utf-8")) as Array<Record<string, unknown>>;
    _blogIndexCache = raw.map(p => ({
      slug: (p.slug as string) || "",
      title: (p.title as string) || "",
      date: (p.date as string) || "",
      category: (p.category as string) || "Essays",
      summary: ((p.summary as string) || "").slice(0, 200),
      reads: (p.reads as number) || 0,
    })).filter(p => p.slug);
    _blogIndexCacheTime = now;
    return _blogIndexCache;
  } catch (e) {
    console.error("[SSR-BlogIndex] Failed to load blogData.json:", e);
    return [];
  }
}

export function renderBlogIndexHTML(): string {
  const posts = loadBlogIndex();

  // Group by category
  const byCategory: Record<string, BlogIndexPost[]> = {};
  for (const post of posts) {
    const cat = post.category || "Essays";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(post);
  }

  // Category display order
  const categoryOrder = [
    "Psychedelic Medicine",
    "Systems & Innovation",
    "Business & Capital",
    "The Crusades",
    "Impact & Purpose",
    "Culture & Communication",
    "Living Well",
  ];

  // Sort posts within each category by reads desc
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => b.reads - a.reads);
  }

  function buildPostItems(catPosts: BlogIndexPost[]): string {
    return catPosts.map(p => `
      <article style="margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid #e8e0d0;">
        <h3 style="margin:0 0 0.3rem; font-size:1.1rem;"><a href="${BASE_URL}/blog/${escapeAttr(p.slug)}">${escapeAttr(p.title)}</a></h3>
        <p style="margin:0 0 0.4rem; font-size:0.85rem; color:#888;">${escapeAttr(p.date)}${p.reads > 0 ? ` &middot; ${p.reads.toLocaleString()} reads` : ""}</p>
        ${p.summary ? `<p style="margin:0; font-size:0.95rem; color:#444; line-height:1.5;">${escapeAttr(p.summary)}${p.summary.length >= 200 ? "&hellip;" : ""}</p>` : ""}
      </article>`).join("");
  }

  function buildCategorySection(cat: string): string {
    const catPosts = byCategory[cat];
    if (!catPosts?.length) return "";
    const catId = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `
    <section id="${catId}" style="margin-bottom:3rem;">
      <h2 style="font-size:1.4rem; border-bottom:2px solid #8B5A2B; padding-bottom:0.5rem; margin-bottom:1.5rem; color:#2C1810;">${escapeAttr(cat)} <span style="font-size:0.9rem; color:#888; font-weight:400;">(${catPosts.length})</span></h2>
      ${buildPostItems(catPosts)}
    </section>`;
  }

  const categorySections = categoryOrder.map(buildCategorySection).join("");
  const remainingCats = Object.keys(byCategory).filter(c => !categoryOrder.includes(c));
  const remainingSections = remainingCats.map(buildCategorySection).join("");

  const totalPosts = posts.length;
  const navLinks = categoryOrder
    .filter(c => byCategory[c]?.length > 0)
    .map(c => {
      const catId = c.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<a href="#${catId}" style="background:#F2E8D5; padding:0.3rem 0.8rem; border-radius:4px; text-decoration:none; color:#2C1810; font-size:0.9rem; border:1px solid #D4B96A;">${escapeAttr(c)} (${byCategory[c].length})</a>`;
    }).join("");

  return wrapPage({
    title: "Essays \u2014 Tony Greenberg",
    description: `${totalPosts} essays on enterprise technology, AI infrastructure, psychedelic medicine, impact investing, conscious capitalism, culture, and systems thinking. By Tony Greenberg.`,
    keywords: "Tony Greenberg essays, enterprise technology articles, psychedelic medicine writing, impact investing essays, AI infrastructure, conscious capitalism, systems thinking, ibogaine, peptides, tokenization",
    canonical: `${BASE_URL}/blog`,
    ogImage: "https://tonygreenberg.com/og-default.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Essays \u2014 Tony Greenberg",
      description: `${totalPosts} essays on enterprise technology, psychedelic medicine, impact investing, and systems thinking.`,
      url: `${BASE_URL}/blog`,
      author: { "@type": "Person", name: "Tony Greenberg", url: BASE_URL },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: totalPosts,
        itemListElement: posts.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}/blog/${p.slug}`,
          name: p.title,
        })),
      },
    },
    jsonLdExtra: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Essays", item: `${BASE_URL}/blog` },
        ],
      },
    ],
    body: `
  <article>
    <header>
      <h1>Essays by Tony Greenberg</h1>
      <p style="font-size:1.1rem; color:#4a4a5a; margin-bottom:2rem;">${totalPosts} essays on enterprise technology, AI infrastructure, psychedelic medicine, impact investing, conscious capitalism, and the systems that shape how we live and work.</p>
      <nav style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:2rem;">
        ${navLinks}
      </nav>
    </header>
    ${categorySections}
    ${remainingSections}
    <footer class="footer">
      <p><strong>Tony Greenberg</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. Twenty-five years building, benchmarking, and negotiating enterprise technology infrastructure.</p>
      <p><a href="${BASE_URL}">&larr; Back to tonygreenberg.com</a></p>
    </footer>
  </article>`,
  });
}

// ═══════════════════════════════════════════════════════════════
// SEVEN DOORS / WALK-THROUGH
// ═══════════════════════════════════════════════════════════════
function renderSevenDoorsHTML(): string {
  return wrapPage({
    title: "The Seven Doors — Tony Greenberg's Seven Domains",
    description: "Walk through Tony Greenberg's seven domains: Enterprise Technology & AI, Social Impact & Tokenization, Psychedelic Medicine, Payments, Health & Longevity, Consumer Advocacy, and Web3.",
    keywords: "Tony Greenberg seven doors, enterprise technology, psychedelic medicine, social impact tokenization, ImpactSoul, RampRate, payments infrastructure",
    canonical: `${BASE_URL}/seven-doors`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "The Seven Doors",
      "description": "Tony Greenberg's seven interconnected domains of expertise and investment.",
      "url": `${BASE_URL}/seven-doors`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>The Seven Doors</h1>
      <p><em>Every person who walks through my door — physical or digital — is walking into one of seven worlds. The enterprise technology work funds the impact work. The psychedelic medicine investments inform the health protocols. The payments infrastructure enables the tokenization thesis. Seven doors sounds like chaos. It's not. It's a system — each door reinforces the others.</em></p>
    </header>

    <section>
      <h2>Door 01 — Enterprise Technology &amp; AI</h2>
      <p>Twenty-five years. $24B+ benchmarked. Microsoft, Disney, Goldman Sachs, Nike. <a href="https://ramprate.com">RampRate</a>'s SPY Index holds 1M+ data points on enterprise technology pricing. When everyone and their golden retriever is doing AI and data centers, you need someone who's been in the room long enough to tell you which rooms are worth entering.</p>
      <p><strong>Ask about:</strong> Strategic sourcing, vendor negotiation, data center infrastructure, AI compute procurement, cloud economics.</p>
    </section>

    <section>
      <h2>Door 02 — Social Impact &amp; Tokenization</h2>
      <p><a href="https://impactsoul.is">ImpactSoul</a> — a Certified B Corp tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health).</p>
      <p><strong>Ask about:</strong> Asset-backed impact tokens, community-driven philanthropy, B Corp certification, regenerative capital.</p>
    </section>

    <section>
      <h2>Door 03 — Psychedelic Medicine</h2>
      <p>Six active investments: MycoMedica Life Sciences (co-founded with Paul Stamets), AtaiBeckley (FDA Breakthrough Therapy), Bexson Biomedical, Wake Network, Radicle Science, and Tripp. Consciousness expansion isn't optional anymore — it's infrastructure for what comes next.</p>
      <p><strong>Ask about:</strong> Psychedelic therapeutics, FDA pathways, consciousness research, ibogaine, psilocybin, ketamine protocols.</p>
    </section>

    <section>
      <h2>Door 04 — Payments &amp; The Corridor</h2>
      <p>Four payment processing companies through 'the corridor' — a payments infrastructure play at the intersection of traditional card networks and emerging digital rails. The future of money movement is not a single protocol. It's a corridor.</p>
      <p><strong>Ask about:</strong> Payment infrastructure, digital rails, cross-border transactions, fintech investment.</p>
    </section>

    <section>
      <h2>Door 05 — Health &amp; Longevity</h2>
      <p>Peptide research, kava as threshold medicine, the <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>, and a personal health protocol built around the question: what does it mean to be well at the frontier of consciousness?</p>
      <p><strong>Ask about:</strong> Peptide therapy, longevity protocols, kava science, psychedelic readiness assessment.</p>
    </section>

    <section>
      <h2>Door 06 — Consumer Advocacy</h2>
      <p>PeptideWatch, the Hall of Shame, supply chain transparency, and the Extraordinary Value Index. The market is full of theater. Consumer advocacy is the antidote — rigorous, documented, and unapologetic.</p>
      <p><strong>Ask about:</strong> Peptide market transparency, vendor accountability, consumer protection, market research.</p>
    </section>

    <section>
      <h2>Door 07 — Web3 &amp; Digital Infrastructure</h2>
      <p>BrewSoul, the coffee intelligence platform. Digital identity. The intersection of physical and digital assets. Web3 not as speculation but as infrastructure for trust.</p>
      <p><strong>Ask about:</strong> Web3 infrastructure, digital identity, tokenization, BrewSoul coffee intelligence.</p>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/assessments">Assessments</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="https://impactsoul.is">ImpactSoul</a>
      <a href="https://ramprate.com">RampRate</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// START HERE
// ═══════════════════════════════════════════════════════════════
function renderStartHereHTML(): string {
  return wrapPage({
    title: "Start Here | Tony Greenberg",
    description: "Five essays that define the worldview. Start with the thinking that started everything. The entry point to Tony Greenberg's work on regenerative capital, psychedelic medicine, and enterprise technology.",
    keywords: "Tony Greenberg start here, worldview, regenerative capital, psychedelic medicine, enterprise technology, essays",
    canonical: `${BASE_URL}/start-here`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Start Here",
      "description": "Five essays that define Tony Greenberg's worldview.",
      "url": `${BASE_URL}/start-here`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Start Here</h1>
      <p><em>Five essays. Five maps. The thinking that started everything.</em></p>
    </header>

    <section>
      <p>If you're new here, start with these five essays. They define the worldview, establish the thesis, and give you the context to understand everything else on this site.</p>
      <p>The thesis is three words: <strong>Only Time Buys Trust.</strong></p>
    </section>

    <section>
      <h2>Essay 1 — The Extractive Economy</h2>
      <p>Why the current model of value extraction is ending, and what regenerative capital looks like as the replacement. The foundational argument for everything ImpactSoul is building.</p>
      <p><a href="${BASE_URL}/blog">Read in the Essays section &rarr;</a></p>
    </section>

    <section>
      <h2>Essay 2 — The Psychedelic Readiness Index</h2>
      <p>Consciousness expansion is not optional anymore. It's infrastructure. This essay explains why, and introduces the five-domain readiness framework.</p>
      <p><a href="${BASE_URL}/psychedelic-readiness-index">Take the assessment &rarr;</a></p>
    </section>

    <section>
      <h2>Essay 3 — Only Time Buys Trust</h2>
      <p>The thesis. Twenty-five years of being early, being right, and watching the market catch up. Why trust is the only durable competitive advantage.</p>
    </section>

    <section>
      <h2>Essay 4 — The Seven Doors</h2>
      <p>How seven seemingly unrelated domains — enterprise technology, psychedelic medicine, payments, social impact, health, consumer advocacy, and Web3 — form a single coherent system.</p>
      <p><a href="${BASE_URL}/seven-doors">Walk through the doors &rarr;</a></p>
    </section>

    <section>
      <h2>Essay 5 — The Living Declaration</h2>
      <p>Not a manifesto. A declaration of what I actually believe, updated as I learn. The most honest thing on this site.</p>
      <p><a href="${BASE_URL}/living-declaration">Read the declaration &rarr;</a></p>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/blog">All Essays</a>
      <a href="${BASE_URL}/assessments">Assessments</a>
      <a href="${BASE_URL}/about">About Tony</a>
      <a href="${BASE_URL}/seven-doors">The Seven Doors</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// ASSESSMENTS HUB
// ═══════════════════════════════════════════════════════════════
function renderAssessmentsHTML(): string {
  return wrapPage({
    title: "Self-Assessment Tools — Tony Greenberg",
    description: "23 research-backed assessments to map your identity, purpose, and spirit. Find Your Me, SoulScore, Psychedelic Readiness Index, Dharma Finder, and more. Three maps. One direction.",
    keywords: "self assessment tools, psychedelic readiness, soulscore, dharma finder, find your me, identity assessment, purpose assessment, Tony Greenberg assessments",
    canonical: `${BASE_URL}/assessments`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Self-Assessment Tools",
      "description": "23 research-backed assessments to map your identity, purpose, and spirit.",
      "url": `${BASE_URL}/assessments`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Three Maps. One Direction.</h1>
      <p><em>23 research-backed assessments to map your identity, purpose, and spirit. Start with Find Your Me. Everything else follows.</em></p>
    </header>

    <section>
      <h2>Core Assessments — Start Here</h2>

      <div class="principle">
        <h3><a href="${BASE_URL}/find-my">Find Your Me</a></h3>
        <p>A five-question mirror that reveals who you are — and routes you to the people, ideas, and practices that match. The entry point. Five dimensions of self-discovery that set the compass for everything that follows.</p>
      </div>

      <div class="principle">
        <h3><a href="${BASE_URL}/soulscore">SoulScore</a></h3>
        <p>Impact measurement platform. Quantify your contribution to regenerative vs. extractive systems. Understand where your energy, money, and attention actually go.</p>
      </div>

      <div class="principle">
        <h3><a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a></h3>
        <p>Five-domain readiness scoring — 0 to 100. Know before you go. The most rigorous pre-ceremony assessment available outside of a clinical setting.</p>
      </div>

      <div class="principle">
        <h3><a href="${BASE_URL}/assessments/dharma-finder">Dharma Finder</a></h3>
        <p>Twenty-five questions that reveal the work you were built for. Not what you're good at — what you were made to do.</p>
      </div>

      <div class="principle">
        <h3><a href="${BASE_URL}/assessments/consciousness-scale">Consciousness Scale</a></h3>
        <p>Map your current state of awareness across seven dimensions. Understand where you are and what's next.</p>
      </div>
    </section>

    <section>
      <h2>Finder Tools</h2>
      <ul>
        <li><a href="${BASE_URL}/find-your-therapy">Find Your Therapy</a> — Match to the right therapeutic modality</li>
        <li><a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a> — Peptide Clarity Index with use-case matching</li>
        <li><a href="${BASE_URL}/find-your-attachment-style">Find Your Attachment Style</a> — Relationship pattern mapping</li>
        <li><a href="${BASE_URL}/find-your-sleep">Find Your Sleep Protocol</a> — Personalized sleep optimization</li>
        <li><a href="${BASE_URL}/find-your-movement">Find Your Movement</a> — Match to the right physical practice</li>
        <li><a href="${BASE_URL}/find-your-diet">Find Your Diet</a> — Nutritional approach matching</li>
        <li><a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a> — Spiritual practice alignment</li>
        <li><a href="${BASE_URL}/find-your-sexuality">Find Your Sexuality</a> — Identity and expression exploration</li>
        <li><a href="${BASE_URL}/find-your-love-language">Find Your Love Language</a> — Relationship communication mapping</li>
        <li><a href="${BASE_URL}/find-your-sake">Find Your Sake</a> — Japanese sake style matching</li>
        <li><a href="${BASE_URL}/find-your-coffee">Find Your Coffee</a> — Coffee profile and sourcing match</li>
      </ul>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/find-my">Find Your Me</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/soulscore">SoulScore</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// FIND MY HUB
// ═══════════════════════════════════════════════════════════════
function renderFindMyHTML(): string {
  return wrapPage({
    title: "Find My — Self-Discovery Hub | Tony Greenberg",
    description: "Find My to Find Your We. A five-question mirror that reveals who you are — and routes you to the people, ideas, and practices that match. The entry point to 23 assessments.",
    keywords: "find my, self discovery, identity assessment, find your me, Tony Greenberg finder tools, personality assessment",
    canonical: `${BASE_URL}/find-my`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find My — Self-Discovery Hub",
      "description": "Find My to Find Your We. A five-question mirror that reveals who you are.",
      "url": `${BASE_URL}/find-my`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Find My to Find Your We</h1>
      <p><em>A five-question mirror that reveals who you are — and routes you to the people, ideas, and practices that match.</em></p>
    </header>

    <section>
      <p>The Find My system is built on a single premise: you cannot find your people until you find yourself. Start with the core assessment. Let it route you to the tools, practices, and communities that match where you actually are, not where you think you should be.</p>
      <p>Most self-discovery tools are built around what you want to become. Find My is built around what you already are. The difference matters. Aspiration is easy to fake. Pattern is harder to hide. The assessments in this system are designed to surface the pattern, not the aspiration.</p>
      <p>Tony Greenberg built Find My over 25 years of watching people make decisions that did not match who they actually were. The enterprise technology procurement work at RampRate revealed the same dynamic at the institutional level: organizations consistently made choices that reflected their stated identity rather than their operational reality. The gap between those two things is where most suffering lives. Find My is the personal version of closing that gap.</p>
    </section>

    <section>
      <h2>How It Works</h2>
      <p>Start with Find Your Me. Five questions. Three minutes. The result is a profile across five dimensions: how you process information, how you make decisions, how you relate to others, what energizes you, and what you are actually optimizing for. That profile routes you to the specific assessments, practices, and communities that match your actual operating system.</p>
      <p>Each assessment in the system is standalone. You can take them in any order. But they are designed to compound. The more you complete, the more precisely the system can route you to what you need. The goal is not a personality type. The goal is a map of where you are right now, accurate enough to navigate from.</p>
    </section>

    <section>
      <h2>Core Finder Tools</h2>
      <ul>
        <li><a href="${BASE_URL}/find-your-me">Find Your Me</a> — The entry point. Five dimensions of self-discovery.</li>
        <li><a href="${BASE_URL}/find-your-therapy">Find Your Therapy</a> — Match to the right therapeutic modality</li>
        <li><a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a> — Peptide Clarity Index with use-case matching</li>
        <li><a href="${BASE_URL}/find-your-attachment-style">Find Your Attachment Style</a> — Relationship pattern mapping</li>
        <li><a href="${BASE_URL}/find-your-sleep">Find Your Sleep Protocol</a></li>
        <li><a href="${BASE_URL}/find-your-movement">Find Your Movement</a></li>
        <li><a href="${BASE_URL}/find-your-diet">Find Your Diet</a></li>
        <li><a href="${BASE_URL}/find-your-spirit">Find Your Spirit</a></li>
        <li><a href="${BASE_URL}/find-your-sexuality">Find Your Sexuality</a></li>
        <li><a href="${BASE_URL}/find-your-love-language">Find Your Love Language</a></li>
        <li><a href="${BASE_URL}/find-your-sake">Find Your Sake</a></li>
        <li><a href="${BASE_URL}/find-your-coffee">Find Your Coffee</a></li>
        <li><a href="${BASE_URL}/find-your-style">Find Your Style</a></li>
        <li><a href="${BASE_URL}/find-your-kitchen">Find Your Kitchen</a></li>
        <li><a href="${BASE_URL}/find-your-journey">Find Your Journey</a></li>
      </ul>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/soulscore">SoulScore</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// IBOGA / IBOGAINE DEEP DIVE
// ═══════════════════════════════════════════════════════════════
function renderIbogaIbogaineHTML(): string {
  return wrapPage({
    title: "Iboga vs Ibogaine — Deep Dive | Psychedelic Readiness Index",
    description: "The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, cardiac risk, FDA status, and the most rigorous pre-treatment assessment available.",
    keywords: "iboga ibogaine, ibogaine treatment, ibogaine cardiac risk, Bwiti tradition, ibogaine FDA, ibogaine opioid addiction, ibogaine depression, iboga alkaloids, ibogaine clinical trials",
    canonical: `${BASE_URL}/iboga-ibogaine`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Iboga vs Ibogaine — Deep Dive",
      "description": "Comprehensive guide to iboga and ibogaine: pharmacology, safety, clinical evidence, and readiness assessment.",
      "url": `${BASE_URL}/iboga-ibogaine`,
      "author": { "@type": "Person", "name": "Tony Greenberg" },
      "about": [
        { "@type": "Drug", "name": "Ibogaine" },
        { "@type": "Thing", "name": "Iboga" },
        { "@type": "MedicalCondition", "name": "Opioid Use Disorder" }
      ],
      "specialty": "Psychiatry"
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}/psychedelic-readiness-index">&larr; Psychedelic Readiness Index</a></p>
      <h1>Iboga vs Ibogaine — Deep Dive</h1>
      <p><em>The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, cardiac risk, and FDA status.</em></p>
      <blockquote>NOT MEDICAL ADVICE. For educational purposes only. Ibogaine carries significant cardiac risk including QT prolongation and fatal arrhythmia. Both iboga and ibogaine are Schedule I controlled substances in the United States. Mandatory cardiac screening (EKG, electrolyte panel, liver function) is non-negotiable before any ibogaine treatment. Always consult qualified healthcare professionals and seek medically supervised treatment.</blockquote>
    </header>

    <section>
      <h2>The Core Distinction</h2>
      <p><strong>Iboga</strong> is the whole plant — <em>Tabernanthe iboga</em>, a shrub native to Central Africa, used for centuries in Bwiti initiation ceremonies. It contains 12+ alkaloids working in concert, with ibogaine as the primary psychoactive component.</p>
      <p><strong>Ibogaine</strong> is the isolated alkaloid — extracted and purified, used in clinical settings for addiction interruption, depression, and PTSD. The isolation changes the experience: more predictable, more measurable, less ceremonial.</p>
    </section>

    <section>
      <h2>Pharmacology</h2>
      <p>Ibogaine acts on multiple receptor systems simultaneously — NMDA antagonism, kappa opioid agonism, serotonin reuptake inhibition, and sigma receptor activity. This multi-target pharmacology is why it interrupts addiction at a neurobiological level that single-target drugs cannot reach.</p>
      <p>The primary metabolite, noribogaine, has a half-life of 24-72 hours and is responsible for much of the anti-addictive effect. It persists long after the acute experience ends.</p>
    </section>

    <section>
      <h2>Cardiac Risk — Non-Negotiable</h2>
      <p>Ibogaine prolongs the QT interval. This is the primary safety concern. Deaths have occurred from cardiac arrhythmia in unsupervised settings. Required pre-treatment screening: 12-lead EKG, electrolyte panel (potassium, magnesium), liver function tests, full medication review.</p>
      <p>Dangerous interactions: opioids, SSRIs, MAOIs, stimulants, antiarrhythmics, and many other medications. A complete medication washout protocol is required.</p>
    </section>

    <section>
      <h2>Clinical Evidence</h2>
      <p>FDA Breakthrough Therapy designation for opioid use disorder (MAPS, AtaiBeckley). Phase 2 trials showing 50-80% reduction in opioid withdrawal symptoms. Stanford TREAT trial results showing significant reduction in PTSD and depression in veterans. The evidence base is building rapidly.</p>
    </section>

    <section>
      <h2>Bwiti Tradition vs Clinical Protocol</h2>
      <p>In the Bwiti tradition of Gabon and Cameroon, iboga is used in multi-day initiation ceremonies — a death and rebirth experience, not a treatment. The ceremonial context, community support, and spiritual framework are considered inseparable from the medicine's efficacy.</p>
      <p>Clinical protocols strip the ceremony but add safety monitoring, medical screening, and integration support. Both approaches have merit. Neither is complete without the other's insights.</p>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/iboga-compass">Iboga Compass Assessment</a>
      <a href="${BASE_URL}/peyote-mescaline">Peyote &amp; Mescaline</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="https://impactsoul.is">ImpactSoul</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// PEPTIDE WATCH
// ═══════════════════════════════════════════════════════════════
function renderPeptideWatchHTML(): string {
  return wrapPage({
    title: "PeptideWatch — The Definitive Consumer Safety Guide",
    description: "PeptideWatch is the consumer organization the peptide market needs. Vendor audits, supply chain transparency, enforcement tracking, and the Hall of Shame. Research-backed. Unapologetic.",
    keywords: "peptide watch, peptide safety, peptide vendors, peptide supply chain, BPC-157, TB-500, peptide FDA, peptide consumer guide, peptide hall of shame",
    canonical: `${BASE_URL}/peptide-watch`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "PeptideWatch — Consumer Safety Guide",
      "description": "The definitive consumer safety guide for the peptide market.",
      "url": `${BASE_URL}/peptide-watch`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>PeptideWatch: The Consumer Organization This Market Needs</h1>
      <p><em>The peptide market is $50B and largely unregulated. Most vendors are selling research chemicals to humans with no clinical oversight. PeptideWatch exists to change that.</em></p>
    </header>

    <section>
      <h2>What PeptideWatch Does</h2>
      <p>We audit peptide vendors on six clinical criteria: third-party testing, Certificate of Analysis availability, manufacturing standards, customer transparency, pricing integrity, and enforcement history. The results are not what the market wants to hear.</p>
    </section>

    <section>
      <h2>The Six-Layer Transparency Framework</h2>
      <p><strong>Layer 1 — Source Verification:</strong> Where does the raw material come from? China? India? Domestic synthesis? The supply chain matters.</p>
      <p><strong>Layer 2 — Manufacturing Standards:</strong> GMP compliance, clean room standards, sterility testing. Most vendors skip this entirely.</p>
      <p><strong>Layer 3 — Third-Party Testing:</strong> HPLC purity testing, mass spectrometry confirmation, endotoxin testing. Non-negotiable for anything injected.</p>
      <p><strong>Layer 4 — Certificate of Analysis:</strong> Is the COA real? Dated? From an accredited lab? We verify.</p>
      <p><strong>Layer 5 — Pricing Integrity:</strong> Is the price consistent with actual manufacturing costs? Extreme discounting is a red flag.</p>
      <p><strong>Layer 6 — Enforcement History:</strong> FDA warning letters, FTC actions, state enforcement. We track it all.</p>
    </section>

    <section>
      <h2>Key Resources</h2>
      <ul>
        <li><a href="${BASE_URL}/peptide-hall-of-shame">Hall of Shame</a> — Documented vendor enforcement actions and failures</li>
        <li><a href="${BASE_URL}/peptide-supply-chain">Supply Chain Guide</a> — Where does your peptide dollar go?</li>
        <li><a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a> — Interactive peptide finder with use-case matching</li>
        <li><a href="${BASE_URL}/peptide-matrix">Peptide Matrix</a> — Comprehensive peptide comparison tool</li>
      </ul>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
      <a href="${BASE_URL}/peptide-hall-of-shame">Hall of Shame</a>
      <a href="${BASE_URL}/peptide-supply-chain">Supply Chain</a>
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// SPIRITS (Wine, Sake, Mezcal, Tequila)
// ═══════════════════════════════════════════════════════════════
function renderSpiritsHTML(): string {
  return wrapPage({
    title: "Wine, Sake, Spirits & Mezcal | Tony Greenberg",
    description: "Tony's liquid obsessions — mezcal, tequila, sake, and wine. Deep dives, curated collections, and the philosophy behind what's worth drinking. The Extraordinary Value Index. The Extraordinary Experience Index.",
    keywords: "mezcal, tequila, sake, wine, spirits guide, SoulSmoke mezcal, LiquidSun tequila, extraordinary value index, agave spirits, Tony Greenberg spirits",
    canonical: `${BASE_URL}/spirits`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Wine, Sake, Spirits & Mezcal",
      "description": "Tony Greenberg's liquid obsessions — mezcal, tequila, sake, and wine.",
      "url": `${BASE_URL}/spirits`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Liquid Obsessions</h1>
      <p><em>Mezcal is not a drink. It's a conversation between fire, earth, and the hands that refuse to let either be ordinary. Every bottle is a biography of a specific agave, a specific mezcalero, a specific patch of Oaxacan soil.</em></p>
    </header>

    <section>
      <h2>Mezcal — The Alchemy of Agave</h2>
      <p>Wild agave varieties — Tobalá, Tepeztate, Jabalí, Cuishe. Clay pot distillation vs. copper. The Extraordinary Value Index (EVI) — maximum soul per dollar. The Extraordinary Experience Index (EEI) — bottles that stop time. Ancestral process — six stages, centuries of wisdom.</p>
      <p>We're here for the bottles that give your palate an existential crisis, tell stories you wouldn't believe, and feel like a rupture in the matrix of mass-produced spirits.</p>
      <p><a href="https://mezcalagave-ahru9fq8.manus.space">Explore SoulSmoke — The Miracle of Mezcal &rarr;</a></p>
    </section>

    <section>
      <h2>Tequila — The Politics of Agave</h2>
      <p>Tequila is mezcal's more famous, more regulated, more politically complicated cousin. The additive scandal. The NOM system. The difference between a $15 mixto and a $200 extra añejo. We cut through the marketing.</p>
      <p><a href="https://liquidsunsunrise-ynz0.manus.space">Explore LiquidSun — Tequila Intelligence &rarr;</a></p>
    </section>

    <section>
      <h2>Sake — The Living Beverage</h2>
      <p>Sake is alive in a way that most beverages aren't. The koji mold, the parallel fermentation, the terroir of rice and water. Junmai Daiginjo vs. Honjozo. The difference between a sake that opens up and one that closes down. <a href="${BASE_URL}/find-your-sake">Find your sake style &rarr;</a></p>
    </section>

    <section>
      <h2>Wine — The Long Game</h2>
      <p>Natural wine. Biodynamic viticulture. The difference between a wine that's alive and one that's been engineered. We're interested in the former.</p>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/find-your-sake">Find Your Sake</a>
      <a href="${BASE_URL}/brewsoul">BrewSoul Coffee</a>
      <a href="${BASE_URL}/kava">Kava Intelligence</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// ECOSYSTEM MAP
// ═══════════════════════════════════════════════════════════════
function renderEcosystemMapHTML(): string {
  return wrapPage({
    title: "Ecosystem Map — Your Journey Through Tony Greenberg's Work",
    description: "Start with the core assessments that map your inner landscape. These create the baseline everything else builds on. Who are you when nobody's watching? How deep does the rabbit hole go?",
    keywords: "Tony Greenberg ecosystem, self discovery journey, assessments map, psychedelic readiness, soulscore, dharma finder, consciousness scale",
    canonical: `${BASE_URL}/ecosystem-map`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Ecosystem Map",
      "description": "Your journey through Tony Greenberg's work — assessments, essays, and tools.",
      "url": `${BASE_URL}/ecosystem-map`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Your Journey Through the Work</h1>
      <p><em>Who are you when nobody's watching? How deep does the rabbit hole go? Start with the core assessments that map your inner landscape.</em></p>
    </header>

    <section>
      <h2>Layer 1 — Core Assessments</h2>
      <p>The entry point. Five dimensions of self-discovery that set the compass for everything that follows.</p>
      <ul>
        <li><a href="${BASE_URL}/find-my">Find Your Me</a> — The entry point. Five dimensions of self-discovery.</li>
        <li><a href="${BASE_URL}/life-assessment">Life Assessment — The Mirror</a> — Eighteen questions mapping where you actually are in life.</li>
        <li><a href="${BASE_URL}/assessments/dharma-finder">Dharma Finder</a> — Twenty-five questions that reveal the work you were built for.</li>
        <li><a href="${BASE_URL}/soulscore">SoulScore</a> — Impact measurement platform.</li>
        <li><a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a> — Five-domain readiness scoring.</li>
      </ul>
    </section>

    <section>
      <h2>Layer 2 — Specialized Finders</h2>
      <ul>
        <li><a href="${BASE_URL}/find-your-therapy">Find Your Therapy</a></li>
        <li><a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a></li>
        <li><a href="${BASE_URL}/find-your-attachment-style">Find Your Attachment Style</a></li>
        <li><a href="${BASE_URL}/find-your-sleep">Find Your Sleep Protocol</a></li>
        <li><a href="${BASE_URL}/find-your-movement">Find Your Movement</a></li>
      </ul>
    </section>

    <section>
      <h2>Layer 3 — Deep Dives</h2>
      <ul>
        <li><a href="${BASE_URL}/iboga-ibogaine">Iboga vs Ibogaine</a> — Full pharmacology and safety guide</li>
        <li><a href="${BASE_URL}/peptide-watch">PeptideWatch</a> — Consumer safety guide</li>
        <li><a href="${BASE_URL}/kava">Kava Intelligence</a> — The threshold essence</li>
        <li><a href="${BASE_URL}/blog">118+ Essays</a> — The full archive</li>
      </ul>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/assessments">All Assessments</a>
      <a href="${BASE_URL}/seven-doors">The Seven Doors</a>
      <a href="${BASE_URL}/blog">Essays</a>
      <a href="${BASE_URL}/about">About Tony</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// KAVA HUB
// ═══════════════════════════════════════════════════════════════
function renderKavaHTML(): string {
  return wrapPage({
    title: "Kava: The Threshold Essence | Tony Greenberg",
    description: "The definitive framework for kava as the preparation medicine — positioned between ordinary consciousness and psychedelic engagement. Science-grounded. Culturally respectful. Board-level credibility.",
    keywords: "kava, kava science, kavalactones, kava safety, kava drug interactions, kava Hawaii, kava psychedelic preparation, threshold medicine, kava certification",
    canonical: `${BASE_URL}/kava`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Kava: The Threshold Essence",
      "description": "The definitive framework for kava as the preparation medicine.",
      "url": `${BASE_URL}/kava`,
      "author": { "@type": "Person", "name": "Tony Greenberg" }
    },
    body: `
  <article>
    <header>
      <p><a href="${BASE_URL}">&larr; Tony Greenberg</a></p>
      <h1>Kava: The Threshold Essence</h1>
      <p><em>The definitive framework for kava as the preparation medicine — positioned between ordinary consciousness and psychedelic engagement. Science-grounded. Culturally respectful. Board-level credibility.</em></p>
    </header>

    <section>
      <h2>Why Kava Matters Now</h2>
      <div class="stat"><strong>$2.0B</strong> Global kava market 2025</div>
      <div class="stat"><strong>400+</strong> US kava bars</div>
      <div class="stat"><strong>3,000+</strong> Years of continuous use</div>
      <div class="stat"><strong>96%</strong> Activity from 6 kavalactones</div>
      <p>Kava is having a moment. But most of the conversation is missing the point. Kava is not a relaxation supplement. It's a threshold medicine — a preparation tool for deeper work, a community connector, and a 3,000-year-old technology for navigating altered states safely.</p>
    </section>

    <section>
      <h2>The Kava Intelligence Modules</h2>
      <ul>
        <li><a href="${BASE_URL}/kava/origins">Island Origins</a> — 3,000 years across the Pacific — Vanuatu to Hawaii</li>
        <li><a href="${BASE_URL}/kava/interactions">Drug Interactions</a> — 24 substances screened with CYP450 severity matrix</li>
        <li><a href="${BASE_URL}/kava/science">Kavalactone Science</a> — 6 major compounds, chemotype decoder, cultivar data</li>
        <li><a href="${BASE_URL}/kava/assessment">PRI Assessment</a> — 5-domain readiness scoring — 0 to 100</li>
        <li><a href="${BASE_URL}/kava/hawaii">Hawaii ICE Crisis</a> — The 'awa bowl as a way home from meth devastation</li>
        <li><a href="${BASE_URL}/kava/myths">Myths Debunked</a> — 7 myths examined with evidence and verdicts</li>
        <li><a href="${BASE_URL}/kava/caffeine">Caffeine Interactions</a> — CYP1A2 inhibition — why coffee hits different with kava</li>
        <li><a href="${BASE_URL}/kava/products">Product Index</a> — Ceremonial powders, RTDs, supplements, kava bars</li>
        <li><a href="${BASE_URL}/kava/certification">Facilitator Certification</a> — 12-module course for PRI threshold facilitators</li>
      </ul>
    </section>

    <nav class="nav-links">
      <a href="${BASE_URL}/psychedelic-readiness-index">Psychedelic Readiness Index</a>
      <a href="${BASE_URL}/iboga-ibogaine">Iboga &amp; Ibogaine</a>
      <a href="${BASE_URL}/find-your-peptide">Find Your Peptide</a>
      <a href="${BASE_URL}/blog">Essays</a>
    </nav>
  </article>`
  });
}

// ═══════════════════════════════════════════════════════════════
// Map of paths to render functions
// ═══════════════════════════════════════════════════════════════
const SSR_PAGES: Record<string, () => string> = {
  "/": renderHomepageHTML,
  "/about": renderAboutHTML,
  "/humanos": renderHumanosHTML,
  "/humanos/philosophy": renderHumanosPhilosophyHTML,
  "/living-declaration": renderLivingDeclarationHTML,
  "/brewsoul": renderBrewSoulHTML,
  "/blog": renderBlogIndexHTML,
  "/essays": renderBlogIndexHTML,
  // New SSR pages — Phase 2 indexing expansion
  "/seven-doors": renderSevenDoorsHTML,
  "/walk-through": renderSevenDoorsHTML,
  "/start-here": renderStartHereHTML,
  "/assessments": renderAssessmentsHTML,
  "/find-my": renderFindMyHTML,
  "/iboga-ibogaine": renderIbogaIbogaineHTML,
  "/peptide-watch": renderPeptideWatchHTML,
  "/spirits": renderSpiritsHTML,
  "/ecosystem-map": renderEcosystemMapHTML,
  "/kava": renderKavaHTML,
};

/**
 * Check if a path has SSR content available
 */
export function hasSSRPage(path: string): boolean {
  const cleaned = path.replace(/\/$/, "") || "/";
  return cleaned in SSR_PAGES;
}

/**
 * Render SSR HTML for a given path. Returns null if not found.
 */
export function renderSSRPage(path: string): string | null {
  const cleaned = path.replace(/\/$/, "") || "/";
  const renderer = SSR_PAGES[cleaned];
  if (!renderer) return null;
  return renderer();
}
